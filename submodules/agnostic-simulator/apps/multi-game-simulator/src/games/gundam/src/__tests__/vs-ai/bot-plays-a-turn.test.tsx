// @vitest-environment jsdom
import { describe, expect, it } from "vite-plus/test";
import { screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { renderSimulator } from "../../test/renderSimulator.tsx";
import { loadVsAiDemo } from "../../game/fixtures/vs-ai-demo.ts";

/**
 * RTL port of `e2e/vs-ai/bot-plays-a-turn.spec.ts`. Full bot pipeline:
 * after the viewer passes turn, the strategy bot takes over player_two,
 * runs its actions (draw → resource → any deploys → passTurn), and
 * eventually hands control back.
 *
 * Real timers + wide `waitFor` windows — fake timers deadlock against
 * the engine adapter's `queueMicrotask` subscriber loop (see
 * `submit-error-toast.test.tsx` / `multi-turn-exhaust-ready.test.tsx`).
 */
describe("vs-AI · bot plays its own turn", () => {
  it("passing the viewer's turn surrenders priority, bot acts, eventually returns priority to viewer", async () => {
    const user = userEvent.setup();
    renderSimulator(loadVsAiDemo);

    // The unified PriorityActionButton's label changes with phase
    // (PASS TURN / PASS BLOCK / PASS ACTION / WAITING), so we query by
    // the stable `primary-action` testid rather than by accessible name.
    // Re-querying inside each waitFor matters: if the button is unmounted
    // and remounted across turn boundaries, a held reference would be
    // detached and `.disabled` would read stale.
    const findPrimary = () => screen.getByTestId("primary-action") as HTMLButtonElement;

    const passTurn = await screen.findByTestId("primary-action");
    expect((passTurn as HTMLButtonElement).disabled).toBe(false);

    await user.click(passTurn);

    // Bot runs its turn and hands priority back — button re-enables
    // only when `activePlayer` flips back to the viewer.
    await waitFor(
      () => {
        expect(findPrimary().disabled).toBe(false);
      },
      { timeout: 15_000 },
    );
  }, 25_000);
});
