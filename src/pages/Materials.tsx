import { useState } from "react";
import { materials, materialCategories } from "../data/materials";
import MaterialCard from "../components/MaterialCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/Tabs";

export default function Materials() {
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);

  const selected = materials.find((m) => m.id === selectedMaterial);

  const handleCardClick = (id: string) => {
    setSelectedMaterial((prev) => (prev === id ? null : id));
  };

  const formatPrice = (price: number) => {
    return "$" + price.toFixed(2);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <section className="px-6 py-16 md:py-24 max-w-5xl mx-auto text-center">
        <h1 className="font-sans text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
          Materials Catalog
        </h1>
        <p className="font-serif text-lg md:text-xl text-gray-600 mt-4 max-w-2xl mx-auto leading-relaxed">
          Explore our curated selection of premium materials — each chosen for
          its durability, finish, and suitability for precision cutting.
        </p>
      </section>

      {/* Category Tabs & Grid */}
      <section className="px-6 pb-24 max-w-5xl mx-auto">
        <Tabs defaultValue="metals">
          <TabsList>
            {materialCategories.map((cat) => (
              <TabsTrigger key={cat.id} value={cat.id}>
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {materialCategories.map((cat) => {
            const filtered = materials.filter(
              (m) => m.category === cat.id
            );

            return (
              <TabsContent key={cat.id} value={cat.id}>
                {/* Material Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((material) => (
                    <div
                      key={material.id}
                      onClick={() => handleCardClick(material.id)}
                      className={`cursor-pointer rounded-lg transition-all ${selectedMaterial === material.id ? 'ring-2 ring-primary' : ''}`}
                    >
                      <MaterialCard material={material} />
                    </div>
                  ))}
                </div>

                {filtered.length === 0 && (
                  <p className="font-serif text-gray-500 text-center py-12">
                    No materials available in this category yet.
                  </p>
                )}
              </TabsContent>
            );
          })}
        </Tabs>

        {/* Inline Detail Panel */}
        {selected && (
          <div className="mt-10 border border-gray-200 rounded-lg bg-offwhite p-8 md:p-10">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="font-sans text-2xl md:text-3xl font-semibold text-gray-900">
                  {selected.name}
                </h2>
                <p className="font-serif text-gray-600 mt-2 leading-relaxed max-w-2xl">
                  {selected.description}
                </p>
              </div>
              <button
                onClick={() => setSelectedMaterial(null)}
                className="text-gray-400 hover:text-gray-700 transition-colors text-2xl leading-none ml-4"
                aria-label="Close detail panel"
              >
                &times;
              </button>
            </div>

            {/* Thickness / Pricing Table */}
            {selected.thicknesses && selected.thicknesses.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full max-w-lg border-collapse">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="font-sans text-left text-sm font-semibold text-gray-700 py-3 pr-8">
                        Thickness
                      </th>
                      <th className="font-sans text-left text-sm font-semibold text-gray-700 py-3">
                        Price per sq in
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.thicknesses.map((entry, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-200 last:border-b-0"
                      >
                        <td className="font-serif text-gray-800 py-3 pr-8">
                          {entry.label}
                        </td>
                        <td className="font-serif text-gray-800 py-3">
                          {formatPrice(entry.pricePerSqIn)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
