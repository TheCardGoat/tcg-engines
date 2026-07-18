import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op01ParadiseWaterfall057,
  op02Seaquake021,
  op03Marco013,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-013 Marco", () => {
  test("on its controller's turn, K.O.s only an opposing power-3000-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op03Marco013], activeDon: op03Marco013.cost },
      { character: [eb01Doma005, eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const lowPowerId = engine.findCardInZone("north", "character", eb01Doma005);
    const highPowerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op03Marco013, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Marco's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(lowPowerId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(highPowerId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [lowPowerId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(lowPowerId);
    expect(view.players.north.characters.some((card) => card?.instanceId === highPowerId)).toBe(
      true,
    );
  });

  test("on K.O., may trash an Event to replay the same physical card rested", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        character: [{ card: op03Marco013, rested: true }],
        hand: [op02Seaquake021, op01ParadiseWaterfall057, eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const marcoId = engine.findCardInZone("north", "character", op03Marco013);
    const eventId = engine.findCardInZone("north", "hand", op02Seaquake021);
    const otherEventId = engine.findCardInZone("north", "hand", op01ParadiseWaterfall057);
    const characterId = engine.findCardInZone("north", "hand", eb01Doma005);

    engine.declareAttack(attackerId, marcoId, "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");

    const cost = engine.pendingDecision("effectCostTrashFromHand", "north").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Marco's Event cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toContain(eventId);
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toContain(otherEventId);
    expect(cost.candidates.map((candidate) => candidate.ref.id)).not.toContain(characterId);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [eventId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.find((card) => card?.instanceId === marcoId)?.rested).toBe(
      true,
    );
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(marcoId);
    expect(view.prompts).toHaveLength(0);
  });
});
