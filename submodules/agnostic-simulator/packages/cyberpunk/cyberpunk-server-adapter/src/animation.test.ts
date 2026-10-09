import { describe, expect, it } from "vite-plus/test";
import type { AnimationScript, MatchState } from "@tcg/cyberpunk-engine";
import { AnimationPlanV2Schema, type AnimationPlanV2, type AnimationStepV2 } from "@tcg/protocol";

import { cyberpunkAnimationPlan, projectCyberpunkAuthoritativeAnimationPlan } from "./animation";

const P1 = "p1";
const P2 = "p2";

const representativeScripts: Record<string, AnimationScript> = {
  playToField: {
    totalDurationMs: 240,
    steps: [
      {
        id: "play",
        kind: "cardMove",
        startMs: 0,
        durationMs: 240,
        reason: "cardMoved",
        cardId: "unit-1",
        fromZone: "hand",
        toZone: "field",
        playerId: P1,
      },
    ],
  } as AnimationScript,
  programToResolving: {
    totalDurationMs: 240,
    steps: [
      {
        id: "program-play",
        kind: "cardMove",
        startMs: 0,
        durationMs: 240,
        reason: "cardMoved",
        cardId: "program-1",
        fromZone: "hand",
        toZone: "trash",
        playerId: P1,
        presentation: "resolving-effect",
      },
    ],
  } as AnimationScript,
  targetedProgram: {
    totalDurationMs: 1_240,
    steps: [
      {
        id: "program-effect",
        kind: "effectTarget",
        startMs: 0,
        durationMs: 1_240,
        reason: "effectTargeted",
        sourceCardId: "program-1",
        targets: [{ kind: "card", cardId: "unit-2" }],
        playerId: P1,
        presentation: "source-card",
        sourceExit: { zone: "trash", playerId: P1 },
        label: "Defeat",
        tone: "negative",
      },
    ],
  } as AnimationScript,
  draw: {
    totalDurationMs: 280,
    steps: [
      {
        id: "draw",
        kind: "cardEnter",
        startMs: 0,
        durationMs: 280,
        reason: "cardsDrawn",
        cardId: "card-d",
        toZone: "hand",
        playerId: P1,
      },
    ],
  } as AnimationScript,
  detachGearToTrash: {
    totalDurationMs: 240,
    steps: [
      {
        id: "detach",
        kind: "cardMove",
        startMs: 0,
        durationMs: 240,
        reason: "cardMoved",
        cardId: "gear-1",
        fromZone: "field",
        toZone: "trash",
        playerId: P1,
        fromHostId: "host-1",
      },
    ],
  } as AnimationScript,
  attach: {
    totalDurationMs: 320,
    steps: [
      {
        id: "attach",
        kind: "cardAttach",
        startMs: 0,
        durationMs: 320,
        reason: "cardAttached",
        gearId: "gear-1",
        hostId: "host-1",
        playerId: P1,
      },
    ],
  } as AnimationScript,
  gigGainAndTurn: {
    totalDurationMs: 1860,
    steps: [
      {
        id: "gain",
        kind: "gigMove",
        startMs: 0,
        durationMs: 360,
        reason: "gigDieMoved",
        dieId: "d6-1",
        from: "fixerArea",
        to: "gigArea",
        fromPlayerId: P1,
        toPlayerId: P1,
        moveKind: "gain",
      },
      {
        id: "turn",
        kind: "phaseChange",
        startMs: 360,
        durationMs: 1500,
        reason: "phaseChanged",
        from: "main",
        to: "start",
        playerId: P1,
        variant: "turn",
        turnPlayerId: P2,
        turnNumber: 2,
      },
    ],
  } as AnimationScript,
  spend: {
    totalDurationMs: 420,
    steps: [
      {
        id: "spend",
        kind: "entityStateChange",
        startMs: 0,
        durationMs: 420,
        reason: "cardSpent",
        cardId: "unit-1",
        playerId: P1,
        change: "spent",
      },
    ],
  } as AnimationScript,
  callLegend: {
    totalDurationMs: 460,
    steps: [
      {
        id: "legend",
        kind: "legendReveal",
        startMs: 0,
        durationMs: 460,
        reason: "legendCalled",
        cardId: "legend-1",
        playerId: P1,
        fromRotationDeg: 0,
        toRotationDeg: 0,
      },
    ],
  } as AnimationScript,
  revealWithDestination: {
    totalDurationMs: 1600,
    steps: [
      {
        id: "reveal",
        kind: "cardReveal",
        audience: "public",
        viewerId: P1,
        startMs: 0,
        durationMs: 1600,
        reason: "cardsRevealed",
        cardId: "top-1",
        fromZone: "deck",
        toZone: "hand",
        ownerId: P1,
      },
    ],
  } as AnimationScript,
  revealWithoutDestination: {
    totalDurationMs: 1600,
    steps: [
      {
        id: "reveal",
        kind: "cardReveal",
        audience: "public",
        viewerId: P1,
        startMs: 0,
        durationMs: 1600,
        reason: "cardsRevealed",
        cardId: "top-1",
        fromZone: "deck",
        ownerId: P1,
      },
    ],
  } as AnimationScript,
  combatAndRedirect: {
    totalDurationMs: 720,
    steps: [
      {
        id: "combat",
        kind: "combat",
        startMs: 0,
        durationMs: 360,
        reason: "attackDeclared",
        attackerId: "atk",
        defenderId: "def",
        rivalId: P2,
        attackKind: "fight",
        playerId: P1,
      },
      {
        id: "redirect",
        kind: "combatRedirect",
        startMs: 360,
        durationMs: 360,
        reason: "blockerActivated",
        attackerId: "atk",
        blockerId: "blocker",
        originalTargetId: "def",
        playerId: P2,
      },
    ],
  } as AnimationScript,
  resolvedFight: {
    totalDurationMs: 280,
    steps: [
      {
        id: "fight-impact",
        kind: "combat",
        startMs: 0,
        durationMs: 280,
        reason: "attackResolved",
        attackerId: "atk",
        defenderId: "def",
        rivalId: P2,
        attackKind: "fight",
        playerId: P1,
      },
    ],
  } as AnimationScript,
  directImpact: {
    totalDurationMs: 800,
    steps: [
      {
        id: "direct-impact",
        kind: "combat",
        startMs: 0,
        durationMs: 800,
        reason: "attackResolved",
        attackerId: "atk",
        defenderId: null,
        rivalId: P2,
        attackKind: "direct",
        playerId: P1,
      },
    ],
  } as AnimationScript,
  handConfirm: {
    totalDurationMs: 800,
    steps: [
      {
        id: "hand-confirm",
        kind: "actionEmphasis",
        startMs: 0,
        durationMs: 800,
        reason: "keepHand",
        target: { kind: "zone", zone: "hand", playerId: P1 },
        tone: "positive",
      },
    ],
  } as AnimationScript,
  eddieSpend: {
    totalDurationMs: 700,
    steps: [
      {
        id: "eddies",
        kind: "resourceFloat",
        startMs: 0,
        durationMs: 700,
        reason: "eddiesSpent",
        resource: "eddies",
        playerId: P1,
        delta: -3,
      },
    ],
  } as AnimationScript,
};

function serializedShape(plan: AnimationPlanV2 | null) {
  return (plan?.steps ?? []).map((step) => stepShape(step));
}

function stepShape(step: AnimationStepV2) {
  if (step.type === "entityTransfer") {
    return {
      type: step.type,
      entity: step.entity.id,
      fromKind: step.from?.kind ?? null,
      toKind: step.to?.kind ?? null,
    };
  }
  if (step.type === "entityStateChange") {
    return { type: step.type, entity: step.entity.id, change: step.change };
  }
  if (step.type === "valueDelta") {
    return { type: step.type, subjectKind: step.subject.kind, subjectId: step.subject.kind };
  }
  if (step.type === "phaseChange") {
    return { type: step.type, variant: step.variant };
  }
  return { type: step.type };
}

describe("cyberpunkAnimationPlan", () => {
  it("maps legend and deck shuffles onto their rendered rows", () => {
    const script = {
      totalDurationMs: 720,
      steps: [
        {
          id: "shuffle-p1",
          kind: "randomization" as const,
          startMs: 0,
          durationMs: 720,
          reason: "legendsShuffled",
          playerId: P1,
          randomization: "shuffle" as const,
          zone: "legendArea" as const,
        },
        {
          id: "shuffle-p2",
          kind: "randomization" as const,
          startMs: 0,
          durationMs: 720,
          reason: "legendsShuffled",
          playerId: P2,
          randomization: "shuffle" as const,
          zone: "legendArea" as const,
        },
        {
          id: "deck-p1",
          kind: "randomization" as const,
          startMs: 0,
          durationMs: 720,
          reason: "deckShuffled",
          playerId: P1,
          randomization: "shuffle" as const,
          zone: "deck" as const,
        },
      ],
    } as AnimationScript;
    const plan = cyberpunkAnimationPlan("legend-shuffle", script)!;
    expect(plan.steps).toMatchObject([
      {
        type: "randomization",
        kind: "shuffle",
        at: { kind: "zone", id: "legendArea", ownerId: P1 },
        audioCue: "deck.shuffle",
      },
      {
        type: "randomization",
        kind: "shuffle",
        at: { kind: "zone", id: "legendArea", ownerId: P2 },
      },
      {
        type: "randomization",
        kind: "shuffle",
        at: { kind: "zone", id: "deck", ownerId: P1 },
      },
    ]);
    const projected = projectCyberpunkAuthoritativeAnimationPlan(plan, P1);
    expect(projected.steps).toMatchObject([
      { at: { kind: "zone", id: "p-legendArea", ownerId: P1 } },
      { at: { kind: "zone", id: "opp-legendArea", ownerId: P2 } },
      { at: { kind: "zone", id: "p-deck", ownerId: P1 } },
    ]);
    expect(projectCyberpunkAuthoritativeAnimationPlan(plan, P2).steps).toMatchObject([
      { at: { kind: "zone", id: "opp-legendArea", ownerId: P1 } },
      { at: { kind: "zone", id: "p-legendArea", ownerId: P2 } },
      { at: { kind: "zone", id: "opp-deck", ownerId: P1 } },
    ]);
  });

  it("maps gig die value changes onto a value delta aimed at the die entity", () => {
    const script = {
      totalDurationMs: 420,
      steps: [
        {
          id: "gig-adjust",
          kind: "resourceFloat" as const,
          startMs: 0,
          durationMs: 420,
          reason: "gigValueChanged",
          resource: "gig" as const,
          playerId: P1,
          delta: 3,
          dieId: "gd_die-1",
          previousValue: 5,
          newValue: 8,
        },
      ],
    } as AnimationScript;
    const plan = cyberpunkAnimationPlan("gig-adjust", script)!;
    expect(plan.steps).toMatchObject([
      {
        type: "valueDelta",
        subject: { kind: "entity", id: "gd_die-1" },
        delta: 3,
        fromValue: 5,
        toValue: 8,
        label: "GIG",
      },
    ]);
    // The subject survives viewer projection so the client can anchor the
    // pulse on the die's rendered node.
    const projected = projectCyberpunkAuthoritativeAnimationPlan(plan, P1);
    expect(projected.steps).toMatchObject([{ subject: { kind: "entity", id: "gd_die-1" } }]);
  });

  it("moves a targeted Program through the resolving stage and into its final trash", () => {
    expect(
      cyberpunkAnimationPlan("program-play", representativeScripts.programToResolving)?.steps,
    ).toMatchObject([
      {
        type: "entityTransfer",
        entity: { kind: "entity", id: "program-1" },
        from: { kind: "zone", id: "hand", ownerId: P1 },
        to: { kind: "anchor", id: "resolving-program:program-1" },
        destinationFace: "public",
      },
    ]);

    const effect = projectCyberpunkAuthoritativeAnimationPlan(
      cyberpunkAnimationPlan("program-effect", representativeScripts.targetedProgram)!,
      P1,
    );
    expect(effect.steps).toMatchObject([
      {
        type: "effect",
        source: { kind: "entity", id: "program-1" },
        targets: [{ kind: "entity", id: "unit-2" }],
        presentation: "source-card",
        showText: false,
        sourceFace: "public",
        sourceExitTo: { kind: "zone", id: "p-trash", ownerId: P1 },
        label: "Defeat",
        tone: "negative",
      },
    ]);
  });

  it("targets from the visible resolving Program and leaves the stage after resolution", () => {
    const script = {
      totalDurationMs: 2_040,
      steps: [
        {
          id: "effect",
          kind: "effectTarget",
          startMs: 0,
          durationMs: 1_240,
          reason: "effectTargeted",
          sourceCardId: "program-1",
          targets: [{ kind: "card", cardId: "unit-2" }],
          playerId: P1,
          presentation: "resolving-program",
        },
        {
          id: "finish",
          kind: "cardMove",
          startMs: 1_240,
          durationMs: 800,
          reason: "programResolutionCompleted",
          cardId: "program-1",
          fromZone: "trash",
          toZone: "trash",
          playerId: P1,
          presentation: "resolved-effect",
        },
      ],
    } as AnimationScript;
    const plan = projectCyberpunkAuthoritativeAnimationPlan(
      cyberpunkAnimationPlan("continuing-program", script)!,
      P1,
    );
    expect(AnimationPlanV2Schema.parse(plan)).toEqual(plan);
    expect(plan.steps).toMatchObject([
      {
        type: "effect",
        source: { kind: "anchor", id: "resolving-program:program-1" },
        targets: [{ kind: "entity", id: "unit-2" }],
      },
      {
        type: "entityTransfer",
        entity: { id: "program-1" },
        from: { kind: "anchor", id: "resolving-program:program-1" },
        to: { kind: "zone", id: "p-trash" },
      },
    ]);
  });

  it("puts scry cards under the deck with their identity hidden", () => {
    const script = {
      totalDurationMs: 1_600,
      steps: [
        {
          id: "reorder",
          kind: "cardMove",
          startMs: 0,
          durationMs: 800,
          reason: "cardMoved",
          cardId: "deck-1",
          fromZone: "deck",
          toZone: "deck",
          deckPlacement: "bottom",
          playerId: P1,
        },
        {
          id: "revealed-reorder",
          kind: "cardReveal",
          startMs: 800,
          durationMs: 800,
          reason: "cardsRevealed",
          cardId: "deck-2",
          fromZone: "deck",
          toZone: "deck",
          deckPlacement: "bottom",
          audience: "public",
          viewerId: P1,
          ownerId: P1,
        },
      ],
    } as AnimationScript;
    const plan = projectCyberpunkAuthoritativeAnimationPlan(
      cyberpunkAnimationPlan("scry-bottom", script)!,
      P1,
    );
    expect(plan.steps).toMatchObject([
      { type: "entityTransfer", destinationFace: "hidden", destinationPresentation: "underlay" },
      { type: "entityTransfer", destinationFace: "hidden", destinationPresentation: "underlay" },
    ]);
  });

  it("does not claim a fight loser survives before defeat is resolved", () => {
    const script = {
      totalDurationMs: 1_600,
      steps: [
        {
          id: "fight",
          kind: "combat",
          startMs: 0,
          durationMs: 1_600,
          reason: "attackResolved",
          attackerId: "attacker",
          defenderId: "defender",
          rivalId: P2,
          attackKind: "fight",
          result: "attackerWins",
          defeatedCardIds: [],
          playerId: P1,
        },
      ],
    } as AnimationScript;
    const plan = cyberpunkAnimationPlan("fight-pending-defeat", script);
    expect(plan?.steps).toMatchObject([
      { type: "combat", sourceStatus: "WINS FIGHT", targetStatus: "LOSES FIGHT" },
    ]);
  });

  it("holds a defeated card at its source until a delayed exit beat starts", () => {
    const script = {
      totalDurationMs: 2_400,
      steps: [
        {
          id: "exit",
          kind: "cardExit",
          startMs: 2_400,
          durationMs: 800,
          reason: "attackResolved",
          cardId: "attacker",
          fromZone: "field",
          toZone: "trash",
          playerId: P1,
          exitReason: "defeated",
        },
      ],
    } as AnimationScript;
    const plan = cyberpunkAnimationPlan("blocked-defeat-exit", script);
    const projected = projectCyberpunkAuthoritativeAnimationPlan(plan!, P1);
    expect(projected.steps).toMatchObject([
      {
        type: "entityTransfer",
        entity: { id: "attacker" },
        from: { kind: "zone", id: "p-field", ownerId: P1 },
        to: { kind: "zone", id: "p-trash", ownerId: P1 },
        sourcePresentation: "hold",
      },
    ]);
  });

  it("pulses the seated player's hand when they keep it", () => {
    const plan = cyberpunkAnimationPlan("hand-confirm", representativeScripts.handConfirm)!;
    expect(plan.steps).toMatchObject([
      {
        type: "emphasize",
        at: { kind: "zone", id: "hand", ownerId: P1 },
        style: "pulse",
        durationMs: 800,
      },
    ]);
    expect(projectCyberpunkAuthoritativeAnimationPlan(plan, P1).steps).toMatchObject([
      { at: { kind: "zone", id: "p-hand", ownerId: P1 } },
    ]);
  });

  it("maps play, draw, attach, gig+turn, spend, Call Legend, reveals, combat, and eddie spend", () => {
    const play = cyberpunkAnimationPlan("play", representativeScripts.playToField);
    expect(AnimationPlanV2Schema.parse(play)).toEqual(play);
    expect(play?.steps).toMatchObject([
      {
        type: "entityTransfer",
        entity: { id: "unit-1" },
        from: { kind: "zone", id: "hand", ownerId: P1 },
        to: { kind: "zone", id: "field", ownerId: P1 },
      },
    ]);

    expect(cyberpunkAnimationPlan("draw", representativeScripts.draw)?.steps).toMatchObject([
      {
        type: "entityTransfer",
        entity: { id: "card-d" },
        from: { kind: "zone", id: "deck" },
        to: { kind: "zone", id: "hand" },
      },
    ]);

    expect(cyberpunkAnimationPlan("attach", representativeScripts.attach)?.steps).toMatchObject([
      {
        type: "entityTransfer",
        entity: { id: "gear-1" },
        from: { kind: "zone", id: "hand" },
        to: { kind: "entity", id: "host-1" },
        // The host unit must stay visible while the gear clone flies onto it.
        destinationPresentation: "overlay",
      },
    ]);

    expect(
      cyberpunkAnimationPlan("detach", representativeScripts.detachGearToTrash)?.steps,
    ).toMatchObject([
      {
        type: "entityTransfer",
        entity: { id: "gear-1" },
        from: { kind: "entity", id: "gear-1" },
        to: { kind: "zone", id: "trash" },
        sourceFace: "public",
        destinationFace: "public",
      },
    ]);

    const gigTurn = cyberpunkAnimationPlan("gig-turn", representativeScripts.gigGainAndTurn);
    expect(gigTurn?.steps.map((step) => step.type)).toEqual(["entityTransfer", "phaseChange"]);
    expect(gigTurn?.steps[1]).toMatchObject({ type: "phaseChange", variant: "turn" });

    expect(cyberpunkAnimationPlan("spend", representativeScripts.spend)?.steps).toMatchObject([
      {
        type: "entityStateChange",
        change: "orientation",
        fromRotationDeg: 0,
        toRotationDeg: 90,
      },
    ]);

    const legend = cyberpunkAnimationPlan("legend", representativeScripts.callLegend);
    expect(legend?.steps).toMatchObject([
      {
        type: "entityStateChange",
        change: "face",
        entity: { id: "legend-1" },
        sourceFace: "hidden",
        destinationFace: "public",
        fromRotationDeg: 0,
        toRotationDeg: 0,
      },
    ]);
    expect(JSON.stringify(legend)).not.toContain("resolving-program");
    expect(legend?.steps.some((step) => step.type === "hold")).toBe(false);

    expect(
      cyberpunkAnimationPlan("reveal", representativeScripts.revealWithDestination)?.steps,
    ).toMatchObject([
      {
        type: "entityTransfer",
        entity: { id: "top-1" },
        from: { kind: "zone", id: "deck" },
        to: { kind: "zone", id: "hand" },
      },
    ]);
    expect(
      cyberpunkAnimationPlan("bare-reveal", representativeScripts.revealWithoutDestination)?.steps,
    ).toMatchObject([
      {
        type: "emphasize",
        at: { kind: "zone", id: "deck" },
        style: "spotlight",
        durationMs: 1600,
      },
    ]);

    expect(
      cyberpunkAnimationPlan("combat", representativeScripts.combatAndRedirect)?.steps,
    ).toMatchObject([
      {
        type: "combat",
        source: { kind: "entity", id: "atk" },
        target: { kind: "entity", id: "def" },
        reason: "declared",
        showText: true,
      },
      {
        type: "combat",
        source: { kind: "entity", id: "atk" },
        target: { kind: "entity", id: "blocker" },
        reason: "blocked",
        showText: true,
      },
    ]);
    expect(
      cyberpunkAnimationPlan("fight-impact", representativeScripts.resolvedFight)?.steps,
    ).toMatchObject([
      {
        type: "combat",
        source: { kind: "entity", id: "atk" },
        target: { kind: "entity", id: "def" },
        reason: "resolved",
        attackKind: "fight",
        showText: true,
      },
    ]);
    const direct = projectCyberpunkAuthoritativeAnimationPlan(
      cyberpunkAnimationPlan("direct-impact", representativeScripts.directImpact)!,
      P1,
    );
    expect(direct.steps).toMatchObject([
      {
        type: "combat",
        source: { kind: "entity", id: "atk" },
        target: { kind: "zone", id: "opp-gigArea", ownerId: P2 },
        attackKind: "direct",
        showText: true,
        durationMs: 800,
      },
    ]);

    const eddies = cyberpunkAnimationPlan("eddies", representativeScripts.eddieSpend);
    expect(eddies?.steps).toMatchObject([
      {
        type: "valueDelta",
        subject: { kind: "zone", id: "eddieArea", ownerId: P1 },
        delta: -3,
      },
    ]);
    expect(JSON.stringify(eddies)).not.toContain('"kind":"player"');
    expect(JSON.stringify(eddies)).not.toContain("p-eddies");
    expect(JSON.stringify(eddies)).not.toContain("street-cred");
  });

  it("keeps a visible phase cue when Start advances to Main", () => {
    const script: AnimationScript = {
      totalDurationMs: 800,
      steps: [
        {
          id: "start-to-main",
          kind: "phaseChange",
          startMs: 0,
          durationMs: 800,
          reason: "phaseChanged",
          from: "start",
          to: "main",
          playerId: P1,
          variant: "phase",
        },
      ],
    };
    expect(cyberpunkAnimationPlan("phase", script)?.steps).toMatchObject([
      { type: "phaseChange", variant: "phase", durationMs: 800 },
    ]);
  });

  it("practice projection keeps the same step types, entities, and endpoint kinds", () => {
    for (const [name, next] of Object.entries(representativeScripts)) {
      const adapter = cyberpunkAnimationPlan(`adapter:${name}`, next);
      const practice = adapter ? projectCyberpunkAuthoritativeAnimationPlan(adapter, P1) : null;
      expect(serializedShape(practice), name).toEqual(serializedShape(adapter));
    }
  });

  it("projects eddie and gig zones onto registered board ids", () => {
    const eddies = projectCyberpunkAuthoritativeAnimationPlan(
      cyberpunkAnimationPlan("eddies", representativeScripts.eddieSpend)!,
      P1,
    );
    expect(eddies.steps[0]).toMatchObject({
      type: "valueDelta",
      subject: { kind: "zone", id: "p-eddieArea" },
    });

    const gig = projectCyberpunkAuthoritativeAnimationPlan(
      cyberpunkAnimationPlan("gig", representativeScripts.gigGainAndTurn)!,
      P1,
    );
    expect(gig.steps[0]).toMatchObject({
      type: "entityTransfer",
      from: { kind: "zone", id: "p-fixer" },
      to: { kind: "zone", id: "p-gigArea" },
    });
  });

  it("projects removed-from-game endpoints onto stable seat anchors", () => {
    const plan = cyberpunkAnimationPlan("removed", {
      totalDurationMs: 240,
      steps: [
        {
          id: "remove-card",
          kind: "cardMove",
          startMs: 0,
          durationMs: 240,
          reason: "cardMoved",
          cardId: "unit-1",
          fromZone: "field",
          toZone: "removedFromGame",
          playerId: P1,
        },
      ],
    } as AnimationScript)!;
    const projected = projectCyberpunkAuthoritativeAnimationPlan(plan, P1);
    expect(projected.steps[0]).toMatchObject({
      type: "entityTransfer",
      from: { kind: "zone", id: "p-field", ownerId: P1 },
      to: { kind: "zone", id: "p-removedFromGame", ownerId: P1 },
    });
  });

  it("keeps deck cards hidden at takeoff and reveals them while moving to a public zone", () => {
    const reveal = projectCyberpunkAuthoritativeAnimationPlan(
      cyberpunkAnimationPlan("reveal", representativeScripts.revealWithDestination)!,
      P1,
    );
    expect(reveal.steps[0]).toMatchObject({
      type: "entityTransfer",
      from: { kind: "zone", id: "p-deck" },
      to: { kind: "zone", id: "p-hand" },
      sourceFace: "hidden",
      destinationFace: "public",
    });
  });

  it("flies a publicly sold deck card into the owner's Eddies counter zone", () => {
    const saleScript = {
      totalDurationMs: 800,
      steps: [
        {
          id: "bootleg-sale",
          kind: "cardReveal",
          audience: "public",
          viewerId: P1,
          startMs: 0,
          durationMs: 800,
          reason: "cardsRevealed",
          cardId: "sold-card",
          fromZone: "deck",
          toZone: "eddieArea",
          ownerId: P1,
        },
      ],
    } as AnimationScript;
    const plan = cyberpunkAnimationPlan("bootleg-sale", saleScript)!;
    const transfer = projectCyberpunkAuthoritativeAnimationPlan(plan, P1).steps[0];

    expect(transfer).toMatchObject({
      type: "entityTransfer",
      entity: { kind: "entity", id: "sold-card" },
      from: { kind: "zone", id: "p-deck", ownerId: P1 },
      to: { kind: "zone", id: "p-eddieArea", ownerId: P1 },
      sourceFace: "hidden",
      destinationFace: "public",
      reveal: { kind: "card", cardId: "sold-card", audience: { kind: "all" } },
    });
  });

  it("shows a public reveal identity to both players", () => {
    const plan = cyberpunkAnimationPlan(
      "bare-reveal",
      representativeScripts.revealWithoutDestination,
    )!;
    const owner = projectCyberpunkAuthoritativeAnimationPlan(plan, P1);
    const rival = projectCyberpunkAuthoritativeAnimationPlan(plan, P2);
    expect(owner.steps[0]).toMatchObject({
      type: "emphasize",
      at: { kind: "zone", id: "p-deck" },
    });
    expect(rival.steps[0]).toMatchObject({
      type: "emphasize",
      at: { kind: "zone", id: "opp-deck" },
    });
    expect(owner.steps[0]).toMatchObject({ reveal: { kind: "card", cardId: "top-1" } });
    expect(rival.steps[0]).toMatchObject({ reveal: { kind: "card", cardId: "top-1" } });
  });

  it("names the acting side behind a reveal from the source card's controller", () => {
    const plan: AnimationPlanV2 = {
      id: "rival-look",
      version: 2,
      steps: [
        {
          id: "look",
          type: "emphasize",
          style: "spotlight",
          at: { kind: "zone", id: "deck", ownerId: P1 },
          reveal: { kind: "hidden" },
          sourceCardId: "viktor-1",
          sourceTitle: "Viktor Vektor: Sit Down and Relax",
          startAtMs: 0,
          durationMs: 800,
        },
      ],
    };
    // Only the controller is consulted; the registry-touching source
    // resolution is skipped because the step already carries its title.
    const state = {
      G: { cardIndex: { "viktor-1": { instanceId: "viktor-1", controllerId: P2 } } },
    } as unknown as MatchState;
    const forOwner = projectCyberpunkAuthoritativeAnimationPlan(plan, P1, state);
    const forActor = projectCyberpunkAuthoritativeAnimationPlan(plan, P2, state);
    const withoutState = projectCyberpunkAuthoritativeAnimationPlan(plan, P1);
    expect(forOwner.steps[0]).toMatchObject({ actorSide: "opponent" });
    expect(forActor.steps[0]).toMatchObject({ actorSide: "player" });
    expect(withoutState.steps[0]).not.toHaveProperty("actorSide");
  });

  it("emphasizes the owner's Legend area when another player looks", () => {
    const script = {
      totalDurationMs: 800,
      steps: [
        {
          id: "look",
          kind: "cardReveal",
          audience: "private",
          viewerId: P1,
          startMs: 0,
          durationMs: 800,
          reason: "cardsRevealed",
          cardId: "legend-1",
          fromZone: "legendArea",
          ownerId: P2,
        },
      ],
    } as AnimationScript;
    const plan = cyberpunkAnimationPlan("legend-look", script)!;
    const viewerPlan = projectCyberpunkAuthoritativeAnimationPlan(plan, P1);
    expect(viewerPlan.steps).toEqual([
      expect.objectContaining({
        type: "emphasize",
        at: { kind: "zone", id: "opp-legendArea", ownerId: P2 },
        style: "spotlight",
      }),
    ]);
    expect(JSON.stringify(viewerPlan)).not.toContain("p-deck");
    expect(viewerPlan.steps[0]).toMatchObject({ reveal: { kind: "card", cardId: "legend-1" } });
    expect(projectCyberpunkAuthoritativeAnimationPlan(plan, P2).steps[0]).toMatchObject({
      reveal: { kind: "hidden" },
    });
  });

  it("shows a choice with no physical effect at its Program's trash zone", () => {
    const script: AnimationScript = {
      totalDurationMs: 800,
      steps: [
        {
          id: "choice",
          kind: "actionEmphasis",
          startMs: 0,
          durationMs: 800,
          reason: "resolveChooseEffect",
          target: { kind: "zone", zone: "trash", playerId: P1 },
          tone: "neutral",
        },
      ],
    };
    const plan = cyberpunkAnimationPlan("empty-choice", script);
    if (!plan) throw new Error("Expected a visible choice plan");
    const viewerPlan = projectCyberpunkAuthoritativeAnimationPlan(plan, P2);
    expect(viewerPlan.steps).toMatchObject([
      {
        type: "emphasize",
        at: { kind: "zone", id: "opp-trash", ownerId: P1 },
        style: "pulse",
      },
    ]);
  });

  it("shows a searched deck card only to the player whose hand receives it", () => {
    const script: AnimationScript = {
      totalDurationMs: 800,
      steps: [
        {
          id: "private-search",
          kind: "cardMove",
          startMs: 0,
          durationMs: 800,
          reason: "cardMoved",
          cardId: "searched-card",
          fromZone: "deck",
          toZone: "hand",
          playerId: P1,
        },
      ],
    };
    const plan = cyberpunkAnimationPlan("private-search", script)!;
    expect(projectCyberpunkAuthoritativeAnimationPlan(plan, P1).steps[0]).toMatchObject({
      sourceFace: "hidden",
      destinationFace: "public",
    });
    for (const viewerId of [P2, null]) {
      expect(projectCyberpunkAuthoritativeAnimationPlan(plan, viewerId).steps[0]).toMatchObject({
        sourceFace: "hidden",
        destinationFace: "hidden",
      });
    }
  });

  it("keeps a recovered public card face up while it moves into either player's hand", () => {
    const script: AnimationScript = {
      totalDurationMs: 800,
      steps: [
        {
          id: "recover-from-trash",
          kind: "cardMove",
          startMs: 0,
          durationMs: 800,
          reason: "cardMoved",
          cardId: "recovered-gear",
          fromZone: "trash",
          toZone: "hand",
          playerId: P2,
        },
      ],
    };
    const plan = cyberpunkAnimationPlan("recover-from-trash", script)!;

    for (const viewerId of [P1, P2]) {
      expect(projectCyberpunkAuthoritativeAnimationPlan(plan, viewerId).steps[0]).toMatchObject({
        entity: { kind: "entity", id: "recovered-gear" },
        sourceFace: "public",
        destinationFace: "public",
      });
    }
  });

  it("redacts the card identity when a private look moves from deck to hand", () => {
    const script: AnimationScript = {
      totalDurationMs: 800,
      steps: [
        {
          id: "private-reveal",
          kind: "cardReveal",
          startMs: 0,
          durationMs: 800,
          reason: "cardsRevealed",
          cardId: "private-card",
          fromZone: "deck",
          toZone: "hand",
          ownerId: P1,
          viewerId: P1,
          audience: "private",
        },
      ],
    };
    const plan = cyberpunkAnimationPlan("private-look", script)!;
    const owner = projectCyberpunkAuthoritativeAnimationPlan(plan, P1);
    const rival = projectCyberpunkAuthoritativeAnimationPlan(plan, P2);
    expect(owner.steps[0]).toMatchObject({
      entity: { kind: "entity", id: "private-card" },
      reveal: { kind: "card", cardId: "private-card" },
      destinationFace: "public",
    });
    expect(rival.steps[0]).toMatchObject({
      reveal: { kind: "hidden" },
      destinationFace: "hidden",
    });
    expect(JSON.stringify(rival)).not.toContain("private-card");
  });

  it("shows a rival-chosen deck reveal to both the owner and the chooser", () => {
    const script: AnimationScript = {
      totalDurationMs: 1600,
      steps: [
        {
          id: "rival-reveal",
          kind: "cardReveal",
          startMs: 0,
          durationMs: 1600,
          reason: "cardsRevealed",
          cardId: "shared-reveal",
          fromZone: "deck",
          ownerId: P1,
          viewerId: P2,
          viewerIds: [P1, P2],
          audience: "private",
        },
      ],
    };
    const plan = cyberpunkAnimationPlan("rival-reveal", script)!;
    for (const viewerId of [P1, P2]) {
      expect(projectCyberpunkAuthoritativeAnimationPlan(plan, viewerId).steps[0]).toMatchObject({
        reveal: { kind: "card", cardId: "shared-reveal" },
      });
    }
    expect(projectCyberpunkAuthoritativeAnimationPlan(plan, null).steps[0]).toMatchObject({
      reveal: { kind: "hidden" },
    });
  });
});

describe("card-effect fx cue mapping", () => {
  it("maps defeated exits onto card.destroy and every other exit onto its plain cue", () => {
    const script: AnimationScript = {
      totalDurationMs: 720,
      steps: [
        {
          id: "defeat-exit",
          kind: "cardExit",
          startMs: 0,
          durationMs: 240,
          reason: "cardDefeated",
          cardId: "unit-1",
          fromZone: "field",
          toZone: "trash",
          playerId: P1,
          exitReason: "defeated",
        },
        {
          id: "sold-exit",
          kind: "cardExit",
          startMs: 240,
          durationMs: 240,
          reason: "cardSold",
          cardId: "unit-2",
          fromZone: "field",
          toZone: "trash",
          playerId: P1,
          exitReason: "sold",
        },
        {
          id: "move-exit",
          kind: "cardMove",
          startMs: 480,
          durationMs: 240,
          reason: "cardMoved",
          cardId: "unit-3",
          fromZone: "hand",
          toZone: "trash",
          playerId: P1,
        },
      ],
    };
    const plan = cyberpunkAnimationPlan("fx-defeats", script)!;
    const cues = plan.steps.map((step) => (step.type === "entityTransfer" ? step.audioCue : null));
    expect(cues).toEqual(["card.destroy", "card.discard", "card.discard"]);
  });

  it("keeps defeat exits held at source and carries their entity refs", () => {
    const script: AnimationScript = {
      totalDurationMs: 240,
      steps: [
        {
          id: "defeat-exit",
          kind: "cardExit",
          startMs: 0,
          durationMs: 240,
          reason: "cardDefeated",
          cardId: "unit-1",
          fromZone: "field",
          toZone: "trash",
          playerId: P1,
          exitReason: "defeated",
        },
      ],
    };
    const plan = cyberpunkAnimationPlan("fx-defeat-hold", script)!;
    expect(plan.steps[0]).toMatchObject({
      type: "entityTransfer",
      entity: { kind: "entity", id: "unit-1" },
      from: { kind: "zone", id: "field", ownerId: P1 },
      to: { kind: "zone", id: "trash", ownerId: P1 },
      sourcePresentation: "hold",
      audioCue: "card.destroy",
    });
  });

  it("passes negative-tone emphasis labels through for the cannot-attack lock-on", () => {
    const script: AnimationScript = {
      totalDurationMs: 500,
      steps: [
        {
          id: "cant-attack",
          kind: "actionEmphasis",
          startMs: 0,
          durationMs: 500,
          reason: "ruleGranted:cantAttack",
          target: { kind: "card", cardId: "unit-9" },
          tone: "negative",
          label: "CAN'T ATTACK",
        },
      ],
    };
    const plan = cyberpunkAnimationPlan("fx-lockon", script)!;
    expect(plan.steps[0]).toMatchObject({
      type: "emphasize",
      at: { kind: "entity", id: "unit-9" },
      tone: "negative",
      label: "CAN'T ATTACK",
    });
  });

  it("carries the fight's defeated participants on resolved combat steps", () => {
    const script: AnimationScript = {
      totalDurationMs: 600,
      steps: [
        {
          id: "fight",
          kind: "combat",
          startMs: 0,
          durationMs: 600,
          reason: "attackResolved",
          attackerId: "unit-1",
          defenderId: "unit-2",
          rivalId: P2,
          attackKind: "fight",
          result: "attackerWins",
          defeatedCardIds: ["unit-2"],
          playerId: P1,
        },
      ],
    } as AnimationScript;
    const plan = cyberpunkAnimationPlan("fx-combat-defeats", script)!;
    expect(plan.steps[0]).toMatchObject({
      type: "combat",
      reason: "resolved",
      defeatedCardIds: ["unit-2"],
    });
  });
});
