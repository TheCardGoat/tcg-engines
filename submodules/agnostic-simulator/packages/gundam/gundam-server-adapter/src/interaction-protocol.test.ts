import { describe, expect, it } from "vite-plus/test";
import type { CardEffect } from "@tcg/gundam-types";
import {
  gd01UnicornGundamDestroyMode002,
  gd01DuelGundamAssaultShroud045,
  gd01TheStubbornCog103,
  gd02GundamAge1Normal021,
  gd02Dominion121,
  gd02GarrodRanTiffaAdill094,
  gd02Zedas057,
  gd03AeuHellion083,
  gd03Defurse064,
  gd03Downes130,
  gd03Farsia058,
  gd03Gfred035,
  gd03Gfred048,
  gd03Nyaan092,
  gd04Encounter105,
  gd04ElanCeresEnhancedPersonNumber5087,
  gd04GrahamSUnionFlagCustomGnFlag071,
  gd05Sazabi052,
  st07ArmedIntervention013,
  st10DiffuseBeamCannon015,
  st10GrazeDuelType009,
  st10GundamBarbatos4thForm007,
  st10MobileWorkerTekkadan010,
  st10UnlockingTheDevelopmentDiagram014,
  st10ZetaGundam002,
} from "@tcg/gundam-cards";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import {
  buildInteractionSubmissionForActionId,
  type InteractionSubmission,
  validateInteractionSubmission,
} from "@tcg/protocol";
import { GundamServerEngine } from "./gundam-server-engine.js";

describe("Gundam interaction protocol adapter", () => {
  it("requires exactly the excess hand cards and names the discard candidates", () => {
    const engine = GundamTestEngine.create(
      {
        hand: Array.from({ length: 12 }, (_, index) =>
          createMockUnit({ name: `Hand card ${index + 1}` }),
        ),
      },
      {},
    );
    const player = engine.asPlayer(PLAYER_ONE);
    expectSuccess(player.passPhase());
    expectSuccess(engine.asPlayer(PLAYER_TWO).passActionStep());
    expectSuccess(player.passActionStep());
    const view = currentInteractionView(engine);
    const discard = view.actions.find((action) => action.id === "discardToHandLimit");
    expect(discard?.inputs).toMatchObject([
      {
        id: "cardIds",
        kind: "entity-selection",
        role: "source",
        min: 2,
        max: 2,
        text: { params: { label: "Choose 2 cards to discard." } },
        candidates: Array.from({ length: 12 }, (_, index) => ({
          text: { params: { label: `Hand card ${index + 1}` } },
        })),
      },
    ]);
    for (const count of [1, 3]) {
      const submission = buildInteractionSubmissionForActionId({
        view,
        actionId: "discardToHandLimit",
        values: { cardIds: player.getHand().slice(0, count) },
      });
      expect(validateInteractionSubmission(view, submission).ok).toBe(false);
    }
    dispatch(
      engine,
      buildInteractionSubmissionForActionId({
        view,
        actionId: "discardToHandLimit",
        values: { cardIds: player.getHand().slice(0, 2) },
      }),
    );
    expect(player.getHand()).toHaveLength(10);
  });

  for (const actorId of [PLAYER_ONE, PLAYER_TWO]) {
    it(`lets ${actorId} play a Command as Pilot and finish Barbatos's linked recovery`, () => {
      const actorConfig = {
        hand: [st10DiffuseBeamCannon015],
        play: [st10GundamBarbatos4thForm007],
        trash: [st10GrazeDuelType009, st10MobileWorkerTekkadan010, st07ArmedIntervention013],
        resourceArea: activeResources(8),
      };
      const opponentConfig = { play: [createMockUnit({ name: "Enemy Unit", level: 4, hp: 4 })] };
      const engine = GundamTestEngine.create(
        actorId === PLAYER_ONE ? actorConfig : opponentConfig,
        actorId === PLAYER_TWO ? actorConfig : opponentConfig,
        { initialActivePlayer: actorId },
      );
      const actor = engine.asPlayer(actorId);
      const commandId = actor.getHand()[0]!;
      const unitId = actor.getCardsInZone("battleArea")[0]!;
      const [firstDevelopmentId, secondDevelopmentId, recoveredCommandId] =
        actor.getCardsInZone("trash");

      const playView = currentInteractionViewAs(engine, actorId);
      const play = buildInteractionSubmissionForActionId({
        view: playView,
        actionId: "playCommandAsPilot",
        values: { cardId: commandId, unitId },
      });
      expect(validateInteractionSubmission(playView, play).ok).toBe(true);
      dispatchAs(engine, actorId, play);

      const development = actor.getBoardView().pendingChoice;
      if (development?.kind !== "targetSelection") {
        throw new Error("Expected Barbatos Development targets");
      }
      const developmentView = currentInteractionViewAs(engine, actorId);
      const develop = buildInteractionSubmissionForActionId({
        view: developmentView,
        actionId: "resolveEffect",
        values: {
          pendingEffectId: [development.effectId],
          [`optionalAnswers.${development.optionalDirectiveIndex}`]: true,
          targets: [firstDevelopmentId!, secondDevelopmentId!],
        },
      });
      expect(validateInteractionSubmission(developmentView, develop).ok).toBe(true);
      dispatchAs(engine, actorId, develop);

      const recovery = actor.getBoardView().pendingChoice;
      if (recovery?.kind !== "targetSelection") {
        throw new Error("Expected Barbatos recovery target");
      }
      expect(recovery.legalTargetIds).toEqual([recoveredCommandId]);
      const recoveryView = currentInteractionViewAs(engine, actorId);
      const recover = buildInteractionSubmissionForActionId({
        view: recoveryView,
        actionId: "resolveEffect",
        values: {
          pendingEffectId: [recovery.effectId],
          targets: [recoveredCommandId!],
        },
      });
      expect(validateInteractionSubmission(recoveryView, recover).ok).toBe(true);
      dispatchAs(engine, actorId, recover);

      expect(actor.getHand()).toContain(recoveredCommandId);
      expect(actor.getBoardView().pendingChoice).toBeUndefined();
      const movements = engine
        .getRuntime()
        .getMoveLogHistory()
        .flatMap((log) => log.outcomes?.cardsMoved ?? []);
      expect(movements).toEqual(
        expect.arrayContaining([
          {
            cardId: firstDevelopmentId,
            from: "trash",
            to: "removalArea",
          },
          {
            cardId: secondDevelopmentId,
            from: "trash",
            to: "removalArea",
          },
          {
            cardId: recoveredCommandId,
            from: "trash",
            to: "hand",
          },
        ]),
      );
    });
  }

  it("publishes Development targets immediately with a one-click Skip branch", () => {
    const developmentCard = (name: string) =>
      createMockUnit({ name, traits: ["g generation"], level: 1, cost: 1 });
    const engine = GundamTestEngine.create(
      {
        hand: [st10ZetaGundam002],
        trash: [developmentCard("First"), developmentCard("Second")],
        resourceArea: activeResources(5),
      },
      { play: [createMockUnit({ hp: 4 })] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const trashIds = p1.getCardsInZone("trash");

    expectSuccess(p1.deployUnit(st10ZetaGundam002));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection" || choice.optionalDirectiveIndex === undefined) {
      throw new Error("Expected Development targets with a Skip branch");
    }

    const view = currentInteractionView(engine);
    const action = view.actions.find((candidate) => candidate.id === "resolveEffect");
    expect(action?.inputs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: "boolean",
          id: "optionalAnswers.0",
          trueText: expect.objectContaining({ params: { label: "Resolve" } }),
          falseText: expect.objectContaining({ params: { label: "Skip" } }),
        }),
        expect.objectContaining({
          kind: "entity-selection",
          id: "targets",
          required: false,
          requiredWhen: [{ all: [{ inputId: "optionalAnswers.0", value: true }] }],
        }),
      ]),
    );

    const skip = buildInteractionSubmissionForActionId({
      view,
      actionId: "resolveEffect",
      values: {
        pendingEffectId: choice.effectId,
        "optionalAnswers.0": false,
      },
    });
    expect(validateInteractionSubmission(view, skip).ok).toBe(true);

    const accept = buildInteractionSubmissionForActionId({
      view,
      actionId: "resolveEffect",
      values: {
        pendingEffectId: choice.effectId,
        "optionalAnswers.0": true,
        targets: trashIds,
      },
    });
    expect(validateInteractionSubmission(view, accept).ok).toBe(true);
    dispatch(engine, accept);

    const nextChoice = p1.getBoardView().pendingChoice;
    expect(nextChoice?.kind).toBe("targetSelection");
    if (nextChoice?.kind !== "targetSelection") return;
    expect(nextChoice.optionalDirectiveIndex).toBeUndefined();
  });

  it("publishes and dispatches Elan Ceres's optional redirect destination", () => {
    const host = createMockUnit({
      name: "Elan Host",
      ap: 1,
      hp: 8,
      linkCondition: "[Elan Ceres (Enhanced Person Number 5)]",
    });
    const firstAcademy = createMockUnit({
      name: "First Academy Unit",
      traits: ["academy"],
      hp: 8,
    });
    const secondAcademy = createMockUnit({
      name: "Second Academy Unit",
      traits: ["academy"],
      hp: 8,
    });
    const defender = createMockUnit({ name: "Enemy Defender", ap: 2, hp: 8 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd04ElanCeresEnhancedPersonNumber5087],
        play: [host, firstAcademy, secondAcademy],
        resourceArea: activeResources(4),
      },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [hostId, firstAcademyId, secondAcademyId] = p1.getCardsInZone("battleArea");
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd04ElanCeresEnhancedPersonNumber5087, hostId!));
    expectSuccess(p1.enterBattle(hostId!, defenderId));

    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection" || choice.optionalDirectiveIndex === undefined) {
      throw new Error("Expected Elan Ceres's optional redirect destination");
    }
    const view = currentInteractionView(engine);
    const action = view.actions.find((candidate) => candidate.id === "resolveEffect");
    expect(action?.inputs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: "boolean",
          id: "optionalAnswers.0",
        }),
        expect.objectContaining({
          kind: "entity-selection",
          id: "targets",
          required: false,
          requiredWhen: [{ all: [{ inputId: "optionalAnswers.0", value: true }] }],
          candidates: [
            expect.objectContaining({ entity: { kind: "card", instanceId: firstAcademyId } }),
            expect.objectContaining({ entity: { kind: "card", instanceId: secondAcademyId } }),
          ],
        }),
      ]),
    );

    const submission = buildInteractionSubmissionForActionId({
      view,
      actionId: "resolveEffect",
      values: {
        pendingEffectId: choice.effectId,
        "optionalAnswers.0": true,
        targets: [secondAcademyId!],
      },
    });
    expect(validateInteractionSubmission(view, submission).ok).toBe(true);
    dispatch(engine, submission);
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p1.getDamage(hostId!)).toBe(0);
    expect(p1.getDamage(firstAcademyId!)).toBe(0);
    expect(p1.getDamage(secondAcademyId!)).toBe(2);
  });

  it("round-trips declining Elan Ceres's optional redirect", () => {
    const host = createMockUnit({
      name: "Elan Decline Host",
      ap: 1,
      hp: 8,
      linkCondition: "[Elan Ceres (Enhanced Person Number 5)]",
    });
    const academy = createMockUnit({ name: "Decline Academy Unit", traits: ["academy"], hp: 8 });
    const defender = createMockUnit({ name: "Decline Enemy Defender", ap: 2, hp: 8 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd04ElanCeresEnhancedPersonNumber5087],
        play: [host, academy],
        resourceArea: activeResources(4),
      },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [hostId, academyId] = p1.getCardsInZone("battleArea");
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd04ElanCeresEnhancedPersonNumber5087, hostId!));
    expectSuccess(p1.enterBattle(hostId!, defenderId));

    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection" || choice.optionalDirectiveIndex === undefined) {
      throw new Error("Expected Elan Ceres's optional redirect destination");
    }
    const view = currentInteractionView(engine);
    const submission = buildInteractionSubmissionForActionId({
      view,
      actionId: "resolveEffect",
      values: {
        pendingEffectId: choice.effectId,
        "optionalAnswers.0": false,
      },
    });

    expect(validateInteractionSubmission(view, submission).ok).toBe(true);
    dispatch(engine, submission);
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p1.getDamage(hostId!)).toBe(2);
    expect(p1.getDamage(academyId!)).toBe(0);
  });

  it("publishes and dispatches the first-player setup choice", () => {
    const engine = GundamTestEngine.create({}, {}, { skipToMainPhase: false });
    const view = currentInteractionView(engine);
    const action = view.actions.find((candidate) => candidate.id === "chooseFirstPlayer");
    expect(action?.inputs).toMatchObject([
      { kind: "option-selection", id: "playerId", required: true, min: 1, max: 1 },
    ]);

    const submission = buildInteractionSubmissionForActionId({
      view,
      actionId: "chooseFirstPlayer",
      values: { playerId: [PLAYER_ONE] },
    });
    expect(validateInteractionSubmission(view, submission).ok).toBe(true);
    dispatch(engine, submission);
    expect(engine.getState().ctx.status.phase).toBe("mulligan");
  });

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

  it("keeps ST10-014's mode required after selecting it among other playable Commands", () => {
    const discard = createMockUnit({ name: "Generation Unit", traits: ["g generation"] });
    const ordinaryCommand = createMockCommand({
      name: "Ordinary Command",
      level: 0,
      cost: 0,
      effects: [
        {
          type: "command",
          activation: { timing: ["main"] },
          directives: [],
          sourceText: "No effect.",
        },
      ],
    });
    const engine = GundamTestEngine.create({
      hand: [st10UnlockingTheDevelopmentDiagram014, ordinaryCommand, discard],
      resourceArea: activeResources(15),
      deck: 3,
    });
    const [unlockingId] = engine.asPlayer(PLAYER_ONE).getHand();
    const view = currentInteractionView(engine);
    const playCommand = view.actions.find((action) => action.id === "playCommand");
    const modeInput = playCommand?.inputs.find((input) => input.id === "mode");

    expect(modeInput).toMatchObject({
      kind: "option-selection",
      required: false,
      min: 1,
      max: 1,
      requiredWhen: [{ all: [{ inputId: "cardId", value: unlockingId }] }],
    });

    const incompleteSubmission = buildInteractionSubmissionForActionId({
      view,
      actionId: "playCommand",
      values: { cardId: [unlockingId] },
    });
    expect(validateInteractionSubmission(view, incompleteSubmission).ok).toBe(false);
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
    const banagherId = p1.getHand()[2]!;
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
    dispatch(engine, oneTargetAlternate);

    expect(p1.getCardZone(destroyModeId!)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getCardZone(unicornModeId!)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getCardZone(banagherId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("carries AGE-1 Normal through its optional discard and exact eligible targets", () => {
    const firstEligible = createMockUnit({
      name: "First Eligible Unit",
      color: "green",
      traits: ["earth federation"],
    });
    const secondEligible = createMockUnit({
      name: "Second Eligible Unit",
      color: "green",
      traits: ["earth federation"],
    });
    const wrongTrait = createMockUnit({
      name: "Wrong Trait Unit",
      color: "green",
      traits: ["zeon"],
    });
    const engine = GundamTestEngine.create({
      hand: [gd02GundamAge1Normal021, firstEligible, secondEligible, wrongTrait],
      deck: 3,
      resourceArea: activeResources(6),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [ageId, firstEligibleId, secondEligibleId, wrongTraitId] = p1.getHand();

    expectSuccess(p1.deployUnit(gd02GundamAge1Normal021));
    const optional = p1.getBoardView().pendingChoice;
    if (optional?.kind !== "targetSelection" || optional.optionalDirectiveIndex === undefined) {
      throw new Error("Expected AGE-1 Normal to present its optional discard targets");
    }
    const optionalView = currentInteractionView(engine);
    expect(optionalView.resolution).toMatchObject({
      actingPlayerId: PLAYER_ONE,
      pendingCount: 1,
      currentStep: {
        requirement: { kind: "entity-selection", required: false, min: 1, max: 1 },
      },
    });
    const observerView = interactionFixture(engine).getInteractionView(PLAYER_TWO);
    expect(observerView.resolution).toMatchObject({
      actingPlayerId: PLAYER_ONE,
      pendingCount: 1,
      currentEffect: {
        source: {
          kind: "card",
          instanceId: ageId,
          ownerId: PLAYER_ONE,
          zoneId: "battleArea",
        },
      },
    });
    expect(JSON.stringify(observerView.resolution)).not.toContain("candidates");
    expect(JSON.stringify(observerView.resolution)).not.toContain(firstEligibleId);
    const invalidSubmission = buildInteractionSubmissionForActionId({
      view: optionalView,
      actionId: "resolveEffect",
      values: {
        pendingEffectId: optional.effectId,
        [`optionalAnswers.${optional.optionalDirectiveIndex}`]: true,
        targets: [wrongTraitId],
      },
    });
    expect(validateInteractionSubmission(optionalView, invalidSubmission).ok).toBe(false);
    const targetSubmission = buildInteractionSubmissionForActionId({
      view: optionalView,
      actionId: "resolveEffect",
      values: {
        pendingEffectId: optional.effectId,
        [`optionalAnswers.${optional.optionalDirectiveIndex}`]: true,
        targets: [secondEligibleId],
      },
    });

    expect(validateInteractionSubmission(optionalView, targetSubmission).ok).toBe(true);
    dispatch(engine, targetSubmission);

    expect(p1.getCardsInZone("trash")).toContain(secondEligibleId);
    expect(p1.getHand()).toEqual(expect.arrayContaining([firstEligibleId, wrongTraitId]));
    expect(p1.getCardsInZone("resourceArea")).toHaveLength(7);
    expect(p1.getCardsInZone("deck")).toHaveLength(2);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });

  it("reveals GD02-094's Deck look only after accept and discard interactions", () => {
    const host = createMockUnit({ name: "Garrod Host" });
    const firstDiscard = createMockUnit({ name: "First Discard" });
    const keptDiscard = createMockUnit({ name: "Kept Discard" });
    const tutor = createMockUnit({ name: "Vulture Tutor", traits: ["vulture"] });
    const engine = GundamTestEngine.create({
      hand: [gd02GarrodRanTiffaAdill094, firstDiscard, keptDiscard],
      play: [host],
      resourceArea: activeResources(4),
      deck: [tutor, createMockUnit(), createMockUnit()],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const [, firstDiscardId, keptDiscardId] = p1.getHand();

    expectSuccess(p1.assignPilot(gd02GarrodRanTiffaAdill094, hostId));
    const optional = p1.getBoardView().pendingChoice;
    if (optional?.kind !== "targetSelection" || optional.optionalDirectiveIndex === undefined) {
      throw new Error("Expected the discard targets before any Deck reveal");
    }
    const optionalView = currentInteractionView(engine);
    const optionalAction = optionalView.actions.find((action) => action.id === "resolveEffect");
    expect(optionalAction?.inputs.some((input) => input.id.startsWith("deckLookAnswers."))).toBe(
      false,
    );
    const accept = buildInteractionSubmissionForActionId({
      view: optionalView,
      actionId: "resolveEffect",
      values: {
        pendingEffectId: optional.effectId,
        [`optionalAnswers.${optional.optionalDirectiveIndex}`]: true,
        targets: [firstDiscardId],
      },
    });
    expect(validateInteractionSubmission(optionalView, accept).ok).toBe(true);
    dispatch(engine, accept);

    expect(p1.getCardZone(firstDiscardId!)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getCardZone(keptDiscardId!)).toBe(`hand:${PLAYER_ONE}`);
    const deckLook = p1.getBoardView().pendingChoice;
    if (deckLook?.kind !== "deckLook") {
      throw new Error("Expected the Deck look only after the discard was paid");
    }
    expect(deckLook.randomizeRemainingToBottom).toBe(true);
    const tutorId = deckLook.legalTutorCardIds[0]!;
    const deckView = currentInteractionView(engine);
    const deckAction = deckView.actions.find((action) => action.id === "resolveEffect");
    expect(deckAction?.inputs.some((input) => input.id.startsWith("optionalAnswers."))).toBe(false);
    expect(deckAction?.inputs.some((input) => input.id.includes("toBottom"))).toBe(false);
    const complete = buildInteractionSubmissionForActionId({
      view: deckView,
      actionId: "resolveEffect",
      values: {
        pendingEffectId: deckLook.effectId,
        [`deckLookAnswers.${deckLook.directiveIndex}`]: { tutorCardId: [tutorId] },
      },
    });
    expect(validateInteractionSubmission(deckView, complete).ok).toBe(true);
    dispatch(engine, complete);

    expect(p1.getCardZone(firstDiscardId!)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getCardZone(keptDiscardId!)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getCardZone(tutorId)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });

  it("publishes Dominion's target only after its Shield has visibly moved to hand", () => {
    const blueUnit = createMockUnit({ name: "Blue Unit", color: "blue" });
    const wrongColorUnit = createMockUnit({ name: "Green Unit", color: "green" });
    const shield = createMockUnit({ name: "Opening Shield" });
    const engine = GundamTestEngine.create({
      hand: [gd02Dominion121],
      play: [blueUnit, wrongColorUnit],
      shieldArea: [shield],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [blueUnitId, wrongColorUnitId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.deployBase(gd02Dominion121));

    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected Dominion's recovery target after moving the Shield");
    }
    expect(p1.getBoardView().players[PLAYER_ONE]).toMatchObject({ shieldCount: 0, handCount: 1 });
    expect(choice.legalTargetIds).toEqual([blueUnitId]);

    const view = currentInteractionView(engine);
    const invalid = buildInteractionSubmissionForActionId({
      view,
      actionId: "resolveEffect",
      values: { pendingEffectId: choice.effectId, targets: [wrongColorUnitId] },
    });
    expect(validateInteractionSubmission(view, invalid).ok).toBe(false);

    const legal = buildInteractionSubmissionForActionId({
      view,
      actionId: "resolveEffect",
      values: { pendingEffectId: choice.effectId, targets: [blueUnitId] },
    });
    expect(validateInteractionSubmission(view, legal).ok).toBe(true);
    dispatch(engine, legal);

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getBoardView().players[PLAYER_ONE]).toMatchObject({ shieldCount: 0, handCount: 1 });
  });

  it("stages Zedas's dependent target only after the sacrifice choice", () => {
    const pilot = createMockPilot({ level: 1, cost: 1 });
    const ally = createMockUnit({ name: "Sacrifice Unit", hp: 4 });
    const enemy = createMockUnit({ name: "Damage Target", level: 4, hp: 5 });
    const shield = createMockUnit({ name: "Opening Shield" });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [gd02Zedas057, ally],
        resourceArea: activeResources(1),
      },
      { play: [enemy], shieldArea: [shield] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [zedasId, allyId] = p1.getCardsInZone("battleArea");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, zedasId!));
    expectSuccess(p1.enterBattle(zedasId!, "direct"));
    const optional = p1.getBoardView().pendingChoice;
    if (optional?.kind !== "targetSelection" || optional.optionalDirectiveIndex === undefined) {
      throw new Error("Expected Zedas's optional sacrifice targets");
    }
    expect(optional.legalTargetIds).toEqual([allyId]);
    const optionalView = currentInteractionView(engine);
    const invalidSacrifice = buildInteractionSubmissionForActionId({
      view: optionalView,
      actionId: "resolveEffect",
      values: {
        pendingEffectId: optional.effectId,
        [`optionalAnswers.${optional.optionalDirectiveIndex}`]: true,
        targets: [enemyId],
      },
    });
    expect(validateInteractionSubmission(optionalView, invalidSacrifice).ok).toBe(false);
    const accept = buildInteractionSubmissionForActionId({
      view: optionalView,
      actionId: "resolveEffect",
      values: {
        pendingEffectId: optional.effectId,
        [`optionalAnswers.${optional.optionalDirectiveIndex}`]: true,
        targets: [allyId],
      },
    });
    expect(validateInteractionSubmission(optionalView, accept).ok).toBe(true);
    dispatch(engine, accept);

    expect(p1.getCardZone(allyId!)).toBe(`trash:${PLAYER_ONE}`);
    const damageTarget = p1.getBoardView().pendingChoice;
    if (damageTarget?.kind !== "targetSelection") {
      throw new Error("Expected Zedas to ask for its dependent damage target");
    }
    expect(damageTarget.legalTargetIds).toEqual([enemyId]);
    const damageView = currentInteractionView(engine);
    const chooseEnemy = buildInteractionSubmissionForActionId({
      view: damageView,
      actionId: "resolveEffect",
      values: { pendingEffectId: damageTarget.effectId, targets: [enemyId] },
    });
    expect(validateInteractionSubmission(damageView, chooseEnemy).ok).toBe(true);
    dispatch(engine, chooseEnemy);

    expect(p1.getCardZone(allyId!)).toBe(`trash:${PLAYER_ONE}`);
    expect(p2.getDamage(enemyId)).toBe(2);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
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
    if (optional?.kind !== "targetSelection" || optional.optionalDirectiveIndex === undefined) {
      throw new Error("Expected Downes to present its optional trash target");
    }
    const optionalView = currentInteractionView(engine);
    for (const invalidTargetId of [defurseId!, hellionId!]) {
      const invalidSubmission = buildInteractionSubmissionForActionId({
        view: optionalView,
        actionId: "resolveEffect",
        values: {
          pendingEffectId: optional.effectId,
          [`optionalAnswers.${optional.optionalDirectiveIndex}`]: true,
          targets: [invalidTargetId],
        },
      });
      expect(validateInteractionSubmission(optionalView, invalidSubmission).ok).toBe(false);
    }
    const targetSubmission = buildInteractionSubmissionForActionId({
      view: optionalView,
      actionId: "resolveEffect",
      values: {
        pendingEffectId: optional.effectId,
        [`optionalAnswers.${optional.optionalDirectiveIndex}`]: true,
        targets: [farsiaId!],
      },
    });

    expect(validateInteractionSubmission(optionalView, targetSubmission).ok).toBe(true);
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
    const observerView = interactionFixture(engine).getInteractionView(PLAYER_TWO);
    for (const revealedId of choice.revealedCardIds) {
      expect(JSON.stringify(observerView)).not.toContain(revealedId);
    }
    const view = currentInteractionView(engine);
    const submission = buildInteractionSubmissionForActionId({
      view,
      actionId: "resolveEffect",
      values: {
        pendingEffectId: choice.effectId,
        [`deckLookAnswers.${choice.directiveIndex}`]: { tutorCardId: [pilotId] },
      },
    });

    expect(validateInteractionSubmission(view, submission).ok).toBe(true);
    dispatch(engine, submission);

    expect(p1.getHand()).toContain(pilotId);
    expect(p1.getCardsInZone("deck")).toHaveLength(4);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });

  it("uses a focused partition for draw-three-then-discard-two", () => {
    const source = createMockUnit({
      name: "Dense Hand Source",
      level: 1,
      cost: 1,
      effects: [
        {
          type: "triggered",
          activation: { timing: ["deploy"] },
          directives: [{ action: { action: "drawThenDiscard", drawCount: 3, discardCount: 2 } }],
          sourceText: "Draw 3. Then, discard 2.",
        },
      ],
    });
    const startingHand = Array.from({ length: 4 }, (_, index) =>
      createMockUnit({ name: `Hand card ${index + 1}` }),
    );
    const deck = Array.from({ length: 4 }, (_, index) =>
      createMockUnit({ name: `Drawn card ${index + 1}` }),
    );
    const engine = GundamTestEngine.create({
      hand: [source, ...startingHand],
      deck,
      resourceArea: activeResources(1),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(source));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") throw new Error("Expected discard choice");
    expect(choice.actionKind).toBe("discardChosen");
    expect(choice.candidateSet?.cardIds).toEqual(p1.getHand());

    const view = currentInteractionView(engine);
    const partition = view.actions[0]?.inputs.find((input) => input.id === "targetPartition");
    expect(partition).toMatchObject({
      kind: "entity-partition",
      candidateSetText: { params: { label: "Your Hand" } },
      assignment: "remainder-automatic",
      routes: [{ id: "targets", min: 2, max: 2 }],
      remainderText: { params: { label: "Remaining cards stay in your Hand" } },
    });
    const discarded = p1.getHand().slice(0, 2);
    const submission = buildInteractionSubmissionForActionId({
      view,
      actionId: "resolveEffect",
      values: {
        pendingEffectId: choice.effectId,
        targetPartition: { targets: discarded },
      },
    });
    expect(validateInteractionSubmission(view, submission).ok).toBe(true);
    dispatch(engine, submission);
    expect(p1.getCardsInZone("trash")).toEqual(expect.arrayContaining(discarded));
  });

  it("shows every milled card while only eligible cards can be added to hand", () => {
    const sacrifice = createMockUnit({ name: "Sacrifice" });
    const eligible = createMockUnit({ name: "Eligible Neo Zeon", traits: ["neo zeon"] });
    const otherEligible = createMockUnit({ name: "Other Neo Zeon", traits: ["neo zeon"] });
    const ineligible = createMockUnit({ name: "Ineligible Unit", traits: ["academy"] });
    const pilot = createMockPilot({ name: "Ineligible Pilot" });
    const engine = GundamTestEngine.create({
      hand: [gd05Sazabi052],
      play: [sacrifice],
      deck: [eligible, ineligible, pilot, otherEligible],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const sacrificeId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd05Sazabi052));
    const destroyChoice = p1.getBoardView().pendingChoice;
    if (destroyChoice?.kind !== "targetSelection") throw new Error("Expected destroy choice");
    expectSuccess(
      p1.resolveEffect({
        optionalAnswers: { [destroyChoice.optionalDirectiveIndex!]: true },
        targets: [sacrificeId],
      }),
    );

    const recoverChoice = p1.getBoardView().pendingChoice;
    if (recoverChoice?.kind !== "targetSelection") throw new Error("Expected mill recovery");
    expect(recoverChoice.candidateSet).toMatchObject({ kind: "temporary", zone: "trash" });
    expect(recoverChoice.candidateSet?.cardIds).toHaveLength(3);
    expect(recoverChoice.legalTargetIds).toHaveLength(1);

    const view = currentInteractionView(engine);
    const partition = view.actions[0]?.inputs.find((input) => input.id === "targetPartition");
    expect(partition).toMatchObject({
      kind: "entity-partition",
      candidateSetText: { params: { label: "Cards placed in Trash" } },
      candidates: expect.arrayContaining(
        recoverChoice.candidateSet!.cardIds.map((instanceId) =>
          expect.objectContaining({ entity: expect.objectContaining({ instanceId }) }),
        ),
      ),
      routes: [
        expect.objectContaining({
          id: "targets",
          candidateIds: recoverChoice.legalTargetIds,
          min: 1,
          max: 1,
        }),
      ],
    });
    const selectedId = recoverChoice.legalTargetIds[0]!;
    const submission = buildInteractionSubmissionForActionId({
      view,
      actionId: "resolveEffect",
      values: {
        pendingEffectId: recoverChoice.effectId,
        targetPartition: { targets: [selectedId] },
      },
    });
    expect(validateInteractionSubmission(view, submission).ok).toBe(true);
    dispatch(engine, submission);
    expect(p1.getHand()).toContain(selectedId);
  });

  it("lets the player decline GD04-105's optional tutor while the remainder stays automatic", () => {
    const pilot = createMockPilot({ name: "Declined Pilot", level: 1, cost: 1 });
    const fillers = Array.from({ length: 4 }, (_, index) =>
      createMockUnit({ name: `Decline Filler ${index + 1}` }),
    );
    const engine = GundamTestEngine.create({
      hand: [gd04Encounter105],
      deck: [pilot, ...fillers],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.playCommand(p1.getHand()[0]!));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "deckLook") throw new Error("Expected GD04-105 Deck look");
    const pilotId = choice.legalTutorCardIds[0]!;
    const view = currentInteractionView(engine);
    const submission = buildInteractionSubmissionForActionId({
      view,
      actionId: "resolveEffect",
      values: {
        pendingEffectId: choice.effectId,
        [`deckLookAnswers.${choice.directiveIndex}`]: {},
      },
    });

    expect(validateInteractionSubmission(view, submission).ok).toBe(true);
    dispatch(engine, submission);

    expect(p1.getHand()).not.toContain(pilotId);
    expect(p1.getCardsInZone("deck")).toContain(pilotId);
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
    const completionId = `deckLookAnswers.${choice.directiveIndex}`;
    const action = view.actions.find((candidate) => candidate.id === "resolveEffect");
    const completion = action?.inputs.find((input) => input.id === completionId);
    expect(completion).toMatchObject({
      kind: "entity-partition",
      required: true,
      assignment: "remainder-automatic",
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
        [completionId]: {},
      },
    });
    expect(validateInteractionSubmission(view, submission).ok).toBe(true);
    dispatch(engine, submission);

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(2);
    expect(p1.getCardZone(duelId)).toBe(`battleArea:${PLAYER_ONE}`);
  });

  it("block step view omits declareBlock against a <High-Maneuver> attacker (13-1-6)", () => {
    const attacker = createMockUnit({
      name: "High-Maneuver Attacker",
      keywordEffects: [{ keyword: "HighManeuver" }],
    });
    const blocker = createMockUnit({
      name: "Ready Blocker",
      keywordEffects: [{ keyword: "Blocker" }],
    });
    const engine = GundamTestEngine.create({ play: [attacker] }, { play: [blocker] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expect(engine.getState().ctx.status.step).toBe("block-step");

    // The defender controls a ready <Blocker>, but <High-Maneuver> cannot be
    // declared against — the view must offer no declareBlock action, only the
    // block pass, so "no valid action" automation can pass the step.
    const defenderView = currentInteractionViewAs(engine, PLAYER_TWO);
    expect(defenderView.status).toBe("ready");
    expect(defenderView.actions.find((action) => action.id === "declareBlock")).toBeUndefined();
    const passBlock = defenderView.actions.find((action) => action.id === "passBlock");
    expect(passBlock?.enabled).toBe(true);
  });

  it("block step view offers declareBlock against an ordinary attacker", () => {
    const attacker = createMockUnit({ name: "Attacker" });
    const blocker = createMockUnit({
      name: "Ready Blocker",
      keywordEffects: [{ keyword: "Blocker" }],
    });
    const engine = GundamTestEngine.create({ play: [attacker] }, { play: [blocker] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const blockerId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.enterBattle(attackerId, "direct"));

    const defenderView = currentInteractionViewAs(engine, PLAYER_TWO);
    const declareBlock = defenderView.actions.find((action) => action.id === "declareBlock");
    expect(declareBlock?.enabled).toBe(true);
    const selection = declareBlock?.inputs.find(
      (input) => input.kind === "entity-selection" && input.role === "source",
    );
    expect(
      selection?.kind === "entity-selection" &&
        selection.candidates.map((candidate) => candidate.entity.instanceId),
    ).toEqual([blockerId]);
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

const interactionFixtures = new WeakMap<GundamTestEngine, GundamServerEngine>();

function interactionFixture(engine: GundamTestEngine): GundamServerEngine {
  const existing = interactionFixtures.get(engine);
  if (existing) return existing;
  const fixture = new GundamServerEngine(engine.getLocalEngine(), engine.getStaticResources());
  interactionFixtures.set(engine, fixture);
  return fixture;
}

function currentInteractionView(engine: GundamTestEngine) {
  return interactionFixture(engine).getInteractionView(PLAYER_ONE);
}

function currentInteractionViewAs(
  engine: GundamTestEngine,
  actorId: typeof PLAYER_ONE | typeof PLAYER_TWO,
) {
  return interactionFixture(engine).getInteractionView(actorId);
}

function dispatch(engine: GundamTestEngine, submission: InteractionSubmission): void {
  dispatchAs(engine, PLAYER_ONE, submission);
}

function dispatchAs(
  engine: GundamTestEngine,
  actorId: typeof PLAYER_ONE | typeof PLAYER_TWO,
  submission: InteractionSubmission,
): void {
  const result = interactionFixture(engine).submitInteraction(actorId, submission, {
    gameId: "interaction-protocol-test",
    sourceAuthority: "server",
  });
  if (!result.success) {
    throw new Error(`Expected interaction submission to succeed: ${result.error}`);
  }
}
