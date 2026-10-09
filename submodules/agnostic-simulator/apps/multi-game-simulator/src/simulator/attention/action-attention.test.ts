import { describe, expect, it } from "vitest";
import { EngineInteractionView, INTERACTION_PROTOCOL_VERSION } from "@tcg/protocol";
import { actionAttentionFromInteraction } from "./action-attention";

const base = EngineInteractionView.parse({
  protocolVersion: INTERACTION_PROTOCOL_VERSION,
  gameSlug: "cyberpunk",
  actorId: "p1",
  stateVersion: 4,
  status: "ready",
  actions: [
    {
      id: "pass",
      requestId: "r1",
      intent: "pass",
      text: { key: "action.pass" },
      enabled: true,
      inputs: [],
    },
  ],
});

describe("actionAttentionFromInteraction", () => {
  const input = { view: base, viewerId: "p1", stateVersion: 4, canAct: true };

  it("arms only when a current authoritative gameplay action belongs to the viewer", () => {
    expect(actionAttentionFromInteraction(input)?.label).toBe("Your move");
    expect(actionAttentionFromInteraction({ ...input, viewerId: "p2" })).toBeNull();
    expect(actionAttentionFromInteraction({ ...input, stateVersion: 5 })).toBeNull();
    const nextVersion = { ...base, stateVersion: 5 };
    expect(
      actionAttentionFromInteraction({ ...input, view: nextVersion, stateVersion: 5 })?.key,
    ).not.toBe(actionAttentionFromInteraction(input)?.key);
    expect(actionAttentionFromInteraction({ ...input, canAct: false })).toBeNull();
    expect(actionAttentionFromInteraction({ ...input, submitting: true })).toBeNull();
    expect(
      actionAttentionFromInteraction({ ...input, view: { ...base, status: "waiting" } }),
    ).toBeNull();
    expect(
      actionAttentionFromInteraction({
        ...input,
        view: { ...base, projectionFailure: { code: "projection_failed", retryable: true } },
      }),
    ).toBeNull();
  });

  it("ignores concede and undo, but includes setup choices", () => {
    const actions = base.actions.map((action) => ({ ...action, intent: "concede" as const }));
    expect(actionAttentionFromInteraction({ ...input, view: { ...base, actions } })).toBeNull();
    expect(
      actionAttentionFromInteraction({
        ...input,
        view: { ...base, actions: [{ ...actions[0]!, intent: "mulligan" }] },
      }),
    ).not.toBeNull();
  });

  it("uses effect and step identity for a required resolution", () => {
    const resolution = {
      actingPlayerId: "p1",
      pendingCount: 1,
      currentEffect: { id: "e1", text: { key: "effect.choose" } },
      currentStep: { index: 1, count: 2, text: { key: "step.choose" } },
    };
    const first = actionAttentionFromInteraction({ ...input, view: { ...base, resolution } });
    const second = actionAttentionFromInteraction({
      ...input,
      view: {
        ...base,
        resolution: { ...resolution, currentStep: { ...resolution.currentStep, index: 2 } },
      },
    });
    expect(first?.label).toBe("Your decision");
    expect(first?.key).not.toBe(second?.key);
    expect(
      actionAttentionFromInteraction({
        ...input,
        view: { ...base, resolution: { ...resolution, actingPlayerId: "p2" } },
      }),
    ).toBeNull();
  });
});
