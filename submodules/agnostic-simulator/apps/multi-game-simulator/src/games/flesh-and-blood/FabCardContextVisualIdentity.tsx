import type {
  CardContextMenuVisualIdentity,
  CardContextMenuActionIconProps,
  CardContextMenuControlIconProps,
} from "@tcg/simulator-ui";
import { Archive, CircleOff, Eye, Image, RotateCw, SkipForward, X, Zap } from "lucide-react";

import { FabOfficialIcon, FabPitchGem } from "./FabIconography";
import { FabSymbolText } from "./FabSymbolText";
import styles from "./FabCardContextVisualIdentity.module.css";

type FabActionIconKind =
  | "play"
  | "pitch"
  | "defend"
  | "attack"
  | "arsenal"
  | "activate"
  | "yield-enable"
  | "yield-disable"
  | "inspect";

function statValue(
  stats: readonly { label: string; value: string }[],
  label: string,
): string | undefined {
  return stats.find((stat) => stat.label.toLocaleLowerCase() === label)?.value;
}

function actionIconKind(action: CardContextMenuActionIconProps["action"]): FabActionIconKind {
  const source = `${action.id} ${action.label}`.toLocaleLowerCase();
  if (source.includes("stop auto-yield")) return "yield-disable";
  if (source.includes("auto-yield")) return "yield-enable";
  if (source.includes("pitch")) return "pitch";
  if (source.includes("defend") || source.includes("block")) return "defend";
  if (source.includes("arsenal")) return "arsenal";
  if (source.includes("attack")) return "attack";
  if (source.includes("activate")) return "activate";
  if (source.includes("inspect") || source.includes("view")) return "inspect";
  return "play";
}

/** One authoritative FAB action-to-icon map for every card context action. */
export function FabActionIcon({ action }: CardContextMenuActionIconProps) {
  const kind = actionIconKind(action);
  switch (kind) {
    case "pitch":
      return <FabOfficialIcon id="resource" size={17} />;
    case "defend":
      return <FabOfficialIcon id="defense" size={17} />;
    case "attack":
      return <FabOfficialIcon id="power" size={17} />;
    case "arsenal":
      return <Archive size={17} strokeWidth={2} aria-hidden="true" />;
    case "activate":
      return <RotateCw size={17} strokeWidth={2} aria-hidden="true" />;
    case "yield-enable":
      return <SkipForward size={17} strokeWidth={2} aria-hidden="true" />;
    case "yield-disable":
      return <CircleOff size={17} strokeWidth={2} aria-hidden="true" />;
    case "inspect":
      return <Eye size={17} strokeWidth={2} aria-hidden="true" />;
    case "play":
      return <Zap size={17} strokeWidth={2.2} aria-hidden="true" />;
  }
}

function FabControlIcon({ control }: CardContextMenuControlIconProps) {
  switch (control) {
    case "preview":
      return <Image size={16} strokeWidth={2} aria-hidden="true" />;
    case "detailed-mode":
    case "quick-mode":
      return (
        <span className={styles.modeLabel} aria-hidden="true">
          Details
        </span>
      );
    case "close":
      return <X size={18} strokeWidth={2} aria-hidden="true" />;
  }
}

export const FAB_CARD_CONTEXT_VISUAL_IDENTITY: CardContextMenuVisualIdentity = {
  className: styles.surface,
  hideDisabledActionsInQuickMode: true,
  dismissPreviewOnOpen: true,
  anchorAboveOnMobile: true,
  renderIdentity: ({ entity }) => {
    const power = statValue(entity.stats, "power");
    const defense = statValue(entity.stats, "defense");
    const life = statValue(entity.stats, "life");
    const cost = statValue(entity.stats, "cost");
    const pitch = statValue(entity.stats, "pitch");
    const isAlly = /\bally\b/iu.test(entity.subtitle);
    return (
      <div className={styles.identity} data-fab-card-context-identity>
        <div className={styles.primaryRow}>
          <strong title={entity.title}>{entity.title}</strong>
          <span
            className={styles.statGroup}
            aria-label={isAlly ? "Power and life" : "Power and defense"}
          >
            {power !== undefined ? (
              <span className={styles.stat} aria-label={`Power ${power}`}>
                <FabOfficialIcon id="power" size={17} />
                <b>{power}</b>
              </span>
            ) : null}
            {!isAlly && defense !== undefined ? (
              <span className={styles.stat} aria-label={`Defense ${defense}`}>
                <FabOfficialIcon id="defense" size={17} />
                <b>{defense}</b>
              </span>
            ) : null}
            {isAlly && life !== undefined ? (
              <span className={styles.stat} aria-label={`Life ${life}`}>
                <FabOfficialIcon id="life" size={17} />
                <b>{life}</b>
              </span>
            ) : null}
          </span>
        </div>
        <div className={styles.secondaryRow}>
          <span title={entity.subtitle}>{entity.subtitle}</span>
          <span className={styles.statGroup} aria-label="Cost and pitch">
            {cost !== undefined ? (
              <span className={styles.stat} aria-label={`Cost ${cost}`}>
                <FabOfficialIcon id="cost" size={17} />
                <b>{cost}</b>
              </span>
            ) : null}
            {pitch !== undefined ? (
              <span className={styles.pitch} aria-label={`Pitch ${pitch}`}>
                <FabPitchGem pitch={Number(pitch)} size={19} />
                <b>{pitch}</b>
              </span>
            ) : null}
          </span>
        </div>
      </div>
    );
  },
  renderActionIcon: (props) => <FabActionIcon {...props} />,
  renderControlIcon: (props) => <FabControlIcon {...props} />,
  renderText: ({ text }) => <FabSymbolText text={text} />,
};
