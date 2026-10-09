import {
  IconArrowsMove,
  IconBolt,
  IconCards,
  IconCrosshair,
  IconCurrencyDollar,
  IconLayoutGrid,
  IconListDetails,
  IconPhotoScan,
  IconPhoneCall,
  IconShield,
  IconSparkles,
  IconSwords,
  IconUserBolt,
  IconX,
} from "@tabler/icons-react";
import type {
  CardContextMenuActionIconProps,
  CardContextMenuControlIconProps,
  CardContextMenuVisualIdentity,
} from "@tcg/simulator-ui";

import styles from "./CyberpunkCardContextVisualIdentity.module.css";
import { CyberpunkRulesText } from "./CyberpunkRulesText";

function statValue(
  stats: readonly { label: string; value: string }[],
  label: string,
): string | undefined {
  return stats.find((stat) => stat.label.toLocaleLowerCase() === label)?.value;
}

function CyberpunkActionIcon({ action }: CardContextMenuActionIconProps) {
  const actionRef = `${action.commandRef ?? ""} ${action.id}`.toLocaleLowerCase();
  if (actionRef.includes("attackunit")) {
    return <IconSwords size={18} stroke={1.8} aria-hidden="true" />;
  }
  if (actionRef.includes("attackrival")) {
    return <IconCrosshair size={18} stroke={1.8} aria-hidden="true" />;
  }
  if (actionRef.includes("block")) {
    return <IconShield size={18} stroke={1.8} aria-hidden="true" />;
  }
  if (actionRef.includes("sellcard")) {
    return <IconCurrencyDollar size={18} stroke={1.8} aria-hidden="true" />;
  }
  if (actionRef.includes("calllegend")) {
    return <IconPhoneCall size={18} stroke={1.8} aria-hidden="true" />;
  }
  if (actionRef.includes("gosolo")) {
    return <IconUserBolt size={18} stroke={1.8} aria-hidden="true" />;
  }
  if (actionRef.includes("activateability")) {
    return <IconSparkles size={18} stroke={1.8} aria-hidden="true" />;
  }
  if (actionRef.includes("manual")) {
    return <IconArrowsMove size={18} stroke={1.8} aria-hidden="true" />;
  }
  if (actionRef.includes("playcard")) {
    return <IconCards size={18} stroke={1.8} aria-hidden="true" />;
  }
  return <IconBolt size={18} stroke={1.8} aria-hidden="true" />;
}

function CyberpunkControlIcon({ control }: CardContextMenuControlIconProps) {
  switch (control) {
    case "preview":
      return <IconPhotoScan size={18} stroke={1.7} aria-hidden="true" />;
    case "detailed-mode":
      return <IconListDetails size={18} stroke={1.7} aria-hidden="true" />;
    case "quick-mode":
      return <IconLayoutGrid size={18} stroke={1.7} aria-hidden="true" />;
    case "close":
      return <IconX size={20} stroke={1.7} aria-hidden="true" />;
  }
}

export const CYBERPUNK_CARD_CONTEXT_VISUAL_IDENTITY: CardContextMenuVisualIdentity = {
  className: styles.surface,
  hideDetailsTags: true,
  renderIdentity: ({ entity, onInspect, onPreviewStart, onPreviewEnd }) => {
    const cost = statValue(entity.stats, "cost");
    const power = statValue(entity.stats, "power");
    const classifications = [
      ...new Set(
        entity.traits
          .map((trait) => trait.trim())
          .filter(
            (trait) => trait && trait.toLocaleLowerCase() !== entity.subtitle.toLocaleLowerCase(),
          ),
      ),
    ];
    return (
      <div className={styles.identity} data-cyberpunk-card-context-identity>
        <div className={styles.titleRow}>
          <button
            type="button"
            className={styles.inspectTitle}
            onClick={onInspect}
            onPointerEnter={(event) => { if (event.pointerType !== "touch") onPreviewStart?.(); }}
            onPointerLeave={onPreviewEnd}
            onFocus={onPreviewStart}
            onBlur={onPreviewEnd}
            style={{ color: `color-mix(in srgb, ${entity.frameStyle?.color ?? "#9bc5d0"} 72%, white)` }}
            aria-label={`Inspect ${entity.title}`}
            title={`Inspect ${entity.title}`}
          >
            <strong>{entity.title}</strong>
          </button>
        </div>
        {entity.subtitle || cost !== undefined || power !== undefined ? (
          <div className={styles.stats} aria-label="Card stats">
            {entity.subtitle ? <span className={styles.typeBadge}>{entity.subtitle}</span> : null}
            {classifications.length > 0 ? (
              <span className={styles.classificationBadges} aria-label="Card classifications">
                {classifications.map((classification) => (
                  <span key={classification} className={styles.classificationBadge}>
                    {classification}
                  </span>
                ))}
              </span>
            ) : null}
            {cost !== undefined ? (
              <span data-stat="cost" aria-label={`Cost ${cost}`}>
                Cost <b>{cost}</b>
              </span>
            ) : null}
            {power !== undefined ? (
              <span data-stat="power" aria-label={`Power ${power}`}>
                Pwr <b>{power}</b>
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  },
  renderActionIcon: (props) => <CyberpunkActionIcon {...props} />,
  renderControlIcon: (props) => <CyberpunkControlIcon {...props} />,
  renderText: ({ text, kind }) => (
    <span data-cyberpunk-context-text={kind}>
      <CyberpunkRulesText text={text} />
    </span>
  ),
};
