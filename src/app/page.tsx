export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function Home() {
  // Fetch from 'Sarees' (capital S) and select the specific columns
  const { data: sarees, error } = await supabase
    .from('Sarees')
    .select('name, price, description');

  // If there is an error, this will help us troubleshoot
  if (error) {
    console.error("Database Error:", error.message);
    return <div className="p-24 text-red-500 font-bold">Error: {error.message}</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-gray-50">
      <h1 className="text-5xl font-bold mb-4 text-amber-800">Shreemati Sarees</h1>
      <p className="text-xl mb-12 italic text-gray-600">Bringing the elegance of tradition to your doorstep.</p>
      
      <div className="grid gap-6 w-full max-w-2xl">
        {/* If sarees is empty, it means the connection is good but no data was found */}
        {sarees && sarees.length > 0 ? (
          sarees.map((saree, index) => (
            <div key={index} className="p-8 bg-white border border-amber-100 rounded-2xl shadow-md">
              <h2 className="text-3xl font-semibold text-gray-800">{saree.name}</h2>
              <p className="mt-2 text-gray-600 text-lg leading-relaxed">{saree.description}</p>
              <div className="mt-6 flex justify-between items-center">
                <span className="text-2xl font-bold text-amber-700">₹{saree.price}</span>
                <span className="bg-amber-100 text-amber-800 px-4 py-1 rounded-full text-sm font-medium">In Stock</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No sarees found in the warehouse.</div>
        )}
      </div>
    </main>
  );
}