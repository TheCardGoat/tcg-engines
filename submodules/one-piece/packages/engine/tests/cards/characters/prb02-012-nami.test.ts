import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  prb02Nami012,
  st01MonkeyDLuffy012,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("PRB02-012 Nami", () => {
  test("Life Trigger plays the physical card and searches for a different Straw Hat Crew card", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [prb02Nami012],
        deck: [
          st01MonkeyDLuffy012,
          prb02Nami012,
          eb01Doma005,
          eb01Fourtricks025,
          eb01MountainGod018,
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const lifeNamiId = engine.findCardInZone("north", "life", prb02Nami012);
    const eligibleId = engine.findCardInZone("north", "deck", st01MonkeyDLuffy012);
    const excludedNamiId = engine.findCardInZone("north", "deck", prb02Nami012);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const search = engine.pendingDecision("effectSearchSelection", "north").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Nami's search choice.");
    expect(search.candidates.find((candidate) => candidate.ref.id === eligibleId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === excludedNamiId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [eligibleId] }, "north");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "north").steps[0];
    if (remainder?.kind !== "orderItems") throw new Error("Expected Nami's bottom order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: remainder.candidates.map((candidate) => candidate.ref.id) },
      "north",
    );

    const view = engine.getView("north");
    expect(view.players.north.characters.some((card) => card?.instanceId === lifeNamiId)).toBe(
      true,
    );
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.prompts).toHaveLength(0);
  });
});
