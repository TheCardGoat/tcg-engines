import { describe, expect, test } from "vite-plus/test";
import { renderToStaticMarkup as renderStaticMarkup } from "react-dom/server";
import type { SimulatorEntity, SimulatorZone } from "@tcg/simulator-contract";
import type { ReactNode } from "react";

import { CardStack } from "./CardStack";
import { CardFace } from "./CardFace";
import { CardZone } from "./CardZone";
import { DeckStackZone } from "./DeckStackZone";
import { DiscardPileZone } from "./DiscardPileZone";
import { HandZone } from "./HandZone";
import { ResourceCardZone } from "./ResourceCardZone";
import { SingleCardZone } from "./SingleCardZone";
import { TabletopActionButton } from "./TabletopActionButton";
import { TurnIndicator } from "./TurnIndicator";
import { createSimulatorAnimationScope, DefaultSimulatorEntityVisual } from "../animation";

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

describe("HandZone registered visual rendering", () => {
  test("uses the provider renderer without a per-zone render callback", () => {
    const markup = renderToStaticMarkup(<HandZone entities={[visibleEntity]} zone={zone("fan")} />);

    expect(markup).toContain("Visible Card");
  });
});

describe("CardZone registered visual rendering", () => {
  test("keeps the row layout without a renderCard escape hatch", () => {
    const rowZone = zone("row");
    const markup = renderToStaticMarkup(
      <CardZone zone={rowZone} entities={[visibleEntity]} entityCount={1} compact />,
    );

    expect(markup).toContain('data-zone-layout="row"');
    expect(markup).toContain("Visible Card");
  });
});

describe("shared card interaction visuals", () => {
  test("renders actionable, selected, and targetable states through zone primitives", () => {
    const actionable = renderToStaticMarkup(
      <HandZone
        entities={[visibleEntity]}
        interactionStateFor={() => ({ kind: "actionable", actionCount: 2 })}
        zone={zone("fan")}
      />,
    );
    const selected = renderToStaticMarkup(
      <SingleCardZone
        zone={zone("grid")}
        entities={[visibleEntity]}
        entityCount={1}
        interactionStateFor={() => ({ kind: "selected", actionCount: 1 })}
      />,
    );
    const targetable = renderToStaticMarkup(
      <CardZone
        zone={zone("row")}
        entities={[visibleEntity]}
        entityCount={1}
        interactionStateFor={() => ({ kind: "targetable", label: "Choose defender" })}
      />,
    );

    expect(actionable).toContain('data-card-interaction="actionable"');
    expect(actionable).toContain("2 actions available");
    expect(selected).toContain('data-card-interaction="selected"');
    expect(selected).toContain('aria-pressed="true"');
    expect(targetable).toContain('data-card-interaction="targetable"');
    expect(targetable).toContain("Choose defender");
  });
});

const TestAnimation = createSimulatorAnimationScope<{ entity: SimulatorEntity }>();

function renderToStaticMarkup(node: ReactNode): string {
  return renderStaticMarkup(
    <TestAnimation.Root
      sessionKey="card-primitives"
      initialState={{ entity: visibleEntity }}
      initialVersion={1}
      projection={{
        getEntity: (state) => state.entity,
        getZone: () => null,
      }}
      entityRenderer={DefaultSimulatorEntityVisual}
      viewerSeatId="player"
      animationSpeed="off"
    >
      {node}
    </TestAnimation.Root>,
  );
}

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
  test("can render non-interactive card chrome inside a shared drag handle", () => {
    const markup = renderToStaticMarkup(<CardFace entity={visibleEntity} as="div" />);
    expect(markup).toContain('<div class="sim-card-face');
    expect(markup).not.toContain("<button");
  });

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
  test("can remove a caller-defined rules-text band with two responsive image slices", () => {
    const imageEntity: SimulatorEntity = {
      ...visibleEntity,
      imageUrl: "https://cards.example/visible-card.webp",
    };

    const markup = renderToStaticMarkup(
      <CardFace
        entity={imageEntity}
        as="div"
        imageMode="no-text"
        textBoxStart={0.616}
        textBoxEnd={0.839}
      />,
    );

    expect(markup).toContain('data-card-image-mode="no-text"');
    expect(markup).toContain('data-slice="top"');
    expect(markup).toContain('data-slice="bottom"');
    expect(markup).toContain("background-size:100% auto");
    expect(markup).toContain("background-position:center top");
    expect(markup).toContain("background-position:center bottom");
    expect(markup).not.toContain("<img");
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

  test("renders a resource row with an available count and registered entities", () => {
    const resourceZone = {
      ...zone("row"),
      label: "Eddies",
      role: "resource" as const,
    };
    const restedEntity: SimulatorEntity = {
      ...visibleEntity,
      id: "spent-card",
      states: ["rested"],
    };
    const markup = renderToStaticMarkup(
      <ResourceCardZone
        zone={resourceZone}
        entities={[visibleEntity, restedEntity]}
        entityCount={2}
        availableCount={1}
        label="Eddies"
      />,
    );

    expect(markup).toContain("resource-card-zone");
    expect(markup).toContain("resource-card-zone-counter");
    expect(markup).toContain("right-2");
    expect(markup).toContain('data-zone-layout="resource-row"');
    expect(markup).toContain("Eddies");
    expect(markup).toContain("1/2");
    expect(markup).toContain('data-rested="true"');
    expect(markup).toContain("Visible Card");
  });

  test("lets games supply pile and resource visuals without replacing shared zone structure", () => {
    const deckMarkup = renderToStaticMarkup(
      <DeckStackZone
        zone={zone("stack")}
        entities={[]}
        entityCount={40}
        renderTopEntity={() => <span>Game deck back</span>}
      />,
    );
    const discardMarkup = renderToStaticMarkup(
      <DiscardPileZone
        zone={zone("stack")}
        entities={[visibleEntity]}
        entityCount={1}
        renderTopEntity={() => <span>Interactive top card</span>}
      />,
    );
    const resourceMarkup = renderToStaticMarkup(
      <ResourceCardZone
        zone={{ ...zone("row"), role: "resource" }}
        entities={[visibleEntity]}
        entityCount={1}
        availableCount={1}
        renderEntity={() => <span>Game resource card</span>}
      />,
    );

    expect(deckMarkup).toContain("deck-stack-zone");
    expect(deckMarkup).toContain("Game deck back");
    expect(discardMarkup).toContain("discard-pile-zone");
    expect(discardMarkup).toContain("Interactive top card");
    expect(resourceMarkup).toContain("resource-card-zone");
    expect(resourceMarkup).toContain("Game resource card");
  });

  test("can suppress redundant visual empty-state helpers while preserving zone labels", () => {
    const discardMarkup = renderToStaticMarkup(
      <DiscardPileZone
        zone={zone("stack")}
        entities={[]}
        entityCount={0}
        label="Scrap"
        showEmptyState={false}
      />,
    );
    const resourceMarkup = renderToStaticMarkup(
      <ResourceCardZone
        zone={zone("row")}
        entities={[]}
        entityCount={0}
        availableCount={0}
        label="Resources"
        showEmptyState={false}
      />,
    );

    expect(discardMarkup).toContain('aria-label="Scrap, 0 cards"');
    expect(resourceMarkup).toContain('aria-label="Resources, 0/0 available"');
    expect(discardMarkup).not.toContain("empty-zone");
    expect(resourceMarkup).not.toContain("empty-zone");
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
