import { expect, test, PLAYER_ONE, LorcanaSimulatorPom } from "../support/lorcana-test.js";

test("async browser transport delays player updates until the full RTT completes", async ({
  page,
}) => {
  const pom = new LorcanaSimulatorPom(page);
  await pom.goto({
    fixtureId: "pre-game",
    view: "playerOne",
    transport: "async",
    latencyMs: 250,
    latencyModel: "rtt",
  });

  const initialPlayerStatus = await pom.getStatus("playerOne");
  const initialAuthoritativeStatus = await pom.getStatus("authoritative");

  expect(initialPlayerStatus.stateID).toBe(initialAuthoritativeStatus.stateID);

  const result = await pom.execute("playerOne", "chooseWhoGoesFirst", {
    playerId: PLAYER_ONE,
    side: "playerOne",
  });

  expect(result.success).toBe(true);
  expect((await pom.getStatus("playerOne")).stateID).toBe(initialPlayerStatus.stateID);
  expect((await pom.getStatus("authoritative")).stateID).toBe(initialAuthoritativeStatus.stateID);

  await page.waitForTimeout(150);

  const midPlayerStatus = await pom.getStatus("playerOne");
  const midAuthoritativeStatus = await pom.getStatus("authoritative");

  expect(midAuthoritativeStatus.stateID).toBeGreaterThan(initialAuthoritativeStatus.stateID);
  expect(midPlayerStatus.stateID).toBe(initialPlayerStatus.stateID);

  await page.waitForTimeout(150);

  const finalPlayerStatus = await pom.getStatus("playerOne");
  const finalAuthoritativeStatus = await pom.getStatus("authoritative");

  expect(finalPlayerStatus.stateID).toBe(finalAuthoritativeStatus.stateID);
  expect(finalPlayerStatus.openingTurnPlayer).toBe(PLAYER_ONE);
});
