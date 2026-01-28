import { Link } from "react-router-dom";
import {
  Upload,
  Wrench,
  PenTool,
  Target,
  Clock,
  Shield,
  Headphones,
  ArrowRight,
} from "lucide-react";
import { materials } from "../data/materials";
import MaterialCard from "../components/MaterialCard";

const featuredMaterialIds = [
  "mild-steel",
  "stainless-304",
  "aluminum-5052",
  "copper-110",
];

export default function Home() {
  const featuredMaterials = materials.filter((m) =>
    featuredMaterialIds.includes(m.id)
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="w-full py-28 md:py-40 px-6"
        style={{ backgroundColor: "#f8f7f4" }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-sans text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-tight">
            Precision Metal Fabrication
          </h1>
          <p className="mt-6 font-serif text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Custom parts cut, formed, and finished to your exact specifications.
            From prototype to production.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/builder"
              className="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-white bg-gray-900 rounded hover:bg-gray-800 transition-colors"
            >
              Start Building
            </Link>
            <Link
              to="/upload"
              className="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-gray-900 border-2 border-gray-900 rounded hover:bg-gray-900 hover:text-white transition-colors"
            >
              Upload Your Design
            </Link>
          </div>
        </div>
      </section>

      {/* Three Ordering Paths */}
      <section className="w-full py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            Three Ways to Order
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Upload */}
            <div className="flex flex-col items-start p-8 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 mb-6">
                <Upload className="w-6 h-6 text-gray-700" />
              </div>
              <h3 className="font-sans text-xl font-semibold text-gray-900 mb-3">
                Upload Your File
              </h3>
              <p className="font-serif text-gray-600 leading-relaxed mb-6">
                Drop in your DXF, SVG, or STEP file and get an instant quote.
                We handle the rest — nesting, cutting, and finishing.
              </p>
              <Link
                to="/upload"
                className="mt-auto inline-flex items-center text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors group"
              >
                Learn More
                <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Parts Builder */}
            <div className="flex flex-col items-start p-8 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 mb-6">
                <Wrench className="w-6 h-6 text-gray-700" />
              </div>
              <h3 className="font-sans text-xl font-semibold text-gray-900 mb-3">
                Parts Builder
              </h3>
              <p className="font-serif text-gray-600 leading-relaxed mb-6">
                Configure standard shapes from our template library. Set your
                dimensions, material, and finish — no CAD software required.
              </p>
              <Link
                to="/builder"
                className="mt-auto inline-flex items-center text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors group"
              >
                Learn More
                <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Design Services */}
            <div className="flex flex-col items-start p-8 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 mb-6">
                <PenTool className="w-6 h-6 text-gray-700" />
              </div>
              <h3 className="font-sans text-xl font-semibold text-gray-900 mb-3">
                Design Services
              </h3>
              <p className="font-serif text-gray-600 leading-relaxed mb-6">
                Work directly with our fabrication engineers. From napkin sketch
                to production-ready drawing — we bring your vision to life.
              </p>
              <Link
                to="/services"
                className="mt-auto inline-flex items-center text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors group"
              >
                Learn More
                <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Materials Showcase */}
      <section
        className="w-full py-24 px-6"
        style={{ backgroundColor: "#f8f7f4" }}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            Premium Materials
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredMaterials.map((material) => (
              <MaterialCard key={material.name} material={material} />
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link
              to="/materials"
              className="inline-flex items-center text-base font-medium text-gray-900 hover:text-gray-600 transition-colors group"
            >
              View All Materials
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust / Quality Section */}
      <section className="w-full py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            Why Clean Shapes
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Precision */}
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mx-auto mb-5">
                <Target className="w-7 h-7 text-gray-700" />
              </div>
              <h3 className="font-sans text-lg font-semibold text-gray-900 mb-2">
                Precision Guaranteed
              </h3>
              <p className="font-serif text-gray-600 text-sm leading-relaxed">
                +/- 0.005" tolerance on every part, verified with digital
                inspection.
              </p>
            </div>

            {/* Turnaround */}
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mx-auto mb-5">
                <Clock className="w-7 h-7 text-gray-700" />
              </div>
              <h3 className="font-sans text-lg font-semibold text-gray-900 mb-2">
                Fast Turnaround
              </h3>
              <p className="font-serif text-gray-600 text-sm leading-relaxed">
                Parts ship in 3-5 days. Rush options available for
                time-critical projects.
              </p>
            </div>

            {/* Quality Materials */}
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mx-auto mb-5">
                <Shield className="w-7 h-7 text-gray-700" />
              </div>
              <h3 className="font-sans text-lg font-semibold text-gray-900 mb-2">
                Quality Materials
              </h3>
              <p className="font-serif text-gray-600 text-sm leading-relaxed">
                Certified mill-direct materials with full traceability and
                material test reports.
              </p>
            </div>

            {/* Support */}
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mx-auto mb-5">
                <Headphones className="w-7 h-7 text-gray-700" />
              </div>
              <h3 className="font-sans text-lg font-semibold text-gray-900 mb-2">
                Expert Support
              </h3>
              <p className="font-serif text-gray-600 text-sm leading-relaxed">
                Engineers on call to review your designs and optimize for
                manufacturability.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
