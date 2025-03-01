import React, { useEffect } from 'react';

export default function Root({ children }) {
  useEffect(() => {

    const catchTourLinks = (ev) => {
      const link = ev.target.closest("a");
      if (link) {
        // disable SPA navigation for /tour links
        const href = link.getAttribute("href");
        if (href.startsWith("/tour/") || href === "/tour") {
          ev.stopPropagation();
          ev.preventDefault();

          window.location.href = href;
        }
      }
    }

    document.addEventListener("click", catchTourLinks, true);
    return () => {
      document.removeEventListener("click", catchTourLinks, true);
    };
  }, []);

  return <>{children}</>;
}
