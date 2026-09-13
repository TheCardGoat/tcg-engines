import {
  commandForFabSubmission,
  FleshAndBloodServerEngine,
  projectFabInteraction,
} from "@tcg/flesh-and-blood-server-adapter";
import {
  dash,
  digInYellow,
  nimblismBlue,
  nimblismYellow,
  noHeroStandsAloneYellow,
  snatchRed,
  toughness,
  tuffnut,
} from "@tcg/flesh-and-blood-cards/simulator-scenario-cards";
import { intoTheMuckRed } from "@tcg/flesh-and-blood-cards/cards/attack-reactions/into-the-muck";
import { kassai } from "@tcg/flesh-and-blood-cards/cards/heroes/kassai";
import { catalogIds } from "@tcg/flesh-and-blood-engine/simulator";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { buildInteractionSubmission } from "@tcg/protocol";
import { describe, expect, it } from "vitest";
import { projectCombatChainView } from "../combatChainView";
import { COMBAT_SCENARIOS } from "./combat";
import { getFabEngineScenario } from "./index";
import { presentRuntime } from "../projection";

describe("FAB engine scenarios · combat", () => {
  it("keeps an effect-moved defender off the live chain while the link remains open", () => {
    const scenario = COMBAT_SCENARIOS["defender-zone-exit"];
    const match = scenario.boot();

    const game = match.engine;
    const Kassai = game.as(kassai);
    const Dash = game.as(dash);
    const defender = Dash.cardIn("combatChain", nimblismBlue);

    expect(scenario.botMode).toBe("pass-only");
    expect(
      projectCombatChainView(presentRuntime(match.runtime, match.player1Id)).defenders,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ entity: expect.objectContaining({ id: defender.instanceId }) }),
      ]),
    );

    Kassai.play(intoTheMuckRed);
    for (let pass = 0; pass < 2; pass += 1) {
      const wait = match.runtime.waitState();
      if (wait.kind !== "priority") throw new Error(`Expected priority, got ${wait.kind}.`);
      expect(match.runtime.applyCommand(wait.playerId, { move: "pass" })).toMatchObject({
        success: true,
      });
    }

    expectFabCard(Dash, defender).toBeBanished();
    expect(match.runtime.getState().combat?.open).toBe(true);
    expect(
      projectCombatChainView(presentRuntime(match.runtime, match.player1Id)).defenders.map(
        (card) => card.entity.id,
      ),
    ).not.toContain(defender.instanceId);
  });

  it("opens Dig In at defense declaration with both pitch cards and no floating resources", () => {
    const match = getFabEngineScenario("dig-in-defense")?.boot();
    if (!match) throw new Error("Missing Dig In defense scenario.");

    expect(match.runtime.waitState().kind).toBe("defense-declaration");
    const presentation = presentRuntime(match.runtime, match.player2Id);
    const handCardIds = Object.values(presentation.cards)
      .filter((card) => card.ownerId === match.player2Id && card.zone === "hand")
      .map((card) => card.cardId);

    expect(handCardIds).toEqual(
      expect.arrayContaining([
        digInYellow.canonicalId,
        nimblismYellow.canonicalId,
        catalogIds.nimblismBlue,
      ]),
    );
    expect(presentation.resourcePoints[match.player2Id]).toBe(0);
  });

  it("combines Dig In optional acceptance with its explicit payment amount", () => {
    const match = getFabEngineScenario("dig-in-defense")?.boot();
    if (!match) throw new Error("Missing Dig In defense scenario.");
    const state = match.runtime.getState();
    const digInInstanceId = state.containers.zonesByPlayerId[match.player2Id]!.hand.find(
      (instanceId) => state.objects[instanceId]?.canonicalId === digInYellow.canonicalId,
    );
    if (!digInInstanceId) throw new Error("Missing authored Dig In in the defender's hand.");

    expect(
      match.runtime.dispatch("defend", match.player2Id, { instanceIds: [digInInstanceId] }),
    ).toMatchObject({ accepted: true });
    for (let pass = 0; pass < 8 && match.runtime.waitState().kind !== "decision"; pass += 1) {
      const wait = match.runtime.waitState();
      if (wait.kind !== "priority") throw new Error(`Unexpected wait state ${wait.kind}.`);
      expect(match.runtime.dispatch("pass", wait.playerId, {})).toMatchObject({ accepted: true });
    }

    const projection = projectFabInteraction(match.runtime, match.player2Id);
    const action = projection.view.actions[0]!;
    expect(action.inputs).toMatchObject([
      { kind: "boolean", id: "optional" },
      {
        kind: "number",
        id: "answer",
        min: 0,
        max: 3,
        required: false,
        requiredWhen: [{ all: [{ inputId: "optional", value: true }] }],
      },
    ]);
    expect(projection.view.resolution?.currentStep.requirement).toMatchObject({
      kind: "number",
      required: true,
      min: 0,
      max: 3,
    });

    const submission = buildInteractionSubmission({
      view: projection.view,
      action,
      values: { optional: true, answer: 2 },
    });
    expect(commandForFabSubmission(match.runtime, match.player2Id, submission)).toMatchObject({
      move: "answer-decision",
      payload: {
        answer: { kind: "boolean", value: true },
        followUpAnswers: [{ kind: "numeric", value: 2 }],
      },
    });

    const currentDecision = match.runtime.waitState();
    if (currentDecision.kind !== "decision") throw new Error("Expected Dig In decision.");
    expect(
      match.runtime.dispatch("answer-decision", match.player2Id, {
        decisionId: currentDecision.decision.decisionId,
        stateVersion: currentDecision.decision.stateVersion,
        answer: { kind: "boolean", value: true },
        followUpAnswers: [{ kind: "boolean", value: true }],
      }),
    ).toMatchObject({ accepted: false });
    expect(match.runtime.waitState()).toMatchObject({
      kind: "decision",
      decision: { kind: "boolean", decisionId: currentDecision.decision.decisionId },
    });

    const serverEngine = new FleshAndBloodServerEngine(match.runtime);
    expect(
      serverEngine.submitInteraction(match.player2Id, submission, {
        gameId: "fab-scenario-dig-in-combined-optional",
        sourceAuthority: "server",
      }),
    ).toMatchObject({ success: true });
    expect(match.runtime.waitState()).toMatchObject({
      kind: "decision",
      decision: { kind: "payment", amount: 2, actorId: match.player2Id },
    });
  });

  it("starts SUP020 from Tuffnut's active turn with Toughness and an arsenal ambush", () => {
    const scenario = getFabEngineScenario("no-hero-stands-alone-defense-target");
    const match = scenario?.boot();
    if (!scenario || !match) throw new Error("Missing SUP020 defense-target scenario.");

    const game = FabTestEngine.fromRuntime(match.runtime);
    const Tuffnut = game.as(tuffnut);
    const handCopy = Tuffnut.cardIn("hand", noHeroStandsAloneYellow);
    const arsenalCopy = Tuffnut.cardIn("arsenal", noHeroStandsAloneYellow);

    expect(scenario.viewerId).toBe(match.player2Id);
    expect(scenario.botMode).toBe("attack-only");
    expectFabPlayer(Tuffnut).toBeActive();
    expectFabCard(Tuffnut, toughness).toBeIn("arena");
    expectFabCard(Tuffnut, handCopy).toBeIn("hand");
    expectFabCard(Tuffnut, arsenalCopy).toBeIn("arsenal");
    expectFabCard(Tuffnut, handCopy).toHaveKeyword("ambush");
    expectFabCard(Tuffnut, arsenalCopy).toHaveKeyword("ambush");
    expectFabCard(Tuffnut, handCopy).toHaveDefense(3);
    expectFabCard(Tuffnut, arsenalCopy).toHaveDefense(3);
  });

  it("reaches SUP020's winning clash targets through end turn and arsenal defense", () => {
    const match = getFabEngineScenario("no-hero-stands-alone-defense-target")?.boot();
    if (!match) throw new Error("Missing SUP020 defense-target scenario.");

    const game = FabTestEngine.fromRuntime(match.runtime);
    const Tuffnut = game.as(tuffnut);
    const Dash = game.as(dash);
    const toughnessInstanceId = Tuffnut.findCardInZone("arena", toughness);
    const arsenalCopy = Tuffnut.cardIn("arsenal", noHeroStandsAloneYellow);

    Tuffnut.endTurn();
    game.untilIdle({ ordering: "listed" });
    expect(Tuffnut.zone("arena")).not.toContain(toughnessInstanceId);

    Dash.playAttack(snatchRed);
    Tuffnut.defendWith(arsenalCopy);
    const defendingPresentation = presentRuntime(match.runtime, match.player2Id);
    const defendingInstanceId = defendingPresentation.combat?.activeLink?.defendingInstanceIds[0];
    expect(defendingInstanceId).toBeDefined();
    expect(defendingPresentation.cards[defendingInstanceId!]?.currentNumeric?.defense).toBe(4);
    const combatView = projectCombatChainView(defendingPresentation);
    expect(combatView.defenders[0]?.entity.stats).toContainEqual({
      label: "Defense",
      value: "4",
    });
    expect(combatView.totalDefense).toBe(4);
    expect(combatView.projectedDamage).toBe(0);
    game.untilIdle({ optionals: "accept", entityTargets: "pause", ordering: "listed" });

    const wait = match.runtime.waitState();
    expect(wait).toMatchObject({
      kind: "decision",
      decision: {
        kind: "entity-target",
        actorId: match.player2Id,
        min: 0,
        max: 1,
      },
    });
    if (wait.kind !== "decision" || wait.decision.kind !== "entity-target") return;

    expect(wait.decision.candidates.map((candidate) => candidate.label).sort()).toEqual([
      "No Hero Stands Alone",
      "Snatch",
    ]);

    const interaction = projectFabInteraction(match.runtime, match.player2Id);
    const action = interaction.view.actions[0]!;
    const input = action.inputs[0];
    if (input?.kind !== "entity-selection") {
      throw new Error("Expected SUP020 card-target interaction.");
    }
    const snatchTarget = input.candidates.find((candidate) => candidate.text?.key === "Snatch");
    if (!snatchTarget) throw new Error("Missing Snatch target.");
    const submission = buildInteractionSubmission({
      view: interaction.view,
      action,
      values: { answer: [snatchTarget.entity.instanceId] },
    });
    const command = commandForFabSubmission(match.runtime, match.player2Id, submission);
    expect(command).not.toBeNull();
    expect(match.runtime.dispatch(command!.move, match.player2Id, command!.payload)).toMatchObject({
      accepted: true,
    });
    expect(match.runtime.waitState().kind).not.toBe("decision");

    const presentation = presentRuntime(match.runtime, match.player2Id);
    const defender = Object.values(presentation.cards).find(
      (card) => card.cardId === noHeroStandsAloneYellow.canonicalId && card.zone === "combat-chain",
    );
    expect(defender).toMatchObject({ zone: "combat-chain" });
  });

  it("starts the Head Jab defense fixture on the attack-only opponent turn", () => {
    const scenario = getFabEngineScenario("attack-only-head-jab");
    const match = scenario?.boot();
    if (!scenario || !match) throw new Error("Missing attack-only Head Jab scenario.");

    const state = match.runtime.getState();
    const opponentHand = state.containers.zonesByPlayerId[match.player2Id]?.hand ?? [];
    const defenderHand = state.containers.zonesByPlayerId[match.player1Id]?.hand ?? [];
    const defenderCanonicalIds = defenderHand.map(
      (instanceId) => state.objects[instanceId]?.canonicalId,
    );
    const canonicalIds = opponentHand.map((instanceId) => state.objects[instanceId]?.canonicalId);

    expect(scenario.viewerId).toBe(match.player1Id);
    expect(scenario.botMode).toBe("attack-only");
    expect(state.activePlayerId).toBe(match.player2Id);
    expect(canonicalIds).toHaveLength(4);
    expect(new Set(canonicalIds)).toEqual(new Set(["CbngjC9FTFNdmTGT7ddCT"]));
    expect(
      state.cardDefinitions["CbngjC9FTFNdmTGT7ddCT"]?.base.keywords.some(
        (keyword) => keyword.name === "go-again",
      ),
    ).toBe(true);
    expect(defenderCanonicalIds).toEqual(
      expect.arrayContaining([
        catalogIds.enlightenedStrike,
        catalogIds.snatch,
        catalogIds.nimblismBlue,
        catalogIds.sinkBelow,
        catalogIds.unmovable,
      ]),
    );
    expect(defenderCanonicalIds).toHaveLength(6);
  });

  it("keeps an open combat chain and orders alternating real instant card-layers top first", () => {
    const match = getFabEngineScenario("combat-stack-responses")?.boot();
    if (!match) throw new Error("Missing combat stack response scenario.");

    const viewer = match.runtime.viewer({ role: "player", actorId: "player-1" });
    expect(viewer.combat).toMatchObject({ open: true, step: "defend" });
    expect(viewer.rulesStack).toHaveLength(4);
    const controllersBottomFirst = viewer.rulesStack.map((layer) => layer.controllerId);
    expect(controllersBottomFirst).toHaveLength(4);
    expect(new Set(controllersBottomFirst)).toEqual(new Set(["player-1", "player-2"]));
    expect(controllersBottomFirst.filter((controller) => controller === "player-1")).toHaveLength(
      2,
    );
    expect(controllersBottomFirst.filter((controller) => controller === "player-2")).toHaveLength(
      2,
    );

    const view = projectCombatChainView(presentRuntime(match.runtime, "player-1"));
    expect(view.stack.map((entry) => entry.entity.ownerId)).toEqual(
      [...controllersBottomFirst].reverse(),
    );
    expect(view.stack.map((entry) => entry.entity.title)).toEqual([
      "Sigil of Solace",
      "Sigil of Solace",
      "Sigil of Solace",
      "Sigil of Solace",
    ]);
    expect(view.stack.map((entry) => entry.order)).toEqual([1, 2, 3, 4]);
  });
});
