import { useState } from "react";
import { createPortal } from "react-dom";
import {
  useUserConfig,
  useSetUserConfig,
  type DiceDisplayMode,
  type DiceImageColor,
  type DicierStyle,
} from "../../engine";
import classes from "./UserConfigDialog.module.css";

// ── option lists ────────────────────────────────────────────────────────────

const DISPLAY_MODES: ReadonlyArray<{ value: DiceDisplayMode; label: string; desc: string }> = [
  { value: "shape", label: "Shape", desc: "Geometric shapes — d20 circle, d6 square, etc." },
  { value: "image", label: "Image", desc: "High-res dice photos from the HiRes Dice Pack." },
  { value: "font", label: "Font", desc: "Dicier icon font — die shapes rendered as text glyphs." },
];

const IMAGE_COLORS: ReadonlyArray<{ value: DiceImageColor; label: string }> = [
  { value: "yellow", label: "Yellow" },
  { value: "blue", label: "Blue" },
  { value: "red", label: "Red" },
  { value: "white", label: "White" },
  { value: "purple", label: "Purple" },
  { value: "green", label: "Green" },
  { value: "black", label: "Black" },
];

const DICIER_STYLES: ReadonlyArray<{ value: DicierStyle; label: string }> = [
  { value: "Round-Heavy", label: "Round – Heavy" },
  { value: "Round-Light", label: "Round – Light" },
  { value: "Round-Dark", label: "Round – Dark" },
  { value: "Flat-Heavy", label: "Flat – Heavy" },
  { value: "Flat-Light", label: "Flat – Light" },
  { value: "Flat-Dark", label: "Flat – Dark" },
  { value: "Block-Heavy", label: "Block – Heavy" },
  { value: "Block-Light", label: "Block – Light" },
  { value: "Block-Dark", label: "Block – Dark" },
  { value: "Pixel", label: "Pixel" },
];

// ── dialog ──────────────────────────────────────────────────────────────────

function UserConfigDialogContent({ onClose }: { onClose: () => void }) {
  const config = useUserConfig();
  const setConfig = useSetUserConfig();

  return (
    <div className={classes.dialog} role="dialog" aria-label="Simulator settings">
      <header className={classes.header}>
        <span className={classes.title}>Simulator Settings</span>
        <button type="button" className={classes.closeBtn} aria-label="Close" onClick={onClose}>
          ✕
        </button>
      </header>

      <div className={classes.body}>
        {/* ── dice display mode ── */}
        <fieldset className={classes.fieldset}>
          <legend className={classes.legend}>Dice Display</legend>
          <div className={classes.radioGroup}>
            {DISPLAY_MODES.map(({ value, label, desc }) => (
              <label
                key={value}
                className={`${classes.radioRow} ${config.diceDisplayMode === value ? classes.radioRowActive : ""}`}
              >
                <input
                  type="radio"
                  className={classes.radioInput}
                  name="diceDisplayMode"
                  value={value}
                  checked={config.diceDisplayMode === value}
                  onChange={() => setConfig({ diceDisplayMode: value })}
                />
                <div className={classes.radioLabel}>
                  <span className={classes.radioTitle}>{label}</span>
                  <span className={classes.radioDesc}>{desc}</span>
                </div>
              </label>
            ))}
          </div>
        </fieldset>

        {/* ── image color (only when mode = image) ── */}
        {config.diceDisplayMode === "image" && (
          <fieldset className={classes.fieldset}>
            <legend className={classes.legend}>Dice Color</legend>
            <div className={classes.colorGrid}>
              {IMAGE_COLORS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  aria-label={label}
                  aria-pressed={config.diceImageColor === value}
                  className={`${classes.colorChip} ${classes[`color_${value}`] ?? ""} ${config.diceImageColor === value ? classes.colorChipActive : ""}`}
                  onClick={() => setConfig({ diceImageColor: value })}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {/* ── font style (only when mode = font) ── */}
        {config.diceDisplayMode === "font" && (
          <fieldset className={classes.fieldset}>
            <legend className={classes.legend}>Font Style</legend>
            <select
              className={classes.select}
              value={config.dicierStyle}
              onChange={(e) => setConfig({ dicierStyle: e.target.value as DicierStyle })}
            >
              {DICIER_STYLES.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </fieldset>
        )}

        <fieldset className={classes.fieldset}>
          <legend className={classes.legend}>Sound Volume</legend>
          <div className={classes.sliderRow}>
            <input
              type="range"
              className={classes.slider}
              min={0}
              max={100}
              step={1}
              value={config.soundVolume}
              aria-label="Sound volume"
              onChange={(e) => setConfig({ soundVolume: e.currentTarget.valueAsNumber })}
            />
            <span className={classes.sliderValue}>{config.soundVolume}%</span>
          </div>
        </fieldset>
      </div>
    </div>
  );
}

// ── trigger button + overlay ─────────────────────────────────────────────────

export function UserConfigButton() {
  const [open, setOpen] = useState(false);
  const overlay = open ? (
    <div
      role="presentation"
      className={classes.overlay}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          setOpen(false);
        }
      }}
    >
      <div>
        <UserConfigDialogContent onClose={() => setOpen(false)} />
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        className={classes.triggerBtn}
        data-testid="rail-display"
        aria-label="Open simulator settings"
        onClick={() => setOpen(true)}
      >
        ⚙ Settings
      </button>

      {overlay ? createPortal(overlay, document.body) : null}
    </>
  );
}
