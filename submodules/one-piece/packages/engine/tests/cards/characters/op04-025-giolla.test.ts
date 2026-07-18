import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op02Komille097,
  op04Giolla025,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-025 Giolla", () => {
  test("on an opponent's attack pays 2 DON!! to rest only an active opposing cost-4-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op04Giolla025, eb01Doma005],
        activeDon: 2,
      },
      {
        character: [
          { card: eb01Fourtricks025, playedOnTurn: 0 },
          { card: op04Giolla025, playedOnTurn: 0 },
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: op02Komille097, playedOnTurn: 0, rested: true },
        ],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const attackerId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const ownId = engine.findCardInZone("south", "character", eb01Doma005);
    const eligibleId = engine.findCardInZone("north", "character", op04Giolla025);
    const tooExpensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const alreadyRestedId = engine.findCardInZone("north", "character", op02Komille097);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    expect(engine.pendingDecision("effectOptional", "south").actorId).toBe("south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south");
    expect(target.actorId).toBe("south");
    const step = target.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") throw new Error("Expected Giolla's Character target.");
    expect(step).toMatchObject({ min: 0, max: 1 });
    expect(step.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(step.candidates.map((candidate) => candidate.ref.id)).not.toContain(attackerId);
    expect(step.candidates.map((candidate) => candidate.ref.id)).not.toContain(ownId);
    expect(step.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooExpensiveId);
    expect(step.candidates.map((candidate) => candidate.ref.id)).not.toContain(alreadyRestedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 2 });
    expect(
      view.players.north.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("may pay 2 DON!! and choose no opposing Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op04Giolla025], activeDon: 2 },
      {
        character: [
          { card: eb01Fourtricks025, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const attackerId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 2 });
    expect(
      view.players.north.characters.find((card) => card?.instanceId === targetId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without resting DON!! or an opposing Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op04Giolla025], activeDon: 2 },
      {
        character: [
          { card: eb01Fourtricks025, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const attackerId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 2, restedDon: 0 });
    expect(
      view.players.north.characters.find((card) => card?.instanceId === targetId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not offer the effect without 2 active DON!! to pay its cost", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op04Giolla025], activeDon: 1 },
      { character: [{ card: eb01Fourtricks025, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const attackerId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.declareAttack(attackerId, engine.leader("south"), "north");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 1, restedDon: 0 });
    expect(view.prompts).toHaveLength(0);
  });
});
