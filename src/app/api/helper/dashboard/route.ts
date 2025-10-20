export const dynamic = "force-static";

import dbConfig from "@/config/db.config";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import DataModel from "@/models/Data";
import LanguageUsage from "@/models/Language";

dbConfig();

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

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    const userId = decodedData.id;

    // Fetch user's data (usage data)
    const usageData = await DataModel.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalCodeRuns: { $sum: "$codeRun" },
          totalAiQueries: { $sum: "$aiQueries" },
          totalErrorsDetected: { $sum: "$errorsDetected" },
          totalVoiceInteractions: { $sum: "$voiceInteractions" },
          usageData: {
            $push: {
              day: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              codeRuns: "$codeRun",
              aiQueries: "$aiQueries",
              errorsDetected: "$errorsDetected",
              voiceInteractions: "$voiceInteractions",
            },
          },
        },
      },
    ]);

    if (!usageData.length) {
      return NextResponse.json(
        { message: "No data found for this user" },
        { status: 404 }
      );
    }

    // Fetch user's language usage data
    const languageUsageData = await LanguageUsage.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!languageUsageData) {
      return NextResponse.json(
        { message: "No language usage data found" },
        { status: 404 }
      );
    }

    const languageUsage = [
      { name: "JavaScript", value: languageUsageData.javaScriptUsage },
      { name: "Python", value: languageUsageData.pythonUsage },
      { name: "C++", value: languageUsageData.cppUsage },
      { name: "Java", value: languageUsageData.javaUsage },
      { name: "C", value: languageUsageData.cUsage },
    ];

    const {
      totalCodeRuns,
      totalAiQueries,
      totalErrorsDetected,
      totalVoiceInteractions,
      usageData: dailyData,
    } = usageData[0];

    const dashboardData: DashboardData = {
      usageData: dailyData,
      languageUsage,
      totalVoiceInteractions,
      totalCodeRuns,
      totalAiQueries,
      totalErrorsDetected,
    };

    return NextResponse.json(dashboardData, { status: 200 });
  } catch (error) {
    console.error("Error in dashboard helper:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching dashboard data" },
      { status: 500 }
    );
  }
}
