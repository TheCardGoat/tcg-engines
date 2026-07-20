import { describe, expect, test } from "vite-plus/test";
import { renderToStaticMarkup } from "react-dom/server";
import type { SimulatorEntity, SimulatorZone } from "@tcg/simulator-contract";

import { CardStack } from "./CardStack";
import { CardFace } from "./CardFace";
import { CardZone } from "./CardZone";
import { DeckStackZone } from "./DeckStackZone";
import { DiscardPileZone } from "./DiscardPileZone";
import { SingleCardZone } from "./SingleCardZone";
import { TabletopActionButton } from "./TabletopActionButton";
import { TurnIndicator } from "./TurnIndicator";

const visibleEntity: SimulatorEntity = {
  id: "visible-card",
  title: "Visible Card",
  subtitle: "Character",
  kind: "character",
  ownerId: "player",
  face: "public",
  states: ["ready"],
  stats: [{ label: "Power", value: "5000" }],
  traits: [],
};

const hiddenEntity: SimulatorEntity = {
  id: "hidden-card",
  title: "Hidden card",
  subtitle: "Hidden card",
  kind: "card",
  ownerId: "opponent",
  face: "hidden",
  states: ["hidden"],
  stats: [],
  traits: [],
};

function zone(layoutHint: SimulatorZone["layoutHint"]): SimulatorZone {
  return {
    id: `${layoutHint ?? "grid"}-zone`,
    label: `${layoutHint ?? "Grid"} Zone`,
    role: layoutHint === "stack" ? "deck" : "battlefield",
    ownerId: "player",
    visibility: "public",
    entityIds: [visibleEntity.id],
    count: 1,
    hint: "Test zone",
    ...(layoutHint ? { layoutHint } : {}),
  };
}

describe("CardZone layout dispatch", () => {
  test("renders fan, row, stack, and default grid layouts from zone hints", () => {
    const fanMarkup = renderToStaticMarkup(
      <CardZone zone={zone("fan")} entities={[visibleEntity]} entityCount={1} compact />,
    );
    const rowMarkup = renderToStaticMarkup(
      <CardZone zone={zone("row")} entities={[visibleEntity]} entityCount={1} compact />,
    );
    const stackMarkup = renderToStaticMarkup(
      <CardZone zone={zone("stack")} entities={[visibleEntity]} entityCount={1} />,
    );
    const gridMarkup = renderToStaticMarkup(
      <CardZone zone={zone(undefined)} entities={[visibleEntity]} entityCount={1} />,
    );

    expect(fanMarkup).toContain("compact-hand-zone");
    expect(rowMarkup).toContain('data-zone-layout="row"');
    expect(rowMarkup).toContain('data-card-density="mini"');
    expect(stackMarkup).toContain('data-zone-layout="stack"');
    expect(gridMarkup).toContain("card-grid");
  });
});

describe("CardFace privacy boundary", () => {
  test("does not render identity-bearing fields from a hidden entity", () => {
    const privateEntity: SimulatorEntity = {
      id: "player_one_deck_ST01-015_01",
      title: "White Base",
      subtitle: "Base",
      kind: "leader",
      ownerId: "player_one",
      face: "hidden",
      states: ["ready"],
      stats: [{ label: "HP", value: "5" }],
      traits: ["Earth Federation"],
      imageUrl: "https://private.invalid/ST01-015.webp",
      dataAttributes: { "data-secret-name": "White Base" },
    };

    const markup = renderToStaticMarkup(<CardFace entity={privateEntity} />);

    expect(markup).toContain('aria-label="Hidden card"');
    expect(markup).not.toContain("White Base");
    expect(markup).not.toContain("ST01-015");
    expect(markup).not.toContain("private.invalid");
    expect(markup).not.toContain("Earth Federation");
    expect(markup).not.toContain("data-secret-name");
    expect(markup).not.toContain("data-sim-entity-id");
  });
});

describe("CardStack", () => {
  test("renders public, hidden, empty, and selected stack states", () => {
    const publicMarkup = renderToStaticMarkup(
      <CardStack
        zone={zone("stack")}
        entities={[visibleEntity]}
        entityCount={12}
        selectedId="visible-card"
      />,
    );
    const hiddenMarkup = renderToStaticMarkup(
      <CardStack zone={zone("stack")} entities={[hiddenEntity]} entityCount={5} />,
    );
    const emptyMarkup = renderToStaticMarkup(
      <CardStack zone={zone("stack")} entities={[]} entityCount={0} label="Deck" />,
    );

    expect(publicMarkup).toContain("card-stack");
    expect(publicMarkup).toContain("is-selected");
    expect(publicMarkup).toContain("12");
    expect(hiddenMarkup).toContain('aria-label="Hidden card"');
    expect(emptyMarkup).toContain("empty-zone");
    expect(emptyMarkup).toContain("Deck");
  });
});

describe("tabletop zone primitives", () => {
  test("renders a single-card slot without the scrollable card grid", () => {
    const markup = renderToStaticMarkup(
      <SingleCardZone
        zone={zone("grid")}
        entities={[visibleEntity]}
        entityCount={1}
        selectedId="visible-card"
      />,
    );

    expect(markup).toContain("single-card-zone");
    expect(markup).toContain('data-zone-layout="single-card"');
    expect(markup).toContain("is-selected");
    expect(markup).not.toContain("card-grid");
  });

  test("renders an empty single-card slot", () => {
    const markup = renderToStaticMarkup(
      <SingleCardZone zone={zone("grid")} entities={[]} entityCount={0} emptyLabel="Stage Card" />,
    );

    expect(markup).toContain("empty-zone");
    expect(markup).toContain("Stage Card");
  });

  test("renders a deck stack as a facedown pile without exposing public titles", () => {
    const markup = renderToStaticMarkup(
      <DeckStackZone
        zone={zone("stack")}
        entities={[visibleEntity]}
        entityCount={40}
        label="Main Deck"
      />,
    );

    expect(markup).toContain("deck-stack-zone");
    expect(markup).toContain('data-zone-layout="deck-stack"');
    expect(markup).toContain('data-face="hidden"');
    expect(markup).toContain("40");
    expect(markup).not.toContain("Visible Card");
  });

  test("renders a discard pile with the public top card visible", () => {
    const markup = renderToStaticMarkup(
      <DiscardPileZone
        zone={zone("stack")}
        entities={[visibleEntity]}
        entityCount={3}
        label="Trash"
        selectedId="visible-card"
      />,
    );

    expect(markup).toContain("discard-pile-zone");
    expect(markup).toContain('data-zone-layout="discard-pile"');
    expect(markup).toContain("Visible Card");
    expect(markup).toContain("is-selected");
    expect(markup).toContain("3");
  });
});

describe("TurnIndicator and tabletop actions", () => {
  test("renders default and ribbon turn indicator variants", () => {
    const pillMarkup = renderToStaticMarkup(<TurnIndicator phase="Main Phase" turn={4} />);
    const ribbonMarkup = renderToStaticMarkup(
      <TurnIndicator phase="Main Phase" step="Combat" turn={4} variant="ribbon" />,
    );

    expect(pillMarkup).toContain('data-turn-indicator-variant="pill"');
    expect(pillMarkup).toContain('aria-label="Turn 4, Phase Main Phase"');
    expect(ribbonMarkup).toContain('data-turn-indicator-variant="ribbon"');
    expect(ribbonMarkup).toContain("Combat");
  });

  test("renders disabled tabletop action controls accessibly", () => {
    const markup = renderToStaticMarkup(
      <TabletopActionButton aria-label="Turn End" disabled variant="primary">
        Turn End
      </TabletopActionButton>,
    );

    expect(markup).toContain("tabletop-action-button");
    expect(markup).toContain('aria-label="Turn End"');
    expect(markup).toContain('disabled=""');
  });
});
