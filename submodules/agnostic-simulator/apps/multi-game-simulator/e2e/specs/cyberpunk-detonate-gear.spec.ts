import { expect, test } from "@playwright/test";
import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import { CYBERPUNK_P1 as P1, CYBERPUNK_P2 as P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import {
  welcomeToNightCityRetailDetonate as detonate,
  welcomeToNightCityRetailCorpoSecurity as corpo,
  welcomeToNightCityRetailMantisBlades as mantis,
  welcomeToNightCityRetailKiroshiOptics as optics,
  welcomeToNightCityRetailJackieWellesMamaSFavorite as jackie,
} from "@tcg/cyberpunk-cards";

test.use({ screenshot: "only-on-failure" });

test("successive Detonates remove Gear from the board and power breakdown", async ({
  page,
}, testInfo) => {
  await page.addInitScript(() => {
    localStorage.setItem("tcg:cyberpunk:payment-selection-discovery:v1", "dismissed");
  });
  await page.goto("/cyberpunk/simulator/tests/regressionDetonateDetachesGear?ai=off");
  const pom = await createPlaywrightCyberpunkSimulatorPom(page);
  const host = await pom.getCard(corpo, { player: P2, zone: "field" });
  const jackieCard = await pom.getCard(jackie, { player: P2, zone: "legendArea" });
  const hostElement = page.locator(
    `[data-testid="field-unit"][data-instance-id="${host.instanceId}"]`,
  );
  await pom.expectFieldCardAttachedGearCount(P2, host.instanceId, 2);
  await pom.expectRenderedFieldCardPower(P2, host.instanceId, 5);

  for (const [index, gear] of [mantis, optics].entries()) {
    const target = await pom.getCard(gear, { player: P2, zone: "field" });
    const program = await pom.getCard(detonate, { player: P1, zone: "hand" });
    await page
      .locator(
        `[data-testid="hand-card"][data-card-id="${program.instanceId}"] [data-testid="card"]`,
      )
      .click();
    await page
      .getByRole("menuitem", {
        name: "Play Pay its current Eddie cost and resolve its Play effect.",
      })
      .click();
    await hostElement
      .getByRole("button", {
        name: index === 0 ? "Select Mantis Blades" : "Select Kiroshi Optics",
        exact: true,
      })
      .click();
    await expect(page.getByText("Redirect defeat")).toHaveCount(0);
    expect((await pom.getCardsInZone("legendArea", P2)).map((card) => card.instanceId)).toContain(
      jackieCard.instanceId,
    );
    await expect(hostElement).toHaveAttribute("data-gear-count", String(1 - index));
    await expect(
      hostElement.locator(`[data-testid="attached-gear"][data-instance-id="${target.instanceId}"]`),
    ).toHaveCount(0);
    await pom.expectRenderedFieldCardPower(P2, host.instanceId, index === 0 ? 3 : 2);
    expect((await pom.getCardsInZone("trash", P2)).map((card) => card.instanceId)).toContain(
      target.instanceId,
    );
  }
  await expect(
    hostElement.getByRole("button", { name: /Preview (Mantis Blades|Kiroshi Optics)/ }),
  ).toHaveCount(0);
  await page.screenshot({ path: testInfo.outputPath("detonate-detached.png") });
});
