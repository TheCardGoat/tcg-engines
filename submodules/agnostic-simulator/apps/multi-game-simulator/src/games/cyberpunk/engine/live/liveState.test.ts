import { describe, expect, test } from "vitest";
import {
  CyberpunkTestEngine,
  defOf,
  getEffectivePower,
  clearCardRegistry,
  getCardRegistry,
  setCardRegistry,
  type FilteredCardView,
} from "@tcg/cyberpunk-engine";
import {
  welcomeToNightCityRetailFloorIt,
  welcomeToNightCityRetailMandibularUpgrade,
} from "@tcg/cyberpunk-cards";

import { DEFAULT_SCENARIO, P1, P2, getScenario } from "../fixtures/scenarios";
import {
  createLiveMatchViewerEngine,
  isFilteredMatchView,
  viewerProjectionToMatchState,
} from "./liveState";

describe("Cyberpunk live viewer projections", () => {
  test("hydrates the renderer from a viewer-safe server projection", () => {
    const source = getScenario(DEFAULT_SCENARIO).build();
    const projection = source.getFilteredView(P1);
    const expectedOwnHand = projection.players[String(P1)]?.zones.hand;
    const expectedRivalHand = projection.players[String(P2)]?.zones.hand;

    expect(isFilteredMatchView(projection)).toBe(true);
    expect(Array.isArray(expectedOwnHand)).toBe(true);
    expect(typeof expectedRivalHand).toBe("number");

    const state = viewerProjectionToMatchState(projection, "match-projection-test");
    expect(state.ctx.matchId).toBe("match-projection-test");
    expect(state.ctx.stateID).toBe(projection.stateID);
    expect(state.G.players[String(P1)]?.zones.hand).toHaveLength(
      Array.isArray(expectedOwnHand) ? expectedOwnHand.length : 0,
    );
    expect(state.G.players[String(P2)]?.zones.hand).toHaveLength(
      typeof expectedRivalHand === "number" ? expectedRivalHand : 0,
    );

    const viewer = createLiveMatchViewerEngine(projection, "match-projection-test");
    expect(viewer.getState().ctx.stateID).toBe(projection.stateID);
    expect(viewer.getState().G.turnMetadata.activePlayerId).toBe(projection.activePlayerId);
  });

  test("preserves public Eddie orientation and turn-scoped action flags", () => {
    const source = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailFloorIt],
      eddies: 0,
    });
    source.sellCard(welcomeToNightCityRetailFloorIt, { as: P1 });
    const faceDownLegend = source.getFaceDownLegends(P1)[0];
    if (!faceDownLegend) throw new Error("Expected a face-down Legend fixture.");
    source.callLegend(faceDownLegend, { as: P1 });

    const sourcePlayer = source.getState().G.players[String(P1)];
    const sourceEddie = source.getCardsInZone("eddieArea", P1)[0];
    expect(sourcePlayer).toMatchObject({
      soldThisTurn: true,
      calledLegendThisTurn: true,
      calledLegendThisRivalTurn: false,
    });
    expect(sourceEddie?.meta.spent).toBe(true);

    const projection = source.getFilteredView(P1);
    const projectedPlayer = projection.players[String(P1)];
    const projectedEddies = projectedPlayer?.zones.eddieArea;
    expect(projectedPlayer).toMatchObject({
      soldThisTurn: true,
      calledLegendThisTurn: true,
      calledLegendThisRivalTurn: false,
    });
    expect(Array.isArray(projectedEddies)).toBe(true);
    expect(Array.isArray(projectedEddies) ? projectedEddies[0] : null).toMatchObject({
      cardName: "Floor It",
      faceDown: true,
      revealed: true,
      spent: true,
    });

    const hydrated = viewerProjectionToMatchState(projection, "spent-eddie-projection-test");
    const hydratedPlayer = hydrated.G.players[String(P1)];
    const hydratedEddieId = hydratedPlayer?.zones.eddieArea[0];
    expect(hydratedPlayer).toMatchObject({
      soldThisTurn: true,
      calledLegendThisTurn: true,
      calledLegendThisRivalTurn: false,
    });
    expect(hydratedEddieId).toBeDefined();
    expect(hydrated.G.cardIndex[String(hydratedEddieId)]?.meta).toMatchObject({
      faceDown: true,
      revealed: true,
      spent: true,
    });
  });

  test("keeps a sold card public across undo and sell again, then uses unknown next turn", () => {
    const source = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailMandibularUpgrade],
      eddies: 0,
    });
    const mandibular = source.getCardsInZone("hand", P1)[0];
    expect(mandibular).toBeDefined();
    const firstSell = source.sellCard(mandibular!, { as: P1 });
    expect(firstSell.moveLogs.find((log) => log.type === "sellCard")).toMatchObject({
      cardName: "Mandibular Upgrade",
    });

    const soldViewer = createLiveMatchViewerEngine(
      source.getFilteredView(P2),
      "sold-mandibular-projection-test",
    );
    const soldId = soldViewer.getState().G.players[String(P1)]?.zones.eddieArea[0];
    const soldCard = soldViewer.getState().G.cardIndex[String(soldId)];
    expect(defOf(soldCard).displayName).toBe("Mandibular Upgrade");
    expect(defOf(soldCard).displayName).not.toBe("Animals Wrecker");
    expect(soldCard?.meta).toMatchObject({ faceDown: true, revealed: true });

    expect(source.undo()).toBe(true);
    const undoneViewer = createLiveMatchViewerEngine(
      source.getFilteredView(P1),
      "undone-mandibular-projection-test",
    );
    const restoredId = undoneViewer.getState().G.players[String(P1)]?.zones.hand[0];
    const restoredCard = undoneViewer.getState().G.cardIndex[String(restoredId)];
    expect(defOf(restoredCard).displayName).toBe("Mandibular Upgrade");

    const secondSell = source.sellCard(mandibular!, { as: P1 });
    expect(secondSell.moveLogs.find((log) => log.type === "sellCard")).toMatchObject({
      cardName: "Mandibular Upgrade",
    });
    const soldAgainViewer = createLiveMatchViewerEngine(
      source.getFilteredView(P2),
      "sold-again-mandibular-projection-test",
    );
    const soldAgainId = soldAgainViewer.getState().G.players[String(P1)]?.zones.eddieArea[0];
    const soldAgainCard = soldAgainViewer.getState().G.cardIndex[String(soldAgainId)];
    expect(defOf(soldAgainCard).displayName).toBe("Mandibular Upgrade");
    expect(soldAgainCard?.meta).toMatchObject({ faceDown: true, revealed: true });

    source.completeTurn({ as: P1 });
    const nextTurnViewer = createLiveMatchViewerEngine(
      source.getFilteredView(P2),
      "next-turn-mandibular-projection-test",
    );
    const hiddenId = nextTurnViewer.getState().G.players[String(P1)]?.zones.eddieArea[0];
    const hiddenCard = nextTurnViewer.getState().G.cardIndex[String(hiddenId)];
    expect(defOf(hiddenCard).displayName).toBe("Unknown Card");
    expect(defOf(hiddenCard).displayName).not.toBe("Animals Wrecker");
  });

  test("does not count equipped Gear power twice when hydrating projected effective power", () => {
    const source = getScenario("legendVStreetkidEquippedPower").build();
    const projection = source.getFilteredView(P1);
    const projectedField = projection.players[String(P1)]?.zones.field;
    expect(Array.isArray(projectedField)).toBe(true);
    const projectedV = Array.isArray(projectedField)
      ? projectedField.find((card) => card.cardName === "V")
      : undefined;
    expect(projectedV).toMatchObject({
      power: 6,
      effectivePower: 8,
    });
    if (!projectedV) throw new Error("Expected projected V: Streetkid in the field.");
    expect(projectedV.attachedGearIds).toHaveLength(1);

    const state = viewerProjectionToMatchState(projection, "equipped-power-projection-test");
    const hydratedV = state.G.cardIndex[projectedV.instanceId];
    expect(hydratedV?.meta.powerModifier).toBe(0);
    expect(getEffectivePower(state, projectedV.instanceId)).toBe(8);
  });

  test("registers searchDeck-revealed deck cards so choice surfaces resolve them", () => {
    // Real searchDeck prompt: Three Mouths, One Desire reveals the top 3 deck
    // cards, which the zone projection collapses to a count for their owner.
    // Regression: the projection must rehydrate those prompt-embedded views
    // into cardIndex even though no zone array carries them.
    const source = getScenario("retailReleaseSep2026ScrapedCardsQa").build();
    const state = source.getState();
    const threeMouthsId = (state.G.players[String(P1)]?.zones.hand ?? []).find((instanceId) => {
      const instance = state.G.cardIndex[instanceId];
      return defOf(instance).slug === "three-mouths-one-desire";
    });
    expect(threeMouthsId).toBeDefined();
    source.asPlayerOne().playCard(threeMouthsId!);

    const projection = source.getFilteredView(P1);
    const ownZones = projection.players[String(P1)]?.zones;
    expect(typeof ownZones?.deck).toBe("number");

    const choice = projection.prompt.choice;
    expect(choice?.type).toBe("scry");
    if (choice?.type !== "scry") return;
    const revealed = choice.payload.revealedCards;
    expect(revealed).toHaveLength(3);

    // The revealed cards live inside the count-collapsed deck: no projected
    // zone array carries them, so the zone walk alone cannot register them.
    for (const player of Object.values(projection.players)) {
      for (const zone of Object.values(player.zones)) {
        if (!Array.isArray(zone)) continue;
        const zoneIds = new Set(zone.map((card) => String(card.instanceId)));
        for (const card of revealed) {
          expect(zoneIds.has(String(card.instanceId))).toBe(false);
        }
      }
    }

    const projected = viewerProjectionToMatchState(projection, "match-deck-reveal-test");
    for (const card of revealed) {
      const instance = projected.G.cardIndex[String(card.instanceId)];
      expect(instance, `deck card ${card.instanceId} missing from cardIndex`).toBeDefined();
      expect(instance.definitionId).toBe(card.definitionId);
      expect(defOf(instance).name).toBeTruthy();
    }
  });

  test("hydrates pendingChoice from the prompt so board target clicks select", () => {
    const source = getScenario(DEFAULT_SCENARIO).build();
    const projection = source.getFilteredView(P1);
    const fieldCards = projection.players[String(P1)]?.zones.field;
    expect(Array.isArray(fieldCards)).toBe(true);
    const targetId = String((fieldCards as FilteredCardView[])[0]!.instanceId);

    projection.prompt = {
      ...projection.prompt,
      status: "choice",
      choice: {
        type: "chooseTarget",
        chooserId: String(P1),
        payload: {
          type: "effectTarget",
          targetKind: "card",
          min: 1,
          max: 1,
          eligibleIds: [targetId],
          cards: [],
        },
      },
    };

    const state = viewerProjectionToMatchState(projection, "match-choice-test");
    const choice = state.G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseTarget");
    if (choice?.type !== "chooseTarget") return;
    expect(String(choice.chooserId)).toBe(String(P1));
    expect(choice.payload.type).toBe("effectTarget");
    expect(choice.payload.targetKind).toBe("card");
    expect(choice.payload.min).toBe(1);
    expect(choice.payload.max).toBe(1);
    expect(choice.payload.eligibleIds?.map(String)).toEqual([targetId]);
  });

  test("hydrates a defeat-redirect prompt without fabricating an empty player id", () => {
    const source = getScenario(DEFAULT_SCENARIO).build();
    const projection = source.getFilteredView(P1);
    const ownField = projection.players[String(P1)]?.zones.field;
    expect(Array.isArray(ownField)).toBe(true);
    const [protectedCard, replacementCard] = ownField as FilteredCardView[];
    expect(protectedCard).toBeDefined();
    expect(replacementCard).toBeDefined();

    projection.prompt = {
      ...projection.prompt,
      status: "choice",
      choice: {
        type: "redirectDefeat",
        chooserId: String(P1),
        payload: {
          protectedCardId: String(protectedCard!.instanceId),
          replacementCardId: String(replacementCard!.instanceId),
          cost: 1,
          fightPlayerId: String(P2),
        },
      },
    };

    const state = viewerProjectionToMatchState(projection, "match-redirect-defeat-test");
    const choice = state.G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("redirectDefeat");
    if (choice?.type !== "redirectDefeat") return;
    expect(choice.payload.continuation.kind).toBe("fight");
    if (choice.payload.continuation.kind === "fight") {
      expect(String(choice.payload.continuation.fightPlayerId)).toBe(String(P2));
    }
  });

  test("leaves pendingChoice unset when the prompt carries no choice", () => {
    const source = getScenario(DEFAULT_SCENARIO).build();
    const projection = source.getFilteredView(P1);
    projection.prompt = { ...projection.prompt, status: "action", choice: null };

    const state = viewerProjectionToMatchState(projection, "match-no-choice-test");
    expect(state.G.turnMetadata.pendingChoice).toBeUndefined();
  });

  test("hydrates rival face-down legends with a legend-type placeholder so they render the legend card back", () => {
    // While a rival legend is still face-down, the server redacts it to
    // definitionId "" / type null (see filterZoneCards in the engine view
    // filter). The legend zone is public knowledge, so the viewer's
    // placeholder must still resolve to a legend-type definition — otherwise
    // CardImage falls back to the generic card back instead of the legend one.
    const source = getScenario(DEFAULT_SCENARIO).build();
    const projection = source.getFilteredView(P1);
    const rivalLegends = projection.players[String(P2)]?.zones.legendArea;
    expect(Array.isArray(rivalLegends)).toBe(true);
    const redactedLegend: FilteredCardView = {
      instanceId: "ci_redacted-rival-legend" as FilteredCardView["instanceId"],
      definitionId: "",
      cardName: null,
      zone: "legendArea",
      faceDown: true,
      revealed: false,
      spent: false,
      damage: 0,
      power: 0,
      effectivePower: 0,
      cost: null,
      type: null,
      classifications: [],
      hasSellTag: false,
      attachedGearIds: [],
      attachedToId: null,
      hasLag: false,
      hasAttackedThisTurn: false,
      grantedRules: [],
      keywords: [],
      triggerHints: [],
      abilityHints: [],
    };
    projection.players[String(P2)]!.zones.legendArea = [redactedLegend];

    const state = createLiveMatchViewerEngine(projection, "match-legend-back-test").getState();
    const instance = state.G.cardIndex[String(redactedLegend.instanceId)];
    expect(instance, "redacted rival legend missing from cardIndex").toBeDefined();
    expect(defOf(instance).type).toBe("legend");
  });

  test("renders a face-up card without a definitionId as unknown instead of a real card", () => {
    // Regression (live-lobby "Animals Wrecker" report): missing identity must
    // fail closed to an honest placeholder, never a plausible catalog card.
    const source = getScenario(DEFAULT_SCENARIO).build();
    const projection = source.getFilteredView(P1);
    const ownHand = projection.players[String(P1)]?.zones.hand;
    expect(Array.isArray(ownHand)).toBe(true);

    const corruptFaceUpCard: FilteredCardView = {
      ...(Array.isArray(ownHand) ? ownHand[0]! : ({} as FilteredCardView)),
      instanceId: "ci_corrupt-face-up" as FilteredCardView["instanceId"],
      definitionId: "",
      cardName: null,
      faceDown: false,
      revealed: false,
    };
    projection.players[String(P1)]!.zones.hand = [corruptFaceUpCard];

    const viewer = createLiveMatchViewerEngine(projection, "match-corrupt-face-up-test");
    const instance = viewer.getState().G.cardIndex[String(corruptFaceUpCard.instanceId)];
    expect(defOf(instance).displayName).toBe("Unknown Card");
    expect(defOf(instance).displayName).not.toBe("Animals Wrecker");
  });

  test("count-collapsed hidden zones keep materializing as placeholders", () => {
    // Information hiding stays intact: a deck collapsed to a count (34 after
    // the opening draw) must rebuild into 34 inert placeholder instances
    // without tripping the face-up guard.
    const source = getScenario(DEFAULT_SCENARIO).build();
    const projection = source.getFilteredView(P1);
    const ownDeckCount = projection.players[String(P1)]?.zones.deck;
    expect(typeof ownDeckCount).toBe("number");

    // A fresh live route hydrates this projection before the viewer engine
    // installs its production catalog. Projection must use its explicit
    // catalog dependency without reading or mutating the ambient registry.
    const previousCatalog = getCardRegistry();
    clearCardRegistry();

    try {
      const state = viewerProjectionToMatchState(projection, "match-hidden-deck-test");
      expect(state.G.players[String(P1)]?.zones.deck).toHaveLength(ownDeckCount as number);
      expect(() => getCardRegistry()).toThrow(/Card registry not initialized/);
    } finally {
      setCardRegistry(previousCatalog);
    }
  });
});
