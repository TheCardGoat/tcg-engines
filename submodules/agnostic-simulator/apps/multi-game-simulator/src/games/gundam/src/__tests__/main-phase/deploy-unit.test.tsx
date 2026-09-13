// @vitest-environment jsdom
import { describe, expect, it } from "vite-plus/test";
import { screen, waitFor, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { renderSimulator } from "../../test/renderSimulator.tsx";
import { findCardsById } from "../../test/queries.ts";
import { createDevRuntime } from "../../game/dev-runtime.ts";
import { loadDeployUnitDemo } from "../../game/fixtures/deploy-unit-demo.ts";
import { realResourceCards, st01Gm005 } from "../../game/fixtures/real-cards.ts";
import { exrExResource001 } from "@tcg/gundam-token-data";

/**
 * RTL port of `e2e/main-phase/deploy-unit.spec.ts`.
 * Click a hand unit → Confirm → unit on the battle area + resource exhausts.
 *
 * Uses the purpose-built `deploy-unit-demo` fixture rather than
 * `main-phase-demo` (which is a visual playground and explicitly
 * documented as unsuitable for engine-correctness tests).
 */
describe("Main-phase · Deploy Unit", () => {
  it("clicking a hand unit deploys it and exhausts its cost", async () => {
    const user = userEvent.setup();
    renderSimulator(loadDeployUnitDemo);

    const hand = screen.getByRole("list", { name: /your hand/i });
    expect(within(hand).queryAllByRole("listitem")).toHaveLength(3);

    const gm = within(hand).getByRole("listitem", { name: /^GM \(cost 1\)$/i });
    const gmId = gm.querySelector<HTMLElement>("[data-card-id]")?.dataset.cardId;
    expect(gmId).toBeTruthy();
    await user.click(gm);

    await waitFor(() => {
      expect(findCardsById(gmId!, { excludeWithin: hand }).length).toBeGreaterThanOrEqual(1);
      expect(within(hand).queryAllByRole("listitem")).toHaveLength(2);
    });

    const onBattleArea = findCardsById(gmId!, { excludeWithin: hand });
    expect(onBattleArea.length).toBeGreaterThanOrEqual(1);

    const resources = screen.getByLabelText("Your resources");
    await waitFor(() => {
      expect(resources.textContent ?? "").toMatch(/2\s*\/\s*3/);
    });
  });

  it("runs the shared animation lifecycle before presenting the deployed unit", async () => {
    const motionTestGlobal = globalThis as typeof globalThis & {
      __TCG_TEST_DISABLE_SIMULATOR_MOTION__?: boolean;
    };
    const previousMotionSetting = motionTestGlobal.__TCG_TEST_DISABLE_SIMULATOR_MOTION__;
    motionTestGlobal.__TCG_TEST_DISABLE_SIMULATOR_MOTION__ = false;

    try {
      const user = userEvent.setup();
      const { dev } = renderSimulator(loadDeployUnitDemo);
      const hand = screen.getByRole("list", { name: /your hand/i });
      const gm = within(hand).getByRole("listitem", { name: /^GM \(cost 1\)$/i });

      await user.click(gm);

      await waitFor(() => {
        expect(
          dev.runtime
            .getPacketAnimationHistory()
            .some(
              (entry) =>
                entry.animation.data.kind === "cardMove" &&
                entry.animation.data.fromZone === "hand" &&
                entry.animation.data.toZone === "battleArea",
            ),
        ).toBe(true);
        expect(document.querySelector('[aria-busy="true"]')).not.toBeNull();
      });

      expect(
        dev.runtime
          .getPacketAnimationHistory()
          .map((entry) => entry.animation.data)
          .find((data) => data.kind === "cardMove"),
      ).toMatchObject({ kind: "cardMove", fromZone: "hand", toZone: "battleArea" });

      await waitFor(
        () => {
          expect(document.querySelector('[aria-busy="true"]')).toBeNull();
          expect(document.querySelector("[inert]")).toBeNull();
        },
        { timeout: 3_000 },
      );
    } finally {
      motionTestGlobal.__TCG_TEST_DISABLE_SIMULATOR_MOTION__ = previousMotionSetting;
    }
  });

  it("lets a phone player choose an EX Resource as the Unit payment", async () => {
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 390 });
    const user = userEvent.setup();
    const dev = createDevRuntime({
      skipToMainPhase: true,
      p1: {
        hand: [st01Gm005],
        resourceArea: [realResourceCards(1)[0]!, exrExResource001],
        deck: 30,
        resourceDeck: 10,
      },
      p2: { deck: 30, resourceDeck: 10 },
    });
    const resourceIds =
      dev.runtime.getState().ctx.zones.private.zoneCards["resourceArea:player_one"]!;
    const exResourceId = resourceIds[1]!;
    dev.runtime.getState().ctx.zones.private.cardMeta[exResourceId] = { isToken: true };

    renderSimulator(() => dev);
    window.dispatchEvent(new Event("resize"));

    const hand = screen.getByRole("list", { name: /your hand/i });
    const gm = within(hand).getByRole("listitem", { name: /^GM \(cost 1\)$/i });
    const gmId = gm.querySelector<HTMLElement>("[data-card-id]")?.dataset.cardId;
    expect(gmId).toBeTruthy();

    await user.click(gm);

    const exResource = await screen.findByRole("button", { name: /EX Resource 2, active/i });
    expect(exResource.dataset.cardId).toBe(exResourceId);
    await user.click(exResource);

    await waitFor(() => {
      expect(findCardsById(gmId!, { excludeWithin: hand }).length).toBeGreaterThanOrEqual(1);
      expect(screen.queryByRole("button", { name: /EX Resource 2, active/i })).toBeNull();
    });
  });
});
