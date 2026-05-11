import React, { useEffect, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import { Loader } from "lucide-react";
import Home from './Home';
import Verify from './Verify';

// Lazy load below-the-fold components to improve initial page load performance
const Docs = React.lazy(() => import('./Docs'));
const About = React.lazy(() => import('./About'));
const Contact = React.lazy(() => import('./Contact'));
const Terms = React.lazy(() => import('./Terms'));
const Privacy = React.lazy(() => import('./Privacy'));
const Disclaimer = React.lazy(() => import('./Disclaimer'));

const SectionLoader = () => (
  <div className="flex justify-center items-center py-20">
    <Loader size={30} className="text-brand-green animate-spin" />
  </div>
);

export default function Landing() {
  const location = useLocation();

  // If a user navigates from a separate page back to /#section,
  // this ensures the browser actually scrolls down to the correct section.
  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="scroll-smooth">
      <section id="home">
        <Home />
      </section>
      <section id="verify">
        <Verify />
      </section>
      <Suspense fallback={<SectionLoader />}>
        <section id="docs">
          <Docs />
        </section>
        <section id="about">
          <About />
        </section>
        <section id="contact">
          <Contact />
        </section>
        <section id="terms">
          <Terms />
        </section>
        <section id="privacy">
          <Privacy />
        </section>
        <section id="disclaimer">
          <Disclaimer />
        </section>
      </Suspense>
    </div>
  );
}
