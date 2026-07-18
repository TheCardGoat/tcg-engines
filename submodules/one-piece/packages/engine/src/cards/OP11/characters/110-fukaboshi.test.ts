import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op11Shirahoshi022,
  op12UrsaShock096,
} from "@tcg/op-cards";
import { op11Fukaboshi110 } from "../../../../../cards/src/cards/OP11/characters/110-fukaboshi.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-110 Fukaboshi", () => {
  test("may rest its Fish-Man Island Leader instead of being K.O.'d", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op11Shirahoshi022, character: [op11Fukaboshi110] },
      { hand: [op12UrsaShock096], activeDon: op12UrsaShock096.cost },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const fukaboshiId = engine.findCardInZone("south", "character", op11Fukaboshi110);

    engine.playCard(op12UrsaShock096, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [fukaboshiId] }, "north");

    const replacement = engine.pendingDecision("effectKoReplacement", "south").steps[0];
    expect(replacement?.kind).toBe("confirm");
    engine.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.leader.rested).toBe(true);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(fukaboshiId);
    expect(view.prompts).toHaveLength(0);
  });

  test("takes either end of Life before K.O.'ing a cost-1-or-less opponent", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op11Fukaboshi110],
        life: [eb01Doma005, eb01MountainGod018],
        activeDon: op11Fukaboshi110.cost,
      },
      { character: [eb01Doma005, eb01MountainGod018] },
    );
    const bottomLifeId = engine.findCardInZone("south", "life", eb01MountainGod018);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const excludedId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op11Fukaboshi110, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostAddLifeToHand", { optionId: "bottom" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Fukaboshi's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(bottomLifeId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.prompts).toHaveLength(0);
  });
});
