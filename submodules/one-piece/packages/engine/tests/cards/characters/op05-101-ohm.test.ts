import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op05Holly110,
  op05Ohm101,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-101 Ohm", () => {
  test("reveals a Holly from the top five, bottoms the rest in order, then plays a Holly from hand", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op05Ohm101, op05Holly110],
      deck: [
        op05Holly110,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
        eb01Doma005,
        eb01Fourtricks025,
      ],
      activeDon: op05Ohm101.cost,
    });
    const searchedHollyId = engine.findCardInZone("south", "deck", op05Holly110);
    const handHollyId = engine.findCardInZone("south", "hand", op05Holly110);

    engine.playCard(op05Ohm101, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Ohm's Holly search.");
    expect(search).toMatchObject({ min: 0, max: 1 });
    expect(
      search.candidates.filter((candidate) => candidate.legal).map((candidate) => candidate.ref.id),
    ).toEqual([searchedHollyId]);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [searchedHollyId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected Ohm's remainder order.");
    const submittedOrder = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: submittedOrder }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Ohm's Holly play choice.");
    expect(play).toMatchObject({ min: 0, max: 1 });
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([searchedHollyId, handHollyId]),
    );
    engine.resolveDecision("effectPlaySelection", { selectedIds: [searchedHollyId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(
      searchedHollyId,
    );
    expect(engine.getState().players.south.deck.slice(-4)).toEqual(submittedOrder);
    expect(view.prompts).toHaveLength(0);
  });

  test("gains +1000 power at two Life, but not at three", () => {
    const enabled = OnePieceTestEngine.create({
      life: [eb01Doma005, eb01Fourtricks025],
      character: [op05Ohm101],
    });
    const enabledId = enabled.findCardInZone("south", "character", op05Ohm101);
    expect(
      enabled
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === enabledId)?.power,
    ).toBe(6000);

    const disabled = OnePieceTestEngine.create({
      life: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      character: [op05Ohm101],
    });
    const disabledId = disabled.findCardInZone("south", "character", op05Ohm101);
    expect(
      disabled
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === disabledId)?.power,
    ).toBe(5000);
  });

  test("may reveal no Holly and still plays a Holly already in hand", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op05Ohm101, op05Holly110],
      deck: [
        eb01Doma005,
        eb01Fourtricks025,
        eb01Doma005,
        eb01Fourtricks025,
        eb01Doma005,
        eb01Fourtricks025,
      ],
      activeDon: op05Ohm101.cost,
    });
    const hollyId = engine.findCardInZone("south", "hand", op05Holly110);

    engine.playCard(op05Ohm101, "south");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "south");
    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (remainder?.kind !== "orderItems") throw new Error("Expected Ohm's deck-bottom order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: remainder.candidates.map((candidate) => candidate.ref.id) },
      "south",
    );

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Ohm's Holly play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([hollyId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [hollyId] }, "south");
    expect(engine.findCardInZone("south", "character", op05Holly110)).toBe(hollyId);
  });
});
