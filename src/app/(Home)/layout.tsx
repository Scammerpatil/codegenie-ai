"use client";
import Navbar from "@/components/Navbar";
import "../globals.css";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";
import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const verifyIsLoggedIn = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/middleware-verify-token", {
        withCredentials: true,
      });
      if (res.status === 200) {
        router.push("/user/dashboard");
      }
    } catch (error) {
      console.log("User is not logged in");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyIsLoggedIn();
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
      <body className={`orbitron antialiased`}>
        {loading ? (
          <Loading />
        ) : (
          <>
            <Navbar />
            <Toaster />
            {children}
            <Footer />
            {router.back && (
              <div className="fab">
                <button
                  className="btn btn-lg btn-circle btn-primary"
                  title="Go Back"
                  onClick={() => {
                    router.back();
                  }}
                >
                  <IconArrowLeft size={28} />
                </button>
              </div>
            )}
          </>
        )}
      </body>
    </html>
  );
}
