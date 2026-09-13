// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, screen, waitFor } from "@testing-library/react";
import { renderFabSimulatorScenario } from "./testing/render-fab-simulator";

afterEach(() => {
  cleanup();
  window.sessionStorage.removeItem("fab-practice:active-match:v1");
});

function interaction(card: HTMLElement) {
  return card.querySelector("[data-card-interaction]")?.getAttribute("data-card-interaction");
}

describe("UST multi-card board labs · prompt targeting", () => {
  it("highlights only hand Restless zombies for Acrid Stench, not arena or opposing copies", async () => {
    renderFabSimulatorScenario({ scenarioId: "usurp-zombie-choice-board" });
    await screen.findByTestId("fab-practice-page", {}, { timeout: 15_000 });

    const effect = screen.getByRole("region", { name: "Current effect" });
    expect(effect.textContent).toContain("Choose a card for Acrid Stench");

    const cleric = screen.getByRole("button", {
      name: /^Restless Cleric, card, player-1, Red pitch/,
    });
    const plowman = screen.getByRole("button", {
      name: /^Restless Plowman, card, player-1, Red pitch/,
    });
    expect(interaction(cleric)).toBe("actionable");
    expect(interaction(plowman)).toBe("actionable");

    const ownArena = screen.getByRole("region", { name: "Your arena" });
    const opponentArena = screen.getByRole("region", { name: "Opponent arena" });
    expect(ownArena.querySelector("[data-card-interaction='actionable']")).toBeNull();
    expect(opponentArena.querySelector("[data-card-interaction='actionable']")).toBeNull();
    expect(opponentArena.textContent).toContain("Restless Magister");
  }, 30_000);

  it("highlights every public Runechant for Murmuring Gloomblade Usurp", async () => {
    renderFabSimulatorScenario({ scenarioId: "usurp-gloomblade-usurp-board" });
    await screen.findByTestId("fab-practice-page", {}, { timeout: 15_000 });

    const effect = screen.getByRole("region", { name: "Current effect" });
    expect(effect.textContent).toMatch(/Murmuring Gloomblade/);

    const ownArena = screen.getByRole("region", { name: "Your arena" });
    const opponentArena = screen.getByRole("region", { name: "Opponent arena" });
    expect(ownArena.querySelectorAll("[data-card-interaction='actionable']").length).toBe(3);
    expect(opponentArena.querySelectorAll("[data-card-interaction='actionable']").length).toBe(1);
    expect(opponentArena.textContent).toContain("Runechant");
  }, 30_000);

  it("pitches an Instant card through the visible Shadowake payment prompt", async () => {
    renderFabSimulatorScenario({ scenarioId: "usurp-gloomblade-pitch-board" });
    await screen.findByTestId("fab-practice-page", {}, { timeout: 15_000 });

    const effect = screen.getByRole("region", { name: "Current effect" });
    expect(effect.textContent).toContain("Pitch a card to pay 2 remaining resources");
    const rites = screen.getByRole("button", {
      name: /^Rites of Nightfall, card, player-1, Blue pitch/,
    });
    expect(interaction(rites)).toBe("actionable");
    fireEvent.click(rites);

    await waitFor(() => {
      expect(screen.queryByText("Action not applied")).toBeNull();
      expect(screen.queryByRole("region", { name: "Current effect" })).toBeNull();
      expect(
        screen.queryByRole("button", {
          name: /^Rites of Nightfall, card, player-1, Blue pitch/,
        }),
      ).toBeNull();
      expect(screen.getByTestId("fab-practice-page").getAttribute("data-combat-step")).toBe(
        "damage",
      );
    });
  }, 30_000);
});
