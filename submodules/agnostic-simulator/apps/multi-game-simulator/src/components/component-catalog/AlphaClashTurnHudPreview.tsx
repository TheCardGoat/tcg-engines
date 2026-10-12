import { useState } from "react";
import {
  ArenaTurnConsole,
  type ArenaTurnConsoleAction,
  type ArenaTurnConsoleProps,
} from "../../games/alpha-clash/components/Arena3D/ArenaTurnConsole";
import { arenaAssets } from "../../games/alpha-clash/components/Arena3D/assets";
import styles from "./alpha-clash-turn-hud-preview.module.css";

const clash: ArenaTurnConsoleAction = {
  id: "clash",
  label: "Start Clash",
  kind: "clash",
  description: "Choose attackers for a new Clash. After the Clash, return to Primary.",
};
const end: ArenaTurnConsoleAction = {
  id: "end",
  label: "End turn",
  kind: "advance",
  description: "Finish Primary and begin end-of-turn effects. You do not have to attack first.",
};
const pass: ArenaTurnConsoleAction = {
  id: "pass",
  label: "Pass response",
  kind: "pass",
  description: "Pass this response opportunity. This does not end the turn.",
};
type Sample = Pick<
  ArenaTurnConsoleProps,
  "phase" | "priority" | "turnOwner" | "instruction" | "step" | "actions"
> & { id: string; label: string };
const samples: readonly Sample[] = [
  {
    id: "primary",
    label: "Your turn · Primary",
    phase: "primary",
    turnOwner: "you",
    priority: "you",
    instruction: "Play cards, start a Clash, or end your turn.",
    actions: [clash, end],
  },
  {
    id: "opponent-response",
    label: "Your turn · Opponent responds",
    phase: "clash",
    step: "Response",
    turnOwner: "you",
    priority: "opponent",
    instruction: "Your opponent can respond to the attack.",
  },
  {
    id: "your-response",
    label: "Opponent’s turn · Your response",
    phase: "clash",
    step: "Response",
    turnOwner: "opponent",
    priority: "you",
    instruction: "Play a legal response, or pass priority.",
    actions: [pass],
  },
  {
    id: "resource",
    label: "Expansion · Resource choice",
    phase: "expansion",
    step: "Resource",
    turnOwner: "you",
    priority: "you",
    instruction: "Choose a card to place into your Resource Zone.",
    actions: [
      {
        id: "skip-resource",
        label: "Skip resource",
        kind: "advance",
        description: "Continue to Primary without placing a resource.",
      },
    ],
  },
  {
    id: "attackers",
    label: "Clash · Choose attackers",
    phase: "clash",
    step: "Attackers",
    turnOwner: "you",
    priority: "you",
    instruction: "Choose attackers on the board.",
    actions: [
      {
        id: "confirm",
        label: "Confirm attack",
        kind: "confirm",
        description: "Commit the selected attackers.",
        disabledReason: "Select a legal attacker on the board first.",
      },
    ],
  },
  {
    id: "choice",
    label: "Primary · Required card choice",
    phase: "primary",
    step: "Card choice",
    turnOwner: "you",
    priority: "you",
    instruction: "Choose a highlighted card to resolve the effect.",
  },
  {
    id: "no-attack",
    label: "Primary · No legal attackers",
    phase: "primary",
    turnOwner: "you",
    priority: "you",
    instruction: "Play cards or end your turn.",
    actions: [{ ...clash, disabledReason: "No legal attackers are available." }, end],
  },
  {
    id: "start",
    label: "Start of turn · Resolving effects",
    phase: "start",
    turnOwner: "you",
    priority: "resolving",
    instruction: "Resolve start-of-turn effects before Expansion.",
  },
  {
    id: "end",
    label: "End of turn · Resolving effects",
    phase: "end",
    turnOwner: "you",
    priority: "resolving",
    instruction: "Resolve end-of-turn effects before passing the turn.",
  },
];

export function AlphaClashTurnHudPreview() {
  const [sampleId, setSampleId] = useState("primary");
  const [compact, setCompact] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [lastAction, setLastAction] = useState("");
  const sample = samples.find((item) => item.id === sampleId) ?? samples[0];
  return (
    <section className={styles.preview} aria-labelledby="alpha-turn-hud-title">
      <header className={styles.intro}>
        <div>
          <span className={styles.eyebrow}>Turn console · design candidate</span>
          <h3 id="alpha-turn-hud-title">Phases and actions</h3>
        </div>
        <p>Floating phase icons and contextual actions. Hover or select an icon for details.</p>
      </header>
      <div className={styles.controls}>
        <label>
          Preview state
          <select
            value={sampleId}
            onChange={(event) => {
              setSampleId(event.target.value);
              setLastAction("");
            }}
          >
            {samples.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.check}>
          <input
            type="checkbox"
            checked={compact}
            onChange={(event) => setCompact(event.target.checked)}
          />
          Compact width
        </label>
        <label className={styles.check}>
          <input
            type="checkbox"
            checked={reducedMotion}
            onChange={(event) => setReducedMotion(event.target.checked)}
          />
          Reduced motion
        </label>
      </div>
      <div
        className={styles.stage}
        style={{
          backgroundImage: `linear-gradient(180deg, #07101930, #071019a6), url(${arenaAssets.surface})`,
        }}
      >
        <span className={styles.stageLabel}>
          {compact ? "Compact" : "Standard"} · up to {compact ? "236" : "248"} px
        </span>
        <div className={styles.dock} data-compact={compact || undefined}>
          <ArenaTurnConsole
            {...sample}
            turnNumber={17}
            reducedMotion={reducedMotion}
            onAction={(id) => {
              const action = sample.actions?.find((item) => item.id === id);
              setLastAction(`Preview action: ${action?.label ?? id}. No game state was changed.`);
            }}
          />
        </div>
      </div>
      <p className={styles.notice} role="status">
        {lastAction ||
          "Presentation preview. Action buttons report their intent here; they do not run a match."}
      </p>
      <details className={styles.notes}>
        <summary>Design references and asset construction</summary>
        <div className={styles.references}>
          <p>
            <strong>MTG Arena — phase visibility.</strong> A compact phase ladder and manual
            priority controls keep timing close to the action.{" "}
            <a
              href="https://magic.wizards.com/en/news/mtg-arena/mtg-arena-state-game-adventures-forgotten-realms-2021-07-02"
              target="_blank"
              rel="noreferrer"
            >
              Wizards: phase ladder and full control
            </a>
          </p>
          <p>
            <strong>Runeterra — one clear decision.</strong> The action button changes from Pass to
            Attack when attackers are prepared. Round initiative and the right to act are distinct.{" "}
            <a
              href="https://support.riotgames.com/en-us/legends-of-runeterra/gameplay/round-faq"
              target="_blank"
              rel="noreferrer"
            >
              Riot: round and response flow
            </a>
          </p>
          <p>
            <strong>Hearthstone — tactile controls.</strong> The shaped, high-contrast button is
            easy to find at the board edge. This is a visual reference; Alpha Clash also needs phase
            information and response actions.{" "}
            <a
              href="https://bnetcmsus-a.akamaihd.net/cms/gallery/O41RYLFMDBW31429007446506.jpg"
              target="_blank"
              rel="noreferrer"
            >
              Blizzard: mobile board reference
            </a>
          </p>
          <p>
            <strong>Original assets.</strong> Five editable, faceted SVG phase glyphs in metal
            sockets, with a fine baseline and bevelled action plates. Text stays live and scales
            independently. Cyan marks the current phase; contextual actions show when you can act.
            Gold is reserved for action emphasis.
          </p>
          <p>
            <strong>Phase stops.</strong> These are not enabled in this candidate. A stop must
            connect to an actual legal response window before the HUD can offer it. Phase buttons
            currently open information only.
          </p>
        </div>
      </details>
    </section>
  );
}
