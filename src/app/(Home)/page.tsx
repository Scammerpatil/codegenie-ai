"use client";
import {
  IconAi,
  IconCircleChevronRight,
  IconCode,
  IconError404,
  IconGraph,
  IconMailOpened,
  IconRocket,
  IconTrophy,
  IconUserCode,
  IconUsers,
} from "@tabler/icons-react";
import CountUp from "react-countup";
import React from "react";

export default function HomePage() {
  return (
    <>
      {/* ===== Hero Section ===== */}
      <section className="hero min-h-screen bg-base-300 text-base-content backdrop-blur-lg border-b">
        <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
          <div className="mr-auto place-self-center lg:col-span-7">
            <h1 className="max-w-2xl mb-4 text-4xl text-base-content font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl">
              Welcome to <span className="text-accent">CodeGenie-AI</span>
            </h1>
            <p className="max-w-2xl mb-6 font-light text-base-content/70 lg:mb-8 md:text-lg lg:text-xl">
              The futuristic hub for coding enthusiasts! Dive into a world of{" "}
              <span className="text-primary font-bold">
                coding competitions, hackathons, and collaborative projects
              </span>
              . Connect. Compete. Grow. 🚀 One Platform. Infinite Opportunities.{" "}
              <br />
              <strong>Join us today!</strong>
            </p>
            <a
              href="/explore-platform"
              className="btn btn-primary text-base font-medium text-center rounded-lg mr-4"
            >
              Explore Platform
              <IconCircleChevronRight />
            </a>
            <a
              href="/register"
              className="btn btn-outline text-base font-medium text-center rounded-lg mr-4"
            >
              Get Started for Free
            </a>
          </div>
          <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
            <img src="/background-image.png" alt="hero image" />
          </div>
        </div>
      </section>

      {/* ===== About Section ===== */}
      <section
        className="w-full py-20 px-6 md:px-16 bg-base-200 min-h-screen"
        id="about"
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-primary">
            About CodeGenie-AI
          </h2>
          <p className="mt-6 text-lg opacity-80 poppins">
            CodeGenie-AI is a next-generation desktop IDE that merges AI-driven
            intelligence with custom compiler technology. Designed for
            <span className="text-accent">
              {" "}
              Python, C, C++, Java, and JavaScript,
            </span>{" "}
            it provides real-time error detection, voice-enabled interaction,
            and AI-powered code assistance — all in one platform.
            <span className="text-secondary font-semibold">
              we’ve got it all
            </span>
            .
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-10 mt-16 max-w-6xl mx-auto">
          <div className="mt-12 max-w-4xl mx-auto bg-base-100 p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <IconUsers className="text-4xl text-primary mr-4" />
              <h3 className="text-2xl font-bold">For New Users</h3>
            </div>
            <p className="opacity-80">
              Whether you’re a beginner or a seasoned coder, CodeGenie-AI
              simplifies your coding journey with AI-powered tools and an
              intuitive interface.
            </p>
          </div>
          <div className="mt-12 max-w-4xl mx-auto bg-base-100 p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <IconUserCode className="text-4xl text-secondary mr-4" />
              <h3 className="text-2xl font-bold">For Professionals</h3>
            </div>
            <p className="opacity-80">
              CodeGenie-AI empowers professionals with advanced tools for
              seamless coding, collaboration, and project management.
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-4 gap-10 mt-16 max-w-6xl mx-auto">
          {[
            {
              icon: <IconCode className="text-4xl text-primary" size={40} />,
              number: 5,
              title: "Languages",
              description: "C, C++, Java, Python, JS",
            },
            {
              icon: <IconUsers className="text-4xl text-secondary" size={40} />,
              number: 5000,
              title: "Active Users",
              description: "Developers worldwide",
            },
            {
              icon: <IconAi className="text-4xl text-secondary" size={40} />,
              number: 7,
              title: "AI Features",
              description: "Codegen, Debugging, Voice I/O, etc.",
            },
            {
              icon: <IconTrophy className="text-4xl text-accent" size={40} />,
              number: 1000,
              title: "Code",
              description: "Everyday tasks automated.",
            },
          ].map((stat, index) => (
            <div key={index} className="bg-base-100 p-6 rounded-lg shadow-lg">
              <div className="mb-4 flex items-center justify-center">
                {stat.icon}
              </div>
              <h4 className="text-xl font-bold">
                <CountUp start={0} end={stat.number} duration={10} />+{" "}
                {stat.title}
              </h4>
              <p className="mt-2 opacity-80">{stat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Features Section ===== */}
      <section id="features" className="py-20 bg-base-300">
        <h2 className="text-4xl font-bold text-center mb-12 text-primary">
          Core Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-20">
          <div className="card bg-base-100 shadow-xl hover:shadow-2xl border border-primary hover:scale-105 transition">
            <div className="card-body items-center">
              <IconRocket className="text-5xl text-primary mb-4" size={30} />
              <h3 className="card-title text-lg">AI Code Generation</h3>
              <p className="opacity-70">
                Generate optimized code snippets and solutions powered by AI
                models trained for multiple languages.
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl hover:shadow-2xl border border-secondary hover:scale-105 transition">
            <div className="card-body items-center">
              <IconError404
                className="text-5xl text-secondary mb-4"
                size={30}
              />
              <h3 className="card-title text-lg">Real-time Error Detection</h3>
              <p className="opacity-70">
                Instantly analyze and highlight syntax or logical errors across
                supported languages without execution.
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl hover:shadow-2xl border border-accent hover:scale-105 transition">
            <div className="card-body items-center">
              <IconTrophy className="text-5xl text-accent mb-4" size={30} />
              <h3 className="card-title text-lg">Voice Input & Output</h3>
              <p className="opacity-70">
                Interact with your IDE using speech commands and receive
                real-time verbal feedback and code explanations.
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl hover:shadow-2xl border border-primary hover:scale-105 transition">
            <div className="card-body items-center">
              <IconGraph className="text-5xl text-primary mb-4" size={30} />
              <h3 className="card-title text-lg">AI Chat Assistant</h3>
              <p className="opacity-70">
                Debug, learn, and explore coding best practices through a
                conversational AI integrated within your workspace.
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl hover:shadow-2xl border border-secondary hover:scale-105 transition">
            <div className="card-body items-center">
              <IconRocket className="text-5xl text-secondary mb-4" size={30} />
              <h3 className="card-title text-lg">Custom Compiler</h3>
              <p className="opacity-70">
                Experience lightning-fast compilation and analysis with a
                custom-built compiler supporting five languages.
              </p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl hover:shadow-2xl border border-accent hover:scale-105 transition">
            <div className="card-body items-center">
              <IconUsers className="text-5xl text-accent mb-4" size={30} />
              <h3 className="card-title text-lg">Integrated Console</h3>
              <p className="opacity-70">
                Execute your code instantly within the app using a built-in
                console — no need for external terminals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Contact Section ===== */}
      <section className="w-full py-20 px-6 md:px-20 bg-base-200" id="contact">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-primary">Contact Us</h2>
          <p className="mt-4 opacity-80">
            Have questions or want to collaborate? Drop us a message below 👇
          </p>

          <form className="mt-8 grid gap-6">
            <input
              type="text"
              placeholder="Your Name"
              className="input input-bordered w-full bg-base-100"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="input input-bordered w-full bg-base-100"
            />
            <textarea
              placeholder="Your Message"
              className="textarea textarea-bordered w-full bg-base-100 h-32"
            ></textarea>
            <button className="btn btn-accent w-full btn-lg">
              <IconMailOpened className="mr-2" /> Send Message
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
