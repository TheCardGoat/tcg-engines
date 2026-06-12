/**
 * Smoke spec for the drag-and-drop POM helper.
 *
 * Drives a `playCard` move by dragging a hand card onto the field zone via
 * raw pointer events (dnd-kit's PointerSensor needs real `pointerdown`/
 * `pointermove` to activate). Asserts:
 *   1. The dispatch spy recorded `{ type: "playCard", cardId, as }` — proves
 *      the drag-end event was decoded and routed through `dropMapping` →
 *      `EngineProvider.dispatch` correctly.
 *   2. Engine state moves: hand size -1, field size +1.
 *   3. UI reflects: rendered hand-card count -1.
 *
 * Uses the `openingMain` fixture because it pins a deterministic 3-card
 * hand on P1 (alphaRuthlessLowlife cost 2, alphaSwordwiseHuscle cost 3,
 * alphaFloorIt cost 3) with 5 eddies — every card is playable.
 */
import { test, expect } from "../fixtures/test";

test.describe("Drag-and-drop", () => {
  test("dragging a hand card onto the field plays it", async ({ simulator }) => {
    await simulator.gotoFixture("openingMain");

    const first = await simulator.getActivePlayerId();
    expect(await simulator.getPhase()).toBe("main");

    const handBefore = await simulator.getHandSize(first);
    const fieldCountBefore = await simulator.getFieldSize(first);

    // Pick the first hand card. Its data-card-id matches an engine
    // instance id; the drop handler maps the source slot back to that id.
    const board = simulator.playerBoard;
    const sourceCardWrapper = board.handCards.first();
    await expect(sourceCardWrapper).toBeVisible();
    const cardId = await sourceCardWrapper.getAttribute("data-card-id");
    expect(cardId, "first hand card must have a data-card-id").toBeTruthy();
    const sourceCard = sourceCardWrapper.locator("[data-interaction-state]");
    await expect(sourceCard).toHaveAttribute("data-interaction-state", "armable");

    // Drag → drop on the field zone.
    await simulator.clearDispatchLog();
    await simulator.drag(sourceCard, board.fieldZone);

    // Spy: the click → drop handler → dispatch chain produced a playCard
    // action with the right card id and the human's player id.
    await simulator.expectLastDispatch({ type: "playCard", cardId: cardId!, as: first });

    // Engine state moves.
    expect(await simulator.getHandSize(first)).toBe(handBefore - 1);
    expect(await simulator.getFieldSize(first)).toBe(fieldCountBefore + 1);

    // UI reflects: one fewer hand card rendered.
    await expect(board.handCards).toHaveCount(handBefore - 1);
  });

  test("selecting a hand card exposes tray actions and Play dispatches the card", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("openingMain");
    const first = await simulator.getActivePlayerId();
    const board = simulator.playerBoard;
    const playableId = await simulator.page.evaluate(() => {
      const e = (window as { __cyberpunkEngine?: { getPrompt: (p: string) => unknown } })
        .__cyberpunkEngine;
      if (!e) {
        throw new Error("no engine");
      }
      const prompt = e.getPrompt("p1") as {
        availableMoves: Array<{
          moveId: string;
          inputSpec: { candidates?: Array<string | { cardId: string }> };
        }>;
      };
      const play = prompt.availableMoves.find((m) => m.moveId === "playCard");
      const candidate = play?.inputSpec.candidates?.[0];
      return typeof candidate === "string" ? candidate : (candidate?.cardId ?? null);
    });
    expect(playableId, "expected at least one playable card in hand").toBeTruthy();

    const playableCardWrap = board.handZone.locator(
      `[data-testid="hand-card"][data-card-id="${playableId}"]`,
    );
    const playableCard = playableCardWrap.locator("[data-interaction-state]");
    await expect(playableCard).toHaveAttribute("data-interaction-state", "armable");

    await playableCard.dispatchEvent("click");
    const actionMenu = simulator.page.locator('[data-testid="card-action-menu"]');
    await expect(actionMenu).toBeVisible();
    await expect(actionMenu.locator('[data-testid="card-action-playCard"]')).toBeVisible();

    const handBefore = await simulator.getHandSize(first);
    const fieldBefore = await simulator.getFieldSize(first);
    await simulator.clearDispatchLog();
    await actionMenu.locator('[data-testid="card-action-playCard"]').click();

    await simulator.expectLastDispatch({ type: "playCard", cardId: playableId!, as: first });
    expect(await simulator.getHandSize(first)).toBe(handBefore - 1);
    expect(await simulator.getFieldSize(first)).toBe(fieldBefore + 1);
    await expect(simulator.page.locator('[data-testid="card-action-menu"]')).toHaveCount(0);
  });

  test("selecting a sellable hand card exposes tray Sell and sells the card", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("openingMain");
    const first = await simulator.getActivePlayerId();
    const board = simulator.playerBoard;
    const sellableId = await simulator.page.evaluate(() => {
      const e = (window as { __cyberpunkEngine?: { getPrompt: (p: string) => unknown } })
        .__cyberpunkEngine;
      if (!e) {
        throw new Error("no engine");
      }
      const prompt = e.getPrompt("p1") as {
        availableMoves: Array<{ moveId: string; inputSpec: { candidates?: string[] } }>;
      };
      return (
        prompt.availableMoves.find((m) => m.moveId === "sellCard")?.inputSpec.candidates?.[0] ??
        null
      );
    });
    expect(sellableId, "expected at least one sellable card in hand").toBeTruthy();

    const sellableCardWrap = board.handZone.locator(
      `[data-testid="hand-card"][data-card-id="${sellableId}"]`,
    );
    const sellableCard = sellableCardWrap.locator("[data-interaction-state]");
    await expect(sellableCard).toHaveAttribute("data-interaction-state", "armable");
    await sellableCard.dispatchEvent("click");
    const actionMenu = simulator.page.locator('[data-testid="card-action-menu"]');
    await expect(actionMenu).toBeVisible();
    await expect(actionMenu.locator('[data-testid="card-action-sellCard"]')).toBeVisible();

    const handBefore = await simulator.getHandSize(first);
    const eddiesBefore = await simulator.getEddies(first);
    await simulator.clearDispatchLog();
    await actionMenu.locator('[data-testid="card-action-sellCard"]').click();

    await simulator.expectLastDispatch({ type: "sellCard", cardId: sellableId!, as: first });
    expect(await simulator.getHandSize(first)).toBe(handBefore - 1);
    await expect(board.eddiesZone).toHaveAttribute("data-count", String(eddiesBefore + 1));
    await expect(board.eddiesZone).toHaveAttribute("data-card-count", String(eddiesBefore + 1));
    await expect(simulator.page.locator('[data-testid="card-action-menu"]')).toHaveCount(0);
  });

  test("opponent hand is a compact count rail without revealed card metadata", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("openingMain");
    const first = await simulator.getActivePlayerId();
    const rival = await simulator.getOpponentOf(first);
    const rivalHand = await simulator.getHandSize(rival);

    await expect(simulator.opponentBoard.handZone).toHaveAttribute("data-count", String(rivalHand));
    await expect(
      simulator.opponentBoard.handZone.locator('[data-testid="opponent-hand-count"]'),
    ).toContainText(String(rivalHand));
    await expect(simulator.opponentBoard.handCards).toHaveCount(Math.min(rivalHand, 5));
    await expect(simulator.opponentBoard.handCards.locator("[data-card-id]")).toHaveCount(0);
    await expect(simulator.opponentBoard.handCards.locator("[data-card-name]")).toHaveCount(0);
  });

  test("dragging a ready field unit onto a spent rival unit attacks it", async ({ simulator }) => {
    await simulator.gotoFixture("attackStep");
    const first = await simulator.getActivePlayerId();
    expect(await simulator.getPhase()).toBe("main");

    const pair = await simulator.page.evaluate(() => {
      const e = (window as { __cyberpunkEngine?: { getPrompt: (p: string) => unknown } })
        .__cyberpunkEngine;
      if (!e) {
        throw new Error("no engine");
      }
      const prompt = e.getPrompt("p1") as {
        availableMoves: Array<{
          moveId: string;
          inputSpec:
            | { type: "selectPair"; fromCandidates: string[]; toCandidates: string[] }
            | { type: string };
        }>;
      };
      const attackUnit = prompt.availableMoves.find((m) => m.moveId === "attackUnit");
      const spec = attackUnit?.inputSpec as
        | { type: string; fromCandidates?: string[]; toCandidates?: string[] }
        | undefined;
      if (spec?.type !== "selectPair") {
        return null;
      }
      return {
        attackerId: spec.fromCandidates?.[0],
        defenderId: spec.toCandidates?.[0],
      };
    });
    expect(pair, "expected a legal attackUnit pair").toBeTruthy();

    const attacker = simulator.playerBoard.fieldZone.locator(
      `[data-testid="field-unit"][data-card-id="${pair!.attackerId}"]`,
    );
    const defender = simulator.opponentBoard.fieldZone.locator(
      `[data-testid="field-unit"][data-card-id="${pair!.defenderId}"]`,
    );
    await expect(attacker).toBeVisible();
    await expect(defender).toBeVisible();

    await simulator.clearDispatchLog();

    const attackerBox = await attacker.boundingBox();
    const defenderBox = await defender.boundingBox();
    expect(attackerBox, "attacker must have a bounding box").toBeTruthy();
    expect(defenderBox, "defender must have a bounding box").toBeTruthy();
    const attackerCenter = {
      x: attackerBox!.x + attackerBox!.width / 2,
      y: attackerBox!.y + attackerBox!.height / 2,
    };
    const defenderCenter = {
      x: defenderBox!.x + defenderBox!.width / 2,
      y: defenderBox!.y + defenderBox!.height / 2,
    };

    await simulator.page.mouse.move(attackerCenter.x, attackerCenter.y);
    await simulator.page.mouse.down();
    await simulator.page.mouse.move(attackerCenter.x + 8, attackerCenter.y + 8, { steps: 5 });
    await expect(defender.locator('[data-drop-hint="attackUnit"]')).toBeVisible();
    await simulator.page.mouse.move(defenderCenter.x, defenderCenter.y, { steps: 12 });
    await simulator.page.mouse.up();

    await simulator.expectDispatch({
      type: "attackUnit",
      attackerId: pair!.attackerId,
      defenderId: pair!.defenderId,
      as: first,
    });
  });

  test("dragging a ready field unit onto the rival info panel attacks the rival", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("attackStep");
    const first = await simulator.getActivePlayerId();
    expect(await simulator.getPhase()).toBe("main");

    const attackerId = await simulator.page.evaluate(() => {
      const e = (window as { __cyberpunkEngine?: { getPrompt: (p: string) => unknown } })
        .__cyberpunkEngine;
      if (!e) {
        throw new Error("no engine");
      }
      const prompt = e.getPrompt("p1") as {
        availableMoves: Array<{
          moveId: string;
          inputSpec: { type: "selectCard"; candidates: string[] } | { type: string };
        }>;
      };
      const attackRival = prompt.availableMoves.find((m) => m.moveId === "attackRival");
      const spec = attackRival?.inputSpec as { type: string; candidates?: string[] } | undefined;
      if (spec?.type !== "selectCard") {
        return null;
      }
      return spec.candidates?.[0] ?? null;
    });
    expect(attackerId, "expected a legal attackRival candidate").toBeTruthy();

    const attacker = simulator.playerBoard.fieldZone.locator(
      `[data-testid="field-unit"][data-card-id="${attackerId}"]`,
    );
    const rivalInfo = simulator.opponentBoard.root.locator('[data-testid="pinfo-zone"]');
    await expect(attacker).toBeVisible();
    await expect(rivalInfo).toBeVisible();

    await simulator.clearDispatchLog();

    const attackerBox = await attacker.boundingBox();
    const targetBox = await rivalInfo.boundingBox();
    expect(attackerBox, "attacker must have a bounding box").toBeTruthy();
    expect(targetBox, "rival info panel must have a bounding box").toBeTruthy();
    const attackerCenter = {
      x: attackerBox!.x + attackerBox!.width / 2,
      y: attackerBox!.y + attackerBox!.height / 2,
    };
    const targetCenter = {
      x: targetBox!.x + targetBox!.width / 2,
      y: targetBox!.y + targetBox!.height / 2,
    };

    await simulator.page.mouse.move(attackerCenter.x, attackerCenter.y);
    await simulator.page.mouse.down();
    await simulator.page.mouse.move(attackerCenter.x + 8, attackerCenter.y + 8, { steps: 5 });
    await expect(rivalInfo).toHaveAttribute("data-drop-hint", "attackRival");
    await expect(rivalInfo).toHaveAttribute("aria-label", "Attack the rival");
    await simulator.page.mouse.move(targetCenter.x, targetCenter.y, { steps: 12 });
    await simulator.page.mouse.up();

    await simulator.expectDispatch({
      type: "attackRival",
      attackerId: attackerId!,
      as: first,
    });
  });

  test("clicking Sell enters target selection and sells the clicked candidate", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("openingMain");
    const first = await simulator.getActivePlayerId();
    const board = simulator.playerBoard;
    const sellableId = await simulator.page.evaluate(() => {
      const e = (window as { __cyberpunkEngine?: { getPrompt: (p: string) => unknown } })
        .__cyberpunkEngine;
      if (!e) {
        throw new Error("no engine");
      }
      const prompt = e.getPrompt("p1") as {
        availableMoves: Array<{ moveId: string; inputSpec: { candidates?: string[] } }>;
      };
      return (
        prompt.availableMoves.find((m) => m.moveId === "sellCard")?.inputSpec.candidates?.[0] ??
        null
      );
    });
    expect(sellableId, "expected at least one sellable card in hand").toBeTruthy();

    const sellableCard = board.handZone.locator(
      `[data-testid="hand-card"][data-card-id="${sellableId}"] [data-interaction-state]`,
    );
    await expect(sellableCard).toHaveAttribute("data-interaction-state", "armable");

    await simulator.clearDispatchLog();
    await simulator.playerPrompt.verbButton("sellCard").click();
    await board.expectMode("select-target");
    await expect(sellableCard).toHaveAttribute("data-interaction-state", "selectable");

    const handBefore = await simulator.getHandSize(first);
    const eddiesBefore = await simulator.getEddies(first);
    await sellableCard.click();

    await simulator.expectLastDispatch({ type: "sellCard", cardId: sellableId!, as: first });
    expect(await simulator.getHandSize(first)).toBe(handBefore - 1);
    await expect(board.eddiesZone).toHaveAttribute("data-count", String(eddiesBefore + 1));
    await expect(board.eddiesZone).toHaveAttribute("data-card-count", String(eddiesBefore + 1));
  });

  test("clicking Call Legend enters target selection and calls the clicked legend", async ({
    simulator,
  }) => {
    await simulator.gotoFixture("openingMain");
    const first = await simulator.getActivePlayerId();
    const board = simulator.playerBoard;
    await expect(simulator.playerPrompt.verbButton("callLegend")).toBeVisible();

    await simulator.clearDispatchLog();
    await simulator.playerPrompt.verbButton("callLegend").click();
    await board.expectMode("select-target");
    const callableLegend = board.legendsZone.locator(
      '[data-testid="legend-slot"][data-face-down="true"] [data-interaction-state="selectable"]',
    );
    await expect(callableLegend).toHaveCount(2);

    const faceDownBefore = await board.faceDownLegends.count();
    await callableLegend.first().click();

    await simulator.expectLastDispatch({ type: "callLegend", as: first });
    await expect(board.faceDownLegends).toHaveCount(faceDownBefore - 1);
  });
});
