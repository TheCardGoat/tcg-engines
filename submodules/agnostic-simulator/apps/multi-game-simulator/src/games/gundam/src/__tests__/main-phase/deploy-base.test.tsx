// @vitest-environment jsdom
import { describe, expect, it } from "vite-plus/test";
import { screen, waitFor, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { gd01Side7124, st01WhiteBase015 } from "@tcg/gundam-cards";

import { renderSimulator } from "../../test/renderSimulator.tsx";
import { createDevRuntime } from "../../game/dev-runtime.ts";
import { loadDeployBaseDemo } from "../../game/fixtures/deploy-base-demo.ts";
import { realResourceCards } from "../../game/fixtures/real-cards.ts";

/**
 * RTL port of `e2e/main-phase/deploy-base.spec.ts`.
 * Click a Base in hand → Base lands in the base section. deployBase
 * has no describeProcedure, so the simulator auto-submits on click.
 */
describe("Main-phase · Deploy Base", () => {
  it("clicking a Base in hand moves it to the base section", async () => {
    const user = userEvent.setup();
    renderSimulator(loadDeployBaseDemo);

    const hand = screen.getByRole("list", { name: /your hand/i });
    const baseInHand = within(hand).getByRole("listitem", { name: /White Base/i });

    const baseSection = screen.getByRole("region", { name: /your base/i });
    expect(within(baseSection).queryByRole("button", { name: /White Base/i })).toBeNull();

    await user.click(baseInHand);

    await waitFor(() => {
      expect(within(hand).queryByRole("listitem", { name: /White Base/i })).toBeNull();
      expect(within(baseSection).getByRole("button", { name: /White Base/i })).not.toBeNull();
    });
    expect(within(baseSection).getAllByRole("button", { name: /White Base/i })).toHaveLength(1);
  });

  it("lets the player select an existing Base for trash after deploying into an occupied section", async () => {
    const user = userEvent.setup();
    const establishedBase = st01WhiteBase015;
    const incomingBase = gd01Side7124;
    const { dev } = renderSimulator(() =>
      createDevRuntime({
        skipToMainPhase: true,
        p1: {
          hand: [incomingBase],
          baseSection: [establishedBase],
          resourceArea: realResourceCards(3),
          deck: 1,
        },
        p2: { deck: 1 },
      }),
    );
    const establishedBaseId =
      dev.runtime.getState().ctx.zones.private.zoneCards["baseSection:player_one"]?.[0];
    const incomingBaseId =
      dev.runtime.getState().ctx.zones.private.zoneCards["hand:player_one"]?.[0];
    if (!establishedBaseId || !incomingBaseId) {
      throw new Error("Expected the fixture to place both Bases before deployment");
    }

    await user.click(
      within(screen.getByRole("list", { name: /your hand/i })).getByRole("listitem", {
        name: new RegExp(incomingBase.name),
      }),
    );

    const baseSection = await screen.findByRole("region", { name: /your base section/i });
    const existingBaseButton = within(baseSection).getByRole("button", {
      name: establishedBase.name,
    });
    expect(existingBaseButton.dataset.targetingState).toBe("candidate");
    expect(within(baseSection).queryByRole("button", { name: incomingBase.name })).toBeNull();

    await user.click(existingBaseButton);

    await waitFor(() => {
      const state = dev.runtime.getState();
      const baseSectionIds = state.ctx.zones.private.zoneCards["baseSection:player_one"] ?? [];
      const trashIds = state.ctx.zones.private.zoneCards["trash:player_one"] ?? [];
      expect(baseSectionIds).toEqual([incomingBaseId]);
      expect(trashIds).toEqual([establishedBaseId]);
      expect(within(baseSection).getByRole("button", { name: incomingBase.name })).not.toBeNull();
      expect(within(baseSection).queryByRole("button", { name: establishedBase.name })).toBeNull();
    });
  });
});
