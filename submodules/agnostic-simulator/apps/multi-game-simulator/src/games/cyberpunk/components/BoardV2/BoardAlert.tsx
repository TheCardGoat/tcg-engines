import { X } from "lucide-react";
import { useState, type ReactNode } from "react";
import classes from "./BoardAlert.module.css";

/** Anchored container so several notices stack instead of overlapping. */
export function BoardAlertStack({ children }: { children: ReactNode }) {
  return <div className={classes.stack}>{children}</div>;
}

/**
 * One floating notice plate over the V2 board. Replaces the flow bands that
 * used to shove the table down: this one overlays, so the board keeps its
 * layout while the condition is up. Mount it only while the condition holds —
 * unmounting clears the dismissal so a reoccurrence is shown again.
 */
export function BoardAlert({
  id,
  severity,
  role = "status",
  icon,
  message,
  action,
}: {
  id: string;
  severity: "warning" | "error";
  role?: "status" | "alert";
  icon: ReactNode;
  message: string;
  action?: ReactNode;
}) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div
      className={classes.alert}
      data-severity={severity}
      role={role}
      data-testid={`board-alert-${id}`}
    >
      <span className={classes.icon} aria-hidden="true">
        {icon}
      </span>
      <p className={classes.message}>{message}</p>
      {action}
      <button
        type="button"
        className={classes.close}
        aria-label="Dismiss notice"
        onClick={() => setDismissed(true)}
      >
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  );
}
