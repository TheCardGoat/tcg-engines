// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, screen, waitFor, within } from "@testing-library/react";
import { renderFabSimulatorScenario } from "./testing/render-fab-simulator";

// Owns the shipped simulator interaction and history projection, not card rules.
afterEach(() => {
  cleanup();
  window.sessionStorage.removeItem("fab-practice:active-match:v1");
});
async function openFixture(slug: string) {
  renderFabSimulatorScenario({ scenarioId: `usurp-preview-${slug}` });
  await screen.findByTestId("fab-practice-page", {}, { timeout: 15_000 });
}
function interaction(card: HTMLElement) {
  return card.querySelector("[data-card-interaction]")?.getAttribute("data-card-interaction");
}
describe("Usurp preview interaction QA", () => {
  it("selects arena and hand costs directly, names rewards, and records their outcome", async () => {
    await openFixture("forsaken-strike-yellow");
    const zombie = screen.getByRole("button", {
      name: /^Restless Corporal, card, player-1, Power/,
    });
    expect(interaction(zombie)).toBe("actionable");
    const handZombie = screen.getByRole("button", {
      name: /^Restless Corporal, card, player-1, Red pitch/,
    });
    expect(interaction(handZombie)).not.toBe("actionable");
    fireEvent.click(zombie);
    await waitFor(() =>
      expect(screen.getByRole("region", { name: "Current effect" }).textContent).toContain(
        "cards to discard",
      ),
    );
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(interaction(handZombie)).toBe("actionable");
    fireEvent.click(handZombie);
    const gate = await screen.findByRole(
      "radio",
      {
        name: /^Create a Gate to i.*Arathael token$/,
      },
      { timeout: 5_000 },
    );
    expect(screen.getByRole("radio", { name: /^This gets go again$/ })).toBeDefined();
    fireEvent.click(gate);
    await waitFor(
      () =>
        expect(screen.getByRole("region", { name: "Current effect" }).textContent).toContain(
          "Choose mode 2 of 2",
        ),
      { timeout: 5_000 },
    );
    fireEvent.click(
      await screen.findByRole("radio", { name: /^This gets \+2/ }, { timeout: 5_000 }),
    );
    await waitFor(
      () => {
        const history = screen.getByRole("region", { name: "Match history" });
        expect(history.textContent).toContain("Forsaken Strike destroyed Restless Corporal");
        expect(history.textContent).toContain("Discarded Restless Corporal");
        expect(history.textContent).toContain("created Gate to i'Arathael");
        expect(history.textContent).toContain("hit Practice bot for 5");
        expect(history.textContent).not.toMatch(/player-[12]|undefined|\[object Object\]/);
      },
      { timeout: 5_000 },
    );
  }, 30_000);
  it("lets the player decline both optional costs without showing reward choices", async () => {
    await openFixture("forsaken-strike-yellow");
    fireEvent.click(screen.getByRole("button", { name: "Choose none" }));
    await waitFor(() =>
      expect(screen.getByRole("region", { name: "Current effect" }).textContent).toContain(
        "cards to discard",
      ),
    );
    fireEvent.click(screen.getByRole("button", { name: "Choose none" }));
    await waitFor(() =>
      expect(screen.getByRole("region", { name: "Match history" }).textContent).toContain(
        "played Forsaken Strike",
      ),
    );
    expect(screen.queryByRole("radio", { name: /Create a Gate to/ })).toBeNull();
    expect(screen.getByRole("region", { name: "Match history" }).textContent).not.toContain(
      "Discarded",
    );
    expect(
      within(screen.getByRole("region", { name: "Your arena" })).getAllByRole("button", {
        name: /^Restless Corporal, /,
      })[0],
    ).toBeDefined();
  }, 30_000);
  it("highlights every Runechant in play for Usurp and resolves it with one board click", async () => {
    await openFixture("runic-reaving-red");
    // UST Usurp pays with any public arena Runechant, regardless of
    // controller — the opponent's Runechant is a legal payment too.
    const ownArena = screen.getByRole("region", { name: "Your arena" });
    const opponentArena = screen.getByRole("region", { name: "Opponent arena" });
    const own = ownArena.querySelectorAll<HTMLElement>("[data-card-interaction='actionable']");
    const opposing = opponentArena.querySelectorAll<HTMLElement>(
      "[data-card-interaction='actionable']",
    );
    expect(own).toHaveLength(2);
    expect(opposing).toHaveLength(1);
    // Pay Usurp with the opponent's Runechant, straight from the board.
    fireEvent.click(opposing[0]!);
    await waitFor(() =>
      expect(screen.getByRole("region", { name: "Match history" }).textContent).toContain(
        "destroyed Runechant to usurp",
      ),
    );
    // The destroyed payment was the opponent's Runechant; the own pair remains.
    expect(
      within(screen.getByRole("region", { name: "Opponent arena" })).queryByRole("button", {
        name: /^Runechant, /,
      }),
    ).toBeNull();
    expect(
      within(screen.getByRole("region", { name: "Your arena" })).getAllByRole("button", {
        name: /^Runechant, /,
      }).length,
    ).toBeGreaterThan(0);
    expect(screen.queryByRole("dialog")).toBeNull();
  }, 30_000);
  it.each(["desktop", "mobile"] as const)(
    "filters the banished picker by owner and commits one selection on %s",
    async (layout) => {
      renderFabSimulatorScenario({ scenarioId: "usurp-preview-restless-corporal-red", layout });
      const picker = await screen.findByRole(
        "dialog",
        { name: "Choose from your banished" },
        { timeout: 15_000 },
      );
      expect(
        within(picker).getAllByRole("button", { name: /^Hellbound Assault, card, player-1,/ }),
      ).toHaveLength(2);
      expect(within(picker).queryByRole("button", { name: /player-2/ })).toBeNull();
      fireEvent.click(
        within(picker).getByRole("button", {
          name: /^Hellbound Assault, card, player-1, Blue pitch/,
        }),
      );
      await waitFor(() =>
        expect(screen.queryByRole("dialog", { name: "Choose from your banished" })).toBeNull(),
      );
      await screen.findByRole("button", { name: /(?:Inspect |Your )?Graveyard, 1 card/i });
      expect(screen.queryByRole("button", { name: "Confirm choice" })).toBeNull();
    },
    30_000,
  );
});
