import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op02Komille097,
  op04Kuro023,
  op04Trebol030,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-030 Trebol", () => {
  test("K.O.s only a rested cost-5-or-less Character on play", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op04Trebol030], activeDon: 6 },
      {
        character: [
          { card: eb01MountainGod018, rested: true },
          { card: op04Kuro023, rested: true },
          eb01Fourtricks025,
        ],
      },
    );
    const restedId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const tooExpensiveId = engine.findCardInZone("north", "character", op04Kuro023);
    const activeId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    engine.playCard(op04Trebol030, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Trebol's K.O. choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([restedId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooExpensiveId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(activeId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [restedId] }, "south");
    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      restedId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("may choose no rested Character to K.O. on play", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op04Trebol030], activeDon: op04Trebol030.cost },
      { character: [{ card: eb01MountainGod018, rested: true }] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op04Trebol030, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.some((card) => card?.instanceId === targetId)).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("may pay 2 DON!! on an opponent's attack to rest a cost-4-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op04Trebol030, playedOnTurn: 0 }, eb01Doma005],
        activeDon: 2,
      },
      {
        character: [
          { card: eb01Fourtricks025, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: op02Komille097, playedOnTurn: 0, rested: true },
        ],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const attackerId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const ownId = engine.findCardInZone("south", "character", eb01Doma005);
    const lowCostId = engine.findCardInZone("north", "character", eb01Doma005);
    const tooExpensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const alreadyRestedId = engine.findCardInZone("north", "character", op02Komille097);
    engine.declareAttack(attackerId, engine.leader("south"), "north");
    expect(engine.pendingDecision("effectOptional", "south").actorId).toBe("south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Trebol's rest choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([lowCostId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(attackerId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(ownId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooExpensiveId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(alreadyRestedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [lowCostId] }, "south");
    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 0, restedDon: 2 });
    expect(
      engine
        .getView("south")
        .players.north.characters.find((card) => card?.instanceId === lowCostId)?.rested,
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("the defending player may decline without paying DON!! or resting a Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op04Trebol030, playedOnTurn: 0 }], activeDon: 2 },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");
    const optional = engine.pendingDecision("effectOptional", "south");
    expect(optional.actorId).toBe("south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 2, restedDon: 0 });
    expect(
      view.players.north.characters.find((card) => card?.instanceId === targetId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not offer the attack response without 2 active DON!!", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op04Trebol030, playedOnTurn: 0 }], activeDon: 1 },
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
