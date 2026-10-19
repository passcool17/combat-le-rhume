import { cva } from "class-variance-authority";
import { cn } from "../lib/cn.js";

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
        sm: `h-10 px-3.5 text-sm`,
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

export function Card({ children, className, caution = false }) {
  return (
    <section
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
