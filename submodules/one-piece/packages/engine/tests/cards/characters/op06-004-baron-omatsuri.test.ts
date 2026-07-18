import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op06BaronOmatsuri004, op06LilyCarnation015 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-004 Baron Omatsuri", () => {
  test("may play only Lily Carnation from hand without paying its cost", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op06BaronOmatsuri004, op06LilyCarnation015, eb01Doma005],
      activeDon: op06BaronOmatsuri004.cost,
    });
    const lilyId = engine.findCardInZone("south", "hand", op06LilyCarnation015);
    const wrongNameId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op06BaronOmatsuri004, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Baron Omatsuri's play choice.");
    expect(play).toMatchObject({ min: 0, max: 1 });
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([lilyId]);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongNameId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [lilyId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(lilyId);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 2 });
    expect(view.prompts).toHaveLength(0);
  });
});
