import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ text: "API Key is missing in server settings." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

    const { data: sarees } = await supabase.from('Sarees').select('name, price, description');
    
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const prompt = `You are a saree expert for Shreemati Boutique. Inventory: ${JSON.stringify(sarees)}. Answer this: ${message}`;

    const result = await model.generateContent(prompt);
    return NextResponse.json({ text: result.response.text() });
  } catch (error: any) {
    return NextResponse.json({ text: "I'm having trouble connecting to the brain. Error: " + error.message }, { status: 500 });
  }
}