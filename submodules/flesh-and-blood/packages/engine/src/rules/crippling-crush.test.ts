import { describe, expect, it } from "vite-plus/test";
import { toFabCardDefinition, type FabCardDefinitionInput } from "../cards.ts";
import { FabTestEngine } from "../testing/test-engine.ts";
import { cripplingCrushRed as cripplingCrush } from "../../../cards/src/cards/actions/crippling-crush.ts";

const bravo: FabCardDefinitionInput = {
  canonicalId: "crippling-test-bravo",
  name: "Bravo",
  types: ["Guardian", "Hero", "Young"],
  health: 20,
  intelligence: 4,
};
const opponent: FabCardDefinitionInput = {
  canonicalId: "crippling-test-opponent",
  name: "Opponent",
  types: ["Generic", "Hero", "Young"],
  health: 20,
  intelligence: 4,
};
const handA: FabCardDefinitionInput = {
  canonicalId: "crippling-test-a",
  types: ["Generic", "Action"],
};
const handB: FabCardDefinitionInput = {
  canonicalId: "crippling-test-b",
  types: ["Generic", "Action"],
};
const handC: FabCardDefinitionInput = {
  canonicalId: "crippling-test-c",
  types: ["Generic", "Action"],
};
const arsenal: FabCardDefinitionInput = {
  canonicalId: "crippling-test-arsenal",
  types: ["Generic", "Action"],
};
const eightDefense: FabCardDefinitionInput = {
  canonicalId: "crippling-test-eight-defense",
  types: ["Generic", "Action"],
  defense: 8,
};

const defs = {
  [cripplingCrush.canonicalId]: toFabCardDefinition(
    cripplingCrush as unknown as Parameters<typeof toFabCardDefinition>[0],
  ),
  [bravo.canonicalId]: bravo,
  [opponent.canonicalId]: opponent,
  [handA.canonicalId]: handA,
  [handB.canonicalId]: handB,
  [handC.canonicalId]: handC,
  [arsenal.canonicalId]: arsenal,
  [eightDefense.canonicalId]: eightDefense,
};

function makeGame(
  seed: string,
  hand: readonly FabCardDefinitionInput[],
  block = false,
): FabTestEngine {
  return FabTestEngine.create(
    {
      seed,
      player1: { heroCardId: bravo, hand: [cripplingCrush], resourcePoints: 7, deck: 4 },
      player2: {
        heroCardId: opponent,
        hand: block ? [eightDefense] : hand,
        arsenal: [arsenal],
        deck: 4,
      },
      cardDefinitions: defs,
    },
    // Walks priority/pitch timing by hand - opt out of the smart defaults.
    { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
  );
}

describe("WTR043 Crippling Crush", () => {
  it("on 4+ actual hero damage discards exactly two distinct seeded-random hand cards and leaves arsenal untouched", () => {
    const game = makeGame("crippling-seeded", [handA, handB, handC]);
    const attacker = game.as(bravo);
    const defender = game.as(opponent);
    attacker.play(cripplingCrush, { target: defender.id });
    game.passBoth();
    game.resolveCombatNoReactions();

    expect(defender.zone("hand")).toHaveLength(1);
    expect(defender.zone("graveyard")).toHaveLength(2);
    expect(new Set(defender.zone("graveyard"))).toHaveLength(2);
    expect(defender.zone("arsenal")).toContain(arsenal.canonicalId);
    expect(game.committedEvents().filter((event) => event.name === "discard")).toHaveLength(2);

    const sameSeed = makeGame("crippling-seeded", [handA, handB, handC]);
    const sameAttacker = sameSeed.as(bravo);
    sameAttacker.play(cripplingCrush, { target: sameSeed.as(opponent).id });
    sameSeed.passBoth();
    sameSeed.resolveCombatNoReactions();
    expect(sameSeed.as(opponent).zone("graveyard")).toEqual(defender.zone("graveyard"));
  });

  it("does nothing at 0–3 actual hero damage and safely discards only available cards", () => {
    const belowThreshold = makeGame("crippling-under", [], true);
    const attacker = belowThreshold.as(bravo);
    const defender = belowThreshold.as(opponent);
    attacker.attackWith(cripplingCrush);
    defender.defend(eightDefense);
    belowThreshold.resolveCombatNoReactions();
    expect(defender.zone("graveyard")).toContain(eightDefense.canonicalId);
    expect(defender.zone("arsenal")).toContain(arsenal.canonicalId);
    expect(belowThreshold.committedEvents().filter((event) => event.name === "discard")).toEqual(
      [],
    );

    const oneCard = makeGame("crippling-one", [handA]);
    oneCard.as(bravo).play(cripplingCrush, { target: oneCard.as(opponent).id });
    oneCard.passBoth();
    oneCard.resolveCombatNoReactions();
    expect(oneCard.as(opponent).zone("hand")).toEqual([]);
    expect(oneCard.as(opponent).zone("graveyard")).toEqual([handA.canonicalId]);
    expect(oneCard.as(opponent).zone("arsenal")).toContain(arsenal.canonicalId);
  });
});
