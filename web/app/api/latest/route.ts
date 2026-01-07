import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const FILE_PATH = path.join(process.cwd(), "latest.json");

export async function GET() {
  let data = { activities: [] };

  try {
    if (fs.existsSync(FILE_PATH)) {
      const content = fs.readFileSync(FILE_PATH, "utf-8");
      data = JSON.parse(content);
    }
  } catch (err) {
    console.error("Error reading latest.json:", err);
  }

  return NextResponse.json({ data });
}
