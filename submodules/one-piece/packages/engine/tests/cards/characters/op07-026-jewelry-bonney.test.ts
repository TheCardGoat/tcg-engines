import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op02Magellan085, op07JewelryBonney026 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-026 Jewelry Bonney", () => {
  test("freezes an opposing rested Character through its next Refresh Phase", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op07JewelryBonney026], activeDon: op07JewelryBonney026.cost },
      { character: [{ card: eb01Doma005, rested: true }, eb01Doma005] },
    );
    const restedId = engine.findCardInZone("north", "character", eb01Doma005);
    const activeId = engine
      .getView("south")
      .players.north.characters.find(
        (card) => card?.cardId === eb01Doma005.id && card.instanceId !== restedId,
      )?.instanceId;
    if (!activeId) throw new Error("Expected the active exclusion fixture.");

    engine.playCard(op07JewelryBonney026, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Bonney's freeze choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(restedId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(activeId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [restedId] }, "south");

    engine.endTurn("south");
    let view = engine.getView("north");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === restedId)?.rested,
    ).toBe(true);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === activeId)?.rested,
    ).toBe(false);

    engine.endTurn("north");
    engine.endTurn("south");
    view = engine.getView("north");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === restedId)?.rested,
    ).toBe(false);
  });

  test("offers an opponent's rested DON!! card as a freeze target", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op07JewelryBonney026], activeDon: op07JewelryBonney026.cost },
      { restedDon: 1 },
    );

    engine.playCard(op07JewelryBonney026, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Bonney's DON!! choice.");
    const donTarget = target.candidates.find((candidate) =>
      candidate.ref.id.startsWith("rested-don:north:"),
    );
    expect(donTarget).toBeDefined();
    engine.resolveDecision("effectTargetSelection", { selectedIds: [donTarget!.ref.id] }, "south");

    engine.endTurn("south");
    expect(engine.getView("north").players.north.restedDon).toBe(1);
    engine.endTurn("north");
    engine.endTurn("south");
    expect(engine.getView("north").players.north.restedDon).toBe(0);
  });

  test("does not freeze a different DON!! after the selected frozen card is returned", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op07JewelryBonney026, op02Magellan085],
        activeDon: 10,
      },
      { restedDon: 2 },
    );

    engine.playCard(op07JewelryBonney026, "south");
    const freeze = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (freeze?.kind !== "selectEntity") throw new Error("Expected Bonney's DON!! choice.");
    const frozenId = freeze.candidates.find((candidate) => candidate.ref.id.endsWith(":0"))?.ref.id;
    if (!frozenId) throw new Error("Expected the first rested DON!! target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [frozenId] }, "south");

    const donDeckBefore = engine.getView("south").players.north.donDeckCount;
    engine.playCard(op02Magellan085, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    expect(engine.getView("south").players.north).toMatchObject({
      restedDon: 1,
      donDeckCount: donDeckBefore + 1,
    });
    engine.endTurn("south");
    expect(engine.getView("north").players.north.restedDon).toBe(0);
  });
});
