import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op10CaesarClown006,
  op10Smiley009,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-006 Caesar Clown", () => {
  test("finds Smiley, bottom-orders the rest, then plays that physical Smiley", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op10CaesarClown006],
      deck: [
        op10Smiley009,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
        eb01Doma005,
        eb01Fourtricks025,
      ],
      activeDon: op10CaesarClown006.cost,
    });
    const smileyId = engine.findCardInZone("south", "deck", op10Smiley009);

    engine.playCard(op10CaesarClown006, "south");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [smileyId] }, "south");
    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected Caesar's bottom order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: remainder.candidates.map((candidate) => candidate.ref.id).reverse() },
      "south",
    );

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Caesar's Smiley choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toContain(smileyId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [smileyId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(smileyId);
    expect(view.prompts).toHaveLength(0);
  });
});
