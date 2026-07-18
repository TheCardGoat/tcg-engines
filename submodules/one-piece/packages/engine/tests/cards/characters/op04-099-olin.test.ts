import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op03Napoleon117,
  op04Olin099,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-099 Olin", () => {
  test("plays the resolving physical card from Trigger at one or less Life", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op04Olin099] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const olinId = engine.findCardInZone("north", "life", op04Olin099);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.some((card) => card?.instanceId === olinId)).toBe(true);
    expect(view.players.north.hand.map((card) => card.instanceId)).not.toContain(olinId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(olinId);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not play the resolving card when its Trigger condition is false", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op04Olin099, eb01Doma005, eb01Fourtricks025] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const olinId = engine.findCardInZone("north", "life", op04Olin099);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(2);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(olinId);
    expect(view.players.north.characters.some((card) => card?.instanceId === olinId)).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });

  test("is treated as Charlotte Linlin by another card's public name filter", () => {
    const engine = OnePieceTestEngine.create({
      character: [
        { card: op03Napoleon117, playedOnTurn: 0 },
        { card: op04Olin099, playedOnTurn: 0 },
        { card: eb01Doma005, playedOnTurn: 0 },
      ],
    });
    const napoleonId = engine.findCardInZone("south", "character", op03Napoleon117);
    const olinId = engine.findCardInZone("south", "character", op04Olin099);
    const unrelatedId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.activateEffect(napoleonId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Napoleon's Linlin target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(olinId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(unrelatedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [olinId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === olinId)?.power).toBe(
      8000,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
