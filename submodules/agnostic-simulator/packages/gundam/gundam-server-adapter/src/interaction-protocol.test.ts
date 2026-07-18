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
  gd04GrahamSUnionFlagCustomGnFlag071,
} from "@tcg/gundam-cards";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
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
    const [, firstEligibleId, secondEligibleId, wrongTraitId] = p1.getHand();

    expectSuccess(p1.deployUnit(gd02GundamAge1Normal021));
    const optional = p1.getBoardView().pendingChoice;
    if (optional?.kind !== "optional") {
      throw new Error("Expected AGE-1 Normal to offer its optional discard");
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
      throw new Error("Expected AGE-1 Normal to ask which eligible Unit to discard");
    }
    const targetView = currentInteractionView(engine);
    const invalidSubmission = buildInteractionSubmissionForActionId({
      view: targetView,
      actionId: "resolveEffect",
      values: {
        pendingEffectId: targetChoice.effectId,
        targets: [wrongTraitId],
      },
    });
    expect(validateInteractionSubmission(targetView, invalidSubmission).ok).toBe(false);
    const targetSubmission = buildInteractionSubmissionForActionId({
      view: targetView,
      actionId: "resolveEffect",
      values: {
        pendingEffectId: targetChoice.effectId,
        targets: [secondEligibleId],
      },
    });

    expect(validateInteractionSubmission(targetView, targetSubmission).ok).toBe(true);
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
    if (optional?.kind !== "optional") {
      throw new Error("Expected the discard acceptance before any Deck reveal");
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
        [`optionalAnswers.${optional.directiveIndex}`]: true,
      },
    });
    expect(validateInteractionSubmission(optionalView, accept).ok).toBe(true);
    dispatch(engine, accept);

    const discard = p1.getBoardView().pendingChoice;
    if (discard?.kind !== "targetSelection") {
      throw new Error("Expected the visible hand-card discard choice second");
    }
    expect(discard.legalTargetIds).toEqual(expect.arrayContaining([firstDiscardId, keptDiscardId]));
    const discardView = currentInteractionView(engine);
    const chooseDiscard = buildInteractionSubmissionForActionId({
      view: discardView,
      actionId: "resolveEffect",
      values: { pendingEffectId: discard.effectId, targets: [firstDiscardId] },
    });
    expect(validateInteractionSubmission(discardView, chooseDiscard).ok).toBe(true);
    dispatch(engine, chooseDiscard);

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
        [`deckLookAnswers.${deckLook.directiveIndex}.tutorCardId`]: [tutorId],
        [`deckLookAnswers.${deckLook.directiveIndex}.completion`]: ["complete"],
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
    if (optional?.kind !== "optional") throw new Error("Expected Zedas's optional sacrifice");
    const optionalView = currentInteractionView(engine);
    const accept = buildInteractionSubmissionForActionId({
      view: optionalView,
      actionId: "resolveEffect",
      values: {
        pendingEffectId: optional.effectId,
        [`optionalAnswers.${optional.directiveIndex}`]: true,
      },
    });
    expect(validateInteractionSubmission(optionalView, accept).ok).toBe(true);
    dispatch(engine, accept);

    const sacrifice = p1.getBoardView().pendingChoice;
    if (sacrifice?.kind !== "targetSelection") {
      throw new Error("Expected Zedas to ask for the sacrifice target");
    }
    expect(sacrifice.legalTargetIds).toEqual([allyId]);
    const sacrificeView = currentInteractionView(engine);
    const invalidSacrifice = buildInteractionSubmissionForActionId({
      view: sacrificeView,
      actionId: "resolveEffect",
      values: { pendingEffectId: sacrifice.effectId, targets: [enemyId] },
    });
    expect(validateInteractionSubmission(sacrificeView, invalidSacrifice).ok).toBe(false);
    const chooseSacrifice = buildInteractionSubmissionForActionId({
      view: sacrificeView,
      actionId: "resolveEffect",
      values: { pendingEffectId: sacrifice.effectId, targets: [allyId] },
    });
    expect(validateInteractionSubmission(sacrificeView, chooseSacrifice).ok).toBe(true);
    dispatch(engine, chooseSacrifice);

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

function dispatch(engine: GundamTestEngine, submission: InteractionSubmission): void {
  const result = interactionFixture(engine).submitInteraction(PLAYER_ONE, submission, {
    gameId: "interaction-protocol-test",
    sourceAuthority: "server",
  });
  if (!result.success) {
    throw new Error(`Expected interaction submission to succeed: ${result.error}`);
  }
}
