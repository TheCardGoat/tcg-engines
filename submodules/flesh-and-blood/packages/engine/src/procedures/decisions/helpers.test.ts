import { describe, expect, it } from "vitest";
import { fabPlayerId } from "../../game/identity.ts";
import type { FabDecision } from "../../rules/process.ts";
import { fabPlayerTarget } from "../../rules/targets.ts";
import { declaredTargetsFromDecision, validateAnswer } from "./helpers.ts";

const objectTarget = {
  kind: "object",
  ref: { instanceId: "card-1", incarnation: 3 },
} as const;
const playerTarget = fabPlayerTarget(fabPlayerId("player-2"));

const decision = {
  decisionId: "decision-1",
  stateVersion: 7,
  actorId: "player-1",
  label: "Choose targets",
  kind: "entity-target",
  min: 1,
  max: 2,
  candidates: [
    { instanceId: "card-1", label: "Card", target: objectTarget },
    { instanceId: "player-2", label: "Opponent", target: playerTarget },
  ],
  continuation: {
    kind: "layer-target",
    processId: "process-1",
    pendingTriggerId: "trigger-1",
    targetKey: "target",
  },
} satisfies Extract<FabDecision, { readonly kind: "entity-target" }>;

describe("declaredTargetsFromDecision", () => {
  it("restores exact typed target identities in submitted order", () => {
    expect(
      declaredTargetsFromDecision(decision, {
        kind: "entity-target",
        instanceIds: ["player-2", "card-1"],
      }),
    ).toEqual([playerTarget, objectTarget]);
  });

  it("rejects an answer that is not backed by a legal candidate", () => {
    expect(() =>
      declaredTargetsFromDecision(decision, {
        kind: "entity-target",
        instanceIds: ["unknown"],
      }),
    ).toThrow("unknown target unknown");
  });
});

describe("validateAnswer", () => {
  const optionDecision = {
    decisionId: "decision-1",
    stateVersion: 7,
    actorId: "player-1",
    label: "Choose modes",
    kind: "option",
    min: 2,
    max: 2,
    options: [
      { id: "first", label: "First" },
      { id: "second", label: "Second" },
    ],
    continuation: {
      kind: "play-mode",
      processId: "process-1",
    },
  } satisfies Extract<FabDecision, { readonly kind: "option" }>;

  it("rejects a repeated option instead of counting it as two declarations", () => {
    expect(
      validateAnswer(optionDecision, {
        kind: "option",
        optionIds: ["first", "first"],
      }),
    ).toBe("Choose every option at most once.");
  });

  it("accepts the required number of distinct legal options", () => {
    expect(
      validateAnswer(optionDecision, {
        kind: "option",
        optionIds: ["first", "second"],
      }),
    ).toBeNull();
  });

  it("rejects two printings that share a printed name when differentNames is set", () => {
    const namesDecision = {
      ...decision,
      min: 3,
      max: 3,
      differentNames: true,
      candidates: [
        {
          instanceId: "snatch-red",
          label: "snatch-red",
          printedName: "snatch",
          target: objectTarget,
        },
        {
          instanceId: "snatch-yellow",
          label: "snatch-yellow",
          printedName: "snatch",
          target: objectTarget,
        },
        {
          instanceId: "pack-hunt",
          label: "pack-hunt-yellow",
          printedName: "packhunt",
          target: objectTarget,
        },
      ],
    } satisfies Extract<FabDecision, { readonly kind: "entity-target" }>;

    expect(
      validateAnswer(namesDecision, {
        kind: "entity-target",
        instanceIds: ["snatch-red", "snatch-yellow", "pack-hunt"],
      }),
    ).toBe("Choose cards with different names.");
  });
});
