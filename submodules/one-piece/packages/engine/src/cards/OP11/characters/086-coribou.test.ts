import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op10Caribou104, op11Coribou086 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-086 Coribou", () => {
  test("trashes from hand on play, then trashes itself to play a low-cost Caribou from trash", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op11Coribou086, eb01Doma005, eb01Fourtricks025],
      trash: [op10Caribou104],
      activeDon: op11Coribou086.cost,
    });
    const discardedId = engine.findCardInZone("south", "hand", eb01Doma005);
    const keptId = engine.findCardInZone("south", "hand", eb01Fourtricks025);
    const caribouId = engine.findCardInZone("south", "trash", op10Caribou104);

    engine.playCard(op11Coribou086, "south");
    const discard = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    expect(discard?.kind).toBe("selectEntity");
    if (discard?.kind !== "selectEntity") throw new Error("Expected Coribou's discard choice.");
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [discardedId] }, "south");

    const coribouId = engine.findCardInZone("south", "character", op11Coribou086);
    engine.activateEffect(coribouId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (play?.kind !== "selectEntity") throw new Error("Expected Coribou's Caribou choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([caribouId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [caribouId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([discardedId, coribouId]),
    );
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([keptId]);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(caribouId);
    expect(view.prompts).toHaveLength(0);
  });
});
