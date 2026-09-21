import { describe, expect, test } from "vite-plus/test";
import { eb01ConquererOfThreeWorldsRagnaraku039, eb01Doma005, op02IceAge117 } from "@tcg/op-cards";
import { op04Kyros082 } from "../../../../../cards/src/cards/characters/op04-082-kyros.ts";
import { op15Bartolomeo014 } from "../../../../../cards/src/cards/characters/op15-014-bartolomeo.ts";
import { op04GumGumKingKongGun093 } from "../../../../../cards/src/cards/events/op04-093-gum-gum-king-kong-gun.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-014 Bartolomeo", () => {
  test("[On Play] activates a Dressrosa Event with base cost 3 or less from hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op15Bartolomeo014, op04GumGumKingKongGun093, op02IceAge117],
        character: [op04Kyros082],
        activeDon: 5,
      },
      {},
    );
    const kyrosId = engine.findCardInZone("south", "character", op04Kyros082);

    engine.playCard(op15Bartolomeo014);

    const select = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (select?.kind !== "selectEntity") throw new Error("Expected Bartolomeo's Event choice.");
    const eventId = engine.findCardInZone("south", "hand", op04GumGumKingKongGun093);
    expect(select.candidates.map((candidate) => candidate.ref.id)).toEqual([eventId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eventId] }, "south");

    const boost = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (boost?.kind !== "selectEntity") throw new Error("Expected the Event's power target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [kyrosId] }, "south");

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === kyrosId)
        ?.power,
    ).toBe(11000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("replaces its own K.O. by trashing an Event from hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op15Bartolomeo014],
        hand: [op02IceAge117, eb01Doma005],
        activeDon: 2,
      },
      { hand: [eb01ConquererOfThreeWorldsRagnaraku039], activeDon: 5, restedDon: 1 },
    );
    const bartoId = engine.findCardInZone("south", "character", op15Bartolomeo014);
    const eventId = engine
      .getView("south")
      .players.south.hand.find((card) => card.cardId === "OP02-117")?.instanceId;

    engine.endTurn("south");
    engine.playCard(eb01ConquererOfThreeWorldsRagnaraku039, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [bartoId] }, "north");

    engine.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");

    // The lone eligible Event is selected automatically.
    const south = engine.getView("south").players.south;
    expect(south.characters.some((card) => card?.instanceId === bartoId)).toBe(true);
    expect(south.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
