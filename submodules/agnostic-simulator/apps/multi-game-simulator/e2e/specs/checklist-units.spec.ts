import { test, expect } from "../fixtures/test";

const moveLog = (text: string) => `div[role="log"][aria-live="polite"]:has-text("${text}")`;

test.describe("Checklist units", () => {
  test("Secondhand Bombus blocks a direct attack and cannot be used as an attacker", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("unitSecondhandBombus");
    const attacker = await simulator.getActivePlayerId();
    const defender = await simulator.getOpponentOf(attacker);

    await simulator.takeControl(defender);
    await simulator.playerPrompt.verbButton("useBlocker").click();
    const bombus = simulator.playerBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="Secondhand Bombus"] [data-interaction-state]',
    );
    await expect(bombus).toHaveAttribute("data-interaction-state", "selectable");

    await simulator.clearDispatchLog();
    await bombus.click();
    await simulator.expectLastDispatch({ type: "useBlocker", as: defender });

    await expect(
      simulator.playerBoard.fieldZone.locator(
        '[data-testid="field-unit"][data-card-name="Secondhand Bombus"][data-spent="true"]',
      ),
    ).toBeVisible();
    await expect(
      simulator.page.locator(moveLog("BLOCK: Secondhand Bombus redirected Armored Minotaur")),
    ).toBeVisible();
  });

  test("Corpo Security cannot attack but can block a rival direct attack", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("unitCorpoSecurity");
    const attacker = await simulator.getActivePlayerId();
    const defender = await simulator.getOpponentOf(attacker);

    await simulator.playerPrompt.verbButton("passPhase").click();
    await simulator.playerPrompt.expectState("select-action");
    await simulator.playerPrompt.verbButton("attackRival").click();
    const swordwise = simulator.playerBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="Swordwise Huscle"] [data-interaction-state]',
    );
    await expect(swordwise).toHaveAttribute("data-interaction-state", "selectable");

    await simulator.clearDispatchLog();
    await swordwise.click();
    await simulator.expectDispatch({ type: "attackRival", as: attacker });

    await simulator.takeControl(defender);
    await expect(simulator.opponentPrompt.verbButton("attackRival")).toHaveCount(0);
    await simulator.opponentPrompt.verbButton("useBlocker").click();
    const corpoSecurity = simulator.opponentBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="Corpo Security"] [data-interaction-state]',
    );
    await expect(corpoSecurity).toHaveAttribute("data-interaction-state", "selectable");

    await simulator.clearDispatchLog();
    await corpoSecurity.click();
    await simulator.expectLastDispatch({ type: "useBlocker", as: defender });
    await expect(
      simulator.opponentBoard.fieldZone.locator(
        '[data-testid="field-unit"][data-card-name="Corpo Security"][data-spent="true"]',
      ),
    ).toBeVisible();
    await expect(
      simulator.page.locator(moveLog("BLOCK: Corpo Security redirected Swordwise Huscle")),
    ).toBeVisible();
  });

  test("Ruthless Lowlife sets a stolen friendly Gig to value 1 while spent", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("unitRuthlessLowlife");
    const stealer = await simulator.getActivePlayerId();
    const lowlifePlayer = await simulator.getOpponentOf(stealer);

    await simulator.takeControl(stealer);
    await expect(
      simulator.playerBoard.fieldZone.locator(
        '[data-testid="field-unit"][data-card-name="Ruthless Lowlife"][data-spent="true"]',
      ),
    ).toBeVisible();
    await simulator.expectGigFaceValue(lowlifePlayer, "d4", 4);
    await simulator.expectGigCount(lowlifePlayer, 2);

    await simulator.opponentPrompt.verbButton("attackRival").click();
    const minotaur = simulator.opponentBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="Armored Minotaur"] [data-interaction-state]',
    );
    await expect(minotaur).toHaveAttribute("data-interaction-state", "selectable");

    await simulator.clearDispatchLog();
    await minotaur.click();
    await simulator.expectDispatch({ type: "attackRival", as: stealer });

    const attackProgress = simulator.page.locator(
      'button[aria-label="ATTACK IN PROGRESS"]:not([disabled])',
    );
    await simulator.takeControl(lowlifePlayer);
    await simulator.clearDispatchLog();
    await attackProgress.click();
    await simulator.expectLastDispatch({ type: "resolveAttack", as: stealer });

    await simulator.takeControl(stealer);
    await expect(simulator.opponentPrompt.root).toHaveAttribute("data-state", "steal-gigs");
    await simulator.clearDispatchLog();
    await simulator.opponentPrompt.root.locator('[data-testid="prompt-steal-gig-d4"]').click();
    await simulator.expectLastDispatch({ type: "resolveStealGigs", as: stealer });

    await simulator.expectGigCount(lowlifePlayer, 1);
    await simulator.expectGigFaceValue(stealer, "d4", 1);
    await expect(simulator.page.locator(moveLog("STEAL resolved: Armored Minotaur"))).toBeVisible();
  });

  test("Evelyn Parker draws after a rival steals a friendly Gig while she is spent", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("unitEvelynParkerSchemingSiren");
    const stealer = await simulator.getActivePlayerId();
    const evelynPlayer = await simulator.getOpponentOf(stealer);

    await simulator.takeControl(stealer);
    await simulator.expectHandSize(evelynPlayer, 1);
    await expect(
      simulator.playerBoard.fieldZone.locator(
        '[data-testid="field-unit"][data-card-name="Evelyn Parker - Scheming Siren"][data-spent="true"]',
      ),
    ).toBeVisible();
    await simulator.expectGigCount(evelynPlayer, 2);

    await simulator.opponentPrompt.verbButton("attackRival").click();
    const minotaur = simulator.opponentBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="Armored Minotaur"] [data-interaction-state]',
    );
    await expect(minotaur).toHaveAttribute("data-interaction-state", "selectable");

    await simulator.clearDispatchLog();
    await minotaur.click();
    await simulator.expectDispatch({ type: "attackRival", as: stealer });

    const attackProgress = simulator.page.locator(
      'button[aria-label="ATTACK IN PROGRESS"]:not([disabled])',
    );
    await simulator.takeControl(evelynPlayer);
    await simulator.clearDispatchLog();
    await attackProgress.click();
    await simulator.expectLastDispatch({ type: "resolveAttack", as: stealer });

    await simulator.takeControl(stealer);
    await expect(simulator.opponentPrompt.root).toHaveAttribute("data-state", "steal-gigs");
    await simulator.clearDispatchLog();
    await simulator.opponentPrompt.root.locator('[data-testid="prompt-steal-gig-d4"]').click();
    await simulator.expectLastDispatch({ type: "resolveStealGigs", as: stealer });

    await simulator.expectHandSize(evelynPlayer, 2);
    await simulator.expectGigCount(evelynPlayer, 1);
    await expect(simulator.page.locator(moveLog("STEAL resolved: Armored Minotaur"))).toBeVisible();
  });

  test("Jackie Welles shows +2 power for each friendly Gig", async ({ simulator }) => {
    await simulator.gotoFixture("unitJackieWellesRideOrDieChoom");
    const player = await simulator.getActivePlayerId();

    await simulator.expectGigCount(player, 3);
    await simulator.expectGigFaceValue(player, "d4", 3);
    await simulator.expectGigFaceValue(player, "d6", 5);
    await simulator.expectGigFaceValue(player, "d8", 2);
    await expect(simulator.page.getByLabel("6 printed power, 12 current power")).toBeVisible();

    await simulator.playerPrompt.verbButton("passPhase").click();
    await simulator.expectDispatch({ type: "passPhase", as: player });
    await expect(simulator.page.getByLabel("6 printed power, 12 current power")).toBeVisible();
  });

  test("Goro Takemura shows +1 power per face-up friendly Legend on your turn", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("unitGoroTakemuraLosingHisWay");
    const player = await simulator.getActivePlayerId();

    await expect(simulator.playerBoard.faceDownLegends).toHaveCount(1);
    await expect(
      simulator.playerBoard.legendsZone.locator(
        '[data-testid="legend-slot"][data-card-name="V - Corporate Exile"][data-face-down="false"]',
      ),
    ).toBeVisible();
    await expect(
      simulator.playerBoard.legendsZone.locator(
        '[data-testid="legend-slot"][data-card-name="Saburo Arasaka - Stubborn Patriarch"][data-face-down="false"]',
      ),
    ).toBeVisible();
    await expect(simulator.page.getByLabel("5 printed power, 7 current power")).toBeVisible();

    await simulator.playerPrompt.verbButton("passPhase").click();
    await simulator.expectDispatch({ type: "passPhase", as: player });
    await expect(simulator.page.getByLabel("5 printed power, 7 current power")).toBeVisible();
  });

  test("MT0D12 Flathead attacks directly without blocker options at 7+ Street Cred", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("unitMt0d12Flathead");
    const player = await simulator.getActivePlayerId();
    const rival = await simulator.getOpponentOf(player);

    await simulator.expectGigFaceValue(player, "d4", 3);
    await simulator.expectGigFaceValue(player, "d6", 5);
    await simulator.playerPrompt.verbButton("passPhase").click();
    await simulator.playerPrompt.expectState("select-action");

    await simulator.playerPrompt.verbButton("attackRival").click();
    const flathead = simulator.playerBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="MT0D12 Flathead"] [data-interaction-state]',
    );
    await expect(flathead).toHaveAttribute("data-interaction-state", "selectable");

    await simulator.clearDispatchLog();
    await flathead.click();
    await simulator.expectDispatch({ type: "attackRival", as: player });
    await simulator.expectDispatch({ type: "resolveAttack", as: player });

    await simulator.takeControl(rival);
    const dispatchLog = await simulator.getDispatchLog();
    expect(dispatchLog.some(({ action }) => action.type === "useBlocker")).toBe(false);
    await expect(
      simulator.page.locator(moveLog("STEAL declared: MT0D12 Flathead hits the rival")),
    ).toBeVisible();
  });

  test("Armored Minotaur chooses one low-power rival unit to defeat at 12+ Street Cred", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("unitArmoredMinotaur");
    const player = await simulator.getActivePlayerId();

    await simulator.expectGigFaceValue(player, "d4", 4);
    await simulator.expectGigFaceValue(player, "d6", 6);
    await simulator.expectGigFaceValue(player, "d8", 4);
    await expect(simulator.playerBoard.fieldZone).toHaveAttribute("data-count", "1");
    await expect(simulator.opponentBoard.fieldZone).toHaveAttribute("data-count", "2");

    await simulator.playerPrompt.expectState("select-action");
    await simulator.playerPrompt.verbButton("playCard").click();
    const minotaur = simulator.playerBoard.handZone.locator(
      '[data-testid="hand-card"][data-card-name="Armored Minotaur"] [data-interaction-state]',
    );
    await expect(minotaur).toHaveAttribute("data-interaction-state", "selectable");

    await simulator.clearDispatchLog();
    await minotaur.click();
    await simulator.expectLastDispatch({ type: "playCard", as: player });
    await simulator.playerPrompt.expectState("select-target");
    await expect(simulator.playerPrompt.root).toContainText("Choose a target");

    const corpoSecurity = simulator.opponentBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="Corpo Security"] [data-interaction-state]',
    );
    await expect(corpoSecurity).toHaveAttribute("data-interaction-state", "selectable");

    await simulator.clearDispatchLog();
    await corpoSecurity.click();
    await simulator.expectLastDispatch({ type: "resolveEffectTarget", as: player });

    await expect(simulator.playerBoard.fieldZone).toHaveAttribute("data-count", "2");
    await expect(
      simulator.playerBoard.fieldZone.locator(
        '[data-testid="field-unit"][data-card-name="Armored Minotaur"]',
      ),
    ).toBeVisible();
    await expect(simulator.opponentBoard.fieldZone).toHaveAttribute("data-count", "1");
    await expect(
      simulator.opponentBoard.fieldZone.locator(
        '[data-testid="field-unit"][data-card-name="Secondhand Bombus"]',
      ),
    ).toBeVisible();
    await expect(
      simulator.opponentBoard.root.locator(
        '[data-testid="trash-card"][data-card-name="Corpo Security"]',
      ),
    ).toBeVisible();
    await expect(simulator.page.locator(moveLog("Selected Corpo Security"))).toBeVisible();
  });

  test("Hanako Arasaka reveals top 4 and keeps cards matching a friendly Gig value", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("unitHanakoArasakaInAGildedCage");
    const player = await simulator.getActivePlayerId();

    await simulator.expectGigFaceValue(player, "d4", 3);
    await expect(simulator.playerBoard.deckZone).toHaveAttribute("data-count", "5");
    await simulator.expectHandSize(player, 1);
    await expect(simulator.playerBoard.root.locator('[data-testid="trash-zone"]')).toHaveAttribute(
      "data-count",
      "0",
    );

    await simulator.playerPrompt.expectState("select-action");
    await simulator.playerPrompt.verbButton("playCard").click();
    const hanako = simulator.playerBoard.handZone.locator(
      '[data-testid="hand-card"][data-card-name="Hanako Arasaka - In A Gilded Cage"] [data-interaction-state]',
    );
    await expect(hanako).toHaveAttribute("data-interaction-state", "selectable");

    await simulator.clearDispatchLog();
    await hanako.click();
    await simulator.expectLastDispatch({ type: "playCard", as: player });

    await simulator.expectHandSize(player, 2);
    await expect(
      simulator.playerBoard.handZone.locator(
        '[data-testid="hand-card"][data-card-name="Swordwise Huscle"]',
      ),
    ).toBeVisible();
    await expect(
      simulator.playerBoard.handZone.locator(
        '[data-testid="hand-card"][data-card-name="Floor It"]',
      ),
    ).toBeVisible();
    await expect(simulator.playerBoard.fieldZone).toHaveAttribute("data-count", "2");
    await expect(
      simulator.playerBoard.fieldZone.locator(
        '[data-testid="field-unit"][data-card-name="Hanako Arasaka - In A Gilded Cage"]',
      ),
    ).toBeVisible();
    await expect(simulator.playerBoard.deckZone).toHaveAttribute("data-count", "1");
    await expect(simulator.playerBoard.root.locator('[data-testid="trash-zone"]')).toHaveAttribute(
      "data-count",
      "2",
    );
    await expect(
      simulator.page.locator(moveLog("Revealed the top 4 cards of the deck")),
    ).toBeVisible();
    await expect(
      simulator.page.locator(moveLog("Searched the top 4 cards and found 2")),
    ).toBeVisible();
  });

  test("Placide discards a Program to bottom-deck one rival unit on PLAY", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("unitPlacideVoodooSentinel");
    const player = await simulator.getActivePlayerId();

    await expect(simulator.playerBoard.fieldZone).toHaveAttribute("data-count", "1");
    await expect(simulator.opponentBoard.fieldZone).toHaveAttribute("data-count", "2");
    const opponentDeckBefore = await simulator.opponentBoard.deckZone.getAttribute("data-count");
    expect(opponentDeckBefore).toBeTruthy();

    await simulator.playerPrompt.expectState("select-action");
    await simulator.playerPrompt.verbButton("playCard").click();
    const placide = simulator.playerBoard.handZone.locator(
      '[data-testid="hand-card"][data-card-name="Placide - Voodoo Sentinel"] [data-interaction-state]',
    );
    await expect(placide).toHaveAttribute("data-interaction-state", "selectable");

    await simulator.clearDispatchLog();
    await placide.click();
    await simulator.expectLastDispatch({ type: "playCard", as: player });
    await simulator.playerPrompt.expectState("select-target");
    await expect(simulator.playerPrompt.root).toContainText("Choose a card to trash");

    const surveillance = simulator.playerBoard.handZone.locator(
      '[data-testid="hand-card"][data-card-name="Corporate Surveillance"] [data-interaction-state]',
    );
    await expect(surveillance).toHaveAttribute("data-interaction-state", "selectable");
    await simulator.clearDispatchLog();
    await surveillance.click();
    await simulator.expectLastDispatch({ type: "resolveCardToMove", as: player });
    await expect(simulator.playerBoard.root.locator('[data-testid="trash-zone"]')).toHaveAttribute(
      "data-count",
      "1",
    );

    await simulator.playerPrompt.expectState("select-target");
    const corpoSecurity = simulator.opponentBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="Corpo Security"] [data-interaction-state]',
    );
    await expect(corpoSecurity).toHaveAttribute("data-interaction-state", "selectable");

    await simulator.clearDispatchLog();
    await corpoSecurity.click();
    await simulator.expectLastDispatch({ type: "resolveEffectTarget", as: player });

    await expect(simulator.opponentBoard.fieldZone).toHaveAttribute("data-count", "1");
    await expect(
      simulator.opponentBoard.fieldZone.locator(
        '[data-testid="field-unit"][data-card-name="Armored Minotaur"]',
      ),
    ).toBeVisible();
    await expect(simulator.opponentBoard.deckZone).toHaveAttribute(
      "data-count",
      String(Number(opponentDeckBefore) + 1),
    );
    await expect(simulator.page.locator(moveLog("Moved Corporate Surveillance."))).toBeVisible();
  });

  test("Adam Smasher defeats every other unit on play", async ({ simulator }) => {
    await simulator.gotoFixture("unitAdamSmasherMetalOverMeat");
    const player = await simulator.getActivePlayerId();

    await expect(simulator.playerBoard.fieldZone).toHaveAttribute("data-count", "2");
    await expect(simulator.opponentBoard.fieldZone).toHaveAttribute("data-count", "3");
    await simulator.playerPrompt.expectState("select-action");
    await expect(simulator.playerPrompt.verbButton("playCard")).toBeVisible();

    await simulator.playerPrompt.verbButton("playCard").click();
    const adam = simulator.playerBoard.handZone.locator(
      '[data-testid="hand-card"][data-card-name="Adam Smasher - Metal Over Meat"] [data-interaction-state]',
    );
    await expect(adam).toHaveAttribute("data-interaction-state", "selectable");

    await simulator.clearDispatchLog();
    await adam.click();
    await simulator.expectLastDispatch({ type: "playCard", as: player });

    await expect(simulator.playerBoard.fieldZone).toHaveAttribute("data-count", "1");
    await expect(
      simulator.playerBoard.fieldZone.locator(
        '[data-testid="field-unit"][data-card-name="Adam Smasher - Metal Over Meat"]',
      ),
    ).toBeVisible();
    await expect(simulator.opponentBoard.fieldZone).toHaveAttribute("data-count", "0");
    await expect(simulator.playerBoard.root.locator('[data-testid="trash-zone"]')).toHaveAttribute(
      "data-count",
      "2",
    );
    await expect(
      simulator.opponentBoard.root.locator('[data-testid="trash-zone"]'),
    ).toHaveAttribute("data-count", "3");
    await expect(
      simulator.page.locator(moveLog("Played Adam Smasher - Metal Over Meat")),
    ).toBeVisible();
  });

  test("El Sombreron doubles power through an ATTACK fight trigger", async ({ simulator }) => {
    await simulator.gotoFixture("unitElSombreronLaVenganzaLenta");
    const player = await simulator.getActivePlayerId();

    await simulator.playerPrompt.verbButton("passPhase").click();
    await simulator.playerPrompt.expectState("select-action");

    const sombreron = simulator.playerBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="El Sombrerón - La Venganza Lenta"] [data-interaction-state]',
    );
    await expect(sombreron).toHaveAttribute("data-interaction-state", "armable");
    await sombreron.dispatchEvent("click");
    const actionMenu = simulator.page.locator('[data-testid="card-action-menu"]');
    await expect(actionMenu.locator('[data-testid="card-action-attackUnit"]')).toBeVisible();
    await actionMenu.locator('[data-testid="card-action-attackUnit"]').click();

    const corpoSecurity = simulator.opponentBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="Corpo Security"][data-spent="true"] [data-interaction-state]',
    );
    await expect(corpoSecurity).toHaveAttribute("data-interaction-state", "selectable");

    await simulator.clearDispatchLog();
    await corpoSecurity.click();
    await simulator.expectDispatch({ type: "attackUnit", as: player });
    await expect(
      simulator.page.locator(
        moveLog("FIGHT declared: El Sombrerón - La Venganza Lenta vs Corpo Security."),
      ),
    ).toBeVisible();
    await expect(simulator.page.getByLabel("4 printed power, 8 current power")).toBeVisible();

    const attackProgress = simulator.page.locator(
      'button[aria-label="ATTACK IN PROGRESS"]:not([disabled])',
    );
    await simulator.clearDispatchLog();
    await attackProgress.click();
    await simulator.expectLastDispatch({ type: "resolveAttack", as: player });

    await simulator.page.evaluate(() => {
      (
        window as unknown as {
          __cyberpunkSimulator?: { setHumanSide: (side: "player" | "opponent") => void };
        }
      ).__cyberpunkSimulator?.setHumanSide("opponent");
    });
    await simulator.clearDispatchLog();
    await attackProgress.click();
    await simulator.expectLastDispatch({ type: "resolveAttack" });

    await simulator.page.evaluate(() => {
      (
        window as unknown as {
          __cyberpunkSimulator?: { setHumanSide: (side: "player" | "opponent") => void };
        }
      ).__cyberpunkSimulator?.setHumanSide("player");
    });
    await simulator.clearDispatchLog();
    await attackProgress.click();
    await simulator.expectLastDispatch({ type: "resolveAttack", as: player });

    await expect(
      simulator.page.locator(moveLog("FIGHT resolved: 8 vs 2. El Sombrerón")),
    ).toBeVisible();
    await expect(
      simulator.opponentBoard.root.locator(
        '[data-testid="trash-card"][data-card-name="Corpo Security"]',
      ),
    ).toBeVisible();
  });

  test("Caliber forces the rival discard chain after being defeated", async ({ simulator }) => {
    await simulator.gotoFixture("unitCaliberTotentanzSTopDog");
    const player = await simulator.getActivePlayerId();
    const rival = await simulator.getOpponentOf(player);

    await simulator.expectGigFaceValue(player, "d6", 5);
    await simulator.playerPrompt.verbButton("passPhase").click();
    await simulator.playerPrompt.expectState("select-action");

    const caliber = simulator.playerBoard.fieldZone.locator(
      `[data-testid="field-unit"][data-card-name="Caliber - Totentanz's Top Dog"] [data-interaction-state]`,
    );
    await expect(caliber).toHaveAttribute("data-interaction-state", "armable");
    await caliber.dispatchEvent("click");
    const actionMenu2 = simulator.page.locator('[data-testid="card-action-menu"]');
    await expect(actionMenu2.locator('[data-testid="card-action-attackUnit"]')).toBeVisible();
    await actionMenu2.locator('[data-testid="card-action-attackUnit"]').click();

    const minotaur = simulator.opponentBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="Armored Minotaur"][data-spent="true"] [data-interaction-state]',
    );
    await expect(minotaur).toHaveAttribute("data-interaction-state", "selectable");

    await simulator.clearDispatchLog();
    await minotaur.click();
    await simulator.expectDispatch({ type: "attackUnit", as: player });

    const attackProgress = simulator.page.locator(
      'button[aria-label="ATTACK IN PROGRESS"]:not([disabled])',
    );
    await simulator.clearDispatchLog();
    await attackProgress.click();
    await simulator.expectLastDispatch({ type: "resolveAttack", as: player });

    await simulator.page.evaluate(() => {
      (
        window as unknown as {
          __cyberpunkSimulator?: { setHumanSide: (side: "player" | "opponent") => void };
        }
      ).__cyberpunkSimulator?.setHumanSide("opponent");
    });
    await simulator.clearDispatchLog();
    await attackProgress.click();
    await simulator.expectLastDispatch({ type: "resolveAttack" });

    await simulator.page.evaluate(() => {
      (
        window as unknown as {
          __cyberpunkSimulator?: { setHumanSide: (side: "player" | "opponent") => void };
        }
      ).__cyberpunkSimulator?.setHumanSide("player");
    });
    await simulator.clearDispatchLog();
    await attackProgress.click();
    await simulator.expectLastDispatch({ type: "resolveAttack", as: player });

    await simulator.takeControl(rival);
    await simulator.opponentPrompt.expectState("select-target");
    await expect(simulator.opponentPrompt.root).toContainText("Discard 1 card from hand");

    const flathead = simulator.opponentBoard.handZone.locator(
      '[data-testid="hand-card"][data-card-name="MT0D12 Flathead"] [data-interaction-state]',
    );
    await expect(flathead).toHaveAttribute("data-interaction-state", "selectable");

    await simulator.clearDispatchLog();
    await flathead.click();
    await simulator.expectLastDispatch({ type: "resolveDiscardFromHand", as: rival });

    await simulator.opponentPrompt.expectState("select-target");
    const corpoSecurity = simulator.opponentBoard.handZone.locator(
      '[data-testid="hand-card"][data-card-name="Corpo Security"] [data-interaction-state]',
    );
    await expect(corpoSecurity).toHaveAttribute("data-interaction-state", "selectable");

    await simulator.clearDispatchLog();
    await corpoSecurity.click();
    await simulator.expectLastDispatch({ type: "resolveDiscardFromHand", as: rival });
    await simulator.expectHandSize(rival, 1);
    await expect(simulator.page.locator(moveLog("Discarded 1 card."))).toBeVisible();
  });

  test("Meredith Stout recovers a trash card after a rival decreases a friendly Gig", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("unitMeredithStoutStoneColdCorpo");
    const rival = await simulator.getActivePlayerId();
    const meredithPlayer = await simulator.getOpponentOf(rival);

    await simulator.expectGigFaceValue(meredithPlayer, "d6", 5);
    await expect(
      simulator.playerBoard.fieldZone.locator(
        '[data-testid="field-unit"][data-card-name="Meredith Stout - Stone Cold Corpo"]',
      ),
    ).toBeVisible();
    await expect(simulator.playerBoard.root.locator('[data-testid="trash-zone"]')).toHaveAttribute(
      "data-count",
      "2",
    );

    await simulator.takeControl(rival);

    await simulator.clearDispatchLog();
    await simulator.opponentPrompt.verbButton("callLegend").click();
    await simulator.opponentPrompt.expectState("select-target");
    const evelyn = simulator.opponentBoard.legendsZone.locator(
      '[data-testid="legend-slot"][data-face-down="true"] [data-interaction-state="selectable"]',
    );
    await expect(evelyn).toHaveCount(1);
    await evelyn.click();
    await simulator.expectLastDispatch({ type: "callLegend", as: rival });
    await expect(
      simulator.page.locator(moveLog("Called Evelyn Parker - Beautiful Enigma.")),
    ).toBeVisible();
    await simulator.expectGigFaceValue(meredithPlayer, "d4", 1);
    await simulator.expectGigFaceValue(meredithPlayer, "d6", 5);

    await simulator.takeControl(meredithPlayer);
    await simulator.playerPrompt.expectState("select-target");
    await expect(simulator.playerPrompt.root).toContainText("Choose a card to move");

    const recovered = simulator.playerBoard.root.locator(
      '[data-testid="trash-card"][data-card-name="Ruthless Lowlife"] [data-interaction-state="selectable"]',
    );
    await expect(recovered).toBeVisible();
    const handBefore = await simulator.getHandSize(meredithPlayer);
    await simulator.clearDispatchLog();
    await recovered.click();
    await simulator.expectLastDispatch({ type: "resolveCardToMove", as: meredithPlayer });
    await simulator.expectHandSize(meredithPlayer, handBefore + 1);
    await expect(simulator.playerBoard.root.locator('[data-testid="trash-zone"]')).toHaveAttribute(
      "data-count",
      "1",
    );
    await expect(simulator.page.locator(moveLog("Moved Ruthless Lowlife."))).toBeVisible();
  });

  test("Kerry Eurodyne activates through the UI and draws 2 with a max-value Gig", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("unitKerryEurodyneTheLastRockerboy");
    const player = await simulator.getActivePlayerId();

    await simulator.expectGigFaceValue(player, "d4", 4);
    await simulator.playerPrompt.expectState("select-action");
    await expect(simulator.playerPrompt.verbButton("activateAbility")).toBeVisible();

    const kerry = simulator.playerBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="Kerry Eurodyne - The Last Rockerboy"]',
    );
    await expect(kerry).toBeVisible();
    await expect(kerry.locator("[data-interaction-state]")).toHaveAttribute(
      "data-interaction-state",
      "armable",
    );

    const handBefore = await simulator.getHandSize(player);
    await simulator.clearDispatchLog();
    await simulator.playerPrompt.verbButton("activateAbility").click();
    await simulator.playerPrompt.expectState("select-target");
    await expect(kerry.locator("[data-interaction-state]")).toHaveAttribute(
      "data-interaction-state",
      "selectable",
    );

    await kerry.locator("[data-interaction-state]").click();

    await simulator.expectLastDispatch({
      type: "activateAbility",
      as: player,
      abilityIndex: 0,
    });
    await simulator.expectHandSize(player, handBefore + 2);
    await expect(kerry).toHaveAttribute("data-spent", "true");
    await expect(
      simulator.page.locator(moveLog("Kerry Eurodyne - The Last Rockerboy activated its ability.")),
    ).toBeVisible();
    await expect(
      simulator.page.locator(moveLog("Kerry Eurodyne - The Last Rockerboy drew 2 cards.")),
    ).toBeVisible();
  });
});
