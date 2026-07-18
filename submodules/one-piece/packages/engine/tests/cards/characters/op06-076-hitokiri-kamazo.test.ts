import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  op01PageOne112,
  op02Saldeath074,
  op02Shiki075,
  op06HitokiriKamazo076,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-076 Hitokiri Kamazo", () => {
  test("K.O.s one cost-2-or-less Character after own DON!! returns, only once per turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          op06HitokiriKamazo076,
          { card: op01PageOne112, playedOnTurn: 0 },
          { card: op01PageOne112, playedOnTurn: 0 },
        ],
        activeDon: 2,
      },
      { character: [op02Saldeath074, op02Shiki075, eb01MountainGod018] },
    );
    const pageOneIds = engine
      .getView("south")
      .players.south.characters.filter((card) => card?.cardId === op01PageOne112.id)
      .flatMap((card) => (card ? [card.instanceId] : []));
    const firstEligibleId = engine.findCardInZone("north", "character", op02Saldeath074);
    const secondEligibleId = engine.findCardInZone("north", "character", op02Shiki075);
    const excludedId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.activateEffect(pageOneIds[0]!, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const ko = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(ko?.kind).toBe("selectEntity");
    if (ko?.kind !== "selectEntity") throw new Error("Expected Kamazo's K.O. target.");
    expect(ko).toMatchObject({ min: 0, max: 1 });
    expect(ko.candidates.map((candidate) => candidate.ref.id)).toEqual([
      firstEligibleId,
      secondEligibleId,
    ]);
    expect(ko.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [firstEligibleId] }, "south");

    engine.activateEffect(pageOneIds[1]!, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(firstEligibleId);
    expect(
      view.players.north.characters.some((card) => card?.instanceId === secondEligibleId),
    ).toBe(true);
    expect(view.players.north.characters.some((card) => card?.instanceId === excludedId)).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("does not trigger when DON!! returns during the opponent's turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op06HitokiriKamazo076] },
      {
        character: [{ card: op01PageOne112, playedOnTurn: 0 }, op02Saldeath074],
        activeDon: 1,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const pageOneId = engine.findCardInZone("north", "character", op01PageOne112);
    const lowCostId = engine.findCardInZone("north", "character", op02Saldeath074);

    engine.activateEffect(pageOneId, "activateMain", "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");

    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(
      engine
        .getView("south")
        .players.north.characters.some((card) => card?.instanceId === lowCostId),
    ).toBe(true);
    expect(
      engine
        .getView("south")
        .players.south.characters.some((card) => card?.cardId === op06HitokiriKamazo076.id),
    ).toBe(true);
  });
});
