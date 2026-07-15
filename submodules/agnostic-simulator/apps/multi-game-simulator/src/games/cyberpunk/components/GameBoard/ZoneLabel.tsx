import classes from "./ZoneLabel.module.css";

interface ZoneLabelProps {
  children: React.ReactNode;
  variant?: "primary" | "dim";
}

export function ZoneLabel({ children, variant = "primary" }: ZoneLabelProps) {
  const cls = [classes.label, variant === "primary" ? classes.glow : classes.dim].join(" ");
  return <span className={cls}>{children}</span>;
}
