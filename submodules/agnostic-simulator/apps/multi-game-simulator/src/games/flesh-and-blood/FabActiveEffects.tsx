import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { CardImage } from "@tcg/simulator-ui";
import type { SimulatorEntity } from "@tcg/simulator-contract";
import { Sparkles, X } from "lucide-react";
import { motion } from "motion/react";
import { useId } from "react";

import { useFabPreviewTarget } from "./FabCardPreview";
import { useFabCardArtFallback } from "./useFabCardArtFallback";

import type { FabBoardEffectGroups } from "./activeEffects";
import type { FabPresentationEffect } from "./state";

export type FabOpenEffects = (anchor: HTMLElement) => void;

/** Viewer-safe source-card art keyed by effect id, tagged by asset family. */
export interface FabEffectSourceArt {
  readonly src: string;
  readonly variant: "no-text" | "printed-fallback";
  /** Public source identity used to show the normal, readable card preview. */
  readonly previewEntity?: SimulatorEntity;
  /** Shard-default art retried once when the chosen printing's URL 404s. */
  readonly defaultSrc?: string;
}

function FabEffectSourceArtPreview({
  art,
  sourceLabel,
}: {
  readonly art: FabEffectSourceArt;
  readonly sourceLabel: string;
}) {
  if (!art.previewEntity) {
    return <FabEffectSourceArtImage art={art} className="fab-active-effect-source-art" />;
  }
  return (
    <FabEffectSourceArtPreviewButton
      art={art}
      previewEntity={art.previewEntity}
      sourceLabel={sourceLabel}
    />
  );
}

function FabEffectSourceArtPreviewButton({
  art,
  previewEntity,
  sourceLabel,
}: {
  readonly art: FabEffectSourceArt;
  readonly previewEntity: SimulatorEntity;
  readonly sourceLabel: string;
}) {
  const previewTarget = useFabPreviewTarget(previewEntity, { pinOnClick: true });
  return (
    <button
      type="button"
      className="fab-active-effect-source-art-preview"
      aria-label={`Preview ${sourceLabel}`}
      {...previewTarget.previewProps}
    >
      <FabEffectSourceArtImage art={art} className="fab-active-effect-source-art" />
    </button>
  );
}

/** Source art with the chosen → default load ladder applied. */
function FabEffectSourceArtImage({
  art,
  className,
}: {
  readonly art: FabEffectSourceArt;
  readonly className?: string;
}) {
  const ladder = useFabCardArtFallback({ src: art.src, defaultSrc: art.defaultSrc });
  if (!ladder.src) return null;
  return (
    <CardImage
      className={className}
      src={ladder.src}
      alt=""
      aria-hidden="true"
      data-art-variant={art.variant}
      onImageError={ladder.onImageError}
    />
  );
}

export type FabEffectSourceArtMap = ReadonlyMap<string, FabEffectSourceArt>;

interface FabEffectSourceGroup {
  readonly key: string;
  readonly sourceLabel: string;
  readonly image?: FabEffectSourceArt;
  readonly effects: readonly FabPresentationEffect[];
}

export function FabActiveEffectsRail({
  effects,
  effectSourceArt,
  onOpen,
}: {
  readonly effects: FabBoardEffectGroups;
  readonly effectSourceArt: FabEffectSourceArtMap;
  readonly onOpen: FabOpenEffects;
}) {
  const selfSources = groupEffectSources(effects.self, effectSourceArt);
  const opponentSources = groupEffectSources(effects.opponent, effectSourceArt);

  return (
    <section
      className="fab-active-effects-rail"
      data-testid="fab-active-effects-rail"
      aria-label={ledgerAccessibleLabel(effects)}
    >
      <EffectOwnerButton ownerLabel="You" count={effects.self.length} side="self" onOpen={onOpen} />
      <EffectSourceStrip ownerLabel="You" sources={selfSources} side="left" onOpen={onOpen} />
      <EffectSourceStrip
        ownerLabel="Opponent"
        sources={opponentSources}
        side="right"
        onOpen={onOpen}
      />
      <EffectOwnerButton
        ownerLabel="Opponent"
        count={effects.opponent.length}
        side="opponent"
        onOpen={onOpen}
      />
    </section>
  );
}

function EffectOwnerButton({
  ownerLabel,
  count,
  side,
  onOpen,
}: {
  readonly ownerLabel: "You" | "Opponent";
  readonly count: number;
  readonly side: "self" | "opponent";
  readonly onOpen: FabOpenEffects;
}) {
  return (
    <button
      type="button"
      className="fab-active-effects-rail-label"
      data-owner={side}
      data-testid={`fab-active-effects-${side}-button`}
      aria-label={`${ownerLabel} ${ownerLabel === "You" ? "have" : "has"} ${count} active ${
        count === 1 ? "effect" : "effects"
      }. Open active effects`}
      aria-haspopup="dialog"
      onClick={(event) => onOpen(event.currentTarget)}
    >
      <span>{ownerLabel}</span>
      <strong>{count}</strong>
    </button>
  );
}

function EffectSourceStrip({
  ownerLabel,
  sources,
  side,
  onOpen,
}: {
  readonly ownerLabel: string;
  readonly sources: readonly FabEffectSourceGroup[];
  readonly side: "left" | "right";
  readonly onOpen: FabOpenEffects;
}) {
  const visible = sources.slice(0, 3);
  const overflow = sources.length - visible.length;
  return (
    <div
      className="fab-active-effects-source-strip"
      data-side={side}
      aria-label={`${ownerLabel} affected by ${sources.length} ${sources.length === 1 ? "source" : "sources"}`}
    >
      {visible.map((source) => (
        <EffectSourceCard key={source.key} source={source} onOpen={onOpen} />
      ))}
      {overflow > 0 ? (
        <motion.button
          type="button"
          className="fab-active-effects-source-overflow"
          aria-label={`${overflow} more ${ownerLabel.toLocaleLowerCase()} effect sources. Open active effects`}
          aria-haspopup="dialog"
          onClick={(event) => onOpen(event.currentTarget)}
          initial={{ opacity: 0.5, transform: "translate3d(0, 3px, 0)" }}
          animate={{ opacity: 1, transform: "translate3d(0, 0, 0)" }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        >
          +{overflow}
        </motion.button>
      ) : null}
    </div>
  );
}

function EffectSourceCard({
  source,
  onOpen,
}: {
  readonly source: FabEffectSourceGroup;
  readonly onOpen: FabOpenEffects;
}) {
  const detailId = useId();
  const summary = source.effects.map((effect) => effect.label).join(", ");
  return (
    <HoverCardPrimitive.Root openDelay={100} closeDelay={80}>
      <HoverCardPrimitive.Trigger asChild>
        <motion.button
          type="button"
          className="fab-active-effects-source-card"
          data-tone={source.effects[0]?.tone ?? "neutral"}
          data-testid={`fab-active-effect-source-${source.effects[0]?.id ?? source.key}`}
          aria-label={`${source.sourceLabel}: ${summary}. Open active effects`}
          aria-describedby={detailId}
          aria-haspopup="dialog"
          onClick={(event) => onOpen(event.currentTarget)}
          initial={{ opacity: 0, transform: "translate3d(0, 3px, 0) scale(0.96)" }}
          animate={{ opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {source.image ? (
            <FabEffectSourceArtImage art={source.image} />
          ) : (
            <Sparkles aria-hidden="true" size={17} strokeWidth={1.7} />
          )}
        </motion.button>
      </HoverCardPrimitive.Trigger>
      <HoverCardPrimitive.Portal>
        <HoverCardPrimitive.Content
          id={detailId}
          className="fab-active-effects-source-hover"
          role="tooltip"
          side="top"
          align="center"
          sideOffset={7}
          collisionPadding={12}
        >
          <strong>{source.sourceLabel}</strong>
          <ul>
            {source.effects.map((effect) => (
              <li key={effect.id}>
                <span>{effect.label}</span>
                <p>{effect.detail}</p>
                <small>{effect.durationLabel}</small>
              </li>
            ))}
          </ul>
          <small>Click for all active effects</small>
        </HoverCardPrimitive.Content>
      </HoverCardPrimitive.Portal>
    </HoverCardPrimitive.Root>
  );
}

function groupEffectSources(
  effects: readonly FabPresentationEffect[],
  effectSourceArt: FabEffectSourceArtMap,
): readonly FabEffectSourceGroup[] {
  const groups = new Map<string, FabEffectSourceGroup>();
  for (const effect of effects) {
    const key = effect.sourceEntityId ?? effect.id;
    const existing = groups.get(key);
    if (existing) {
      const image = existing.image ?? effectSourceArt.get(effect.id);
      groups.set(key, {
        ...existing,
        ...(image ? { image } : {}),
        effects: [...existing.effects, effect],
      });
      continue;
    }
    const image = effectSourceArt.get(effect.id);
    groups.set(key, {
      key,
      sourceLabel: effect.sourceLabel,
      ...(image ? { image } : {}),
      effects: [effect],
    });
  }
  return [...groups.values()];
}

export function FabMobileActiveEffectsLedger({
  effects,
  onOpen,
}: {
  readonly effects: FabBoardEffectGroups;
  readonly onOpen: FabOpenEffects;
}) {
  if (effects.count === 0) return null;

  return (
    <button
      type="button"
      className="fab-mobile-effects-ledger"
      data-testid="fab-mobile-effects-ledger"
      aria-label={ledgerAccessibleLabel(effects)}
      aria-haspopup="dialog"
      onClick={(event) => onOpen(event.currentTarget)}
    >
      <LedgerSeat label="Opponent" effects={effects.opponent} />
      <LedgerSeat label="You" effects={effects.self} />
      {effects.game.length > 0 ? (
        <span className="fab-mobile-effects-ledger-game">
          <Sparkles aria-hidden="true" size={12} strokeWidth={1.8} />
          <span>Game</span>
          <strong>{effects.game.length}</strong>
        </span>
      ) : null}
    </button>
  );
}

export function FabActiveEffectsButton({
  count,
  className,
  onOpen,
}: {
  readonly count: number;
  readonly className?: string;
  readonly onOpen: FabOpenEffects;
}) {
  if (count === 0) return null;
  return (
    <button
      type="button"
      className={className}
      data-testid="fab-open-active-effects"
      aria-haspopup="dialog"
      aria-label={`Open ${count} active ${count === 1 ? "effect" : "effects"}`}
      onClick={(event) => onOpen(event.currentTarget)}
    >
      <Sparkles aria-hidden="true" size={14} strokeWidth={1.8} />
      <span>Effects</span>
      <strong>{count}</strong>
    </button>
  );
}

export function FabActiveEffectsInspector({
  open,
  mobile,
  anchorElement,
  effects,
  effectSourceArt,
  onOpenChange,
}: {
  readonly open: boolean;
  readonly mobile: boolean;
  readonly anchorElement: HTMLElement | null;
  readonly effects: FabBoardEffectGroups;
  /** Viewer-safe source-card art keyed by effect id. */
  readonly effectSourceArt: FabEffectSourceArtMap;
  readonly onOpenChange: (open: boolean) => void;
}) {
  const titleId = useId();

  if (mobile) {
    return (
      <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fab-effects-inspector-backdrop" />
          <DialogPrimitive.Content
            asChild
            aria-describedby={undefined}
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              anchorElement?.focus({ preventScroll: true });
            }}
          >
            <motion.section
              className="fab-effects-inspector fab-effects-inspector--mobile"
              data-testid="fab-active-effects-inspector"
              initial={{ opacity: 0, transform: "translate3d(0, 8px, 0)" }}
              animate={{ opacity: 1, transform: "translate3d(0, 0, 0)" }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              <EffectsInspectorHeader dialogTitle onClose={() => onOpenChange(false)} />
              <EffectsInspectorBody effects={effects} effectSourceArt={effectSourceArt} />
            </motion.section>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    );
  }

  if (!open || !anchorElement) return null;
  const desktopAnchor = anchorElement;
  const anchorRef = { current: desktopAnchor };
  return (
    <PopoverPrimitive.Root modal open={open} onOpenChange={onOpenChange}>
      <PopoverPrimitive.Anchor virtualRef={anchorRef} />
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          asChild
          side="right"
          align="center"
          sideOffset={8}
          collisionPadding={12}
          aria-labelledby={titleId}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            desktopAnchor.focus({ preventScroll: true });
          }}
        >
          <motion.section
            className="fab-effects-inspector fab-effects-inspector--desktop"
            data-testid="fab-active-effects-inspector"
            initial={{ opacity: 0, transform: "translate3d(-6px, 0, 0)" }}
            animate={{ opacity: 1, transform: "translate3d(0, 0, 0)" }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            <EffectsInspectorHeader titleId={titleId} onClose={() => onOpenChange(false)} />
            <EffectsInspectorBody effects={effects} effectSourceArt={effectSourceArt} />
          </motion.section>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

function LedgerSeat({
  label,
  effects,
}: {
  readonly label: string;
  readonly effects: readonly FabPresentationEffect[];
}) {
  const primary = effects[0];
  return (
    <span className="fab-mobile-effects-ledger-seat" data-owner={label.toLocaleLowerCase()}>
      <small>{label}</small>
      <span data-tone={primary?.tone ?? "none"}>{primary?.label ?? "None"}</span>
      {effects.length > 1 ? <strong>+{effects.length - 1}</strong> : null}
    </span>
  );
}

type EffectsInspectorHeaderProps =
  | {
      readonly dialogTitle: true;
      readonly onClose: () => void;
    }
  | {
      readonly dialogTitle?: false;
      readonly titleId: string;
      readonly onClose: () => void;
    };

function EffectsInspectorHeader(props: EffectsInspectorHeaderProps) {
  return (
    <header className="fab-effects-inspector-header">
      <div>
        <Sparkles aria-hidden="true" size={16} strokeWidth={1.8} />
        {props.dialogTitle ? (
          <DialogPrimitive.Title>Active effects</DialogPrimitive.Title>
        ) : (
          <h2 id={props.titleId}>Active effects</h2>
        )}
      </div>
      <button type="button" aria-label="Close active effects" onClick={props.onClose}>
        <X aria-hidden="true" size={18} strokeWidth={1.8} />
      </button>
    </header>
  );
}

function EffectsInspectorBody({
  effects,
  effectSourceArt,
}: {
  readonly effects: FabBoardEffectGroups;
  readonly effectSourceArt: FabEffectSourceArtMap;
}) {
  return (
    <div className="fab-effects-inspector-body">
      <EffectGroup label="Opponent" effects={effects.opponent} effectSourceArt={effectSourceArt} />
      <EffectGroup label="You" effects={effects.self} effectSourceArt={effectSourceArt} />
      <EffectGroup label="Game" effects={effects.game} effectSourceArt={effectSourceArt} />
    </div>
  );
}

function EffectGroup({
  label,
  effects,
  effectSourceArt,
}: {
  readonly label: string;
  readonly effects: readonly FabPresentationEffect[];
  readonly effectSourceArt: FabEffectSourceArtMap;
}) {
  return (
    <section className="fab-active-effect-group" aria-label={`${label} active effects`}>
      <h3>{label}</h3>
      {effects.length === 0 ? (
        <p className="fab-active-effect-empty">No active effects</p>
      ) : (
        <ul>
          {effects.map((effect) => {
            const art = effectSourceArt.get(effect.id);
            return (
              <li key={effect.id} data-tone={effect.tone} data-status={effect.status}>
                {art ? (
                  <FabEffectSourceArtPreview art={art} sourceLabel={effect.sourceLabel} />
                ) : null}
                <div className="fab-active-effect-row-heading">
                  <strong>{effect.label}</strong>
                  <span>{effect.durationLabel}</span>
                </div>
                <p>{effect.detail}</p>
                <footer>
                  <span>{effect.sourceLabel}</span>
                  <span>{effect.status === "armed" ? "Waiting" : "Applying"}</span>
                  {effect.remainingUses !== null ? (
                    <span>
                      {effect.remainingUses} {effect.remainingUses === 1 ? "use" : "uses"} remaining
                    </span>
                  ) : null}
                </footer>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function ledgerAccessibleLabel(effects: FabBoardEffectGroups): string {
  const seatLabel = (label: string, values: readonly FabPresentationEffect[]) =>
    `${label}: ${
      values.length === 0 ? "no active effects" : values.map((effect) => effect.label).join(", ")
    }`;
  return `${seatLabel("Opponent", effects.opponent)}. ${seatLabel("You", effects.self)}. Game effects: ${effects.game.length}. Open active effects.`;
}
