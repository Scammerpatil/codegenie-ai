import dbConfig from "@/config/db.config";
import DataModel from "@/models/Data";
import LanguageUsage from "@/models/Language";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function POST(req: NextRequest) {
  const { user } = await req.json();
  if (!user.email || !user.password) {
    return NextResponse.json(
      { message: "Please fill all the fields" },
      { status: 400 }
    );
  }
  try {
    const existingUser = await User.findOne({ email: user.email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }
    const encryptedPassword = bcrypt.hash(user.password, 10);
    const newUser = new User({
      ...user,
      password: await encryptedPassword,
    });
    await newUser.save();
    const newData = new DataModel({ userId: newUser._id });
    const newLanguageUsage = new LanguageUsage({
      userId: newUser._id,
      javaScriptUsage: 0,
      pythonUsage: 0,
      cppUsage: 0,
      javaUsage: 0,
      cUsage: 0,
    });
    await newLanguageUsage.save();
    await newData.save();
    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
