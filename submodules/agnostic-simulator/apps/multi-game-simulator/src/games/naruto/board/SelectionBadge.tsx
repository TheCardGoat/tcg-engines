import classes from "./cards.module.css";

export function SelectionBadge() {
  return (
    <span className={classes.selectionBadge} aria-label="Selected card" title="Selected">
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path d="m3.2 8.2 3 3.1 6.6-6.7" />
      </svg>
    </span>
  );
}
