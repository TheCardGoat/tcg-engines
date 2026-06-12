import { test, expect } from "../fixtures/test";

const moveLog = (text: string) => `div[role="log"][aria-live="polite"]:has-text("${text}")`;

test.describe("Checklist legends", () => {
  test("Alt Cunningham - Soulkiller Architect steals a Gig, leaves play, and replays a trash program", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("legendAltCunninghamSoulkillerArchitect");
    const player = await simulator.getActivePlayerId();
    const rival = await simulator.getOpponentOf(player);

    await simulator.expectGigCount(player, 2);
    await simulator.expectGigCount(rival, 1);
    await simulator.playerPrompt.verbButton("passPhase").click();
    await simulator.playerPrompt.expectState("select-action");
    await simulator.playerPrompt.verbButton("attackRival").click();
    const alt = simulator.playerBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="Alt Cunningham - Soulkiller Architect"] [data-interaction-state]',
    );
    await expect(alt).toHaveAttribute("data-interaction-state", "selectable");

    await simulator.clearDispatchLog();
    await alt.click();
    await simulator.expectDispatch({ type: "attackRival", as: player });

    const attackProgress = simulator.page.locator(
      'button[aria-label="ATTACK IN PROGRESS"]:not([disabled])',
    );
    await simulator.clearDispatchLog();
    await attackProgress.click();
    await simulator.expectDispatch({ type: "resolveAttack", as: player });
    await simulator.expectGigCount(player, 3);
    await simulator.expectGigCount(rival, 0);
    await expect(
      simulator.playerBoard.fieldZone.locator(
        '[data-testid="field-unit"][data-card-name="Alt Cunningham - Soulkiller Architect"]',
      ),
    ).toHaveCount(0);

    await simulator.playerPrompt.expectState("select-target");
    await expect(
      simulator.playerPrompt.root.filter({ hasText: "Choose a card to play" }),
    ).toBeVisible();
    const corporateSurveillance = simulator.playerBoard.trashZone.locator(
      '[data-testid="trash-card"][data-card-name="Corporate Surveillance"] [data-interaction-state]',
    );
    await expect(corporateSurveillance).toHaveAttribute("data-interaction-state", "selectable");

    await simulator.clearDispatchLog();
    await corporateSurveillance.click();
    await simulator.expectDispatch({ type: "resolveCardToPlay", as: player });

    await simulator.playerPrompt.expectState("select-target");
    const corpoSecurity = simulator.opponentBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="Corpo Security"] [data-interaction-state]',
    );
    await expect(corpoSecurity).toHaveAttribute("data-interaction-state", "selectable");

    await simulator.clearDispatchLog();
    await corpoSecurity.click();
    await simulator.expectLastDispatch({ type: "resolveEffectTarget", as: player });
    await expect(
      simulator.opponentBoard.fieldZone.locator(
        '[data-testid="field-unit"][data-card-name="Corpo Security"][data-spent="true"]',
      ),
    ).toBeVisible();
    await expect(
      simulator.page.locator(moveLog("Played Corporate Surveillance for 0 eddies.")),
    ).toBeVisible();
  });

  test("Royce - Psycho on the Edge goes solo with equipped Gear and scaled power", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("legendRoycePsychoOnTheEdge");
    const player = await simulator.getActivePlayerId();
    const eddiesBefore = await simulator.getEddies(player);

    const legendRoyce = simulator.playerBoard.legendsZone.locator(
      '[data-testid="legend-slot"][data-card-name="Royce - Psycho on the Edge"]',
    );
    await expect(legendRoyce).toBeVisible();
    await expect(
      legendRoyce.locator('[data-testid="attached-gear"][data-card-name="Mantis Blades"]'),
    ).toBeVisible();
    await expect(
      legendRoyce.locator('[data-testid="attached-gear"][data-card-name="Kiroshi Optics"]'),
    ).toBeVisible();
    await expect(simulator.page.getByLabel("6 printed power, 13 current power")).toBeVisible();

    await expect(simulator.playerPrompt.verbButton("goSolo")).toBeVisible();
    await simulator.clearDispatchLog();
    await simulator.playerPrompt.verbButton("goSolo").click();
    await simulator.playerBoard.expectMode("select-target");
    const royceChoice = legendRoyce.locator('[data-interaction-state="selectable"]');
    await expect(royceChoice).toBeVisible();
    await royceChoice.click();
    await simulator.expectLastDispatch({ type: "goSolo", as: player });

    await simulator.expectEddies(player, eddiesBefore - 6);
    const fieldRoyce = simulator.playerBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="Royce - Psycho on the Edge"][data-gear-count="2"]',
    );
    await expect(fieldRoyce).toBeVisible();
    await expect(
      fieldRoyce.locator('[data-testid="attached-gear"][data-card-name="Mantis Blades"]'),
    ).toBeVisible();
    await expect(
      fieldRoyce.locator('[data-testid="attached-gear"][data-card-name="Kiroshi Optics"]'),
    ).toBeVisible();
    await expect(simulator.page.getByLabel("6 printed power, 13 current power")).toBeVisible();
    await expect(
      simulator.page.locator(moveLog("Played Royce - Psycho on the Edge for 6 eddies.")),
    ).toBeVisible();

    await simulator.playerPrompt.verbButton("passPhase").click();
    await simulator.playerPrompt.expectState("select-action");
    await simulator.playerPrompt.verbButton("attackRival").click();
    const attackingRoyce = fieldRoyce.locator('[data-interaction-state="selectable"]');
    await expect(attackingRoyce).toBeVisible();

    await simulator.clearDispatchLog();
    await attackingRoyce.click();
    await simulator.expectDispatch({ type: "attackRival", as: player });
    await expect(
      simulator.page.locator(moveLog("STEAL declared: Royce - Psycho on the Edge hits the rival.")),
    ).toBeVisible();
  });

  test("V - Streetkid goes solo, is defeated, mills 3, and recovers a Braindance", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("legendVStreetkid");
    const player = await simulator.getActivePlayerId();
    const eddiesBefore = await simulator.getEddies(player);

    await expect(simulator.playerPrompt.verbButton("goSolo")).toBeVisible();
    await simulator.clearDispatchLog();
    await simulator.playerPrompt.verbButton("goSolo").click();
    await simulator.playerBoard.expectMode("select-target");
    const vLegend = simulator.playerBoard.legendsZone.locator(
      '[data-testid="legend-slot"][data-card-name="V - Streetkid"] [data-interaction-state="selectable"]',
    );
    await expect(vLegend).toBeVisible();
    await vLegend.click();
    await simulator.expectLastDispatch({ type: "goSolo", as: player });
    await simulator.expectEddies(player, eddiesBefore - 4);
    await expect(
      simulator.page.locator(moveLog("Played V - Streetkid for 4 eddies.")),
    ).toBeVisible();

    await simulator.playerPrompt.verbButton("passPhase").click();
    await simulator.playerPrompt.expectState("select-action");
    const vCard = simulator.playerBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="V - Streetkid"]',
    );
    await expect(vCard).toBeVisible({ timeout: 10000 });
    const vAttacker = vCard.locator("[data-interaction-state]");
    await expect(vAttacker).toHaveAttribute("data-interaction-state", "armable");
    await vAttacker.click();
    await simulator.page.locator('[data-testid="card-action-attackUnit"]').click();
    const huscle = simulator.opponentBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="Swordwise Huscle"][data-spent="true"] [data-interaction-state]',
    );
    await expect(huscle).toHaveAttribute("data-interaction-state", "selectable");

    await simulator.clearDispatchLog();
    await huscle.click();
    await simulator.expectDispatch({ type: "attackUnit", as: player });
    await expect(
      simulator.page.locator(moveLog("FIGHT declared: V - Streetkid vs Swordwise Huscle.")),
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
      simulator.page.locator(moveLog("Swordwise Huscle defeated V - Streetkid.")),
    ).toBeVisible();

    await simulator.clearDispatchLog();
    await attackProgress.click();
    await simulator.expectDispatch({ type: "resolveAttack", as: player });
    await expect(simulator.playerBoard.deckZone).toHaveAttribute("data-count", "3");
    await simulator.expectHandSize(player, 1);
    await expect(
      simulator.playerBoard.handZone.locator(
        '[data-testid="hand-card"][data-card-name="Afterparty at Lizzie\'s"]',
      ),
    ).toBeVisible();
    await expect(
      simulator.page.locator(
        moveLog("Auto-resolved V - Streetkid: DEFEATED Discard the top 3 cards of your deck."),
      ),
    ).toBeVisible();
  });

  test("Goro Takemura - Hands Unclean goes solo as a ready BLOCKER and can attack", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("legendGoroTakemuraHandsUnclean");
    const player = await simulator.getActivePlayerId();
    const eddiesBefore = await simulator.getEddies(player);

    await expect(simulator.playerPrompt.verbButton("goSolo")).toBeVisible();
    await simulator.clearDispatchLog();
    await simulator.playerPrompt.verbButton("goSolo").click();
    await simulator.playerBoard.expectMode("select-target");
    const goroLegend = simulator.playerBoard.legendsZone.locator(
      '[data-testid="legend-slot"][data-card-name="Goro Takemura - Hands Unclean"] [data-interaction-state="selectable"]',
    );
    await expect(goroLegend).toBeVisible();
    await goroLegend.click();
    await simulator.expectLastDispatch({ type: "goSolo", as: player });
    await simulator.expectEddies(player, eddiesBefore - 5);

    const fieldGoro = simulator.playerBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="Goro Takemura - Hands Unclean"]',
    );
    await expect(fieldGoro).toBeVisible();
    await expect(fieldGoro).toHaveAttribute("data-spent", "false");
    await expect(
      fieldGoro.locator('[aria-label="BLOCKER: ready unit can redirect a rival attack"]'),
    ).toBeVisible();
    await expect(
      simulator.page.locator(moveLog("Played Goro Takemura - Hands Unclean for 5 eddies.")),
    ).toBeVisible();

    await simulator.playerPrompt.verbButton("passPhase").click();
    await simulator.playerPrompt.expectState("select-action");
    await simulator.playerPrompt.verbButton("attackRival").click();
    const attackingGoro = fieldGoro.locator('[data-interaction-state="selectable"]');
    await expect(attackingGoro).toBeVisible();

    await simulator.clearDispatchLog();
    await attackingGoro.click();
    await simulator.expectDispatch({ type: "attackRival", as: player });
    await expect(
      simulator.page.locator(
        moveLog("STEAL declared: Goro Takemura - Hands Unclean hits the rival."),
      ),
    ).toBeVisible();
  });

  test("V - Corporate Exile goes solo and steals a Gig on same-turn attack", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("legendVCorporateExile");
    const player = await simulator.getActivePlayerId();
    const rival = await simulator.getOpponentOf(player);
    const eddiesBefore = await simulator.getEddies(player);

    await expect(simulator.playerPrompt.verbButton("goSolo")).toBeVisible();
    await simulator.clearDispatchLog();
    await simulator.playerPrompt.verbButton("goSolo").click();
    await simulator.playerBoard.expectMode("select-target");
    const vLegend = simulator.playerBoard.legendsZone.locator(
      '[data-testid="legend-slot"][data-card-name="V - Corporate Exile"] [data-interaction-state="selectable"]',
    );
    await expect(vLegend).toBeVisible();
    await vLegend.click();
    await simulator.expectLastDispatch({ type: "goSolo", as: player });
    await simulator.expectEddies(player, eddiesBefore - 5);

    const fieldV = simulator.playerBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="V - Corporate Exile"]',
    );
    await expect(fieldV).toBeVisible();
    await expect(fieldV).toHaveAttribute("data-spent", "false");
    await expect(
      simulator.page.locator(moveLog("Played V - Corporate Exile for 5 eddies.")),
    ).toBeVisible();

    await simulator.expectGigCount(player, 1);
    await simulator.expectGigCount(rival, 1);
    await simulator.playerPrompt.verbButton("passPhase").click();
    await simulator.playerPrompt.expectState("select-action");
    await simulator.playerPrompt.verbButton("attackRival").click();
    const attackingV = fieldV.locator('[data-interaction-state="selectable"]');
    await expect(attackingV).toBeVisible();

    await simulator.clearDispatchLog();
    await attackingV.click();
    await simulator.expectDispatch({ type: "attackRival", as: player });

    const attackProgress = simulator.page.locator(
      'button[aria-label="ATTACK IN PROGRESS"]:not([disabled])',
    );
    await simulator.clearDispatchLog();
    await attackProgress.click();
    await simulator.expectDispatch({ type: "resolveAttack", as: player });
    await simulator.expectGigCount(player, 2);
    await simulator.expectGigCount(rival, 0);
    await expect(
      simulator.page.locator(moveLog("STEAL resolved: V - Corporate Exile stole 1 Gig.")),
    ).toBeVisible();
  });

  test("Saburo Arasaka - Stubborn Patriarch gives an attacking Arasaka unit +1 power", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("legendSaburoArasakaStubbornPatriach");
    const player = await simulator.getActivePlayerId();

    await simulator.playerPrompt.verbButton("passPhase").click();
    await simulator.playerPrompt.expectState("select-action");
    await simulator.playerPrompt.verbButton("attackRival").click();
    const minotaur = simulator.playerBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="Armored Minotaur"] [data-interaction-state]',
    );
    await expect(minotaur).toHaveAttribute("data-interaction-state", "selectable");

    await simulator.clearDispatchLog();
    await minotaur.click();
    await simulator.expectDispatch({ type: "attackRival", as: player });

    await expect(simulator.page.getByLabel("9 printed power, 10 current power")).toBeVisible();
    await expect(
      simulator.page.locator(moveLog("STEAL declared: Armored Minotaur hits the rival.")),
    ).toBeVisible();
  });

  test("Yorinobu Arasaka - Embracing Destruction draws then discards on first Arasaka attack", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("legendYorinobuArasakaEmbracingDestruction");
    const player = await simulator.getActivePlayerId();
    const handBefore = await simulator.getHandSize(player);

    await simulator.playerPrompt.verbButton("passPhase").click();
    await simulator.playerPrompt.expectState("select-action");
    await simulator.playerPrompt.verbButton("attackRival").click();
    const minotaur = simulator.playerBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="Armored Minotaur"] [data-interaction-state]',
    );
    await expect(minotaur).toHaveAttribute("data-interaction-state", "selectable");

    await simulator.clearDispatchLog();
    await minotaur.click();
    await simulator.expectDispatch({ type: "attackRival", as: player });

    await simulator.playerPrompt.expectState("select-target");
    await expect(
      simulator.playerPrompt.root.filter({ hasText: "Discard 1 card from hand" }),
    ).toBeVisible();
    await simulator.expectHandSize(player, handBefore + 1);

    const discard = simulator.playerBoard.handZone.locator(
      '[data-testid="hand-card"][data-card-name="Ruthless Lowlife"] [data-interaction-state]',
    );
    await expect(discard).toHaveAttribute("data-interaction-state", "selectable");

    await simulator.clearDispatchLog();
    await discard.click();
    await simulator.expectDispatch({ type: "resolveDiscardFromHand", as: player });

    await simulator.expectHandSize(player, handBefore);
    await expect(
      simulator.playerBoard.trashZone.locator(
        '[data-testid="trash-card"][data-card-name="Ruthless Lowlife"]',
      ),
    ).toBeVisible();
    await expect(simulator.page.locator(moveLog("Discarded 1 card."))).toBeVisible();
  });

  test("Jackie Welles - Pour One Out For Me increases a Gig and draws when blue Gear hits max", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("legendJackieWellesPourOneOutForMe");
    const player = await simulator.getActivePlayerId();
    const handBefore = await simulator.getHandSize(player);
    const eddiesBefore = await simulator.getEddies(player);

    await simulator.expectGigFaceValue(player, "d4", 2);
    const dyingNight = simulator.playerBoard.handZone.locator(
      '[data-testid="hand-card"][data-card-name="Dying Night - V\'s Pistol"] [data-interaction-state]',
    );
    const swordwise = simulator.playerBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="Swordwise Huscle"]',
    );
    await expect(dyingNight).toHaveAttribute("data-interaction-state", "armable");
    await expect(swordwise).toBeVisible();

    await simulator.clearDispatchLog();
    await simulator.drag(dyingNight, swordwise);
    await simulator.expectDispatch({ type: "playCard", as: player });

    await simulator.expectGigFaceValue(player, "d4", 4);
    await simulator.expectHandSize(player, handBefore);
    await simulator.expectEddies(player, eddiesBefore - 2);
    await expect(
      simulator.playerBoard.fieldZone.locator(
        '[data-testid="field-unit"][data-card-name="Swordwise Huscle"][data-gear-count="1"] [data-testid="attached-gear"][data-card-name="Dying Night - V\'s Pistol"]',
      ),
    ).toBeVisible();
    await expect(
      simulator.page.locator(moveLog("Played Dying Night - V's Pistol for 2 eddies")),
    ).toBeVisible();
  });

  test("Viktor Vektor - Sit Down and Relax calls and takes two low-cost Gear from search", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("legendViktorVektorSitDownAndRelax");
    const player = await simulator.getActivePlayerId();
    const handBefore = await simulator.getHandSize(player);

    await expect(simulator.playerPrompt.verbButton("callLegend")).toBeVisible();
    await simulator.clearDispatchLog();
    await simulator.playerPrompt.verbButton("callLegend").click();
    await simulator.playerBoard.expectMode("select-target");
    const viktor = simulator.playerBoard.legendsZone.locator(
      '[data-testid="legend-slot"][data-face-down="true"] [data-interaction-state="selectable"]',
    );
    await expect(viktor).toHaveCount(1);
    await viktor.click();
    await simulator.expectLastDispatch({ type: "callLegend", as: player });
    await expect(
      simulator.page.locator(moveLog("Called Viktor Vektor - Sit Down and Relax.")),
    ).toBeVisible();

    await expect(
      simulator.page.getByRole("dialog").filter({ hasText: "Search deck" }),
    ).toBeVisible();
    const kiroshi = simulator.page.locator(
      '[data-testid="search-deck-card"]:has-text("Kiroshi Optics")',
    );
    const mantis = simulator.page.locator(
      '[data-testid="search-deck-card"]:has-text("Mantis Blades")',
    );
    await expect(kiroshi).toBeVisible();
    await expect(mantis).toBeVisible();

    await kiroshi.click();
    await mantis.click();
    await expect(kiroshi).toHaveAttribute("data-selected", "true");
    await expect(mantis).toHaveAttribute("data-selected", "true");

    await simulator.clearDispatchLog();
    await simulator.page.locator('[data-testid="search-deck-confirm"]').click();
    await simulator.expectLastDispatch({ type: "resolveSearchDeck", as: player });

    await simulator.expectHandSize(player, handBefore + 2);
    await expect(simulator.playerBoard.deckZone).toHaveAttribute("data-count", "3");
    await expect(
      simulator.playerBoard.handZone.locator(
        '[data-testid="hand-card"][data-card-name="Kiroshi Optics"]',
      ),
    ).toBeVisible();
    await expect(
      simulator.playerBoard.handZone.locator(
        '[data-testid="hand-card"][data-card-name="Mantis Blades"]',
      ),
    ).toBeVisible();
    await expect(
      simulator.page.locator(moveLog("Searched the top 5 cards and found 2.")),
    ).toBeVisible();
  });

  test("Evelyn Parker - Beautiful Enigma searches top 3 and takes a Braindance program", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("legendEvelynParkerBeautifulEnigma");
    const player = await simulator.getActivePlayerId();
    const handBefore = await simulator.getHandSize(player);

    await expect(simulator.playerPrompt.verbButton("activateAbility")).toBeVisible();
    const evelyn = simulator.playerBoard.legendsZone.locator(
      '[data-testid="legend-slot"][data-card-name="Evelyn Parker - Beautiful Enigma"] [data-interaction-state]',
    );
    await expect(evelyn).toHaveAttribute("data-interaction-state", "armable");

    await simulator.clearDispatchLog();
    await simulator.playerPrompt.verbButton("activateAbility").click();
    await simulator.playerPrompt.expectState("select-target");
    await expect(evelyn).toHaveAttribute("data-interaction-state", "selectable");
    await evelyn.click();
    await simulator.expectLastDispatch({ type: "activateAbility", as: player, abilityIndex: 1 });
    await expect(
      simulator.page.locator(moveLog("Evelyn Parker - Beautiful Enigma activated its ability.")),
    ).toBeVisible();

    await expect(
      simulator.page.getByRole("dialog").filter({ hasText: "Search deck" }),
    ).toBeVisible();
    await expect(simulator.page.locator('[data-testid="search-deck-card"]')).toHaveCount(1);
    const afterparty = simulator.page.locator(
      '[data-testid="search-deck-card"]:has-text("Afterparty at Lizzie")',
    );
    await expect(afterparty).toBeVisible();
    await expect(afterparty).toBeEnabled();

    await simulator.clearDispatchLog();
    await afterparty.click();
    await simulator.expectLastDispatch({ type: "resolveSearchDeck", as: player });

    await simulator.expectHandSize(player, handBefore + 1);
    await expect(simulator.playerBoard.deckZone).toHaveAttribute("data-count", "2");
    await expect(
      simulator.playerBoard.handZone.locator(
        '[data-testid="hand-card"][data-card-name="Afterparty at Lizzie\'s"]',
      ),
    ).toBeVisible();
    await expect(
      simulator.page.locator(moveLog("Searched the top 3 cards and found 1.")),
    ).toBeVisible();
  });

  test("River Ward - Detective on the Hunt equips a clicked low-cost Gear for free on attack", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("legendRiverWardDetectiveOnTheHunt");
    const player = await simulator.getActivePlayerId();
    const handBefore = await simulator.getHandSize(player);
    const eddiesBefore = await simulator.getEddies(player);

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

    await simulator.playerPrompt.expectState("select-target");
    await expect(
      simulator.playerPrompt.root.filter({ hasText: "Choose a card to play" }),
    ).toBeVisible();
    const kiroshi = simulator.playerBoard.handZone.locator(
      '[data-testid="hand-card"][data-card-name="Kiroshi Optics"] [data-interaction-state]',
    );
    await expect(kiroshi).toHaveAttribute("data-interaction-state", "selectable");

    await simulator.clearDispatchLog();
    await kiroshi.click();
    await simulator.expectDispatch({ type: "resolveCardToPlay", as: player });

    await simulator.expectHandSize(player, handBefore - 1);
    await simulator.expectEddies(player, eddiesBefore);
    expect(await simulator.getSpentLegendsCount(player)).toBe(1);
    await expect(
      simulator.playerBoard.fieldZone.locator(
        '[data-testid="field-unit"][data-card-name="Secondhand Bombus"][data-gear-count="1"] [data-testid="attached-gear"][data-card-name="Kiroshi Optics"]',
      ),
    ).toBeVisible();
    await expect(
      simulator.page.locator(moveLog("Played Kiroshi Optics for 0 eddies")),
    ).toBeVisible();
  });

  test("Dum Dum - Maelstrom Triggerman calls, defeats a clicked Gear, and draws 4", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("legendDumDumMaelstromTriggerman");
    const player = await simulator.getActivePlayerId();
    const handBefore = await simulator.getHandSize(player);

    await expect(simulator.playerPrompt.verbButton("callLegend")).toBeVisible();
    await expect(
      simulator.playerBoard.fieldZone.locator(
        '[data-testid="field-unit"][data-card-name="T-Bug - Amateur Philosopher"] [data-testid="attached-gear"][data-card-name="Kiroshi Optics"]',
      ),
    ).toBeVisible();

    await simulator.clearDispatchLog();
    await simulator.playerPrompt.verbButton("callLegend").click();
    await simulator.playerBoard.expectMode("select-target");
    const dumDum = simulator.playerBoard.legendsZone.locator(
      '[data-testid="legend-slot"][data-face-down="true"] [data-interaction-state="selectable"]',
    );
    await expect(dumDum).toHaveCount(1);
    await dumDum.click();
    await simulator.expectLastDispatch({ type: "callLegend", as: player });
    await expect(
      simulator.playerBoard.legendsZone.locator(
        '[data-testid="legend-slot"][data-card-name="Dum Dum - Maelstrom Triggerman"][data-face-down="false"]',
      ),
    ).toBeVisible();
    await expect(
      simulator.page.locator(moveLog("Called Dum Dum - Maelstrom Triggerman.")),
    ).toBeVisible();

    await simulator.playerPrompt.expectState("select-target");
    await expect(
      simulator.playerPrompt.root.filter({ hasText: "Choose a card to trash" }),
    ).toBeVisible();
    const kiroshi = simulator.playerBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="T-Bug - Amateur Philosopher"] [data-testid="attached-gear"][data-card-name="Kiroshi Optics"] button[data-choice-type="resolveCardToMove"]',
    );
    await expect(kiroshi).toBeVisible();

    await simulator.clearDispatchLog();
    await kiroshi.click();
    await simulator.expectDispatch({ type: "resolveCardToMove", as: player });

    await simulator.expectHandSize(player, handBefore + 4);
    await expect(
      simulator.playerBoard.fieldZone.locator(
        '[data-testid="field-unit"][data-card-name="T-Bug - Amateur Philosopher"][data-gear-count="1"]',
      ),
    ).toBeVisible();
    await expect(
      simulator.playerBoard.trashZone.locator(
        '[data-testid="trash-card"][data-card-name="Kiroshi Optics"]',
      ),
    ).toBeVisible();
    await expect(simulator.page.locator(moveLog("Moved Kiroshi Optics."))).toBeVisible();
  });

  test("Dum Dum - Maelstrom Triggerman can pass the optional gear-defeat effect and draws 1", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("legendDumDumMaelstromTriggerman");
    const player = await simulator.getActivePlayerId();
    const handBefore = await simulator.getHandSize(player);

    await expect(simulator.playerPrompt.verbButton("callLegend")).toBeVisible();

    await simulator.clearDispatchLog();
    await simulator.playerPrompt.verbButton("callLegend").click();
    await simulator.playerBoard.expectMode("select-target");
    const dumDum = simulator.playerBoard.legendsZone.locator(
      '[data-testid="legend-slot"][data-face-down="true"] [data-interaction-state="selectable"]',
    );
    await expect(dumDum).toHaveCount(1);
    await dumDum.click();
    await simulator.expectLastDispatch({ type: "callLegend", as: player });

    await simulator.playerPrompt.expectState("select-target");
    await expect(
      simulator.playerPrompt.root.filter({ hasText: "Choose card to trash" }),
    ).toBeVisible();
    const kiroshi = simulator.playerBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="T-Bug - Amateur Philosopher"] [data-testid="attached-gear"][data-card-name="Kiroshi Optics"] button[data-choice-type="resolveCardToMove"]',
    );
    await expect(kiroshi).toBeVisible();

    const passButton = simulator.page.locator('[data-testid="prompt-target-pass"]');
    await expect(passButton).toBeVisible();

    await simulator.clearDispatchLog();
    await passButton.click();
    await simulator.expectDispatch({ type: "resolveCardToMove", pass: true, as: player });

    await simulator.expectHandSize(player, handBefore + 1);
    await expect(
      simulator.playerBoard.fieldZone.locator(
        '[data-testid="field-unit"][data-card-name="T-Bug - Amateur Philosopher"][data-gear-count="2"] [data-testid="attached-gear"][data-card-name="Kiroshi Optics"]',
      ),
    ).toBeVisible();
    await expect(simulator.page.locator(moveLog("Skipped the optional move"))).toBeVisible();
  });

  test("Panam Palmer - Nomad Cavalry moves clicked gear to the attacker and readies it", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("legendPanamPalmerNomadCavalry");
    const player = await simulator.getActivePlayerId();

    await simulator.playerPrompt.verbButton("passPhase").click();
    await simulator.playerPrompt.expectState("select-action");
    await simulator.playerPrompt.verbButton("attackRival").click();
    const swordwise = simulator.playerBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="Swordwise Huscle"] [data-interaction-state]',
    );
    await expect(swordwise).toHaveAttribute("data-interaction-state", "selectable");

    await simulator.clearDispatchLog();
    await swordwise.click();
    await simulator.expectDispatch({ type: "attackRival", as: player });

    await simulator.playerPrompt.expectState("select-target");
    await expect(
      simulator.playerPrompt.root.filter({ hasText: "Choose a card to move" }),
    ).toBeVisible();
    const mantisBlades = simulator.playerBoard.legendsZone.locator(
      '[data-testid="attached-gear"][data-card-name="Mantis Blades"] button[data-choice-type="resolveCardToMove"]',
    );
    await expect(mantisBlades).toBeVisible();

    await simulator.clearDispatchLog();
    await mantisBlades.click();
    await simulator.expectDispatch({ type: "resolveCardToMove", as: player });

    expect(await simulator.getSpentLegendsCount(player)).toBe(1);
    await expect(
      simulator.playerBoard.fieldZone.locator(
        '[data-testid="field-unit"][data-card-name="Swordwise Huscle"][data-spent="false"][data-gear-count="1"] [data-testid="attached-gear"][data-card-name="Mantis Blades"]',
      ),
    ).toBeVisible();
    await expect(
      simulator.playerBoard.legendsZone.locator(
        '[data-testid="attached-gear"][data-card-name="Mantis Blades"]',
      ),
    ).toHaveCount(0);
    await expect(simulator.page.locator(moveLog("Moved Mantis Blades."))).toBeVisible();
  });

  test("Goro Takemura - Vengeful Bodyguard grants a clicked friendly unit +1 power and BLOCKER", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("legendGoroTakemuraVengefulBodyguard");
    const attacker = await simulator.getActivePlayerId();
    const defender = await simulator.getOpponentOf(attacker);

    await simulator.expectGigFaceValue(defender, "d6", 3);
    await simulator.expectGigFaceValue(defender, "d8", 3);
    await simulator.takeControl(defender);
    await simulator.playerPrompt.expectState("select-target");
    await expect(
      simulator.playerPrompt.root.filter({ hasText: "Goro Takemura - Vengeful Bodyguard" }),
    ).toBeVisible();

    const corpoSecurity = simulator.playerBoard.fieldZone.locator(
      '[data-testid="field-unit"][data-card-name="Corpo Security"] [data-interaction-state]',
    );
    await expect(corpoSecurity).toHaveAttribute("data-interaction-state", "selectable");

    await simulator.clearDispatchLog();
    await corpoSecurity.click();
    await simulator.expectDispatch({ type: "resolveEffectTarget", as: defender });

    expect(await simulator.getSpentLegendsCount(defender)).toBe(1);
    await expect(simulator.page.getByLabel("2 printed power, 3 current power")).toBeVisible();
    await expect(
      simulator.playerBoard.fieldZone.locator(
        '[data-testid="field-unit"][data-card-name="Corpo Security"] [aria-label="BLOCKER: ready unit can redirect a rival attack"][data-ready="true"]',
      ),
    ).toBeVisible();
    await expect(
      simulator.page.locator(moveLog("Goro Takemura - Vengeful Bodyguard")),
    ).toBeVisible();

    await simulator.takeControl(defender);
    await simulator.playerPrompt.verbButton("useBlocker").click();
    await expect(corpoSecurity).toHaveAttribute("data-interaction-state", "selectable");

    await simulator.clearDispatchLog();
    await corpoSecurity.click();
    await simulator.expectLastDispatch({ type: "useBlocker", as: defender });
    await expect(
      simulator.page.locator(moveLog("BLOCK: Corpo Security redirected Armored Minotaur")),
    ).toBeVisible();
  });
});
