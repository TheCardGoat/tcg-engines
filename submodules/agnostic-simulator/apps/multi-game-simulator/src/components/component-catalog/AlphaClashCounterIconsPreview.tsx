import { Tooltip } from "@mantine/core";
import { counterAppearance } from "../../games/alpha-clash/components/Arena3D/counter-display";

const counters = [
  {
    name: "Bounty",
    shape: "Target",
    path: "M12 3v4m0 10v4M3 12h4m10 0h4 M19 12a7 7 0 1 0-14 0 7 7 0 1 0 14 0 M14 12a2 2 0 1 0-4 0 2 2 0 1 0 4 0",
  },
  {
    name: "Collection",
    shape: "Stacked tokens",
    path: "m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5",
  },
  {
    name: "Scarab",
    shape: "Beetle",
    path: "M9 6V4m6 2V4M8 8 4 6m4 7H3m5 4-4 3m12-12 4-2m-4 7h5m-5 4 4 3M12 7v14M7 12a5 5 0 0 1 10 0v3a5 5 0 0 1-10 0v-3ZM9 7a3 3 0 0 1 6 0",
  },
  {
    name: "Streak",
    shape: "Speed trails",
    path: "M3 6h9M2 12h7M3 18h9m3-13 6 7-6 7m-5-14 6 7-6 7",
  },
  { name: "Temper", shape: "Anvil", path: "M3 7h18l-5 5H9L3 9V7Zm7 5v5l-4 3h13l-4-3v-5M9 7V4h8v3" },
  {
    name: "Toxic",
    shape: "Poison droplet",
    path: "M12 2s-7 8-7 13a7 7 0 0 0 14 0c0-5-7-13-7-13ZM9 12l2 2m-2 0 2-2m2 0 2 2m-2 0 2-2M9 18h6",
  },
];

/** Original UI symbols, separate from official printed card iconography. */
export function AlphaClashCounterIconsPreview() {
  return (
    <section id="counter-icons" aria-label="Counter iconography" style={{ padding: "24px 0" }}>
      <h3>Counter iconography</h3>
      <p>Six distinct shapes. Hover or focus a badge for the full counter name.</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
        {counters.map((counter) => (
          <div key={counter.name} style={{ display: "grid", gap: 8, justifyItems: "center" }}>
            <CounterBadge kind={counter.name} count={3} />
            <span>{counter.name}</span>
            <small style={{ color: "#9aafb5" }}>{counter.shape}</small>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 12, color: "#9aafb5" }}>
        Catalog legend only. On cards, show the icon and number without the labels below. These are
        proposed UI symbols, not official game icons.
      </p>
    </section>
  );
}

/** Compact badge shared by the catalog legend and card previews. */
export function CounterBadge({
  kind,
  count,
  embedded = false,
}: {
  kind: string;
  count: number;
  embedded?: boolean;
}) {
  const counter = counters.find((entry) => entry.name.toLowerCase() === kind.toLowerCase());
  const name = counter?.name ?? kind;
  return (
    <Tooltip
      label={`${count} ${name} ${count === 1 ? "counter" : "counters"}`}
      withArrow
      events={{ hover: true, focus: true, touch: true }}
    >
      <span
        tabIndex={embedded ? undefined : 0}
        role="img"
        aria-label={`${count} ${name} counters`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 3,
          padding: "2px 5px",
          height: 24,
          boxSizing: "border-box",
          borderRadius: 6,
          border: `1px solid ${counterAppearance(kind).color}`,
          color: counterAppearance(kind).color,
          background: "linear-gradient(145deg,#243541,#09151e)",
          boxShadow: "0 2px 5px #0008",
          verticalAlign: "middle",
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d={counter?.path ?? "M12 3 21 12 12 21 3 12Z"} />
        </svg>
        <strong style={{ color: "#eff6f8", fontSize: 14, lineHeight: 1 }}>{count}</strong>
      </span>
    </Tooltip>
  );
}
