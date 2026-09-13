import { describe, expect, it } from "vite-plus/test";
import { toFabCardDefinition, type FabCardDefinitionInput } from "../cards.ts";
import { FabTestEngine } from "../testing/test-engine.ts";
import { barragingBeatdownRed as barragingBeatdown } from "../../../cards/src/cards/actions/barraging-beatdown.ts";

const brute: FabCardDefinitionInput = {
  canonicalId: "barraging-test-brute",
  name: "Brute",
  types: ["Brute", "Hero", "Young"],
  health: 20,
  intelligence: 4,
};
const opponent: FabCardDefinitionInput = {
  canonicalId: "barraging-test-opponent",
  name: "Opponent",
  types: ["Generic", "Hero", "Young"],
  health: 20,
  intelligence: 4,
};
const bruteAttack: FabCardDefinitionInput = {
  canonicalId: "barraging-test-brute-attack",
  name: "Brute Attack",
  types: ["Brute", "Action", "Attack"],
  cost: 0,
  power: 6,
  defense: 3,
};
const genericAttack: FabCardDefinitionInput = {
  canonicalId: "barraging-test-generic-attack",
  name: "Generic Attack",
  types: ["Generic", "Action", "Attack"],
  cost: 0,
  power: 4,
  defense: 3,
  keywords: ["go-again"],
};
const defender: FabCardDefinitionInput = {
  canonicalId: "barraging-test-defender",
  name: "Defender",
  types: ["Generic", "Action"],
  defense: 2,
};
const equipment: FabCardDefinitionInput = {
  canonicalId: "barraging-test-equipment",
  name: "Equipment",
  types: ["Generic", "Equipment", "Head"],
  defense: 1,
};

const defs = {
  [barragingBeatdown.canonicalId]: toFabCardDefinition(
    barragingBeatdown as unknown as Parameters<typeof toFabCardDefinition>[0],
  ),
  [brute.canonicalId]: brute,
  [opponent.canonicalId]: opponent,
  [bruteAttack.canonicalId]: bruteAttack,
  [genericAttack.canonicalId]: genericAttack,
  [defender.canonicalId]: defender,
  [equipment.canonicalId]: equipment,
};

function resolveBeatdown(game: FabTestEngine, playerId: string): void {
  game.as(brute).play(barragingBeatdown);
  game.passBoth();
  expect(game.getState().players[playerId]!.actionPoints).toBe(1);
  expect(game.getState().continuousEffectInstances).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        controllerId: playerId,
        futureApplicability: expect.objectContaining({ remaining: 1 }),
      }),
    ]),
  );
}

describe("WTR017 Barraging Beatdown", () => {
  it("gives the next Brute attack a dynamic +4 for zero or one non-equipment defenders, and removes it at two", () => {
    const attackPowerAfterDeclaration = (
      declared: readonly FabCardDefinitionInput[],
    ): number | undefined => {
      const game = FabTestEngine.create(
        {
          player1: { heroCardId: brute, hand: [barragingBeatdown, bruteAttack], deck: 4 },
          player2: {
            heroCardId: opponent,
            hand: [defender, defender],
            head: [equipment],
            deck: 4,
          },
          cardDefinitions: defs,
        },
        { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
      );
      const attacker = game.as(brute);
      const defenderPlayer = game.as(opponent);
      resolveBeatdown(game, attacker.id);
      attacker.attackWith(bruteAttack);
      game.helpers.expectStep("defend");
      expect(game.combat()?.activeLink?.attackPower).toBe(10);
      defenderPlayer.defend(declared);
      return game.combat()?.activeLink?.attackPower;
    };

    expect(attackPowerAfterDeclaration([equipment])).toBe(10);
    expect(attackPowerAfterDeclaration([equipment, defender])).toBe(10);
    expect(attackPowerAfterDeclaration([equipment, defender, defender])).toBe(6);
  });

  it("does not consume the effect on a non-Brute attack and expires it at end of turn", () => {
    const game = FabTestEngine.create(
      {
        player1: { heroCardId: brute, hand: [barragingBeatdown, genericAttack], deck: 4 },
        player2: { heroCardId: opponent, deck: 4 },
        cardDefinitions: defs,
      },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const attacker = game.as(brute);
    const defenderPlayer = game.as(opponent);
    resolveBeatdown(game, attacker.id);
    const beatdownEffectId = game.getState().continuousEffectInstances[0]!.effectId;

    attacker.play(genericAttack, { target: defenderPlayer.id });
    game.passBoth();
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    expect(
      game
        .getState()
        .continuousEffectInstances.some((continuous) => continuous.effectId === beatdownEffectId),
    ).toBe(true);
    game.resolveCombatNoReactions();
    attacker.endTurn();
    expect(
      game
        .getState()
        .continuousEffectInstances.some((continuous) => continuous.effectId === beatdownEffectId),
    ).toBe(false);
  });
});
