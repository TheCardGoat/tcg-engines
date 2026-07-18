import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op01Killer039, op14eb04EustassCaptainKidEb04039039 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe('EB04-039 Eustass"Captain"Kid', () => {
  test("adds an active DON!! on play, then trashes itself to play a compound Kid Pirates Character from hand", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op14eb04EustassCaptainKidEb04039039, op01Killer039, eb01Doma005],
      activeDon: op14eb04EustassCaptainKidEb04039039.cost,
      donDeckCount: 2,
    });
    const kidId = engine.findCardInZone("south", "hand", op14eb04EustassCaptainKidEb04039039);
    const killerId = engine.findCardInZone("south", "hand", op01Killer039);

    engine.playCard(op14eb04EustassCaptainKidEb04039039, "south");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");
    expect(engine.getView("south").players.south).toMatchObject({
      activeDon: 1,
      restedDon: op14eb04EustassCaptainKidEb04039039.cost,
      donDeckCount: 1,
    });

    engine.activateEffect(kidId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Kid's hand-play selection.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toContain(killerId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [killerId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(kidId);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(killerId);
    expect(view.prompts).toHaveLength(0);
  });
});
