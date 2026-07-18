import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op01Fukurokuju110, op01HitokiriKamazo108 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-108 Hitokiri Kamazo", () => {
  test("on battle K.O. returns one DON!! and K.O.s only a cost-5-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op01HitokiriKamazo108, rested: true }],
        activeDon: 1,
      },
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: op01Fukurokuju110, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const kamazoId = engine.findCardInZone("south", "character", op01HitokiriKamazo108);
    const eligibleId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const excludedId = engine.findCardInZone("north", "character", op01Fukurokuju110);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.declareAttack(eligibleId, kamazoId, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Kamazo's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(kamazoId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.characters.some((card) => card?.instanceId === excludedId)).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
