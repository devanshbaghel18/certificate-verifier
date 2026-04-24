import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Home from './Home';
import Verify from './Verify';
import Docs from './Docs';
import About from './About';
import Contact from './Contact';
import Terms from './Terms';
import Privacy from './Privacy';
import Disclaimer from './Disclaimer';

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
    </div>
  );
}
