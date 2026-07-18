import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op13Higuma013,
  op13Otama043,
  prb01DuvalJollyRogerFoil014,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST12-014 Duval", () => {
  test("privately orders the top three cards at a chosen deck end and can block", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [prb01DuvalJollyRogerFoil014],
        deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op13Higuma013, op13Otama043],
        activeDon: prb01DuvalJollyRogerFoil014.cost,
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const lookedIds = engine.getState().players.south.deck.slice(0, 3);
    const chosenOrder = [...lookedIds].reverse();

    engine.playCard(prb01DuvalJollyRogerFoil014, "south");
    const duvalId = engine.findCardInZone("south", "character", prb01DuvalJollyRogerFoil014);

    const order = engine.pendingDecision("effectRearrangeDeckOrder", "south").steps[0];
    expect(order).toMatchObject({ kind: "orderItems", min: 3, max: 3 });
    if (order?.kind !== "orderItems") throw new Error("Expected Duval's private deck order.");
    expect(order.candidates.map((candidate) => candidate.ref.id)).toEqual(lookedIds);
    engine.resolveDecision("effectRearrangeDeckOrder", { selectedIds: chosenOrder }, "south");

    const position = engine.pendingDecision("effectRearrangeDeckPosition", "south").steps[0];
    expect(position?.kind).toBe("chooseOption");
    engine.resolveDecision("effectRearrangeDeckPosition", { optionId: "bottom" }, "south");
    expect(engine.getState().players.south.deck.slice(-3)).toEqual(chosenOrder);

    engine.endTurn("south");
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Duval's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(duvalId);
    engine.resolveDecision("battleBlocker", { selectedIds: [duvalId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(duvalId);
    expect(view.prompts).toHaveLength(0);
  });
});
