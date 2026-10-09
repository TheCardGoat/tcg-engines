import { useState } from "react";
import type { SimulatorEntity, SimulatorZone } from "@tcg/simulator-contract";
import {
  CardFan,
  HandZone,
  CompactHandZone,
  CardGrid,
  CardRow,
  CardStack,
  CardSlot,
  FixedSlotCardZone,
  SingleCardZone,
  DeckStackZone,
  DiscardPileZone,
  ResourceCardZone,
  DeckRevealShelf,
  MaskedCardFrame,
  TabletopAttachmentStack,
  SimulatorEntityVisual,
  EmptyZone,
} from "@tcg/simulator-ui";
import { LiveFixtureFrame as Frame } from "./LiveFixtureFrame";
import classes from "./LiveFixtures.module.css";

export const layoutFixtureComponents = [
  "CardFan",
  "HandZone",
  "CompactHandZone",
  "CardGrid",
  "CardRow",
  "CardStack",
  "CardSlot",
  "FixedSlotCardZone",
  "SingleCardZone",
  "DeckStackZone",
  "DiscardPileZone",
  "ResourceCardZone",
  "DeckRevealShelf",
  "MaskedCardFrame",
  "TabletopAttachmentStack",
  "SimulatorEntityVisual",
  "EmptyZone",
] as const;
export default function LayoutFixtures({ entities }: { entities: readonly SimulatorEntity[] }) {
  const [count, setCount] = useState(5);
  const [hidden, setHidden] = useState(false);
  const [selected, setSelected] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [direction, setDirection] = useState<"below" | "right">("below");
  const source = entities.filter((e) => e.face === "public").slice(0, 10);
  const cards = Array.from({ length: Math.min(count, source.length) }, (_, i) =>
    hidden ? { ...source[i]!, face: "hidden" as const } : source[i]!,
  );
  const zone: SimulatorZone = {
    id: "catalog-layout-zone",
    label: "Preview zone",
    hint: "Layout fixture",
    role: "hand",
    visibility: "owner",
    layoutHint: "fan",
    entityIds: cards.map((e) => e.id),
    count: cards.length,
  };
  const visual = (entity: SimulatorEntity) => (
    <div className={classes.card}>
      <SimulatorEntityVisual entity={entity} density="large" />
    </div>
  );
  return (
    <>
      <div className={classes.controls}>
        <label>
          Cards{" "}
          <input
            aria-label="Layout card count"
            type="range"
            min={0}
            max={source.length}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
          />{" "}
          {Math.min(count, source.length)}
        </label>
        <label>
          <input type="checkbox" checked={hidden} onChange={(e) => setHidden(e.target.checked)} />{" "}
          Hide card faces
        </label>
        <button
          onClick={() => {
            setCount(5);
            setHidden(false);
            setSelected("");
            setExpanded(false);
          }}
        >
          Reset layouts
        </button>
      </div>
      <div className={classes.grid}>
        <Frame title="Selectable hand fan" components={["CardFan"]}>
          <CardFan entities={cards} selectedId={selected} onSelect={(e) => setSelected(e.id)} />
        </Frame>
        <Frame title="Hand and compact hand" components={["HandZone", "CompactHandZone"]}>
          <HandZone entities={cards} selectedId={selected} onSelect={(e) => setSelected(e.id)} />
          <CompactHandZone
            entities={cards}
            selectedId={selected}
            onSelect={(e) => setSelected(e.id)}
          />
        </Frame>
        <Frame title="Grid and scrolling row" components={["CardGrid", "CardRow"]}>
          <CardGrid entities={cards} density="compact" />
          <CardRow entities={cards} wrap={false} density="compact" />
        </Frame>
        <Frame
          title="Occupied, empty and fixed slots"
          components={["CardSlot", "FixedSlotCardZone", "SingleCardZone", "EmptyZone"]}
        >
          <FixedSlotCardZone
            capacity={3}
            items={cards.slice(0, 2)}
            renderItem={visual}
            renderEmptySlot={() => <EmptyZone label="Empty slot" />}
            ariaLabel="Fixed card slots"
          />
          <CardSlot
            imageUrl={hidden ? undefined : cards[0]?.imageUrl}
            faceDown={hidden}
            label="Card slot"
          />
          <SingleCardZone
            zone={zone}
            entities={cards.slice(0, 1)}
            entityCount={cards.length ? 1 : 0}
          />
        </Frame>
        <Frame
          title="Deck, discard and stack"
          components={["CardStack", "DeckStackZone", "DiscardPileZone"]}
        >
          <div className={classes.cards}>
            <CardStack
              zone={zone}
              entities={cards.slice(0, 1)}
              entityCount={cards.length}
              label="Stack"
            />
            <DeckStackZone
              zone={{ ...zone, role: "deck", visibility: "secret" }}
              entities={cards}
              entityCount={cards.length}
            />
            <DiscardPileZone
              zone={{ ...zone, role: "discard", visibility: "public" }}
              entities={cards}
              entityCount={cards.length}
            />
          </div>
        </Frame>
        <Frame
          title="Resource selection and reveal shelf"
          components={["ResourceCardZone", "DeckRevealShelf"]}
        >
          <ResourceCardZone
            zone={{ ...zone, role: "resource" }}
            entities={cards}
            entityCount={cards.length}
            availableCount={cards.length}
            selectedIds={new Set(selected ? [selected] : [])}
            onSelect={(e) => setSelected(e.id)}
          />
          <DeckRevealShelf
            presentation="inline"
            reveal={{
              id: "catalog-reveal",
              zoneId: zone.id,
              position: "top",
              visibility: hidden ? "private" : "public",
              turnNumber: 1,
              count: cards.length,
              cards: cards.map((e) => ({ entityId: e.id, title: e.title, imageUrl: e.imageUrl })),
            }}
            renderCard={(_card, entity, index) =>
              visual(hidden ? entity : (cards[index] ?? entity))
            }
          />
        </Frame>
        <Frame
          title="Attachments and clipped card frames"
          components={["TabletopAttachmentStack", "MaskedCardFrame"]}
        >
          <p>Layout sample only. The game supplies legal attachment relationships.</p>
          <div className={classes.controls}>
            <label>
              <input
                type="checkbox"
                checked={expanded}
                onChange={(e) => setExpanded(e.target.checked)}
              />{" "}
              Expand attachments
            </label>
            <label>
              Stack direction{" "}
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value === "right" ? "right" : "below")}
              >
                <option value="below">Below</option>
                <option value="right">Right</option>
              </select>
            </label>
          </div>
          {cards[0] && (
            <TabletopAttachmentStack
              entity={cards[0]}
              attachments={cards.slice(1, 3)}
              expanded={expanded}
              direction={direction}
            />
          )}
          {cards[0] && (
            <div style={{ width: 140, marginTop: 16 }}>
              <MaskedCardFrame overlay="Clipped card frame">{visual(cards[0])}</MaskedCardFrame>
            </div>
          )}
        </Frame>
      </div>
      <p className={classes.result} role="status">
        {selected
          ? `Selected ${source.find((e) => e.id === selected)?.title ?? "card"}`
          : "Select a card in a hand or resource zone."}
      </p>
    </>
  );
}
