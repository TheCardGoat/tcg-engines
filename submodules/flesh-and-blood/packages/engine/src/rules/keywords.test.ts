import { describe, expect, it } from "vite-plus/test";
import { baseHasKeyword, toFabCardDefinition } from "../cards.ts";
import { FabTestEngine } from "../testing/test-engine.ts";
import { cripplingCrushRed as cripplingCrush } from "../../../cards/src/cards/actions/crippling-crush.ts";
import { chaseTheTailRed } from "../../../cards/src/cards/actions/chase-the-tail.ts";

const bravo = {
  canonicalId: "adr9-bravo",
  name: "Bravo",
  types: ["Guardian", "Hero", "Young"],
  health: 20,
  intelligence: 4,
};
const opponent = {
  canonicalId: "adr9-opponent",
  name: "Opponent",
  types: ["Generic", "Hero", "Young"],
  health: 20,
  intelligence: 4,
};
const handA = { canonicalId: "adr9-a", types: ["Generic", "Action"] };
const handB = { canonicalId: "adr9-b", types: ["Generic", "Action"] };
const handC = { canonicalId: "adr9-c", types: ["Generic", "Action"] };

describe("label keyword expansion", () => {
  it("Crippling Crush is a card with crush after keyword+rider authoring", () => {
    const def = toFabCardDefinition(cripplingCrush as never);
    expect(baseHasKeyword(def, "crush")).toBe(true);
  });

  it("Crippling Crush still discards 2 on 4+ hero damage", () => {
    const game = FabTestEngine.create(
      {
        seed: "adr9-crush",
        player1: { heroCardId: bravo, hand: [cripplingCrush], resourcePoints: 7, deck: 4 },
        player2: { heroCardId: opponent, hand: [handA, handB, handC], deck: 4 },
        cardDefinitions: {
          [cripplingCrush.canonicalId]: toFabCardDefinition(cripplingCrush as never),
          [bravo.canonicalId]: bravo,
          [opponent.canonicalId]: opponent,
          [handA.canonicalId]: handA,
          [handB.canonicalId]: handB,
          [handC.canonicalId]: handC,
        },
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const attacker = game.as(bravo);
    const defender = game.as(opponent);
    attacker.play(cripplingCrush, { target: defender.id });
    game.passBoth();
    game.resolveCombatNoReactions();
    expect(defender.zone("hand")).toHaveLength(1);
    expect(defender.zone("graveyard")).toHaveLength(2);
  });

  it("combo keyword still matches cards with combo", () => {
    const def = toFabCardDefinition(chaseTheTailRed as never);
    expect(baseHasKeyword(def, "combo")).toBe(true);
  });
});
