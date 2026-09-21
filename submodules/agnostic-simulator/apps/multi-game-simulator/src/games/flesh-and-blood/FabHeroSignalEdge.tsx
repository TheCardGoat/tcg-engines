import * as Popover from "@radix-ui/react-popover";
import {
  BatteryCharging,
  Crosshair,
  EyeOff,
  PartyPopper,
  Sparkles,
  Swords,
  ThumbsDown,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";

import type { FabPresentationHeroSignal } from "./state";

interface SignalCopy {
  readonly label: string;
  readonly detail: string;
  readonly Icon: LucideIcon;
}

const SIGNAL_COPY: Record<FabPresentationHeroSignal["id"], SignalCopy> = {
  cheered: {
    label: "Cheered",
    detail: "The crowd has cheered this hero.",
    Icon: PartyPopper,
  },
  booed: {
    label: "Booed",
    detail: "The crowd has booed this hero.",
    Icon: ThumbsDown,
  },
  intimidate: {
    label: "Intimidate",
    detail: "Times this hero intimidated an opponent.",
    Icon: EyeOff,
  },
  charged: {
    label: "Charged",
    detail: "This hero has charged a card to their soul.",
    Icon: BatteryCharging,
  },
  "weapon-attacks": {
    label: "Weapon attacks",
    detail: "Weapon attacks made by this hero this turn.",
    Icon: Swords,
  },
  "soul-added": {
    label: "Added to soul",
    detail: "Cards put into this hero's soul this turn.",
    Icon: Sparkles,
  },
  marked: {
    label: "Marked",
    detail: "CR 9.3 — the next time an opponent's attack hits this hero, Marked is removed.",
    Icon: Crosshair,
  },
};

function signalValue(signal: FabPresentationHeroSignal): string {
  if (signal.kind === "count") return String(signal.value);
  return signal.id === "marked" ? "Until hit" : "Active";
}

function signalSummary(signal: FabPresentationHeroSignal): string {
  const label = SIGNAL_COPY[signal.id].label;
  return signal.kind === "count" ? `${label} ${signal.value}` : label;
}

export function FabHeroSignalEdge({
  signals,
  heroName,
  side,
}: {
  readonly signals: readonly FabPresentationHeroSignal[];
  readonly heroName: string;
  readonly side: "top" | "bottom";
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const suppressFocusOpenRef = useRef(false);
  const escapeDismissedRef = useRef(false);
  if (signals.length === 0) return null;

  const visible = signals.length > 3 ? signals.slice(0, 2) : signals;
  const overflow = signals.length > 3 ? signals.length - 2 : 0;
  const accessibleSummary = signals.map(signalSummary).join(", ");
  // Marked outlives the turn (CR 9.3.3), so only an all-turn signal set may
  // claim "This turn".
  const scopeLabel = signals.some((signal) => signal.id === "marked") ? "Status" : "This turn";

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          ref={triggerRef}
          type="button"
          className="fab-hero-signal-edge"
          data-testid="fab-hero-signal-edge"
          data-side={side}
          aria-label={`${heroName} hero signals: ${accessibleSummary}. ${scopeLabel}.`}
          onPointerEnter={(event) => {
            if (event.pointerType === "mouse") setOpen(true);
          }}
          onFocus={() => {
            if (!suppressFocusOpenRef.current) setOpen(true);
          }}
        >
          <span className="fab-hero-signal-pips" aria-hidden="true">
            {visible.map((signal) => {
              const { Icon } = SIGNAL_COPY[signal.id];
              const activationKey =
                signal.kind === "count" ? `${signal.id}:${signal.value}` : signal.id;
              return (
                <motion.span
                  className="fab-hero-signal-pip"
                  data-signal={signal.id}
                  key={activationKey}
                  initial={{ opacity: 0.72, transform: "translate3d(0, 0, 0) scale(0.78)" }}
                  animate={{
                    opacity: 1,
                    transform: [
                      "translate3d(0, 0, 0) scale(0.78)",
                      "translate3d(0, 0, 0) scale(1.22)",
                      "translate3d(0, 0, 0) scale(1)",
                    ],
                  }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], times: [0, 0.48, 1] }}
                >
                  <Icon size={14} strokeWidth={2} />
                  {signal.kind === "count" ? <strong>{signal.value}</strong> : null}
                </motion.span>
              );
            })}
            {overflow > 0 ? <span className="fab-hero-signal-overflow">+{overflow}</span> : null}
          </span>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="fab-hero-signal-popover"
          side={side === "top" ? "bottom" : "top"}
          sideOffset={8}
          collisionPadding={12}
          aria-label={`${heroName} hero signals`}
          onEscapeKeyDown={() => {
            escapeDismissedRef.current = true;
            window.setTimeout(() => {
              suppressFocusOpenRef.current = true;
              triggerRef.current?.focus({ preventScroll: true });
              queueMicrotask(() => {
                suppressFocusOpenRef.current = false;
              });
            });
          }}
          onCloseAutoFocus={(event) => {
            if (!escapeDismissedRef.current) return;
            event.preventDefault();
            escapeDismissedRef.current = false;
            suppressFocusOpenRef.current = true;
            triggerRef.current?.focus({ preventScroll: true });
            queueMicrotask(() => {
              suppressFocusOpenRef.current = false;
            });
          }}
          onPointerDownOutside={() => {
            escapeDismissedRef.current = false;
          }}
          onPointerEnter={(event) => {
            if (event.pointerType === "mouse") setOpen(true);
          }}
          onPointerLeave={(event) => {
            if (event.pointerType === "mouse") setOpen(false);
          }}
        >
          <header>
            <strong>{heroName}</strong>
            <span>{scopeLabel}</span>
          </header>
          <ul>
            {signals.map((signal) => {
              const { Icon, label, detail } = SIGNAL_COPY[signal.id];
              return (
                <li key={signal.id} data-signal={signal.id}>
                  <Icon aria-hidden="true" size={17} strokeWidth={1.8} />
                  <span>
                    <strong>{label}</strong>
                    <small>{detail}</small>
                  </span>
                  <b>{signalValue(signal)}</b>
                </li>
              );
            })}
          </ul>
          <Popover.Arrow className="fab-hero-signal-popover-arrow" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
