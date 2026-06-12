import { useUserConfig, type DieType } from "../../engine";
import classes from "./DieDisplay.module.css";
import { getDiceImageUrl } from "./dieAssets";

/** Text code passed to the Dicier font to render a die with this face value. */
function dicierCode(dieType: DieType, faceValue: number | undefined): string {
  const sides = dieType.slice(1).toUpperCase(); // "d20" → "20"
  if (faceValue === undefined) {
    return `D${sides}`;
  }
  // Two-digit values need dlig to render correctly — handled by font-feature-settings.
  return `${faceValue}_ON_D${sides}`;
}

// ── shape mode helpers ──────────────────────────────────────────────────────

const FIXER_SHAPE: Record<DieType, string> = {
  d20: classes.circle,
  d12: classes.pentagon,
  d10: classes.diamond,
  d8: classes.octagon,
  d6: classes.square,
  d4: classes.triangle,
};

// ── sub-renderers ───────────────────────────────────────────────────────────

interface Props {
  dieType: DieType;
  faceValue?: number;
  label: string;
  side?: "rival" | "friendly";
  /** sm = fixer area (38 px), md = gig zone (42 px) */
  size?: "sm" | "md";
}

function ShapeDisplay({ dieType, faceValue, label, side, size }: Props) {
  const shape = FIXER_SHAPE[dieType] ?? classes.square;
  const text = size === "md" && faceValue !== undefined ? String(faceValue) : label;
  const isRolledGig = size === "md" && faceValue !== undefined;

  return (
    <div
      className={`${classes.fixerSlot} ${shape} ${side ? classes[side] : ""} ${isRolledGig ? classes.rolled : ""}`}
      aria-label={faceValue !== undefined ? `${label} showing ${faceValue}` : label}
    >
      <span className={classes.dieText}>{text}</span>
    </div>
  );
}

function ImageDisplay({ dieType, faceValue, label, size }: Props) {
  const { diceImageColor } = useUserConfig();
  const face = faceValue ?? 1;
  const src = getDiceImageUrl(dieType, face, diceImageColor);
  const sizeClass = size === "md" ? classes.imgMd : classes.imgSm;

  return (
    <div className={`${classes.imgWrap} ${sizeClass}`}>
      <img
        src={src}
        alt={faceValue !== undefined ? `${label} showing ${faceValue}` : label}
        className={classes.img}
      />
    </div>
  );
}

function FontDisplay({ dieType, faceValue, label, side, size }: Props) {
  const { dicierStyle } = useUserConfig();
  const code = dicierCode(dieType, faceValue);
  const fontFamily = `Dicier-${dicierStyle}`;
  const isDouble = faceValue !== undefined && faceValue >= 10;
  const sizeClass = size === "md" ? classes.fontMd : classes.fontSm;
  const sideClass = side ? classes[side] : "";

  return (
    <div
      className={`${classes.fontWrap} ${sizeClass} ${sideClass}`}
      aria-label={faceValue !== undefined ? `${label} showing ${faceValue}` : label}
    >
      <span
        style={{
          fontFamily: `'${fontFamily}', sans-serif`,
          fontFeatureSettings: isDouble
            ? '"liga" 1, "kern" 1, "calt" 1, "dlig" 1'
            : '"liga" 1, "kern" 1, "calt" 1',
        }}
      >
        {code}
      </span>
    </div>
  );
}

// ── public component ────────────────────────────────────────────────────────

export function DieDisplay(props: Props) {
  const { diceDisplayMode } = useUserConfig();

  if (diceDisplayMode === "image") {
    return <ImageDisplay {...props} />;
  }
  if (diceDisplayMode === "font") {
    return <FontDisplay {...props} />;
  }
  return <ShapeDisplay {...props} />;
}
