import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ text: "API Key is missing." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!, 
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Now fetching Category as well!
    const { data: sarees } = await supabase.from('Sarees').select('name, price, description, category');
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `
      You are "Radhika," the Lead Stylist at Shreemati Heritage Boutique. 
      Tone: Elegant, warm, and expert in Indian textiles.
      
      Our Current Inventory: ${JSON.stringify(sarees)}

      Rules:
      1. Greet with "Namaste".
      2. Recommend specific sarees by their Name and Category (e.g., "Our Midnight Banarasi").
      3. Keep answers under 40 words.
      4. If they ask for a price, be precise.
    `;

    const result = await model.generateContent(`${systemPrompt}\n\nCustomer: ${message}`);
    const responseText = result.response.text();

    return NextResponse.json({ text: responseText });
  } catch (error: any) {
    return NextResponse.json({ text: "Our stylist is adjusting the drapes. Please try again." }, { status: 500 });
  }
}