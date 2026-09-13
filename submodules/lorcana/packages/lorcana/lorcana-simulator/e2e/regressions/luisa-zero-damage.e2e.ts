import {
  buildRegressionFixturePath,
  expect,
  findCardIdByLabel,
  LorcanaSimulatorPom,
  test,
} from "../support/lorcana-test.js";

test("Luisa can move zero from an undamaged character and continue her next effect", async ({
  page,
}, testInfo) => {
  await page.goto(
    buildRegressionFixturePath("luisa-zero-with-damaged-alternative", { view: "playerOne" }),
  );
  await page
    .getByRole("button", { name: "Luisa Madrigal - Confident Climber, cost 5", exact: true })
    .first()
    .click();
  await page.getByRole("menuitem", { name: /^I CAN TAKE IT/ }).click();
  await page.getByRole("button", { name: "Open target selector", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog
    .getByRole("button", { name: "Toggle selection for Mickey Mouse - True Friend", exact: true })
    .click();
  // Single-target selections auto-confirm by default, including a legal zero.
  await expect(dialog).toHaveCount(0);
  await page.getByRole("button", { name: "Open target selector", exact: true }).click();
  await expect(dialog).toBeVisible();
  await dialog
    .getByRole("button", { name: "Toggle selection for Chief Tui - Respected Leader", exact: true })
    .click();
  await expect(dialog).toHaveCount(0);
  const pom = new LorcanaSimulatorPom(page);
  await expect
    .poll(async () => (await pom.getBoard("authoritative")).pendingEffects.length)
    .toBe(0);
  const board = await pom.getBoard("authoritative");
  const luisa = findCardIdByLabel(
    board,
    "player_one",
    "play",
    "Luisa Madrigal - Confident Climber",
  );
  const ownTui = findCardIdByLabel(board, "player_one", "play", "Chief Tui - Respected Leader");
  const opposingTui = findCardIdByLabel(
    board,
    "player_two",
    "play",
    "Chief Tui - Respected Leader",
  );
  expect(board.cards[luisa]?.damage).toBe(0);
  expect(board.cards[ownTui]?.damage).toBe(1);
  expect(board.cards[opposingTui]?.damage).toBe(3);
  await testInfo.attach("resolved", {
    body: await page.screenshot({ path: testInfo.outputPath("resolved.png") }),
    contentType: "image/png",
  });
});
