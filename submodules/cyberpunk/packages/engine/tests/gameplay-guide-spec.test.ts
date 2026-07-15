import { describe, expect, it } from "vite-plus/test";
import {
  theHeistRetailStarterDeckVCorporateExile,
  welcomeToNightCityRetailKerryEurodyneTheLastRockerboy,
  welcomeToNightCityRetailYorinobuArasakaSteelDragon,
} from "@tcg/cyberpunk-cards";
import type { Ability } from "@tcg/cyberpunk-types";
import { getEffectivePower } from "../src/active-effects/index.ts";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  createMockGear,
  createMockLegend,
  createMockProgram,
  createMockUnit,
  registerMatchers,
} from "../src/testing/index.ts";
import "../src/testing/matchers.d.ts";

registerMatchers();

describe("Gameplay guide specification coverage", () => {
  it("counts each die as one Gig while Street Cred sums die face values", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d12", faceValue: 12 },
        ],
      },
      {
        gigArea: [{ dieType: "d20", faceValue: 20 }],
      },
    );

    expect(engine.getGigCount(P1)).toBe(2);
    expect(engine.getStreetCred(P1)).toBe(13);
    expect(engine.getGigCount(P2)).toBe(1);
    expect(engine.getStreetCred(P2)).toBe(20);
  });

  it("ends for deck-out before opening a start-phase gain-a-gig choice", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { deck: 5 },
      { deck: 0 },
      { seed: "guide-empty-deck-before-gig", activePlayerId: P1 },
    );

    engine.passPhase({ as: P1 });

    expect(engine.isGameOver()).toBe(true);
    expect(engine.getWinnerId()).toBe(P1);
    expect(engine.getWinReason()).toBe("deck_out_victory");
    expect(engine.getGigCount(P2)).toBe(0);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getEvents("gigDieRolled")).toHaveLength(0);
  });

  it("reports cards drawn before game end when a draw effect later decks out", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [welcomeToNightCityRetailKerryEurodyneTheLastRockerboy],
        deck: 2,
        gigArea: [{ dieType: "d8", faceValue: 8 }],
      },
      { deck: 1 },
    );

    engine.activateAbility(welcomeToNightCityRetailKerryEurodyneTheLastRockerboy, 0, { as: P1 });

    expect(engine.isGameOver()).toBe(true);
    expect(engine.getWinnerId()).toBe(P2);
    expect(engine.getCardsInZone("hand", P1)).toHaveLength(1);

    const eventTypes = engine.getEvents().map((event) => event.type);
    expect(eventTypes.indexOf("cardsDrawn")).toBeLessThan(eventTypes.indexOf("gameEnded"));
  });

  it("allows main-phase actions in any order after each attack fully resolves", () => {
    const sellableCard = createMockProgram({
      id: "guide-main-any-order-sellable",
      name: "Guide Main Any Order Sellable",
      hasSellTag: true,
    });
    const freeUnit = createMockUnit({
      id: "guide-main-any-order-free-unit",
      name: "Guide Main Any Order Free Unit",
      cost: 0,
    });
    const attacker = createMockUnit({
      id: "guide-main-any-order-attacker",
      name: "Guide Main Any Order Attacker",
      power: 5,
    });
    const legend = createMockLegend({
      id: "guide-main-any-order-legend",
      name: "Guide Main Any Order Legend",
    });

    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [sellableCard, freeUnit],
        field: [attacker],
        legendArea: [{ card: legend, faceDown: true }],
        eddies: 1,
      },
      { gigArea: [{ dieType: "d6", faceValue: 4 }] },
      { activePlayerId: P1 },
    );

    expect(engine.sellCard(sellableCard, { as: P1 })).toBeSuccessfulCommand();
    expect(engine.attackRival(attacker, { as: P1 })).toBeSuccessfulCommand();
    engine.resolveFullSteal({ as: P1 });
    expect(engine.callLegend(legend, { as: P1 })).toBeSuccessfulCommand();
    expect(engine.playCard(freeUnit, { as: P1 })).toBeSuccessfulCommand();

    expect(engine.getCard(sellableCard, "eddieArea", P1)).toBeInZone("eddieArea");
    expect(engine.getCard(attacker, "field", P1).meta.spent).toBe(true);
    expect(engine.getCard(legend, "legendArea", P1).meta.faceDown).toBe(false);
    expect(engine.getCard(freeUnit, "field", P1)).toBeInZone("field");
  });

  it("sells one sell-tagged hand card per turn for exactly one Eddie", () => {
    const expensiveSellableCard = createMockProgram({
      id: "guide-expensive-sellable-card",
      name: "Guide Expensive Sellable Card",
      cost: 5,
      hasSellTag: true,
    });
    const secondSellableCard = createMockProgram({
      id: "guide-second-sellable-card",
      name: "Guide Second Sellable Card",
      hasSellTag: true,
    });

    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [expensiveSellableCard, secondSellableCard],
      eddies: 0,
    });

    expect(engine.sellCard(expensiveSellableCard, { as: P1 })).toBeSuccessfulCommand();

    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).not.toContain(
      expensiveSellableCard.id,
    );
    expect(engine.getCardsInZone("eddieArea", P1).map((card) => card.definitionId)).toContain(
      expensiveSellableCard.id,
    );
    expect(engine.getEddies(P1)).toBe(1);
    expect(engine.getEvents("cardSold")).toHaveLength(1);

    const failure = engine.expectFailure(() => engine.sellCard(secondSellableCard, { as: P1 }));
    expect(failure.errorCode).toBe("ALREADY_SOLD");
  });

  it("does not sell cards without a sell tag", () => {
    const nonSellableCard = createMockUnit({
      id: "guide-non-sellable-card",
      name: "Guide Non Sellable Card",
      hasSellTag: false,
    });
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [nonSellableCard],
      eddies: 0,
    });

    const failure = engine.expectFailure(() => engine.sellCard(nonSellableCard, { as: P1 }));
    expect(failure.errorCode).toBe("NO_SELL_TAG");
    expect(engine.getCardsInZone("eddieArea", P1)).toHaveLength(0);
  });

  it("plays cards by spending Eddies plus ready face-up and face-down Legends as one each", () => {
    const playedUnit = createMockUnit({
      id: "guide-paid-with-legends-unit",
      name: "Guide Paid With Legends Unit",
      cost: 3,
    });
    const faceUpLegend = createMockLegend({
      id: "guide-face-up-payer",
      name: "Guide Face Up Payer",
    });
    const faceDownLegend = createMockLegend({
      id: "guide-face-down-payer",
      name: "Guide Face Down Payer",
    });
    const unusedLegend = createMockLegend({
      id: "guide-unused-non-payer",
      name: "Guide Unused Non Payer",
    });

    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [playedUnit],
      legendArea: [
        { card: faceUpLegend, faceDown: false },
        { card: faceDownLegend, faceDown: true },
        { card: unusedLegend, faceDown: true },
      ],
      eddies: 1,
    });

    expect(engine.playCard(playedUnit, { as: P1 })).toBeSuccessfulCommand();

    expect(engine.getCard(playedUnit, "field", P1)).toBeInZone("field");
    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCard(faceUpLegend, "legendArea", P1).meta.spent).toBe(true);
    expect(engine.getCard(faceDownLegend, "legendArea", P1).meta.spent).toBe(true);
    expect(engine.getCard(faceDownLegend, "legendArea", P1).meta.faceDown).toBe(true);
    expect(engine.getCard(unusedLegend, "legendArea", P1).meta.spent).toBe(false);
  });

  it("calls one face-down Legend during the main phase by spending one Eddie", () => {
    const firstLegend = createMockLegend({
      id: "guide-main-call-first-legend",
      name: "Guide Main Call First Legend",
    });
    const secondLegend = createMockLegend({
      id: "guide-main-call-second-legend",
      name: "Guide Main Call Second Legend",
    });

    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [
        { card: firstLegend, faceDown: true },
        { card: secondLegend, faceDown: true },
      ],
      eddies: 2,
    });

    expect(engine.callLegend(firstLegend, { as: P1 })).toBeSuccessfulCommand();

    expect(engine.getCard(firstLegend, "legendArea", P1).meta.faceDown).toBe(false);
    expect(engine.getEddies(P1)).toBe(1);
    expect(engine.getEvents("legendCalled")).toHaveLength(1);

    const failure = engine.expectFailure(() => engine.callLegend(secondLegend, { as: P1 }));
    expect(failure.errorCode).toBe("ALREADY_CALLED");
  });

  it("limits Call a Legend to once per defensive step but keeps it independent from main-phase calls", () => {
    const attacker = createMockUnit({
      id: "guide-reaction-attacker",
      name: "Guide Reaction Attacker",
      power: 0,
    });
    const firstReactionLegend = createMockLegend({
      id: "guide-reaction-legend-1",
      name: "Guide Reaction Legend 1",
    });
    const secondReactionLegend = createMockLegend({
      id: "guide-reaction-legend-2",
      name: "Guide Reaction Legend 2",
    });
    const mainPhaseLegend = createMockLegend({
      id: "guide-main-phase-legend",
      name: "Guide Main Phase Legend",
    });

    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [attacker] },
      {
        legendArea: [firstReactionLegend, secondReactionLegend, mainPhaseLegend],
        eddies: 3,
      },
      { activePlayerId: P1 },
    );

    engine.attackRival(attacker, { as: P1 });
    engine.resolveAttack({ as: P1 });

    expect(engine.callLegend(firstReactionLegend, { as: P2 })).toBeSuccessfulCommand();
    const failure = engine.expectFailure(() => engine.callLegend(secondReactionLegend, { as: P2 }));
    expect(failure.errorCode).toBe("ALREADY_CALLED");

    engine.resolveAttack({ as: P2, pass: true });
    engine.resolveAttack({ as: P1 });
    engine.passPhase({ as: P1 });

    const gainChoice = engine.getState().G.turnMetadata.pendingChoice;
    if (gainChoice?.type === "gainGig") {
      engine.gainGig(gainChoice.payload.allowedDieIds[0]!, { as: P2 });
    }

    expect(engine.callLegend(secondReactionLegend, { as: P2 })).toBeSuccessfulCommand();
  });

  it("resolves PLAY triggers when the card is played", () => {
    const drawnCard = createMockUnit({
      id: "guide-play-draw-card",
      name: "Guide Play Draw Card",
    });
    const playProgram = createMockProgram({
      id: "guide-play-trigger-program",
      name: "Guide Play Trigger Program",
      cost: 1,
      abilities: [
        {
          kind: "triggered",
          text: "{Play} Draw 1.",
          trigger: { trigger: "play" },
          source: { selector: "self" },
          effects: [{ effect: "draw", player: "friendly", amount: 1 }],
        },
      ],
    });

    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [playProgram], deck: [drawnCard], eddies: 1 },
      {},
      { preserveDeckOrder: true },
    );

    expect(engine.playCard(playProgram, { as: P1 })).toBeSuccessfulCommand();

    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      drawnCard.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      playProgram.id,
    );
  });

  it("resolves CALL triggers when a Legend is flipped through Call a Legend", () => {
    const drawnCard = createMockUnit({
      id: "guide-call-draw-card",
      name: "Guide Call Draw Card",
    });
    const callLegend = createMockLegend({
      id: "guide-call-trigger-legend",
      name: "Guide Call Trigger Legend",
      abilities: [
        {
          kind: "triggered",
          text: "{Call} Draw 1.",
          trigger: { trigger: "call" },
          source: { selector: "self" },
          effects: [{ effect: "draw", player: "friendly", amount: 1 }],
        },
      ],
    });

    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [{ card: callLegend, faceDown: true }],
        deck: [drawnCard],
        eddies: 1,
      },
      {},
      { preserveDeckOrder: true },
    );

    expect(engine.callLegend(callLegend, { as: P1 })).toBeSuccessfulCommand();

    expect(engine.getCard(callLegend, "legendArea", P1).meta.faceDown).toBe(false);
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      drawnCard.id,
    );
  });

  it("resolves ATTACK triggers before the defender can react", () => {
    const drawnCard = createMockUnit({
      id: "guide-attack-draw-card",
      name: "Guide Attack Draw Card",
    });
    const attackDrawAbility: Ability = {
      kind: "triggered",
      text: "{Attack} Draw 1.",
      trigger: { trigger: "attack" },
      source: { selector: "self" },
      effects: [{ effect: "draw", player: "friendly", amount: 1 }],
    };
    const attacker = createMockUnit({
      id: "guide-attack-trigger-unit",
      name: "Guide Attack Trigger Unit",
      abilities: [attackDrawAbility],
    });

    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [attacker],
        deck: [drawnCard],
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.attackRival(attacker, { as: P1 });

    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      drawnCard.id,
    );
    expect(engine.getState().G.attackState?.step).toBe("offensive");
    expect(engine.getPrompt(P2).status).toBe("waiting");
  });

  it("resolves DEFEATED triggers when the Unit is defeated", () => {
    const drawnCard = createMockUnit({
      id: "guide-defeated-draw-card",
      name: "Guide Defeated Draw Card",
    });
    const defeatedAbility: Ability = {
      kind: "triggered",
      text: "{Defeated} Draw 1.",
      trigger: { trigger: "defeated" },
      source: { selector: "self" },
      effects: [{ effect: "draw", player: "friendly", amount: 1 }],
    };
    const doomedUnit = createMockUnit({
      id: "guide-defeated-trigger-unit",
      name: "Guide Defeated Trigger Unit",
      power: 1,
      abilities: [defeatedAbility],
    });
    const defender = createMockUnit({
      id: "guide-defeated-trigger-defender",
      name: "Guide Defeated Trigger Defender",
      power: 5,
    });

    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [doomedUnit],
        deck: [drawnCard],
      },
      {
        field: [{ card: defender, spent: true }],
      },
      { preserveDeckOrder: true },
    );

    engine.attackUnit(doomedUnit, defender, { as: P1 });
    engine.resolveFullFight({ as: P1 });

    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      doomedUnit.id,
    );
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      drawnCard.id,
    );
  });

  it("lets ADRENALINE Units attack the turn they are played", () => {
    const adrenalineUnit = createMockUnit({
      id: "guide-adrenaline-unit",
      name: "Guide Adrenaline Unit",
      cost: 1,
      power: 3,
      keywords: ["adrenaline"],
    });
    const normalUnit = createMockUnit({
      id: "guide-normal-lag-unit",
      name: "Guide Normal Lag Unit",
      cost: 1,
      power: 3,
    });

    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [adrenalineUnit, normalUnit], eddies: 2 },
      {},
    );

    engine.playCard(adrenalineUnit, { as: P1 });
    engine.playCard(normalUnit, { as: P1 });

    const attackRivalMove = engine
      .getPrompt(P1)
      .availableMoves.find((move) => move.moveId === "attackRival");
    expect(attackRivalMove).toBeDefined();

    const candidates = (attackRivalMove!.inputSpec as { type: "selectCard"; candidates: string[] })
      .candidates;
    expect(candidates).toContain(engine.getCard(adrenalineUnit, "field", P1).instanceId);
    expect(candidates).not.toContain(engine.getCard(normalUnit, "field", P1).instanceId);
    expect(engine.attackRival(adrenalineUnit, { as: P1 })).toBeSuccessfulCommand();
  });

  it("prevents Units with Lag from activating self-spend abilities", () => {
    const selfSpendAbility: Ability = {
      kind: "keyword",
      text: "Spend: Ready this Unit.",
      trigger: { trigger: "activated" },
      costs: [{ cost: "spend", target: { selector: "self" } }],
      effects: [{ effect: "ready", target: { selector: "self" } }],
    };
    const freshUnit = createMockUnit({
      id: "guide-lag-self-spend-unit",
      name: "Guide Lag Self Spend Unit",
      abilities: [selfSpendAbility],
    });

    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [freshUnit],
      eddies: 3,
    });

    engine.playCard(freshUnit, { as: P1 });

    const failure = engine.expectFailure(() => engine.activateAbility(freshUnit, 0, { as: P1 }));
    expect(failure.errorCode).toBe("CARD_SPENT");
  });

  it("gives Lag to Units played through card effects", () => {
    const selfSpendAbility: Ability = {
      kind: "keyword",
      text: "Spend: Ready this Unit.",
      trigger: { trigger: "activated" },
      costs: [{ cost: "spend", target: { selector: "self" } }],
      effects: [{ effect: "ready", target: { selector: "self" } }],
    };
    const effectPlayedUnit = createMockUnit({
      id: "guide-effect-played-lag-unit",
      name: "Guide Effect Played Lag Unit",
      cost: 1,
      abilities: [selfSpendAbility],
    });
    const playUnitProgram = createMockProgram({
      id: "guide-unused-effect-play-unit-program",
      name: "Guide Unused Effect Play Unit Program",
    });

    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailYorinobuArasakaSteelDragon, playUnitProgram, effectPlayedUnit],
      eddies: 7,
    });

    engine.playCard(welcomeToNightCityRetailYorinobuArasakaSteelDragon, { as: P1 });
    engine.resolveEffectTarget(effectPlayedUnit, { as: P1 });

    expect(engine.getCard(effectPlayedUnit, "field", P1).meta.hasLag).toBe(true);
    const failure = engine.expectFailure(() =>
      engine.activateAbility(effectPlayedUnit, 0, { as: P1 }),
    );
    expect(failure.errorCode).toBe("CARD_SPENT");
  });

  it("moves Gear with an attached Legend when that Legend moves to hand", () => {
    const legend = createMockLegend({
      id: "guide-equipped-legend",
      name: "Guide Equipped Legend",
    });
    const gear = createMockGear({
      id: "guide-legend-gear",
      name: "Guide Legend Gear",
    });
    const returnLegendProgram = createMockProgram({
      id: "guide-return-legend-program",
      name: "Guide Return Legend Program",
      cost: 1,
      abilities: [
        {
          kind: "triggered",
          text: "{Play} Return a friendly Legend to its owner's hand.",
          trigger: { trigger: "play" },
          source: { selector: "self" },
          effects: [
            {
              effect: "returnToHand",
              target: {
                selector: "card",
                controller: "friendly",
                zones: ["legendArea"],
                cardTypes: ["legend"],
                selection: { mode: "choose", min: 1, max: 1 },
              },
              destinationOwner: "owner",
            },
          ],
        },
      ],
    });

    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [returnLegendProgram],
      legendArea: [{ card: legend, faceDown: false, attachedGears: [gear] }],
      eddies: 3,
    });

    engine.playCard(returnLegendProgram, { as: P1 });
    engine.resolveEffectTarget(legend, { as: P1 });

    const returnedLegend = engine.getCard(legend, "hand", P1);
    const returnedGear = engine.getCard(gear, "hand", P1);
    expect(returnedLegend.meta.attachedGearIds).toContain(returnedGear.instanceId);
    expect(returnedGear.meta.attachedToId).toBe(returnedLegend.instanceId);
  });

  it("moves attached Gear back to the field when a bounced Unit is replayed", () => {
    const unit = createMockUnit({
      id: "guide-bounced-equipped-unit",
      name: "Guide Bounced Equipped Unit",
      cost: 0,
      power: 3,
    });
    const gear = createMockGear({
      id: "guide-bounced-unit-gear",
      name: "Guide Bounced Unit Gear",
      power: 2,
    });
    const returnUnitProgram = createMockProgram({
      id: "guide-return-unit-program",
      name: "Guide Return Unit Program",
      cost: 1,
      abilities: [
        {
          kind: "triggered",
          text: "{Play} Return a friendly Unit to its owner's hand.",
          trigger: { trigger: "play" },
          source: { selector: "self" },
          effects: [
            {
              effect: "returnToHand",
              target: {
                selector: "card",
                controller: "friendly",
                zones: ["field"],
                cardTypes: ["unit"],
                selection: { mode: "choose", min: 1, max: 1 },
              },
              destinationOwner: "owner",
            },
          ],
        },
      ],
    });

    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [returnUnitProgram],
      field: [{ card: unit, attachedGears: [gear] }],
      eddies: 1,
    });

    engine.playCard(returnUnitProgram, { as: P1 });
    engine.resolveEffectTarget(unit, { as: P1 });
    expect(engine.getCard(gear, "hand", P1).meta.attachedToId).toBe(
      engine.getCard(unit, "hand", P1).instanceId,
    );

    engine.playCard(unit, { as: P1 });

    const replayedUnit = engine.getCard(unit, "field", P1);
    const replayedGear = engine.getCard(gear, "field", P1);
    expect(replayedUnit.meta.attachedGearIds).toContain(replayedGear.instanceId);
    expect(replayedGear.meta.attachedToId).toBe(replayedUnit.instanceId);
    expect(getEffectivePower(engine.getState(), replayedUnit.instanceId)).toBe(5);
  });

  it("removes a GO SOLO Legend from the game when it leaves the field", () => {
    const defender = createMockUnit({
      id: "guide-go-solo-defender",
      name: "Guide GO SOLO Defender",
      power: 20,
    });
    const gear = createMockGear({
      id: "guide-go-solo-gear",
      name: "Guide GO SOLO Gear",
      power: 1,
    });
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [
          {
            card: theHeistRetailStarterDeckVCorporateExile,
            faceDown: false,
            attachedGears: [gear],
          },
        ],
        eddies: 5,
      },
      {
        field: [{ card: defender, spent: true }],
      },
    );
    const vId = engine.findCardId(theHeistRetailStarterDeckVCorporateExile, "legendArea", P1);

    engine.executeMove("goSolo", { args: { cardId: vId } }, P1);
    engine.attackUnit(theHeistRetailStarterDeckVCorporateExile, defender, { as: P1 });
    engine.resolveFullFight({ as: P1 });

    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).not.toContain(
      theHeistRetailStarterDeckVCorporateExile.id,
    );
    expect(engine.getState().G.cardIndex[vId as string]).toBeUndefined();
    expect(engine.getCard(gear, "trash", P1).meta.attachedToId).toBeNull();
  });

  it("plays GO SOLO Legends as ready Units that can attack that turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: theHeistRetailStarterDeckVCorporateExile, faceDown: false }],
      eddies: 5,
    });
    const vId = engine.findCardId(theHeistRetailStarterDeckVCorporateExile, "legendArea", P1);
    const eddiesBefore = engine.getEddies(P1);

    expect(engine.executeMove("goSolo", { args: { cardId: vId } }, P1)).toMatchObject({
      success: true,
    });

    const v = engine.getCard(theHeistRetailStarterDeckVCorporateExile, "field", P1);
    expect(engine.getEddies(P1)).toBeLessThan(eddiesBefore);
    expect(v.meta.spent).toBe(false);
    expect(v.meta.hasLag).toBe(false);
    expect(
      engine.attackRival(theHeistRetailStarterDeckVCorporateExile, { as: P1 }),
    ).toBeSuccessfulCommand();
  });

  it("allows QUICK Programs and activated effects as reactions to a rival attack", () => {
    const drawnCard = createMockUnit({
      id: "guide-quick-draw-card",
      name: "Guide Quick Draw Card",
    });
    const quickProgram = createMockProgram({
      id: "guide-quick-program",
      name: "Guide Quick Program",
      cost: 1,
      keywords: ["quick"],
    });
    const quickLegend = createMockLegend({
      id: "guide-quick-legend",
      name: "Guide Quick Legend",
      keywords: ["quick"],
      abilities: [
        {
          kind: "triggered",
          text: "{Quick} 1 Eddie: Draw 1.",
          trigger: { trigger: "activated" },
          source: { selector: "self" },
          costs: [{ cost: "payEddies", amount: 1 }],
          effects: [{ effect: "draw", player: "friendly", amount: 1 }],
        },
      ],
    });
    const attacker = createMockUnit({
      id: "guide-quick-attacker",
      name: "Guide Quick Attacker",
      power: 3,
    });

    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [attacker] },
      {
        hand: [quickProgram],
        legendArea: [{ card: quickLegend, faceDown: false }],
        deck: [drawnCard],
        eddies: 2,
      },
      { activePlayerId: P1, preserveDeckOrder: true },
    );

    engine.attackRival(attacker, { as: P1 });
    engine.resolveAttack({ as: P1 });

    expect(engine.getPrompt(P2).availableMoves.map((move) => move.moveId)).toEqual(
      expect.arrayContaining(["activateAbility", "playCard"]),
    );
    expect(engine.playCard(quickProgram, { as: P2 })).toBeSuccessfulCommand();
    expect(engine.activateAbility(quickLegend, 0, { as: P2 })).toBeSuccessfulCommand();
    expect(engine.getCardsInZone("hand", P2).map((card) => card.definitionId)).toContain(
      drawnCard.id,
    );
  });

  it("lets BLOCKER Units spend to redirect a rival attack to themselves", () => {
    const attacker = createMockUnit({
      id: "guide-blocker-attacker",
      name: "Guide Blocker Attacker",
      power: 5,
    });
    const blocker = createMockUnit({
      id: "guide-blocker-unit",
      name: "Guide Blocker Unit",
      power: 2,
      keywords: ["blocker"],
    });

    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [attacker] },
      { field: [blocker], gigArea: [{ dieType: "d6", faceValue: 4 }] },
      { activePlayerId: P1 },
    );

    engine.attackRival(attacker, { as: P1 });
    engine.resolveAttack({ as: P1 });

    expect(engine.useBlocker(blocker, { as: P2 })).toBeSuccessfulCommand();

    const attack = engine.getState().G.attackState;
    expect(attack?.kind).toBe("fight");
    expect(attack?.redirectedByBlocker).toBe(true);
    expect(attack?.defenderId).toBe(engine.getCard(blocker, "field", P2).instanceId);
    expect(engine.getCard(blocker, "field", P2).meta.spent).toBe(true);
  });

  it("spends the attacking Unit and completes one attack before another can start", () => {
    const firstAttacker = createMockUnit({
      id: "guide-sequenced-attacker-1",
      name: "Guide Sequenced Attacker 1",
      power: 5,
    });
    const secondAttacker = createMockUnit({
      id: "guide-sequenced-attacker-2",
      name: "Guide Sequenced Attacker 2",
      power: 5,
    });

    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [firstAttacker, secondAttacker] },
      {
        gigArea: [
          { dieType: "d6", faceValue: 4 },
          { dieType: "d8", faceValue: 5 },
        ],
      },
      { activePlayerId: P1 },
    );

    expect(engine.attackRival(firstAttacker, { as: P1 })).toBeSuccessfulCommand();
    expect(engine.getCard(firstAttacker, "field", P1).meta.spent).toBe(true);

    const failure = engine.expectFailure(() => engine.attackRival(secondAttacker, { as: P1 }));
    expect(failure.errorCode).toBe("ATTACK_IN_PROGRESS");

    engine.resolveFullSteal({ as: P1 });
    expect(engine.getState().G.attackState).toBeNull();
    expect(engine.attackRival(secondAttacker, { as: P1 })).toBeSuccessfulCommand();
  });

  it("allows attacking spent rival Units but not ready rival Units", () => {
    const attacker = createMockUnit({
      id: "guide-targeting-attacker",
      name: "Guide Targeting Attacker",
      power: 5,
    });
    const readyRivalUnit = createMockUnit({
      id: "guide-ready-rival-unit",
      name: "Guide Ready Rival Unit",
      power: 2,
    });
    const spentRivalUnit = createMockUnit({
      id: "guide-spent-rival-unit",
      name: "Guide Spent Rival Unit",
      power: 2,
    });

    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [attacker] },
      { field: [readyRivalUnit, { card: spentRivalUnit, spent: true }] },
      { activePlayerId: P1 },
    );

    const failure = engine.expectFailure(() =>
      engine.attackUnit(attacker, readyRivalUnit, { as: P1 }),
    );
    expect(failure.errorCode).toBe("TARGET_READY");
    expect(engine.attackUnit(attacker, spentRivalUnit, { as: P1 })).toBeSuccessfulCommand();
  });

  it("does not let ready rival Units protect Gigs without a reaction effect", () => {
    const attacker = createMockUnit({
      id: "guide-ready-units-do-not-guard-attacker",
      name: "Guide Ready Units Do Not Guard Attacker",
      power: 5,
    });
    const readyRivalUnit = createMockUnit({
      id: "guide-ready-non-blocker",
      name: "Guide Ready Non Blocker",
      power: 2,
    });

    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [attacker] },
      {
        field: [readyRivalUnit],
        gigArea: [{ dieType: "d6", faceValue: 4 }],
      },
      { activePlayerId: P1 },
    );

    expect(engine.attackRival(attacker, { as: P1 })).toBeSuccessfulCommand();
    engine.resolveFullSteal({ as: P1 });

    expect(engine.getGigCount(P1)).toBe(1);
    expect(engine.getGigCount(P2)).toBe(0);
    expect(engine.getCard(readyRivalUnit, "field", P2).meta.spent).toBe(false);
  });

  it("resolves fights by power and defeats both Units on ties", () => {
    const strongerAttacker = createMockUnit({
      id: "guide-fight-stronger-attacker",
      name: "Guide Fight Stronger Attacker",
      power: 6,
    });
    const weakerDefender = createMockUnit({
      id: "guide-fight-weaker-defender",
      name: "Guide Fight Weaker Defender",
      power: 2,
    });
    const strongerEngine = CyberpunkTestEngine.createWithFixture(
      { field: [strongerAttacker] },
      { field: [{ card: weakerDefender, spent: true }] },
      { activePlayerId: P1 },
    );

    strongerEngine.attackUnit(strongerAttacker, weakerDefender, { as: P1 });
    strongerEngine.resolveFullFight({ as: P1 });

    expect(strongerEngine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      strongerAttacker.id,
    );
    expect(strongerEngine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      weakerDefender.id,
    );

    const tiedAttacker = createMockUnit({
      id: "guide-fight-tied-attacker",
      name: "Guide Fight Tied Attacker",
      power: 4,
    });
    const tiedDefender = createMockUnit({
      id: "guide-fight-tied-defender",
      name: "Guide Fight Tied Defender",
      power: 4,
    });
    const tiedEngine = CyberpunkTestEngine.createWithFixture(
      { field: [tiedAttacker] },
      { field: [{ card: tiedDefender, spent: true }] },
      { activePlayerId: P1 },
    );

    tiedEngine.attackUnit(tiedAttacker, tiedDefender, { as: P1 });
    tiedEngine.resolveFullFight({ as: P1 });

    expect(tiedEngine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      tiedAttacker.id,
    );
    expect(tiedEngine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      tiedDefender.id,
    );
  });

  it("scales direct Gig steals by attacking power", () => {
    const cases = [
      { power: 0, expectedStolen: 0, rivalGigs: [{ dieType: "d4" as const, faceValue: 1 }] },
      { power: 5, expectedStolen: 1, rivalGigs: [{ dieType: "d4" as const, faceValue: 1 }] },
      {
        power: 10,
        expectedStolen: 2,
        rivalGigs: [
          { dieType: "d4" as const, faceValue: 1 },
          { dieType: "d6" as const, faceValue: 3 },
        ],
      },
      {
        power: 20,
        expectedStolen: 3,
        rivalGigs: [
          { dieType: "d4" as const, faceValue: 1 },
          { dieType: "d6" as const, faceValue: 3 },
          { dieType: "d8" as const, faceValue: 5 },
        ],
      },
    ];

    for (const { power, expectedStolen, rivalGigs } of cases) {
      const attacker = createMockUnit({
        id: `guide-direct-steal-power-${power}`,
        name: `Guide Direct Steal Power ${power}`,
        power,
      });
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [attacker] },
        { gigArea: rivalGigs },
        { activePlayerId: P1 },
      );

      engine.attackRival(attacker, { as: P1 });
      engine.resolveAttack({ as: P1 });
      engine.resolveAttack({ as: P2, pass: true });
      engine.resolveAttack({ as: P1, gigIdsToSteal: engine.getGigDice(P2).map((die) => die.id) });

      expect(engine.getGigCount(P1)).toBe(expectedStolen);
      expect(engine.getGigCount(P2)).toBe(rivalGigs.length - expectedStolen);
    }
  });

  it("lets the attacker choose which rival Gig dice to steal", () => {
    const attacker = createMockUnit({
      id: "guide-choose-stolen-gigs-attacker",
      name: "Guide Choose Stolen Gigs Attacker",
      power: 10,
    });
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [attacker] },
      {
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 3 },
          { dieType: "d8", faceValue: 5 },
        ],
      },
      { activePlayerId: P1 },
    );

    engine.attackRival(attacker, { as: P1 });
    engine.resolveAttack({ as: P1 });
    engine.resolveAttack({ as: P2, pass: true });
    engine.executeMove("resolveAttack", { args: {} }, P1);

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseGigsToSteal") {
      throw new Error("Expected chooseGigsToSteal");
    }
    expect(choice.payload.count).toBe(2);
    const d4 = engine.findGigIdByType(P2, "d4");
    const d8 = engine.findGigIdByType(P2, "d8");
    const d6 = engine.findGigIdByType(P2, "d6");

    expect(
      engine.executeMove("resolveStealGigs", { args: { dieIds: [d4, d8] } }, P1),
    ).toBeSuccessfulCommand();

    expect(engine.getGigDice(P1).map((die) => die.id)).toEqual([d4, d8]);
    expect(engine.getGigDice(P2).map((die) => die.id)).toEqual([d6]);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });

  it("allows multiple defensive reactions before a BLOCKER turns a direct attack into a no-steal fight", () => {
    const attacker = createMockUnit({
      id: "guide-react-chain-attacker",
      name: "Guide React Chain Attacker",
      power: 8,
    });
    const reactionLegend = createMockLegend({
      id: "guide-react-chain-legend",
      name: "Guide React Chain Legend",
    });
    const quickProgram = createMockProgram({
      id: "guide-react-chain-quick-program",
      name: "Guide React Chain Quick Program",
      cost: 1,
      keywords: ["quick"],
    });
    const blocker = createMockUnit({
      id: "guide-react-chain-blocker",
      name: "Guide React Chain Blocker",
      power: 2,
      keywords: ["blocker"],
    });

    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [attacker] },
      {
        hand: [quickProgram],
        legendArea: [{ card: reactionLegend, faceDown: true }],
        field: [blocker],
        gigArea: [{ dieType: "d6", faceValue: 4 }],
        eddies: 2,
      },
      { activePlayerId: P1 },
    );
    const p2GigsBefore = engine.getGigCount(P2);

    engine.attackRival(attacker, { as: P1 });
    engine.resolveAttack({ as: P1 });

    expect(engine.callLegend(reactionLegend, { as: P2 })).toBeSuccessfulCommand();
    expect(engine.playCard(quickProgram, { as: P2 })).toBeSuccessfulCommand();
    expect(engine.useBlocker(blocker, { as: P2 })).toBeSuccessfulCommand();

    expect(engine.getCard(reactionLegend, "legendArea", P2).meta.faceDown).toBe(false);
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      quickProgram.id,
    );
    expect(engine.getState().G.attackState?.kind).toBe("fight");
    engine.resolveFullFight({ as: P1 });

    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      blocker.id,
    );
    expect(engine.getGigCount(P1)).toBe(0);
    expect(engine.getGigCount(P2)).toBe(p2GigsBefore);
  });
});
