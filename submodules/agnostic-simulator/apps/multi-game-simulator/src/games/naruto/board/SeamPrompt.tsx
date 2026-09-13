/**
 * Board seam: turn / phase / contextual prompt / chain strip / pass or
 * end-turn button / choice cancel chip. aria-live announces prompt changes.
 */

import { cardImageUrl } from "../projection/labels.ts";
import animations from "./animations.module.css";
import classes from "./board.module.css";
import { NarutoCardImage } from "./NarutoCardImage.tsx";
import { pillsFor, type BoardKit } from "./types.ts";

export interface SeamPromptProps {
  readonly kit: BoardKit;
  readonly sticky?: boolean;
}

export function SeamPrompt({ kit, sticky = false }: SeamPromptProps) {
  const { projection } = kit;
  const prompt = projection.prompt;
  const choice = projection.choice;
  const showCancel =
    kit.interactive && choice !== null && choice.cancellable && choice.player === projection.viewer;
  const selectedBlockedPill = kit.selection
    ? pillsFor(kit, kit.selection.uid).find((pill) => !pill.enabled && pill.reason !== null)
    : null;
  const blockedPill =
    selectedBlockedPill ??
    projection.seamPills.find((pill) => !pill.enabled && pill.reason !== null);
  const guidance = blockedPill
    ? `${blockedPill.label} unavailable - ${blockedPill.reason}`
    : prompt.hint;

  return (
    <div
      className={`${classes.seam} ${sticky ? classes.seamSticky : ""}`}
      data-testid="naruto-seam"
      data-phase={projection.phase}
      data-step={projection.step}
    >
      <span className={classes.seamTurn} data-testid="naruto-turn">
        T{projection.turn}
      </span>
      <div className={classes.seamPrompt} aria-live="polite">
        <p className={classes.seamPromptText} data-testid="naruto-seam-text" key={prompt.text}>
          {prompt.text}
        </p>
        {guidance ? (
          <p
            className={`${classes.seamPromptHint} ${blockedPill ? classes.seamBlockedHint : ""}`}
            data-testid="naruto-seam-guidance"
          >
            {guidance}
          </p>
        ) : null}
      </div>
      {projection.chain.length > 0 ? (
        <div className={classes.chainStrip} data-testid="naruto-chain" aria-label="Support chain">
          {projection.chain.map((link) => (
            <span
              key={link.uid}
              className={classes.chainLink}
              title={`${link.name} (link ${link.link})`}
            >
              <NarutoCardImage
                src={cardImageUrl(link.cardId)}
                alt=""
                draggable={false}
                fallbackLabel={link.name}
              />
              <span className={classes.chainNumber}>{link.link}</span>
              {link.name}
            </span>
          ))}
        </div>
      ) : null}
      <div className={classes.seamActions}>
        {kit.selection && !sticky ? (
          <button
            type="button"
            className={classes.detailsButton}
            data-testid="naruto-card-details"
            onClick={kit.onOpenDetails}
          >
            Details
          </button>
        ) : null}
        {showCancel ? (
          <button
            type="button"
            className={classes.cancelChip}
            data-testid="naruto-choice-cancel"
            onClick={kit.onCancelChoice}
          >
            Cancel
          </button>
        ) : null}
        {kit.interactive
          ? projection.seamPills.map((pill) => (
              <button
                key={pill.id}
                type="button"
                className={pill.id === "pass-counter" ? classes.passButton : classes.endTurnButton}
                data-testid={`naruto-${pill.id}`}
                disabled={!pill.enabled}
                title={pill.reason ?? undefined}
                onClick={() => kit.onPill(pill)}
              >
                {pill.label}
              </button>
            ))
          : null}
      </div>
    </div>
  );
}

/** Big turn banner that sweeps through on turn change (keyed by turn). */
export function TurnBanner({
  turn,
  activeName,
}: {
  readonly turn: number;
  readonly activeName: string;
}) {
  return (
    <span key={turn} className={`${classes.turnBanner} ${animations.bannerSweep}`} aria-hidden>
      Turn {turn} - {activeName}
    </span>
  );
}
