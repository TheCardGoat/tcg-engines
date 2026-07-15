import classes from "./ZoneBadge.module.css";

interface ZoneBadgeProps {
  children: React.ReactNode;
  position?: "top" | "bottom";
  className?: string;
  /**
   * Machine-readable zone label (e.g. "Deck", "Friendly Gigs"). Emitted as
   * `data-sim-zone-label` so AI agents can map a visible badge to its zone
   * without relying on OCR of the rendered text.
   */
  label?: string;
}

export function ZoneBadge({ children, position = "bottom", className, label }: ZoneBadgeProps) {
  return (
    <span
      className={[classes.badge, classes[position], className].filter(Boolean).join(" ")}
      data-sim-zone-label={label}
    >
      {children}
    </span>
  );
}
