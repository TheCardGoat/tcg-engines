import type { ReactNode } from "react";
import { useAttackSelection } from "./useAttackSelection";
import { useCardPreview } from "./CardPreviewContext";
import { useCardView, type ZoneCardView } from "../../engine/zoneViews";
import { PLAYER_SIDE_TO_ID, useEngine, type MoveLogEntry } from "../../engine";
import {
  collectPendingAttackTriggerSummaries,
  type AttackTriggerSummary,
} from "../../engine/attackTriggers";
import classes from "./AttackPhaseHud.module.css";

interface AttackPhaseHudProps {
  compact?: boolean;
}

type VisibleAttackStep = "offensive" | "defensive" | "fight" | "defeat" | "steal";
type VisibleAttackKind = "fight" | "direct";

interface AttackCueText {
  now: string;
  next: string;
  triggers?: readonly PendingAttackTriggerSummary[];
}

interface PendingAttackTriggerSummary extends AttackTriggerSummary {
  triggerId?: string;
}

interface FightOutcomeCue {
  label: string;
  summary: string;
  detail: string;
}

export function AttackPhaseHud({ compact = false }: AttackPhaseHudProps) {
  const { activeSide, humanSide, matchState, moveLogs, dispatch } = useEngine();
  const pendingAttack = useAttackSelection();
  const attack = matchState.G.attackState;
  const pending = pendingAttack.selection;
  const attackerId = attack?.attackerId ?? pending?.attackerId;
  const defenderId = attack?.defenderId ?? undefined;
  const attacker = useCardView(attackerId as unknown as string | undefined);
  const defender = useCardView(defenderId as unknown as string | undefined);

  if (matchState.G.gamePhase !== "main") {
    return null;
  }

  const isHumanAttack = activeSide === humanSide;
  const kind = attack?.kind as VisibleAttackKind | undefined;
  const step = getVisibleAttackStep(attack, moveLogs);
  const attackTriggers = getVisibleAttackTriggers(matchState);
  const cue = pending
    ? {
        now: "Choose target",
        next: "Spent Unit = Fight. Rival = Steal Gigs.",
      }
    : getAttackCue({
        attackActive: Boolean(attack),
        attackerName: attacker?.name ?? "Attacker",
        attackerPower: attacker?.effectivePower ?? null,
        attackTriggers,
        kind,
        step,
        isHumanAttack,
        activeSide,
        humanSide,
      });
  const fightOutcome = getFightOutcomeCue({
    attacker,
    defender,
    result: kind === "fight" && step === "defeat" ? attack?.fightResult : undefined,
  });

  const steps = buildSteps(kind, step);
  const combatLine = renderCombatLine({
    attackActive: Boolean(attack),
    attacker,
    defender,
    fallbackText: cue.now,
    kind,
    pendingActive: Boolean(pending),
  });

  return (
    <div
      className={`${classes.hud} ${compact ? classes.compact : ""}`}
      data-attack-mode={kind === "direct" ? "steal" : kind === "fight" ? "fight" : "idle"}
      data-testid="attack-phase-hud"
      aria-live="polite"
    >
      <div className={classes.core}>
        <div className={classes.command}>
          <span className={classes.mode}>
            {kind ? (kind === "fight" ? "FIGHT" : "STEAL") : "ATTACK"}
          </span>
          {!combatLine ? <span className={classes.destination}>{cue.now}</span> : null}
        </div>
        {combatLine ? <div className={classes.combatRow}>{combatLine}</div> : null}
      </div>
      {pending ? (
        <div className={classes.actions}>
          <AttackCue cue={cue} />
          <button
            type="button"
            className={classes.cancelAttack}
            onClick={() => pendingAttack.clearSelection()}
          >
            Cancel
          </button>
        </div>
      ) : steps.length > 0 ? (
        <div className={classes.actions}>
          <div
            className={classes.steps}
            aria-label="Attack sequence"
            style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
          >
            {steps.map((s) => (
              <Step key={s.label} label={s.label} active={s.active} complete={s.complete} />
            ))}
          </div>
          <AttackCue
            cue={cue}
            fightOutcome={fightOutcome}
            onResolveTrigger={(triggerId) => {
              dispatch({ type: "resolveTrigger", triggerId, as: PLAYER_SIDE_TO_ID[activeSide] });
            }}
          />
        </div>
      ) : null}
    </div>
  );
}

function getVisibleAttackStep(
  attack: {
    attackerId?: unknown;
    defenderId?: unknown;
    kind?: string;
    step?: string;
  } | null,
  moveLogs: ReadonlyArray<MoveLogEntry>,
): VisibleAttackStep | undefined {
  const step = attack?.step;
  if (!attack || step !== "offensive" || attack.kind !== "fight") {
    return isVisibleAttackStep(step) ? step : undefined;
  }

  const wasRedirectedByBlocker = moveLogs.some((entry) => {
    const log = entry.log;
    return (
      log.type === "useBlocker" &&
      String(log.attackerId) === String(attack.attackerId) &&
      String(log.blockerId) === String(attack.defenderId)
    );
  });

  return wasRedirectedByBlocker ? "defensive" : step;
}

function getVisibleAttackTriggers(
  matchState: ReturnType<typeof useEngine>["matchState"],
): PendingAttackTriggerSummary[] {
  const choice = matchState.G.turnMetadata.pendingChoice;
  if (choice?.type === "chooseTrigger") {
    return choice.payload.options.map((option) => ({
      cardId: option.sourceCardId as unknown as string,
      cardName: option.cardName,
      text: option.abilityText,
      triggerId: option.triggerId,
    }));
  }
  return collectPendingAttackTriggerSummaries(matchState);
}

function isVisibleAttackStep(step: string | undefined): step is VisibleAttackStep {
  return (
    step === "offensive" ||
    step === "defensive" ||
    step === "fight" ||
    step === "defeat" ||
    step === "steal"
  );
}

function renderCombatLine({
  attackActive,
  attacker,
  defender,
  fallbackText,
  kind,
  pendingActive,
}: {
  attackActive: boolean;
  attacker: ZoneCardView | null;
  defender: ZoneCardView | null;
  fallbackText: string;
  kind: string | undefined;
  pendingActive: boolean;
}): ReactNode {
  if (!attackActive && !pendingActive) {
    return null;
  }

  if (kind === "direct") {
    return (
      <span className={classes.combatLine} data-combat-kind="direct">
        <Combatant label="ATTACKER" card={attacker} fallback="Attacker" />
        <span className={classes.versus} aria-hidden="true">
          →
        </span>
        <CombatTarget label="TARGET" value="Rival Gigs" />
      </span>
    );
  }

  if (kind === "fight") {
    return (
      <span className={classes.combatLine} data-combat-kind="fight">
        <Combatant label="ATTACKER" card={attacker} fallback="Attacker" />
        <span className={classes.versus}>vs</span>
        <Combatant label="DEFENDER" card={defender} fallback="Defender" />
      </span>
    );
  }

  return (
    <span className={classes.combatLine}>
      <CombatCardToken card={attacker} fallback="Attacker" />
      <span className={classes.destination}>{fallbackText}</span>
    </span>
  );
}

function getAttackCue({
  attackActive,
  attackerName,
  attackerPower,
  attackTriggers,
  kind,
  step,
  isHumanAttack,
  activeSide,
  humanSide,
}: {
  attackActive: boolean;
  attackerName: string;
  attackerPower: number | null;
  attackTriggers: readonly PendingAttackTriggerSummary[];
  kind: VisibleAttackKind | undefined;
  step: VisibleAttackStep | undefined;
  isHumanAttack: boolean;
  activeSide: string;
  humanSide: string;
}): AttackCueText {
  if (!attackActive) {
    return isHumanAttack
      ? {
          now: "Choose a ready Unit",
          next: "Fight a spent Unit or steal from your rival.",
        }
      : {
          now: "Rival may declare attacks",
          next: "You act if they attack you.",
        };
  }

  if (step === "offensive") {
    if (attackTriggers.length === 0) {
      return {
        now: `Offensive step: ${attackerName} has no ATTACK trigger.`,
        next:
          kind === "direct"
            ? "Go to defense; rival may call a Legend or block."
            : "Go to defense; rival may call a Legend or respond.",
      };
    }

    return {
      now: `Offensive step: ${formatAttackTriggerCount(attackTriggers)} pending.`,
      next: "Resolve these effects before defense responds.",
      triggers: attackTriggers,
    };
  }

  if (step === "defensive") {
    if (activeSide === humanSide) {
      return {
        now: "Defensive step: waiting on rival.",
        next:
          kind === "direct"
            ? "If they do not block, you steal Gigs."
            : "If they do not respond, compare power.",
      };
    }
    return {
      now: "Defensive step: choose a response.",
      next:
        kind === "direct"
          ? "Block or call a Legend, or let them steal."
          : "Call a Legend, or let the fight happen.",
    };
  }

  if (step === "fight") {
    return {
      now: "Fight step: compare total power.",
      next: "Higher power wins. A tie defeats both Units.",
    };
  }

  if (step === "defeat") {
    return {
      now: "Defeat step: trash defeated Units.",
      next: "Then this attack is finished.",
    };
  }

  if (step === "steal") {
    const power = attackerPower ?? 0;
    const gigs = 1 + Math.floor(power / 10);
    return {
      now: `Steal step: take ${gigs} Gig${gigs === 1 ? "" : "s"}.`,
      next: "Choose which rival Gig die moves to you.",
    };
  }

  return {
    now: "Attack in progress.",
    next: "Finish this attack before declaring another.",
  };
}

function getFightOutcomeCue({
  attacker,
  defender,
  result,
}: {
  attacker: ZoneCardView | null;
  defender: ZoneCardView | null;
  result: string | undefined;
}): FightOutcomeCue | null {
  if (!result || !attacker || !defender) {
    return null;
  }

  const attackerPower = attacker.effectivePower ?? 0;
  const defenderPower = defender.effectivePower ?? 0;
  const powerText = `${attackerPower} - ${defenderPower}`;

  if (result === "attackerWins") {
    return {
      label: powerText,
      summary: `${attacker.name} wins`,
      detail: `${defender.name} is defeated and moves to Trash.`,
    };
  }

  if (result === "defenderWins") {
    return {
      label: powerText,
      summary: `${defender.name} wins`,
      detail: `${attacker.name} is defeated and moves to Trash.`,
    };
  }

  if (result === "mutual") {
    return {
      label: powerText,
      summary: "Both Units are defeated",
      detail: `${attacker.name} and ${defender.name} move to Trash.`,
    };
  }

  return null;
}

function buildSteps(
  kind: VisibleAttackKind | undefined,
  step: VisibleAttackStep | undefined,
): { label: string; active: boolean; complete: boolean }[] {
  if (!kind || !step) {
    return [];
  }

  if (kind === "fight") {
    return [
      { label: "OFFENSIVE", active: step === "offensive", complete: step !== "offensive" },
      {
        label: "DEFENSIVE",
        active: step === "defensive",
        complete: step === "fight" || step === "defeat",
      },
      { label: "FIGHT", active: step === "fight", complete: step === "defeat" },
      { label: "DEFEAT", active: step === "defeat", complete: false },
    ];
  }

  return [
    { label: "OFFENSIVE", active: step === "offensive", complete: step !== "offensive" },
    { label: "DEFENSIVE", active: step === "defensive", complete: step === "steal" },
    { label: "STEAL", active: step === "steal", complete: false },
  ];
}

function CombatCardToken({ card, fallback }: { card: ZoneCardView | null; fallback: string }) {
  const { show, hide } = useCardPreview();

  if (!card) {
    return <span>{fallback}</span>;
  }

  const showPreview = () => {
    show({ imageUrl: card.imageUrl, alt: card.name, color: card.color });
  };

  return (
    <button
      type="button"
      className={classes.cardToken}
      onMouseEnter={showPreview}
      onMouseLeave={hide}
      onFocus={showPreview}
      onBlur={hide}
    >
      <span className={classes.cardName}>{card.name}</span>
      {card.effectivePower !== null ? (
        <span className={classes.powerPip} aria-label={`${card.effectivePower} power`}>
          {card.effectivePower}
        </span>
      ) : null}
    </button>
  );
}

function Combatant({
  label,
  card,
  fallback,
}: {
  label: string;
  card: ZoneCardView | null;
  fallback: string;
}) {
  return (
    <span className={classes.combatant}>
      <span className={classes.combatRole}>{label}</span>
      <CombatCardToken card={card} fallback={fallback} />
    </span>
  );
}

function CombatTarget({ label, value }: { label: string; value: string }) {
  return (
    <span className={classes.combatTarget}>
      <span className={classes.combatRole}>{label}</span>
      <span className={classes.targetName}>{value}</span>
    </span>
  );
}

function AttackCue({
  cue,
  fightOutcome,
  onResolveTrigger,
}: {
  cue: AttackCueText;
  fightOutcome?: FightOutcomeCue | null;
  onResolveTrigger?: (triggerId: string) => void;
}) {
  return (
    <div className={classes.cue}>
      <div className={classes.cueCopy}>
        <span className={classes.cueText}>{cue.now}</span>
        <span className={classes.cueText}>{cue.next}</span>
      </div>
      {fightOutcome ? (
        <div className={classes.fightOutcome} data-testid="fight-outcome-cue">
          <span className={classes.outcomeMeta}>RESULT</span>
          <span className={classes.outcomePower}>{fightOutcome.label}</span>
          <span className={classes.outcomeSummary}>{fightOutcome.summary}</span>
          <span className={classes.outcomeDetail}>{fightOutcome.detail}</span>
        </div>
      ) : cue.triggers && cue.triggers.length > 0 ? (
        <div className={classes.triggerList} aria-label="Attack triggers to resolve">
          {cue.triggers.map((trigger, index) => (
            <AttackTriggerRow
              key={`${trigger.cardName}-${index}`}
              trigger={trigger}
              index={index}
              onResolveTrigger={onResolveTrigger}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function AttackTriggerRow({
  trigger,
  index,
  onResolveTrigger,
}: {
  trigger: PendingAttackTriggerSummary;
  index: number;
  onResolveTrigger?: (triggerId: string) => void;
}) {
  const card = useCardView(trigger.cardId);
  const { show, hide } = useCardPreview();
  const showPreview = () => {
    if (!card) {
      return;
    }
    show({ imageUrl: card.imageUrl, alt: card.name, color: card.color });
  };

  return (
    <button
      type="button"
      className={`${classes.triggerItem} ${index === 0 ? classes.triggerItemPrimary : ""}`}
      title={`${trigger.cardName}: ${trigger.text}`}
      data-testid="attack-trigger-row"
      onMouseEnter={showPreview}
      onMouseLeave={hide}
      onFocus={showPreview}
      onBlur={hide}
      onClick={() => {
        if (trigger.triggerId) onResolveTrigger?.(trigger.triggerId);
      }}
    >
      <span className={classes.triggerIndex} aria-label={`Trigger ${index + 1}`}>
        {index + 1}
      </span>
      <span className={classes.triggerBody}>
        <span className={classes.triggerMeta}>
          <span className={classes.triggerSource}>{trigger.cardName}</span>
          <span className={classes.triggerKind}>ATTACK</span>
        </span>
        <span className={classes.triggerText}>{stripAttackPrefix(trigger.text)}</span>
      </span>
    </button>
  );
}

function formatAttackTriggerCount(triggers: readonly PendingAttackTriggerSummary[]): string {
  return `${triggers.length} ATTACK trigger${triggers.length === 1 ? "" : "s"}`;
}

function stripAttackPrefix(text: string): string {
  return text.replace(/^ATTACK\s+/i, "");
}

function Step({ label, active, complete }: { label: string; active: boolean; complete: boolean }) {
  return (
    <span
      className={`${classes.step} ${active ? classes.stepActive : ""} ${
        complete ? classes.stepComplete : ""
      }`}
      data-active={active ? "true" : "false"}
      data-step-label={label}
      aria-current={active ? "step" : undefined}
    >
      {label}
    </span>
  );
}
