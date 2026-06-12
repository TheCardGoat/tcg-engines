import { test, expect } from "../fixtures/test";
import type { SimulatorPage } from "../poms/SimulatorPage";

test.describe("Afterparty at Lizzie's", () => {
  test("adjusts the selected rival Gig up or down from the inline choice controls", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("progAfterpartyAtLizzies");

    const player = await simulator.getActivePlayerId();
    const rival = await simulator.getOpponentOf(player);

    const firstD12 = await chooseAfterpartyAdjustment(simulator, "d6", "d12", "+2 to 12");
    await simulator.expectLastDispatch({ type: "resolveAdjustGig", value: 12, as: player });
    await simulator.expectGigFaceValue(rival, "d12", 12);
    await expect(
      simulator.page.getByText("Selected D12 for Afterparty at Lizzie's."),
    ).toBeVisible();
    await expect(simulator.page.getByText("Adjusted D12 from 10 to 12.")).toBeVisible();
    await simulator.page
      .locator(`[data-testid="gig-log-token"][data-die-id="${firstD12.id}"]`)
      .last()
      .hover();
    await expect(simulator.opponentBoard.gigDieByType("d12")).toHaveAttribute(
      "data-log-highlight",
      "true",
    );
    expect(await simulator.getPendingChoiceType(player)).toBeNull();

    await simulator.page.reload();
    await expect(simulator.playerBoard.root).toBeVisible();
    await simulator.page.waitForFunction(() =>
      Boolean((window as unknown as { __cyberpunkEngine?: unknown }).__cyberpunkEngine),
    );

    const secondD12 = await chooseAfterpartyAdjustment(simulator, "d6", "d12", "-2 to 8");
    expect(secondD12.id).toBe(firstD12.id);
    await simulator.expectLastDispatch({ type: "resolveAdjustGig", value: 8, as: player });
    await simulator.expectGigFaceValue(rival, "d12", 8);
    await expect(simulator.page.getByText("Adjusted D12 from 10 to 8.")).toBeVisible();
    expect(await simulator.getPendingChoiceType(player)).toBeNull();
  });
});

async function chooseAfterpartyAdjustment(
  simulator: SimulatorPage,
  initialDieType: string,
  finalDieType: string,
  label: string,
): Promise<{ id: string; dieType: string; faceValue: number }> {
  await simulator.playerPrompt.verbButton("playCard").click();

  const afterparty = simulator.playerBoard.handZone.getByRole("button", {
    name: "Afterparty at Lizzie's",
  });
  await expect(afterparty).toHaveCount(1);

  await simulator.clearDispatchLog();
  await afterparty.click();
  await simulator.expectLastDispatch({ type: "playCard" });
  await simulator.playerPrompt.expectState("select-target");
  const rival = await simulator.getOpponentOf(await simulator.getActivePlayerId());
  const dice = await simulator.getGigDice(rival);
  const initialDie = dice.find((die) => die.dieType === initialDieType);
  const targetDie = dice.find((die) => die.dieType === finalDieType);
  expect(initialDie, `expected rival ${initialDieType}`).toBeDefined();
  expect(targetDie, `expected rival ${finalDieType}`).toBeDefined();

  await expect(simulator.opponentBoard.gigDieByType(initialDieType)).toHaveAttribute(
    "aria-label",
    `Select ${initialDieType.toUpperCase()}, showing ${initialDie!.faceValue}`,
  );

  await simulator.clearDispatchLog();
  await simulator.opponentBoard.gigDieByType(initialDieType).click({ force: true });
  await expect(simulator.page.getByTestId("gig-adjust-panel")).toHaveAttribute(
    "aria-label",
    `Adjust ${initialDieType.toUpperCase()}`,
  );

  await simulator.opponentBoard.gigDieByType(finalDieType).click({ force: true });
  await expect(simulator.page.getByTestId("gig-adjust-panel")).toHaveAttribute(
    "aria-label",
    `Adjust ${finalDieType.toUpperCase()}`,
  );

  await expect(simulator.page.getByRole("dialog")).toHaveCount(0);
  await expect(simulator.page.getByTestId("gig-adjust-panel")).toBeVisible();

  await simulator.clearDispatchLog();
  await simulator.page.getByRole("button", { name: label }).click();
  return targetDie!;
}
