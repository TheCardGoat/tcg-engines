import { useState } from "react";
import { Popover, Tooltip } from "@mantine/core";
import { ArrowRight, Check, Hourglass, Swords } from "lucide-react";
import phaseStart from "./assets/turn-hud/phase-start.svg";
import phaseExpansion from "./assets/turn-hud/phase-expansion.svg";
import phasePrimary from "./assets/turn-hud/phase-primary.svg";
import phaseClash from "./assets/turn-hud/phase-clash.svg";
import phaseEnd from "./assets/turn-hud/phase-end.svg";
import styles from "./arena-turn-console.module.css";

export type ArenaTurnPhase = "start" | "expansion" | "primary" | "clash" | "end";

const phases = [
  {
    id: "start",
    name: "Start",
    icon: phaseStart,
    detail: "Resolve effects that trigger at the start of the turn.",
  },
  {
    id: "expansion",
    name: "Expansion",
    icon: phaseExpansion,
    detail:
      "Ready your cards, draw, then optionally place one eligible card from your hand into your Resource Zone. The starting player skips their first Ready and Draw steps.",
  },
  {
    id: "primary",
    name: "Primary",
    icon: phasePrimary,
    detail:
      "Play cards and use abilities. You may start a legal Clash or end your turn. Each finished Clash returns you to a new Primary phase.",
  },
  {
    id: "clash",
    name: "Clash",
    icon: phaseClash,
    detail:
      "Resolve the attack, responses, obstruction, buffs, and damage. When this Clash ends, return to Primary. Starting a Clash is optional.",
  },
  {
    id: "end",
    name: "End",
    icon: phaseEnd,
    detail: "Resolve end-of-turn effects before the next player’s turn begins.",
  },
] as const;

export interface ArenaTurnConsoleAction {
  id: string;
  label: string;
  description: string;
  kind: "clash" | "advance" | "confirm" | "pass";
  disabledReason?: string;
}

export interface ArenaTurnConsoleProps {
  turnNumber: number;
  turnOwner: "you" | "opponent";
  priority: "you" | "opponent" | "resolving";
  phase: ArenaTurnPhase;
  step?: string;
  instruction: string;
  combatMessage?: string;
  statusLabel?: string;
  actions?: readonly ArenaTurnConsoleAction[];
  onAction: (id: string) => void;
  reducedMotion?: boolean;
}

/** Controlled presentation: the adapter owns priority, legal actions, and phase advancement. */
export function ArenaTurnConsole({
  turnNumber,
  turnOwner,
  priority,
  phase,
  step,
  instruction,
  combatMessage,
  statusLabel,
  actions = [],
  onAction,
  reducedMotion,
}: ArenaTurnConsoleProps) {
  const [openHelp, setOpenHelp] = useState<string | null>(null);
  const activePhase = phases.find((item) => item.id === phase)!;
  const priorityText =
    priority === "you"
      ? "You have priority"
      : priority === "opponent"
        ? "Opponent has priority"
        : "Resolving effects";

  return (
    <section
      className={styles.console}
      aria-label="Turn controls"
      data-priority={priority}
      data-turn-owner={turnOwner}
      data-reduced-motion={reducedMotion || undefined}
    >
      <div
        className={styles.srOnly}
        role="status"
        aria-label={statusLabel}
        aria-live="polite"
        aria-atomic="true"
      >
        {statusLabel ??
          `${turnOwner === "you" ? "Your" : "Opponent’s"} turn ${turnNumber}. ${priorityText}.`}{" "}
        {activePhase.name}
        {step ? ` · ${step}` : ""}. {instruction}
      </div>
      <div
        className={styles.track}
        role="group"
        aria-label="Turn phases. Select a phase for an explanation."
      >
        {phases.map((item) => (
          <Popover
            key={item.id}
            opened={openHelp === item.id}
            onChange={(opened) => setOpenHelp(opened ? item.id : null)}
            onDismiss={() => setOpenHelp(null)}
            position="top"
            width={260}
            withArrow
            shadow="md"
          >
            <Popover.Target>
              <Tooltip
                classNames={{ tooltip: styles.tooltip }}
                label={
                  item.id === phase
                    ? `${item.name}${step ? ` · ${step}` : ""}. ${instruction}`
                    : `About ${item.name}`
                }
                events={{ hover: true, focus: true, touch: false }}
                openDelay={350}
                disabled={openHelp === item.id}
              >
                <button
                  type="button"
                  className={styles.phaseNode}
                  data-phase={item.id}
                  data-current={item.id === phase || undefined}
                  aria-current={item.id === phase ? "step" : undefined}
                  aria-expanded={openHelp === item.id}
                  aria-label={`${item.name}${item.id === phase ? ", current phase" : ""}. Phase information`}
                  onClick={() => setOpenHelp(openHelp === item.id ? null : item.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") setOpenHelp(null);
                  }}
                >
                  <span className={styles.socket}>
                    <img src={item.icon} alt="" />
                  </span>
                </button>
              </Tooltip>
            </Popover.Target>
            <Popover.Dropdown className={styles.help}>
              <strong>
                {item.name}
                {item.id === phase ? " · current phase" : ""}
              </strong>
              {item.id === phase && (
                <p>
                  {step && <b>{step}. </b>}
                  {instruction}
                </p>
              )}
              <p>{item.detail}</p>
              <small>Phase information. This does not advance the turn.</small>
            </Popover.Dropdown>
          </Popover>
        ))}
      </div>
      {combatMessage && (
        <div className={styles.combatMessage} role="status" aria-live="polite">
          <strong>
            <Swords size={14} aria-hidden="true" />
            {combatMessage}
          </strong>
          <span>{instruction}</span>
        </div>
      )}
      <footer className={styles.actions}>
        {priority === "you" && actions.length > 0 ? (
          actions.map((action) => {
            const Icon =
              action.kind === "clash" ? Swords : action.kind === "confirm" ? Check : ArrowRight;
            return (
              <Tooltip
                classNames={{ tooltip: styles.tooltip }}
                key={action.id}
                label={action.disabledReason ?? action.description}
                multiline
                w={240}
                events={{ hover: true, focus: true, touch: false }}
                openDelay={250}
              >
                <button
                  type="button"
                  className={styles.action}
                  data-kind={action.kind}
                  aria-disabled={Boolean(action.disabledReason)}
                  onClick={() => {
                    if (!action.disabledReason) onAction(action.id);
                  }}
                >
                  {action.kind === "clash" && <Icon size={17} aria-hidden="true" />}
                  <span>{action.label}</span>
                  {action.kind !== "clash" && <Icon size={17} aria-hidden="true" />}
                </button>
              </Tooltip>
            );
          })
        ) : (
          <span className={styles.waiting}>
            <Hourglass size={15} aria-hidden="true" />
            {priority === "opponent"
              ? "Waiting"
              : priority === "resolving"
                ? "Resolving…"
                : "Your choice"}
          </span>
        )}
      </footer>
    </section>
  );
}
