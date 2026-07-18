import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb02Hildon046 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-046 Hildon", () => {
  test("trashes the top two cards and gives one opposing Character −1 cost for the turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb02Hildon046],
        deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
        activeDon: 3,
      },
      { character: [eb01Fourtricks025, eb01MountainGod018] },
    );
    const firstMilledId = engine.findCardInZone("south", "deck", eb01Doma005);
    const secondMilledId = engine.findCardInZone("south", "deck", eb01Fourtricks025);
    const selectedId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const unselectedId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(eb02Hildon046, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Hildon's cost target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([
      selectedId,
      unselectedId,
    ]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "south");

    let view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual([
      firstMilledId,
      secondMilledId,
    ]);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === selectedId)?.cost,
    ).toBe(2);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === unselectedId)?.cost,
    ).toBe(5);

    engine.endTurn("south");
    view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === selectedId)?.cost,
    ).toBe(3);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
