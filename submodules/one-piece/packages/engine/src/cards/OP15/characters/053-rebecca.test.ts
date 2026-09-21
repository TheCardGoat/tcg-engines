import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025 } from "@tcg/op-cards";
import { op15Leo052 } from "../../../../../cards/src/cards/characters/op15-052-leo.ts";
import { op15Rebecca039 } from "../../../../../cards/src/cards/leaders/op15-039-rebecca.ts";
import { op15Rebecca053 } from "../../../../../cards/src/cards/characters/op15-053-rebecca.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-053 Rebecca", () => {
  test("[On Play] reveals a Dressrosa card from the top 3", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op15Rebecca053],
        activeDon: 2,
        deck: [op15Leo052, eb01Doma005, eb01Fourtricks025],
      },
      {},
    );
    const leoId = engine.findCardInZone("south", "deck", op15Leo052);

    engine.playCard(op15Rebecca053);

    const reveal = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (reveal?.kind !== "selectEntity") throw new Error("Expected Rebecca's reveal choice.");
    expect(reveal.candidates.map((candidate) => candidate.ref.id)).toContain(leoId);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [leoId] }, "south");

    const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw new Error("Expected the remainder order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      {
        selectedIds: [
          engine.findCardInZone("south", "deck", eb01Doma005),
          engine.findCardInZone("south", "deck", eb01Fourtricks025),
        ],
      },
      "south",
    );

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      leoId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[DON!! x1] blocks with a Dressrosa Leader once a DON!! is attached", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op15Rebecca039, character: [op15Rebecca053], activeDon: 4 },
      { activeDon: 2 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const rebeccaId = engine.findCardInZone("south", "character", op15Rebecca053);

    engine.attachDon(rebeccaId, 1, "south");
    engine.endTurn("south");
    engine.attachDon(engine.leader("north"), 2, "north");
    engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");

    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected a Blocker decision.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(rebeccaId);
    engine.resolveDecision("battleBlocker", { selectedIds: [rebeccaId] }, "south");
  });
});
