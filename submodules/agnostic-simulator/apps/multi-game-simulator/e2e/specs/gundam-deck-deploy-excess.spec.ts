import { expect, test } from "@playwright/test";

test("deck deployment requires removing an existing Unit at the six-Unit limit", async ({
  page,
}) => {
  await page.goto("/gundam/simulator/tests/deck-deploy-excess-demo?ai=off");
  await page
    .getByRole("button", { name: "GQuuuuuuX (Omega Psycommu) (cost 5)", exact: true })
    .click();
  await page.getByRole("menuitem", { name: /Deploy Unit Pay/ }).click();
  await page.getByRole("button", { name: "Select card 3 for Deploy", exact: true }).click();
  await page.getByRole("button", { name: "Confirm", exact: true }).click();

  await expect(
    page.getByText("Choose 1 Unit in your battle area to place into your trash.", { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "PASS TURN", exact: true })).toHaveCount(0);
  await page
    .getByRole("button", {
      name: "GM, unit, blue, AP 2, HP 2, ready, earth federation",
      exact: true,
    })
    .click();

  await expect(
    page.getByText("GM moved from battle area to trash.", { exact: true }),
  ).toBeVisible();
  const battleArea = page.getByLabel("Your battle area drop zone", { exact: true });
  await expect(battleArea.getByRole("listitem")).toHaveCount(6);
  await expect(battleArea.getByRole("button", { name: /^Red Gundam, unit/ })).toBeVisible();
  await expect(page.getByRole("region", { name: "Current effect", exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "PASS TURN", exact: true })).toBeEnabled();
});
