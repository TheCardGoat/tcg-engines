// @vitest-environment jsdom
import { describe, expect, it, vi } from "vite-plus/test";
import { render, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import type { EngineInteractionView, InteractionAction } from "@tcg/protocol";

import { GundamGameContext, type GundamGameContextValue } from "../../game/context-internals.ts";
import type { GameSnapshot } from "../../game/store.ts";
import type { SubmitOutcome } from "../../game/types.ts";
import {
  GundamAutoPassSettingsContext,
  type AutoPassWhenNoValidActionContextValue,
} from "../../lib/auto-pass-settings.tsx";
import { AutoPassActionStepContainer } from "./AutoPassActionStepContainer.tsx";

/**
 * The container's decision logic, driven by a stubbed store/adapter:
 * no engine, no fixture — just an interaction view and a submit spy.
 */

const INTENTS: Record<string, InteractionAction["intent"]> = {
  passActionStep: "pass",
  passBattleAction: "pass",
  passBlock: "pass",
  passTurn: "pass",
  concede: "concede",
  declareBlock: "attack",
  playCommand: "play-card",
  activateAbility: "activate",
  resolveEffect: "custom",
};

function action(id: string, enabled = true): InteractionAction {
  return {
    id,
    requestId: `req-${id}`,
    intent: INTENTS[id] ?? "custom",
    text: { key: `gundam.move.${id}` },
    enabled,
    inputs: [],
  } as InteractionAction;
}

function makeHarness(view: Pick<EngineInteractionView, "status" | "actions">) {
  const listeners = new Set<() => void>();
  const commandGateListeners = new Set<() => void>();
  let commandBlocked = false;
  let snapshot = {
    interactionView: view,
  } as unknown as GameSnapshot;

  const store = {
    getSnapshot: () => snapshot,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    dispose: () => {},
  };
  const adapter = {
    commandGate: {
      isBlocked: () => commandBlocked,
      subscribe: (listener: () => void) => {
        commandGateListeners.add(listener);
        return () => commandGateListeners.delete(listener);
      },
    },
    submit: vi.fn((): SubmitOutcome => ({ ok: true, stateId: 1 })),
  };

  const value = {
    adapter,
    store,
    pending: {},
    viewerId: "player_one",
  } as unknown as GundamGameContextValue;

  return {
    value,
    submit: adapter.submit,
    setInteractionView(next: Pick<EngineInteractionView, "status" | "actions">) {
      snapshot = { ...snapshot, interactionView: next } as GameSnapshot;
      for (const listener of listeners) listener();
    },
    setCommandBlocked(blocked: boolean) {
      if (blocked === commandBlocked) return;
      commandBlocked = blocked;
      for (const listener of commandGateListeners) listener();
    },
  };
}

function renderWith(
  value: GundamGameContextValue,
  setting: AutoPassWhenNoValidActionContextValue = {
    enabled: true,
    ready: true,
    setEnabled: () => undefined,
  },
): void {
  const tree: ReactNode = (
    <GundamAutoPassSettingsContext.Provider value={setting}>
      <GundamGameContext.Provider value={value}>
        <AutoPassActionStepContainer />
      </GundamGameContext.Provider>
    </GundamAutoPassSettingsContext.Provider>
  );
  render(tree);
}

describe("AutoPassActionStepContainer", () => {
  it("auto-passes with the automatic flag when the pass is the only real action", async () => {
    const harness = makeHarness({
      status: "ready",
      actions: [action("passActionStep"), action("concede")],
    });
    renderWith(harness.value);

    await waitFor(() => {
      expect(harness.submit).toHaveBeenCalledWith("passActionStep", { automatic: true });
    });
  });

  it("fires on a later state update, not only on mount", async () => {
    const harness = makeHarness({ status: "waiting", actions: [] });
    renderWith(harness.value);

    harness.setInteractionView({
      status: "ready",
      actions: [action("passActionStep"), action("concede")],
    });

    await waitFor(() => {
      expect(harness.submit).toHaveBeenCalledWith("passActionStep", { automatic: true });
    });
  });

  it("auto-passes even when resolveEffect is enumerated alongside the pass", async () => {
    // The engine enumerates `resolveEffect` with no `available()` gate,
    // so the interaction view always lists it during the action step.
    // Without pending effects it's a dead action and must not suppress
    // the auto-pass.
    const harness = makeHarness({
      status: "ready",
      actions: [action("passActionStep"), action("resolveEffect"), action("concede")],
    });
    renderWith(harness.value);

    await waitFor(() => {
      expect(harness.submit).toHaveBeenCalledWith("passActionStep", { automatic: true });
    });
  });

  it("auto-passes the Block Step only when no legal Blocker is available", async () => {
    const noBlocker = makeHarness({
      status: "ready",
      actions: [action("passBlock"), action("concede")],
    });
    renderWith(noBlocker.value);
    await waitFor(() => {
      expect(noBlocker.submit).toHaveBeenCalledWith("passBlock", { automatic: true });
    });

    const hasBlocker = makeHarness({
      status: "ready",
      actions: [action("passBlock"), action("declareBlock"), action("concede")],
    });
    renderWith(hasBlocker.value);
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(hasBlocker.submit).not.toHaveBeenCalled();
  });

  it("auto-passes a battle Action Step with no Action Command or Activate·Action effect", async () => {
    const harness = makeHarness({
      status: "ready",
      actions: [action("passBattleAction"), action("resolveEffect"), action("concede")],
    });
    renderWith(harness.value);

    await waitFor(() => {
      expect(harness.submit).toHaveBeenCalledWith("passBattleAction", { automatic: true });
    });
  });

  it("waits for animation command gating to settle before auto-passing", async () => {
    const harness = makeHarness({
      status: "ready",
      actions: [action("passBattleAction"), action("concede")],
    });
    harness.setCommandBlocked(true);
    renderWith(harness.value);

    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(harness.submit).not.toHaveBeenCalled();

    harness.setCommandBlocked(false);
    await waitFor(() => {
      expect(harness.submit).toHaveBeenCalledWith("passBattleAction", { automatic: true });
    });
  });

  it("rechecks animation gating after scheduling the automatic pass", async () => {
    const harness = makeHarness({
      status: "ready",
      actions: [action("passBattleAction"), action("concede")],
    });
    renderWith(harness.value);

    harness.setCommandBlocked(true);
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(harness.submit).not.toHaveBeenCalled();

    harness.setCommandBlocked(false);
    await waitFor(() => {
      expect(harness.submit).toHaveBeenCalledWith("passBattleAction", { automatic: true });
    });
  });

  it("retries the same interaction request when submission was rejected", async () => {
    const harness = makeHarness({
      status: "ready",
      actions: [action("passBattleAction"), action("concede")],
    });
    harness.submit.mockImplementationOnce(() => ({
      ok: false,
      errorCode: "animation-active",
      error: "Commands are blocked while the board transition is active.",
    }));
    renderWith(harness.value);

    await waitFor(() => expect(harness.submit).toHaveBeenCalledTimes(1));
    harness.setInteractionView({
      status: "ready",
      actions: [action("passBattleAction"), action("concede")],
    });

    await waitFor(() => expect(harness.submit).toHaveBeenCalledTimes(2));
    expect(harness.submit).toHaveBeenLastCalledWith("passBattleAction", { automatic: true });
  });

  it("stays manual when an action-step move is available", async () => {
    const harness = makeHarness({
      status: "ready",
      actions: [action("passActionStep"), action("playCommand"), action("concede")],
    });
    renderWith(harness.value);

    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(harness.submit).not.toHaveBeenCalled();
  });

  it("stays manual when activateAbility is available", async () => {
    const harness = makeHarness({
      status: "ready",
      actions: [action("passActionStep"), action("activateAbility"), action("concede")],
    });
    renderWith(harness.value);

    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(harness.submit).not.toHaveBeenCalled();
  });

  it("never auto-passes over a pending choice", async () => {
    const harness = makeHarness({
      status: "choosing",
      actions: [action("passActionStep")],
    });
    renderWith(harness.value);

    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(harness.submit).not.toHaveBeenCalled();
  });

  it("does nothing when the preference is disabled", async () => {
    const harness = makeHarness({
      status: "ready",
      actions: [action("passActionStep")],
    });
    renderWith(harness.value, {
      enabled: false,
      ready: true,
      setEnabled: () => undefined,
    });

    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(harness.submit).not.toHaveBeenCalled();
  });

  it("does nothing while the preference provider has not marked the setting ready", async () => {
    // Live matches previously mounted AutoPassActionStepContainer without
    // AutoPassWhenNoValidActionProvider. The context default keeps ready=false,
    // which must not silently auto-pass — but also documents that a missing
    // provider freezes automation until ready becomes true.
    const harness = makeHarness({
      status: "ready",
      actions: [action("passBlock"), action("concede")],
    });
    renderWith(harness.value, {
      enabled: true,
      ready: false,
      setEnabled: () => undefined,
    });

    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(harness.submit).not.toHaveBeenCalled();
  });

  it("never automates passTurn", async () => {
    const harness = makeHarness({
      status: "ready",
      actions: [action("passTurn"), action("concede")],
    });
    renderWith(harness.value);

    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(harness.submit).not.toHaveBeenCalled();
  });

  it("revalidates the same request before submitting", async () => {
    const harness = makeHarness({
      status: "ready",
      actions: [action("passActionStep")],
    });
    renderWith(harness.value);
    harness.setInteractionView({
      status: "ready",
      actions: [action("passActionStep"), action("playCommand")],
    });

    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(harness.submit).not.toHaveBeenCalled();
  });

  it("submits at most once for the same interaction request", async () => {
    const unchanged = {
      status: "ready" as const,
      actions: [action("passActionStep")],
    };
    const harness = makeHarness(unchanged);
    renderWith(harness.value);
    await waitFor(() => expect(harness.submit).toHaveBeenCalledTimes(1));

    harness.setInteractionView(unchanged);
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(harness.submit).toHaveBeenCalledTimes(1);
  });
});
