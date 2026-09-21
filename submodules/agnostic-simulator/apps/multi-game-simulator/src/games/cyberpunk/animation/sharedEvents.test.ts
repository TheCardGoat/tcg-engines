import { describe, expect, test } from "vite-plus/test";
import { AnimationPlanV2Schema, type AnimationPlanV2, type AnimationStepV2 } from "@tcg/protocol";
import type { AnimationScript } from "@tcg/cyberpunk-engine";
import { cyberpunkAnimationPlan } from "@tcg/cyberpunk-server-adapter/animation";
import { AnimationInteractionBoundary } from "@tcg/simulator-ui";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { PLAYER_SIDE_TO_ID } from "../engine/index.js";
import {
  cyberpunkAnimationScriptToAnimationPlans,
  isCyberpunkAuthoritativeRollback,
  projectCyberpunkAuthoritativeAnimationPlan,
} from "./sharedEvents.js";

const viewerSeatId = String(PLAYER_SIDE_TO_ID.player);
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
    return { type: step.type, subjectKind: step.subject.kind };
  }
  if (step.type === "phaseChange") {
    return { type: step.type, variant: step.variant };
  }
  return { type: step.type };
}

function shapes(plan: AnimationPlanV2 | null | undefined) {
  return (plan?.steps ?? []).map(stepShape);
}

describe("Cyberpunk AnimationPlanV2 adapter", () => {
  test("practice projection matches the adapter plan for representative scripts", () => {
    for (const [name, script] of Object.entries(representativeScripts)) {
      const adapter = cyberpunkAnimationPlan(`adapter:${name}`, script);
      const practice = cyberpunkAnimationScriptToAnimationPlans(script, {
        viewerSeatId,
        idPrefix: `practice:${name}`,
      });
      if (!adapter) {
        expect(practice, name).toEqual([]);
        continue;
      }
      expect(practice, name).toHaveLength(1);
      expect(AnimationPlanV2Schema.parse(practice[0])).toEqual(practice[0]);
      expect(shapes(practice[0]), name).toEqual(shapes(adapter));
      expect(JSON.stringify(practice[0])).not.toContain("resolving-program");
      expect(practice[0]?.steps.some((step) => step.type === "hold")).toBe(false);
    }
  });

  test("play-to-field is a hand→field transfer", () => {
    const [plan] = cyberpunkAnimationScriptToAnimationPlans(representativeScripts.playToField, {
      viewerSeatId,
    });
    expect(plan?.steps[0]).toMatchObject({
      type: "entityTransfer",
      entity: { id: "unit-1" },
      from: { kind: "zone", id: "p-hand" },
      to: { kind: "zone", id: "p-field" },
    });
  });

  test("Call Legend is an in-place face change", () => {
    const [plan] = cyberpunkAnimationScriptToAnimationPlans(representativeScripts.callLegend, {
      viewerSeatId,
    });
    expect(plan?.steps).toMatchObject([
      {
        type: "entityStateChange",
        change: "face",
        entity: { id: "legend-1" },
      },
    ]);
    expect(JSON.stringify(plan)).not.toContain("resolving-program");
  });

  test("Eddie spend targets the registered Eddie zone", () => {
    const [plan] = cyberpunkAnimationScriptToAnimationPlans(representativeScripts.eddieSpend, {
      viewerSeatId,
    });
    expect(plan?.steps[0]).toMatchObject({
      type: "valueDelta",
      subject: { kind: "zone", id: "p-eddieArea" },
    });
  });

  test("gig gain does not drop a turn announcement", () => {
    const [plan] = cyberpunkAnimationScriptToAnimationPlans(representativeScripts.gigGainAndTurn, {
      viewerSeatId,
    });
    expect(plan?.steps.map((step) => step.type)).toEqual(["entityTransfer", "phaseChange"]);
    expect(plan?.steps[1]).toMatchObject({ type: "phaseChange", variant: "turn" });
  });

  test("the shipped interaction boundary sets aria-busy while a transition is active", () => {
    const active = renderToStaticMarkup(
      createElement(AnimationInteractionBoundary, { active: true }, "board"),
    );
    const idle = renderToStaticMarkup(
      createElement(AnimationInteractionBoundary, { active: false }, "board"),
    );
    expect(active).toContain("aria-busy");
    expect(idle).not.toContain("aria-busy");
    expect(active).toContain("data-animation-interaction-boundary");
  });

  test("projects authoritative engine zones for the current viewer", () => {
    const plan = projectCyberpunkAuthoritativeAnimationPlan(
      {
        id: "server-plan",
        version: 2,
        steps: [
          {
            id: "return",
            type: "entityTransfer",
            entity: { kind: "entity", id: "friendly-unit" },
            from: { kind: "zone", id: "field", ownerId: viewerSeatId },
            to: { kind: "zone", id: "hand", ownerId: viewerSeatId },
            sourceFace: "public",
            destinationFace: "hidden",
          },
        ],
      },
      viewerSeatId,
    );

    expect(plan.steps[0]).toMatchObject({
      from: { kind: "zone", id: "p-field" },
      to: { kind: "zone", id: "p-hand" },
      sourceFace: "public",
      destinationFace: "public",
    });
  });

  test("classifies an undo version as an authoritative rollback", () => {
    expect(isCyberpunkAuthoritativeRollback(4, 9)).toBe(true);
    expect(isCyberpunkAuthoritativeRollback(10, 9)).toBe(false);
    expect(isCyberpunkAuthoritativeRollback(0, null)).toBe(false);
  });
});
