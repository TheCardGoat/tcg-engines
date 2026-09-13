import { describe, expect, it } from "vitest";
import { INTERACTION_PROTOCOL_VERSION, type EngineInteractionView } from "@tcg/protocol";
import {
  fabCardActionsFromInteractionView,
  fabConcedeActionIdFromInteractionView,
} from "./LiveMatch.page";

function view(actions: EngineInteractionView["actions"], stateVersion = 1): EngineInteractionView {
  return {
    protocolVersion: INTERACTION_PROTOCOL_VERSION,
    gameSlug: "flesh-and-blood",
    actorId: "p1",
    stateVersion,
    status: actions.length > 0 ? "ready" : "waiting",
    actions,
  };
}

describe("FAB live viewer card actions", () => {
  it("projects only enabled card sources and drops stale actions on the next authoritative view", () => {
    const current = view([
      {
        id: "play:1",
        requestId: "fab:1",
        intent: "play-card",
        text: { key: "Play card" },
        enabled: true,
        source: { kind: "card", instanceId: "own-card" },
        inputs: [],
      },
      {
        id: "target-player",
        requestId: "fab:1",
        intent: "choose-targets",
        text: { key: "Choose player" },
        enabled: true,
        source: { kind: "player", instanceId: "p2" },
        inputs: [],
      },
    ]);

    expect(fabCardActionsFromInteractionView(current)).toEqual([
      { id: "play:1", sourceEntityIds: ["own-card"], label: "Play card" },
    ]);
    expect(fabCardActionsFromInteractionView(view([], 2))).toEqual([]);
  });

  it("keeps an Instant activation while leaving card automation to its dedicated controls", () => {
    const current = view([
      {
        id: "activate-looter",
        requestId: "fab:1",
        intent: "activate",
        text: { key: "Activate Restless Looter" },
        enabled: true,
        source: { kind: "card", instanceId: "restless-looter" },
        inputs: [],
      },
      {
        id: "attack-with-looter",
        requestId: "fab:1",
        intent: "activate",
        text: { key: "Attack with Restless Looter" },
        enabled: true,
        source: { kind: "card", instanceId: "restless-looter" },
        inputs: [],
      },
      {
        id: "configure-decay",
        requestId: "fab:1",
        intent: "custom",
        text: { key: "Decay" },
        enabled: true,
        source: { kind: "card", instanceId: "restless-looter" },
        inputs: [],
      },
      {
        id: "configure-instant-yield",
        requestId: "fab:1",
        intent: "custom",
        text: { key: "Auto-yield this card" },
        enabled: true,
        source: { kind: "card", instanceId: "restless-looter" },
        inputs: [],
      },
    ]);

    expect(fabCardActionsFromInteractionView(current)).toEqual([
      {
        id: "activate-looter",
        sourceEntityIds: ["restless-looter"],
        label: "Activate Restless Looter",
      },
      {
        id: "attack-with-looter",
        sourceEntityIds: ["restless-looter"],
        label: "Attack with Restless Looter",
      },
    ]);
  });

  it("selects only an enabled concession action when the viewer has permission", () => {
    const current = view([
      {
        id: "concede:disabled",
        requestId: "fab:1",
        intent: "concede",
        text: { key: "Concede" },
        enabled: false,
        inputs: [],
      },
      {
        id: "concede:enabled",
        requestId: "fab:1",
        intent: "concede",
        text: { key: "Concede" },
        enabled: true,
        inputs: [],
      },
    ]);

    expect(fabConcedeActionIdFromInteractionView(current, true)).toBe("concede:enabled");
    expect(fabConcedeActionIdFromInteractionView(current, false)).toBeNull();
  });
});
