import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018 } from "@tcg/op-cards";
import { op13Inuarashi061 } from "../../../../../cards/src/cards/OP13/characters/061-inuarashi.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-061 Inuarashi", () => {
  test("with a given DON!!, adds one rested DON!! then K.O.s a selected opposing cost-1 Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op13Inuarashi061],
        character: [{ card: eb01Doma005, attachedDon: 1 }],
        activeDon: op13Inuarashi061.cost,
        donDeckCount: 1,
      },
      { character: [eb01Doma005, eb01MountainGod018] },
    );
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const expensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op13Inuarashi061, "south");
    const addDonDecision = engine.pendingDecision("effectAddDon", "south");
    expect(addDonDecision.actorId).toBe("south");
    expect(addDonDecision.steps[0]).toMatchObject({
      kind: "chooseOption",
      options: [{ id: "0" }, { id: "1" }],
    });
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Inuarashi's K.O. target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ restedDon: 4, donDeckCount: 0 });
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(expensiveId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may add zero DON!! and still resolves the subsequent K.O.", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op13Inuarashi061],
        character: [{ card: eb01Doma005, attachedDon: 1 }],
        activeDon: op13Inuarashi061.cost,
        donDeckCount: 1,
      },
      { character: [eb01Doma005] },
    );
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op13Inuarashi061, "south");
    engine.resolveDecision("effectAddDon", { optionId: "0" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ restedDon: 3, donDeckCount: 1 });
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.prompts).toHaveLength(0);
  });

  test("without any given DON!!, On Play neither adds DON!! nor K.O.s a Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op13Inuarashi061],
        activeDon: op13Inuarashi061.cost,
        donDeckCount: 1,
      },
      { character: [eb01Doma005] },
    );
    const opposingId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op13Inuarashi061, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ restedDon: 3, donDeckCount: 1 });
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(opposingId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(opposingId);
    expect(view.prompts).toHaveLength(0);
  });
});
