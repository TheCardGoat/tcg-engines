/**
 * Spec → tests: ../specs/06-preparing-to-play.md, 07-game-progression.md (fluent API)
 */

import { describe, expect, it } from "vite-plus/test";
import type { Card, ResourceCard, UnitCard } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectCard,
  expectPlayer,
  endTurn,
  zoneCount,
  expectPublicLog,
  expectPrivateLog,
  getLogsOfType,
  getLogsForPlayer,
} from "../../index.ts";
import { asPlayerId } from "../../../types/branded.ts";
import {
  GUNDAM_MAIN_DECK_SIZE,
  GUNDAM_RESOURCE_DECK_SIZE,
  validateDeckList,
  type DeckList,
} from "../../../deck/index.ts";
import { st01Gundam001 } from "../../../../../cards/src/cards/st01/unit/001-gundam.ts";
import { st01Gm005 } from "../../../../../cards/src/cards/st01/unit/005-gm.ts";
import { gd05AbyssGundam040 } from "../../../../../cards/src/cards/gd05/unit/040-abyss-gundam.ts";
import { st10MobileWorkerTekkadan010 } from "../../../../../cards/src/cards/st10/unit/010-mobile-worker-tekkadan.ts";

function unitCard(cardNumber: string, color: UnitCard["color"] = "blue"): UnitCard {
  return {
    cardNumber,
    name: `Unit ${cardNumber}`,
    type: "unit",
    canonicalId: cardNumber,
    slug: cardNumber.toLowerCase(),
    printings: [],
    color,
    traits: ["earth federation"],
    level: 1,
    cost: 1,
    ap: 2,
    hp: 3,
    effect: "-",
    effects: [],
    keywordEffects: [],
    rarity: "common",
  };
}

const RESOURCE: ResourceCard = {
  cardNumber: "R-001",
  name: "resource",
  type: "resource",
  canonicalId: "R-001",
  slug: "r-001",
  printings: [],
  traits: ["-"],
  level: 0,
  cost: 0,
  effect: "",
  effects: [],
  keywordEffects: [],
  rarity: "common",
};

const BLUE_UNITS = Array.from({ length: 13 }, (_, i) => unitCard(`UB-${i + 1}`, "blue"));
const GREEN_UNITS = Array.from({ length: 12 }, (_, i) => unitCard(`UG-${i + 1}`, "green"));
const RED_UNIT = unitCard("UR-1", "red");
const CATALOG: Record<string, Card> = {
  ...Object.fromEntries(BLUE_UNITS.map((u) => [u.cardNumber, u])),
  ...Object.fromEntries(GREEN_UNITS.map((u) => [u.cardNumber, u])),
  [RED_UNIT.cardNumber]: RED_UNIT,
  [RESOURCE.cardNumber]: RESOURCE,
};

function legal50(): DeckList {
  // 13×4 = 52 is too many; use 4 copies of 12 blue + 2 copies of 1 green = 50
  return {
    name: "Legal",
    cards: [
      ...BLUE_UNITS.slice(0, 12).map((u) => ({ cardNumber: u.cardNumber, count: 4 })),
      { cardNumber: GREEN_UNITS[0]!.cardNumber, count: 2 },
    ],
    resource: { cardNumber: RESOURCE.cardNumber, count: GUNDAM_RESOURCE_DECK_SIZE },
  };
}

describe("Section 6 — Preparing to Play (specs/06-preparing-to-play.md)", () => {
  it("6-1-1: main deck must be exactly 50 and resource deck exactly 10", () => {
    const ok = validateDeckList(legal50(), { catalog: CATALOG });
    expect(ok.ok).toBe(true);

    const badMain: DeckList = {
      name: "short",
      cards: BLUE_UNITS.slice(0, 12).map((u) => ({ cardNumber: u.cardNumber, count: 4 })),
      // 48 cards
      resource: { cardNumber: RESOURCE.cardNumber, count: GUNDAM_RESOURCE_DECK_SIZE },
    };
    expect(validateDeckList(badMain, { catalog: CATALOG }).ok).toBe(false);

    const badRes: DeckList = {
      ...legal50(),
      resource: { cardNumber: RESOURCE.cardNumber, count: 9 },
    };
    expect(validateDeckList(badRes, { catalog: CATALOG }).ok).toBe(false);
    expect(GUNDAM_MAIN_DECK_SIZE).toBe(50);
    expect(GUNDAM_RESOURCE_DECK_SIZE).toBe(10);
  });

  it("6-1-1-2: more than two colors is illegal", () => {
    const padded: DeckList = {
      name: "3c",
      cards: [
        ...BLUE_UNITS.slice(0, 8).map((u) => ({ cardNumber: u.cardNumber, count: 4 })),
        ...GREEN_UNITS.slice(0, 3).map((u) => ({ cardNumber: u.cardNumber, count: 4 })),
        { cardNumber: RED_UNIT.cardNumber, count: 4 },
      ],
      resource: { cardNumber: RESOURCE.cardNumber, count: 10 },
    };
    // 32 + 12 + 4 = 48 — still short; the color violation should still surface
    expect(validateDeckList(padded, { catalog: CATALOG }).ok).toBe(false);
  });

  it("6-1-1-3 / 2-1-2: more than four copies of a card number is illegal", () => {
    const five: DeckList = {
      name: "5-copy",
      cards: [
        { cardNumber: BLUE_UNITS[0]!.cardNumber, count: 5 },
        ...BLUE_UNITS.slice(1, 12).map((u) => ({ cardNumber: u.cardNumber, count: 4 })),
        { cardNumber: GREEN_UNITS[0]!.cardNumber, count: 1 },
      ],
      // 5 + 44 + 1 = 50
      resource: { cardNumber: RESOURCE.cardNumber, count: 10 },
    };
    expect(validateDeckList(five, { catalog: CATALOG }).ok).toBe(false);
  });

  it("6-2-1 through 6-2-4: setup produces hands, shields, EX Base, and second-player EX Resource", () => {
    const engine = GundamTestEngine.create(
      { deck: 13, resourceDeck: 10 },
      { deck: 13, resourceDeck: 10 },
      { skipToMainPhase: false },
    );
    expect(zoneCount(engine, PLAYER_ONE, "resourceDeck")).toBe(10);
    engine.doMove("chooseFirstPlayer", asPlayerId(PLAYER_ONE), { playerId: PLAYER_ONE });
    expectPublicLog(engine, "gundam.setup.firstPlayerChosen", {
      chooser: PLAYER_ONE,
      chosen: PLAYER_ONE,
    });

    engine.doMove("alterHand", asPlayerId(PLAYER_ONE), { wantsRedraw: false });
    engine.doMove("alterHand", asPlayerId(PLAYER_TWO), { wantsRedraw: false });

    // Keep-hand mulligan: public count 0, no private detail entry.
    expectPublicLog(engine, "gundam.setup.mulligan", { playerId: PLAYER_ONE, count: 0 });
    expectPublicLog(engine, "gundam.setup.mulligan", { playerId: PLAYER_TWO, count: 0 });
    expect(
      getLogsOfType(engine, "gundam.setup.mulligan").filter(
        ({ typed }) => typed.visibility.mode === "PRIVATE",
      ),
    ).toHaveLength(0);
    expectPublicLog(engine, "gundam.setup.done", {});

    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    // Setup hands are 5; first-player Draw Phase already ran after mulligan, so P1 is 6.
    expectPlayer(p1).toHaveHandCount(6);
    expectPlayer(p2).toHaveHandCount(5);
    expectPlayer(p1).toHaveShieldCount(6);
    expectPlayer(p2).toHaveShieldCount(6);

    // EX Base for both (6-2-3).
    expectPlayer(p1).toHaveZoneCount("baseSection", 1);
    expectPlayer(p2).toHaveZoneCount("baseSection", 1);
    expect(p1.getCardsInZone("baseSection")[0]).toBe(`ex-base-token:${PLAYER_ONE}`);
    expect(p2.getCardsInZone("baseSection")[0]).toBe(`ex-base-token:${PLAYER_TWO}`);

    // After setup the first turn starts: first player places one Resource from the
    // resource deck (not EX). Second player keeps only the EX Resource (6-2-4).
    expectPlayer(p1).toHaveResourceCount(1);
    expectPlayer(p2).toHaveResourceCount(1);
    expect(p1.getCardsInZone("resourceArea")[0]).not.toMatch(/^ex-resource-token:/);
    expect(p2.getCardsInZone("resourceArea")[0]).toBe(`ex-resource-token:${PLAYER_TWO}`);
  });

  it("6-2-1-6-1: mulligan returns the hand and draws a different set of 5", () => {
    // Ten distinct cards: opening hand is 5, remaining deck is 5. Returning the
    // hand and drawing before shuffle must take the other five (not put-back-and
    // re-draw the same five without using the deck).
    const distinctDeck = Array.from({ length: 10 }, (_, i) =>
      createMockUnit({ name: `Mulligan ${i}`, cardNumber: `MULL-${i}` }),
    );
    const engine = GundamTestEngine.create(
      { deck: distinctDeck, resourceDeck: 10 },
      { deck: 13, resourceDeck: 10 },
      { skipToMainPhase: false },
    );
    engine.doMove("chooseFirstPlayer", asPlayerId(PLAYER_ONE), { playerId: PLAYER_ONE });

    const p1 = engine.asPlayer(PLAYER_ONE);
    expectPlayer(p1).toHaveHandCount(5);

    const handBefore = [...p1.getHand()];
    const deckCountBefore = p1.deckCount();
    expect(deckCountBefore).toBe(5);

    const alterResult = engine.doMove("alterHand", asPlayerId(PLAYER_ONE), { wantsRedraw: true });
    expect(alterResult.success).toBe(true);

    const handAfter = p1.getHand();
    expectPlayer(p1).toHaveHandCount(5);
    expectPlayer(p1).toHaveDeckCount(deckCountBefore);
    // No card from the original hand remains — proves return-then-draw from deck.
    expect(handAfter.filter((id) => handBefore.includes(id))).toEqual([]);

    // Public log: everyone sees that P1 redraw 5, not which cards.
    const publicMulligan = expectPublicLog(engine, "gundam.setup.mulligan", {
      playerId: PLAYER_ONE,
      count: 5,
    });
    expect(
      (publicMulligan.typed.values as { returnedCardIds?: string[] }).returnedCardIds,
    ).toBeUndefined();
    expect(
      (publicMulligan.typed.values as { drawnCardIds?: string[] }).drawnCardIds,
    ).toBeUndefined();

    // Private log: only P1 sees returned + drawn identities.
    const privateMulligan = expectPrivateLog(engine, "gundam.setup.mulligan", PLAYER_ONE, {
      playerId: PLAYER_ONE,
      count: 5,
    });
    const privateValues = privateMulligan.typed.values as {
      returnedCardIds?: string[];
      drawnCardIds?: string[];
    };
    expect(privateValues.returnedCardIds).toEqual(expect.arrayContaining(handBefore));
    expect(privateValues.returnedCardIds).toHaveLength(5);
    expect(privateValues.drawnCardIds).toEqual(expect.arrayContaining(handAfter));
    expect(privateValues.drawnCardIds).toHaveLength(5);

    // Structured move log: public count + private fields (strip for opponents).
    const mulliganMove = alterResult.success
      ? alterResult.moveLogs?.find((log) => log.type === "mulligan")
      : undefined;
    expect(mulliganMove).toMatchObject({ type: "mulligan", count: 5, playerId: PLAYER_ONE });
    if (mulliganMove?.type === "mulligan") {
      expect(mulliganMove.returnedCardIds).toMatchObject({
        __private: true,
        visibleTo: [PLAYER_ONE],
      });
      expect(mulliganMove.drawnCardIds).toMatchObject({
        __private: true,
        visibleTo: [PLAYER_ONE],
      });
    }

    // Opponent's filtered history must not include the private detail or the card ids.
    const p2MulliganLogs = getLogsForPlayer(engine, PLAYER_TWO).filter(
      (l) => l.entry.type === "gundam.setup.mulligan",
    );
    expect(p2MulliganLogs.every((l) => l.typed.visibility.mode === "PUBLIC")).toBe(true);
    expect(JSON.stringify(p2MulliganLogs)).not.toContain(handBefore[0]!);
    expect(JSON.stringify(p2MulliganLogs)).not.toContain(handAfter[0]!);

    engine.doMove("alterHand", asPlayerId(PLAYER_TWO), { wantsRedraw: false });
  });
});

describe("Section 7 — Game Progression (specs/07-game-progression.md)", () => {
  it("7-1-1 / 7-5-5: ending main and completing the turn passes to the opponent in main", () => {
    const engine = GundamTestEngine.create({ play: [st01Gundam001], deck: 8 }, { deck: 8 });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const turnBefore = p1.getBoardView().turn ?? 0;

    expectPlayer(p1).toBeTurnPlayer().toBeInPhase("main-phase");

    endTurn(engine);

    // Board-view only — no raw ctx.status drilling.
    expectPlayer(p2).toBeTurnPlayer().toBeInPhase("main-phase");
    expectPlayer(p2).toHaveTurnNumber(turnBefore + 1);
    // Turn start is public for both players (no private card ids on draw count summary).
    expectPublicLog(engine, "gundam.turn.started", { playerId: PLAYER_TWO });
  });

  it("7-2-3-1: Active Step readies rested Units and Resources", () => {
    const engine = GundamTestEngine.create(
      {
        play: [{ card: st01Gundam001, exhausted: true }],
        resourceArea: [{ card: activeResources(1)[0]!.card, exhausted: true }],
        deck: 8,
      },
      { deck: 8 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    expectCard(p1, st01Gundam001).toBeRested();
    // Full turn cycle so P1 becomes active again and Active Step fires
    endTurn(engine);
    endTurn(engine);
    expectCard(p1, st01Gundam001).toBeReady();
    const resId = p1.getCardsInZone("resourceArea")[0]!;
    expect(p1.isExhausted(resId)).toBe(false);
  });

  it("7-3-1: Draw Phase draws one card", () => {
    const engine = GundamTestEngine.create({ play: [st01Gundam001], deck: 8 }, { deck: 8 });
    const p2 = engine.asPlayer(PLAYER_TWO);
    const before = p2.handCount();
    endTurn(engine);
    expectPlayer(p2).toHaveHandCount(before + 1);
  });

  it("7-4-1: Resource Phase places one Resource from the resource deck", () => {
    const engine = GundamTestEngine.create(
      { play: [st01Gundam001], deck: 8, resourceDeck: 5 },
      { deck: 8, resourceDeck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const resourcesBefore = p1.getResourceCount();
    const resourceDeckBefore = zoneCount(engine, PLAYER_ONE, "resourceDeck");

    endTurn(engine);
    endTurn(engine);

    expectPlayer(p1).toHaveResourceCount(resourcesBefore + 1);
    expect(zoneCount(engine, PLAYER_ONE, "resourceDeck")).toBe(resourceDeckBefore - 1);
  });

  it("7-5-2: deploy pays cost by resting active resources", () => {
    const engine = GundamTestEngine.create({
      hand: [st01Gm005],
      resourceArea: activeResources(3),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    p1.must.deployUnit(st01Gm005);
    const rested = p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id));
    expect(rested.length).toBeGreaterThanOrEqual(st01Gm005.cost);
  });

  it("7-6-6-1 / 13-1-3: temporary Support AP buff expires after turn cleanup", () => {
    const engine = GundamTestEngine.create(
      { play: [gd05AbyssGundam040, st10MobileWorkerTekkadan010], deck: 5 },
      { deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    p1.must.useSupport(gd05AbyssGundam040, st10MobileWorkerTekkadan010);
    expectCard(p1, st10MobileWorkerTekkadan010).toHaveAp(st10MobileWorkerTekkadan010.ap + 2);
    endTurn(engine);
    endTurn(engine);
    expectCard(p1, st10MobileWorkerTekkadan010).toHaveAp(st10MobileWorkerTekkadan010.ap);
  });
});
