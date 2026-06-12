import { test, expect } from "../fixtures/test";

const moveLog = (text: string) => `div[role="log"][aria-live="polite"]:has-text("${text}")`;

test.describe("Checklist gear", () => {
  test("Dying Night defeats a clicked low-cost rival Gear at 7+ Street Cred", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("gearDyingNightHighCred");
    const player = await simulator.getActivePlayerId();

    await simulator.playerPrompt.verbButton("passPhase").click();
    await simulator.playerPrompt.expectState("select-action");
    const tBug = simulator.playerBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="T-Bug - Amateur Philosopher"] [data-interaction-state]',
    );
    await expect(tBug).toHaveAttribute("data-interaction-state", "armable");
    await tBug.click();
    const actionMenu = simulator.page.locator('[data-testid="card-action-menu"]');
    await expect(actionMenu).toBeVisible();
    await actionMenu.locator('[data-testid="card-action-attackUnit"]').click();
    const corpoSecurity = simulator.opponentBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="Corpo Security"][data-spent="true"] [data-interaction-state]',
    );

    await simulator.clearDispatchLog();
    await corpoSecurity.click();
    await simulator.expectDispatch({ type: "attackUnit", as: player });
    await simulator.playerPrompt.expectState("select-target");

    const kiroshi = simulator.opponentBoard.fieldZone.locator(
      '[data-testid="attached-gear"][data-card-name="Kiroshi Optics"] button[data-choice-type="resolveEffectTarget"]',
    );
    await expect(kiroshi).toBeVisible();

    await simulator.clearDispatchLog();
    await kiroshi.click();
    await simulator.expectDispatch({ type: "resolveEffectTarget", as: player });
    await expect(
      simulator.opponentBoard.trashZone.locator(
        '[data-testid="trash-card"][data-card-name="Kiroshi Optics"]',
      ),
    ).toBeVisible();
    await expect(
      simulator.opponentBoard.fieldZone.locator(
        '[data-testid="field-unit"][data-card-name="Corpo Security"][data-gear-count="0"]',
      ),
    ).toBeVisible();
  });

  test("Dying Night does not prompt below 7 Street Cred", async ({ simulator }) => {
    await simulator.gotoFixture("gearDyingNightLowCred");
    const player = await simulator.getActivePlayerId();

    await simulator.expectGigFaceValue(player, "d4", 4);
    await simulator.playerPrompt.verbButton("passPhase").click();
    await simulator.playerPrompt.expectState("select-action");
    const tBug = simulator.playerBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="T-Bug - Amateur Philosopher"] [data-interaction-state]',
    );
    await expect(tBug).toHaveAttribute("data-interaction-state", "armable");
    await tBug.click();
    await simulator.page.locator('[data-testid="card-action-attackUnit"]').click();
    const corpoSecurity = simulator.opponentBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="Corpo Security"][data-spent="true"] [data-interaction-state]',
    );

    await simulator.clearDispatchLog();
    await corpoSecurity.click();
    await simulator.expectDispatch({ type: "attackUnit", as: player });
    await expect(
      simulator.page.locator(
        moveLog("FIGHT declared: T-Bug - Amateur Philosopher vs Corpo Security."),
      ),
    ).toBeVisible();
    await expect(
      simulator.page.locator('[data-testid="prompt-banner"][data-state="select-target"]'),
    ).toHaveCount(0);
    await expect(
      simulator.opponentBoard.fieldZone.locator(
        '[data-testid="field-unit"][data-card-name="Corpo Security"][data-gear-count="1"] [data-testid="attached-gear"][data-card-name="Kiroshi Optics"]',
      ),
    ).toBeVisible();
  });

  test("Kiroshi Optics peeks a clicked friendly face-down legend on attack", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("gearKiroshiOptics");
    const player = await simulator.getActivePlayerId();

    await expect(
      simulator.playerBoard.fieldZone.locator(
        '[data-testid="field-unit"][data-card-name="Swordwise Huscle"][data-gear-count="1"] [data-testid="attached-gear"][data-card-name="Kiroshi Optics"]',
      ),
    ).toBeVisible();

    await simulator.playerPrompt.verbButton("passPhase").click();
    await simulator.playerPrompt.expectState("select-action");
    const huscle = simulator.playerBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="Swordwise Huscle"] [data-interaction-state]',
    );
    await expect(huscle).toHaveAttribute("data-interaction-state", "armable");
    await huscle.click();
    const actionMenu = simulator.page.locator('[data-testid="card-action-menu"]');
    await expect(actionMenu).toBeVisible();
    await actionMenu.locator('[data-testid="card-action-attackUnit"]').click();
    const corpoSecurity = simulator.opponentBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="Corpo Security"][data-spent="true"] [data-interaction-state]',
    );

    await simulator.clearDispatchLog();
    await corpoSecurity.click();
    await simulator.expectDispatch({ type: "attackUnit", as: player });
    await simulator.playerPrompt.expectState("select-target");

    const faceDownLegend = simulator.playerBoard.legendsZone
      .locator(
        '[data-testid="legend-slot"][data-face-down="true"] [data-interaction-state="selectable"]',
      )
      .first();
    await expect(faceDownLegend).toBeVisible();

    await simulator.clearDispatchLog();
    await faceDownLegend.click();
    await simulator.expectDispatch({ type: "resolveEffectTarget", as: player });
    await expect(
      simulator.playerBoard.legendsZone.locator(
        '[data-testid="legend-slot"][data-face-down="true"][data-peeked="true"]',
      ),
    ).toBeVisible();
    await expect(simulator.page.locator(moveLog("Kiroshi Optics"))).toBeVisible();
  });

  test("Kiroshi Optics has no target prompt when all friendly legends are face-up", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("gearKiroshiOpticsNoFaceDown");
    const player = await simulator.getActivePlayerId();

    await expect(simulator.playerBoard.faceDownLegends).toHaveCount(0);
    await simulator.playerPrompt.verbButton("passPhase").click();
    await simulator.playerPrompt.expectState("select-action");
    const huscle = simulator.playerBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="Swordwise Huscle"] [data-interaction-state]',
    );
    await expect(huscle).toHaveAttribute("data-interaction-state", "armable");
    await huscle.click();
    const actionMenu = simulator.page.locator('[data-testid="card-action-menu"]');
    await expect(actionMenu).toBeVisible();
    await actionMenu.locator('[data-testid="card-action-attackUnit"]').click();
    const corpoSecurity = simulator.opponentBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="Corpo Security"][data-spent="true"] [data-interaction-state]',
    );

    await simulator.clearDispatchLog();
    await corpoSecurity.click();
    await simulator.expectDispatch({ type: "attackUnit", as: player });
    await expect(
      simulator.page.locator(moveLog("FIGHT declared: Swordwise Huscle vs Corpo Security.")),
    ).toBeVisible();
    await expect(
      simulator.page.locator('[data-testid="prompt-banner"][data-state="select-target"]'),
    ).toHaveCount(0);
  });

  test("Mandibular Upgrade grants BLOCKER to the equipped host", async ({ simulator }) => {
    await simulator.gotoFixture("gearMandibularUpgrade");
    const attacker = await simulator.getActivePlayerId();
    const defender = await simulator.getOpponentOf(attacker);

    await simulator.takeControl(defender);
    await expect(
      simulator.playerBoard.fieldZone.locator(
        '[data-testid="field-unit"][data-card-name="Swordwise Huscle"][data-gear-count="1"] [data-testid="attached-gear"][data-card-name="Mandibular Upgrade"]',
      ),
    ).toBeVisible();
    await expect(
      simulator.playerBoard.fieldZone.locator(
        '[data-testid="field-unit"][data-card-name="Swordwise Huscle"] [aria-label="BLOCKER: ready unit can redirect a rival attack"][data-ready="true"]',
      ),
    ).toBeVisible();

    await simulator.playerPrompt.verbButton("useBlocker").click();
    const huscle = simulator.playerBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="Swordwise Huscle"] [data-interaction-state]',
    );
    await expect(huscle).toHaveAttribute("data-interaction-state", "selectable");

    await simulator.clearDispatchLog();
    await huscle.click();
    await simulator.expectLastDispatch({ type: "useBlocker", as: defender });
    await expect(
      simulator.playerBoard.fieldZone.locator(
        '[data-testid="field-unit"][data-card-name="Swordwise Huscle"][data-spent="true"]',
      ),
    ).toBeVisible();
    await expect(
      simulator.page.locator(moveLog("BLOCK: Swordwise Huscle redirected Armored Minotaur")),
    ).toBeVisible();
  });

  test("Mantis Blades adds its power to the equipped unit", async ({ simulator }) => {
    await simulator.gotoFixture("gearMantisBlades");

    await expect(
      simulator.playerBoard.fieldZone.locator(
        '[data-testid="field-unit"][data-card-name="Swordwise Huscle"][data-gear-count="1"] [data-testid="attached-gear"][data-card-name="Mantis Blades"]',
      ),
    ).toBeVisible();
    await expect(simulator.page.getByLabel("5 printed power, 7 current power")).toBeVisible();

    await simulator.playerPrompt.verbButton("passPhase").click();
    await simulator.playerPrompt.expectState("select-action");
    await expect(
      simulator.playerBoard.fieldZone.locator(
        '[data-testid="field-unit"][data-card-name="Swordwise Huscle"] [data-interaction-state]',
      ),
    ).toHaveAttribute("data-interaction-state", "armable");
  });

  test("Sandevistan equips to a unit and lets it attack a spent unit this turn", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("gearSandevistan");
    const player = await simulator.getActivePlayerId();
    const eddiesBefore = await simulator.getEddies(player);

    await simulator.playerPrompt.verbButton("playCard").click();
    await simulator.playerBoard.expectMode("select-target");
    const sandevistan = simulator.playerBoard.handZone.locator(
      '[data-testid="hand-card"][data-card-name="Sandevistan"] [data-interaction-state="selectable"]',
    );
    await expect(sandevistan).toBeVisible();
    await sandevistan.click();
    const huscle = simulator.playerBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="Swordwise Huscle"] [data-interaction-state="selectable"]',
    );
    await expect(huscle).toBeVisible();

    await simulator.clearDispatchLog();
    await huscle.click();
    await simulator.expectDispatch({ type: "playCard", as: player });
    await simulator.expectEddies(player, eddiesBefore - 3);
    const gearedHuscle = simulator.playerBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="Swordwise Huscle"][data-gear-count="1"]',
    );
    await expect(
      gearedHuscle.locator('[data-testid="attached-gear"][data-card-name="Sandevistan"]'),
    ).toBeVisible();
    await expect(simulator.page.getByLabel("5 printed power, 8 current power")).toBeVisible();
    await expect(simulator.page.locator(moveLog("Played Sandevistan for 3 eddies"))).toBeVisible();

    await simulator.playerPrompt.verbButton("passPhase").click();
    await simulator.playerPrompt.expectState("select-action");
    const attacker = gearedHuscle.locator("[data-interaction-state]");
    await expect(attacker).toHaveAttribute("data-interaction-state", "armable");
    await attacker.click();
    await simulator.page.locator('[data-testid="card-action-attackUnit"]').click();
    const corpoSecurity = simulator.opponentBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="Corpo Security"][data-spent="true"] [data-interaction-state]',
    );
    await expect(corpoSecurity).toHaveAttribute("data-interaction-state", "selectable");

    await simulator.clearDispatchLog();
    await corpoSecurity.click();
    await simulator.expectDispatch({ type: "attackUnit", as: player });
    await expect(
      simulator.page.locator(moveLog("FIGHT declared: Swordwise Huscle vs Corpo Security.")),
    ).toBeVisible();
  });

  test("Satori - Sword of Saburo draws after the equipped host wins a fight", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("gearSatoriSwordOfSaburo");
    const player = await simulator.getActivePlayerId();
    const handBefore = await simulator.getHandSize(player);

    await expect(
      simulator.playerBoard.fieldZone.locator(
        '[data-testid="field-unit"][data-card-name="T-Bug - Amateur Philosopher"][data-gear-count="1"] [data-testid="attached-gear"][data-card-name="Satori - Sword of Saburo"]',
      ),
    ).toBeVisible();
    await expect(simulator.page.getByLabel("5 printed power, 6 current power")).toBeVisible();

    await simulator.playerPrompt.verbButton("passPhase").click();
    await simulator.playerPrompt.expectState("select-action");
    const tBug = simulator.playerBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="T-Bug - Amateur Philosopher"] [data-interaction-state]',
    );
    await expect(tBug).toHaveAttribute("data-interaction-state", "armable");
    await tBug.click();
    await simulator.page.locator('[data-testid="card-action-attackUnit"]').click();
    const corpoSecurity = simulator.opponentBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="Corpo Security"][data-spent="true"] [data-interaction-state]',
    );
    await expect(corpoSecurity).toHaveAttribute("data-interaction-state", "selectable");

    await simulator.clearDispatchLog();
    await corpoSecurity.click();
    await simulator.expectDispatch({ type: "attackUnit", as: player });
    await expect(
      simulator.page.locator(
        moveLog("FIGHT declared: T-Bug - Amateur Philosopher vs Corpo Security."),
      ),
    ).toBeVisible();

    const attackProgress = simulator.page.locator(
      'button[aria-label="ATTACK IN PROGRESS"]:not([disabled])',
    );
    await simulator.clearDispatchLog();
    await attackProgress.click();
    await simulator.expectLastDispatch({ type: "resolveAttack", as: player });

    await simulator.clearDispatchLog();
    await attackProgress.click();
    await simulator.expectDispatch({ type: "resolveAttack", as: player });
    await expect(
      simulator.page.locator(moveLog("T-Bug - Amateur Philosopher defeated Corpo Security.")),
    ).toBeVisible();

    await simulator.clearDispatchLog();
    await attackProgress.click();
    await simulator.expectDispatch({ type: "resolveAttack", as: player });
    await simulator.expectHandSize(player, handBefore + 1);
    await expect(
      simulator.opponentBoard.trashZone.locator(
        '[data-testid="trash-card"][data-card-name="Corpo Security"]',
      ),
    ).toBeVisible();
    await expect(
      simulator.page.locator(moveLog("Auto-resolved Satori - Sword of Saburo. Drew")),
    ).toBeVisible();
  });

  test("Mantis Blades can attach to a go-solo Legend on the field", async ({ simulator }) => {
    await simulator.gotoFixture("gearAttachToGoSoloLegend");
    const player = await simulator.getActivePlayerId();
    const eddiesBefore = await simulator.getEddies(player);

    await simulator.playerPrompt.verbButton("playCard").click();
    await simulator.playerBoard.expectMode("select-target");
    const mantisBlades = simulator.playerBoard.handZone.locator(
      '[data-testid="hand-card"][data-card-name="Mantis Blades"] [data-interaction-state="selectable"]',
    );
    await expect(mantisBlades).toBeVisible();
    await mantisBlades.click();

    const vCorpExile = simulator.playerBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="V - Corporate Exile"] [data-interaction-state="selectable"]',
    );
    await expect(vCorpExile).toBeVisible();

    await simulator.clearDispatchLog();
    await vCorpExile.click();
    await simulator.expectDispatch({ type: "playCard", as: player });
    await simulator.expectEddies(player, eddiesBefore - 1);

    const gearedV = simulator.playerBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="V - Corporate Exile"][data-gear-count="1"]',
    );
    await expect(
      gearedV.locator('[data-testid="attached-gear"][data-card-name="Mantis Blades"]'),
    ).toBeVisible();
    await expect(simulator.page.getByLabel("8 printed power, 10 current power")).toBeVisible();
    await expect(
      simulator.page.locator(moveLog("Played Mantis Blades for 1 eddies")),
    ).toBeVisible();
  });

  test("Gorilla Arms steals an extra matching-sided Gig after the host steals", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("gearGorillaArms");
    const player = await simulator.getActivePlayerId();
    const rival = await simulator.getOpponentOf(player);

    await simulator.expectGigCount(player, 1);
    await simulator.expectGigCount(rival, 3);
    await expect(
      simulator.playerBoard.fieldZone.locator(
        '[data-testid="field-unit"][data-card-name="T-Bug - Amateur Philosopher"][data-gear-count="1"] [data-testid="attached-gear"][data-card-name="Gorilla Arms"]',
      ),
    ).toBeVisible();
    await expect(simulator.page.getByLabel("5 printed power, 9 current power")).toBeVisible();

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
    await expect(
      simulator.page.locator(
        moveLog("STEAL declared: T-Bug - Amateur Philosopher hits the rival."),
      ),
    ).toBeVisible();

    const attackProgress = simulator.page.locator(
      'button[aria-label="ATTACK IN PROGRESS"]:not([disabled])',
    );
    await simulator.clearDispatchLog();
    await attackProgress.click();
    await simulator.expectDispatch({ type: "resolveAttack", as: player });

    await simulator.playerPrompt.expectState("steal-gigs");
    const d4Choice = simulator.page.locator('[data-testid="prompt-steal-gig-d4"]').first();
    await expect(d4Choice).toBeVisible();
    await simulator.clearDispatchLog();
    await d4Choice.click();
    await simulator.expectDispatch({ type: "resolveStealGigs", as: player });

    await simulator.expectGigCount(player, 3);
    await simulator.expectGigCount(rival, 1);
    await expect(
      simulator.page.locator(moveLog("Gorilla Arms triggered, stealing 1 additional d4 Gig.")),
    ).toBeVisible();
  });
});
