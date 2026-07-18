import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op05MissDoublefingerZala073,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-073 Miss Doublefinger(Zala)", () => {
  test("on play trashes a chosen hand card to add one rested DON!!", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op05MissDoublefingerZala073, eb01Doma005, eb01Fourtricks025],
      activeDon: 4,
      donDeckCount: 1,
    });
    const discardId = engine.findCardInZone("south", "hand", eb01Doma005);
    const otherId = engine.findCardInZone("south", "hand", eb01Fourtricks025);

    engine.playCard(op05MissDoublefingerZala073, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Zala's hand-trash cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual([discardId, otherId]);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [discardId] }, "south");

    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    expect(addDon?.kind).toBe("chooseOption");
    if (addDon?.kind !== "chooseOption") throw new Error("Expected Zala's add-DON!! choice.");
    expect(addDon.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 5, donDeckCount: 0 });
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(discardId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(otherId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline the On Play cost without trashing a card or adding DON!!", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op05MissDoublefingerZala073, eb01Doma005],
      activeDon: 4,
      donDeckCount: 1,
    });
    const handId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op05MissDoublefingerZala073, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ restedDon: 4, donDeckCount: 1 });
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(handId);
    expect(view.players.south.trash.map((card) => card.instanceId)).not.toContain(handId);
    expect(view.prompts).toHaveLength(0);
  });

  test("Life Trigger returns one DON!! and plays the resolving physical card", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op05MissDoublefingerZala073], activeDon: 1 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const zalaId = engine.findCardInZone("north", "life", op05MissDoublefingerZala073);
    const donDeckBefore = engine.getView("north").players.north.donDeckCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.some((card) => card?.instanceId === zalaId)).toBe(true);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(zalaId);
    expect(view.players.north).toMatchObject({ activeDon: 0, donDeckCount: donDeckBefore + 1 });
    expect(view.prompts).toHaveLength(0);
  });
});
