import { describe, expect, it } from "bun:test";
import type { CardInstanceId, PlayerId } from "@tcg/lorcana-types";

import { simulateClick } from "./simulate-click";
import type { PlayerInteractionView } from "../types/player-interaction-view";

const PLAYER_ONE = "p1" as PlayerId;
const TARGET_A = "card_target_a" as CardInstanceId;
const TARGET_B = "card_target_b" as CardInstanceId;

function chooserView(): PlayerInteractionView {
  return {
    viewerId: PLAYER_ONE,
    viewerRole: "chooser",
    activePrompt: {
      requestId: "req-1",
      kind: "target-selection",
      chooserId: PLAYER_ONE,
      controllerId: PLAYER_ONE,
      sourceCardId: "card_source_1" as CardInstanceId,
      selectedCardIds: [],
      expectedSlottedKind: null,
      activeSlotIndex: null,
      slots: null,
      autoResolvedSlotCount: 0,
      minSelections: 1,
      maxSelections: 1,
      declaredMaxSelections: null,
      autoRejected: false,
      scryDestinations: null,
      scryRevealed: null,
    },
    surface: "inline-board",
    interactions: [
      { kind: "select-card", cardId: TARGET_A, slotIndex: 0, payload: { targets: [TARGET_A] } },
      { kind: "select-card", cardId: TARGET_B, slotIndex: 0, payload: { targets: [TARGET_B] } },
    ],
    submission: {
      requestId: "req-1",
      canSubmit: false,
      canCancel: false,
      autoRejected: false,
      submitPayload: null,
      cancelPayload: null,
    },
    copy: { titleKey: "prompt.target.choose-card", titleParams: {}, badges: [] },
    promptQueue: [
      {
        requestId: "req-1",
        kind: "target-selection",
        chooserId: PLAYER_ONE,
        sourceCardId: "card_source_1" as CardInstanceId,
      },
    ],
    activeQueueIndex: 0,
    rawContext: null,
  };
}

describe("simulateClick", () => {
  it("returns the matching select-card interaction's payload", () => {
    const view = chooserView();
    const result = simulateClick(view, { kind: "card", cardId: TARGET_A });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.payload).toEqual({ targets: [TARGET_A] });
    }
  });

  it("returns no-match when the target card isn't a candidate", () => {
    const view = chooserView();
    const result = simulateClick(view, { kind: "card", cardId: "ghost" as CardInstanceId });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("no-match");
  });

  it("rejects clicks when viewer is not the chooser", () => {
    const view = { ...chooserView(), viewerRole: "spectator" as const };
    const result = simulateClick(view, { kind: "card", cardId: TARGET_A });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("not-chooser");
  });

  it("rejects submit when canSubmit is false", () => {
    const view = chooserView();
    const result = simulateClick(view, { kind: "submit" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("not-submittable");
  });

  it("returns the submit payload when canSubmit is true", () => {
    const view = {
      ...chooserView(),
      submission: {
        requestId: "req-1",
        canSubmit: true,
        canCancel: false,
        autoRejected: false,
        submitPayload: { targets: [TARGET_A] },
        cancelPayload: null,
      },
    };
    const result = simulateClick(view, { kind: "submit" });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.payload).toEqual({ targets: [TARGET_A] });
  });
});
