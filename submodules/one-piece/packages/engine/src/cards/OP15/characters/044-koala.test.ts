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

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP15-044", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP15-044",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
