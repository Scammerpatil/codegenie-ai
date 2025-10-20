"use client";

import Loading from "@/components/Loading";
import Title from "@/components/Title";
import { useAuth } from "@/context/AuthContext";
import { IconAi, IconBug, IconCode } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const codingQuotes = [
  "Talk is cheap. Show me the code. — Linus Torvalds",
  "Programming isn't about what you know; it's about what you can figure out. — Chris Pine",
  "In order to be irreplaceable, one must always be different. — Coco Chanel (applies to coding too)",
  "Simplicity is the soul of efficiency. — Austin Freeman",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand. — Martin Fowler",
  "First, solve the problem. Then, write the code. — John Johnson",
  "Experience is the name everyone gives to their mistakes. — Oscar Wilde",
  "When in doubt, use brute force. — Ken Thompson",
  "It's not a bug, it's an undocumented feature. — Anonymous",
  "Code is like humor. When you have to explain it, it’s bad. — Cory House",
];

interface DashboardData {
  usageData: {
    day: string;
    codeRuns: number;
    aiQueries: number;
    errorsDetected: number;
    voiceInteractions: number;
  }[];
  languageUsage: {
    name: string;
    value: number;
  }[];
  totalVoiceInteractions: number;
  totalCodeRuns: number;
  totalAiQueries: number;
  totalErrorsDetected: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const fetchDashboardData = async () => {
    try {
      const response = await axios.get("/api/helper/dashboard");
      setDashboardData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };
  useEffect(() => {
    fetchDashboardData();
  }, []);
  if (!user) return <Loading />;
  return (
    <>
      <Title
        title={`Welcome, ${user.name} 👋`}
        subtitle={codingQuotes[Math.floor(Math.random() * codingQuotes.length)]}
      />

      <div className="space-y-8">
        <div className="stats shadow w-full bg-base-200 ">
          <div className="stat">
            <div className="stat-figure text-primary">
              <IconCode size={32} />
            </div>
            <div className="stat-title">Code Runs</div>
            <div className="stat-value text-primary">
              {dashboardData?.totalCodeRuns || 0}
            </div>
            <div className="stat-desc">↗︎ 14% more than last week</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <IconAi size={32} />
            </div>
            <div className="stat-title">AI Queries</div>
            <div className="stat-value text-secondary">
              {dashboardData?.totalAiQueries || 0}
            </div>
            <div className="stat-desc">↗︎ 8% growth</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-error">
              <IconBug size={32} />
            </div>
            <div className="stat-title">Errors Detected</div>
            <div className="stat-value text-error">
              {dashboardData?.totalErrorsDetected || 0}
            </div>
            <div className="stat-desc">↘︎ 5% fewer than last week</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-accent">
              <div className="avatar avatar-online">
                <div className="w-16 rounded-full">
                  <img src={user.profileImage} />
                </div>
              </div>
            </div>
            <div className="stat-title">Voice Interactions</div>
            <div className="stat-value text-accent">
              {dashboardData?.totalVoiceInteractions || 0}
            </div>
            <div className="stat-desc">↗︎ 11% increase</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* LINE CHART */}
          <div className="card bg-base-200 shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 uppercase text-center">
              Weekly Activity Overview
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardData?.usageData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="codeRuns"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  name="Code Runs"
                />
                <Line
                  type="monotone"
                  dataKey="aiQueries"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  name="AI Queries"
                />
                <Line
                  type="monotone"
                  dataKey="errorsDetected"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Errors Detected"
                />
                <Line
                  type="monotone"
                  dataKey="voiceInteractions"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Voice Interactions"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* BAR CHART */}
          <div className="card bg-base-200 shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-center uppercase">
              Language Usage
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData?.languageUsage || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill="var(--color-primary)"
                  name="Usage Count"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}
