import { describe, expect, it } from "bun:test";

import {
  shouldAutoOpenPendingEffects,
  shouldDefaultPendingEffectsCollapsed,
} from "@/features/simulator/panels/pending-effects-popover-state.js";

describe("pending effects popover state", () => {
  it("defaults to collapsed when there is exactly one queued item", () => {
    expect(
      shouldDefaultPendingEffectsCollapsed({
        itemCount: 1,
        hasOpponentItems: false,
      }),
    ).toBe(true);
  });

  it("defaults to collapsed when an overlay is active", () => {
    expect(
      shouldDefaultPendingEffectsCollapsed({
        itemCount: 1,
        hasOpponentItems: false,
        hasActiveOverlay: true,
      }),
    ).toBe(true);
    expect(
      shouldDefaultPendingEffectsCollapsed({
        itemCount: 3,
        hasOpponentItems: false,
        hasActiveOverlay: true,
      }),
    ).toBe(true);
  });

  it("does not default to collapsed when no overlay is active and queue has multiple items", () => {
    expect(
      shouldDefaultPendingEffectsCollapsed({
        itemCount: 2,
        hasOpponentItems: false,
      }),
    ).toBe(false);
    expect(
      shouldDefaultPendingEffectsCollapsed({
        itemCount: 3,
        hasOpponentItems: false,
        hasActiveOverlay: false,
      }),
    ).toBe(false);
  });

  it("does not default to collapsed for larger queues", () => {
    expect(
      shouldDefaultPendingEffectsCollapsed({
        itemCount: 2,
        hasOpponentItems: false,
      }),
    ).toBe(false);
    expect(
      shouldDefaultPendingEffectsCollapsed({
        itemCount: 3,
        hasOpponentItems: false,
      }),
    ).toBe(false);
  });

  it("does not default to collapsed when there are opponent items, even for a single item", () => {
    expect(
      shouldDefaultPendingEffectsCollapsed({
        itemCount: 1,
        hasOpponentItems: true,
      }),
    ).toBe(false);
    expect(
      shouldDefaultPendingEffectsCollapsed({
        itemCount: 2,
        hasOpponentItems: true,
      }),
    ).toBe(false);
  });

  it("defaults to collapsed when overlay is active, even with opponent items", () => {
    expect(
      shouldDefaultPendingEffectsCollapsed({
        itemCount: 2,
        hasOpponentItems: true,
        hasActiveOverlay: true,
      }),
    ).toBe(true);
  });

  it("auto-opens when a non-collapsed queue first appears", () => {
    expect(
      shouldAutoOpenPendingEffects({
        itemCount: 3,
        bagCount: 1,
        pendingCount: 2,
        hasOpponentItems: false,
        actionableSignature: "pending:1:resolve|pending:2:resolve",
        previousItemCount: 0,
        previousActionableSignature: "",
        localPlayerIsActive: false,
      }),
    ).toBe(true);
  });

  it("stays collapsed for single-item queues even when actionable content changes", () => {
    expect(
      shouldAutoOpenPendingEffects({
        itemCount: 1,
        bagCount: 0,
        pendingCount: 1,
        hasOpponentItems: false,
        actionableSignature: "pending:1:resolve",
        previousItemCount: 0,
        previousActionableSignature: "",
        localPlayerIsActive: false,
      }),
    ).toBe(false);

    expect(
      shouldAutoOpenPendingEffects({
        itemCount: 1,
        bagCount: 0,
        pendingCount: 1,
        hasOpponentItems: false,
        actionableSignature: "pending:1:accept",
        previousItemCount: 1,
        previousActionableSignature: "pending:1:resolve",
        localPlayerIsActive: false,
      }),
    ).toBe(false);
  });

  it("auto-opens for multi-item chains when actionable content changes", () => {
    expect(
      shouldAutoOpenPendingEffects({
        itemCount: 2,
        bagCount: 1,
        pendingCount: 1,
        hasOpponentItems: false,
        actionableSignature: "bag:1:resolve|pending:1:resolve",
        previousItemCount: 2,
        previousActionableSignature: "bag:1:resolve",
        localPlayerIsActive: false,
      }),
    ).toBe(true);
  });

  it("auto-opens when actionable content changes for expanded multi-item queues", () => {
    expect(
      shouldAutoOpenPendingEffects({
        itemCount: 3,
        bagCount: 1,
        pendingCount: 2,
        hasOpponentItems: false,
        actionableSignature: "bag:1:resolve|pending:1:resolve|pending:2:accept",
        previousItemCount: 3,
        previousActionableSignature: "bag:1:resolve|pending:1:resolve",
        localPlayerIsActive: false,
      }),
    ).toBe(true);
  });

  it("auto-opens when opponent items appear in a queue that would otherwise be collapsed", () => {
    expect(
      shouldAutoOpenPendingEffects({
        itemCount: 1,
        bagCount: 0,
        pendingCount: 1,
        hasOpponentItems: true,
        actionableSignature: "",
        previousItemCount: 0,
        previousActionableSignature: "",
        localPlayerIsActive: false,
      }),
    ).toBe(true);
  });

  it("does not auto-open when the local player is the active resolver", () => {
    expect(
      shouldAutoOpenPendingEffects({
        itemCount: 3,
        bagCount: 1,
        pendingCount: 2,
        hasOpponentItems: false,
        actionableSignature: "pending:1:resolve|pending:2:resolve",
        previousItemCount: 0,
        previousActionableSignature: "",
        localPlayerIsActive: true,
      }),
    ).toBe(false);
  });

  it("auto-opens for the non-active player with the same queue", () => {
    expect(
      shouldAutoOpenPendingEffects({
        itemCount: 3,
        bagCount: 1,
        pendingCount: 2,
        hasOpponentItems: false,
        actionableSignature: "pending:1:resolve|pending:2:resolve",
        previousItemCount: 0,
        previousActionableSignature: "",
        localPlayerIsActive: false,
      }),
    ).toBe(true);
  });

  it("does not auto-open when an overlay is active, even for multi-item queues with new content", () => {
    expect(
      shouldAutoOpenPendingEffects({
        itemCount: 3,
        bagCount: 1,
        pendingCount: 2,
        hasOpponentItems: false,
        actionableSignature: "pending:1:resolve|pending:2:resolve",
        previousItemCount: 0,
        previousActionableSignature: "",
        localPlayerIsActive: false,
        hasActiveOverlay: true,
      }),
    ).toBe(false);

    expect(
      shouldAutoOpenPendingEffects({
        itemCount: 2,
        bagCount: 1,
        pendingCount: 1,
        hasOpponentItems: false,
        actionableSignature: "bag:1:resolve|pending:1:resolve",
        previousItemCount: 1,
        previousActionableSignature: "pending:1:resolve",
        localPlayerIsActive: false,
        hasActiveOverlay: true,
      }),
    ).toBe(false);
  });
});
