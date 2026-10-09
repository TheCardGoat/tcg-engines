// @vitest-environment jsdom
import { cleanup, within } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vite-plus/test";
import {
  welcomeToNightCityRetailChromeReverie,
  welcomeToNightCityRetailJohnnySilverhandNeverStopFighting,
  welcomeToNightCityRetailMoxInciters,
  welcomeToNightCityRetailSandayuOdaHanakoSGuardian,
  theHeistRetailStarterDeckMt0d12Flathead,
  welcomeToNightCityRetailNocturneOp55N1,
  welcomeToNightCityRetailRogueAmendiaresPreemSolo,
  welcomeToNightCityRetailCyberpsychosis,
  welcomeToNightCityRetailRidingNomad,
  welcomeToNightCityRetailMantisBlades,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "@tcg/cyberpunk-engine";

import { ensureJsdomAnimationSupport } from "../testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import { renderCyberpunkSimulatorScenario } from "../testing/render-cyberpunk-simulator";
import { DEFAULT_SCENARIO } from "./fixtures/scenarios";
import { createLiveMatchViewerEngine, viewerProjectionToMatchState } from "./live/liveState";
import { effectiveRulesForCard, projectedCardViews } from "./zoneViews";

describe("hosted Cyberpunk card rules", () => {
  afterEach(cleanup);

  test("shows Chrome Reverie's attack restriction on the rival Johnny and clears it with the server view", () => {
    const source = CyberpunkTestEngine.createWithFixture(
      { hand: [welcomeToNightCityRetailChromeReverie], eddies: 3 },
      {
        field: [
          {
            card: welcomeToNightCityRetailJohnnySilverhandNeverStopFighting,
            spent: false,
            hasLag: false,
          },
        ],
      },
    );
    source.playCard(welcomeToNightCityRetailChromeReverie, { as: P1 });
    source.resolveEffectTarget(welcomeToNightCityRetailJohnnySilverhandNeverStopFighting, {
      as: P1,
    });

    const projection = source.getFilteredView(P1);
    const viewerState = viewerProjectionToMatchState(projection);
    const johnnyId = source.findCardId(
      welcomeToNightCityRetailJohnnySilverhandNeverStopFighting,
      "field",
      P2,
    );
    const viewerJohnny = viewerState.G.cardIndex[johnnyId];
    expect(viewerJohnny).toBeDefined();
    if (!viewerJohnny) return;

    expect(
      effectiveRulesForCard(viewerJohnny, viewerState, projectedCardViews(projection)),
    ).toContain("cantAttack");

    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: DEFAULT_SCENARIO,
      boardProps: {
        initialEngineBuilder: () => createLiveMatchViewerEngine(projection),
        remoteProjection: projection,
      },
    });
    const ownDeckCount = projection.players[String(P1)]?.zones.deck;
    const rivalDeckCount = projection.players[String(P2)]?.zones.deck;
    expect(typeof ownDeckCount).toBe("number");
    expect(typeof rivalDeckCount).toBe("number");
    expect(
      view.container
        .querySelector('[data-testid="deck-zone"][data-side="player"]')
        ?.getAttribute("data-count"),
    ).toBe(String(ownDeckCount));
    expect(
      view.container
        .querySelector('[data-testid="deck-zone"][data-side="opponent"]')
        ?.getAttribute("data-count"),
    ).toBe(String(rivalDeckCount));

    const johnny = view.container.querySelector(
      '[data-testid="card"][data-card-name="Johnny Silverhand: Never Stop Fighting"]',
    );
    expect(johnny).not.toBeNull();
    if (johnny) {
      expect(within(johnny as HTMLElement).getByLabelText("Can't attack")).toBeDefined();
    }
    view.unmount();

    const withoutRestriction = structuredClone(projection);
    const rivalField = withoutRestriction.players[String(P2)]?.zones.field;
    expect(Array.isArray(rivalField)).toBe(true);
    if (!Array.isArray(rivalField)) return;
    const projectedJohnny = rivalField.find((card) => card.instanceId === johnnyId);
    expect(projectedJohnny).toBeDefined();
    if (!projectedJohnny) return;
    projectedJohnny.grantedRules = projectedJohnny.grantedRules.filter(
      (rule) => rule !== "cantAttack",
    );
    expect(
      effectiveRulesForCard(viewerJohnny, viewerState, projectedCardViews(withoutRestriction)),
    ).not.toContain("cantAttack");
  });

  test("shows the source of a granted must-attack rule", () => {
    const source = CyberpunkTestEngine.createWithFixture(
      { hand: [welcomeToNightCityRetailMoxInciters], eddies: 3 },
      {
        field: [
          {
            card: welcomeToNightCityRetailJohnnySilverhandNeverStopFighting,
            spent: false,
            hasLag: false,
          },
        ],
      },
    );
    source.playCard(welcomeToNightCityRetailMoxInciters, { as: P1 });
    source.resolveEffectTarget(welcomeToNightCityRetailJohnnySilverhandNeverStopFighting, {
      as: P1,
    });
    const projection = source.getFilteredView(P1);
    const rivalField = projection.players[String(P2)]?.zones.field;
    expect(Array.isArray(rivalField)).toBe(true);
    if (!Array.isArray(rivalField)) return;
    const johnnyId = source.findCardId(
      welcomeToNightCityRetailJohnnySilverhandNeverStopFighting,
      "field",
      P2,
    );
    const johnny = rivalField.find((card) => card.instanceId === johnnyId);
    expect(johnny?.grantedRules).toContain("mustAttack");
    expect(johnny?.activeEffects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ rule: "mustAttack", sourceName: "Mox Inciters" }),
      ]),
    );

    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: DEFAULT_SCENARIO,
      boardProps: {
        initialEngineBuilder: () => createLiveMatchViewerEngine(projection),
        remoteProjection: projection,
      },
    });
    const rendered = view.container.querySelector(
      '[data-testid="card"][data-card-name="Johnny Silverhand: Never Stop Fighting"]',
    );
    expect(rendered).not.toBeNull();
    if (rendered)
      expect(
        within(rendered as HTMLElement).getByLabelText(
          /Must attack next turn if able.*Mox Inciters/,
        ),
      ).toBeDefined();
    view.unmount();
  });

  test("uses the engine's conditional rules and shows limited first-turn attacks", () => {
    const source = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: theHeistRetailStarterDeckMt0d12Flathead, spent: false, hasLag: false },
          { card: welcomeToNightCityRetailSandayuOdaHanakoSGuardian, spent: false, hasLag: true },
        ],
      },
      {},
    );
    const projection = source.getFilteredView(P1);
    const field = projection.players[String(P1)]?.zones.field;
    expect(Array.isArray(field)).toBe(true);
    if (!Array.isArray(field)) return;
    const flatheadId = source.findCardId(theHeistRetailStarterDeckMt0d12Flathead, "field", P1);
    const sandayuId = source.findCardId(
      welcomeToNightCityRetailSandayuOdaHanakoSGuardian,
      "field",
      P1,
    );
    expect(field.find((card) => card.instanceId === flatheadId)?.grantedRules).not.toContain(
      "cantBeBlocked",
    );
    expect(field.find((card) => card.instanceId === sandayuId)?.grantedRules).toContain(
      "canAttackOnPlayedTurnAgainstUnits",
    );

    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: DEFAULT_SCENARIO,
      boardProps: {
        initialEngineBuilder: () => createLiveMatchViewerEngine(projection),
        remoteProjection: projection,
      },
    });
    const flathead = view.container.querySelector(
      '[data-testid="card"][data-card-name="MT0D12 Flathead"]',
    );
    const sandayu = view.container.querySelector(
      '[data-testid="card"][data-card-name="Sandayu Oda: Hanako\'s Guardian"]',
    );
    expect(flathead).not.toBeNull();
    expect(sandayu).not.toBeNull();
    if (flathead)
      expect(within(flathead as HTMLElement).queryByLabelText("Can't be blocked")).toBeNull();
    if (sandayu)
      expect(
        within(sandayu as HTMLElement).getByLabelText(
          "Can attack rival Units on the turn it's played",
        ),
      ).toBeDefined();
    view.unmount();
  });

  test("keeps server-computed Go Solo cost and its modifier source", () => {
    const source = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailNocturneOp55N1],
        legendArea: [{ card: welcomeToNightCityRetailRogueAmendiaresPreemSolo, faceDown: false }],
        eddies: 6,
        fixerDice: [],
      },
      { fixerDice: ["d4", "d6", "d8", "d10", "d12", "d20"] },
    );
    const hand = source.getFilteredView(P1).players[String(P1)]?.zones.hand;
    expect(Array.isArray(hand)).toBe(true);
    if (!Array.isArray(hand)) return;
    expect(hand[0]?.effectiveCost).toBe(1);
    expect(hand[0]?.costEffects[0]?.sourceName).toBe("Nocturne OP55 N1");
    source.playCard(welcomeToNightCityRetailNocturneOp55N1, { as: P1 });
    source.resolveChooseEffect("go-solo", { as: P1 });
    const projection = source.getFilteredView(P1);
    const legends = projection.players[String(P1)]?.zones.legendArea;
    expect(Array.isArray(legends)).toBe(true);
    if (!Array.isArray(legends)) return;
    const rogueId = source.findCardId(
      welcomeToNightCityRetailRogueAmendiaresPreemSolo,
      "legendArea",
      P1,
    );
    const rogue = legends.find((card) => card.instanceId === rogueId);
    expect(rogue?.effectiveCost).toBe(5);
    expect(rogue?.costEffects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ sourceName: "Nocturne OP55 N1", modifierLabel: "-2" }),
      ]),
    );

    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: DEFAULT_SCENARIO,
      boardProps: {
        initialEngineBuilder: () => createLiveMatchViewerEngine(projection),
        remoteProjection: projection,
      },
    });
    const rendered = view.container.querySelector(
      `[data-testid="card"][data-card-id="${rogueId}"]`,
    );
    expect(rendered).not.toBeNull();
    expect(rendered?.getAttribute("data-effective-cost")).toBe("5");
    view.unmount();
  });

  test("shows Cyberpsychosis' conditional end-of-turn defeat on the hosted board", () => {
    const source = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailCyberpsychosis],
      field: [
        {
          card: welcomeToNightCityRetailRidingNomad,
          spent: false,
          hasLag: false,
          attachedGears: [welcomeToNightCityRetailMantisBlades],
        },
      ],
      eddies: 3,
    });
    source.playCard(welcomeToNightCityRetailCyberpsychosis, { as: P1 });
    source.resolveEffectTarget(welcomeToNightCityRetailRidingNomad, { as: P1 });
    const projection = source.getFilteredView(P1);
    const field = projection.players[String(P1)]?.zones.field;
    expect(Array.isArray(field)).toBe(true);
    if (!Array.isArray(field)) return;
    const nomadId = source.findCardId(welcomeToNightCityRetailRidingNomad, "field", P1);
    const nomad = field.find((card) => card.instanceId === nomadId);
    expect(nomad?.activeEffects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ defeatIfAttacksAtEndOfTurn: true, sourceName: "Cyberpsychosis" }),
      ]),
    );

    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: DEFAULT_SCENARIO,
      boardProps: {
        initialEngineBuilder: () => createLiveMatchViewerEngine(projection),
        remoteProjection: projection,
      },
    });
    const rendered = view.container.querySelector(
      `[data-testid="card"][data-card-id="${nomadId}"]`,
    );
    expect(rendered).not.toBeNull();
    if (rendered)
      expect(
        within(rendered as HTMLElement).getByLabelText(
          /If this Unit steals or fights, defeat it at end of turn.*Cyberpsychosis/,
        ),
      ).toBeDefined();
    view.unmount();
  });

  test("renders a server-projected scheduled defeat as an end-of-turn badge", () => {
    const source = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailJohnnySilverhandNeverStopFighting,
            spent: false,
            hasLag: false,
          },
        ],
      },
      {},
    );
    const projection = source.getFilteredView(P1);
    const field = projection.players[String(P1)]?.zones.field;
    expect(Array.isArray(field)).toBe(true);
    if (!Array.isArray(field)) return;
    const johnnyId = source.findCardId(
      welcomeToNightCityRetailJohnnySilverhandNeverStopFighting,
      "field",
      P1,
    );
    const johnny = field.find((card) => card.instanceId === johnnyId);
    expect(johnny).toBeDefined();
    if (!johnny) return;
    johnny.activeEffects.push({
      id: "scheduled-defeat",
      sourceName: "Program",
      label: "End defeat",
      detail: "Defeated at end of turn.",
      effectKind: "delayedDefeat",
      tone: "debuff",
      durationLabel: "end of turn",
      isTemporary: true,
      defeatsAtEndOfTurn: true,
    });

    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: DEFAULT_SCENARIO,
      boardProps: {
        initialEngineBuilder: () => createLiveMatchViewerEngine(projection),
        remoteProjection: projection,
      },
    });
    const rendered = view.container.querySelector(
      `[data-testid="card"][data-card-id="${johnnyId}"]`,
    );
    expect(rendered).not.toBeNull();
    if (rendered)
      expect(
        within(rendered as HTMLElement).getByLabelText("Defeated at end of turn by Program"),
      ).toBeDefined();
    view.unmount();
  });
});
