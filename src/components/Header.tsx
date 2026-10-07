"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/i18n";
import { IconArrowRight } from "./Icons";
import { Wordmark } from "./Wordmark";

type Props = {
  nav: Dictionary["nav"];
  a11y: Dictionary["a11y"];
  /** Prefix for in-page anchors; "/" on secondary pages so links lead back to the home page. */
  base?: string;
};

export function Header({ nav, a11y, base = "" }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const links = [
    { href: `${base}#about`, label: nav.about },
    { href: `${base}#benefits`, label: nav.benefits },
    { href: `${base}#agent-types`, label: nav.agentTypes },
    { href: `${base}#how-it-works`, label: nav.howItWorks },
    { href: `${base}#faq`, label: nav.faq },
  ];
  const applyHref = `${base}#apply`;

  const close = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    if (!open) return;

    menuRef.current?.querySelector<HTMLElement>("a")?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close(true);
        return;
      }
      if (event.key !== "Tab" || !menuRef.current) return;
      // Keep focus inside the toggle + menu while the menu is open.
      const focusables = [toggleRef.current, ...menuRef.current.querySelectorAll<HTMLElement>("a, button")].filter(
        Boolean,
      ) as HTMLElement[];
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const onResize = () => {
      if (window.matchMedia("(min-width: 1081px)").matches) close(false);
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      document.body.classList.remove("menu-open");
    };
  }, [open, close]);

  return (
    <>
      <header className="site-header" data-scrolled={scrolled || open}>
        <div className="container site-header__inner">
          <Wordmark label={a11y.home} />

          <nav className="nav" aria-label={a11y.mainNav}>
            {links.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="header-actions">
            <a href={applyHref} className="btn btn--primary btn--sm header-apply--full">
              {nav.apply}
            </a>
            <a href={applyHref} className="btn btn--primary btn--sm header-apply--short">
              {nav.applyShort}
            </a>
            <button
              ref={toggleRef}
              type="button"
              className="menu-toggle"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? a11y.closeMenu : a11y.openMenu}
              onClick={() => setOpen((value) => !value)}
            >
              <span className="menu-toggle__bars" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Rendered outside <header>: its backdrop-filter would otherwise become the containing block. */}
      <div id="mobile-menu" ref={menuRef} className="mobile-menu" hidden={!open}>
        <nav aria-label={a11y.mainNav}>
          <ul>
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={() => close(false)}>
                  {link.label}
                  <IconArrowRight size={20} />
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a href={applyHref} className="btn btn--primary btn--lg btn--block" onClick={() => close(false)}>
          {nav.apply}
        </a>
      </div>
    </>
  );
}
