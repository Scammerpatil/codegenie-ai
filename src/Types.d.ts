import { JSX } from "react";

export interface User {
  name: string;
  phone: string;
  email: string;
  profileImage: string;
  password: string;
}

export interface SideNavItem {
  path: string;
  icon?: JSX.Element;
  isButton?: boolean;
}
