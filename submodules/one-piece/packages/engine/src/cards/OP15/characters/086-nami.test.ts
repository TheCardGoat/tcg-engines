import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op05MonkeyDLuffy119, op15Nami086, op15Sanji081 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-086 Nami", () => {
  test("under a {Straw Hat Crew} Leader it replays a cost-7-or-less Straw Hat from the trash with Rush", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP15-022",
        hand: [op15Nami086],
        trash: [op15Sanji081, op05MonkeyDLuffy119, eb01Doma005],
        activeDon: op15Nami086.cost + 1,
      },
      {},
    );

    engine.playCard(op15Nami086, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected the replay choice.");
    const candidates = play.candidates.map((candidate) => candidate.ref.id);
    const sanjiId = engine.findCardInZone("south", "trash", op15Sanji081);
    expect(candidates).toContain(sanjiId);
    expect(candidates).not.toContain(engine.findCardInZone("south", "trash", op05MonkeyDLuffy119));
    expect(candidates).not.toContain(engine.findCardInZone("south", "trash", eb01Doma005));
    engine.resolveDecision("effectPlaySelection", { selectedIds: [sanjiId] }, "south");

    const view = engine.getView("south").players.south;
    const sanjiCard = view.characters.find((c) => c?.instanceId === sanjiId);
    expect(sanjiCard?.instanceId).toBe(sanjiId);
    // [Rush] lets the replayed Character attack the same turn — the declare
    // is the proof; the 2000-power attacker deals no damage to the Leader.
    expect(() => engine.asSouth().attack(sanjiId, engine.asNorth().leader())).not.toThrow();
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("does nothing under a Leader without the {Straw Hat Crew} type", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP16-080",
        hand: [op15Nami086],
        trash: [op15Sanji081],
        activeDon: op15Nami086.cost,
      },
      {},
    );

    engine.playCard(op15Nami086, "south");
    expect(engine.getView("south").players.south.trash.map((card) => card.cardId)).toContain(
      op15Sanji081.id,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
