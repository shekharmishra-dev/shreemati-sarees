import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function Home() {
  const { data: sarees, error } = await supabase
    .from('Sarees')
    .select('*'); // This fetches everything

  if (error) return <div className="p-24 text-red-500">Database Error: {error.message}</div>;

  return (
    <main className="flex min-h-screen flex-col items-center p-6 bg-stone-50">
      <h1 className="text-4xl font-serif font-bold text-amber-900 my-10">Shreemati Boutique</h1>
      
      <div className="flex flex-col gap-10 w-full max-w-2xl">
        {sarees?.map((saree) => (
          <div key={saree.id} className="bg-white rounded-xl shadow-lg overflow-hidden border">
            {/* If image_url exists, show it; otherwise show text */}
            {saree.image_url ? (
              <img 
                src={saree.image_url} 
                alt={saree.name}
                className="w-full h-auto min-h-[300px] object-cover"
                onError={(e) => {
                  console.log("Image failed to load for: " + saree.name);
                }}
              />
            ) : (
              <div className="p-20 bg-stone-200 text-center text-stone-500">
                No image link found in Supabase for "{saree.name}"
              </div>
            )}
            <div className="p-6">
              <h2 className="text-2xl font-bold">{saree.name}</h2>
              <p className="text-stone-600 mt-2">{saree.description}</p>
              <p className="text-xl font-bold text-amber-800 mt-4">₹{saree.price}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}