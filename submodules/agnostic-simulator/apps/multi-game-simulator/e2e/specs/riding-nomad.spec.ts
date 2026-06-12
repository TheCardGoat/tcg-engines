import { test, expect } from "../fixtures/test";

const moveLog = (text: string) => `div[role="log"][aria-live="polite"]:has-text("${text}")`;

test.describe("Riding Nomad", () => {
  test("plays through the UI and attacks a spent rival unit on the turn it was played", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("unitRidingNomad");
    const player = await simulator.getActivePlayerId();

    await simulator.playerPrompt.expectState("select-action");
    await expect(simulator.playerPrompt.verbButton("playCard")).toBeVisible();
    await expect(
      simulator.playerBoard.handZone.locator(
        '[data-testid="hand-card"][data-card-name="Riding Nomad"]',
      ),
    ).toBeVisible();

    await simulator.playerPrompt.verbButton("playCard").click();
    const nomadInHand = simulator.playerBoard.handZone.locator(
      '[data-testid="hand-card"][data-card-name="Riding Nomad"] [data-interaction-state]',
    );
    await expect(nomadInHand).toHaveAttribute("data-interaction-state", "selectable");

    await simulator.clearDispatchLog();
    await nomadInHand.click();
    await simulator.expectLastDispatch({ type: "playCard", as: player });
    await expect(
      simulator.playerBoard.fieldZone.locator(
        '[data-testid="field-unit"][data-card-name="Riding Nomad"]',
      ),
    ).toBeVisible();
    await expect(simulator.page.locator(moveLog("Played Riding Nomad"))).toBeVisible();

    await simulator.playerPrompt.verbButton("passPhase").click();
    await simulator.playerPrompt.expectState("select-action");

    const nomadAttacker = simulator.playerBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="Riding Nomad"] [data-interaction-state]',
    );
    await expect(nomadAttacker).toHaveAttribute("data-interaction-state", "armable");

    await nomadAttacker.dispatchEvent("click");
    const actionMenu = simulator.page.locator('[data-testid="card-action-menu"]');
    await expect(actionMenu.locator('[data-testid="card-action-attackUnit"]')).toBeVisible();
    await actionMenu.locator('[data-testid="card-action-attackUnit"]').click();
    await expect(nomadAttacker).toHaveAttribute("data-selected", "true");

    const spentCorpoSecurity = simulator.opponentBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="Corpo Security"][data-spent="true"] [data-interaction-state]',
    );
    await expect(spentCorpoSecurity).toHaveAttribute("data-interaction-state", "selectable");

    await simulator.clearDispatchLog();
    await spentCorpoSecurity.click();
    await simulator.expectDispatch({ type: "attackUnit", as: player });
    await expect(
      simulator.page.locator(moveLog("FIGHT declared: Riding Nomad vs Corpo Security.")),
    ).toBeVisible();
    await expect(
      simulator.playerBoard.fieldZone.locator(
        '[data-testid="field-unit"][data-card-name="Riding Nomad"]',
      ),
    ).toHaveAttribute("data-spent", "true");
  });
});
