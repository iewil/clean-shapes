import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Materials from './pages/Materials'
import Builder from './pages/Builder'
import Upload from './pages/Upload'
import Services from './pages/Services'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Catalog from './pages/Catalog'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/materials" element={<Materials />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/services" element={<Services />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/catalog" element={<Catalog />} />
      </Route>
    </Routes>
  )
}
