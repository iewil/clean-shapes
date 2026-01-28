import React from 'react';
import { Link } from 'react-router-dom';

const materialsLinks = [
  { label: 'Steel', to: '/materials?type=steel' },
  { label: 'Aluminum', to: '/materials?type=aluminum' },
  { label: 'Stainless Steel', to: '/materials?type=stainless' },
  { label: 'Copper & Brass', to: '/materials?type=copper' },
  { label: 'All Materials', to: '/materials' },
];

const servicesLinks = [
  { label: 'Laser Cutting', to: '/services#laser' },
  { label: 'CNC Bending', to: '/services#bending' },
  { label: 'Welding', to: '/services#welding' },
  { label: 'Finishing', to: '/services#finishing' },
  { label: 'All Services', to: '/services' },
];

const aboutLinks = [
  { label: 'Our Story', to: '/about' },
  { label: 'Capabilities', to: '/capabilities' },
  { label: 'Quality', to: '/quality' },
  { label: 'Careers', to: '/careers' },
  { label: 'Contact', to: '/contact' },
];

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1a1a2e] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <span className="font-sans text-2xl font-bold tracking-widest text-white">
                CLEAN SHAPES
              </span>
            </Link>
            <p className="font-serif text-sm leading-relaxed text-gray-400 max-w-sm mb-6">
              Precision custom fabrication rooted in craft and heritage. We transform raw
              metal into exactly what you need — cut, bent, welded, and finished to
              exacting standards.
            </p>
            <div className="font-serif text-sm text-gray-400 space-y-1">
              <p>123 Forge Lane, Suite 100</p>
              <p>Industrial District, OH 44101</p>
              <p className="pt-2">
                <a
                  href="tel:+12165550199"
                  className="hover:text-[#0274be] transition-colors duration-200"
                >
                  (216) 555-0199
                </a>
              </p>
              <p>
                <a
                  href="mailto:hello@cleanshapes.com"
                  className="hover:text-[#0274be] transition-colors duration-200"
                >
                  hello@cleanshapes.com
                </a>
              </p>
            </div>
          </div>

          {/* Materials Column */}
          <div>
            <h3 className="font-sans text-sm font-semibold tracking-wider text-white uppercase mb-4">
              Materials
            </h3>
            <ul className="space-y-2">
              {materialsLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="font-serif text-sm text-gray-400 hover:text-[#0274be] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="font-sans text-sm font-semibold tracking-wider text-white uppercase mb-4">
              Services
            </h3>
            <ul className="space-y-2">
              {servicesLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="font-serif text-sm text-gray-400 hover:text-[#0274be] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Column */}
          <div>
            <h3 className="font-sans text-sm font-semibold tracking-wider text-white uppercase mb-4">
              About
            </h3>
            <ul className="space-y-2">
              {aboutLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="font-serif text-sm text-gray-400 hover:text-[#0274be] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-700/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-serif text-xs text-gray-500">
              &copy; {currentYear} Clean Shapes. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                to="/privacy"
                className="font-serif text-xs text-gray-500 hover:text-gray-300 transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="font-serif text-xs text-gray-500 hover:text-gray-300 transition-colors duration-200"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
