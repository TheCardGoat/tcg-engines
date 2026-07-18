import { describe, expect, test } from "vite-plus/test";
import type { EventCard } from "@tcg/op-types";
import { eb01Doma005, eb01MountainGod018, eb01OffWhite019, op07Bartolomeo031 } from "@tcg/op-cards";

import { registerCards } from "../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

const restCharacter: EventCard = {
  ...eb01OffWhite019,
  id: "TEST-OP07-031-REST",
  canonicalId: "TEST-OP07-031-REST",
  name: "Bartolomeo Rest Review",
  cost: 0,
  effect: "[Main] Rest up to 1 of your opponent's Characters.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: 1, upTo: true },
            },
          },
        ],
      },
    ],
  },
};

registerCards([restCharacter]);

describe("OP07-031 Bartolomeo", () => {
  test("can use Blocker against an opposing attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op07Bartolomeo031] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const bartolomeoId = engine.findCardInZone("south", "character", op07Bartolomeo031);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Bartolomeo's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(bartolomeoId);
    engine.resolveDecision("battleBlocker", { selectedIds: [bartolomeoId] }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      bartolomeoId,
    );
  });

  test("draws then trashes once when a Character is rested by its controller's effect", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [restCharacter, restCharacter, eb01Doma005],
        deck: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        character: [op07Bartolomeo031],
      },
      { character: [eb01Doma005, eb01MountainGod018] },
    );
    const targets = engine
      .getView("south")
      .players.north.characters.filter((card) => card !== null)
      .map((card) => card.instanceId);
    const trashChoiceId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(restCharacter, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targets[0]!] }, "south");
    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    expect(trash?.kind).toBe("selectEntity");
    if (trash?.kind !== "selectEntity") throw new Error("Expected Bartolomeo's hand-trash choice.");
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toContain(trashChoiceId);
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [trashChoiceId] },
      "south",
    );

    const afterFirst = engine.getView("south");
    expect(afterFirst.players.south.trash.map((card) => card.instanceId)).toContain(trashChoiceId);
    expect(
      afterFirst.players.north.characters.find((card) => card?.instanceId === targets[0])?.rested,
    ).toBe(true);

    engine.playCard(restCharacter, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targets[1]!] }, "south");
    const afterSecond = engine.getView("south");
    expect(afterSecond.players.south.handCount).toBe(afterFirst.players.south.handCount - 1);
    expect(
      afterSecond.players.north.characters.find((card) => card?.instanceId === targets[1])?.rested,
    ).toBe(true);
    expect(afterSecond.prompts).toHaveLength(0);
  });
});
