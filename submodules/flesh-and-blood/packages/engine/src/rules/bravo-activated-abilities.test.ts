import { describe, expect, it } from "vite-plus/test";
import { listLegalCommands } from "../automation/legal-commands.ts";
import { toFabCardDefinition, type FabCardDefinitionInput } from "../cards.ts";
import { FabTestEngine } from "../testing/test-engine.ts";
import { bravo } from "../../../cards/src/cards/heroes/bravo.ts";
import { anothos } from "../../../cards/src/cards/weapons/anothos.ts";

const opponent: FabCardDefinitionInput = {
  canonicalId: "bravo-activation-opponent",
  name: "Opponent",
  types: ["Generic", "Hero", "Young"],
  health: 20,
  intelligence: 4,
};

const costThreeAttack: FabCardDefinitionInput = {
  canonicalId: "bravo-activation-cost-three-attack",
  name: "Cost Three Attack",
  types: ["Guardian", "Action", "Attack"],
  cost: 3,
  power: 6,
  defense: 3,
};

const costTwoAttack: FabCardDefinitionInput = {
  canonicalId: "bravo-activation-cost-two-attack",
  name: "Cost Two Attack",
  types: ["Guardian", "Action", "Attack"],
  cost: 2,
  power: 5,
  defense: 3,
};

const blueCostThreePitch: FabCardDefinitionInput = {
  canonicalId: "bravo-activation-blue-cost-three",
  name: "Blue Cost Three Pitch",
  types: ["Guardian", "Action"],
  pitch: 3,
  cost: 3,
};

function catalog(card: unknown): FabCardDefinitionInput {
  return toFabCardDefinition(card as Parameters<typeof toFabCardDefinition>[0]);
}

const defs = {
  [bravo.canonicalId]: catalog(bravo),
  [anothos.canonicalId]: catalog(anothos),
  [opponent.canonicalId]: opponent,
  [costThreeAttack.canonicalId]: costThreeAttack,
  [costTwoAttack.canonicalId]: costTwoAttack,
  [blueCostThreePitch.canonicalId]: blueCostThreePitch,
};

function passStack(game: FabTestEngine, first: string, second: string): void {
  game.exec({ move: "pass", actorId: first });
  game.exec({ move: "pass", actorId: second });
}

describe("BVO activated starter abilities", () => {
  it("lists and resolves Young Bravo as an Action layer, retaining the hero source and granting dominate only to cost 3+ attack actions", () => {
    const game = FabTestEngine.create(
      {
        player1: {
          heroCardId: bravo,
          hand: [costThreeAttack, costTwoAttack, blueCostThreePitch, blueCostThreePitch],
          deck: 4,
        },
        player2: { heroCardId: opponent, deck: 4 },
        cardDefinitions: defs,
      },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const bravoPlayer = game.as(bravo);
    const opponentPlayer = game.as(opponent);
    const activate = listLegalCommands(game.getRuntime(), bravoPlayer.id).find(
      (command) =>
        command.move === "activate" &&
        command.payload.ability ===
          "tzTbzLkLhDzmW9QMJr9KF:actionResourceResourceEndTurnAttackActionCost3MoreGetDominateGoAgain",
    );

    expect(activate?.label).toContain("Activate Bravo");
    expect(activate).toBeDefined();
    game.exec({ move: activate!.move, actorId: bravoPlayer.id, payload: activate!.payload });
    answerPaymentDecision(game, bravoPlayer.id);
    expect(game.getState().rulesStack).toMatchObject([
      {
        kind: "activated",
        role: "ability",
        abilityId:
          "tzTbzLkLhDzmW9QMJr9KF:actionResourceResourceEndTurnAttackActionCost3MoreGetDominateGoAgain",
      },
    ]);
    expect(
      game.getState().objects[game.getState().players[bravoPlayer.id]!.heroCardId!]?.canonicalId,
    ).toBe(bravo.canonicalId);

    passStack(game, bravoPlayer.id, opponentPlayer.id);
    expect(game.getState().rulesStack).toEqual([]);
    expect(game.getState().continuousEffectInstances).toMatchObject([
      {
        controllerId: bravoPlayer.id,
        duration: "this-turn",
        atoms: [{ kind: "ability" }],
      },
    ]);
    expect(
      game.getState().objects[game.getState().players[bravoPlayer.id]!.heroCardId!]?.canonicalId,
    ).toBe(bravo.canonicalId);
    expect(bravoPlayer.zone("graveyard")).not.toContain(bravo.canonicalId);
    expect(game.getState().players[bravoPlayer.id]!.actionPoints).toBe(1);
    expect(
      listLegalCommands(game.getRuntime(), bravoPlayer.id).some(
        (command) =>
          command.move === "activate" &&
          command.payload.ability ===
            "tzTbzLkLhDzmW9QMJr9KF:actionResourceResourceEndTurnAttackActionCost3MoreGetDominateGoAgain",
      ),
    ).toBe(true);

    const costThree = listLegalCommands(game.getRuntime(), bravoPlayer.id).find(
      (command) =>
        command.move === "begin-play" &&
        game.getState().objects[command.payload.instanceId as string]?.canonicalId ===
          costThreeAttack.canonicalId,
    );
    expect(costThree).toBeDefined();
    game.exec({ move: costThree!.move, actorId: bravoPlayer.id, payload: costThree!.payload });
    answerPaymentDecision(game, bravoPlayer.id);
    passStack(game, bravoPlayer.id, opponentPlayer.id);
    expect(game.combat()?.activeLink?.keywords).toContain("dominate");

    // The ability's gate is the printed resource cost, not Guardian class or power.
    const secondGame = FabTestEngine.create(
      {
        player1: {
          heroCardId: bravo,
          hand: [costTwoAttack, blueCostThreePitch],
          resourcePoints: 2,
        },
        player2: { heroCardId: opponent, deck: 4 },
        cardDefinitions: defs,
      },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const secondBravo = secondGame.as(bravo);
    const secondOpponent = secondGame.as(opponent);
    const activation = listLegalCommands(secondGame.getRuntime(), secondBravo.id).find(
      (command) =>
        command.payload.ability ===
        "tzTbzLkLhDzmW9QMJr9KF:actionResourceResourceEndTurnAttackActionCost3MoreGetDominateGoAgain",
    )!;
    secondGame.exec({ move: "activate", actorId: secondBravo.id, payload: activation.payload });
    passStack(secondGame, secondBravo.id, secondOpponent.id);
    const costTwo = listLegalCommands(secondGame.getRuntime(), secondBravo.id).find(
      (command) =>
        command.move === "begin-play" &&
        secondGame.getState().objects[command.payload.instanceId as string]?.canonicalId ===
          costTwoAttack.canonicalId,
    )!;
    secondGame.exec({ move: costTwo.move, actorId: secondBravo.id, payload: costTwo.payload });
    answerPaymentDecision(secondGame, secondBravo.id);
    passStack(secondGame, secondBravo.id, secondOpponent.id);
    expect(secondGame.combat()?.activeLink?.keywords).not.toContain("dominate");
  });

  it("enforces Anothos control, payment, once-per-turn limit, and its live pitch-zone power condition", () => {
    const sixPowerGame = FabTestEngine.create(
      {
        player1: {
          heroCardId: bravo,
          weapon1: [anothos],
          pitch: [blueCostThreePitch, blueCostThreePitch],
          resourcePoints: 3,
          deck: 4,
        },
        player2: { heroCardId: opponent, deck: 4 },
        cardDefinitions: defs,
      },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const bravoPlayer = sixPowerGame.as(bravo);
    const anothosCommand = listLegalCommands(sixPowerGame.getRuntime(), bravoPlayer.id).find(
      (command) =>
        command.move === "activate" &&
        command.payload.ability ===
          "BFWbnQjgKgRBjw88jK8KH:oncePerTurnActionResourceResourceResourceAttack",
    );
    expect(anothosCommand?.label).toBe("Attack with Anothos");
    sixPowerGame.exec({
      move: "activate",
      actorId: bravoPlayer.id,
      payload: anothosCommand!.payload,
    });
    expect(sixPowerGame.getState().rulesStack).toMatchObject([
      {
        kind: "activated",
        role: "attack",
        attackKind: "proxy",
        abilityId: "BFWbnQjgKgRBjw88jK8KH:oncePerTurnActionResourceResourceResourceAttack",
      },
    ]);
    expect(sixPowerGame.combat()).toMatchObject({ open: true, step: "layer" });
    expect(bravoPlayer.hasPriority()).toBe(true);
    passStack(sixPowerGame, bravoPlayer.id, sixPowerGame.as(opponent).id);
    expect(sixPowerGame.combat()?.activeLink?.attackPower).toBe(6);
    expect(bravoPlayer.zone("weapon1")).toContain(anothos.canonicalId);
    expect(sixPowerGame.getState().players[bravoPlayer.id]!.resourcePoints).toBe(0);

    sixPowerGame.resolveCombatNoReactions();
    const state = sixPowerGame.getState();
    state.players[bravoPlayer.id]!.actionPoints = 1;
    state.players[bravoPlayer.id]!.resourcePoints = 3;
    expect(
      sixPowerGame.as(bravo).expectFailure({
        move: "activate",
        payload: anothosCommand!.payload,
      }).errorCode,
    ).toBe("activation_limit");

    const fourPowerGame = FabTestEngine.create(
      {
        player1: { heroCardId: bravo, weapon1: [anothos], resourcePoints: 3, deck: 4 },
        player2: { heroCardId: opponent, deck: 4 },
        cardDefinitions: defs,
      },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const fourBravo = fourPowerGame.as(bravo);
    const fourAnothos = listLegalCommands(fourPowerGame.getRuntime(), fourBravo.id).find(
      (command) =>
        command.payload.ability ===
        "BFWbnQjgKgRBjw88jK8KH:oncePerTurnActionResourceResourceResourceAttack",
    )!;
    fourPowerGame.exec({ move: "activate", actorId: fourBravo.id, payload: fourAnothos.payload });
    passStack(fourPowerGame, fourBravo.id, fourPowerGame.as(opponent).id);
    expect(fourPowerGame.combat()?.activeLink?.attackPower).toBe(4);
    expect(
      fourPowerGame.as(opponent).expectFailure({
        move: "activate",
        payload: fourAnothos.payload,
      }).errorCode,
    ).toBe("not_priority_player");
  });

  it("removes Anothos after its once-per-turn activation, then restores it on its controller's next turn", () => {
    const game = FabTestEngine.create(
      {
        player1: {
          heroCardId: bravo,
          weapon1: [anothos],
          hand: [blueCostThreePitch],
          resourcePoints: 3,
        },
        player2: { heroCardId: opponent },
        cardDefinitions: defs,
      },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const bravoPlayer = game.as(bravo);
    const opponentPlayer = game.as(opponent);
    const command = listLegalCommands(game.getRuntime(), bravoPlayer.id).find(
      (entry) =>
        entry.move === "activate" &&
        entry.payload.ability ===
          "BFWbnQjgKgRBjw88jK8KH:oncePerTurnActionResourceResourceResourceAttack",
    )!;

    game.exec({ move: "activate", actorId: bravoPlayer.id, payload: command.payload });
    passStack(game, bravoPlayer.id, opponentPlayer.id);
    game.resolveCombatNoReactions();
    expect(
      listLegalCommands(game.getRuntime(), bravoPlayer.id).some(
        (entry) =>
          entry.payload.ability ===
          "BFWbnQjgKgRBjw88jK8KH:oncePerTurnActionResourceResourceResourceAttack",
      ),
    ).toBe(false);

    bravoPlayer.endTurn();
    opponentPlayer.endTurn();
    expect(
      listLegalCommands(game.getRuntime(), bravoPlayer.id).some(
        (entry) =>
          entry.move === "activate" &&
          entry.payload.ability ===
            "BFWbnQjgKgRBjw88jK8KH:oncePerTurnActionResourceResourceResourceAttack",
      ),
    ).toBe(true);
  });
});

function answerPaymentDecision(game: FabTestEngine, actorId: string): void {
  const decision = game.getState().decision;
  if (!decision || decision.kind !== "payment") return;
  const candidate = decision.candidates[0];
  if (!candidate) throw new Error("Expected a payment candidate.");
  game.exec({
    move: "answer-decision",
    actorId,
    payload: {
      decisionId: decision.decisionId,
      stateVersion: decision.stateVersion,
      answer: { kind: "payment", instanceIds: [candidate.instanceId] },
    },
  });
}
