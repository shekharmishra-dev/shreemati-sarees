import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function POST(req: Request) {
  const { message } = await req.json();

  // 1. Get current inventory from Supabase
  const { data: sarees } = await supabase.from('Sarees').select('*');
  const inventoryContext = JSON.stringify(sarees);

  // 2. Setup Gemini
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = `
    You are an elegant and helpful saree expert at "Shreemati Boutique". 
    Your tone is polite, professional, and reflects Indian hospitality.
    
    Here is our current inventory: ${inventoryContext}
    
    Customer asks: "${message}"
    
    Guidelines:
    - If they ask for recommendations, suggest specific sarees from the inventory.
    - Mention prices in INR (₹).
    - If we don't have something, politely offer the closest match.
    - Keep responses concise (2-3 sentences).
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  
  return NextResponse.json({ text: response.text() });
}