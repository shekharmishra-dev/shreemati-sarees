import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function Home() {
  const { data: sarees, error } = await supabase
    .from('Sarees')
    .select('name, price, description, image_url'); // Added image_url here

  if (error) return <div className="p-24 text-red-500">Error: {error.message}</div>;

  return (
    <main className="flex min-h-screen flex-col items-center p-12 bg-stone-50 text-stone-900">
      <header className="text-center mb-16">
        <h1 className="text-6xl font-serif font-bold text-amber-900 mb-2">Shreemati</h1>
        <div className="h-1 w-24 bg-amber-600 mx-auto mb-4"></div>
        <p className="text-xl italic text-stone-600 font-serif">The Heritage Saree Boutique</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl">
        {sarees?.map((saree, index) => (
          <div key={index} className="group bg-white overflow-hidden rounded-3xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-stone-200">
            {/* Image Section */}
            <div className="aspect-[4/5] overflow-hidden bg-stone-200">
              <img 
                src={saree.image_url || 'https://via.placeholder.com/400x500?text=Saree+Image'} 
                alt={saree.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            {/* Text Section */}
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold font-serif">{saree.name}</h2>
                <span className="text-xl font-bold text-amber-800">₹{saree.price}</span>
              </div>
              <p className="text-stone-600 leading-relaxed mb-6">{saree.description}</p>
              <button className="w-full py-3 bg-stone-900 text-white rounded-full font-medium hover:bg-amber-900 transition-colors">
                Enquire on WhatsApp
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}