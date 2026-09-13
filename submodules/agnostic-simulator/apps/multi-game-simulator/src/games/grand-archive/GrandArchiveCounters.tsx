import { Popover } from "@mantine/core";
import type { SimulatorEntityDecoration } from "@tcg/simulator-contract";
import {
  Bookmark,
  ChevronUp,
  CircleMinus,
  CirclePlus,
  Clock,
  Droplet,
  Eye,
  Hammer,
  Leaf,
  Shield,
  Sun,
  Tag,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";

const ICONS: Readonly<Record<string, LucideIcon>> = {
  damage: Droplet,
  buff: CirclePlus,
  debuff: CircleMinus,
  bulwark: Shield,
  durability: Hammer,
  enlighten: Sun,
  level: ChevronUp,
  omen: Eye,
  preparation: Bookmark,
  static: Zap,
  wither: Leaf,
};

export function isGrandArchiveCounter(decoration: SimulatorEntityDecoration): boolean {
  return decoration.id.startsWith("ga:counter:");
}

function CounterSeal({
  counter,
  temporaryDamage = false,
}: {
  readonly counter: SimulatorEntityDecoration;
  readonly temporaryDamage?: boolean;
}) {
  const kind = counter.id.slice("ga:counter:".length);
  const Icon = ICONS[kind] ?? Tag;
  return (
    <span className="ga-counter-seal" data-counter-kind={kind}>
      <Icon size={14} aria-hidden="true" />
      <strong>{counter.content.kind === "text" ? counter.content.text : ""}</strong>
      {kind === "damage" && temporaryDamage ? <Clock size={10} aria-hidden="true" /> : null}
    </span>
  );
}

/** A separate inspection target never steals the card's gameplay action. */
export function GrandArchiveCounters({
  title,
  counters,
  temporaryDamage,
  onUnmountFocus,
}: {
  readonly onUnmountFocus: () => void;
  readonly title: string;
  readonly counters: readonly SimulatorEntityDecoration[];
  readonly temporaryDamage: boolean;
}) {
  const [opened, setOpened] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const trigger = triggerRef.current;
    return () => {
      // Restore only focus owned by this inspector, before its portal disappears.
      if (
        trigger === document.activeElement ||
        dropdownRef.current?.contains(document.activeElement)
      ) {
        onUnmountFocus();
      }
    };
  }, [onUnmountFocus]);
  const damage = counters.find((counter) => counter.id === "ga:counter:damage");
  const secondary = counters.filter((counter) => counter !== damage);
  const visible = secondary.slice(0, damage ? 1 : 2);
  const hiddenCount = secondary.length - visible.length;
  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      position="bottom-end"
      middlewares={{ flip: true, shift: { padding: 12 } }}
      withArrow
      withinPortal
      trapFocus
      returnFocus
      width={280}
    >
      <Popover.Target>
        <button
          ref={triggerRef}
          type="button"
          className="ga-counter-dock"
          data-sim-primary-click-owner="counter-inspection"
          aria-label={`Inspect counters on ${title}`}
          aria-expanded={opened}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            setOpened(!opened);
          }}
        >
          <span className="ga-counter-dock__seals" aria-hidden="true">
            {hiddenCount > 0 ? <span className="ga-counter-overflow">+{hiddenCount}</span> : null}
            {visible.map((counter) => (
              <CounterSeal key={counter.id} counter={counter} />
            ))}
            {damage ? <CounterSeal counter={damage} temporaryDamage={temporaryDamage} /> : null}
          </span>
        </button>
      </Popover.Target>
      <Popover.Dropdown
        ref={dropdownRef}
        className="ga-counter-inspector"
        onClick={(event) => event.stopPropagation()}
      >
        <div role="region" aria-label={`Counters on ${title}`}>
          <h3>{title}</h3>
          <p className="ga-counter-inspector__subtitle">Counters · current match state</p>
          <ul>
            {counters.map((counter) => (
              <li key={counter.id}>
                <span aria-hidden="true">
                  <CounterSeal counter={counter} />
                </span>
                <span>{counter.ariaLabel}</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="ga-counter-inspector__close"
            onClick={() => setOpened(false)}
          >
            Close counters
          </button>
        </div>
      </Popover.Dropdown>
    </Popover>
  );
}
