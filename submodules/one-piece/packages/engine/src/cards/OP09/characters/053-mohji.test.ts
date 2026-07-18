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
});
