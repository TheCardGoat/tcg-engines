import { useId, useState } from "react";
import type { SimulatorEntity, SimulatorTable } from "@tcg/simulator-contract";
import {
  CardDetailSheet,
  ClockReadout,
  CompactHandZone,
  MobileBattlefieldLane,
  MobileHandDock,
  MobileMirrorLedger,
  MobilePlayerRail,
  MobilePortraitBoard,
  MobileZoneInventoryPopover,
  SimulatorEntityVisual,
  TabletopCounterBadge,
  hiddenCardEntity,
} from "@tcg/simulator-ui";
import { LiveFixtureFrame as Frame } from "./LiveFixtureFrame";
import classes from "./MobileBoardFixtures.module.css";
import shared from "./LiveFixtures.module.css";

export const mobileBoardComponents = [
  "MobileBattlefieldLane",
  "MobileHandDock",
  "MobileMirrorLedger",
  "MobilePlayerRail",
  "MobilePortraitBoard",
  "MobileZoneInventoryPopover",
] as const;

export default function MobileBoardFixtures({
  entities,
  table,
}: {
  entities: readonly SimulatorEntity[];
  table?: SimulatorTable;
}) {
  const id = useId();
  const source = entities.filter((entity) => entity.face === "public").slice(0, 5);
  const [inspected, setInspected] = useState<SimulatorEntity | null>(null);
  const [count, setCount] = useState(6);
  const [vertical, setVertical] = useState(false);
  const [priority, setPriority] = useState(true);
  const [summaries, setSummaries] = useState(true);
  const [center, setCenter] = useState(true);
  const [result, setResult] = useState("Inspect a field card or open a zone inventory.");
  const field = (side: "opponent" | "player") =>
    Array.from({ length: source.length ? count : 0 }, (_, index) => ({
      ...source[index % source.length]!,
      id: `${id}-${side}-${index}`,
    }));
  const hand = source.map((entity) => ({ ...entity, id: `${id}-hand-${entity.id}` }));
  const hiddenHand = source.map((entity) => ({
    ...hiddenCardEntity(entity.backImageUrl, entity.hiddenBackLayout),
    id: `${id}-hidden-${entity.id}`,
  }));
  const inventory = (side: "opponent" | "player") => (
    <MobileZoneInventoryPopover
      label={`${side === "player" ? "Your" : "Rival"} zones`}
      panelLabel={`${side} zone inventory`}
      placement={side === "player" ? "top-end" : "bottom-end"}
    >
      <div className={classes.inventory}>
        <strong>{side === "player" ? "Your" : "Rival"} zones</strong>
        {(table?.zones ?? [])
          .filter(
            (zone) =>
              !zone.ownerId ||
              zone.ownerId ===
                table?.seats.find(
                  (seat) => seat.perspective === (side === "player" ? "bottom" : "top"),
                )?.id,
          )
          .map((zone) => (
            <div key={zone.id} data-zone-inventory-section={zone.id}>
              {zone.label}: {zone.count}
            </div>
          ))}
        {!table && <p>No projected zone counts for this fixture.</p>}
        <button
          onClick={() => setResult(`${side} inventory action selected. No match was changed.`)}
        >
          Preview inventory action
        </button>
      </div>
    </MobileZoneInventoryPopover>
  );
  const rail = (side: "opponent" | "player") => (
    <MobilePlayerRail
      side={side}
      left={<strong className={classes.railLabel}>{side === "player" ? "You" : "Rival"}</strong>}
      center={<ClockReadout label={`${side} clock`} labelMode="aria" value="12:00" />}
      right={inventory(side)}
    />
  );
  const lane = (side: "opponent" | "player") => (
    <MobileBattlefieldLane
      style={{ height: "100%" }}
      side={side}
      priority={side === "player" && priority}
      scrollAxis={vertical ? "vertical" : "horizontal"}
      scrollTargetSelector="[data-preview-field]"
      scrollCueLabel={`${side} preview field`}
    >
      <div
        data-preview-field
        className={classes.field}
        data-axis={vertical ? "vertical" : "horizontal"}
        tabIndex={0}
        role="region"
        aria-label={`${side} field cards`}
      >
        {field(side).map((entity) => (
          <button
            key={entity.id}
            className={classes.card}
            aria-label={`Inspect ${side} ${entity.title}`}
            onClick={() => {
              setInspected(entity);
              setResult(`Inspecting ${entity.title}. No match was changed.`);
            }}
          >
            <SimulatorEntityVisual entity={entity} density="large" />
          </button>
        ))}
      </div>
    </MobileBattlefieldLane>
  );
  return (
    <Frame title="Portrait board and mobile controls" components={mobileBoardComponents}>
      <p>
        This embedded board uses the shared production layout. Scroll crowded lanes or use their
        edge controls. The rival hand remains hidden.
      </p>
      <div className={shared.controls}>
        <label>
          Field cards{" "}
          <input
            aria-label="Mobile field card count"
            type="range"
            min={0}
            max={12}
            value={count}
            onChange={(event) => setCount(Number(event.target.value))}
          />
          {count}
        </label>
        <label>
          <input
            type="checkbox"
            checked={vertical}
            onChange={(event) => setVertical(event.target.checked)}
          />{" "}
          Vertical lanes
        </label>
        <label>
          <input
            type="checkbox"
            checked={priority}
            onChange={(event) => setPriority(event.target.checked)}
          />{" "}
          Player priority
        </label>
        <label>
          <input
            type="checkbox"
            checked={summaries}
            onChange={(event) => setSummaries(event.target.checked)}
          />{" "}
          Zone summaries
        </label>
        <label>
          <input
            type="checkbox"
            checked={center}
            onChange={(event) => setCenter(event.target.checked)}
          />{" "}
          Ledger center
        </label>
      </div>
      <div className={classes.stage}>
        <MobilePortraitBoard
          style={{ position: "absolute" }}
          aria-label="Embedded portrait board"
          topRail={rail("opponent")}
          bottomRail={rail("player")}
          opponentHand={<CompactHandZone entities={hiddenHand} ariaLabel="Hidden rival hand" />}
          opponentBattlefield={lane("opponent")}
          playerBattlefield={lane("player")}
          opponentZoneSummary={
            summaries ? (
              <span className={classes.summary}>
                Rival field · {source.length ? count : 0} cards
              </span>
            ) : null
          }
          playerZoneSummary={
            summaries ? (
              <span className={classes.summary}>
                Your field · {source.length ? count : 0} cards
              </span>
            ) : null
          }
          ledger={
            <MobileMirrorLedger
              left={<TabletopCounterBadge label="Rival sample" value={3} />}
              center={center ? <span>Turn preview</span> : null}
              right={<TabletopCounterBadge label="Your sample" value={3} />}
            />
          }
          playerHand={
            <MobileHandDock>
              <CompactHandZone
                entities={hand}
                ariaLabel="Your preview hand"
                onSelect={(entity) => {
                  setInspected(entity);
                  setResult(`Selected ${entity.title}. No match was changed.`);
                }}
              />
            </MobileHandDock>
          }
        />
      </div>
      {source[0] && (
        <CardDetailSheet
          entity={inspected ?? source[0]}
          open={inspected !== null}
          onClose={() => setInspected(null)}
        />
      )}
      <p role="status" className={shared.result}>
        {result}
      </p>
    </Frame>
  );
}
