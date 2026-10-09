import { useState, type ReactNode, type ComponentType } from "react";
import type { SimulatorEntity, SimulatorTable, SimulatorZone } from "@tcg/simulator-contract";
import {
  SimulatorEntityVisualProvider,
  DefaultSimulatorEntityVisual,
  type SimulatorEntityVisualProps,
} from "@tcg/simulator-ui";
import { buildMountedHref } from "../../routes/router-paths";
import styles from "./Workbench.module.css";
import ProductionBoardPreview from "./ProductionBoardPreview";

export interface CardKnobs {
  rested: boolean;
  hidden: boolean;
  selected: boolean;
  targetable: boolean;
  highlighted: boolean;
  damage: number;
  bonus: number;
}
export const defaultKnobs: CardKnobs = {
  rested: false,
  hidden: false,
  selected: false,
  targetable: false,
  highlighted: false,
  damage: 0,
  bonus: 0,
};
export function CardKnobControls({
  value,
  onChange,
  supported = ["rested", "hidden", "selected", "targetable", "highlighted", "damage", "bonus"],
}: {
  value: CardKnobs;
  onChange: (value: CardKnobs) => void;
  supported?: readonly (keyof CardKnobs)[];
}) {
  const labels = {
    rested: "Rested / spent",
    hidden: "Face down",
    selected: "Selected",
    targetable: "Target candidate",
    highlighted: "Highlighted",
    damage: "Damage / counters",
    bonus: "Stat bonus",
  };
  return (
    <fieldset className={styles.knobs}>
      <legend>Card state controls · preview only</legend>
      {supported.map((key) => (
        <label key={key}>
          {typeof value[key] === "boolean" ? (
            <>
              <input
                type="checkbox"
                checked={value[key]}
                onChange={(event) => onChange({ ...value, [key]: event.target.checked })}
              />
              {labels[key]}
            </>
          ) : (
            <>
              {labels[key]}
              <input
                type="number"
                min={0}
                max={20}
                value={value[key]}
                onChange={(event) =>
                  onChange({
                    ...value,
                    [key]: Math.min(20, Math.max(0, Number(event.target.value))),
                  })
                }
              />
            </>
          )}
        </label>
      ))}
      <button type="button" onClick={() => onChange(defaultKnobs)}>
        Reset card states
      </button>
    </fieldset>
  );
}
export function variantEntity(entity: SimulatorEntity, knobs: CardKnobs): SimulatorEntity {
  return {
    ...entity,
    states: knobs.rested ? ["rested"] : entity.states.filter((state) => state !== "rested"),
    face: knobs.hidden ? "hidden" : entity.face,
    decorations: [
      ...(entity.decorations ?? []),
      ...(knobs.damage
        ? [
            {
              id: "catalog-damage",
              slot: "bottom-end" as const,
              ariaLabel: `${knobs.damage} damage`,
              tone: "negative" as const,
              content: { kind: "text" as const, text: String(knobs.damage) },
            },
          ]
        : []),
    ],
  };
}
export function Specimen({
  title,
  source,
  children,
}: {
  title: string;
  source: string;
  children: ReactNode;
}) {
  return (
    <section className={styles.specimen}>
      <h3>{title}</h3>
      <code>{source}</code>
      <div className={styles.objects}>{children}</div>
    </section>
  );
}
export default function Workbench({
  category,
  game,
  source,
  entities,
  boardHref,
  renderCard,
  supported,
  extra,
  zonePreview,
  controlPreview,
  counterPreview,
  boardPreview,
  visualRenderer = DefaultSimulatorEntityVisual,
}: {
  category: string;
  game: string;
  source: string;
  entities: readonly SimulatorEntity[];
  zones?: readonly SimulatorZone[];
  table?: SimulatorTable;
  boardHref: string;
  renderCard: (entity: SimulatorEntity, knobs: CardKnobs) => ReactNode;
  supported?: readonly (keyof CardKnobs)[];
  extra?: ReactNode;
  zonePreview?: ReactNode;
  controlPreview?: ReactNode;
  counterPreview?: ReactNode;
  boardPreview?: ReactNode;
  visualRenderer?: ComponentType<SimulatorEntityVisualProps>;
}) {
  const [knobs, setKnobs] = useState(defaultKnobs);
  const [selectedCard, setSelectedCard] = useState("");
  const publicCards = entities.filter(
    (entity) => entity.face === "public" && !entity.states.includes("hidden"),
  );
  const cards = selectedCard
    ? publicCards.filter((card) => card.id === selectedCard)
    : publicCards.slice(0, 8);
  const show = (name: string) => category === "All components" || category === name;
  return (
    <SimulatorEntityVisualProvider renderer={visualRenderer}>
      <div className={styles.root} data-game={game}>
        <p className={styles.note}>
          Components imported from the production game UI. Card controls change only fixture state.
        </p>
        <a href={buildMountedHref(boardHref)} target="_blank" rel="noreferrer">
          Open the complete {game} board ↗
        </a>
        {show("Cards") && (
          <>
            <CardKnobControls value={knobs} onChange={setKnobs} supported={supported} />
            <label className={styles.picker}>
              Card / type
              <select
                value={selectedCard}
                onChange={(event) => setSelectedCard(event.target.value)}
              >
                <option value="">Gallery · first eight public cards</option>
                {publicCards.map((card) => (
                  <option key={card.id} value={card.id}>
                    {card.title} · {card.kind}
                  </option>
                ))}
              </select>
            </label>
            <Specimen title="Card faces and state permutations" source={source}>
              {cards.map((card) => (
                <div key={card.id} className={styles.card}>
                  <div>{renderCard(card, knobs)}</div>
                  <small>{card.title}</small>
                </div>
              ))}
            </Specimen>
            {extra}
            <p role="status">
              {publicCards.length} public cards available. Use the selector to inspect each card.
            </p>
          </>
        )}
        {show("Zones") && zonePreview}
        {show("Controls") && controlPreview}
        {show("Counters") && counterPreview}
        {category === "Production board" &&
          (boardPreview ?? <ProductionBoardPreview href={boardHref} game={game} />)}
        {category === "Zones" && !zonePreview && (
          <p className={styles.note}>
            This zone is not isolated yet. Use Production board to inspect its actual composition.
          </p>
        )}
        {category === "Counters" && !counterPreview && (
          <p className={styles.note}>
            Counters are rendered by the production cards and board. Use Production board to inspect
            them.
          </p>
        )}
        {category === "Controls" && !controlPreview && (
          <p className={styles.note}>Use Production board to inspect the game’s actual controls.</p>
        )}
        {category === "Dice" && (
          <p className={styles.note}>No dedicated dice preview is registered for this game.</p>
        )}
      </div>
    </SimulatorEntityVisualProvider>
  );
}
