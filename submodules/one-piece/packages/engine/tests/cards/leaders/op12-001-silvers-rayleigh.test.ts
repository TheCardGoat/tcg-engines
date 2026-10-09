import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op08PhoenixBrand055,
  op11Doll008,
  op12SilversRayleigh001,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP12-001 Silvers Rayleigh", () => {
  test("reveals exactly two Events without discarding them and boosts a low-power Character", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op12SilversRayleigh001,
      hand: [op08PhoenixBrand055, op08PhoenixBrand055, op08PhoenixBrand055, eb01Doma005],
      character: [{ card: op11Doll008, playedOnTurn: 0 }],
    });
    const eventIds = engine
      .getView("south")
      .players.south.hand.filter((card) => card.cardId === op08PhoenixBrand055.id)
      .map((card) => card.instanceId)
      .filter((id): id is string => Boolean(id))
      .slice(0, 2);
    const targetId = engine.findCardInZone("south", "character", op11Doll008);

    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostRevealFromHand", { selectedIds: eventIds }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining(eventIds),
    );
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === targetId)
        ?.power,
    ).toBe(3000);
    expect(op12SilversRayleigh001.effects?.deckBuildingRules).toEqual([
      { rule: "cannotInclude", filters: [{ filter: "cost", comparison: "gte", value: 5 }] },
    ]);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op12SilversRayleigh001,
      hand: [op08PhoenixBrand055, op08PhoenixBrand055, op08PhoenixBrand055, eb01Doma005],
      character: [{ card: op11Doll008, playedOnTurn: 0 }],
    });
    engine.activateEffect(engine.leader("south"), "activateMain", "south");

    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("uses base power rather than attached DON power and expires its boost at turn end", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op12SilversRayleigh001,
      hand: [op08PhoenixBrand055, op08PhoenixBrand055],
      character: ["ST02-012", "ST02-002"],
      activeDon: 3,
    });
    const bepo = engine.findCardInZone("south", "character", "ST02-012");
    const doma = engine.findCardInZone("south", "character", "ST02-002");
    engine.attachDon(bepo, 3, "south");
    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine.accept("south");
    const choice = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (choice?.kind !== "selectEntity") throw new Error("Expected power target");
    expect(choice.candidates.map((candidate) => candidate.ref.id)).toContain(bepo);
    expect(choice.candidates.map((candidate) => candidate.ref.id)).not.toContain(doma);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [bepo] }, "south");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === bepo)
        ?.power,
    ).toBe(8000);
    engine.endTurn("south");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === bepo)
        ?.power,
    ).toBe(3000);
  });
});
