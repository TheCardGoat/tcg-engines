import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005 } from "@tcg/op-cards";
import { op04Kyros082 } from "../../../../../cards/src/cards/characters/op04-082-kyros.ts";
import { op04GumGumKingKongGun093 } from "../../../../../cards/src/cards/events/op04-093-gum-gum-king-kong-gun.ts";
import { op15Sabo046 } from "../../../../../cards/src/cards/characters/op15-046-sabo.ts";
import { op15Rebecca039 } from "../../../../../cards/src/cards/leaders/op15-039-rebecca.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-046 Sabo", () => {
  test("[On Play] activates a Dressrosa Event with a Dressrosa Leader", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op15Rebecca039,
        hand: [op15Sabo046, op04GumGumKingKongGun093, eb01Doma005],
        character: [op04Kyros082],
        activeDon: 8,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const kyrosId = engine.findCardInZone("south", "character", op04Kyros082);
    const eventId = engine.findCardInZone("south", "hand", op04GumGumKingKongGun093);

    engine.playCard(op15Sabo046);

    const select = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (select?.kind !== "selectEntity") throw new Error("Expected Sabo's Event choice.");
    expect(select.candidates.map((candidate) => candidate.ref.id)).toEqual([eventId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eventId] }, "south");

    const boost = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (boost?.kind !== "selectEntity") throw new Error("Expected the Event's power target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [kyrosId] }, "south");

    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === kyrosId)
        ?.power,
    ).toBe(11000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP15-046", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP15-046",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
