// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, screen, waitFor, within } from "@testing-library/react";
import { renderFabSimulatorScenario } from "./testing/render-fab-simulator";

// Owns real DOM selection, reward progress, target affordances, and rendered logs.
afterEach(() => {
  cleanup();
  window.sessionStorage.removeItem("fab-practice:active-match:v1");
});
const names = ["Restless Corporal", "Restless Cleric", "Restless Magister"];
const currentEffect = () => screen.getByRole("region", { name: "Current effect" });
function interaction(card: HTMLElement) {
  return card.querySelector("[data-card-interaction]")?.getAttribute("data-card-interaction");
}

describe("Forsaken Strike — six-reward interaction", () => {
  it.each(["desktop", "mobile"] as const)(
    "selects each cost, supports deselection, and resolves all six choices on %s",
    async (layout) => {
      const { pom } = renderFabSimulatorScenario({
        scenarioId: "forsaken-strike-six-rewards",
        layout,
      });
      await screen.findByTestId("fab-practice-page", {}, { timeout: 15_000 });
      if (layout === "mobile") {
        fireEvent.click(within(currentEffect()).getByRole("button", { name: "Choose card" }));
        const picker = await screen.findByRole("dialog", { name: "Available choices" });
        expect(within(picker).queryByLabelText(/player-2/)).toBeNull();
        expect(within(picker).queryByRole("button", { name: /^Cintari Sellsword/ })).toBeNull();
        for (const name of names) {
          fireEvent.click(within(picker).getByRole("button", { name }));
        }
        fireEvent.click(within(picker).getByRole("button", { name: "Close available choices" }));
        fireEvent.click(within(currentEffect()).getByRole("button", { name: "Confirm" }));
      } else {
        const arena = screen.getByRole("region", { name: "Your arena" });
        const opponent = screen.getByRole("region", { name: "Opponent arena" });
        const ownZombies = names.map((name) =>
          within(arena).getByRole("button", { name: new RegExp(`^${name}, card, player-1,`) }),
        );
        const opposingZombie = within(opponent).getAllByRole("button", {
          name: /^Restless Corporal,/,
        })[0]!;
        const sellsword = within(arena).getAllByRole("button", { name: /^Cintari Sellsword/ })[0]!;
        expect(interaction(opposingZombie)).not.toBe("actionable");
        expect(interaction(sellsword)).not.toBe("actionable");
        for (const card of ownZombies) {
          expect(interaction(card)).toBe("actionable");
          fireEvent.click(card);
        }
        expect(
          within(currentEffect()).getByRole("status", { name: /3 of 3 selected/ }),
        ).toBeDefined();
        fireEvent.click(ownZombies[0]!);
        expect(
          within(currentEffect()).getByRole("status", { name: /2 of 3 selected/ }),
        ).toBeDefined();
        fireEvent.click(ownZombies[0]!);
        fireEvent.click(within(currentEffect()).getByRole("button", { name: "Confirm" }));
      }
      await waitFor(() => expect(currentEffect().textContent).toContain("cards to discard"));
      const snatch = screen.getByRole("button", { name: /^Snatch, card, player-1,/ });
      expect(interaction(snatch)).not.toBe("actionable");
      for (const name of names) {
        const card = screen.getByRole("button", {
          name: new RegExp(`^${name}, card, player-1, Red pitch`),
        });
        expect(interaction(card)).toBe("actionable");
        fireEvent.click(card);
      }
      fireEvent.click(within(currentEffect()).getByRole("button", { name: "Confirm" }));

      const rewards = [
        /^This gets \+2/,
        /^Create a Gate to/,
        /^This gets \+2/,
        /^Create a Gate to/,
        /^This gets go again$/,
        /^This gets \+2/,
      ];
      for (const [index, name] of rewards.entries()) {
        await waitFor(
          () => expect(currentEffect().textContent).toContain(`Choose mode ${index + 1} of 6`),
          { timeout: 5_000 },
        );
        fireEvent.click(within(currentEffect()).getByRole("radio", { name }));
      }
      await screen.findByTestId("fab-combat-chain", {}, { timeout: 5_000 });
      await pom.resolveRestOfCombat();
      expect(screen.queryByRole("region", { name: "Current effect" })).toBeNull();
      const arena = screen.getByRole("region", {
        name: layout === "mobile" ? "Your permanents" : "Your arena",
      });
      expect(within(arena).getAllByRole("button", { name: /^Cintari Sellsword/ })[0]).toBeDefined();
      // resolveRestOfCombat switches the desktop activity panel to the Now
      // tab; reopen the history surface for the narrative assertions. The
      // collapsed mobile panel exposes an open button instead of tabs.
      if (layout === "desktop") {
        fireEvent.click(screen.getByRole("tab", { name: "History" }));
      } else {
        const openHistory = screen.queryByRole("button", { name: "Open match history" });
        if (openHistory) fireEvent.click(openHistory);
        const historyTab = screen.queryByRole("tab", { name: "History" });
        if (historyTab) fireEvent.click(historyTab);
      }
      await waitFor(
        () => {
          const history = screen.getByRole("region", { name: "Match history" }).textContent ?? "";
          expect(history).toContain("hit Practice bot for 9");
          for (const name of names) {
            expect(history).toContain(`Forsaken Strike destroyed ${name}`);
            expect(history).toContain(`Discarded ${name}`);
          }
          expect(history.match(/created Gate to i'Arathael/g)).toHaveLength(2);
          expect(history).not.toMatch(/player-[12]|undefined|\[object Object\]/);
        },
        { timeout: 5_000 },
      );
    },
    30_000,
  );
});
