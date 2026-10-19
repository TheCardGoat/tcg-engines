import { useState } from "react";
import { Popover, Tooltip } from "@mantine/core";
import { ArenaIndicator } from "../../games/alpha-clash/components/Arena3D/ArenaIndicator";
import { arenaAssets } from "../../games/alpha-clash/components/Arena3D/assets";
import { ArenaTurnConsole } from "../../games/alpha-clash/components/Arena3D/ArenaTurnConsole";
import styles from "./alpha-clash-indicators-preview.module.css";

type Kind = "health" | "deck" | "oblivion" | "banished";
type State = "normal" | "empty" | "hover" | "selection";
const indicators: { kind: Kind; label: string; count: number; detail: string }[] = [
  {
    kind: "health",
    label: "Contender health",
    count: 18,
    detail: "Current health of your contender.",
  },
  {
    kind: "deck",
    label: "Deck",
    count: 45,
    detail: "Cards remaining in your deck. Card identities stay hidden.",
  },
  {
    kind: "oblivion",
    label: "Oblivion",
    count: 7,
    detail: "Open the Oblivion Zone to inspect its visible cards.",
  },
  {
    kind: "banished",
    label: "Banished",
    count: 3,
    detail: "Open the Banished Zone to inspect its visible cards.",
  },
];
const states: { id: State; label: string; hint: string }[] = [
  { id: "normal", label: "Normal", hint: "Quiet metal" },
  { id: "empty", label: "Empty / zero", hint: "Count stays legible" },
  { id: "hover", label: "Hover", hint: "Brighter bevel" },
  { id: "selection", label: "Selection", hint: "Click to toggle" },
];

function Indicator({
  kind,
  label,
  count,
  detail,
  state,
  onChange,
}: (typeof indicators)[number] & {
  state: State;
  onChange: (message: string) => void;
}) {
  const [selected, setSelected] = useState(true);
  const [opened, setOpened] = useState(false);
  const value = state === "empty" ? 0 : count;
  const summary = `${label} · ${value}${kind === "health" ? " health" : " cards"}`;
  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      onDismiss={() => setOpened(false)}
      position="top"
      withArrow
      shadow="md"
      width={230}
    >
      <Popover.Target>
        <Tooltip
          label={summary}
          position="top"
          withArrow
          events={{ hover: true, focus: true, touch: false }}
          disabled={opened}
        >
          <button
            type="button"
            className={styles.indicator}
            data-kind={kind}
            data-empty={state === "empty" || undefined}
            data-hover={state === "hover" || undefined}
            data-selectable={state === "selection" || undefined}
            data-selected={(state === "selection" && selected) || undefined}
            aria-label={summary}
            aria-pressed={state === "selection" ? selected : undefined}
            onKeyDown={(event) => {
              if (event.key === "Escape") setOpened(false);
            }}
            onClick={() => {
              if (state === "selection") {
                setSelected(!selected);
                onChange(
                  `${label}: ${selected ? "selectable, cyan rim" : "selected, gold rim and check mark"}.`,
                );
              } else setOpened(!opened);
            }}
          >
            <ArenaIndicator
              kind={kind}
              value={value}
              hovered={state === "hover"}
              selectable={state === "selection"}
              selected={state === "selection" && selected}
            />
          </button>
        </Tooltip>
      </Popover.Target>
      <Popover.Dropdown className={styles.help}>
        <strong>{summary}</strong>
        <p>{detail}</p>
        <small>Catalog preview · no match action.</small>
      </Popover.Dropdown>
    </Popover>
  );
}

export function AlphaClashIndicatorsPreview() {
  const [lastAction, setLastAction] = useState(
    "Select any indicator for details. In the selection row, click to compare selected and selectable targets.",
  );
  return (
    <section
      id="zone-indicators"
      className={styles.preview}
      aria-labelledby="zone-indicators-title"
    >
      <header className={styles.intro}>
        <div>
          <span className={styles.eyebrow}>Alpha Clash · HUD asset study</span>
          <h3 id="zone-indicators-title">Health & zone indicators</h3>
        </div>
        <p>
          One metal finish. Four distinct silhouettes.
          <br />
          Live counts, quiet edges, clear selection.
        </p>
      </header>
      <div
        className={styles.stage}
        style={{
          backgroundImage: `linear-gradient(110deg, #071019be, #07101966), url(${arenaAssets.surface})`,
        }}
      >
        <div className={styles.reference}>
          <div>
            <span className={styles.eyebrow}>Shared visual language</span>
            <p>Slate metal · ice-blue light · warm gold selection</p>
          </div>
          <ArenaTurnConsole
            phase="primary"
            priority="you"
            turnOwner="you"
            turnNumber={17}
            instruction="Phase HUD material reference."
            onAction={() => {}}
            reducedMotion
          />
        </div>
        <div className={styles.columnLabels} aria-hidden="true">
          <span />
          {indicators.map((item) => (
            <span key={item.kind}>{item.label}</span>
          ))}
        </div>
        {states.map((state) => (
          <div
            key={state.id}
            className={styles.row}
            role="group"
            aria-label={`${state.label} indicators`}
          >
            <div className={styles.rowLabel}>
              <strong>{state.label}</strong>
              <small>{state.hint}</small>
            </div>
            {indicators.map((item) => (
              <div key={item.kind} className={styles.cell}>
                <Indicator {...item} state={state.id} onChange={setLastAction} />
                <span className={styles.mobileLabel}>{item.label}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <p className={styles.notice} role="status">
        {lastAction}
      </p>
      <p className={styles.note}>
        Hover styling is held on for comparison in the third row. Labels also appear on keyboard
        focus. Selection is a visual sample; game rules decide which targets are legal. This preview
        does not change the live board.
      </p>
    </section>
  );
}
