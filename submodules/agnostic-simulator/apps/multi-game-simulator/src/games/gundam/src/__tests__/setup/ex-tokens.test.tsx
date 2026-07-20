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

    const yourBase = await screen.findByRole("region", { name: /your base section/i });
    const opponentBase = await screen.findByRole("region", { name: /opponent base section/i });
    expect(within(yourBase).getAllByRole("button", { name: /EX Base/i })).toHaveLength(1);
    expect(within(opponentBase).getAllByRole("button", { name: /EX Base/i })).toHaveLength(1);

    const opponentResources = await screen.findByRole("region", {
      name: /opponent resource area/i,
    });
    // Opponent resources render face-down, so the EX Resource name is
    // masked. The 01/01 counter proves exactly one token is seated.
    expect(opponentResources.textContent ?? "").toMatch(/01\s*\/\s*01/);
  });
});
