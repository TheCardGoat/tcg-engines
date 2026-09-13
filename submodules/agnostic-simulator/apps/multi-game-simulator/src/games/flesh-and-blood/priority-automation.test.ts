/**
 * Fail-closed derivation tests for the priority-automation client helpers.
 *
 * The wire-level mirror must agree with the engine's pass-only predicate
 * (`getFabAutoPassPriorityCommand`): settings toggles project as sourceless
 * `custom`-intent actions and are skipped, exactly like the engine's
 * `botEligibleFabCommands` player-only filter. A window that cannot be proven
 * pass-only is never treated as pass-only.
 */
import {
  INTERACTION_PROTOCOL_VERSION,
  type EngineInteractionView,
  type InteractionAction,
} from "@tcg/protocol";
import {
  FAB_ARM_PRIORITY_HOLD_LABEL,
  FAB_PRIORITY_MODE_ACTION_LABEL,
  FAB_PRIORITY_MODES,
} from "@tcg/flesh-and-blood-server-adapter";
import { describe, expect, it } from "vitest";

import {
  fabArmHoldAction,
  fabPassInteractionAction,
  fabPriorityModeAction,
  holdsPassOnlyWindows,
  isFabPassOnlyInteractionView,
} from "./priority-automation";

let actionCounter = 0;

function action(
  partial: Partial<InteractionAction> & Pick<InteractionAction, "intent">,
): InteractionAction {
  actionCounter += 1;
  return {
    id: partial.intent === "pass" ? "fab:control:pass" : `action-${actionCounter}`,
    requestId: `req-${actionCounter}`,
    text: { key: `test.action.${actionCounter}` },
    enabled: true,
    inputs: [],
    ...partial,
  };
}

function view(
  actions: readonly InteractionAction[],
  overrides: Partial<Pick<EngineInteractionView, "status" | "resolution">> = {},
): EngineInteractionView {
  return {
    protocolVersion: INTERACTION_PROTOCOL_VERSION,
    gameSlug: "flesh-and-blood",
    actorId: "player-1",
    stateVersion: 42,
    status: "ready",
    actions: [...actions],
    ...overrides,
  };
}

describe("isFabPassOnlyInteractionView", () => {
  it("fails closed on missing views, non-ready status, and pending resolutions", () => {
    expect(isFabPassOnlyInteractionView(null)).toBe(false);
    expect(isFabPassOnlyInteractionView(undefined)).toBe(false);
    expect(isFabPassOnlyInteractionView(view([], { status: "waiting" }))).toBe(false);
    expect(isFabPassOnlyInteractionView(view([], { status: "choosing" }))).toBe(false);
    expect(
      isFabPassOnlyInteractionView(
        view([action({ intent: "pass" })], {
          resolution: { currentEffect: { id: "fx", kind: "effect" } } as never,
        }),
      ),
    ).toBe(false);
    expect(isFabPassOnlyInteractionView(view([]))).toBe(false);
  });

  it("treats a pass/concede window with projected settings toggles as pass-only", () => {
    // The adapter projects set-priority-automation (and card-sourced
    // optional-trigger toggles) exactly when the player holds priority; the
    // engine's own predicate filters these player-only commands out.
    const toggles = [
      action({ intent: "custom" }),
      action({
        intent: "custom",
        source: { kind: "card", instanceId: "trackers", ownerId: "player-1" } as never,
      }),
    ];
    const passOnly = view([action({ intent: "pass" }), action({ intent: "concede" }), ...toggles]);
    expect(isFabPassOnlyInteractionView(passOnly)).toBe(true);
  });

  it("rejects windows with any substantive non-pass action", () => {
    expect(isFabPassOnlyInteractionView(view([action({ intent: "choose-targets" })]))).toBe(false);
    expect(isFabPassOnlyInteractionView(view([action({ intent: "play-card" })]))).toBe(false);
    expect(isFabPassOnlyInteractionView(view([action({ intent: "attack" })]))).toBe(false);
    // A disabled pass action cannot be submitted — not pass-only.
    expect(isFabPassOnlyInteractionView(view([action({ intent: "pass", enabled: false })]))).toBe(
      false,
    );
    // A pass action that requires inputs is a deliberate prompt, not a gate window.
    expect(
      isFabPassOnlyInteractionView(
        view([
          action({
            intent: "pass",
            inputs: [
              {
                id: "confirm",
                kind: "boolean",
                text: { key: "test.confirm" },
                required: true,
              } as never,
            ],
          }),
        ]),
      ),
    ).toBe(false);
  });

  it("treats custom-only views as not pass-only (nothing substantive to submit)", () => {
    expect(isFabPassOnlyInteractionView(view([action({ intent: "custom" })]))).toBe(false);
  });

  it("accepts the bare pass/concede window the gate submits (end-turn note)", () => {
    // intentForMove maps both `pass` and `end-turn` to "pass"; the engine only
    // offers end-turn on an empty stack, which the tabletop gate excludes via
    // combatView stack/combat state before this helper is consulted.
    expect(
      isFabPassOnlyInteractionView(
        view([action({ intent: "pass" }), action({ intent: "concede" })]),
      ),
    ).toBe(true);
  });
});

describe("fabPassInteractionAction", () => {
  it("never treats End turn as a priority pass, regardless of action order or translated text", () => {
    const endTurn = action({ id: "fab:control:end-turn", intent: "pass", text: { key: "Finir" } });
    const pass = action({ intent: "pass", text: { key: "Passer" } });
    expect(fabPassInteractionAction(view([endTurn, pass]))?.id).toBe(pass.id);
    expect(fabPassInteractionAction(view([endTurn]))).toBeNull();
    expect(isFabPassOnlyInteractionView(view([pass, endTurn]))).toBe(false);
  });

  it("returns the first enabled input-less pass action", () => {
    const pass = action({ intent: "pass" });
    expect(fabPassInteractionAction(view([action({ intent: "concede" }), pass]))?.id).toBe(pass.id);
  });

  it("fails closed on disabled, input-bearing, or absent pass actions", () => {
    expect(fabPassInteractionAction(null)).toBeNull();
    expect(fabPassInteractionAction(view([]))).toBeNull();
    expect(fabPassInteractionAction(view([action({ intent: "pass", enabled: false })]))).toBeNull();
    expect(
      fabPassInteractionAction(
        view([
          action({
            intent: "pass",
            inputs: [
              { id: "i", kind: "option-selection", text: { key: "k" }, options: [] } as never,
            ],
          }),
        ]),
      ),
    ).toBeNull();
  });
});

describe("fabPriorityModeAction", () => {
  it("finds each mode's sourceless custom action by its engine label", () => {
    const actions = FAB_PRIORITY_MODES.map((mode) =>
      action({ intent: "custom", text: { key: FAB_PRIORITY_MODE_ACTION_LABEL[mode] } }),
    );
    const viewWithAll = view(actions);
    for (const mode of FAB_PRIORITY_MODES) {
      expect(fabPriorityModeAction(viewWithAll, mode)?.text.key).toBe(
        FAB_PRIORITY_MODE_ACTION_LABEL[mode],
      );
    }
    // The specific label wins even when several sourceless customs coexist.
    const arm = action({ intent: "custom", text: { key: FAB_ARM_PRIORITY_HOLD_LABEL } });
    expect(fabPriorityModeAction(view([arm, ...actions]), "play-and-skip")?.text.key).toBe(
      FAB_PRIORITY_MODE_ACTION_LABEL["play-and-skip"],
    );
  });

  it("fails closed on wrong labels, card-sourced, disabled, or absent actions", () => {
    expect(
      fabPriorityModeAction(
        view([action({ intent: "custom", text: { key: "some.other.label" } })]),
        "play-and-skip",
      ),
    ).toBeNull();
    expect(
      fabPriorityModeAction(
        view([
          action({
            intent: "custom",
            text: { key: FAB_PRIORITY_MODE_ACTION_LABEL["auto-pass"] },
            source: { kind: "card", instanceId: "trackers", ownerId: "player-1" } as never,
          }),
        ]),
        "auto-pass",
      ),
    ).toBeNull();
    expect(
      fabPriorityModeAction(
        view([
          action({
            intent: "custom",
            text: { key: FAB_PRIORITY_MODE_ACTION_LABEL["always-hold"] },
            enabled: false,
          }),
        ]),
        "always-hold",
      ),
    ).toBeNull();
    expect(fabPriorityModeAction(null, "auto-pass")).toBeNull();
    expect(fabPriorityModeAction(view([]), "auto-pass")).toBeNull();
  });
});

describe("fabArmHoldAction", () => {
  it("finds the one-shot arm action by its engine label", () => {
    const arm = action({ intent: "custom", text: { key: FAB_ARM_PRIORITY_HOLD_LABEL } });
    const toggles = Object.values(FAB_PRIORITY_MODE_ACTION_LABEL).map((label) =>
      action({ intent: "custom", text: { key: label } }),
    );
    expect(fabArmHoldAction(view([...toggles, arm]))?.id).toBe(arm.id);
  });

  it("fails closed when the arm is absent or mislabeled", () => {
    expect(fabArmHoldAction(null)).toBeNull();
    expect(fabArmHoldAction(view([]))).toBeNull();
    expect(
      fabArmHoldAction(
        view([
          action({ intent: "custom", text: { key: FAB_PRIORITY_MODE_ACTION_LABEL["auto-pass"] } }),
        ]),
      ),
    ).toBeNull();
  });
});

describe("holdsPassOnlyWindows", () => {
  it("holds for both holding modes and nothing else", () => {
    expect(holdsPassOnlyWindows("always-hold")).toBe(true);
    expect(holdsPassOnlyWindows("play-and-skip")).toBe(true);
    expect(holdsPassOnlyWindows("auto-pass")).toBe(false);
    expect(holdsPassOnlyWindows(null)).toBe(false);
    expect(holdsPassOnlyWindows(undefined)).toBe(false);
  });
});
