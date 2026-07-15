import { describe, expect, it } from "vite-plus/test";
import {
  gd01CharSGelgoog023,
  gd01UnicornGundamDestroyMode002,
  gd03AeuHellion083,
  gd03ChristinaMackenzie085,
  gd03Defurse064,
  gd03Downes130,
  gd03Farsia058,
  gd03Gfred035,
  gd03Gfred048,
  gd03GundamNt1001,
  gd03Nyaan092,
  gd04Encounter105,
  gd04GarmaSDopp026,
  gd04GracefulDemeanor117,
  gd04GrahamSUnionFlagCustomGnFlag071,
  gd04PalaSys094,
  gd04UnicornGundam02BansheeNornDestroyMode065,
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
  restedResources,
} from "@tcg/gundam-engine";
import { buildGundamInteractionView, gundamSubmissionToPayload } from "@tcg/gundam-server-adapter";
import { validateInteractionSubmission, type EngineInteractionView } from "@tcg/protocol";

import { protocolTargetSelection } from "../../game/selectors/interactionView.ts";
import { asMoveName } from "../../game/types.ts";
import { moveToInteractionSubmission } from "./actionToInteraction.ts";

type TestPlayerId = typeof PLAYER_ONE | typeof PLAYER_TWO;

describe("native Gundam moves through the interaction protocol", () => {
  it("submits GD01-002's alternate deploy from the simulator's native move shape", () => {
    const unicornMode = createMockUnit({
      name: "Unicorn Gundam (Unicorn Mode)",
      level: 5,
      linkCondition: "[Banagher Links]",
    });
    const banagher = createMockPilot({ name: "Banagher Links", level: 1, cost: 0 });
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
    dispatchInteraction(
      engine,
      PLAYER_ONE,
      currentInteractionView(engine, PLAYER_ONE),
      { cardId: destroyModeId, mode: "alternate", targets: [unicornModeId] },
      "deployUnit",
    );

    expect(p1.getCardZone(unicornModeId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getCardZone(banagherId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getCardZone(destroyModeId)).toBe(`battleArea:${PLAYER_ONE}`);
  });

  it("does not require GD01-002's conditional mode when the player deploys another Unit", () => {
    const unicornMode = createMockUnit({
      name: "Unicorn Gundam (Unicorn Mode)",
      level: 5,
      linkCondition: "[Banagher Links]",
    });
    const ordinaryUnit = createMockUnit({ name: "Ordinary Unit", level: 1, cost: 1 });
    const banagher = createMockPilot({ name: "Banagher Links", level: 1, cost: 0 });
    const engine = GundamTestEngine.create({
      hand: [gd01UnicornGundamDestroyMode002, ordinaryUnit, banagher],
      play: [unicornMode],
      resourceArea: activeResources(1),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [, ordinaryId, banagherId] = p1.getHand();
    const unicornModeId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(banagherId!, unicornModeId));
    const view = currentInteractionView(engine, PLAYER_ONE);
    dispatchInteraction(engine, PLAYER_ONE, view, { cardId: ordinaryId! }, "deployUnit");

    expect(p1.getCardZone(ordinaryId!)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getCardZone(gd01UnicornGundamDestroyMode002)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("submits GD01-023's chosen discard cost before its public effect target", () => {
    const zeonCost = createMockUnit({ name: "Chosen Zeon cost", traits: ["zeon"] });
    const otherZeon = createMockUnit({ name: "Unchosen Zeon card", traits: ["zeon"] });
    const newtype = createMockPilot({ name: "Chosen Newtype", traits: ["newtype"], level: 3 });
    const engine = GundamTestEngine.create({
      play: [gd01CharSGelgoog023],
      hand: [zeonCost, otherZeon],
      trash: [newtype],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const gelgoogId = p1.getCardsInZone("battleArea")[0]!;
    const [costId, untouchedId] = p1.getHand();
    const newtypeId = p1.getCardsInZone("trash")[0]!;
    const view = currentInteractionView(engine, PLAYER_ONE);
    const activateAction = view.actions.find((action) => action.id === "activateAbility");
    const discardInput = activateAction?.inputs.find(
      (input) => input.kind === "entity-selection" && input.role === "cost",
    );
    expect(discardInput?.kind).toBe("entity-selection");
    if (discardInput?.kind !== "entity-selection") {
      throw new Error("Expected the activation interaction to show the discard cost candidates");
    }
    expect(discardInput.candidates.map((candidate) => candidate.entity.instanceId)).toEqual([
      costId,
      untouchedId,
    ]);

    dispatchInteraction(
      engine,
      PLAYER_ONE,
      view,
      { cardId: gelgoogId, effectIndex: 0, targets: [costId!] },
      "activateAbility",
    );

    expect(p1.getCardZone(costId!)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getCardZone(untouchedId!)).toBe(`hand:${PLAYER_ONE}`);
    const targetChoice = p1.getBoardView().pendingChoice;
    if (targetChoice?.kind !== "targetSelection") {
      throw new Error("Expected the activation to ask which Newtype Pilot to pair");
    }
    dispatchInteraction(engine, PLAYER_ONE, currentInteractionView(engine, PLAYER_ONE), {
      pendingEffectId: targetChoice.effectId,
      targets: [newtypeId],
    });

    expect(p1.getPilotId(gelgoogId)).toBe(newtypeId);
    expect(p1.getCardZone(newtypeId)).toBe(`battleArea:${PLAYER_ONE}`);
  });

  it("does not publish GD01-023 as an enabled activation without a discard card", () => {
    const engine = GundamTestEngine.create({ play: [gd01CharSGelgoog023] });
    const view = currentInteractionView(engine, PLAYER_ONE);
    const activate = view.actions.find((action) => action.id === "activateAbility");

    expect(activate).toBeUndefined();
    expect(
      moveToInteractionSubmission(
        asMoveName("activateAbility"),
        { cardId: engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!, effectIndex: 0 },
        view,
      ),
    ).toBeNull();
  });

  it("does not publish GD01-023 when its cost is payable but no effect target exists", () => {
    const zeonCost = createMockUnit({ name: "Zeon Cost", traits: ["zeon"] });
    const engine = GundamTestEngine.create({
      play: [gd01CharSGelgoog023],
      hand: [zeonCost],
    });
    const view = currentInteractionView(engine, PLAYER_ONE);

    expect(view.actions.find((action) => action.id === "activateAbility")).toBeUndefined();
    expect(engine.asPlayer(PLAYER_ONE).getCardZone(zeonCost)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("publishes and dispatches Christina's zero-cost pairing only for a Gundam NT-1 Unit", () => {
    const engine = GundamTestEngine.create({
      hand: [gd03ChristinaMackenzie085],
      play: [gd03GundamNt1001, gd03AeuHellion083],
      resourceArea: restedResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const christinaId = p1.getHand()[0]!;
    const [nt1Id, nonmatchingId] = p1.getCardsInZone("battleArea");
    const resourceIds = p1.getCardsInZone("resourceArea");
    const resourceStatesBefore = resourceIds.map((id) => p1.isExhausted(id));
    const view = currentInteractionView(engine, PLAYER_ONE);

    const matchingSubmission = moveToInteractionSubmission(
      asMoveName("assignPilot"),
      { pilotId: christinaId, unitId: nt1Id },
      view,
    );
    if (!matchingSubmission) {
      throw new Error("Expected Christina to be published as an assignable Pilot");
    }
    expect(validateInteractionSubmission(view, matchingSubmission).ok).toBe(true);

    const nonmatchingSubmission = moveToInteractionSubmission(
      asMoveName("assignPilot"),
      { pilotId: christinaId, unitId: nonmatchingId },
      view,
    );
    if (!nonmatchingSubmission) {
      throw new Error("Expected the published assignPilot action to validate its target");
    }
    const nonmatchingValidation = validateInteractionSubmission(view, nonmatchingSubmission);
    expect(nonmatchingValidation.ok).toBe(false);

    dispatchInteraction(
      engine,
      PLAYER_ONE,
      view,
      { pilotId: christinaId, unitId: nt1Id },
      "assignPilot",
    );

    expect(p1.getPilotId(nt1Id!)).toBe(christinaId);
    expect(p1.getPilotId(nonmatchingId!)).toBeUndefined();
    expect(p1.getCardZone(christinaId)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(resourceIds.map((id) => p1.isExhausted(id))).toEqual(resourceStatesBefore);
  });

  it("lets a player accept Downes and choose the payable Vagan Unit shown by the UI", () => {
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
    dispatchInteraction(engine, PLAYER_ONE, currentInteractionView(engine, PLAYER_ONE), {
      pendingEffectId: optional.effectId,
      optionalAnswers: { [optional.directiveIndex]: true },
    });

    const targetChoice = p1.getBoardView().pendingChoice;
    if (targetChoice?.kind !== "targetSelection") {
      throw new Error("Expected Downes to ask which eligible trash Unit to deploy");
    }
    const targetView = currentInteractionView(engine, PLAYER_ONE);
    expect(protocolTargetSelection(targetView)?.targetIds).toEqual([farsiaId]);
    dispatchInteraction(engine, PLAYER_ONE, targetView, {
      pendingEffectId: targetChoice.effectId,
      targets: [farsiaId!],
    });

    expect(p1.getCardsInZone("battleArea")).toContain(farsiaId);
    expect(p1.getCardsInZone("trash")).toHaveLength(2);
    expect(p1.getCardsInZone("trash")).toEqual(expect.arrayContaining([defurseId, hellionId]));
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(3);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });

  it("shows Nyaan's successful mill before submitting the resulting damage target", () => {
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

    const targetView = currentInteractionView(engine, PLAYER_ONE);
    expect(protocolTargetSelection(targetView)?.targetIds).toEqual([enemyId]);
    dispatchInteraction(engine, PLAYER_ONE, targetView, {
      pendingEffectId: choice.effectId,
      targets: [enemyId],
    });

    expect(p2.getDamage(enemyId)).toBe(1);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });

  it("does not publish a target interaction when Nyaan mills a nonmatching card", () => {
    const engine = GundamTestEngine.create(
      {
        hand: [gd03Nyaan092],
        play: [gd03Gfred048],
        deck: [gd03Gfred035, gd03AeuHellion083],
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

    expect(p1.getCardZone(gd03AeuHellion083)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getCardsInZone("deck")).toHaveLength(1);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getDamage(enemyId)).toBe(0);
    expect(protocolTargetSelection(currentInteractionView(engine, PLAYER_ONE))).toBeNull();
  });

  it("lets a flexible GD04-071 target satisfy the group the other card cannot", () => {
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
    dispatchInteraction(engine, PLAYER_ONE, currentInteractionView(engine, PLAYER_ONE), {
      pendingEffectId: choice.effectId,
      // This is the order in which a human may click the cards. The bridge
      // must reserve the flexible card for (UN), which only it can satisfy.
      targets: [dualTraitId!, superpowerOnlyId!],
    });

    expect(p1.getCardZone(dualTraitId!)).toBe("removalArea");
    expect(p1.getCardZone(superpowerOnlyId!)).toBe("removalArea");
    expect(p1.isExhausted(unitId)).toBe(false);
    expect(p1.getLegalAttackTargets(unitId)).not.toContain("direct");
  });

  it("moves the card a player trashes with GD04-026 out of the looked-at deck", () => {
    const sentinel = createMockUnit({ name: "Deck sentinel" });
    const lookedAtCard = createMockUnit({ name: "Looked-at card" });
    const engine = GundamTestEngine.create({
      hand: [gd04GarmaSDopp026],
      deck: [sentinel, lookedAtCard],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const doppId = p1.getHand()[0]!;

    expectSuccess(p1.deployUnit(doppId));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "deckLook") {
      throw new Error("Expected GD04-026 to show the top card");
    }
    const revealedId = choice.revealedCardIds[0]!;
    dispatchInteraction(engine, PLAYER_ONE, currentInteractionView(engine, PLAYER_ONE), {
      pendingEffectId: choice.effectId,
      deckLookAnswers: {
        [choice.directiveIndex]: {
          toTop: [],
          toBottom: [],
          toTrash: [revealedId],
        },
      },
    });

    expect(p1.getCardZone(revealedId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getCardsInZone("deck")).toHaveLength(1);
    expect(p1.getCardsInZone("battleArea")).toContain(doppId);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });

  it("takes the GD04-105 tutor while leaving random-bottom order to the engine", () => {
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
    dispatchInteraction(engine, PLAYER_ONE, currentInteractionView(engine, PLAYER_ONE), {
      pendingEffectId: choice.effectId,
      deckLookAnswers: {
        [choice.directiveIndex]: {
          tutorCardId: pilotId,
          toTop: [],
          toBottom: [],
          toTrash: [],
        },
      },
    });

    expect(p1.getHand()).toContain(pilotId);
    expect(p1.getCardsInZone("deck")).toHaveLength(4);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });

  it("publishes and dispatches every staged input needed to pay GD04-065's activation cost", () => {
    const riddhe = createMockPilot({ name: "Riddhe Marcenas", level: 4, cost: 1 });
    const blueA = createMockUnit({ name: "Blue A", color: "blue" });
    const blueB = createMockUnit({ name: "Blue B", color: "blue" });
    const blueC = createMockUnit({ name: "Blue C", color: "blue" });
    const engine = GundamTestEngine.create({
      hand: [riddhe],
      play: [{ card: gd04UnicornGundam02BansheeNornDestroyMode065, exhausted: true }],
      trash: [blueA, blueB, blueC],
      resourceArea: activeResources(6),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const bansheeId = p1.getCardsInZone("battleArea")[0]!;
    const costIds = p1.getCardsInZone("trash");

    expectSuccess(p1.assignPilot(riddhe, bansheeId));
    dispatchInteraction(
      engine,
      PLAYER_ONE,
      currentInteractionView(engine, PLAYER_ONE),
      {
        cardId: bansheeId,
        effectIndex: 0,
        targets: costIds,
      },
      "activateAbility",
    );

    for (const costId of costIds) {
      expect(p1.getCardZone(costId)).toBe("removalArea");
    }
    expect(p1.isExhausted(bansheeId)).toBe(false);
    expect(p1.getLegalAttackTargets(bansheeId)).not.toContain("direct");
  });

  it("resolves the simultaneous Burst the player chooses first", () => {
    const attacker = createMockUnit({
      name: "Suppression Attacker",
      level: 3,
      ap: 2,
      hp: 5,
      keywordEffects: [{ keyword: "Suppression" }],
    });
    const engine = GundamTestEngine.create(
      { shieldArea: [gd04GracefulDemeanor117, gd04PalaSys094] },
      { play: [attacker] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    const ordering = p1.getBoardView().pendingChoice;
    if (ordering?.kind !== "ordering") {
      throw new Error("Expected the player to order the simultaneous Bursts");
    }
    const palaBurst = ordering.candidates.find((candidate) =>
      candidate.label.includes(gd04PalaSys094.name),
    );
    if (!palaBurst) throw new Error("Expected Pala Sys among the ordering choices");
    const revealedPalaId = palaBurst.sourceCardId;
    dispatchInteraction(engine, PLAYER_ONE, currentInteractionView(engine, PLAYER_ONE), {
      pendingEffectId: palaBurst.effectId,
    });

    const palaChoice = p1.getBoardView().pendingChoice;
    if (palaChoice?.kind !== "optional" || palaChoice.sourceCardId !== revealedPalaId) {
      throw new Error("Expected the chosen Pala Sys Burst to resolve next");
    }
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p1.getHand()).toContain(revealedPalaId);
    expect(p1.getCardZone(gd04PalaSys094)).toBe(`hand:${PLAYER_ONE}`);
  });
});

function currentInteractionView(
  engine: GundamTestEngine,
  playerId: TestPlayerId,
): EngineInteractionView {
  const state = engine.getState();
  return buildGundamInteractionView({
    actorId: playerId,
    stateVersion: state.ctx._stateID,
    state,
    staticResources: engine.getRuntime().getStaticResources(),
    pendingChoice: engine.asPlayer(playerId).getBoardView().pendingChoice,
  });
}

function dispatchInteraction(
  engine: GundamTestEngine,
  playerId: TestPlayerId,
  view: EngineInteractionView,
  partialInput: Parameters<typeof moveToInteractionSubmission>[1],
  moveName = "resolveEffect",
): void {
  const submission = moveToInteractionSubmission(asMoveName(moveName), partialInput, view);
  if (!submission) throw new Error(`Expected ${moveName} to be available to the player`);
  const validation = validateInteractionSubmission(view, submission);
  if (!validation.ok) {
    throw new Error(`Expected a valid ${moveName} interaction: ${JSON.stringify(validation)}`);
  }

  const nativeMove = gundamSubmissionToPayload(submission);
  expectSuccess(engine.doMove(nativeMove.moveType, asPlayerId(playerId), nativeMove.payload));
}
