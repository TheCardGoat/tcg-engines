import { expect, test } from "vite-plus/test";
import { getCard } from "../../../cards/src/runtime-catalog.ts";
import { buildCardEffects } from "../../../../tools/op-card-parser/src/effect-parser/build-effects.ts";
import { OnePieceTestEngine } from "../../src/index.ts";

test("parsed Foxy freezes the rested Leader and permits only one Character", () => {
  const card = getCard("OP07-059");
  const original = card.effects;
  try {
    card.effects = buildCardEffects(card.effect ?? "");
    let engine = OnePieceTestEngine.create(
      { leaderCardId: card, character: ["OP07-060", "OP07-071", "OP07-072"], activeDon: 3 },
      {
        character: [
          { card: getCard("EB01-005"), rested: true },
          { card: getCard("EB01-018"), rested: true },
        ],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");
    engine.endTurn("north");
    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const choice = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (choice?.kind !== "selectEntity") throw new Error("Expected the optional Character target.");
    const first = engine.findCardInZone("north", "character", "EB01-005");
    const second = engine.findCardInZone("north", "character", "EB01-018");
    expect(choice).toMatchObject({ min: 0, max: 1 });
    expect(choice.candidates.map((candidate) => candidate.ref.id)).toEqual([first, second]);
    engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    engine.endTurn("south");
    expect(engine.getView("north").players.north.leader.rested).toBe(true);
    expect(
      engine
        .getView("north")
        .players.north.characters.filter(Boolean)
        .every((instance) => instance?.rested === false),
    ).toBe(true);
  } finally {
    card.effects = original;
  }
});

test("parsed Egghead offers the opposing eligible Character", () => {
  const card = getCard("OP07-117");
  const original = card.effects;
  try {
    card.effects = buildCardEffects(card.effect ?? "");
    const engine = OnePieceTestEngine.create(
      { stage: card, life: 3, character: [{ card: getCard("OP07-098"), rested: true }] },
      { character: [{ card: getCard("OP07-098"), rested: true }] },
    );
    const own = engine.findCardInZone("south", "character", "OP07-098");
    const opposing = engine.findCardInZone("north", "character", "OP07-098");
    engine.endTurn("south");
    const choice = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (choice?.kind !== "selectEntity") throw new Error("Expected the Egghead target.");
    expect(choice.candidates.map((candidate) => candidate.ref.id)).toEqual([own, opposing]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [opposing] }, "south");
    expect(engine.getState().cards[own]?.rested).toBe(true);
    expect(engine.getState().cards[opposing]?.rested).toBe(false);
  } finally {
    card.effects = original;
  }
});
