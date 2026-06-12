import classes from "./ZoneBadge.module.css";

interface ZoneBadgeProps {
  children: React.ReactNode;
  position?: "top" | "bottom";
  className?: string;
}

export function ZoneBadge({ children, position = "bottom", className }: ZoneBadgeProps) {
  return (
    <span className={[classes.badge, classes[position], className].filter(Boolean).join(" ")}>
      {children}
    </span>
  );
}
