import { test, expect } from "../fixtures/test";
import type { SimulatorPage } from "../poms/SimulatorPage";

const moveLog = (text: string) => `div[role="log"][aria-live="polite"]:has-text("${text}")`;

test.describe("Checklist programs", () => {
  test("Cyberpsychosis plays from the attack window and buffs an equipped unit", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("progCyberpsychosis");
    const player = await simulator.getActivePlayerId();

    await simulator.playerPrompt.verbButton("passPhase").click();
    await simulator.playerPrompt.expectState("select-action");
    await simulator.playerPrompt.verbButton("attackRival").click();
    const tBug = simulator.playerBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="T-Bug - Amateur Philosopher"] [data-interaction-state]',
    );
    await expect(tBug).toHaveAttribute("data-interaction-state", "selectable");

    await simulator.clearDispatchLog();
    await tBug.click();
    await simulator.expectDispatch({ type: "attackRival", as: player });
    await simulator.playerPrompt.expectState("optional-trigger");
    await expect(
      simulator.playerPrompt.root.getByRole("button", { name: /Play Cyberpsychosis/ }),
    ).toBeVisible();

    await simulator.clearDispatchLog();
    await simulator.playerPrompt.root.getByRole("button", { name: /Play Cyberpsychosis/ }).click();
    await simulator.expectDispatch({ type: "resolveTrigger", as: player });

    await simulator.playerPrompt.expectState("select-target");
    const targetTBug = simulator.playerBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="T-Bug - Amateur Philosopher"] [data-interaction-state="selectable"]',
    );
    await expect(targetTBug).toBeVisible();

    await simulator.clearDispatchLog();
    await targetTBug.click();
    await simulator.expectDispatch({ type: "resolveEffectTarget", as: player });

    await simulator.playerPrompt.expectState("select-target");
    const costUnit = simulator.playerBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="Secondhand Bombus"] [data-interaction-state="selectable"]',
    );
    await expect(costUnit).toBeVisible();

    await simulator.clearDispatchLog();
    await costUnit.click({ force: true });
    await simulator.expectDispatch({ type: "resolveEffectTarget", as: player });

    await simulator.expectEddies(player, 1);
    await expect(
      simulator.playerBoard.fieldZone.locator(
        '[data-testid="field-unit"][data-card-name="Secondhand Bombus"][data-spent="true"]',
      ),
    ).toBeVisible();
    await expect(simulator.page.getByLabel("5 printed power, 12 current power")).toBeVisible();
    await expect(
      simulator.playerBoard.trashZone.locator(
        '[data-testid="trash-card"][data-card-name="Cyberpsychosis"]',
      ),
    ).toBeVisible();
    await expect(simulator.page.locator(moveLog("Resolved Cyberpsychosis"))).toBeVisible();
  });

  test("Afterparty at Lizzie's adjusts a clicked rival Gig and draws on matching value", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("progAfterpartyAtLizzies");
    const player = await simulator.getActivePlayerId();
    const rival = await simulator.getOpponentOf(player);
    const handBefore = await simulator.getHandSize(player);

    await playProgram(simulator, "Afterparty at Lizzie's");
    await simulator.playerPrompt.expectState("select-target");

    const d6 = (await simulator.getGigDice(rival)).find((die) => die.dieType === "d6");
    expect(d6, "expected rival d6 Gig").toBeDefined();
    await simulator.opponentBoard.gigDieByType("d6").click({ force: true });
    await expect(simulator.page.getByTestId("gig-adjust-panel")).toHaveAttribute(
      "aria-label",
      "Adjust D6",
    );

    await simulator.clearDispatchLog();
    await simulator.page.getByRole("button", { name: "-2 to 2" }).click();
    await simulator.expectLastDispatch({ type: "resolveAdjustGig", value: 2, as: player });

    await simulator.expectGigFaceValue(rival, "d6", 2);
    await simulator.expectHandSize(player, handBefore);
    await simulator.expectEddies(player, 1);
    await expect(
      simulator.playerBoard.trashZone.locator(
        '[data-testid="trash-card"][data-card-name="Afterparty at Lizzie\'s"]',
      ),
    ).toBeVisible();
    await expect(
      simulator.page.locator(moveLog("Selected D6 for Afterparty at Lizzie's.")),
    ).toBeVisible();
    await expect(simulator.page.locator(moveLog("Adjusted D6 from 4 to 2."))).toBeVisible();
  });

  test("Reboot Optics buffs a clicked friendly unit and defeats it at end of turn", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("progRebootOptics");
    const player = await simulator.getActivePlayerId();

    await playProgram(simulator, "Reboot Optics");
    await simulator.playerPrompt.expectState("select-target");
    const swordwise = simulator.playerBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="Swordwise Huscle"] [data-interaction-state="selectable"]',
    );
    await expect(swordwise).toBeVisible();

    await simulator.clearDispatchLog();
    await swordwise.click();
    await simulator.expectLastDispatch({ type: "resolveEffectTarget", as: player });

    await expect(simulator.page.getByLabel("5 printed power, 9 current power")).toBeVisible();
    await expect(
      simulator.playerBoard.trashZone.locator(
        '[data-testid="trash-card"][data-card-name="Reboot Optics"]',
      ),
    ).toBeVisible();

    await simulator.playerPrompt.verbButton("passPhase").click();
    await simulator.playerPrompt.expectState("select-action");
    await simulator.playerPrompt.verbButton("passPhase").click();
    await simulator.page.getByRole("button", { name: "Pass turn", exact: true }).click();

    await expect(
      simulator.playerBoard.trashZone.locator(
        '[data-testid="trash-card"][data-card-name="Swordwise Huscle"]',
      ),
    ).toBeVisible();
    await expect(
      simulator.page.locator(
        moveLog("Reboot Optics defeated Swordwise Huscle at the end of the turn."),
      ),
    ).toBeVisible();
  });

  test("Reboot Optics with no friendly units resolves with a visible no-target log", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("progRebootOpticsEmptyField");
    const player = await simulator.getActivePlayerId();

    await playProgram(simulator, "Reboot Optics");

    expect(await simulator.getPendingChoiceType(player)).toBeNull();
    await simulator.expectHandSize(player, 0);
    await simulator.expectEddies(player, 1);
    await expect(
      simulator.playerBoard.trashZone.locator(
        '[data-testid="trash-card"][data-card-name="Reboot Optics"]',
      ),
    ).toBeVisible();
    await expect(
      simulator.page.locator(moveLog("Reboot Optics had no valid targets.")),
    ).toBeVisible();
  });

  test("Industrial Assembly increases one low-Cred friendly Gig without the bonus draw", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("progIndustrialAssembly");
    const player = await simulator.getActivePlayerId();

    await playProgram(simulator, "Industrial Assembly");
    await simulator.playerPrompt.expectState("select-target");
    const d4 = (await simulator.getGigDice(player)).find((die) => die.dieType === "d4");
    expect(d4, "expected friendly d4 Gig").toBeDefined();

    await simulator.clearDispatchLog();
    await simulator.playerBoard.gigDieByType("d4").click({ force: true });
    await simulator.expectLastDispatch({
      type: "resolveEffectTarget",
      targetIds: [d4!.id],
      as: player,
    });

    await simulator.expectGigFaceValue(player, "d4", 4);
    await simulator.expectHandSize(player, 0);
    await simulator.expectEddies(player, 1);
    await expect(
      simulator.playerBoard.trashZone.locator(
        '[data-testid="trash-card"][data-card-name="Industrial Assembly"]',
      ),
    ).toBeVisible();
  });

  test("Industrial Assembly draws when Street Cred is 7 or more after the increase", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("progIndustrialAssemblyHighCred");
    const player = await simulator.getActivePlayerId();
    const handBefore = await simulator.getHandSize(player);

    await playProgram(simulator, "Industrial Assembly");
    await simulator.playerPrompt.expectState("select-target");
    const d8 = (await simulator.getGigDice(player)).find((die) => die.dieType === "d8");
    expect(d8, "expected friendly d8 Gig").toBeDefined();

    await simulator.clearDispatchLog();
    await simulator.playerBoard.gigDieByType("d8").click({ force: true });
    await simulator.expectLastDispatch({
      type: "resolveEffectTarget",
      targetIds: [d8!.id],
      as: player,
    });

    await simulator.expectGigFaceValue(player, "d8", 5);
    await simulator.expectHandSize(player, handBefore);
    await expect(
      simulator.page.locator(moveLog("Selected D8 for Industrial Assembly.")),
    ).toBeVisible();
  });

  test("Floor It returns a clicked spent low-cost unit to its owner's hand", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("progFloorIt");
    const player = await simulator.getActivePlayerId();
    const rival = await simulator.getOpponentOf(player);
    const rivalHandBefore = await simulator.getHandSize(rival);

    await playProgram(simulator, "Floor It");
    await simulator.playerPrompt.expectState("select-target");
    const corpo = simulator.opponentBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="Corpo Security"] [data-interaction-state="selectable"]',
    );
    await expect(corpo).toBeVisible();

    await simulator.clearDispatchLog();
    await corpo.click();
    await simulator.expectLastDispatch({ type: "resolveEffectTarget", as: player });

    await simulator.expectHandSize(rival, rivalHandBefore + 1);
    await expect(
      simulator.opponentBoard.fieldZone.locator(
        '[data-testid="field-unit"][data-card-name="Corpo Security"]',
      ),
    ).toHaveCount(0);
    await expect(
      simulator.playerBoard.trashZone.locator(
        '[data-testid="trash-card"][data-card-name="Floor It"]',
      ),
    ).toBeVisible();
  });

  test("Floor It with no spent low-cost units resolves without a target prompt", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("progFloorItNoTargets");
    const player = await simulator.getActivePlayerId();

    await playProgram(simulator, "Floor It");

    expect(await simulator.getPendingChoiceType(player)).toBeNull();
    await expect(
      simulator.opponentBoard.fieldZone.locator(
        '[data-testid="field-unit"][data-card-name="Jackie Welles - Ride Or Die Choom"]',
      ),
    ).toBeVisible();
    await expect(
      simulator.playerBoard.trashZone.locator(
        '[data-testid="trash-card"][data-card-name="Floor It"]',
      ),
    ).toBeVisible();
    await expect(simulator.page.locator(moveLog("Floor It had no valid targets."))).toBeVisible();
  });

  test("Corporate Surveillance spends one clicked rival low-cost unit", async ({ simulator }) => {
    await simulator.gotoFixture("progCorporateSurveillance");
    const player = await simulator.getActivePlayerId();

    await playProgram(simulator, "Corporate Surveillance");
    await simulator.playerPrompt.expectState("select-target");
    const selectableCorpos = simulator.opponentBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="Corpo Security"] [data-interaction-state="selectable"]',
    );
    await expect(selectableCorpos).toHaveCount(2);
    await expect(
      simulator.opponentBoard.fieldZone.locator(
        '[data-testid="field-unit"][data-card-name="Jackie Welles - Ride Or Die Choom"] [data-interaction-state="selectable"]',
      ),
    ).toHaveCount(0);

    await simulator.clearDispatchLog();
    await selectableCorpos.first().click();
    await simulator.expectLastDispatch({ type: "resolveEffectTarget", as: player });

    await expect(
      simulator.opponentBoard.fieldZone.locator(
        '[data-testid="field-unit"][data-card-name="Corpo Security"][data-spent="true"]',
      ),
    ).toHaveCount(1);
    await expect(
      simulator.opponentBoard.fieldZone.locator(
        '[data-testid="field-unit"][data-card-name="Corpo Security"][data-spent="false"]',
      ),
    ).toHaveCount(1);
    await expect(
      simulator.playerBoard.trashZone.locator(
        '[data-testid="trash-card"][data-card-name="Corporate Surveillance"]',
      ),
    ).toBeVisible();
  });

  test("Corporate Surveillance with no low-cost rivals resolves with no target", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("progCorporateSurveillanceNoTargets");
    const player = await simulator.getActivePlayerId();

    await playProgram(simulator, "Corporate Surveillance");

    expect(await simulator.getPendingChoiceType(player)).toBeNull();
    await expect(
      simulator.opponentBoard.fieldZone.locator(
        '[data-testid="field-unit"][data-card-name="Armored Minotaur"]',
      ),
    ).toHaveAttribute("data-spent", "false");
    await expect(
      simulator.playerBoard.trashZone.locator(
        '[data-testid="trash-card"][data-card-name="Corporate Surveillance"]',
      ),
    ).toBeVisible();
    await expect(
      simulator.page.locator(moveLog("Corporate Surveillance had no valid targets.")),
    ).toBeVisible();
  });
});

async function playProgram(simulator: SimulatorPage, cardName: string): Promise<void> {
  await simulator.playerPrompt.verbButton("playCard").click();
  await simulator.playerPrompt.expectState("select-target");
  const card = simulator.playerBoard.handZone.locator(
    `[data-testid="hand-card"][data-card-name="${cardName}"] [data-interaction-state]`,
  );
  await expect(card).toHaveAttribute("data-interaction-state", "selectable");

  await simulator.clearDispatchLog();
  await card.click();
}
