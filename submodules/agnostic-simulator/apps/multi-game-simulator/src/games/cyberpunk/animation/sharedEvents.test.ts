import { describe, expect, test } from "vite-plus/test";
import { welcomeToNightCityRetailPanamPalmerNomadCavalry } from "@tcg/cyberpunk-cards";
import { PLAYER_SIDE_TO_ID } from "../engine/index.js";
import type {
  CardAttachStep,
  CardEnterStep,
  CardExitStep,
  CardLandStep,
  CardMoveStep,
  CardRevealStep,
  CombatRedirectStep,
  CombatStep,
  EffectTargetStep,
  GigMoveStep,
  LegendRevealStep,
  PhaseChangeStep,
  ResourceFloatStep,
} from "./types.js";
import {
  cyberpunkAnimationScriptToAnimationPlans,
  cyberpunkAnimationStepToAnimationPlan,
  isCyberpunkAnimationStepSharedSupported,
  type CyberpunkSharedAnimationContext,
} from "./sharedEvents.js";
import {
  cyberpunkImmediateSystemAudioCues,
  stagedEffectSourceLabelsFromEntry,
} from "./CyberpunkSharedAnimationLayer.js";
import { getScenario } from "../engine/fixtures/scenarios/index.js";

const context: CyberpunkSharedAnimationContext = {
  viewerSeatId: String(PLAYER_SIDE_TO_ID.player),
};

describe("cyberpunkImmediateSystemAudioCues", () => {
  test("maps non-animated system events to shared cues", () => {
    expect(
      cyberpunkImmediateSystemAudioCues(
        cyberpunkRawEntry({
          events: [
            { type: "turnStarted", playerId: PLAYER_SIDE_TO_ID.player, turn: 2 },
            { type: "gameEnded", winnerId: PLAYER_SIDE_TO_ID.player, reason: "score" },
          ],
        }),
        String(PLAYER_SIDE_TO_ID.player),
      ),
    ).toEqual(["turn.change", "game.win"]);
  });

  test("dedupes repeated system cues per entry and maps losses", () => {
    expect(
      cyberpunkImmediateSystemAudioCues(
        cyberpunkRawEntry({
          events: [
            { type: "turnStarted", playerId: PLAYER_SIDE_TO_ID.player, turn: 2 },
            { type: "turnStarted", playerId: PLAYER_SIDE_TO_ID.opponent, turn: 2 },
            { type: "gameEnded", winnerId: PLAYER_SIDE_TO_ID.opponent, reason: "score" },
          ],
        }),
        String(PLAYER_SIDE_TO_ID.player),
      ),
    ).toEqual(["turn.change", "game.loss"]);
  });
});

describe("stagedEffectSourceLabelsFromEntry", () => {
  test("uses the current effect trigger type instead of the card fallback label", () => {
    const sourceCardId = "dexter-deshawn" as EffectTargetStep["sourceCardId"];
    const labels = stagedEffectSourceLabelsFromEntry(
      cyberpunkRawEntry({
        events: [
          {
            type: "effectTriggered",
            sourceCardId,
            effectType: "attack",
            playerId: PLAYER_SIDE_TO_ID.player,
          },
        ],
        animationScript: {
          totalDurationMs: 380,
          steps: [
            {
              id: "effect-step",
              kind: "effectTarget",
              startMs: 0,
              durationMs: 380,
              reason: "effectTargeted",
              sourceCardId,
              targets: [
                {
                  kind: "gig",
                  dieId: "gig-1" as Extract<
                    EffectTargetStep["targets"][number],
                    { kind: "gig" }
                  >["dieId"],
                },
              ],
              playerId: PLAYER_SIDE_TO_ID.player,
            },
          ],
        },
      }),
      { G: { cardIndex: {} } } as Parameters<typeof stagedEffectSourceLabelsFromEntry>[1],
    );

    expect(labels.get(sourceCardId)).toBe("ATTACK TRIGGER");
  });

  test("labels active Legend effects separately from Call a Legend reveals", () => {
    const engine = getScenario("legendQaGearTempo").build();
    const matchState = engine.getState();
    const panam = engine
      .getCardsInZone("legendArea", PLAYER_SIDE_TO_ID.player)
      .find((card) => card.definitionId === welcomeToNightCityRetailPanamPalmerNomadCavalry.id);
    if (!panam) {
      throw new Error("Expected Panam Palmer in legendQaGearTempo.");
    }

    const effect: EffectTargetStep = {
      id: "effect-step",
      kind: "effectTarget",
      startMs: 0,
      durationMs: 380,
      reason: "effectTargeted",
      sourceCardId: panam.instanceId,
      targets: [{ kind: "card", cardId: "gear-1" as EffectTargetStep["sourceCardId"] }],
      playerId: PLAYER_SIDE_TO_ID.player,
    };

    const labels = stagedEffectSourceLabelsFromEntry(
      cyberpunkRawEntry({
        animationScript: {
          totalDurationMs: 380,
          steps: [effect],
        },
      }),
      matchState,
    );

    expect(labels.get(panam.instanceId)).toBe("Legend ability");
    expect(
      cyberpunkAnimationStepToAnimationPlan(effect, {
        ...context,
        stagedEffectSourceLabels: labels,
      }),
    ).toMatchObject({
      steps: [
        {
          type: "spotlightEntity",
        },
        {
          type: "effect",
        },
      ],
    });

    const reveal: LegendRevealStep = {
      id: "reveal-step",
      kind: "legendReveal",
      startMs: 0,
      durationMs: 300,
      reason: "legendCalled",
      cardId: panam.instanceId,
      playerId: PLAYER_SIDE_TO_ID.player,
    };
    const revealPlan = cyberpunkAnimationStepToAnimationPlan(reveal, context);
    expect(revealPlan.steps[0]).toMatchObject({ label: "CALL" });
    expect(revealPlan.steps[1]).toMatchObject({ label: "CALL" });
  });
});

describe("cyberpunkAnimationStepToAnimationPlan", () => {
  test("maps turn phase changes to Motion phaseChange plans", () => {
    const step: PhaseChangeStep = {
      id: "turn-step",
      kind: "phaseChange",
      startMs: 0,
      durationMs: 1500,
      reason: "phaseChanged",
      from: "main",
      to: "start",
      playerId: PLAYER_SIDE_TO_ID.player,
      variant: "turn",
      turnPlayerId: PLAYER_SIDE_TO_ID.opponent,
      turnNumber: 2,
    };

    expect(cyberpunkAnimationStepToAnimationPlan(step, context)).toMatchObject({
      id: "turn-step",
      version: 1,
      steps: [
        {
          id: "turn-step",
          type: "phaseChange",
          from: "main",
          to: "start",
          variant: "turn",
          player: { kind: "player", id: String(PLAYER_SIDE_TO_ID.opponent) },
          turnNumber: 2,
        },
      ],
    });
  });

  test("maps card moves to Motion moveEntity plans", () => {
    const step: CardMoveStep = {
      id: "step-1",
      kind: "cardMove",
      startMs: 120,
      durationMs: 340,
      reason: "cardMoved",
      cardId: "card-1" as CardMoveStep["cardId"],
      fromZone: "hand",
      toZone: "field",
      playerId: PLAYER_SIDE_TO_ID.player,
    };

    expect(cyberpunkAnimationStepToAnimationPlan(step, context)).toMatchObject({
      id: "step-1",
      version: 1,
      steps: [
        {
          id: "step-1",
          type: "moveEntity",
          delayMs: 120,
          durationMs: 340,
          entity: { kind: "entity", id: "card-1" },
          from: { kind: "zone", id: "p-hand", ownerId: String(PLAYER_SIDE_TO_ID.player) },
          to: { kind: "zone", id: "p-field", ownerId: String(PLAYER_SIDE_TO_ID.player) },
        },
      ],
    });
  });

  test("routes pending targeted Programs through the resolving program anchor", () => {
    const step: CardMoveStep = {
      id: "step-focus",
      kind: "cardMove",
      startMs: 120,
      durationMs: 340,
      reason: "cardMoved",
      cardId: "program-1" as CardMoveStep["cardId"],
      fromZone: "hand",
      toZone: "trash",
      playerId: PLAYER_SIDE_TO_ID.player,
    };

    expect(
      cyberpunkAnimationStepToAnimationPlan(step, {
        ...context,
        pendingEffectSourceCardId: "program-1",
      }),
    ).toMatchObject({
      steps: [
        {
          type: "moveEntity",
          entity: { kind: "entity", id: "program-1" },
          from: { kind: "zone", id: "p-hand" },
          to: { kind: "anchor", id: "resolving-program:program-1" },
        },
      ],
    });
  });

  test("maps draw enters to deck-to-hand moves and other enters/exits to explicit steps", () => {
    const draw: CardEnterStep = {
      id: "draw-step",
      kind: "cardEnter",
      startMs: 80,
      durationMs: 300,
      reason: "cardsDrawn",
      cardId: "drawn-card" as CardEnterStep["cardId"],
      toZone: "hand",
      playerId: PLAYER_SIDE_TO_ID.player,
    };
    const enter: CardEnterStep = {
      id: "enter-step",
      kind: "cardEnter",
      startMs: 0,
      durationMs: 200,
      reason: "search",
      cardId: "entered-card" as CardEnterStep["cardId"],
      toZone: "trash",
      playerId: PLAYER_SIDE_TO_ID.player,
    };
    const exit: CardExitStep = {
      id: "exit-step",
      kind: "cardExit",
      startMs: 0,
      durationMs: 200,
      reason: "cardSold",
      cardId: "sold-card" as CardExitStep["cardId"],
      fromZone: "hand",
      toZone: "trash",
      playerId: PLAYER_SIDE_TO_ID.player,
      exitReason: "sold",
    };

    expect(cyberpunkAnimationStepToAnimationPlan(draw, context)).toMatchObject({
      steps: [{ type: "moveEntity", from: { id: "p-deck" }, to: { id: "p-hand" } }],
    });
    expect(cyberpunkAnimationStepToAnimationPlan(enter, context)).toMatchObject({
      steps: [{ type: "enterEntity", to: { id: "p-trash" } }],
    });
    expect(cyberpunkAnimationStepToAnimationPlan(exit, context)).toMatchObject({
      steps: [{ type: "moveEntity", from: { id: "p-hand" }, to: { id: "p-trash" } }],
    });
  });

  test("maps attach, legend reveal, card reveal, land, and targeted effects to shared Motion primitives", () => {
    const attach: CardAttachStep = {
      id: "attach-step",
      kind: "cardAttach",
      startMs: 0,
      durationMs: 300,
      reason: "cardAttached",
      gearId: "gear-1" as CardAttachStep["gearId"],
      hostId: "host-1" as CardAttachStep["hostId"],
      playerId: PLAYER_SIDE_TO_ID.player,
    };
    const reveal: LegendRevealStep = {
      id: "reveal-step",
      kind: "legendReveal",
      startMs: 0,
      durationMs: 300,
      reason: "legendCalled",
      cardId: "legend-1" as LegendRevealStep["cardId"],
      playerId: PLAYER_SIDE_TO_ID.player,
    };
    const cardReveal: CardRevealStep = {
      id: "card-reveal-step",
      kind: "cardReveal",
      startMs: 5,
      durationMs: 1600,
      reason: "cardsRevealed",
      cardId: "top-card-1" as CardRevealStep["cardId"],
      fromZone: "deck",
      toZone: "hand",
      playerId: PLAYER_SIDE_TO_ID.player,
    };
    const land: CardLandStep = {
      id: "land-step",
      kind: "cardLand",
      startMs: 10,
      durationMs: 280,
      reason: "cardPlayed",
      cardId: "program-1" as CardLandStep["cardId"],
      playerId: PLAYER_SIDE_TO_ID.player,
    };
    const effect: EffectTargetStep = {
      id: "effect-step",
      kind: "effectTarget",
      startMs: 30,
      durationMs: 380,
      reason: "effectTargeted",
      sourceCardId: "program-1" as EffectTargetStep["sourceCardId"],
      targets: [{ kind: "card", cardId: "unit-1" as EffectTargetStep["sourceCardId"] }],
      playerId: PLAYER_SIDE_TO_ID.player,
    };

    expect(cyberpunkAnimationStepToAnimationPlan(attach, context)).toMatchObject({
      steps: [
        {
          type: "moveEntity",
          entity: { kind: "entity", id: "gear-1" },
          from: { id: "p-hand" },
          to: { kind: "entity", id: "host-1" },
        },
      ],
    });
    expect(cyberpunkAnimationStepToAnimationPlan(reveal, context)).toMatchObject({
      actorId: String(PLAYER_SIDE_TO_ID.player),
      steps: [
        {
          id: "reveal-step:to-resolution",
          type: "moveEntity",
          entity: { kind: "entity", id: "legend-1" },
          from: { kind: "zone", id: "p-legendArea", ownerId: String(PLAYER_SIDE_TO_ID.player) },
          to: { kind: "anchor", id: "resolving-program:legend-1" },
          sourceFace: "hidden",
          destinationFace: "hidden",
          audioCue: "card.move",
        },
        {
          id: "reveal-step:flip",
          type: "spotlightEntity",
          entity: { kind: "entity", id: "legend-1" },
          at: { kind: "anchor", id: "resolving-program:legend-1" },
          label: "CALL",
          sourceFace: "hidden",
          destinationFace: "public",
          audioCue: "effect.trigger",
        },
        {
          id: "reveal-step:return",
          type: "moveEntity",
          entity: { kind: "entity", id: "legend-1" },
          from: { kind: "anchor", id: "resolving-program:legend-1" },
          to: { kind: "zone", id: "p-legendArea", ownerId: String(PLAYER_SIDE_TO_ID.player) },
          sourceFace: "public",
          destinationFace: "public",
          audioCue: "card.move",
        },
      ],
    });
    expect(cyberpunkAnimationStepToAnimationPlan(cardReveal, context)).toMatchObject({
      actorId: String(PLAYER_SIDE_TO_ID.player),
      steps: [
        {
          id: "card-reveal-step:to-resolution",
          type: "moveEntity",
          entity: { kind: "entity", id: "top-card-1" },
          from: { kind: "zone", id: "p-deck", ownerId: String(PLAYER_SIDE_TO_ID.player) },
          to: { kind: "anchor", id: "resolving-program:top-card-1" },
          sourceFace: "hidden",
          destinationFace: "public",
          audioCue: "card.move",
        },
        {
          id: "card-reveal-step:hold",
          type: "spotlightEntity",
          entity: { kind: "entity", id: "top-card-1" },
          at: { kind: "anchor", id: "resolving-program:top-card-1" },
          label: "REVEAL",
          sourceFace: "public",
          destinationFace: "public",
          audioCue: "effect.trigger",
        },
        {
          id: "card-reveal-step:settle",
          type: "moveEntity",
          entity: { kind: "entity", id: "top-card-1" },
          from: { kind: "anchor", id: "resolving-program:top-card-1" },
          to: { kind: "zone", id: "p-hand", ownerId: String(PLAYER_SIDE_TO_ID.player) },
          sourceFace: "public",
          destinationFace: "public",
          audioCue: "card.move",
        },
      ],
    });
    expect(
      cyberpunkAnimationStepToAnimationPlan(
        { ...cardReveal, id: "card-trash-reveal", toZone: "trash" },
        context,
      ),
    ).toMatchObject({
      steps: [
        {},
        {},
        {
          id: "card-trash-reveal:settle",
          type: "moveEntity",
          from: { kind: "anchor", id: "resolving-program:top-card-1" },
          to: { kind: "zone", id: "p-trash", ownerId: String(PLAYER_SIDE_TO_ID.player) },
          sourceFace: "public",
          destinationFace: "public",
          audioCue: "card.discard",
        },
      ],
    });
    expect(cyberpunkAnimationStepToAnimationPlan(land, context)).toMatchObject({
      steps: [{ type: "effect", source: { id: "program-1" } }],
    });
    expect(cyberpunkAnimationStepToAnimationPlan(land, context)?.steps[0]).not.toHaveProperty(
      "label",
    );
    expect(cyberpunkAnimationStepToAnimationPlan(effect, context)).toMatchObject({
      steps: [
        {
          type: "effect",
          source: { kind: "entity", id: "program-1" },
          targets: [{ kind: "entity", id: "unit-1" }],
        },
      ],
    });
    expect(cyberpunkAnimationStepToAnimationPlan(effect, context)?.steps[0]).not.toHaveProperty(
      "label",
    );
  });

  test("stages non-program effect sources in the resolving area before targeting", () => {
    const effect: EffectTargetStep = {
      id: "effect-step",
      kind: "effectTarget",
      startMs: 30,
      durationMs: 380,
      reason: "effectTargeted",
      sourceCardId: "gear-1" as EffectTargetStep["sourceCardId"],
      targets: [{ kind: "card", cardId: "unit-1" as EffectTargetStep["sourceCardId"] }],
      playerId: PLAYER_SIDE_TO_ID.player,
    };

    expect(
      cyberpunkAnimationStepToAnimationPlan(effect, {
        ...context,
        stagedEffectSourceCardIds: new Set(["gear-1"]),
      }),
    ).toMatchObject({
      actorId: String(PLAYER_SIDE_TO_ID.player),
      steps: [
        {
          id: "effect-step:source-spotlight",
          type: "spotlightEntity",
          entity: { kind: "entity", id: "gear-1" },
          at: { kind: "anchor", id: "resolving-program:gear-1" },
        },
        {
          type: "effect",
          source: { kind: "anchor", id: "resolving-program:gear-1" },
          targets: [{ kind: "entity", id: "unit-1" }],
        },
      ],
    });
  });

  test("labels staged unit play trigger sources in the resolving area before targeting", () => {
    const effect: EffectTargetStep = {
      id: "effect-step",
      kind: "effectTarget",
      startMs: 30,
      durationMs: 380,
      reason: "effectTargeted",
      sourceCardId: "unit-1" as EffectTargetStep["sourceCardId"],
      targets: [{ kind: "card", cardId: "gear-1" as EffectTargetStep["sourceCardId"] }],
      playerId: PLAYER_SIDE_TO_ID.player,
    };

    expect(
      cyberpunkAnimationStepToAnimationPlan(effect, {
        ...context,
        stagedEffectSourceLabels: new Map([["unit-1", "PLAY TRIGGER"]]),
      }),
    ).toMatchObject({
      actorId: String(PLAYER_SIDE_TO_ID.player),
      steps: [
        {
          id: "effect-step:source-spotlight",
          type: "spotlightEntity",
          entity: { kind: "entity", id: "unit-1" },
          at: { kind: "anchor", id: "resolving-program:unit-1" },
        },
        {
          type: "effect",
          source: { kind: "anchor", id: "resolving-program:unit-1" },
          targets: [{ kind: "entity", id: "gear-1" }],
        },
      ],
    });
  });

  test("maps gig value changes to anchored resource deltas with before and after values", () => {
    const step: ResourceFloatStep = {
      id: "gig-delta",
      kind: "resourceFloat",
      startMs: 20,
      durationMs: 700,
      reason: "gigValueChanged",
      resource: "gig",
      playerId: PLAYER_SIDE_TO_ID.player,
      delta: -2,
      dieId: "gig-1" as ResourceFloatStep["dieId"],
      previousValue: 10,
      newValue: 8,
    };

    expect(cyberpunkAnimationStepToAnimationPlan(step, context)).toMatchObject({
      steps: [
        {
          type: "resourceDelta",
          anchor: { kind: "entity", id: "gig-1" },
          delta: -2,
          fromValue: 10,
          toValue: 8,
        },
      ],
    });
  });

  test("omits generic resolved result labels for Gig-targeted effects", () => {
    const effect: EffectTargetStep = {
      id: "adjust-gig-target",
      kind: "effectTarget",
      startMs: 0,
      durationMs: 360,
      reason: "effectTargeted",
      sourceCardId: "program-1" as EffectTargetStep["sourceCardId"],
      targets: [
        {
          kind: "gig",
          dieId: "gig-1" as Extract<EffectTargetStep["targets"][number], { kind: "gig" }>["dieId"],
        },
      ],
      playerId: PLAYER_SIDE_TO_ID.player,
    };

    expect(cyberpunkAnimationStepToAnimationPlan(effect, context)).toMatchObject({
      steps: [
        {
          type: "effect",
          source: { kind: "entity", id: "program-1" },
          targets: [{ kind: "entity", id: "gig-1" }],
        },
      ],
    });
    expect(cyberpunkAnimationStepToAnimationPlan(effect, context)?.steps[0]).not.toHaveProperty(
      "label",
    );
  });

  test("marks every script step as shared Motion-supported", () => {
    const land: CardLandStep = {
      id: "land-step",
      kind: "cardLand",
      startMs: 0,
      durationMs: 240,
      reason: "cardPlayed",
      cardId: "program-1" as CardLandStep["cardId"],
      playerId: PLAYER_SIDE_TO_ID.player,
    };

    expect(isCyberpunkAnimationStepSharedSupported(land)).toBe(true);
  });

  test("maps direct attack and stolen Gig steps with combat and steal cues", () => {
    const declared: CombatStep = {
      id: "attack-declared",
      kind: "combat",
      startMs: 0,
      durationMs: 360,
      reason: "attackDeclared",
      attackerId: "kusanagi" as CombatStep["attackerId"],
      attackKind: "direct",
      playerId: PLAYER_SIDE_TO_ID.player,
    };
    const resolved: CombatStep = {
      id: "attack-resolved",
      kind: "combat",
      startMs: 360,
      durationMs: 280,
      reason: "attackResolved",
      attackerId: "kusanagi" as CombatStep["attackerId"],
      attackKind: "direct",
      gigsStolen: 2,
      playerId: PLAYER_SIDE_TO_ID.player,
    };
    const stolen: GigMoveStep = {
      id: "steal-d6",
      kind: "gigMove",
      startMs: 640,
      durationMs: 420,
      reason: "gigStolen",
      dieId: "gig-d6" as GigMoveStep["dieId"],
      from: "gigArea",
      to: "gigArea",
      fromPlayerId: PLAYER_SIDE_TO_ID.opponent,
      toPlayerId: PLAYER_SIDE_TO_ID.player,
      moveKind: "steal",
      playerId: PLAYER_SIDE_TO_ID.player,
    };

    const plans = cyberpunkAnimationScriptToAnimationPlans(
      { steps: [declared, resolved, stolen], totalDurationMs: 1_060 },
      { ...context, idPrefix: "entry-1" },
    );

    expect(plans).toMatchObject([
      {
        id: "entry-1:attack-declared",
        steps: [
          {
            id: "attack-declared",
            type: "combat",
            reason: "declared",
            attackKind: "direct",
            source: { kind: "entity", id: "kusanagi" },
            target: { kind: "anchor", id: "opp-street-cred" },
            audioCue: "combat.start",
          },
        ],
      },
      {
        id: "entry-1:attack-resolved",
        steps: [
          {
            id: "attack-resolved",
            type: "combat",
            reason: "resolved",
            attackKind: "direct",
            source: { kind: "entity", id: "kusanagi" },
            target: { kind: "anchor", id: "opp-street-cred" },
            audioCue: "combat.hit",
          },
        ],
      },
      {
        id: "entry-1:steal-d6",
        steps: [
          {
            id: "steal-d6",
            type: "moveEntity",
            durationMs: 420,
            entity: { kind: "entity", id: "gig-d6" },
            from: { kind: "zone", id: "opp-gigArea", ownerId: String(PLAYER_SIDE_TO_ID.opponent) },
            to: { kind: "zone", id: "p-gigArea", ownerId: String(PLAYER_SIDE_TO_ID.player) },
            audioCue: "resource.steal",
          },
        ],
      },
    ]);
    expect(plans[2]?.steps[0]).not.toHaveProperty("label");
  });

  test("maps gained Gigs as plain fixer-to-Gig moves", () => {
    const gained: GigMoveStep = {
      id: "gain-d8",
      kind: "gigMove",
      startMs: 0,
      durationMs: 420,
      reason: "gigDieMoved",
      dieId: "gig-d8" as GigMoveStep["dieId"],
      from: "fixerArea",
      to: "gigArea",
      fromPlayerId: PLAYER_SIDE_TO_ID.player,
      toPlayerId: PLAYER_SIDE_TO_ID.player,
      moveKind: "gain",
      playerId: PLAYER_SIDE_TO_ID.player,
    };

    const plan = cyberpunkAnimationStepToAnimationPlan(gained, context);

    expect(plan).toMatchObject({
      steps: [
        {
          id: "gain-d8",
          type: "moveEntity",
          durationMs: 420,
          entity: { kind: "entity", id: "gig-d8" },
          from: { kind: "zone", id: "p-fixer", ownerId: String(PLAYER_SIDE_TO_ID.player) },
          to: { kind: "zone", id: "p-gigArea", ownerId: String(PLAYER_SIDE_TO_ID.player) },
          audioCue: "card.move",
        },
      ],
    });
    expect(plan?.steps[0]).not.toHaveProperty("label");
  });

  test("keeps gain-Gig scripts to the die movement only", () => {
    const gained: GigMoveStep = {
      id: "gain-d12",
      kind: "gigMove",
      startMs: 0,
      durationMs: 420,
      reason: "gigDieMoved",
      dieId: "gig-d12" as GigMoveStep["dieId"],
      from: "fixerArea",
      to: "gigArea",
      fromPlayerId: PLAYER_SIDE_TO_ID.player,
      toPlayerId: PLAYER_SIDE_TO_ID.player,
      moveKind: "gain",
      playerId: PLAYER_SIDE_TO_ID.player,
    };
    const phase: PhaseChangeStep = {
      id: "start-to-main",
      kind: "phaseChange",
      startMs: 420,
      durationMs: 500,
      reason: "phaseChanged",
      from: "start",
      to: "main",
      playerId: PLAYER_SIDE_TO_ID.player,
    };

    const plans = cyberpunkAnimationScriptToAnimationPlans(
      { steps: [gained, phase], totalDurationMs: 920 },
      { ...context, idPrefix: "entry-gain" },
    );

    expect(plans).toMatchObject([
      {
        id: "entry-gain:gain-d12",
        steps: [
          {
            id: "gain-d12",
            type: "moveEntity",
            entity: { kind: "entity", id: "gig-d12" },
            from: { kind: "zone", id: "p-fixer", ownerId: String(PLAYER_SIDE_TO_ID.player) },
            to: { kind: "zone", id: "p-gigArea", ownerId: String(PLAYER_SIDE_TO_ID.player) },
          },
        ],
      },
    ]);
    expect(plans).toHaveLength(1);
    expect(plans.flatMap((plan) => plan.steps).map((step) => step.type)).toEqual(["moveEntity"]);
  });

  test("maps blocker redirects as blocked combat cues", () => {
    const redirect: CombatRedirectStep = {
      id: "blocker-redirect",
      kind: "combatRedirect",
      startMs: 0,
      durationMs: 360,
      reason: "blockerActivated",
      attackerId: "kusanagi" as CombatRedirectStep["attackerId"],
      blockerId: "corpo-security" as CombatRedirectStep["blockerId"],
      originalTargetId: null,
      playerId: PLAYER_SIDE_TO_ID.opponent,
    };

    const plans = cyberpunkAnimationScriptToAnimationPlans(
      { steps: [redirect], totalDurationMs: 360 },
      { ...context, idPrefix: "entry-2" },
    );

    expect(plans).toMatchObject([
      {
        id: "entry-2:blocker-redirect",
        steps: [
          {
            id: "blocker-redirect",
            type: "combat",
            durationMs: 900,
            reason: "blocked",
            attackKind: "fight",
            source: { kind: "entity", id: "corpo-security" },
            target: { kind: "entity", id: "kusanagi" },
            audioCue: "effect.trigger",
          },
        ],
      },
    ]);
  });
});

function cyberpunkRawEntry(
  overrides: Partial<Parameters<typeof cyberpunkImmediateSystemAudioCues>[0]>,
): Parameters<typeof cyberpunkImmediateSystemAudioCues>[0] {
  return {
    id: 1,
    timestamp: 0,
    side: "system",
    move: "test",
    input: {},
    stateID: 1,
    moveLogs: [],
    events: [],
    animationScript: { steps: [], totalDurationMs: 0 },
    ...overrides,
  };
}

describe("cyberpunkAnimationScriptToAnimationPlans", () => {
  test("preserves entry prefixes", () => {
    const step: CardMoveStep = {
      id: "step-8",
      kind: "cardMove",
      startMs: 0,
      durationMs: 300,
      reason: "cardMoved",
      cardId: "card-8" as CardMoveStep["cardId"],
      fromZone: "hand",
      toZone: "trash",
      playerId: PLAYER_SIDE_TO_ID.player,
    };

    const plans = cyberpunkAnimationScriptToAnimationPlans(
      { steps: [step], totalDurationMs: 300 },
      { ...context, idPrefix: "entry-1" },
    );

    expect(plans).toHaveLength(1);
    expect(plans[0]?.id).toBe("entry-1:step-8");
  });

  test("labels defeated targeted effects and delays target cleanup transfers", () => {
    const effect: EffectTargetStep = {
      id: "step-target",
      kind: "effectTarget",
      startMs: 0,
      durationMs: 380,
      reason: "effectTargeted",
      sourceCardId: "program-1" as EffectTargetStep["sourceCardId"],
      targets: [{ kind: "card", cardId: "unit-1" as EffectTargetStep["sourceCardId"] }],
      playerId: PLAYER_SIDE_TO_ID.player,
    };
    const defeated: CardExitStep = {
      id: "step-defeated",
      kind: "cardExit",
      startMs: 380,
      durationMs: 300,
      reason: "cardDefeated",
      cardId: "unit-1" as CardExitStep["cardId"],
      fromZone: "field",
      toZone: "trash",
      playerId: PLAYER_SIDE_TO_ID.player,
      exitReason: "defeated",
    };

    const plans = cyberpunkAnimationScriptToAnimationPlans(
      { steps: [effect, defeated], totalDurationMs: 680 },
      { ...context, resultHoldMs: 1_200 },
    );

    expect(plans).toHaveLength(2);
    expect(plans[0]).toMatchObject({
      steps: [{ type: "effect", durationMs: 1_580 }],
    });
    expect(plans[0]?.steps[0]).not.toHaveProperty("label");
    expect(plans[1]).toMatchObject({
      steps: [
        {
          type: "moveEntity",
          delayMs: 1_580,
          from: { id: "p-field" },
          to: { id: "p-trash" },
        },
      ],
    });
  });

  test("pairs overlapping target cleanup with the result beat before moving cards", () => {
    const effect: EffectTargetStep = {
      id: "step-target",
      kind: "effectTarget",
      startMs: 300,
      durationMs: 380,
      reason: "effectTargeted",
      sourceCardId: "program-1" as EffectTargetStep["sourceCardId"],
      targets: [{ kind: "card", cardId: "unit-1" as EffectTargetStep["sourceCardId"] }],
      playerId: PLAYER_SIDE_TO_ID.player,
    };
    const defeated: CardExitStep = {
      id: "step-defeated",
      kind: "cardExit",
      startMs: 300,
      durationMs: 300,
      reason: "cardDefeated",
      cardId: "unit-1" as CardExitStep["cardId"],
      fromZone: "field",
      toZone: "trash",
      playerId: PLAYER_SIDE_TO_ID.opponent,
      exitReason: "defeated",
    };

    const plans = cyberpunkAnimationScriptToAnimationPlans(
      { steps: [effect, defeated], totalDurationMs: 680 },
      { ...context, resultHoldMs: 1_200 },
    );

    expect(plans[0]).toMatchObject({
      steps: [{ type: "effect", targets: [{ id: "unit-1" }] }],
    });
    expect(plans[0]?.steps[0]).not.toHaveProperty("label");
    expect(plans[1]).toMatchObject({
      steps: [
        {
          type: "moveEntity",
          delayMs: 1_880,
          from: { id: "opp-field" },
          to: { id: "opp-trash" },
        },
      ],
    });
  });

  test("settles a resolving Program source into trash after the final result beat", () => {
    const effect: EffectTargetStep = {
      id: "step-target",
      kind: "effectTarget",
      startMs: 0,
      durationMs: 380,
      reason: "effectTargeted",
      sourceCardId: "program-1" as EffectTargetStep["sourceCardId"],
      targets: [{ kind: "card", cardId: "unit-1" as EffectTargetStep["sourceCardId"] }],
      playerId: PLAYER_SIDE_TO_ID.player,
    };
    const defeated: CardExitStep = {
      id: "step-defeated",
      kind: "cardExit",
      startMs: 380,
      durationMs: 300,
      reason: "cardDefeated",
      cardId: "unit-1" as CardExitStep["cardId"],
      fromZone: "field",
      toZone: "trash",
      playerId: PLAYER_SIDE_TO_ID.opponent,
      exitReason: "defeated",
    };

    const plans = cyberpunkAnimationScriptToAnimationPlans(
      { steps: [effect, defeated], totalDurationMs: 680 },
      {
        ...context,
        resolvingProgramSourceCardId: "program-1",
        resultHoldMs: 1_200,
      },
    );

    expect(plans).toHaveLength(3);
    expect(plans[0]).toMatchObject({
      steps: [
        {
          type: "effect",
          source: { kind: "anchor", id: "resolving-program:program-1" },
          durationMs: 1_580,
        },
      ],
    });
    expect(plans[0]?.steps[0]).not.toHaveProperty("label");
    expect(plans[1]).toMatchObject({
      steps: [
        {
          type: "moveEntity",
          entity: { kind: "entity", id: "unit-1" },
          from: { id: "opp-field" },
          to: { id: "opp-trash" },
          delayMs: 1_580,
        },
      ],
    });
    expect(plans[2]).toMatchObject({
      id: "step-target:source-cleanup",
      steps: [
        {
          id: "step-target:source-cleanup",
          type: "moveEntity",
          entity: { kind: "entity", id: "program-1" },
          from: { kind: "anchor", id: "resolving-program:program-1" },
          to: { kind: "zone", id: "p-trash" },
          delayMs: 1_580,
          durationMs: 420,
        },
      ],
    });
  });

  test("keeps a multi-step resolving Program in limbo while another target choice remains", () => {
    const effect: EffectTargetStep = {
      id: "step-target",
      kind: "effectTarget",
      startMs: 0,
      durationMs: 380,
      reason: "effectTargeted",
      sourceCardId: "program-1" as EffectTargetStep["sourceCardId"],
      targets: [{ kind: "card", cardId: "unit-1" as EffectTargetStep["sourceCardId"] }],
      playerId: PLAYER_SIDE_TO_ID.player,
    };

    const plans = cyberpunkAnimationScriptToAnimationPlans(
      { steps: [effect], totalDurationMs: 380 },
      {
        ...context,
        pendingEffectSourceCardId: "program-1",
        resolvingProgramSourceCardId: "program-1",
        resultHoldMs: 1_200,
      },
    );

    expect(plans).toHaveLength(1);
    expect(plans[0]).toMatchObject({
      steps: [
        {
          type: "effect",
          source: { kind: "anchor", id: "resolving-program:program-1" },
        },
      ],
    });
  });
});
