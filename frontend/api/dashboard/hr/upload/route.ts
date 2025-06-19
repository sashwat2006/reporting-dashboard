import { NextRequest } from "next/server";
import { read, utils } from "xlsx";
import { supabase } from "@/lib/supabase-client";

export async function POST(req: NextRequest) {
  // Parse the form data
  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) {
    return new Response(JSON.stringify({ error: "No file uploaded" }), { status: 400 });
  }

  // Read file buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const workbook = read(buffer);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const json = utils.sheet_to_json(sheet);

  // Insert into Supabase HR table
  const { error } = await supabase.from("hr_table").insert(json as any[]);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
