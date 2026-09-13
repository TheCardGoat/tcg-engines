import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { restlessMagisterRed } from "../actions/restless-magister.ts";
import { restlessOutlawRed } from "../actions/restless-outlaw.ts";
import { corruptedCorpse } from "../actions/corrupted-corpse.ts";
import { cintariSellsword } from "../tokens/cintari-sellsword.ts";
import { voxNecropolis } from "../weapons/vox-necropolis.ts";
import { malice } from "./malice.ts";

function publicLogMessages(game: FabTestEngine) {
  return game.moveLogs().flatMap((log) => log.public);
}

function resolveAllyLethal(
  attacker: ReturnType<FabTestEngine["as"]>,
  defender: ReturnType<FabTestEngine["as"]>,
  target: string,
) {
  attacker.playAttack(snatchRed, { target });
  defender.defendWith([]);
  attacker.pass();
  defender.pass();
  attacker.pass();
  defender.pass();
}

/**
 * Malice (IAR054) + Vox Necropolis (IAR055) + Corrupted Corpse (IAR090).
 *
 * Printed loops:
 * - Action — {r}, {t}: until EOT play target zombie from graveyard. Go again.
 * - Whenever a zombie you control dies, banish it face-down and create a
 *   Corrupted Corpse card in the banished zone (CR 8.5.40, not a token).
 * - Vox: zombies you control get "Action — {r}, {t}: Attack".
 */

describe("malice (IAR054) AAA", () => {
  it("happy: a zombie you control dying is banished face-down and creates a Corrupted Corpse", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: malice,
        arena: [restlessMagisterRed],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);
    const Dash = game.as(dash);
    const magister = Malice.findCardInZone("arena", restlessMagisterRed);

    // Snatch (4{p}) kills the 3{h} Zombie during the damage step.
    Dash.playAttack(snatchRed, { target: magister });
    Malice.defendWith([]);
    Dash.pass();
    Malice.pass();
    Dash.pass();
    Malice.pass();
    // Order the simultaneous triggers; Malice's dying-Zombie trigger resolves.
    Dash.choose("player-2");
    game.untilIdle();

    expectFabCard(Malice, restlessMagisterRed).toBeIn("banished").toBeFaceDown();
    expect(Malice.zone("banished")).toContain(corruptedCorpse.canonicalId);
    expectFabCard(Malice, corruptedCorpse).toBeBanished();

    game.helpers.expectLog("flesh-and-blood.dies", { cardName: "Restless Magister" });
    game.helpers.expectLog("flesh-and-blood.create", {
      playerId: Malice.id,
      cardName: "Corrupted Corpse",
    });
    const hiddenBanish = publicLogMessages(game).find(
      (message) =>
        message.key === "flesh-and-blood.banish.hidden.by-source" ||
        message.key === "flesh-and-blood.banish.hidden",
    );
    expect(hiddenBanish).toBeDefined();
    expect(hiddenBanish?.defaultMessage).not.toContain("Restless Magister");
    game.helpers.expectNoPublicLog("flesh-and-blood.banish", { cardName: "Restless Magister" });
  });

  it("boundary: a non-zombie ally you control dying does not create a Corrupted Corpse", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: malice,
        arena: [cintariSellsword],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);
    const Dash = game.as(dash);
    const sellsword = Malice.findCardInZone("arena", cintariSellsword);

    resolveAllyLethal(Dash, Malice, sellsword);
    game.untilIdle();

    expect(Malice.zone("arena")).not.toContain(cintariSellsword.canonicalId);
    expect(Malice.zone("banished")).not.toContain(corruptedCorpse.canonicalId);
    game.helpers.expectNoPublicLog("flesh-and-blood.create", { cardName: "Corrupted Corpse" });
    game.helpers.expectNoPublicLog("flesh-and-blood.banish.hidden");
    game.helpers.expectNoPublicLog("flesh-and-blood.banish.hidden.by-source");
  });

  it("boundary: an opposing zombie dying does not create a Corrupted Corpse for Malice", () => {
    const game = FabTestEngine.start(
      { hero: malice, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        arena: [restlessMagisterRed],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);
    const Dash = game.as(dash);
    const magister = Dash.findCardInZone("arena", restlessMagisterRed);

    resolveAllyLethal(Malice, Dash, magister);
    game.untilIdle();

    expectFabCard(Dash, restlessMagisterRed).toBeIn("graveyard");
    expect(Malice.zone("banished")).not.toContain(corruptedCorpse.canonicalId);
    expect(Dash.zone("banished")).not.toContain(corruptedCorpse.canonicalId);
    game.helpers.expectNoPublicLog("flesh-and-blood.create", { cardName: "Corrupted Corpse" });
  });

  it("happy: Blood Debt on the created Corrupted Corpse loses 1 life at Malice's end phase", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: malice,
        arena: [restlessMagisterRed],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);
    const Dash = game.as(dash);
    const magister = Malice.findCardInZone("arena", restlessMagisterRed);

    Dash.playAttack(snatchRed, { target: magister });
    Malice.defendWith([]);
    Dash.pass();
    Malice.pass();
    Dash.pass();
    Malice.pass();
    Dash.choose("player-2");
    game.untilIdle();

    expectFabCard(Malice, corruptedCorpse).toBeBanished();
    expectFabPlayer(Malice).toHaveLife(20);

    Dash.endTurn();
    game.untilIdle();
    expectFabPlayer(Malice).toHaveLife(20);

    Malice.endTurn();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    expectFabPlayer(Malice).toHaveLife(19);
  });

  it("boundary: a non-zombie death does not Blood Debt Malice at her end phase", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: malice,
        arena: [cintariSellsword],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);
    const Dash = game.as(dash);
    const sellsword = Malice.findCardInZone("arena", cintariSellsword);

    resolveAllyLethal(Dash, Malice, sellsword);
    game.untilIdle();
    expect(Malice.zone("banished")).not.toContain(corruptedCorpse.canonicalId);

    Dash.endTurn();
    game.untilIdle();
    Malice.endTurn();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    expectFabPlayer(Malice).toHaveLife(20);
    game.helpers.expectNoPublicLog("flesh-and-blood.create", { cardName: "Corrupted Corpse" });
  });

  it("happy: Restless Outlaw dying under Malice creates two Corrupted Corpses", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: malice,
        arena: [restlessOutlawRed],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);
    const Dash = game.as(dash);
    const outlaw = Malice.findCardInZone("arena", restlessOutlawRed);

    Dash.playAttack(snatchRed, { target: outlaw });
    Malice.defendWith([]);
    Dash.pass();
    Malice.pass();
    Dash.pass();
    Malice.pass();
    Dash.choose("player-2");
    game.untilIdle({ ordering: "listed" });

    expectFabCard(Malice, restlessOutlawRed).toBeIn("banished").toBeFaceDown();
    expect(Malice.zone("banished").filter((id) => id === corruptedCorpse.canonicalId)).toHaveLength(
      2,
    );
    game.helpers.expectLog("flesh-and-blood.create", {
      playerId: Malice.id,
      cardName: "Corrupted Corpse",
    });
  });

  it("happy: Vox grants a zombie an Attack that opens combat and returns the ally", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        weapon1: [voxNecropolis],
        arena: [restlessMagisterRed],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);

    Malice.activate(restlessMagisterRed);
    game.passBoth();

    // The granted Attack put the Zombie on the combat chain as the attacker.
    expectFabPlayer(Malice).toHaveResourceCount(0);
    expectCombat(game).toBeOpen();
    expectFabCard(Malice, restlessMagisterRed).toBeIn("combatChain");

    game.helpers.resolveRestOfCombat();
    expectCombat(game).toBeClosed();
    // The ally returns to the arena after attacking.
    expectFabCard(Malice, restlessMagisterRed).toBeIn("arena");
    expect(Malice.zone("graveyard")).not.toContain(restlessMagisterRed.canonicalId);
  });

  it("happy: playing a zombie from graveyard under Vox opens its ETB attack", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        weapon1: [voxNecropolis],
        graveyard: [restlessMagisterRed],
        resourcePoints: 3,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);

    Malice.activate(malice);
    game.untilIdle();
    Malice.play(restlessMagisterRed, { from: "graveyard" });
    game.untilIdle({ entityTargets: "minimum" });

    // The ETB attack resolved and the Zombie's hit banished a card from the
    // defending hero's hand (Dash picks; minimum answers it).
    expectCombat(game).toBeClosed();
    expectFabCard(Malice, restlessMagisterRed).toBeIn("arena");
    expectFabPlayer(game.as(dash)).toHaveHandCount(3);
  });

  it("boundary: without a zombie in graveyard the play-from-GY ability cannot activate", () => {
    const game = FabTestEngine.start(
      { hero: malice, resourcePoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    expectFabUnplayable(
      () => game.as(malice).activate(malice),
      /activation targets are unavailable/i,
    );
  });

  it("boundary: a face-down Zombie is not a legal activation target", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        graveyard: [{ card: restlessMagisterRed, state: { faceDown: true } }],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);

    Malice.expectActivationRejected(malice);
    expectFabCard(Malice, restlessMagisterRed).toBeIn("graveyard").toBeFaceDown();
  });

  it("UST notes: a Corrupted Corpse created in the end phase does not add Blood Debt to the stack", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        arena: [restlessMagisterRed],
        hand: [],
        life: 20,
        intellect: 0,
        deck: 6,
      },
      { hero: dash, hand: [], intellect: 0, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);
    const Dash = game.as(dash);

    Malice.endTurn();
    Dash.endTurn();
    Malice.endTurn();
    Dash.endTurn();
    Malice.endTurn();
    game.untilIdle();

    expect(Malice.zone("arena")).not.toContain(restlessMagisterRed.canonicalId);
    expect(Malice.zone("banished")).toContain(corruptedCorpse.canonicalId);
    expectFabPlayer(Malice).toHaveLife(20);
  });
});
