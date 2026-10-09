import { useId, useState } from "react";
import type { SimulatorEntity } from "@tcg/simulator-contract";
import {
  AccessibilityAnnouncer,
  KeyboardNavigator,
  CardDetailSheet,
  SimulatorEntityVisual,
} from "@tcg/simulator-ui";
import { LiveFixtureFrame as Frame } from "./LiveFixtureFrame";
import classes from "./LiveFixtures.module.css";

export const accessibilityFixtureComponents = [
  "AccessibilityAnnouncer",
  "KeyboardNavigator",
] as const;
export default function AccessibilityFixtures({
  entities,
}: {
  entities: readonly SimulatorEntity[];
}) {
  const [orientation, setOrientation] = useState<"horizontal" | "vertical" | "grid">("horizontal");
  const [loop, setLoop] = useState(true);
  const [priority, setPriority] = useState<"polite" | "assertive">("polite");
  const [announcement, setAnnouncement] = useState({ id: 0, text: "" });
  const [inspected, setInspected] = useState<SimulatorEntity | null>(null);
  const fixtureId = useId();
  const cards = entities
    .filter((entity) => entity.face === "public")
    .slice(0, 3)
    .map((card) => ({ ...card, id: `${fixtureId}-${card.id}` }));
  const detailEntity = inspected ?? cards[0];
  const announce = (text: string) => setAnnouncement((previous) => ({ id: previous.id + 1, text }));
  const inspect = (card: SimulatorEntity) => {
    setInspected(card);
    announce(`Inspect ${card.title}`);
  };
  return (
    <Frame
      title="Keyboard navigation and live announcements"
      components={accessibilityFixtureComponents}
    >
      <p>Focus the card board. Use arrows, Home, and End to move; use Enter or Space to inspect.</p>
      <div className={classes.controls}>
        <label>
          Navigation orientation{" "}
          <select
            value={orientation}
            onChange={(event) => {
              const value = event.target.value;
              if (value === "horizontal" || value === "vertical" || value === "grid")
                setOrientation(value);
            }}
          >
            <option>horizontal</option>
            <option>vertical</option>
            <option>grid</option>
          </select>
        </label>
        <label>
          <input
            type="checkbox"
            checked={loop}
            onChange={(event) => setLoop(event.target.checked)}
          />{" "}
          Loop navigation
        </label>
        <label>
          Announcement priority{" "}
          <select
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value === "assertive" ? "assertive" : "polite")
            }
          >
            <option>polite</option>
            <option>assertive</option>
          </select>
        </label>
        <button onClick={() => announce("Preview action completed.")}>Announce result</button>
      </div>
      <KeyboardNavigator
        orientation={orientation}
        loop={loop}
        onActivate={(id) => {
          const card = cards.find((card) => card.id === id);
          if (card) inspect(card);
        }}
      >
        <div className={classes.cards}>
          {cards.map((card) => (
            <button
              key={card.id}
              id={`keyboard-entity-${card.id}`}
              data-sim-entity-id={card.id}
              aria-label={`Inspect ${card.title}`}
              className={classes.card}
              onClick={() => inspect(card)}
            >
              <SimulatorEntityVisual entity={card} density="large" />
            </button>
          ))}
        </div>
      </KeyboardNavigator>
      {detailEntity && (
        <CardDetailSheet
          entity={detailEntity}
          open={inspected !== null}
          onClose={() => setInspected(null)}
        />
      )}
      <AccessibilityAnnouncer
        message={announcement.text}
        announcementId={announcement.id}
        priority={priority}
      />
      <p>Last announcement: {announcement.text || "None"}</p>
    </Frame>
  );
}
