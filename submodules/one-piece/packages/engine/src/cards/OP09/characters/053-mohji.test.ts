import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op09Mohji053,
  op09Richie054,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-053 Mohji", () => {
  test("finds Richie, bottom-orders the rest, then plays the selected physical Richie", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op09Mohji053],
      deck: [
        op09Richie054,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
        eb01Doma005,
        eb01Fourtricks025,
      ],
      activeDon: op09Mohji053.cost,
    });
    const richieId = engine.findCardInZone("south", "deck", op09Richie054);

    engine.playCard(op09Mohji053, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Mohji's search choice.");
    expect(search.candidates.find((candidate) => candidate.ref.id === richieId)?.legal).toBe(true);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [richieId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected Mohji's bottom order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: remainder.candidates.map((candidate) => candidate.ref.id).reverse() },
      "south",
    );

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Mohji's Richie play choice.");
    expect(play).toMatchObject({ min: 0, max: 1 });
    expect(play.candidates.map((candidate) => candidate.ref.id)).toContain(richieId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [richieId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(richieId);
    expect(view.prompts).toHaveLength(0);
  });
  test("zero search selection still permits playing Richie already in hand", () => {
    const e = OnePieceTestEngine.create({
      hand: ["OP09-053", "OP09-054"],
      deck: ["OP09-054", "ST02-012", "ST02-006", "ST15-002", "ST04-003", "ST02-012"],
      activeDon: 5,
    });
    const hand = e.findCardInZone("south", "hand", "OP09-054");
    const top = e.findCardInZone("south", "deck", "OP09-054");
    e.asSouth().play("OP09-053");
    e.asSouth().chooseSearch();
    const order = e.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw Error("order");
    e.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: order.candidates.map((c) => c.ref.id) },
      "south",
    );
    const play = e.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw Error("play");
    expect(play.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([hand]);
    e.asSouth().choosePlay(hand);
    expect(e.getView("south").players.south.characters.some((c) => c?.instanceId === hand)).toBe(
      true,
    );
    expect(e.getView("south").players.south.characters.some((c) => c?.instanceId === top)).toBe(
      false,
    );
  });
});
