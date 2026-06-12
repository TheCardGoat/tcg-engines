// @vitest-environment jsdom
import { describe, expect, it } from "vite-plus/test";
import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { renderSimulator } from "../../test/renderSimulator.tsx";
import { loadSetupDefaultOpponentKeeps } from "../../game/fixtures/setup-default-opponent-keeps.ts";

/**
 * RTL port of `e2e/setup/shields.spec.ts`. Verifies that after both players
 * mulligan, each shield area renders exactly 6 cards (rule 6-2-2).
 */
describe("Setup · shields populated", () => {
  it("both shield areas show six shields after mulligan exit", async () => {
    const user = userEvent.setup();
    renderSimulator(loadSetupDefaultOpponentKeeps);

    await user.click(screen.getByRole("button", { name: /i go first/i }));
    await user.click(await screen.findByRole("button", { name: /keep hand/i }));

    const yourShields = await screen.findByRole("region", { name: /your shields/i });
    const opponentShields = await screen.findByRole("region", { name: /opponent shields/i });

    expect(yourShields.textContent ?? "").toMatch(/Card zone\s*\(6\)/i);
    expect(opponentShields.textContent ?? "").toMatch(/Card zone\s*\(6\)/i);
  });
});
