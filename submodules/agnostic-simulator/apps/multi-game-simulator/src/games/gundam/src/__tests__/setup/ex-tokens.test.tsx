// @vitest-environment jsdom
import { describe, expect, it } from "vite-plus/test";
import { screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { renderSimulator } from "../../test/renderSimulator.tsx";
import { loadSetupDefaultOpponentKeeps } from "../../game/fixtures/setup-default-opponent-keeps.ts";

/**
 * RTL port of `e2e/setup/ex-tokens.spec.ts`. Each player's base section
 * holds exactly one EX Base token (rule 6-2-3), and the opponent's resource
 * area holds their EX Resource (rule 6-2-4).
 */
describe("Setup · EX tokens", () => {
  it("each base section has one card and opponent resource area holds the EX Resource", async () => {
    const user = userEvent.setup();
    renderSimulator(loadSetupDefaultOpponentKeeps);

    await user.click(screen.getByRole("button", { name: /i go first/i }));
    await user.click(await screen.findByRole("button", { name: /keep hand/i }));

    const yourBase = await screen.findByRole("region", { name: /your base/i });
    const opponentBase = await screen.findByRole("region", { name: /opponent base/i });
    expect(within(yourBase).getAllByRole("listitem")).toHaveLength(1);
    expect(within(opponentBase).getAllByRole("listitem")).toHaveLength(1);

    const opponentResources = await screen.findByRole("region", {
      name: /opponent resource area/i,
    });
    expect(
      within(opponentResources).getByRole("listitem", { name: /EX Resource/i }),
    ).not.toBeNull();
  });
});
