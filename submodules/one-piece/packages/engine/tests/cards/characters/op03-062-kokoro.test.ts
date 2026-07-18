import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op03Kaku059,
  op03Kokoro062,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-062 Kokoro", () => {
  test("finds an included Water Seven trait other than Kokoro and bottoms the rest", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op03Kokoro062],
      deck: [
        op03Kaku059,
        op03Kokoro062,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
        eb01Doma005,
      ],
      activeDon: op03Kokoro062.cost,
    });
    const waterSevenId = engine.findCardInZone("south", "deck", op03Kaku059);
    const kokoroId = engine.findCardInZone("south", "deck", op03Kokoro062);
    engine.playCard(op03Kokoro062, "south");

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Kokoro's search.");
    expect(search.candidates.find((candidate) => candidate.ref.id === waterSevenId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === kokoroId)?.legal).toBe(false);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [waterSevenId] }, "south");
    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected Kokoro's bottom order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: remainder.candidates.map((candidate) => candidate.ref.id).reverse() },
      "south",
    );
    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      waterSevenId,
    );
  });
});
