import { useId, useState } from "react";
import { useClickOutside } from "@mantine/hooks";
import {
  Check,
  FlagTriangleRight,
  Gem,
  Hourglass,
  Info,
  Layers,
  Swords,
  Trophy,
  Zap,
} from "lucide-react";
import type { AcSeat, LiveBoardState } from "../board-types";
import styles from "./arena-turn-hud.module.css";

export interface ArenaTurnHudProps {
  board: LiveBoardState;
  viewerSeat: AcSeat;
  participantNames?: { readonly p1?: string; readonly p2?: string };
  status: string;
  reducedMotion: boolean;
  waiting: boolean;
}

const TURN_STEPS = [
  { id: "expansion", label: "Expansion", Icon: Gem },
  { id: "primary", label: "Primary", Icon: Swords },
  { id: "endOfTurn", label: "End of turn", Icon: FlagTriangleRight },
] as const;

function phaseLabel(phase: string): string {
  switch (phase) {
    case "setup":
      return "Opening hand";
    case "resource":
      return "Resources";
    case "endOfTurn":
      return "End of turn";
    case "complete":
      return "Match complete";
    default:
      return phase.charAt(0).toUpperCase() + phase.slice(1);
  }
}

/** A read-only view of native turn and response ownership. */
export function ArenaTurnHud({
  board,
  viewerSeat,
  participantNames,
  status,
  reducedMotion,
  waiting,
}: ArenaTurnHudProps) {
  const [expanded, setExpanded] = useState(false);
  const [dismissedFor, setDismissedFor] = useState<string | null>(null);
  const detailsId = useId();
  const hudRef = useClickOutside<HTMLElement>(() => {
    setExpanded(false);
    setDismissedFor(announcement);
  });
  const prioritySeat = board.responseWindow?.openFor ?? board.decisionSeat ?? board.activePlayer;
  const decisionSeat = board.decisionSeat;
  const localPriority = prioritySeat === viewerSeat;
  const localDecision = (decisionSeat ?? prioritySeat) === viewerSeat;
  const opening = board.phaseName === "setup";
  const complete = board.phaseName === "complete";
  const seatName = (seat: AcSeat) =>
    (seat === "player-one" ? participantNames?.p1 : participantNames?.p2) ??
    (seat === viewerSeat ? "You" : "Opponent");
  const decisionName =
    decisionSeat === viewerSeat ? "You" : decisionSeat ? seatName(decisionSeat) : undefined;
  const decisionText =
    decisionName && (board.clash || board.responseWindow) ? ` Decision: ${decisionName}.` : "";
  const priorityName = prioritySeat === viewerSeat ? "You" : seatName(prioritySeat);
  const activeName =
    board.activePlayer === viewerSeat ? "Your" : `${seatName(board.activePlayer)}’s`;
  const phase = board.clash
    ? `Clash · ${phaseLabel(
        board.clash.step
          .replace(/([a-z])([A-Z])/g, "$1 $2")
          .replace(/[-_]/g, " ")
          .toLowerCase(),
      )}`
    : phaseLabel(board.phaseName);
  const passedSeats = board.responseWindow?.passedSeats ?? [];
  const currentStep = TURN_STEPS.findIndex(
    (step) =>
      step.id === board.phaseName ||
      (step.id === "expansion" && board.phaseName === "resource") ||
      (step.id === "primary" && board.phaseName === "clash"),
  );
  const StatusIcon = complete
    ? Trophy
    : opening
      ? Layers
      : waiting || !localDecision
        ? Hourglass
        : board.responseWindow
          ? Zap
          : Swords;
  const announcement = complete
    ? `Match complete. Turn ${board.turnNumber}.`
    : opening
      ? `${status}. ${seatName(viewerSeat)}.`
      : `${status}. Turn ${board.turnNumber}. ${activeName} turn. ${phase}. Priority: ${priorityName}.${decisionText}${
          passedSeats.length ? ` Passed: ${passedSeats.map(seatName).join(", ")}.` : ""
        }`;

  return (
    <section
      ref={hudRef}
      className={styles.hud}
      data-owner={complete || opening ? "neutral" : localDecision ? "local" : "rival"}
      data-reduced-motion={reducedMotion || undefined}
      data-expanded={expanded || undefined}
      data-dismissed={dismissedFor === announcement || undefined}
      onPointerEnter={() => setDismissedFor(null)}
      data-priority-seat={prioritySeat}
      data-decision-seat={decisionSeat}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-label={announcement}
    >
      <button
        type="button"
        className={styles.summary}
        aria-label="Turn and priority details"
        aria-expanded={expanded}
        aria-controls={detailsId}
        aria-describedby={detailsId}
        onFocus={() => setDismissedFor(null)}
        onClick={() => {
          setExpanded((value) => !value);
          setDismissedFor(null);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setExpanded(false);
            setDismissedFor(announcement);
          }
        }}
      >
        <span
          key={`${board.turnNumber}:${board.activePlayer}:${prioritySeat}:${Boolean(board.responseWindow)}`}
          className={styles.medallion}
          aria-hidden="true"
        >
          <span className={styles.ring} />
          <StatusIcon size={25} strokeWidth={1.65} />
          {!opening && <span className={styles.turnNumber}>{board.turnNumber}</span>}
        </span>
        {!opening && !complete && (
          <span className={styles.phaseTrack} aria-hidden="true">
            {TURN_STEPS.map(({ id, label, Icon }, index) => (
              <span
                key={id}
                data-current={currentStep === index || undefined}
                data-past={(currentStep >= 0 && index < currentStep) || undefined}
                title={`${label}${currentStep === index ? " · current phase" : ""}`}
              >
                <Icon size={14} strokeWidth={1.8} />
              </span>
            ))}
          </span>
        )}
        <Info className={styles.info} size={13} aria-hidden="true" />
      </button>
      <div key={announcement} id={detailsId} className={styles.details}>
        <strong className={styles.status}>{status}</strong>
        <span className={styles.phase}>
          {!opening && <span>Turn {board.turnNumber} · </span>}
          {phase}
        </span>
        {!opening && !complete && (
          <span className={styles.activeTurn}>
            {activeName} turn · {localPriority ? "Your priority" : `${priorityName} has priority`}
          </span>
        )}
        {decisionText && !opening && !complete && (
          <span className={styles.activeTurn}>
            {decisionSeat === viewerSeat ? "Your decision" : `${decisionName} decides`}
          </span>
        )}
        {board.responseWindow && !complete && (
          <div className={styles.responses} aria-hidden="true">
            {([viewerSeat, viewerSeat === "player-one" ? "player-two" : "player-one"] as const).map(
              (seat) => {
                const passed = passedSeats.includes(seat);
                const current = prioritySeat === seat;
                return (
                  <span
                    key={seat}
                    className={styles.responseSeat}
                    data-current={current || undefined}
                    data-passed={passed || undefined}
                    title={`${seatName(seat)} · ${passed ? "passed" : current ? "has priority" : "has not passed"}`}
                  >
                    {passed ? (
                      <Check size={12} />
                    ) : current ? (
                      <Zap size={12} />
                    ) : (
                      <Hourglass size={12} />
                    )}
                    {seat === viewerSeat ? "You" : "Rival"}
                  </span>
                );
              },
            )}
          </div>
        )}
      </div>
    </section>
  );
}
