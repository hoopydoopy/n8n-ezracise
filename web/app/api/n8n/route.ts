import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const FILE_PATH = path.join(process.cwd(), "latest.json");

export async function POST(req: Request) {
  const payload = await req.json();

  console.log(payload[0]);
  // n8n sends an ARRAY of items
  const activities = Array.isArray(payload)
    ? (payload[0]?.Activities ?? [])
    : (payload.Activities ?? []);
  fs.writeFileSync(FILE_PATH, JSON.stringify({ activities }, null, 2), "utf-8");

  console.log("Saved activities:", activities.length);
  console.log("Activities shape:", activities);

  return NextResponse.json({ ok: true });
}
