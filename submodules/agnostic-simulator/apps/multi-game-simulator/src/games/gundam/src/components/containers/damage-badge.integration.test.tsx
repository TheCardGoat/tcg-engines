// @vitest-environment jsdom
import { describe, expect, it } from "vite-plus/test";
import { waitFor } from "@testing-library/react";
import { asPlayerId, type PlayerId } from "@tcg/gundam-engine";

import { renderSimulator } from "../../test/renderSimulator.tsx";
import { findCardsById, findInstanceIdsByName } from "../../test/queries.ts";
import { loadBlockStepDemo } from "../../game/fixtures/block-step-demo.ts";
import { DEV_PLAYER_ONE } from "../../game/dev-runtime.ts";

/**
 * End-to-end coverage for the damage badge. The code path has existed
 * since the original CardFace rewrite, but we've never had a test that
 * landed a survivor with damage and asserted the badge is painted —
 * regressions in the `G.damage` plumbing (keyed by `data-card-id`) would
 * otherwise only surface in manual QA.
 *
 * Fixture: `block-step-demo` lands the viewer mid-attack as the defender
 * (Zaku II AP 2 vs. GM Jim HP 3). When the viewer passes block, the
 * attack resolves for 2 damage; Jim survives with 1 HP remaining.
 */
describe("Damage badge · integration", () => {
  it("renders the damage badge on a unit that survived an attack", async () => {
    const { dev } = renderSimulator(loadBlockStepDemo);
    const p1 = asPlayerId(DEV_PLAYER_ONE) as PlayerId;

    const jimIds = findInstanceIdsByName(dev, /GM Jim/);
    expect(jimIds.length).toBeGreaterThanOrEqual(1);
    const jimId = jimIds[0]!;

    // Viewer is defender at block-step; pass it to let the attack land.
    const state = dev.runtime.getState();
    const result = dev.runtime.executeCommand(
      {
        commandID: crypto.randomUUID(),
        move: "passBlock",
        prevStateID: state.ctx._stateID,
        actorRole: "player",
        args: {},
      },
      p1,
    );
    expect(result.success, `passBlock rejected: ${JSON.stringify(result)}`).toBe(true);

    // Block-step → action-step. Both players hold priority; the viewer
    // still has to pass to drain the action-step before damage resolves
    // (the auto-pass bot handles p2 only).
    const afterBlockState = dev.runtime.getState();
    const actionStepResult = dev.runtime.executeCommand(
      {
        commandID: crypto.randomUUID(),
        move: "passActionStep",
        prevStateID: afterBlockState.ctx._stateID,
        actorRole: "player",
        args: {},
      },
      p1,
    );
    expect(
      actionStepResult.success,
      `passActionStep rejected: ${JSON.stringify(actionStepResult)}`,
    ).toBe(true);

    // Damage resolution is the next step the engine runs; wait for the
    // engine G.damage map to carry Jim's 2-damage hit (the auto-pass bot
    // closes out p2's pass on the same phase).
    await waitFor(() => {
      const G = dev.runtime.getState().G as { damage?: Record<string, number> };
      expect(G.damage?.[jimId]).toBe(2);
    });

    // Engine's damage map now carries the dealt damage (2 ≤ HP 3, so Jim
    // survives). Wait for the projection to propagate through React.
    await waitFor(() => {
      const node = findCardsById(jimId)[0];
      expect(node, "expected Jim's card face in the DOM").toBeDefined();
      const damageCounter = node!.querySelector(
        "[data-testid='card-overlay-badge'][data-overlay-badge-label='2 DMG']",
      );
      expect(damageCounter).not.toBeNull();
      expect(damageCounter!.textContent).toBe("2 DMG");
      expect(damageCounter!.getAttribute("aria-label")).toBe("2 DMG");
    });
  });
});
