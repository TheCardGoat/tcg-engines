import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01BaroqueWorks090,
  op01Crocodile067,
  op01Kawamatsu037,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-067 Crocodile", () => {
  test("banishes damaged Life without its Trigger and discounts a blue Event in hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op01BaroqueWorks090],
        character: [{ card: op01Crocodile067, attachedDon: 1, playedOnTurn: 0 }],
        deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005, eb01Fourtricks025],
      },
      {
        life: [op01Kawamatsu037, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const crocodileId = engine.findCardInZone("south", "character", op01Crocodile067);
    const eventId = engine.findCardInZone("south", "hand", op01BaroqueWorks090);
    const lifeId = engine.findCardInZone("north", "life", op01Kawamatsu037);

    expect(
      engine.getView("south").players.south.hand.find((card) => card.instanceId === eventId)?.cost,
    ).toBe(0);

    engine.declareAttack(crocodileId, engine.leader("north"), "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      lifeId,
    );
    expect(
      engine.getView("south").players.north.characters.some((card) => card?.instanceId === lifeId),
    ).toBe(false);

    engine.playCard(op01BaroqueWorks090, "south");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "south");
    const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(order?.kind).toBe("orderItems");
    if (order?.kind !== "orderItems") throw new Error("Expected Baroque Works remainder order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: order.candidates.map((candidate) => candidate.ref.id) },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.restedDon).toBe(0);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.prompts).toHaveLength(0);
  });
});
