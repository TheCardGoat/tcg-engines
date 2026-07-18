import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Hannyabal021,
  op11FisherTiger035,
  op14eb04SilversRayleigh108,
} from "@tcg/op-cards";
import { op11VinsmokeYonji046 } from "../../../../../cards/src/cards/OP11/characters/046-vinsmoke-yonji.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-046 Vinsmoke Yonji", () => {
  test("can become the new target of an opponent's attack as a Blocker", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op11VinsmokeYonji046] },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const yonjiId = engine.findCardInZone("south", "character", op11VinsmokeYonji046);
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [yonjiId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.characters.find((card) => card?.instanceId === yonjiId)?.rested).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("with only included GERMA Characters, is not a legal opponent-effect rest target", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op11VinsmokeYonji046] },
      { hand: [op11FisherTiger035], activeDon: op11FisherTiger035.cost },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const yonjiId = engine.findCardInZone("south", "character", op11VinsmokeYonji046);

    engine.playCard(op11FisherTiger035, "north");

    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Fisher Tiger's rest target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(yonjiId);
  });

  test("opponent-effect K.O. protection applies only while every Character includes GERMA", () => {
    const protectedEngine = OnePieceTestEngine.create(
      {
        character: [op11VinsmokeYonji046],
        life: 3,
      },
      {
        leaderCardId: eb01Hannyabal021,
        hand: [op14eb04SilversRayleigh108],
        activeDon: op14eb04SilversRayleigh108.cost,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const protectedId = protectedEngine.findCardInZone("south", "character", op11VinsmokeYonji046);

    protectedEngine.playCard(op14eb04SilversRayleigh108, "north");

    const protectedTarget = protectedEngine.pendingDecision("effectTargetSelection", "north")
      .steps[0];
    expect(protectedTarget?.kind).toBe("selectEntity");
    if (protectedTarget?.kind !== "selectEntity") {
      throw new Error("Expected Rayleigh's optional K.O. target.");
    }
    expect(protectedTarget.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      protectedId,
    );
    protectedEngine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "north");

    expect(
      protectedEngine.getView("south").players.south.characters.map((card) => card?.instanceId),
    ).toContain(protectedId);
    expect(protectedEngine.getView("north").prompts).toHaveLength(0);

    const unprotectedEngine = OnePieceTestEngine.create(
      {
        character: [op11VinsmokeYonji046, eb01Doma005],
        life: 3,
      },
      {
        leaderCardId: eb01Hannyabal021,
        hand: [op14eb04SilversRayleigh108],
        activeDon: op14eb04SilversRayleigh108.cost,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const unprotectedId = unprotectedEngine.findCardInZone(
      "south",
      "character",
      op11VinsmokeYonji046,
    );

    unprotectedEngine.playCard(op14eb04SilversRayleigh108, "north");
    const target = unprotectedEngine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Rayleigh's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(unprotectedId);
    unprotectedEngine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [unprotectedId] },
      "north",
    );

    expect(
      unprotectedEngine.getView("south").players.south.trash.map((card) => card.instanceId),
    ).toContain(unprotectedId);
    expect(unprotectedEngine.getView("south").prompts).toHaveLength(0);
  });
});
