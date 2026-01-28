import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

const navLinks = [
  { label: 'Materials', to: '/materials' },
  { label: 'Parts Builder', to: '/builder' },
  { label: 'Upload File', to: '/upload' },
  { label: 'Services', to: '/services' },
];

const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = useCartStore((state) => state.items?.length ?? 0);

  const toggleMobile = () => setMobileOpen((prev) => !prev);
  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo / Brand */}
          <Link to="/" className="flex flex-col items-start leading-tight" onClick={closeMobile}>
            <span className="font-sans text-xl md:text-2xl font-bold tracking-widest text-gray-800">
              CLEAN SHAPES
            </span>
            <span className="font-serif text-[10px] md:text-xs tracking-wide text-gray-500">
              Custom Fabrication
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="font-sans text-sm font-medium tracking-wide text-gray-700 hover:text-[#0274be] transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Cart + Mobile Toggle */}
          <div className="flex items-center gap-4">
            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative text-gray-700 hover:text-[#0274be] transition-colors duration-200"
              aria-label="Shopping cart"
              onClick={closeMobile}
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 rounded-full bg-[#0274be] text-white text-[10px] font-sans font-bold leading-none">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger */}
            <button
              type="button"
              className="md:hidden text-gray-700 hover:text-[#0274be] transition-colors duration-200"
              onClick={toggleMobile}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-gray-100 bg-white">
          <ul className="flex flex-col py-2">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="block px-6 py-3 font-sans text-sm font-medium tracking-wide text-gray-700 hover:bg-gray-50 hover:text-[#0274be] transition-colors duration-200"
                  onClick={closeMobile}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
