import { describe, expect, test } from "vite-plus/test";
import {
  eb01ConquererOfThreeWorldsRagnaraku039,
  eb01Doma005,
  eb01Fourtricks025,
} from "@tcg/op-cards";
import { op04GumGumKingKongGun093 } from "../../../../../cards/src/cards/events/op04-093-gum-gum-king-kong-gun.ts";
import { op15Koala044 } from "../../../../../cards/src/cards/characters/op15-044-koala.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-044 Koala", () => {
  test("[On K.O.] reveals a Dressrosa Event from the top 3", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op15Koala044],
        activeDon: 2,
        deck: [op04GumGumKingKongGun093, eb01Doma005, eb01Fourtricks025],
      },
      { hand: [eb01ConquererOfThreeWorldsRagnaraku039], activeDon: 5, restedDon: 1 },
    );
    const koalaId = engine.findCardInZone("south", "character", op15Koala044);
    const eventId = engine.findCardInZone("south", "deck", op04GumGumKingKongGun093);

    engine.endTurn("south");
    engine.playCard(eb01ConquererOfThreeWorldsRagnaraku039, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [koalaId] }, "north");

    const reveal = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (reveal?.kind !== "selectEntity") throw new Error("Expected Koala's reveal choice.");
    expect(reveal.candidates.map((candidate) => candidate.ref.id)).toContain(eventId);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [eventId] }, "south");

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
      eventId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("Blocker protects Life and the resulting K.O. still opens its search", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op15Koala044],
        hand: [],
        life: 3,
        deck: [op04GumGumKingKongGun093, eb01Doma005, eb01Fourtricks025],
      },
      {},
      { firstPlayer: "south", activeSeat: "north" },
    );
    const koalaId = engine.findCardInZone("south", "character", op15Koala044);
    engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [koalaId] }, "south");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "south");
    const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw new Error("Expected bottom order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: order.candidates.map((card) => card.ref.id) },
      "south",
    );
    expect(engine.getView("south").players.south.lifeCount).toBe(3);
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      koalaId,
    );
    expect(engine.getView("south").players.south.deckCount).toBe(3);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
