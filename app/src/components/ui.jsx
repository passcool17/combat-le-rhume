import { cva } from "class-variance-authority";
import { cn } from "../lib/cn.js";
import { useEffect, useState } from "react";
import { ChevronDown } from "./icones.jsx";

export const buttonVariants = cva(
  `inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-200 disabled:opacity-50`,
  {
    variants: {
      variant: {
        primary: `bg-primary text-primary-fg hover:bg-primary/90`,
        ghost: `border border-line bg-surface text-ink hover:bg-surface-2`,
        soft: `bg-primary-soft text-primary hover:bg-primary-soft/70`,
        caution: `bg-caution-soft text-caution hover:bg-caution-soft/70`,
      },
      size: {
        md: `h-11 px-5 text-sm`,
        sm: `h-11 px-3.5 text-sm`,
      },
    },
    defaultVariants: {
      variant: `primary`,
      size: `md`,
    },
  },
);

export function Button({ className, variant, size, type = `button`, ...i }) {
  return (
    <button
      type={type}
      className={cn(
        buttonVariants({
          variant: variant,
          size: size,
        }),
        className,
      )}
      {...i}
    />
  );
}

export function Kicker({ children }) {
  return (
    <p className="text-xs font-medium tracking-widest text-muted uppercase">
      {children}
    </p>
  );
}

export function Card({ children, className, caution = false, ...rest }) {
  return (
    <section
      {...rest}
      className={cn(
        `rounded-[var(--radius-card)] border bg-surface p-5`,
        caution ? `border-caution/40` : `border-line`,
        className,
      )}
    >
      {children}
    </section>
  );
}

// ---------- Sections repliables + menu « Sur cette page » (refonte v4) ----------
const OPEN_EVENT = `clr-open-section`;

/** Ouvre une section repliable et la fait défiler à l’écran. */
export function openSection(id) {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: id }));
  requestAnimationFrame(() => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: matchMedia(`(prefers-reduced-motion: reduce)`).matches ? `auto` : `smooth`, block: `start` });
    el.querySelector(`button[aria-expanded]`)?.focus({ preventScroll: true });
  });
}

/** Carte dont le contenu se replie. Le titre (h2) contient le bouton, selon le motif « accordéon ». */
export function Section({ id, kicker, kickerClassName, title, children, defaultOpen = false, forceOpen = false, caution = false, className, titleClassName, level = 2, aside }) {
  const [open, setOpen] = useState(defaultOpen);
  useEffect(() => {
    const on = (e) => e.detail === id && setOpen(true);
    window.addEventListener(OPEN_EVENT, on);
    return () => window.removeEventListener(OPEN_EVENT, on);
  }, [id]);
  const shown = open || forceOpen;
  const H = `h${level}`;
  return (
    <section
      id={id}
      data-section={id}
      className={cn(
        `scroll-mt-44 rounded-[var(--radius-card)] border bg-surface`,
        caution ? `border-caution/40` : `border-line`,
        className,
      )}
    >
      <div className="flex items-start gap-2">
        <H className="min-w-0 flex-1">
          <button
            type="button"
            aria-expanded={shown}
            aria-controls={`${id}-contenu`}
            onClick={() => setOpen(!shown)}
            className="flex min-h-11 w-full items-center justify-between gap-3 rounded-[var(--radius-card)] px-5 py-3 text-left"
          >
            <span className="min-w-0">
              {kicker ? <span className={cn(`block font-sans text-xs font-medium tracking-widest text-muted uppercase`, kickerClassName)}>{kicker}</span> : null}
              <span className={cn(`block`, kicker && `mt-1`, titleClassName ?? `text-2xl`)}>{title}</span>
            </span>
            <ChevronDown className={cn(`size-5 shrink-0 text-muted transition-transform duration-200`, shown && `rotate-180`)} aria-hidden="true" />
          </button>
        </H>
        {aside ? <div className="pt-3 pr-3">{aside}</div> : null}
      </div>
      <div id={`${id}-contenu`} hidden={!shown} className="px-5 pb-5">
        {children}
      </div>
    </section>
  );
}

/** Menu repliable « Sur cette page » : liens vers les sections, qui s’ouvrent au toucher. */
export function OnThisPage({ items }) {
  const [open, setOpen] = useState(false);
  return (
    <nav aria-label="Sur cette page" className="rounded-[var(--radius-card)] border border-line bg-surface" data-otp>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="sur-cette-page"
        onClick={() => setOpen(!open)}
        className="flex min-h-12 w-full items-center justify-between gap-3 px-5 text-left text-sm font-medium"
      >
        <span>Sur cette page <span className="text-muted">({items.length})</span></span>
        <ChevronDown className={cn(`size-5 text-muted transition-transform duration-200`, open && `rotate-180`)} aria-hidden="true" />
      </button>
      <ul id="sur-cette-page" hidden={!open} className="flex flex-wrap gap-2 px-4 pb-4">
        {items.map((it) => (
          <li key={it.id}>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openSection(it.id);
              }}
              className="min-h-11 rounded-full border border-line bg-surface-2 px-4 text-sm text-ink"
            >
              {it.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
