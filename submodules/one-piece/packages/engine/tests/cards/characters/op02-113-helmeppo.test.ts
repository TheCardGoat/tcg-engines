import { describe, expect, test } from "vite-plus/test";
import type { CharacterCard } from "@tcg/op-types";
import {
  eb01MountainGod018,
  op02Fullbody111,
  op02Helmeppo113,
  op02Minokoala086,
} from "@tcg/op-cards";

import { registerCards } from "../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

const ownZeroCostCharacter: CharacterCard = {
  ...op02Minokoala086,
  id: "TEST-OP02-113-OWN-ZERO-COST",
  canonicalId: "TEST-OP02-113-OWN-ZERO-COST",
  name: "Own Zero-Cost Character",
  cost: 0,
};

registerCards([ownZeroCostCharacter]);

describe("OP02-113 Helmeppo", () => {
  test("reduces a cost-2 opponent to 0, then gains +2000 only for that battle", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op02Helmeppo113, playedOnTurn: 0 }] },
      { character: [op02Fullbody111, op02Minokoala086] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const helmeppoId = engine.findCardInZone("south", "character", op02Helmeppo113);
    const targetId = engine.findCardInZone("north", "character", op02Fullbody111);

    engine.declareAttack(helmeppoId, engine.leader("north"), "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.cost,
    ).toBe(0);
    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === helmeppoId)?.power,
    ).toBe(5000);
    engine.resolveDecision("battleBlocker", { selectedIds: ["skip"] }, "north");
    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === helmeppoId)?.power,
    ).toBe(3000);

    engine.endTurn("south");
    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.cost,
    ).toBe(2);
  });

  test("may choose no cost target, leaving no cost-zero-dependent battle bonus", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op02Helmeppo113, playedOnTurn: 0 }] },
      { character: [op02Fullbody111, op02Minokoala086] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const helmeppoId = engine.findCardInZone("south", "character", op02Helmeppo113);
    const targetId = engine.findCardInZone("north", "character", op02Fullbody111);

    engine.declareAttack(helmeppoId, engine.leader("north"), "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.cost).toBe(
      2,
    );
    expect(
      view.players.south.characters.find((card) => card?.instanceId === helmeppoId)?.power,
    ).toBe(3000);
    engine.resolveDecision("battleBlocker", { selectedIds: ["skip"] }, "north");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("may decline reduction and still gains power from its controller's cost-0 Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op02Helmeppo113, playedOnTurn: 0 }, ownZeroCostCharacter],
      },
      { character: [op02Fullbody111, op02Minokoala086] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const helmeppoId = engine.findCardInZone("south", "character", op02Helmeppo113);
    const ownCostZeroId = engine.findCardInZone("south", "character", ownZeroCostCharacter);
    const opposingId = engine.findCardInZone("north", "character", op02Fullbody111);

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === ownCostZeroId)?.cost,
    ).toBe(0);
    engine.declareAttack(helmeppoId, engine.leader("north"), "south");
    const costTarget = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(costTarget?.kind).toBe("selectEntity");
    if (costTarget?.kind !== "selectEntity") {
      throw new Error("Expected Helmeppo's opposing cost target.");
    }
    expect(costTarget.candidates.map((candidate) => candidate.ref.id)).toContain(opposingId);
    expect(costTarget.candidates.map((candidate) => candidate.ref.id)).not.toContain(ownCostZeroId);
    expect(costTarget.candidates.map((candidate) => candidate.ref.id)).not.toContain(helmeppoId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === helmeppoId)?.power,
    ).toBe(5000);
    engine.resolveDecision("battleBlocker", { selectedIds: ["skip"] }, "north");
    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === helmeppoId)?.power,
    ).toBe(3000);
  });

  test("plays the physical Helmeppo Life Trigger card", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op02Helmeppo113] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const helmeppoId = engine.findCardInZone("north", "life", op02Helmeppo113);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.some((card) => card?.instanceId === helmeppoId)).toBe(
      true,
    );
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(helmeppoId);
    expect(view.prompts).toHaveLength(0);
  });
});
