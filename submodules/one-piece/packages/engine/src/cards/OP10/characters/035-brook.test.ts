import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op02Koby098,
  op10Brook035,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-035 Brook", () => {
  test("after battle K.O. rests an opposing Leader or cost-5-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op10Brook035, rested: true }] },
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const brookId = engine.findCardInZone("south", "character", op10Brook035);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const characterId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(attackerId, brookId, "north");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Brook's rest target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([engine.leader("north"), characterId]),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [characterId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(brookId);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === characterId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("after effect K.O. also rests an opposing cost-5-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op10Brook035] },
      {
        hand: [op02Koby098, eb01Fourtricks025],
        character: [eb01Doma005],
        activeDon: op02Koby098.cost,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const brookId = engine.findCardInZone("south", "character", op10Brook035);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op02Koby098, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [brookId] }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(brookId);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === targetId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
