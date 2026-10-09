import { expect, test } from "vite-plus/test";
import { getCard } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

test.each([0, 1])(
  "Blocker with %i attached DON ends the battle only when its On Block removes the attacker",
  (don) => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: getCard("ST03-006"), attachedDon: 4, playedOnTurn: 0 }] },
      { character: [{ card: getCard("ST03-003"), attachedDon: don }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attacker = engine.findCardInZone("south", "character", "ST03-006");
    const blocker = engine.findCardInZone("north", "character", "ST03-003");
    engine.declareAttack(attacker, engine.leader("north"), "south");
    engine.resolveDecision("battleBlocker", { selectedIds: [blocker] }, "north");
    if (don) engine.resolveDecision("effectTargetSelection", { selectedIds: [attacker] }, "north");
    expect(
      engine.getView("north").players.north.characters.some((card) => card?.instanceId === blocker),
    ).toBe(don === 1);
    expect(
      engine
        .getView("north")
        .players.south.characters.some((card) => card?.instanceId === attacker),
    ).toBe(don === 0);
    expect(engine.getView("north").prompts).toHaveLength(0);
  },
);

test("Crocodile may bottom-deck its owner's cost2 Character on block", () => {
  const engine = OnePieceTestEngine.create(
    { character: [{ card: getCard("EB01-018"), playedOnTurn: 0 }] },
    { character: [{ card: getCard("ST03-003"), attachedDon: 1 }, "ST03-006"] },
    { firstPlayer: "north", activeSeat: "south" },
  );
  const target = engine.findCardInZone("north", "character", "ST03-006");
  const before = engine.getView("north").players.north.deckCount;
  engine.declareAttack(
    engine.findCardInZone("south", "character", "EB01-018"),
    engine.leader("north"),
    "south",
  );
  engine.resolveDecision(
    "battleBlocker",
    { selectedIds: [engine.findCardInZone("north", "character", "ST03-003")] },
    "north",
  );
  engine.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "north");
  expect(engine.getView("north").players.north.deckCount).toBe(before + 1);
  expect(
    engine.getView("north").players.north.characters.some((card) => card?.instanceId === target),
  ).toBe(false);
});
