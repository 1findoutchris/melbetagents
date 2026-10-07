"use client";

import { useEffect, useState } from "react";
import { IconArrowRight } from "./Icons";

/**
 * Mobile-only bar keeping "Apply" within thumb reach. Appears once the hero
 * scrolls away and hides while the application form is on screen.
 */
export function StickyApply({ label }: { label: string }) {
  const [pastHero, setPastHero] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector(".hero");
    const form = document.getElementById("apply");
    const footer = document.querySelector(".final-cta");
    if (!hero || !form) return;

    const heroObserver = new IntersectionObserver(([entry]) => setPastHero(!entry.isIntersecting));
    const visible = new Set<Element>();
    const formObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      setFormVisible(visible.size > 0);
    });
    heroObserver.observe(hero);
    formObserver.observe(form);
    if (footer) formObserver.observe(footer);
    return () => {
      heroObserver.disconnect();
      formObserver.disconnect();
    };
  }, []);

  const visible = pastHero && !formVisible;

  return (
    <div className="sticky-apply" data-visible={visible} aria-hidden={!visible} inert={!visible}>
      <a href="#apply" className="btn btn--primary btn--block">
        {label}
        <IconArrowRight size={18} className="arrow" />
      </a>
    </div>
  );
}
