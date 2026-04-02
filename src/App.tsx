import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { OverOns } from './pages/OverOns';
import { Diensten } from './pages/Diensten';
import { Portfolio } from './pages/Portfolio';
import { PortfolioDetail } from './pages/PortfolioDetail';
import { Contact } from './pages/Contact';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/Dashboard';
import { PortfolioEditor } from './pages/admin/PortfolioEditor';
import { PageEditor } from './pages/admin/PageEditor';
import { AdminSettings } from './pages/admin/Settings';
import { AdminLogin } from './pages/admin/Login';

export default function App() {
  // GitHub Pages base path support
  const basename = '/WielstraGroup';

  return (
    <HelmetProvider>
      <Router basename={basename}>
        <Routes>
          {/* Public Routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/over-ons" element={<OverOns />} />
            <Route path="/diensten" element={<Diensten />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/portfolio/:slug" element={<PortfolioDetail />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="portfolio" element={<AdminDashboard />} />
            <Route path="portfolio/new" element={<PortfolioEditor />} />
            <Route path="portfolio/edit/:id" element={<PortfolioEditor />} />
            <Route path="pages" element={<AdminDashboard />} />
            <Route path="pages/new" element={<PageEditor />} />
            <Route path="pages/edit/:id" element={<PageEditor />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </Router>
    </HelmetProvider>
  );
}
