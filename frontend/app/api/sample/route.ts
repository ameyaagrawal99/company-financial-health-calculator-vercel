import { NextResponse } from "next/server";
import { SAMPLE_EXTRACTED_DATA } from "@/lib/sampleData";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: SAMPLE_EXTRACTED_DATA,
  });
}