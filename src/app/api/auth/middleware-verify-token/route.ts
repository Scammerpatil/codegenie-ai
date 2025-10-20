export const dynamic = "force-static";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "No token found" }, { status: 400 });
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.json({ data, status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 401 });
  }
}
