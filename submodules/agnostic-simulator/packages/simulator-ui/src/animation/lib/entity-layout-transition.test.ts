import { describe, expect, test } from "vite-plus/test";
import type { CompiledAnimationPlan } from "@tcg/simulator-runtime/animation";

import {
  entityParticipatesInLayout,
  entityLayoutTransition,
  hasEntityTransfer,
  hasSourceCardExit,
  hasZoneTransfer,
} from "./entity-layout-transition";

describe("entityLayoutTransition", () => {
  test("keeps surrounding layout movement independent of the card transfer", () => {
    const plan = {
      id: "plan",
      steps: [
        {
          step: {
            id: "move",
            type: "entityTransfer",
            entity: { kind: "entity", id: "card" },
            from: { kind: "zone", id: "hand" },
            to: { kind: "zone", id: "field" },
            sourceFace: "public",
            destinationFace: "public",
          },
          startAtMs: 250,
          durationMs: 700,
          endAtMs: 950,
        },
      ],
      audioCues: [],
      primaryDurationMs: 950,
      interactionBlockingDurationMs: 950,
      reflowDurationMs: 240,
    } satisfies CompiledAnimationPlan;

    expect(entityLayoutTransition("card", plan)).toMatchObject({
      duration: 0.24,
    });
    expect(hasEntityTransfer("card", plan)).toBe(true);
    expect(hasEntityTransfer("other", plan)).toBe(false);
    expect(hasZoneTransfer("hand", plan)).toBe(true);
    expect(hasZoneTransfer("field", plan)).toBe(true);
    expect(hasZoneTransfer("battleArea", plan)).toBe(false);
  });

  test("uses reflow timing when the entity has no unique transfer", () => {
    expect(
      entityLayoutTransition("other", {
        id: "plan",
        steps: [],
        audioCues: [],
        primaryDurationMs: 0,
        interactionBlockingDurationMs: 0,
        reflowDurationMs: 120,
      }),
    ).toMatchObject({ duration: 0.12 });
    expect(hasEntityTransfer("other", null)).toBe(false);
    expect(hasZoneTransfer("hand", null)).toBe(false);
  });

  test("retains entity endpoints when the transfer visual uses another entity", () => {
    const plan = {
      id: "copy-return",
      steps: [
        {
          step: {
            id: "return",
            type: "entityTransfer",
            entity: { kind: "entity", id: "source-card" },
            from: { kind: "entity", id: "rules-stack:layer-1" },
            to: { kind: "entity", id: "source-card" },
            sourceFace: "public",
            destinationFace: "public",
          },
          startAtMs: 0,
          durationMs: 440,
          endAtMs: 440,
        },
      ],
      audioCues: [],
      primaryDurationMs: 440,
      interactionBlockingDurationMs: 440,
      reflowDurationMs: 240,
    } satisfies CompiledAnimationPlan;

    expect(hasEntityTransfer("rules-stack:layer-1", plan)).toBe(true);
    expect(hasEntityTransfer("source-card", plan)).toBe(true);
  });

  test("identifies a source card whose spotlight owns its final zone handoff", () => {
    const plan = {
      id: "source-exit",
      steps: [
        {
          step: {
            id: "damage",
            type: "effect",
            source: { kind: "entity", id: "instant-card" },
            targets: [],
            presentation: "source-card",
            sourceExitTo: { kind: "zone", id: "p1:graveyard", ownerId: "p1" },
          },
          startAtMs: 0,
          durationMs: 2_200,
          endAtMs: 2_200,
        },
      ],
      audioCues: [],
      primaryDurationMs: 2_200,
      interactionBlockingDurationMs: 2_200,
      reflowDurationMs: 240,
    } satisfies CompiledAnimationPlan;

    expect(hasSourceCardExit("instant-card", plan)).toBe(true);
    expect(hasSourceCardExit("other-card", plan)).toBe(false);
  });

  test("enrolls only semantic transfer entities and their zone siblings in layout", () => {
    const plan = {
      id: "plan",
      steps: [
        {
          step: {
            id: "move",
            type: "entityTransfer",
            entity: { kind: "entity", id: "moving-card" },
            from: { kind: "zone", id: "hand" },
            to: { kind: "zone", id: "field" },
            sourceFace: "public",
            destinationFace: "public",
          },
          startAtMs: 0,
          durationMs: 560,
          endAtMs: 560,
        },
        {
          step: {
            id: "emphasize",
            type: "emphasize",
            at: { kind: "entity", id: "unrelated-card" },
            style: "pulse",
          },
          startAtMs: 0,
          durationMs: 520,
          endAtMs: 520,
        },
      ],
      audioCues: [],
      primaryDurationMs: 560,
      interactionBlockingDurationMs: 560,
      reflowDurationMs: 240,
    } satisfies CompiledAnimationPlan;

    expect(entityParticipatesInLayout("moving-card", "battleArea", plan)).toBe(true);
    expect(entityParticipatesInLayout("hand-sibling", "hand", plan)).toBe(true);
    expect(entityParticipatesInLayout("field-sibling", "field", plan)).toBe(true);
    expect(entityParticipatesInLayout("unrelated-card", "battleArea", plan)).toBe(false);
    expect(
      entityParticipatesInLayout("unrelated-card", "hand", {
        ...plan,
        id: "non-spatial-plan",
        steps: [plan.steps[1]!],
        reflowDurationMs: 0,
      }),
    ).toBe(false);
    expect(entityParticipatesInLayout("moving-card", "hand", null)).toBe(false);
    expect(entityParticipatesInLayout("moving-card", "hand", undefined)).toBe(false);
  });
});
