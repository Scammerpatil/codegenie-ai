"use client";
import { SIDENAV_ITEMS } from "./constant";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { IconChevronRight } from "@tabler/icons-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import ThemeToggler from "@/components/Navbar/ThemeToggler";
import { SideNavItem, User } from "@/Types";
import AiChatter from "@/components/AiChatter";

const SideNav = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const router = useRouter();
  const { user } = useAuth() as { user: User };
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleLogout = async () => {
    toast.promise(axios.get("/api/auth/logout", { withCredentials: true }), {
      loading: "Logging out...",
      success: () => {
        router.push("/");
        return "Logged out successfully";
      },
      error: "Error logging out",
    });
  };
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);
  if (!user) return null;

  return (
    <>
      <div className="flex max-h-screen">
        {/* Sidebar */}
        <div className="w-16 bg-base-200 text-base-content flex flex-col justify-start min-h-full p-4">
          <Link href={`/user/dashboard`} className="w-full">
            <img className="w-8" src="/logo.png" alt="logo" />
            <hr className="mt-1 border w-full" />
          </Link>
          <div className="flex flex-col space-y-8 mt-10">
            {SIDENAV_ITEMS.map((item, idx) => (
              <MenuItem
                key={idx}
                item={item}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
              />
            ))}
          </div>
        </div>

        {/* Main content */}
        <div
          className={`flex-1 ${className} overflow-y-auto h-screen bg-base-100 text-base-content z-0`}
        >
          <div className="navbar justify-between bg-base-300 w-full pl-10">
            <div className="lg:flex items-center justify-end space-x-2 hidden text-base-content">
              <span className="text-base font-semibold">Home</span>
              {pathSegments.map((segment, index) => (
                <React.Fragment key={index}>
                  <span className="text-sm">
                    <IconChevronRight />
                  </span>
                  <span className="text-base capitalize hover:text-primary transition">
                    {decodeURIComponent(segment.replace(/-/g, " "))}
                  </span>
                </React.Fragment>
              ))}
            </div>
            <div className="flex flex-row gap-3 items-center pr-10">
              <ThemeToggler />
              <div className="dropdown dropdown-end cursor-pointer bg-transparent z-50">
                <Image
                  src={user.profileImage!}
                  alt="Avatar"
                  className="rounded-full border-2 border-primary"
                  width={45}
                  height={45}
                  tabIndex={0}
                  role="button"
                />
                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-base-300/80 rounded-box z-50 w-72 p-2 shadow"
                >
                  {/* User Initial */}
                  <div className="flex items-center justify-center mb-2">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary text-base-content rounded-full text-xl font-bold">
                      {user.name[0].toUpperCase()}
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <span className="text-lg font-semibold text-base-content">
                      {user.name}
                    </span>
                  </div>
                  <hr className="my-2 border-base-content" />
                  <div className="flex flex-col">
                    <Link
                      className="text-left px-4 py-2 text-base-content hover:bg-base-200 transition duration-200"
                      href={`/user/settings`}
                    >
                      My Account
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-left px-4 py-2 text-base-content text-dark hover:bg-base-200 transition duration-200"
                    >
                      Logout
                    </button>
                  </div>
                </ul>
              </div>
            </div>
          </div>
          <main className="flex flex-row">
            <div
              className={`transition-all duration-300 p-8 ${
                isSidebarOpen ? "w-2/3" : "w-full"
              }`}
            >
              {children}
            </div>
            <div
              className={`transition-transform duration-300 ${
                isSidebarOpen
                  ? "translate-x-0 w-1/3"
                  : "-translate-x-full hidden"
              }`}
            >
              <AiChatter
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
              />
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default SideNav;

const MenuItem = ({
  item,
  setIsSidebarOpen,
  isSidebarOpen,
}: {
  item: SideNavItem;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSidebarOpen: boolean;
}) => {
  const pathname = usePathname();
  const activeClasses = "bg-base-300 text-base-content";
  const inactiveClasses =
    "text-base-content hover:text-base-content hover:bg-base-100";

  return (
    <div>
      {item.isButton ? (
        <button
          onClick={() => {
            setIsSidebarOpen(!isSidebarOpen);
          }}
          className={`rounded-lg hover:bg-base-200 hover:cursor-pointer ${
            item.path === pathname ? activeClasses : inactiveClasses
          }`}
        >
          {item.icon}
        </button>
      ) : (
        <Link
          href={item.path}
          className={`rounded-lg hover:bg-base-200  ${
            item.path === pathname ? activeClasses : inactiveClasses
          }`}
        >
          {item.icon}
        </Link>
      )}
    </div>
  );
};
