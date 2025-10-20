import { SideNavItem } from "@/Types";
import {
  IconHome,
  IconMessageChatbot,
  IconCode,
  IconBook2,
  IconRobot,
  IconMicrophone,
  IconSettings,
} from "@tabler/icons-react";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    path: "/user/dashboard",
    icon: <IconHome size={28} stroke={1.5} title="Home" />,
  },
  {
    path: "/user/code-playground",
    icon: <IconCode size={28} stroke={1.5} title="Code Playground" />,
  },
  {
    path: "/user/ai-assistant",
    icon: <IconMessageChatbot size={28} stroke={1.5} title="AI Assistant" />,
    isButton: true,
  },
  {
    path: "/user/resources",
    icon: <IconBook2 size={28} stroke={1.5} title="Learning Resources" />,
  },
  {
    path: "/user/settings",
    icon: <IconSettings size={28} stroke={1.5} title="Settings" />,
  },
];
