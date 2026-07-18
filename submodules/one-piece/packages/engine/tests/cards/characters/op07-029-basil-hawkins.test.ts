import { describe, expect, test } from "vite-plus/test";
import type { EventCard } from "@tcg/op-types";
import {
  eb01Doma005,
  eb01MountainGod018,
  eb01OffWhite019,
  op07BasilHawkins029,
  op07JewelryBonney019,
} from "@tcg/op-cards";

import { registerCards } from "../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

const koHawkins: EventCard = {
  ...eb01OffWhite019,
  id: "TEST-OP07-029-KO",
  canonicalId: "TEST-OP07-029-KO",
  name: "Hawkins K.O. Review",
  cost: 0,
  effect: "[Main] K.O. up to 1 of your opponent's Characters.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "ko",
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

registerCards([koHawkins]);

describe("OP07-029 Basil Hawkins", () => {
  test("gains Blocker only with a Supernovas Leader", () => {
    const withTrait = OnePieceTestEngine.create(
      { leaderCardId: op07JewelryBonney019, character: [op07BasilHawkins029] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const hawkinsId = withTrait.findCardInZone("south", "character", op07BasilHawkins029);
    const attackerId = withTrait.findCardInZone("north", "character", eb01MountainGod018);

    withTrait.declareAttack(attackerId, withTrait.leader("south"), "north");
    const blocker = withTrait.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Hawkins's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(hawkinsId);

    const withoutTrait = OnePieceTestEngine.create(
      { character: [op07BasilHawkins029] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    withoutTrait.declareAttack(
      withoutTrait.findCardInZone("north", "character", eb01MountainGod018),
      withoutTrait.leader("south"),
      "north",
    );
    expect(
      withoutTrait
        .getView("south")
        .decisions.some((decision) => decision.title.includes("Blocker")),
    ).toBe(false);
  });

  test("once per turn may rest an opposing Character instead of its own opponent-effect removal", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op07BasilHawkins029] },
      { hand: [koHawkins, koHawkins], character: [eb01Doma005, eb01MountainGod018] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const hawkinsId = engine.findCardInZone("south", "character", op07BasilHawkins029);
    const domaId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(koHawkins, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [hawkinsId] }, "north");
    engine.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");
    const payment = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(payment?.kind).toBe("selectEntity");
    if (payment?.kind !== "selectEntity") throw new Error("Expected Hawkins's rest replacement.");
    expect(payment.candidates.map((candidate) => candidate.ref.id)).toContain(domaId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [domaId] }, "south");

    let view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === hawkinsId)).toBe(true);
    expect(view.players.north.characters.find((card) => card?.instanceId === domaId)?.rested).toBe(
      true,
    );

    engine.playCard(koHawkins, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [hawkinsId] }, "north");
    view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(hawkinsId);
    expect(view.prompts).toHaveLength(0);
  });
});
