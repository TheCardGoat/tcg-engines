import { expect, test } from "vite-plus/test";
import { getCard } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

test.each([3, 4])(
  "Love-Love Mellow checks its %i remaining hand cards after Event payment",
  (others) => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: getCard("EB01-018"), playedOnTurn: 0 }] },
      {
        hand: ["ST03-017", ...Array(others).fill("ST03-002")],
        activeDon: 2,
        life: 2,
        deck: ["ST03-006", "ST03-011"],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const event = engine.findCardInZone("north", "hand", "ST03-017");
    const drawn = engine.findCardInZone("north", "deck", "ST03-006");
    engine.declareAttack(
      engine.findCardInZone("south", "character", "EB01-018"),
      engine.leader("north"),
      "south",
    );
    engine.resolveDecision("battleCounter", { selectedIds: [event] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    expect(
      engine
        .getView("north")
        .players.north.hand.map((card) => card.instanceId)
        .includes(drawn),
    ).toBe(others === 3);
    expect(engine.getView("north").players.north.lifeCount).toBe(2);
    expect(engine.getView("north").players.north.leader.power).toBe(5000);
  },
);

test("Love-Love Mellow still draws after skipping the power recipient", () => {
  const engine = OnePieceTestEngine.create(
    { character: [{ card: getCard("EB01-018"), playedOnTurn: 0 }] },
    {
      hand: ["ST03-017"],
      activeDon: 2,
      life: ["ST03-011", "ST03-002"],
      deck: ["ST03-006", "ST03-011"],
    },
    { firstPlayer: "north", activeSeat: "south" },
  );
  engine.declareAttack(
    engine.findCardInZone("south", "character", "EB01-018"),
    engine.leader("north"),
    "south",
  );
  engine.resolveDecision(
    "battleCounter",
    { selectedIds: [engine.findCardInZone("north", "hand", "ST03-017")] },
    "north",
  );
  engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "north");
  engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
  expect(engine.getView("north").players.north.hand.map((card) => card.cardId)).toEqual([
    "ST03-006",
    "ST03-011",
  ]);
  expect(engine.getView("north").players.north.lifeCount).toBe(1);
});
