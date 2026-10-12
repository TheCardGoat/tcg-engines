import { expect, test } from "@playwright/test";
import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { CYBERPUNK_P1 as P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import {
  welcomeToNightCityRetailAltCunninghamSoulkillerArchitect as alt,
  welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor as hanako,
} from "@tcg/cyberpunk-cards";

const PAYMENT_PROMPT = 'section[aria-label="Choose payment"][data-surface="desktop"]';

test.use({ screenshot: "only-on-failure" });

test("manual payment mode: spend-cost abilities confirm before spending", async ({
  page,
}, testInfo) => {
  await page.addInitScript(() => {
    localStorage.setItem("cyberpunk:userConfig", JSON.stringify({ choosePaymentSources: true }));
    localStorage.setItem("tcg:cyberpunk:payment-selection-discovery:v1", "dismissed");
  });
  await page.goto("/cyberpunk/simulator/tests/paymentLegendSpendAbilityQa?ai=off");
  const pom = await createPlaywrightCyberpunkSimulatorPom(page);

  const hanakoCard = await pom.getCard(hanako, { player: P1, zone: "legendArea" });
  const handBefore = (await pom.getCardsInZone("hand", P1)).length;

  await test.step("hanako spend ability opens a confirmation naming her", async () => {
    const slot = page.locator(
      `[data-testid="legend-slot"][data-card-id="${hanakoCard.instanceId}"]`,
    );
    // The attached-Gear chip overlays the slot's top; aim at the card's
    // bottom-left corner where only the Legend hit-target lives.
    await slot.click({ button: "right", position: { x: 15, y: 110 } });
    const item = page.getByRole("menuitem", { name: /Swap a friendly Gig with a rival Gig/ });
    await expect(item).toBeVisible();
    await item.click();

    const prompt = page.locator(PAYMENT_PROMPT);
    await expect(prompt).toBeVisible();
    await expect(prompt).toContainText("Activating will spend Hanako Arasaka");
    await expect(
      page.locator(`[data-instance-id="${hanakoCard.instanceId}"]`).first(),
    ).toHaveAttribute("data-spent", "false");
    await page.screenshot({ path: testInfo.outputPath("1-hanako-confirmation.png") });

    // Confirm pays: Hanako spent, Netwatch Netdriver draws.
    await page.getByRole("button", { name: /^Confirm/ }).click();
    await expect(prompt).toHaveCount(0);
    await expect(
      page.locator(`[data-instance-id="${hanakoCard.instanceId}"]`).first(),
    ).toHaveAttribute("data-spent", "true");
    expect((await pom.getCardsInZone("hand", P1)).length).toBe(handBefore + 1);
    await page.screenshot({ path: testInfo.outputPath("2-hanako-confirmed-spent.png") });
  });

  // Fresh board for the second probe (the swap resolved above).
  await page.reload();
  const pom2 = await createPlaywrightCyberpunkSimulatorPom(page);
  const altCard2 = await pom2.getCard(alt, { player: P1, zone: "field" });
  const hanakoCard2 = await pom2.getCard(hanako, { player: P1, zone: "legendArea" });

  await test.step("alt mixed-cost ability still offers Legend selection", async () => {
    await page
      .locator(`[data-testid="field-unit"][data-instance-id="${altCard2.instanceId}"]`)
      .click({ button: "right" });
    const item = page.getByRole("menuitem", { name: /Play a Program from your trash/ });
    await expect(item).toBeVisible();
    await item.click();

    const prompt = page.locator(PAYMENT_PROMPT);
    await expect(prompt).toBeVisible();
    await expect(prompt).toContainText("Select 1 ready Eddie or Legend");
    await expect(prompt).toContainText("Activating will also spend Alt Cunningham");
    await page.screenshot({ path: testInfo.outputPath("3-alt-prompt-with-spend-note.png") });

    // Pay the €$ with Hanako. Costs settle after the ability's binding
    // choice, so play the affordable Program (declining would abort the
    // activation unpaid), then both spends must be visible: Hanako from the
    // picked payment, Alt from its own SPEND cost.
    await page
      .locator(`[data-testid="legend-slot"][data-card-id="${hanakoCard2.instanceId}"]`)
      .click({ position: { x: 15, y: 110 } });
    await expect(prompt).toHaveCount(0);
    await page.getByRole("button", { name: "Select Floor It from Trash" }).click();
    await expect(
      page.locator(`[data-instance-id="${hanakoCard2.instanceId}"]`).first(),
    ).toHaveAttribute("data-spent", "true");
    await expect(
      page.locator(`[data-instance-id="${altCard2.instanceId}"]`).first(),
    ).toHaveAttribute("data-spent", "true");
    await page.screenshot({ path: testInfo.outputPath("4-alt-paid-with-hanako.png") });
  });
});
