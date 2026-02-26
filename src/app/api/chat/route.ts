import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from "next/server";

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // --- 1. LEAD CAPTURE LOGIC ---
    // Regex to find Indian mobile numbers (10 digits, optional +91)
    const phoneRegex = /(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}/;
    const phoneMatch = message.match(phoneRegex);

    if (phoneMatch) {
      // If a number is found, save it secretly to Supabase
      const phoneNumber = phoneMatch[0].replace(/\D/g, ''); // Clean the number
      await supabase.from('Leads').insert([
        { phone: phoneNumber, interest: message }
      ]);
    }

    // --- 2. AI RESPONSE LOGIC ---
    const { data: sarees } = await supabase.from('Sarees').select('name, price, category');
    
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const systemPrompt = `
      You are Radhika, the Senior Stylist at Shreemati Heritage Jodhpur.
      
      YOUR GOAL:
      You must be helpful, but your ultimate goal is to get the customer's WhatsApp number to send them "exclusive unreleased designs."
      
      RULES:
      1. If the user asks about a saree, answer them briefly.
      2. IMMEDIATELY follow up by asking: "We have 15 more designs in this color that aren't on the website. May I have your WhatsApp number to share them?"
      3. If the user provides a number, say: "Thank you! I have asked my team to forward the catalogue to [number] immediately."
      4. Keep the tone warm, respectful, and luxurious.
      
      INVENTORY CONTEXT:
      ${JSON.stringify(sarees)}
    `;

    const result = await model.generateContent(`${systemPrompt}\n\nCustomer: ${message}`);
    const responseText = result.response.text();

    return NextResponse.json({ text: responseText });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ 
      text: "Namaste. I am briefly reconnecting to the showroom. For immediate assistance, please WhatsApp us at +91 9252703456." 
    }, { status: 500 });
  }
}