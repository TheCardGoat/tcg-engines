import { expect, test } from "@playwright/test";

test("Red Gundam can attack on its deployment turn after linking with Shuji Itō", async ({
  page,
}) => {
  await page.goto("/gundam/simulator/tests/red-gundam-shuji-link-demo?ai=off");
  await page.getByRole("button", { name: "Red Gundam (cost 2)", exact: true }).click();
  await page.getByRole("menuitem", { name: /Deploy Unit Pay/ }).click();
  await expect(page.getByRole("button", { name: "NO ATK", exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Shuji Itō (cost 1)", exact: true }).click();
  await page.getByRole("menuitem", { name: /Pair Pilot Pair/ }).click();
  await page
    .getByRole("button", {
      name: "Red Gundam, Link Condition met, unit, green, AP 3, HP 4, ready, clan",
      exact: true,
    })
    .click();

  await expect(page.getByRole("button", { name: "LINKED", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "NO ATK", exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "AP 4 (+1)", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "HP 6 (+2)", exact: true })).toBeVisible();
  await page
    .getByRole("button", { name: "Red Gundam actions; drag to attack", exact: true })
    .click();
  await page.getByRole("menuitem", { name: /Attack player The top Shield/ }).click();

  const prompt = page.getByRole("dialog", { name: "Shuji Itō — Attack", exact: true });
  await expect(prompt).toBeVisible();
  await prompt.getByRole("button", { name: "Top of Deck", exact: true }).click();
  await prompt.getByRole("button", { name: "Confirm", exact: true }).click();
  await expect(prompt).toHaveCount(0);
  await expect(page.getByText("Attacked direct with Red Gundam.", { exact: true })).toBeVisible();
  await expect(page.getByText("Finished resolving Shuji Itō.", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("listitem", { name: "Block Step, current", exact: true }),
  ).toBeVisible();
});
