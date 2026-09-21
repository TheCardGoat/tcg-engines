import { describe, expect, it } from "vite-plus/test";
import type { AnimationScript } from "@tcg/cyberpunk-engine";
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
        startMs: 0,
        durationMs: 1600,
        reason: "cardsRevealed",
        cardId: "top-1",
        fromZone: "deck",
        toZone: "hand",
        playerId: P1,
      },
    ],
  } as AnimationScript,
  revealWithoutDestination: {
    totalDurationMs: 1600,
    steps: [
      {
        id: "reveal",
        kind: "cardReveal",
        startMs: 0,
        durationMs: 1600,
        reason: "cardsRevealed",
        cardId: "top-1",
        fromZone: "deck",
        playerId: P1,
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
        sourceFace: "public",
        sourceExitTo: { kind: "zone", id: "p-trash", ownerId: P1 },
        label: "Defeat",
        tone: "negative",
      },
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
      cyberpunkAnimationPlan("bare-reveal", representativeScripts.revealWithoutDestination),
    ).toBe(null);

    expect(cyberpunkAnimationPlan("combat", representativeScripts.combatAndRedirect)).toBeNull();

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
});
