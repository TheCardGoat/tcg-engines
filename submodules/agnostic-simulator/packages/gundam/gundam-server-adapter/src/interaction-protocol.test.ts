import { describe, expect, it } from "vite-plus/test";
import type { CardEffect } from "@tcg/gundam-types";
import {
  gd01UnicornGundamDestroyMode002,
  gd01DuelGundamAssaultShroud045,
  gd01TheStubbornCog103,
  gd03AeuHellion083,
  gd03Defurse064,
  gd03Downes130,
  gd03Farsia058,
  gd03Gfred035,
  gd03Gfred048,
  gd03Nyaan092,
  gd04Encounter105,
  gd04GrahamSUnionFlagCustomGnFlag071,
} from "@tcg/gundam-cards";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  asPlayerId,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import {
  buildInteractionSubmissionForActionId,
  validateInteractionSubmission,
} from "@tcg/protocol";
import { buildGundamInteractionView, gundamSubmissionToPayload } from "./interaction-protocol.js";

describe("Gundam interaction protocol adapter", () => {
  it("publishes and dispatches GD01-002's payable alternate deploy as a human choice", () => {
    const unicornMode = createMockUnit({
      name: "Unicorn Gundam (Unicorn Mode)",
      level: 5,
      linkCondition: "[Banagher Links]",
    });
    const banagher = createMockPilot({ name: "Banagher Links", level: 1, cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [gd01UnicornGundamDestroyMode002, banagher],
      play: [unicornMode],
      resourceArea: activeResources(1),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const destroyModeId = p1.getHand()[0]!;
    const banagherId = p1.getHand()[1]!;
    const unicornModeId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(banagherId, unicornModeId));
    const view = currentInteractionView(engine);
    const deployAction = view.actions.find((action) => action.id === "deployUnit");
    const modeInput = deployAction?.inputs.find((input) => input.id === "mode");
    const costInput = deployAction?.inputs.find(
      (input) => input.kind === "entity-selection" && input.role === "cost",
    );
    expect(modeInput?.kind).toBe("option-selection");
    if (modeInput?.kind !== "option-selection") {
      throw new Error("Expected the deploy interaction to show its payable mode");
    }
    expect(modeInput.options.map((option) => option.id)).toEqual(["alternate"]);
    expect(modeInput).toMatchObject({ required: true, min: 1, max: 1 });
    expect(costInput?.kind).toBe("entity-selection");
    if (costInput?.kind !== "entity-selection") {
      throw new Error("Expected the alternate deploy interaction to show its destroy cost");
    }
    expect(costInput.candidates.map((candidate) => candidate.entity.instanceId)).toEqual([
      unicornModeId,
    ]);
    expect(costInput).toMatchObject({ required: true, min: 1, max: 1 });

    const incompleteSubmission = buildInteractionSubmissionForActionId({
      view,
      actionId: "deployUnit",
      values: { cardId: destroyModeId },
    });
    expect(validateInteractionSubmission(view, incompleteSubmission).ok).toBe(false);

    const submission = buildInteractionSubmissionForActionId({
      view,
      actionId: "deployUnit",
      values: {
        cardId: destroyModeId,
        mode: ["alternate"],
        targets: [unicornModeId],
      },
    });
    expect(validateInteractionSubmission(view, submission).ok).toBe(true);
    dispatch(engine, submission);

    expect(p1.getCardZone(unicornModeId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getCardZone(banagherId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getCardZone(destroyModeId)).toBe(`battleArea:${PLAYER_ONE}`);
  });

  it("requires GD01-002's destroy target only after the player chooses its alternate branch", () => {
    const unicornMode = createMockUnit({
      name: "Unicorn Gundam (Unicorn Mode)",
      level: 5,
      linkCondition: "[Banagher Links]",
    });
    const ordinaryUnit = createMockUnit({ name: "Ordinary Unit", level: 0, cost: 0 });
    const banagher = createMockPilot({ name: "Banagher Links", level: 1, cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [gd01UnicornGundamDestroyMode002, ordinaryUnit, banagher],
      play: [unicornMode],
      resourceArea: activeResources(1),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [destroyModeId, ordinaryUnitId] = p1.getHand();
    const unicornModeId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(banagher, unicornModeId));
    const view = currentInteractionView(engine);
    const incompleteAlternate = buildInteractionSubmissionForActionId({
      view,
      actionId: "deployUnit",
      values: { cardId: destroyModeId!, mode: ["alternate"] },
    });
    const incompleteValidation = validateInteractionSubmission(view, incompleteAlternate);
    expect(incompleteValidation.ok).toBe(false);
    if (incompleteValidation.ok) {
      throw new Error("Expected GD01-002's alternate deployment to require its destroy target");
    }
    expect(
      incompleteValidation.issues.some(
        (issue) => issue.code === "missing_value" && issue.path.join(".") === "values.targets",
      ),
    ).toBe(true);

    const ordinaryDeployment = buildInteractionSubmissionForActionId({
      view,
      actionId: "deployUnit",
      values: { cardId: ordinaryUnitId! },
    });
    expect(validateInteractionSubmission(view, ordinaryDeployment).ok).toBe(true);
    dispatch(engine, ordinaryDeployment);

    expect(p1.getCardZone(ordinaryUnitId!)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getCardZone(destroyModeId!)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getCardZone(unicornModeId)).toBe(`battleArea:${PLAYER_ONE}`);
  });

  it("does not over-constrain a lower-min alternate deploy branch after merging targets", () => {
    const twoTargetUpgrade = createMockUnit({
      name: "Two Target Upgrade",
      level: 9,
      cost: 9,
      effects: [twoTargetDeploySubstitution()],
    });
    const unicornMode = createMockUnit({
      name: "Unicorn Gundam (Unicorn Mode)",
      level: 5,
      linkCondition: "[Banagher Links]",
    });
    const extraAllyA = createMockUnit({ name: "Extra Ally A" });
    const extraAllyB = createMockUnit({ name: "Extra Ally B" });
    const banagher = createMockPilot({ name: "Banagher Links", level: 1, cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [gd01UnicornGundamDestroyMode002, twoTargetUpgrade, banagher],
      play: [unicornMode, extraAllyA, extraAllyB],
      resourceArea: activeResources(1),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [destroyModeId] = p1.getHand();
    const [unicornModeId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(banagher, unicornModeId!));
    const view = currentInteractionView(engine);
    const deployAction = view.actions.find((action) => action.id === "deployUnit");
    const targetInput = deployAction?.inputs.find(
      (input) => input.kind === "entity-selection" && input.id === "targets",
    );
    expect(targetInput).toMatchObject({ kind: "entity-selection", min: 1 });

    const oneTargetAlternate = buildInteractionSubmissionForActionId({
      view,
      actionId: "deployUnit",
      values: {
        cardId: destroyModeId!,
        mode: ["alternate"],
        targets: [unicornModeId!],
      },
    });

    expect(validateInteractionSubmission(view, oneTargetAlternate).ok).toBe(true);
  });

  it("carries Downes through its optional choice and eligible trash target", () => {
    const engine = GundamTestEngine.create({
      hand: [gd03Downes130],
      trash: [gd03Farsia058, gd03Defurse064, gd03AeuHellion083],
      shieldArea: [createMockUnit({ name: "Shield" })],
      resourceArea: activeResources(6),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [farsiaId, defurseId, hellionId] = p1.getCardsInZone("trash");

    expectSuccess(p1.deployBase(gd03Downes130));
    const optional = p1.getBoardView().pendingChoice;
    if (optional?.kind !== "optional") {
      throw new Error("Expected Downes to offer its optional trash deployment");
    }
    const optionalView = currentInteractionView(engine);
    const optionalSubmission = buildInteractionSubmissionForActionId({
      view: optionalView,
      actionId: "resolveEffect",
      values: {
        pendingEffectId: optional.effectId,
        [`optionalAnswers.${optional.directiveIndex}`]: true,
      },
    });

    expect(validateInteractionSubmission(optionalView, optionalSubmission).ok).toBe(true);
    dispatch(engine, optionalSubmission);

    const targetChoice = p1.getBoardView().pendingChoice;
    if (targetChoice?.kind !== "targetSelection") {
      throw new Error("Expected Downes to ask which eligible trash Unit to deploy");
    }
    const targetView = currentInteractionView(engine);
    for (const invalidTargetId of [defurseId!, hellionId!]) {
      const invalidSubmission = buildInteractionSubmissionForActionId({
        view: targetView,
        actionId: "resolveEffect",
        values: {
          pendingEffectId: targetChoice.effectId,
          targets: [invalidTargetId],
        },
      });
      expect(validateInteractionSubmission(targetView, invalidSubmission).ok).toBe(false);
    }
    const targetSubmission = buildInteractionSubmissionForActionId({
      view: targetView,
      actionId: "resolveEffect",
      values: {
        pendingEffectId: targetChoice.effectId,
        targets: [farsiaId!],
      },
    });

    expect(validateInteractionSubmission(targetView, targetSubmission).ok).toBe(true);
    dispatch(engine, targetSubmission);

    expect(p1.getCardsInZone("battleArea")).toContain(farsiaId);
    expect(p1.getCardsInZone("trash")).toHaveLength(2);
    expect(p1.getCardsInZone("trash")).toEqual(expect.arrayContaining([defurseId, hellionId]));
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(3);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });

  it("preserves GD01-103's distinct friendly and enemy target groups", () => {
    const friendly = createMockUnit({ name: "Federation Ally", traits: ["earth federation"] });
    const enemy = createMockUnit({ name: "Enemy Unit" });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01TheStubbornCog103],
        play: [friendly],
        resourceArea: activeResources(1),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd01TheStubbornCog103));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected The Stubborn Cog's grouped target choice");
    }
    expect(choice.groups).toHaveLength(2);
    const view = currentInteractionView(engine);
    const submission = buildInteractionSubmissionForActionId({
      view,
      actionId: "resolveEffect",
      values: {
        pendingEffectId: choice.effectId,
        "targetGroups.0": [friendlyId],
        "targetGroups.1": [enemyId],
      },
    });

    expect(validateInteractionSubmission(view, submission).ok).toBe(true);
    dispatch(engine, submission);

    expect(p1.isExhausted(friendlyId)).toBe(true);
    expect(p2.isExhausted(enemyId)).toBe(true);
  });

  it("publishes Nyaan's follow-up only after its matching mill is visible", () => {
    const engine = GundamTestEngine.create(
      {
        hand: [gd03Nyaan092],
        play: [gd03Gfred048],
        deck: [gd03AeuHellion083, gd03Gfred035],
        resourceArea: activeResources(4),
      },
      { play: [gd03Defurse064] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const pilotId = p1.getHand()[0]!;
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilotId, hostId));

    expect(p1.getCardZone(gd03Gfred035)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getCardsInZone("deck")).toHaveLength(1);
    expect(p2.getDamage(enemyId)).toBe(0);
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected Nyaan's matching mill to ask for a damage target");
    }
    const view = currentInteractionView(engine);
    const invalidSubmission = buildInteractionSubmissionForActionId({
      view,
      actionId: "resolveEffect",
      values: {
        pendingEffectId: choice.effectId,
        targets: [hostId],
      },
    });
    expect(validateInteractionSubmission(view, invalidSubmission).ok).toBe(false);
    const submission = buildInteractionSubmissionForActionId({
      view,
      actionId: "resolveEffect",
      values: {
        pendingEffectId: choice.effectId,
        targets: [enemyId],
      },
    });

    expect(validateInteractionSubmission(view, submission).ok).toBe(true);
    dispatch(engine, submission);

    expect(p2.getDamage(enemyId)).toBe(1);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });

  it("resolves both printed GD04-071 target groups and applies the visible results", () => {
    const dualTrait = createMockUnit({
      name: "Superpower UN liaison",
      traits: ["superpower bloc", "un"],
    });
    const superpowerOnly = createMockUnit({
      name: "Superpower-only card",
      traits: ["superpower bloc"],
    });
    const engine = GundamTestEngine.create({
      play: [{ card: gd04GrahamSUnionFlagCustomGnFlag071, exhausted: true }],
      trash: [dualTrait, superpowerOnly],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const [dualTraitId, superpowerOnlyId] = p1.getCardsInZone("trash");

    expectSuccess(p1.activateAbility(unitId, 0));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected GD04-071 to ask for its two targets");
    }
    const view = currentInteractionView(engine);
    const submission = buildInteractionSubmissionForActionId({
      view,
      actionId: "resolveEffect",
      values: {
        pendingEffectId: choice.effectId,
        "targetGroups.0": [superpowerOnlyId!],
        "targetGroups.1": [dualTraitId!],
      },
    });

    expect(validateInteractionSubmission(view, submission).ok).toBe(true);
    dispatch(engine, submission);

    expect(p1.getCardZone(superpowerOnlyId!)).toBe("removalArea");
    expect(p1.getCardZone(dualTraitId!)).toBe("removalArea");
    expect(p1.isExhausted(unitId)).toBe(false);
    expect(p1.getLegalAttackTargets(unitId)).not.toContain("direct");
  });

  it("lets the player tutor with GD04-105 while the engine returns the rest randomly", () => {
    const pilot = createMockPilot({ name: "Searched Pilot", level: 1, cost: 1 });
    const fillers = Array.from({ length: 4 }, (_, index) =>
      createMockUnit({ name: `Filler ${index + 1}` }),
    );
    const engine = GundamTestEngine.create({
      hand: [gd04Encounter105],
      deck: [pilot, ...fillers],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommand(commandId));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "deckLook") {
      throw new Error("Expected GD04-105 to show the looked-at cards");
    }
    const pilotId = choice.legalTutorCardIds[0]!;
    const view = currentInteractionView(engine);
    const submission = buildInteractionSubmissionForActionId({
      view,
      actionId: "resolveEffect",
      values: {
        pendingEffectId: choice.effectId,
        [`deckLookAnswers.${choice.directiveIndex}.tutorCardId`]: [pilotId],
        [`deckLookAnswers.${choice.directiveIndex}.completion`]: ["complete"],
      },
    });

    expect(validateInteractionSubmission(view, submission).ok).toBe(true);
    dispatch(engine, submission);

    expect(p1.getHand()).toContain(pilotId);
    expect(p1.getCardsInZone("deck")).toHaveLength(4);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });

  it("lets the player finish GD01-045 when no revealed Unit can be deployed", () => {
    const pilot = createMockPilot({ name: "Pairing Pilot", level: 1, cost: 1 });
    const wrongTrait = createMockUnit({ name: "Wrong Trait", traits: ["academy"], level: 4 });
    const tooHigh = createMockUnit({ name: "Too High", traits: ["zaft"], level: 5 });
    const engine = GundamTestEngine.create({
      hand: [pilot],
      play: [gd01DuelGundamAssaultShroud045],
      resourceArea: activeResources(1),
      deck: [wrongTrait, tooHigh],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const duelId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, duelId));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "deckLook") {
      throw new Error("Expected GD01-045 to show its looked-at cards");
    }
    expect(choice.legalTutorCardIds).toHaveLength(0);
    const view = currentInteractionView(engine);
    const completionId = `deckLookAnswers.${choice.directiveIndex}.completion`;
    const action = view.actions.find((candidate) => candidate.id === "resolveEffect");
    const completion = action?.inputs.find((input) => input.id === completionId);
    expect(completion).toMatchObject({
      kind: "option-selection",
      required: true,
      min: 1,
      max: 1,
    });

    const incomplete = buildInteractionSubmissionForActionId({
      view,
      actionId: "resolveEffect",
      values: { pendingEffectId: choice.effectId },
    });
    expect(validateInteractionSubmission(view, incomplete).ok).toBe(false);

    const submission = buildInteractionSubmissionForActionId({
      view,
      actionId: "resolveEffect",
      values: {
        pendingEffectId: choice.effectId,
        [completionId]: ["complete"],
      },
    });
    expect(validateInteractionSubmission(view, submission).ok).toBe(true);
    dispatch(engine, submission);

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(2);
    expect(p1.getCardZone(duelId)).toBe(`battleArea:${PLAYER_ONE}`);
  });
});

function twoTargetDeploySubstitution(): CardEffect {
  return {
    type: "substitution",
    activation: {},
    directives: [
      {
        action: {
          action: "deployCostSubstitution",
          level: 0,
          cost: 0,
          destroyTarget: {
            owner: "friendly",
            zone: "battleArea",
            cardType: "unit",
            count: 2,
          },
        },
        optional: true,
      },
    ],
    sourceText: "Destroy 2 friendly Units. If you do, play this card as if it has 0 Lv. and cost.",
  };
}

function currentInteractionView(engine: GundamTestEngine) {
  const state = engine.getState();
  return buildGundamInteractionView({
    actorId: PLAYER_ONE,
    stateVersion: state.ctx._stateID,
    state,
    staticResources: engine.getRuntime().getStaticResources(),
    pendingChoice: engine.asPlayer(PLAYER_ONE).getBoardView().pendingChoice,
  });
}

function dispatch(
  engine: GundamTestEngine,
  submission: Parameters<typeof gundamSubmissionToPayload>[0],
): void {
  const nativeMove = gundamSubmissionToPayload(submission);
  expectSuccess(engine.doMove(nativeMove.moveType, asPlayerId(PLAYER_ONE), nativeMove.payload));
}
