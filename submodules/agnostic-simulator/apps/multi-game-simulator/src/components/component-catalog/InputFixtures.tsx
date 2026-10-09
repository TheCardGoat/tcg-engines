import { useId, useState } from "react";
import type { SimulatorEntity, SimulatorTable } from "@tcg/simulator-contract";
import {
  SimulatorEntityVisual,
  CardInteractionFrame,
  CardInspector,
  CardDetailSheet,
  CardActionPicker,
  ChoiceChips,
  ChoiceModal,
  ChoiceResolutionOverlay,
  PromptBanner,
  TargetFilterModal,
  CardPresentationPlane,
  PendingResolutionCards,
  PointerDragDropSurface,
  PointerDraggable,
  PointerDroppable,
  DropTargetFrame,
  CombatIntentOverlay,
  TargetingOverlay,
  TargetingArrow,
  TargetingSpotlight,
  TargetingPreviewBadge,
  TargetingProvider,
} from "@tcg/simulator-ui";
import { LiveFixtureFrame as Frame } from "./LiveFixtureFrame";
import classes from "./LiveFixtures.module.css";

export const inspectionFixtureComponents = [
  "CardInspector",
  "CardDetailSheet",
  "CardActionPicker",
  "CardInteractionFrame",
  "ChoiceChips",
  "ChoiceModal",
  "ChoiceResolutionOverlay",
  "PromptBanner",
  "TargetFilterModal",
  "ResolvingEntityStage",
  "CardPresentationPlane",
  "PendingResolutionCards",
  "CardInspectionDialog",
] as const;
export function InspectionFixtures({
  entities,
  table,
}: {
  entities: readonly SimulatorEntity[];
  table?: SimulatorTable;
}) {
  const first = entities.find((e) => e.face === "public");
  const cards = entities.filter((e) => e.face === "public").slice(0, 5);
  const [open, setOpen] = useState<"sheet" | "actions" | "choices" | "order" | "targets" | null>(
    null,
  );
  const [selected, setSelected] = useState<string[]>([]);
  const [multi, setMulti] = useState(false);
  const [result, setResult] = useState("No preview action submitted.");
  const [stage, setStage] = useState(true);
  const [hidden, setHidden] = useState(false);
  const previewTable: SimulatorTable = table ?? {
    seats: [],
    zones: [],
    status: { turn: 1, phase: "Preview", stateVersion: 0, activeSeatId: "" },
  };
  if (!first) return <p>No public cards in this fixture. Select another fixture.</p>;
  const visual = (
    <div className={classes.card}>
      <SimulatorEntityVisual entity={first} density="large" />
    </div>
  );
  const choose = (text: string) => {
    setResult(`Preview result: ${text}`);
    setOpen(null);
  };
  return (
    <>
      <div className={classes.grid}>
        <Frame
          title="Card inspection and action picker"
          components={[
            "CardInspector",
            "CardDetailSheet",
            "CardActionPicker",
            "CardInteractionFrame",
          ]}
        >
          <CardInspector entity={first}>{visual}</CardInspector>
          <div className={classes.controls}>
            <button onClick={() => setOpen("sheet")}>Open card details</button>
            <button onClick={() => setOpen("actions")}>Open action picker</button>
          </div>
          <div className={classes.cards}>
            {(["idle", "actionable", "selected", "targetable"] as const).map((kind) => (
              <div key={kind} className={classes.card}>
                <CardInteractionFrame
                  state={
                    kind === "idle"
                      ? { kind }
                      : kind === "targetable"
                        ? { kind, label: "Preview target" }
                        : { kind, actionCount: 2 }
                  }
                >
                  <SimulatorEntityVisual entity={first} density="compact" />
                </CardInteractionFrame>
              </div>
            ))}
          </div>
        </Frame>
        <Frame
          title="Choice, order and target dialogs"
          components={[
            "ChoiceChips",
            "ChoiceModal",
            "ChoiceResolutionOverlay",
            "TargetFilterModal",
            "PromptBanner",
          ]}
        >
          <label>
            <input
              type="checkbox"
              checked={multi}
              onChange={(e) => {
                setMulti(e.target.checked);
                setSelected([]);
              }}
            />{" "}
            Multiple choices
          </label>
          <ChoiceChips
            options={cards.map((e) => ({ id: e.id, label: e.title }))}
            multi={multi}
            selectedIds={selected}
            onSelect={setSelected}
          />
          <PromptBanner
            promptText="Choose cards in this local preview."
            onCancel={() => setSelected([])}
            onConfirm={() => choose(selected.join(", "))}
          />
          <div className={classes.controls}>
            <button onClick={() => setOpen("choices")}>Open choice dialog</button>
            <button onClick={() => setOpen("order")}>Open ordering dialog</button>
            <button onClick={() => setOpen("targets")}>Open target browser</button>
          </div>
        </Frame>
        <Frame
          title="Resolving card stage"
          components={["ResolvingEntityStage", "CardPresentationPlane", "PendingResolutionCards"]}
        >
          <div className={classes.controls}>
            <label>
              <input type="checkbox" checked={stage} onChange={(e) => setStage(e.target.checked)} />{" "}
              Resolving effect active
            </label>
            <label>
              <input
                type="checkbox"
                checked={hidden}
                onChange={(e) => setHidden(e.target.checked)}
              />{" "}
              Hidden resolving card
            </label>
          </div>
          <div style={{ position: "relative", height: 330, width: "100%" }}>
            <div className={classes.card}>
              <SimulatorEntityVisual entity={first} density="normal" />
            </div>
            <CardPresentationPlane>
              <PendingResolutionCards
                elevated
                current={
                  stage
                    ? {
                        entity: { ...first, face: hidden ? "hidden" : "public" },
                        anchorId: "catalog-resolving",
                        label: "Resolving",
                      }
                    : null
                }
              />
            </CardPresentationPlane>
          </div>
        </Frame>
      </div>
      <CardDetailSheet entity={first} open={open === "sheet"} onClose={() => setOpen(null)} />
      <CardActionPicker
        model={
          open === "actions"
            ? {
                entity: first,
                actions: [
                  {
                    id: "preview-inspect",
                    sourceEntityIds: [first.id],
                    label: "Inspect preview card",
                  },
                  {
                    id: "preview-disabled",
                    sourceEntityIds: [first.id],
                    label: "Unavailable action",
                    disabledReason: "Disabled fixture state",
                  },
                ],
              }
            : null
        }
        onClose={() => setOpen(null)}
        onChoose={choose}
      />
      <ChoiceModal
        open={open === "choices"}
        title="Preview choice"
        options={cards.map((e) => ({ id: e.id, label: e.title }))}
        onSelect={choose}
        onClose={() => setOpen(null)}
      />
      <ChoiceResolutionOverlay
        open={open === "order"}
        title="Preview ordering"
        entities={cards}
        selectedIds={selected.length ? selected : cards.slice(0, 2).map((e) => e.id)}
        ordered
        onClose={() => setOpen(null)}
        onConfirm={(ids) => choose(ids.join(" → "))}
      />
      <TargetFilterModal
        opened={open === "targets"}
        title="Preview target browser"
        filter={{ kind: "entity" }}
        table={previewTable}
        entities={cards}
        onSelect={(e) => choose(e.title)}
        onClose={() => setOpen(null)}
      />
      <p role="status" className={classes.result}>
        {result}
      </p>
    </>
  );
}
export const dragFixtureComponents = [
  "PointerDragDropSurface",
  "PointerDraggable",
  "PointerDroppable",
  "DropTargetFrame",
] as const;
export function DragFixtures({ entities }: { entities: readonly SimulatorEntity[] }) {
  const card = entities.find((e) => e.face === "public");
  const [disabled, setDisabled] = useState(false);
  const [accepted, setAccepted] = useState(true);
  const [placed, setPlaced] = useState(false);
  const [result, setResult] = useState("Drag the card, or focus it and use Space, arrows, Space.");
  const id = useId();
  if (!card) return <p>Select a fixture with a public card.</p>;
  const visual = (
    <div className={classes.card}>
      <SimulatorEntityVisual entity={card} density="large" />
    </div>
  );
  return (
    <Frame title="Pointer, touch and keyboard drag/drop" components={dragFixtureComponents}>
      <div className={classes.controls}>
        <label>
          <input
            type="checkbox"
            checked={disabled}
            onChange={(e) => setDisabled(e.target.checked)}
          />{" "}
          Disable dragging
        </label>
        <label>
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
          />{" "}
          Accept drops
        </label>
        <button
          onClick={() => {
            setPlaced(false);
            setResult("Preview reset.");
          }}
        >
          Reset drag fixture
        </button>
      </div>
      <PointerDragDropSurface
        id={id}
        decodeSource={(value) => (value === card.id ? card : null)}
        renderOverlay={() => visual}
        onDragCancel={() => setResult("Drag cancelled.")}
        onDragEnd={(_source, over) => {
          const valid = accepted && over === `${id}-target`;
          setResult(valid ? "Drop accepted by preview." : "Drop rejected; card returns to source.");
          if (valid) setPlaced(true);
          return { kind: valid ? "accepted" : "rejected" };
        }}
      >
        <div className={classes.stage}>
          <div className={classes.drop} aria-label="Drag source">
            {!placed && (
              <PointerDraggable
                id={card.id}
                disabled={disabled}
                transformBehavior="overlay-only"
                aria-label={`Drag ${card.title}`}
              >
                {visual}
              </PointerDraggable>
            )}
          </div>
          <PointerDroppable
            id={`${id}-target`}
            className={classes.drop}
            aria-label="Drop destination"
          >
            {({ isOver }) => (
              <>
                {placed ? visual : <span>Drop destination</span>}
                <DropTargetFrame
                  theme={{ accent: "var(--game-accent, #67e8f9)", surface: "#172536" }}
                  label={accepted ? "Allowed" : "Rejected"}
                  isOver={isOver}
                />
              </>
            )}
          </PointerDroppable>
        </div>
      </PointerDragDropSurface>
      <p role="status" className={classes.result}>
        {result}
      </p>
    </Frame>
  );
}
export const targetingFixtureComponents = [
  "CombatIntentOverlay",
  "TargetingOverlay",
  "TargetingArrow",
  "TargetingSpotlight",
  "TargetingPreviewBadge",
  "TargetingProvider",
] as const;
export function TargetingFixtures({ entities }: { entities: readonly SimulatorEntity[] }) {
  const id = `catalog-targets-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const cards = entities.filter((e) => e.face === "public").slice(0, 3);
  const [phase, setPhase] = useState<"declared" | "redirected" | "resolving">("declared");
  const [active, setActive] = useState(true);
  const [damage, setDamage] = useState(3);
  const [banish, setBanish] = useState(false);
  const [spotlight, setSpotlight] = useState(false);
  const [mode, setMode] = useState<"combat" | "targets">("combat");
  const source = cards[0],
    target = phase === "redirected" ? (cards[2] ?? cards[1]) : cards[1];
  return (
    <Frame title="Combat intent and target geometry" components={targetingFixtureComponents}>
      <div className={classes.controls}>
        <label>
          Combat phase{" "}
          <select
            value={phase}
            onChange={(e) =>
              setPhase(
                e.target.value === "redirected"
                  ? "redirected"
                  : e.target.value === "resolving"
                    ? "resolving"
                    : "declared",
              )
            }
          >
            <option>declared</option>
            <option>redirected</option>
            <option>resolving</option>
          </select>
        </label>
        <label>
          Overlay{" "}
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value === "targets" ? "targets" : "combat")}
          >
            <option value="combat">Combat intent</option>
            <option value="targets">Target selection</option>
          </select>
        </label>
        <label>
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />{" "}
          Active target
        </label>
        <label>
          <input
            type="checkbox"
            checked={spotlight}
            onChange={(e) => setSpotlight(e.target.checked)}
          />{" "}
          Spotlight
        </label>
        <label>
          <input type="checkbox" checked={banish} onChange={(e) => setBanish(e.target.checked)} />{" "}
          Banish preview
        </label>
        <label>
          Damage{" "}
          <input
            type="number"
            min={0}
            max={20}
            value={damage}
            onChange={(e) => setDamage(Math.max(0, Math.min(20, Number(e.target.value))))}
          />
        </label>
      </div>
      <TargetingProvider active={active} candidateIds={target ? [target.id] : []}>
        <div id={id} className={classes.stage}>
          {cards.map((card) => (
            <div
              key={card.id}
              className={classes.card}
              data-sim-entity-id={card.id}
              data-entity-id={card.id}
            >
              <SimulatorEntityVisual entity={card} density="large" />
            </div>
          ))}
          {source && target && mode === "combat" && (
            <CombatIntentOverlay
              containerSelector={`#${id}`}
              intent={
                active
                  ? {
                      id,
                      attackerEntityId: source.id,
                      declaredTarget: { kind: "entity", id: cards[1]!.id },
                      currentTarget: { kind: "entity", id: target.id },
                      phase,
                      attackKind: "fight",
                      ariaLabel: "Preview combat intent",
                    }
                  : null
              }
            />
          )}
          {source && target && mode === "targets" && (
            <TargetingOverlay
              containerSelector={`#${id}`}
              targetingIntents={
                active
                  ? [
                      {
                        id,
                        sourceEntityId: source.id,
                        targetEntityIds: [target.id],
                        targetZoneIds: [],
                        preview: { damage, banish },
                      },
                    ]
                  : []
              }
              showSpotlight={spotlight}
            />
          )}
        </div>
      </TargetingProvider>
      <svg width="280" height="80" aria-label="Arrow styles">
        <TargetingArrow x1={10} y1={60} x2={125} y2={20} animated={active} />
        <TargetingArrow x1={150} y1={60} x2={270} y2={20} curved={false} animated={false} />
      </svg>
      <div style={{ position: "relative", height: 100 }}>
        <TargetingPreviewBadge x={80} y={70} damage={banish ? undefined : damage} banish={banish} />
        {spotlight && (
          <TargetingSpotlight
            sourceX={20}
            sourceY={70}
            targetX={200}
            targetY={30}
            width={280}
            height={100}
          />
        )}
      </div>
    </Frame>
  );
}
