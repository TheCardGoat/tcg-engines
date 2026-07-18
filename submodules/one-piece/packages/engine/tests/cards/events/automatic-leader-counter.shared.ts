import { expect, test } from "vite-plus/test";
import { eb01MountainGod018 } from "@tcg/op-cards";
import type { EventCard } from "@tcg/op-types";

import { OnePieceTestEngine } from "../../../src/index.ts";

export function defineAutomaticLeaderCounterTest(card: EventCard) {
  test("automatically gives the defending Leader enough Counter power", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        hand: [card],
        activeDon: card.cost,
        life: 2,
      },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", card);

    engine.endTurn("south");
    engine.endTurn("north");
    const lifeBeforeAttack = engine.getView("north").players.north.lifeCount;
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(lifeBeforeAttack);
    expect(view.players.north.trash.map((candidate) => candidate.instanceId)).toContain(eventId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
}
