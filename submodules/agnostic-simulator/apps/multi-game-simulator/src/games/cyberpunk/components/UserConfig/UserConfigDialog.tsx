import { BackgroundMusicControls } from "../../audio/BackgroundMusic";
import { useState } from "react";
import { SimulatorSettingsDialog } from "../../../../simulator/participant-actions/SimulatorParticipantActions";
import { SIMULATOR_SOUND_PACKS } from "../../../../simulator/audio";
import { useSimulatorAuth } from "../../../../simulator/providers";
import { normalizeSoundPack, useSimulatorSettings } from "../../../../simulator/settings";
import {
  useUserConfig,
  useSetUserConfig,
  useCyberpunkVisualSelection,
  useSetCyberpunkVisualSelection,
  type DiceDisplayMode,
  type DiceImageColor,
  type DicierStyle,
  type FieldCardSize,
} from "../../engine";
import { resolveCyberpunkPlaymat } from "../../playmats";
import {
  CYBERPUNK_CARD_BACK_OPTIONS,
  CYBERPUNK_PLAYMAT_OPTIONS,
  cyberpunkCardBackUrl,
  resolveCyberpunkCardBackId,
  resolveCyberpunkPlaymatId,
} from "../../visualAppearance";
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

const FIELD_CARD_SIZES: ReadonlyArray<{ value: FieldCardSize; label: string; desc: string }> = [
  { value: "compact", label: "Compact", desc: "Smaller field cards for more board context." },
  {
    value: "standard",
    label: "Standard",
    desc: "Balanced size. Fits three field cards on phones.",
  },
  { value: "large", label: "Large", desc: "Larger field cards when readability matters most." },
];

// ── dialog ──────────────────────────────────────────────────────────────────

// SETTINGS PARITY: keep in sync with the platform web app's GameSettingsFields.svelte (Cyberpunk).
export function CyberpunkSettingsFields() {
  const config = useUserConfig();
  const setConfig = useSetUserConfig();
  const visual = useCyberpunkVisualSelection();
  const setVisual = useSetCyberpunkVisualSelection();
  const auth = useSimulatorAuth();
  const { settings, setSoundPack } = useSimulatorSettings();
  return (
    <div className={classes.body}>
      <fieldset className={classes.fieldset}>
        <legend className={classes.legend}>Playmat</legend>
        <select
          className={classes.select}
          aria-label="Playmat"
          value={visual.playmatId}
          onChange={(event) =>
            setVisual({ playmatId: resolveCyberpunkPlaymatId(event.currentTarget.value) })
          }
        >
          {CYBERPUNK_PLAYMAT_OPTIONS.map((option) => (
            <option key={option.id} value={option.id} disabled={option.premium && !auth.isPremium}>
              {option.premium && !auth.isPremium ? `${option.label} · Supporter` : option.label}
            </option>
          ))}
        </select>
        {resolveCyberpunkPlaymat(visual.playmatId).src ? (
          <img
            className={classes.playmatPreview}
            src={resolveCyberpunkPlaymat(visual.playmatId).src ?? undefined}
            alt={`${CYBERPUNK_PLAYMAT_OPTIONS.find((option) => option.id === visual.playmatId)?.label ?? "Playmat"} preview`}
          />
        ) : null}
      </fieldset>

      <fieldset className={classes.fieldset}>
        <legend className={classes.legend}>Card back</legend>
        <select
          className={classes.select}
          aria-label="Card back"
          value={visual.cardBackId}
          onChange={(event) =>
            setVisual({ cardBackId: resolveCyberpunkCardBackId(event.currentTarget.value) })
          }
        >
          {CYBERPUNK_CARD_BACK_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <img
          className={classes.cardBackPreview}
          src={cyberpunkCardBackUrl(visual.cardBackId)}
          alt={`${CYBERPUNK_CARD_BACK_OPTIONS.find((option) => option.id === visual.cardBackId)?.label ?? "Card back"} preview`}
        />
        <span className={classes.radioDesc}>Legend cards keep their distinct back.</span>
      </fieldset>

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
        <legend className={classes.legend}>Field Card Size</legend>
        <div className={classes.segmentedGroup}>
          {FIELD_CARD_SIZES.map(({ value, label, desc }) => (
            <label
              key={value}
              className={`${classes.segmentedOption} ${config.fieldCardSize === value ? classes.segmentedOptionActive : ""}`}
              title={desc}
            >
              <input
                type="radio"
                className={classes.segmentedInput}
                name="fieldCardSize"
                value={value}
                checked={config.fieldCardSize === value}
                onChange={() => setConfig({ fieldCardSize: value })}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className={classes.fieldset}>
        <legend className={classes.legend}>Payment</legend>
        <label
          className={`${classes.toggleRow} ${config.choosePaymentSources ? classes.toggleRowActive : ""}`}
        >
          <input
            type="checkbox"
            className={classes.toggleInput}
            checked={config.choosePaymentSources}
            onChange={(event) => setConfig({ choosePaymentSources: event.currentTarget.checked })}
          />
          <span className={classes.radioLabel}>
            <span className={classes.radioTitle}>Choose payment sources</span>
            <span className={classes.radioDesc}>
              Select each Eddie or Legend used to pay every cost.
            </span>
          </span>
        </label>
      </fieldset>

      <fieldset className={classes.fieldset}>
        <legend className={classes.legend}>Sound Effects</legend>
        <select
          className={classes.select}
          aria-label="Sound effects pack"
          value={settings.soundPack}
          onChange={(event) => setSoundPack(normalizeSoundPack(event.currentTarget.value))}
        >
          {SIMULATOR_SOUND_PACKS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <span className={classes.radioDesc}>
          {SIMULATOR_SOUND_PACKS.find((option) => option.id === settings.soundPack)?.description ??
            ""}{" "}
          Applies to every game's simulator.
        </span>
      </fieldset>
    </div>
  );
}

// ── trigger button + overlay ─────────────────────────────────────────────────

export function UserConfigDialog({
  opened,
  onClose,
}: {
  readonly opened: boolean;
  readonly onClose: () => void;
}) {
  return opened ? (
    <SimulatorSettingsDialog
      gameConfiguration={{
        settings: <CyberpunkSettingsFields />,
        audioSettings: <BackgroundMusicControls />,
        onSelect: () => window.location.assign("/cyberpunk/simulator"),
      }}
      accountSettingsHref="/dashboard/settings"
      onClose={onClose}
    />
  ) : null;
}

export function UserConfigButton() {
  const [open, setOpen] = useState(false);

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

      <UserConfigDialog opened={open} onClose={() => setOpen(false)} />
    </>
  );
}
