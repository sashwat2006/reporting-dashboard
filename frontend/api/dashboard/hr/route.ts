import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase-client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // Fetch all HR data from Supabase
    const { data, error } = await supabase.from("hr_table").select("*");
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }
  res.setHeader("Allow", ["GET"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
