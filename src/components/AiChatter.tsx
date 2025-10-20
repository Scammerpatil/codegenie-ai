"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  IconSend,
  IconBrandGithubCopilot,
  IconMicrophone,
  IconPlayerStop,
} from "@tabler/icons-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import Markdown from "react-markdown";

type Message = { role: "user" | "assistant"; text: string; id?: string };

const AiChatter = ({
  setIsSidebarOpen,
  isSidebarOpen,
}: {
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSidebarOpen: boolean;
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const uploadAbortRef = useRef<AbortController | null>(null);

  const pushMessage = (msg: Message) => {
    setMessages((prev) => [
      ...prev,
      { ...msg, id: `${Date.now()}-${Math.random()}` },
    ]);
  };

  // Request mic permission and prepare MediaRecorder
  const ensureMediaRecorder = async (): Promise<boolean> => {
    try {
      if (mediaRecorderRef.current && streamRef.current) return true;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const options: MediaRecorderOptions = {};
      if (
        MediaRecorder.isTypeSupported &&
        MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ) {
        options.mimeType = "audio/webm;codecs=opus";
      } else if (
        MediaRecorder.isTypeSupported &&
        MediaRecorder.isTypeSupported("audio/webm")
      ) {
        options.mimeType = "audio/webm";
      }

      const recorder = new MediaRecorder(stream, options);
      recorder.ondataavailable = (e: BlobEvent) => {
        if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.onerror = (ev) => {
        console.error("MediaRecorder error:", ev);
        toast.error("Microphone recording error");
        stopRecordingCleanup();
      };
      recorder.onstart = () => {
        audioChunksRef.current = [];
        setRecording(true);
        toast("Recording started", { icon: "🎙️" });
      };
      recorder.onstop = () => {
        setRecording(false);
        toast.dismiss();
      };

      mediaRecorderRef.current = recorder;
      return true;
    } catch (err: any) {
      console.error("getUserMedia error:", err);
      toast.error(
        "Microphone access denied or unavailable. Make sure permission is granted and you're using HTTPS/Electron."
      );
      return false;
    }
  };

  const startRecording = async () => {
    const ok = await ensureMediaRecorder();
    if (!ok || !mediaRecorderRef.current) return;
    try {
      audioChunksRef.current = [];
      mediaRecorderRef.current.start();
    } catch (err) {
      console.error("startRecording error:", err);
      toast.error("Failed to start recording");
    }
  };

  const stopRecordingAndTranscribe = async () => {
    if (!mediaRecorderRef.current) return;

    try {
      mediaRecorderRef.current.stop();
      await new Promise((r) => setTimeout(r, 150));

      const blob = new Blob(audioChunksRef.current, {
        type: mediaRecorderRef.current?.mimeType || "audio/webm",
      });
      audioChunksRef.current = [];

      await sendAudioForTranscription(blob);
    } catch (err) {
      console.error("stopRecordingAndTranscribe error:", err);
      toast.error("Failed to stop/submit recording");
    } finally {
      stopRecordingCleanup();
    }
  };

  const stopRecordingCleanup = () => {
    try {
      mediaRecorderRef.current = null;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      audioChunksRef.current = [];
      setRecording(false);
    } catch (err) {
      console.warn("cleanup error", err);
    }
  };

  const sendAudioForTranscription = async (blob: Blob) => {
    setLoading(true);
    uploadAbortRef.current = new AbortController();

    try {
      const fd = new FormData();
      fd.append("file", blob, "recording.webm");

      const res = await axios.post("/api/transcribe", fd, {
        headers: { "Content-Type": "multipart/form-data" },
        signal: uploadAbortRef.current.signal as any,
      });

      const text: string = res.data?.text ?? "";

      if (!text) {
        toast.error("No transcription returned");
        setLoading(false);
        return;
      }

      pushMessage({ role: "user", text });

      await askAi(text);
    } catch (err: any) {
      if (axios.isCancel(err)) {
        toast("Upload canceled");
      } else {
        console.error("Transcription upload error", err);
        toast.error("Transcription failed");
      }
    } finally {
      setLoading(false);
      uploadAbortRef.current = null;
    }
  };

  const askAi = async (text: string) => {
    setLoading(true);
    try {
      const res = await axios.post("/api/code/gemini", { input: text });
      const aiText: string =
        res.data?.output ?? "Sorry, I couldn't get an answer.";
      pushMessage({ role: "assistant", text: aiText });

      try {
        if ("speechSynthesis" in window) {
          const utter = new SpeechSynthesisUtterance(aiText);
          utter.lang = "en-US";
          utter.rate = 1;
          speechSynthesis.speak(utter);
        }
      } catch (ttsErr) {
        console.warn("TTS error", ttsErr);
      }
    } catch (err) {
      console.error("AI request error:", err);
      toast.error("AI request failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");
    pushMessage({ role: "user", text });
    await askAi(text);
  };

  const handleRecordToggle = async () => {
    if (recording) {
      await stopRecordingAndTranscribe();
    } else {
      await startRecording();
    }
  };

  useEffect(() => {
    return () => {
      if (uploadAbortRef.current) uploadAbortRef.current.abort();
      stopRecordingCleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col h-full bg-base-200 border-l border-base-300">
      {/* Header */}
      <div
        className="p-4 border-b border-t border-base-content flex items-center gap-3 bg-base-300"
        role="banner"
      >
        <IconBrandGithubCopilot size={22} className="text-primary" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold">CodeGenie AI Assistant</h3>
          <p className="text-xs text-base-content/70">
            Ask about code, fix bugs, or get explanations.
          </p>
        </div>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="Close assistant"
        >
          Close
        </button>
      </div>

      {messages.length === 0 && !loading && (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          {" "}
          <IconBrandGithubCopilot
            size={48}
            className="mb-4 text-base-content"
          />{" "}
          <h1 className="text-2xl font-semibold mb-2 text-center">
            {" "}
            Hello {user?.name || "User"}! How can I assist you today?{" "}
          </h1>{" "}
          <p className="text-center text-base-content">
            {" "}
            Welcome to CodeGenie AI Assistant! Ask me anything related to code,
            and I'll do my best to help you.{" "}
          </p>{" "}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`chat ${m.role === "user" ? "chat-end" : "chat-start"}`}
          >
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img
                  alt={m.role === "user" ? "You" : "AI"}
                  src={
                    m.role === "user"
                      ? user?.profileImage ?? "/avatar.png"
                      : "/bot-avatar.jpg"
                  }
                />
              </div>
            </div>
            <div
              className={`chat-bubble max-w-[80%] ${
                m.role === "user"
                  ? "bg-primary text-primary-content"
                  : "bg-base-300 text-base-content"
              }`}
            >
              <Markdown>{m.text}</Markdown>
            </div>
          </div>
        ))}

        {loading && (
          <div className="chat chat-start">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img alt="AI" src="/bot-avatar.jpg" />
              </div>
            </div>
            <div className="chat-bubble bg-base-300">
              <span className="loading loading-dots loading-md"></span>
            </div>
          </div>
        )}
      </div>

      {/* Input / Controls */}
      <div className="p-3 border-t border-base-content bg-base-300">
        <div className="join w-full">
          <input
            className="input input-bordered input-primary w-full join-item"
            placeholder="Type a question or press the mic to record"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            aria-label="Message input"
          />

          <button
            onClick={handleRecordToggle}
            className={`btn ${
              recording ? "btn-error" : "btn-accent"
            } join-item`}
            title={recording ? "Stop recording" : "Start recording"}
            aria-pressed={recording}
          >
            {recording ? (
              <IconPlayerStop size={18} />
            ) : (
              <IconMicrophone size={18} />
            )}
          </button>

          <button
            onClick={handleSend}
            className="btn btn-primary join-item"
            disabled={loading}
          >
            <IconSend size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiChatter;
