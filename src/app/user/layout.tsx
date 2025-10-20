"use client";
import axios from "axios";
import "../globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import SideNav from "./SideNav";

const Component = ({ children }: { children: React.ReactNode }) => {
  const { setUser } = useAuth();
  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.get("/api/auth/verifytoken", {
        withCredentials: true,
      });
      if (response.data) {
        setUser(response.data.user);
      }
    };
    fetchUser();
  }, []);
  return (
    <html lang="en">
      <head>
        <title>
          CodeGenie AI | Empowering developers with intelligent coding — faster,
          smarter, and effortless.
        </title>
        <meta
          name="description"
          content="CodeGenie AI — an advanced AI-powered coding platform for Python, Java, C, C++, and JavaScript. Experience real-time error detection, code explanation, and voice-enabled AI assistance with a custom compiler and syntax highlighting. Build, debug, and learn code smarter with CodeGensis-AI."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&family=Outfit:wght@100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`antialiased Orbitron`}>
        <div className="absolute top-0 left-0 right-0 z-50">
          <Toaster />
        </div>
        <SideNav className="poppins z-0">{children}</SideNav>
      </body>
    </html>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <Component>{children}</Component>
    </AuthProvider>
  );
}
