import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op02Dobon080,
  op05UpperYard117,
  op08SouthBird100,
  op08XDrake093,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-100 South Bird", () => {
  test("with a full Character area, plays Upper Yard and bottoms the other six in chosen order", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op08SouthBird100],
      activeDon: 1,
      character: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
      deck: [
        op05UpperYard117,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
        op02Dobon080,
        op08XDrake093,
        eb01Doma005,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
        op02Dobon080,
        op08XDrake093,
        eb01Doma005,
      ],
    });
    const upperYardId = engine.findCardInZone("south", "deck", op05UpperYard117);

    engine.playCard(op08SouthBird100, "south");
    expect(engine.getView("south").players.south.characters.filter(Boolean)).toHaveLength(5);
    expect(engine.getView("south").players.south.stage).toBeNull();
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (search?.kind !== "selectEntity") throw new Error("Expected South Bird's Stage search.");
    expect(search.candidates.find((candidate) => candidate.ref.id === upperYardId)?.legal).toBe(
      true,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [upperYardId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (remainder?.kind !== "orderItems") throw new Error("Expected South Bird's remainder order.");
    const order = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: order }, "south");

    let view = engine.getView("south");
    expect(view.players.south.stage?.instanceId).toBe(upperYardId);
    expect(engine.getState().players.south.deck.slice(-6)).toEqual(order);

    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "south");
    const nestedRemainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (nestedRemainder?.kind !== "orderItems") {
      throw new Error("Expected Upper Yard's nested remainder order.");
    }
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: nestedRemainder.candidates.map((candidate) => candidate.ref.id) },
      "south",
    );
    view = engine.getView("south");
    expect(view.players.south.stage?.instanceId).toBe(upperYardId);
    expect(view.prompts).toHaveLength(0);
  });
});
