import { Link } from "react-router-dom";
import {
  Zap,
  CornerDownRight,
  Paintbrush,
  Droplets,
  Layers,
  Eraser,
  Wrench,
  Target,
  type LucideIcon,
} from "lucide-react";
import { services } from "../data/services";

const iconMap: Record<string, LucideIcon> = {
  Zap,
  CornerDownRight,
  Paintbrush,
  Droplets,
  Layers,
  Eraser,
  Wrench,
  Target,
};

export default function Services() {
  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <section
        className="w-full py-28 md:py-36 px-6"
        style={{ backgroundColor: "#f8f7f4" }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-sans text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
            Our Services
          </h1>
          <p className="mt-6 font-serif text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            From cutting and forming to finishing and hardware — we offer a full
            range of fabrication capabilities under one roof.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="w-full py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const Icon = iconMap[service.icon];
              return (
                <div
                  key={service.id}
                  className="flex flex-col items-start p-8 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 mb-6">
                    {Icon && (
                      <Icon className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <h3 className="font-sans text-xl font-semibold text-gray-900 mb-3">
                    {service.name}
                  </h3>
                  <p className="font-serif text-gray-600 leading-relaxed mb-6 flex-1">
                    {service.description}
                  </p>
                  <span className="inline-block px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-full">
                    {service.priceLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section
        className="w-full py-24 px-6"
        style={{ backgroundColor: "#f8f7f4" }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Need a custom service?
          </h2>
          <p className="font-serif text-lg text-gray-600 mb-10 leading-relaxed">
            Our engineering team can accommodate special requirements. Reach out
            and we will work with you to find a solution.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-gray-900 border-2 border-gray-900 rounded hover:bg-gray-900 hover:text-white transition-colors">
              Contact Us
            </button>
            <Link
              to="/builder"
              className="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-white bg-gray-900 rounded hover:bg-gray-800 transition-colors"
            >
              Or start building your part
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
