/**
 * Fact-coverage and privacy guarantees for the derived log table.
 *
 * Citations: CR 3.0.4a-d (zone visibility), 3.7.1 / 3.9.1 (hand and deck are
 * hidden information), 4.4.3c + 8.5.15c (deck insertion order is hidden),
 * glossary Reveal ("show an object to every player").
 */
import { describe, expect, it } from "vitest";
import { sendPackingYellow } from "../../cards/src/cards/actions/send-packing.ts";
import { sinspeakerGloombladeRed } from "../../cards/src/cards/actions/sinspeaker-gloomblade.ts";
import { runechant } from "../../cards/src/cards/tokens/runechant.ts";
import { edgeOfAutumn } from "../../cards/src/cards/weapons/edge-of-autumn.ts";
import { FAB_LOG_FACT_EMITTERS, FAB_LOG_INTENTIONALLY_UNLOGGED } from "./command-logs.ts";
import { FAB_GAME_EVENT_NAMES } from "./rules/events.ts";
import type { FabGameEventName } from "./rules/events.ts";
import { FabTestEngine } from "./testing/test-engine.ts";
import {
  bravo,
  dash,
  heartOfFyendal,
  nimblismBlue,
  sigilOfSolaceRed,
  snatchRed,
  stonewallImpasse,
} from "./rules/fixtures.ts";
import { hitTrainer } from "./rules/test-trainers.ts";
import type { FabMoveLogMessage } from "./moves.ts";

/** Walk priority/pitch timing by hand so receipts stay deterministic. */
const MANUAL = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

function publicMessages(game: FabTestEngine): readonly FabMoveLogMessage[] {
  return game.moveLogs().flatMap((log) => log.public);
}

function privateMessagesFor(game: FabTestEngine, playerId: string): readonly FabMoveLogMessage[] {
  return game.moveLogs().flatMap((log) => log.privateByPlayerId?.[playerId] ?? []);
}

/** The flat kernel journal is the spectator-shaped view: public facts only. */
function noPublicSurfaceNames(game: FabTestEngine, canary: string): void {
  expect(publicMessages(game).some((m) => m.defaultMessage.includes(canary))).toBe(false);
  expect(game.playerLogs().some((entry) => entry.message.includes(canary))).toBe(false);
}

describe("FabLog fact coverage", () => {
  it("records Usurp once with its additional-cost target and attack bonus", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [sinspeakerGloombladeRed], arena: [runechant], deck: 4 },
      { hero: dash, deck: 4 },
      { autoPassPriority: false },
    );

    const Bravo = game.as(bravo);
    Bravo.play(sinspeakerGloombladeRed);
    Bravo.target(runechant);
    game.advanceUntil({ stopAt: "defend" });

    expect(
      publicMessages(game).filter((message) => message.key === "flesh-and-blood.usurp"),
    ).toEqual([
      expect.objectContaining({
        values: {
          actorId: Bravo.id,
          cardName: "Sinspeaker Gloomblade",
          usurpedName: "Runechant",
        },
        defaultMessage: `${Bravo.id} destroyed Runechant to usurp with Sinspeaker Gloomblade; Sinspeaker Gloomblade gets +2 power.`,
      }),
    ]);
    expect(
      publicMessages(game).some(
        (message) =>
          message.key === "flesh-and-blood.destroy" ||
          message.key === "flesh-and-blood.destroy.by-source",
      ),
    ).toBe(false);
    expect(game.renderedPlayerNarrative(Bravo.id)).toContain(
      "You destroyed Runechant to usurp with Sinspeaker Gloomblade; Sinspeaker Gloomblade gets +2 power.",
    );
  });

  it("classifies every committable event name as logged or intentionally unlogged", () => {
    const emitted = Object.keys(FAB_LOG_FACT_EMITTERS);
    const unlogged: readonly FabGameEventName[] = [...FAB_LOG_INTENTIONALLY_UNLOGGED];
    const uncovered = FAB_GAME_EVENT_NAMES.filter(
      (name) => !emitted.includes(name) && !unlogged.includes(name),
    );
    expect(uncovered).toEqual([]);
    // An event cannot be both logged and suppressed.
    expect(unlogged.filter((name) => emitted.includes(name))).toEqual([]);
  });

  it("persists the opened stack layer on a completed play fact", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [sigilOfSolaceRed], deck: 4 },
      { hero: dash, deck: 4 },
      MANUAL,
    );

    game.as(bravo).play(sigilOfSolaceRed);

    const layer = game.getState().rulesStack[0];
    const played = publicMessages(game).find((message) => message.key === "flesh-and-blood.play");
    expect(layer).toBeDefined();
    expect(played?.activityRef).toEqual({
      kind: "stack-layer-opened",
      stackWindowId: layer?.layerId,
      layerId: layer?.layerId,
      controllerId: layer?.controllerId,
      sourceInstanceId: layer?.source.instanceId,
      respondsToLayerId: null,
      stackOrdinal: 1,
    });

    game.passBoth();

    const gainedLife = publicMessages(game).find(
      (message) => message.key === "flesh-and-blood.gain-life",
    );
    expect(gainedLife?.activityRef).toEqual({
      kind: "stack-layer-event",
      layerId: layer?.layerId,
      controllerId: layer?.controllerId,
      sourceInstanceId: layer?.source.instanceId,
    });
  });

  it("persists exact opened-layer provenance for an activated ability", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [edgeOfAutumn],
        hand: [nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, deck: 4 },
      MANUAL,
    );
    const Bravo = game.as(bravo);
    const weaponId = Bravo.findCardInZone("weapon1", edgeOfAutumn);

    Bravo.activate(edgeOfAutumn);

    const layer = game.getState().rulesStack.at(-1);
    const activated = publicMessages(game).find(
      (message) => message.key === "flesh-and-blood.activate",
    );
    expect(layer?.kind).toBe("activated");
    expect(activated?.objectRefs?.cardName).toEqual({
      instanceId: weaponId,
      canonicalId: edgeOfAutumn.canonicalId,
    });
    expect(activated?.activityRef).toEqual({
      kind: "stack-layer-opened",
      stackWindowId: layer?.layerId,
      layerId: layer?.layerId,
      controllerId: layer?.controllerId,
      sourceInstanceId: layer?.source.instanceId,
      respondsToLayerId: null,
      stackOrdinal: 1,
    });
  });

  it("persists exact opened-layer provenance for a triggered ability", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deckTop: [nimblismBlue], intellect: 0 },
      {
        hero: dash,
        arms: [stonewallImpasse],
        deckTop: [snatchRed],
        intellect: 0,
      },
      MANUAL,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.exec({
      move: "defend",
      payload: { instanceIds: [Dash.findCardInZone("arms", stonewallImpasse)] },
    });

    const layer = game.getState().rulesStack.at(-1);
    const triggered = publicMessages(game).find(
      (message) =>
        message.key === "flesh-and-blood.ability.layer" &&
        message.values?.cardName === "Stonewall Impasse" &&
        message.activityRef?.kind === "stack-layer-opened",
    );
    expect(layer?.kind).toBe("triggered");
    expect(triggered?.objectRefs?.cardName).toMatchObject({
      instanceId: expect.any(String),
      canonicalId: stonewallImpasse.canonicalId,
    });
    expect(triggered?.activityRef).toEqual({
      kind: "stack-layer-opened",
      stackWindowId: layer?.layerId,
      layerId: layer?.layerId,
      controllerId: layer?.controllerId,
      sourceInstanceId: layer?.source.instanceId,
      respondsToLayerId: null,
      stackOrdinal: 1,
    });
    const defense = publicMessages(game).find(
      (message) => message.key === "flesh-and-blood.defend",
    );
    expect(defense?.combatState).toEqual({ kind: "defense", cardDefense: 1 });
  });

  it("persists authoritative attack, defence, and final combat values", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, hand: [snatchRed], deck: 6 },
      MANUAL,
    );
    const attacker = game.as(bravo);
    const defender = game.as(dash);

    attacker.attackWith(snatchRed);
    defender.exec({
      move: "defend",
      payload: { instanceIds: [defender.findCardInZone("hand", snatchRed)] },
    });
    game.passBoth();
    game.passBoth();

    const attack = publicMessages(game).find((message) => message.key === "flesh-and-blood.attack");
    const defend = publicMessages(game).find((message) => message.key === "flesh-and-blood.defend");
    const outcome = publicMessages(game).find(
      (message) => message.key === "flesh-and-blood.combat.hit",
    );

    expect(attack?.combatState).toEqual({ kind: "attack", after: { attack: 4, defense: 0 } });
    expect(defend?.combatState).toEqual({
      kind: "defense",
      cardDefense: 2,
    });
    expect(outcome?.combatState).toEqual({
      kind: "outcome",
      final: { attack: 4, defense: 2 },
      damage: 2,
    });
  });
});

describe("FabLog privacy (engine-driven receipts)", () => {
  it("draw logs a public count with owner-only identities (CR 3.9.1)", () => {
    const attack = hitTrainer({
      slug: "log-privacy-draw",
      effect: { type: "draw", count: 2, player: "controller" },
    });
    // Deck top is the array tail: Nimblism is the first card drawn.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [attack],
        deck: [heartOfFyendal, heartOfFyendal, snatchRed, nimblismBlue],
      },
      { hero: dash, deck: 6 },
      MANUAL,
    );
    game.as(bravo).attackWith(attack);
    game.helpers.resolveUntilIdle();

    const bravoId = game.as(bravo).id;
    game.helpers.expectLog("flesh-and-blood.draw.cards", { playerId: bravoId, count: 2 });
    game.helpers.expectPrivateLog("flesh-and-blood.draw.private", bravoId, {
      playerId: bravoId,
    });
    const appendix = privateMessagesFor(game, bravoId).find(
      (message) => message.key === "flesh-and-blood.draw.private",
    );
    expect(appendix?.values?.cardNames).toContain("Nimblism");
    noPublicSurfaceNames(game, "Nimblism");
  });

  it("search logs a public action line with the found identity owner-only (CR 3.0.4b)", () => {
    const attack = hitTrainer({
      slug: "log-privacy-search",
      effect: { type: "search", zones: ["deck"], filter: {}, to: { zone: "hand" }, count: 1 },
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [attack], deck: [heartOfFyendal, nimblismBlue, snatchRed] },
      { hero: dash, deck: 6 },
      MANUAL,
    );
    game.as(bravo).attackWith(attack);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    const bravoId = game.as(bravo).id;
    // The search event commits before the picker binds, so the public line
    // carries the actor only — never a count or identity.
    const searched = publicMessages(game).find((m) => m.key === "flesh-and-blood.search");
    expect(searched).toBeTruthy();
    expect(Object.keys(searched?.values ?? {})).toEqual(["playerId"]);
    // The pick rides a hidden deck→hand move; only the owner learns it.
    game.helpers.expectPrivateLog("flesh-and-blood.search.found", bravoId);
    const found = privateMessagesFor(game, bravoId).find(
      (message) => message.key === "flesh-and-blood.search.found",
    );
    expect(typeof found?.values?.cardName).toBe("string");
    expect(["Nimblism", "Snatch", "Heart Of Fyendal"]).toContain(found?.values?.cardName);
    // Whichever card was found, no public surface carries its identity.
    noPublicSurfaceNames(game, "Nimblism");
    noPublicSurfaceNames(game, "Snatch");
    noPublicSurfaceNames(game, "Heart Of Fyendal");
  });

  it("opt logs a public count with owner-only placement (CR 4.4.3c)", () => {
    const attack = hitTrainer({ slug: "log-privacy-opt", effect: { type: "opt", count: 2 } });
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [attack],
        deck: [heartOfFyendal, heartOfFyendal, snatchRed, nimblismBlue],
      },
      { hero: dash, deck: 6 },
      MANUAL,
    );
    game.as(bravo).attackWith(attack);
    game.helpers.resolveUntilIdle();

    const bravoId = game.as(bravo).id;
    game.helpers.expectLog("flesh-and-blood.opt.cards", {
      playerId: bravoId,
      topCount: 2,
      topPlural: "s",
      bottomCount: 0,
      bottomPlural: "s",
    });
    game.helpers.expectPrivateLog("flesh-and-blood.opt.private", bravoId);
    const appendix = privateMessagesFor(game, bravoId).find(
      (message) => message.key === "flesh-and-blood.opt.private",
    );
    expect(typeof appendix?.values?.topNames).toBe("string");
    noPublicSurfaceNames(game, "Nimblism");
  });

  it("look logs a public observation with the identity only in the owner appendix", () => {
    const attack = hitTrainer({
      slug: "log-privacy-look",
      effect: { type: "look", target: { selector: "self" } },
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [attack, heartOfFyendal, snatchRed], deck: 6 },
      { hero: dash, deck: 6 },
      MANUAL,
    );
    game.as(bravo).attackWith(attack);
    game.helpers.resolveUntilIdle();

    const bravoId = game.as(bravo).id;
    const looked = publicMessages(game).find((m) => m.key === "flesh-and-blood.look");
    expect(looked).toBeTruthy();
    // The public line carries the actor only — never the looked identity.
    expect(Object.keys(looked?.values ?? {})).toEqual(["playerId"]);
    game.helpers.expectPrivateLog("flesh-and-blood.look.private", bravoId);
  });

  it("reveal logs the full identity publicly (glossary: show to every player)", () => {
    const attack = hitTrainer({
      slug: "log-privacy-reveal",
      effect: { type: "reveal", target: { selector: "self" } },
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [attack, heartOfFyendal], deck: 6 },
      { hero: dash, deck: 6 },
      MANUAL,
    );
    game.as(bravo).attackWith(attack);
    game.helpers.resolveUntilIdle();

    const bravoId = game.as(bravo).id;
    game.helpers.expectLog("flesh-and-blood.reveal", { playerId: bravoId });
    const revealed = publicMessages(game).find((m) => m.key === "flesh-and-blood.reveal");
    const revealedCardName = revealed?.values?.cardName;
    expect(typeof revealedCardName).toBe("string");
    expect(typeof revealedCardName === "string" && revealedCardName.length > 0).toBe(true);
  });

  it("a face-down banish hides the identity; no private appendix exists", () => {
    const attack = hitTrainer({
      slug: "log-privacy-banish-hidden",
      effect: { type: "banish", target: { selector: "self" }, faceDown: true },
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [attack, heartOfFyendal], deck: 6 },
      { hero: dash, deck: 6 },
      MANUAL,
    );
    game.as(bravo).attackWith(attack);
    game.helpers.resolveUntilIdle();

    const bravoId = game.as(bravo).id;
    game.helpers.expectLog("flesh-and-blood.banish.hidden.by-source", { playerId: bravoId });
    const hidden = publicMessages(game).find(
      (m) => m.key === "flesh-and-blood.banish.hidden.by-source",
    );
    expect(hidden?.values).toMatchObject({ playerId: bravoId, from: "combat-chain" });
    // The identity-hiding variant never fires for this transition.
    expect(publicMessages(game).some((m) => m.key === "flesh-and-blood.banish")).toBe(false);
  });

  it("a face-up banish from deck names the card and does not claim face-down", () => {
    const attack = hitTrainer({
      slug: "log-privacy-banish-deck-face-up",
      effect: {
        type: "banish",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["deck"],
          position: "top",
          count: 1,
        },
      },
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [attack], deck: 6, deckTop: [nimblismBlue] },
      { hero: dash, deck: 6 },
      MANUAL,
    );
    game.as(bravo).attackWith(attack);
    game.helpers.resolveUntilIdle();

    game.helpers.expectLog("flesh-and-blood.banish", { cardName: "Nimblism" });
    game.helpers.expectNoPublicLog("flesh-and-blood.banish.hidden");
    game.helpers.expectNoPublicLog("flesh-and-blood.banish.hidden.by-source");
    game.helpers.expectNoPublicLog("flesh-and-blood.banish.hidden-identity");
    game.helpers.expectNoPublicLog("flesh-and-blood.banish.hidden-identity.by-source");
    const named = publicMessages(game).find((m) => m.key === "flesh-and-blood.banish");
    expect(named?.values).toMatchObject({ cardName: "Nimblism" });
    expect(named?.defaultMessage.toLowerCase()).not.toContain("face down");
  });

  it("names the real source and public origin zone of a face-down banish", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [sendPackingYellow], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: dash, arsenal: [nimblismBlue], deck: 6 },
      MANUAL,
    );

    game.as(bravo).attackWith(sendPackingYellow);

    const message = publicMessages(game).find(
      (candidate) => candidate.key === "flesh-and-blood.banish.hidden.by-source",
    );
    expect(message).toMatchObject({
      values: {
        playerId: game.as(dash).id,
        sourceName: "Send Packing",
        from: "arsenal",
      },
      objectRefs: {
        sourceName: { canonicalId: sendPackingYellow.canonicalId },
      },
    });
    expect(message?.defaultMessage).not.toContain("Nimblism");

    const narrativeMessage = game
      .playerNarratives()
      .flatMap((log) => log.entries)
      .find(
        (entry) => entry.publicMessage?.key === "flesh-and-blood.banish.hidden.by-source",
      )?.publicMessage;
    expect(narrativeMessage).toMatchObject({
      key: "flesh-and-blood.banish.hidden.by-source",
      values: {
        playerId: game.as(dash).id,
        sourceName: "Send Packing",
        from: "arsenal",
      },
    });
  });

  it("a hand-to-deck move hides the identity and never logs the position (CR 4.4.3c)", () => {
    const attack = hitTrainer({
      slug: "log-privacy-move-to-deck",
      effect: {
        type: "move-card",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["hand"],
          count: 1,
        },
        to: { zone: "deck", position: "bottom" },
      },
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [attack, nimblismBlue], deck: 6 },
      { hero: dash, deck: 6 },
      MANUAL,
    );
    game.as(bravo).attackWith(attack);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    const bravoId = game.as(bravo).id;
    game.helpers.expectLog("flesh-and-blood.move-zone.hidden", {
      playerId: bravoId,
      from: "hand",
      to: "deck",
    });
    const moved = publicMessages(game).find((m) => m.key === "flesh-and-blood.move-zone.hidden");
    // Source-zone wording only: identity and insertion position stay hidden.
    expect(Object.keys(moved?.values ?? {}).sort()).toEqual(["from", "playerId", "to"]);
    noPublicSurfaceNames(game, "Nimblism");
  });

  it("a face-up arsenal load publishes the identity (plan privacy table)", () => {
    const attack = hitTrainer({
      slug: "log-privacy-arsenal-face-up",
      effect: {
        type: "move-card",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["hand"],
          count: 1,
        },
        to: { zone: "arsenal", visibility: "face-up" },
      },
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [attack, nimblismBlue], deck: 6 },
      { hero: dash, deck: 6 },
      MANUAL,
    );
    game.as(bravo).attackWith(attack);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    const bravoId = game.as(bravo).id;
    game.helpers.expectLog("flesh-and-blood.move-zone", {
      playerId: bravoId,
      from: "hand",
      to: "arsenal",
    });
    const loaded = publicMessages(game).find((m) => m.key === "flesh-and-blood.move-zone");
    const loadedCardName = loaded?.values?.cardName;
    expect(typeof loadedCardName).toBe("string");
    expect(typeof loadedCardName === "string" && loadedCardName.length > 0).toBe(true);
    expect(loaded?.objectRefs?.cardName).toMatchObject({
      instanceId: expect.any(String),
      canonicalId: expect.any(String),
    });
  });
});

describe("FabLog Clash narrative (engine-driven receipts)", () => {
  it("names both reveals and explains a power-versus-no-power win", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deckTop: [nimblismBlue], intellect: 0 },
      {
        hero: dash,
        hand: [],
        arms: [stonewallImpasse],
        deckTop: [snatchRed],
        intellect: 0,
      },
      MANUAL,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.exec({
      move: "defend",
      payload: { instanceIds: [Dash.findCardInZone("arms", stonewallImpasse)] },
    });
    game.passBoth();
    game.passBoth();

    const outcome = publicMessages(game).find(
      (message) => message.key === "flesh-and-blood.clash.outcome",
    );
    expect(outcome?.values).toMatchObject({
      firstPlayerId: Dash.id,
      firstCardName: "Snatch",
      firstPowerLabel: "4 power",
      secondCardName: "Nimblism",
      secondPowerLabel: "no power",
    });
    expect(outcome?.objectRefs).toMatchObject({
      firstCardName: {
        instanceId: expect.any(String),
        canonicalId: snatchRed.canonicalId,
      },
      secondCardName: {
        instanceId: expect.any(String),
        canonicalId: nimblismBlue.canonicalId,
      },
    });
    const win = publicMessages(game).find((message) => message.key === "flesh-and-blood.clash.win");
    expect(win?.defaultMessage).toContain("won the clash, 4 power to no power");
  });

  it("states that equal power means no player won", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deckTop: [snatchRed], intellect: 0 },
      {
        hero: dash,
        hand: [],
        arms: [stonewallImpasse],
        deckTop: [snatchRed],
        intellect: 0,
      },
      MANUAL,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.exec({
      move: "defend",
      payload: { instanceIds: [Dash.findCardInZone("arms", stonewallImpasse)] },
    });
    game.passBoth();
    game.passBoth();

    const noWinner = publicMessages(game).find(
      (message) => message.key === "flesh-and-blood.clash.tie",
    );
    expect(noWinner?.defaultMessage).toBe("No player won the clash (4 power vs 4 power).");
  });
});
