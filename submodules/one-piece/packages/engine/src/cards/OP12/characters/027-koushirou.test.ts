import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op08BurnBlade117 } from "@tcg/op-cards";
import { op12Koushirou027 } from "../../../../../cards/src/cards/OP12/characters/027-koushirou.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-027 Koushirou", () => {
  test("rests itself instead when an eligible Slash Character would be K.O.'d by an opponent effect", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op12Koushirou027, eb01Doma005] },
      { hand: [op08BurnBlade117], life: [eb01Doma005], activeDon: op08BurnBlade117.cost },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const koushirouId = engine.findCardInZone("south", "character", op12Koushirou027);
    const protectedId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.playCard(op08BurnBlade117, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [protectedId] }, "north");
    engine.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === protectedId)).toBe(
      true,
    );
    expect(
      view.players.south.characters.find((card) => card?.instanceId === koushirouId)?.rested,
    ).toBe(true);
    expect(view.players.south.trash.map((card) => card.instanceId)).not.toContain(protectedId);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not replace an opponent effect K.O. of a non-Slash Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op12Koushirou027, eb01MountainGod018] },
      { hand: [op08BurnBlade117], life: [eb01Doma005], activeDon: op08BurnBlade117.cost },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const koushirouId = engine.findCardInZone("south", "character", op12Koushirou027);
    const targetId = engine.findCardInZone("south", "character", eb01MountainGod018);

    engine.playCard(op08BurnBlade117, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "north");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(targetId);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === koushirouId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });

  test("can become the new target of an opponent's attack as a Blocker", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op12Koushirou027] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const blockerId = engine.findCardInZone("south", "character", op12Koushirou027);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [blockerId] }, "south");

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
  });
});
