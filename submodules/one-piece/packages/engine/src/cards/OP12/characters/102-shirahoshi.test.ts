import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op04GumGumRedRoc056,
  op06GravityBladeRagingTiger058,
  op11BulgeEyedNeptunian027,
  op12DonquixoteDoflamingo107,
  op12Shirahoshi102,
} from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-102 Shirahoshi", () => {
  test("boosts included Neptunians only on the opponent's turn with no other base-cost-2 Shirahoshi", () => {
    const boosted = OnePieceTestEngine.create(
      { character: [op12Shirahoshi102, op11BulgeEyedNeptunian027] },
      {},
      { firstPlayer: "south", activeSeat: "north" },
    );
    const neptunianId = boosted.findCardInZone("south", "character", op11BulgeEyedNeptunian027);
    expect(
      boosted
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === neptunianId)?.power,
    ).toBe(8000);

    const suppressed = OnePieceTestEngine.create(
      { character: [op12Shirahoshi102, op12Shirahoshi102, op11BulgeEyedNeptunian027] },
      {},
      { firstPlayer: "south", activeSeat: "north" },
    );
    expect(
      suppressed
        .getView("south")
        .players.south.characters.find((card) => card?.cardId === op11BulgeEyedNeptunian027.id)
        ?.power,
    ).toBe(6000);
  });

  test("may replace an opponent-effect removal of a base-cost-6-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op12Shirahoshi102, eb01Doma005], life: [eb01Doma005] },
      { hand: [op06GravityBladeRagingTiger058], activeDon: op06GravityBladeRagingTiger058.cost },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const protectedId = engine.findCardInZone("south", "character", eb01Doma005);
    const lifeId = engine.findCardInZone("south", "life", eb01Doma005);

    engine.playCard(op06GravityBladeRagingTiger058, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [protectedId] }, "north");
    expect(engine.pendingDecision("effectRemovalReplacement", "south").actorId).toBe("south");
    engine.resolveDecision("effectRemovalReplacement", { optionId: "yes" }, "south");

    expect(
      engine.getView("south").players.south.characters.map((card) => card?.instanceId),
    ).toContain(protectedId);
    expect(engine.getState().cards[lifeId]?.faceUp).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("does not replace removal of a base-cost-7 Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op12Shirahoshi102, op12DonquixoteDoflamingo107], life: [eb01Doma005] },
      { hand: [op04GumGumRedRoc056], activeDon: op04GumGumRedRoc056.cost },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const doflamingoId = engine.findCardInZone("south", "character", op12DonquixoteDoflamingo107);

    engine.playCard(op04GumGumRedRoc056, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [doflamingoId] }, "north");

    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(
      engine.getView("south").players.south.characters.map((card) => card?.instanceId),
    ).not.toContain(doflamingoId);
  });
});
