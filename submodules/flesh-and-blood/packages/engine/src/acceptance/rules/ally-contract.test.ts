/** CR 8.2.8 — Ally lifecycle, combat roles, and damage attribution. */
import { describe, expect, it } from "vitest";

import { oystenHeartOfGoldYellow } from "../../../../cards/src/cards/actions/oysten-heart-of-gold.ts";
import { prowlBlue } from "../../../../cards/src/cards/actions/prowl.ts";
import { bloodspillInvocationRed } from "../../../../cards/src/cards/actions/bloodspill-invocation.ts";
import { secondStrikeRed } from "../../../../cards/src/cards/actions/second-strike.ts";
import { sekemArchangelOfRavages } from "../../../../cards/src/cards/allies/sekem-archangel-of-ravages.ts";
import { cintariSellsword } from "../../../../cards/src/cards/tokens/cintari-sellsword.ts";
import { barnacleYellow } from "../../../../cards/src/cards/actions/barnacle.ts";
import { midasTouchYellow } from "../../../../cards/src/cards/actions/midas-touch.ts";
import { snatchRed } from "../../../../cards/src/cards/actions/snatch.ts";
import { sinkBelowRed } from "../../../../cards/src/cards/defense-reactions/sink-below.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash } from "../../rules/fixtures.ts";

describe("CR 8.2.8 Ally", () => {
  it("8.2.8a: an ally that ceases to exist dies and fires its real dies trigger", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, arena: [oystenHeartOfGoldYellow], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const oysten = Dash.findCardInZone("arena", oystenHeartOfGoldYellow);

    Bravo.attackWith(snatchRed, { target: oysten });
    game.helpers.resolveRestOfCombat();

    expect(Dash.zone("arena")).toContain("token:gold");
    expect(game.committedEvents().some((event) => event.name === "dies")).toBe(true);
  });

  it("8.2.8a: a token ally that ceases from the arena dies and does not enter the graveyard", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, arena: [cintariSellsword], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const ally = Dash.findCardInZone("arena", cintariSellsword);

    Bravo.attackWith(snatchRed, { target: ally });
    game.helpers.resolveRestOfCombat();

    expect(game.committedEvents().some((event) => event.name === "dies")).toBe(true);
    expect(Dash.zone("arena")).not.toContain(cintariSellsword.canonicalId);
    expect(Dash.zone("graveyard")).not.toContain(cintariSellsword.canonicalId);
    expect(Dash.zone("banished")).not.toContain(cintariSellsword.canonicalId);
    expect(game.getState().objects[ally]).toBeUndefined();
  });

  it("8.2.8a: destroying a token ally still dies (CR 2.5.3g) and the token does not change zones", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [midasTouchYellow], resourcePoints: 1, deck: 6 },
      { hero: dash, arena: [cintariSellsword], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const ally = Dash.findCardInZone("arena", cintariSellsword);

    Bravo.play(midasTouchYellow, { target: ally });
    game.helpers.resolveUntilIdle();

    expect(game.committedEvents().some((event) => event.name === "dies")).toBe(true);
    expect(Dash.zone("arena")).not.toContain(cintariSellsword.canonicalId);
    expect(Dash.zone("graveyard")).not.toContain(cintariSellsword.canonicalId);
    expect(Dash.zone("banished")).not.toContain(cintariSellsword.canonicalId);
    expect(game.getState().objects[ally]).toBeUndefined();
  });

  it("8.2.8a: a catalog ally destroyed by a discrete effect dies and fires its printed dies trigger", () => {
    // No in-repo public play banishes a catalog Ally from the arena
    // (Midas Touch / HMS Barracuda destroy; Watery Grave does not rewrite
    // banish). Destroy still leaves the arena, so CR 8.2.8a / 2.5.3g apply.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [midasTouchYellow], resourcePoints: 1, deck: 6 },
      { hero: dash, arena: [oystenHeartOfGoldYellow], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const oysten = Dash.findCardInZone("arena", oystenHeartOfGoldYellow);

    Bravo.play(midasTouchYellow, { target: oysten });
    game.helpers.resolveUntilIdle();

    expect(game.committedEvents().some((event) => event.name === "dies")).toBe(true);
    expect(Dash.zone("graveyard")).toContain(oystenHeartOfGoldYellow.canonicalId);
    expect(Dash.zone("banished")).not.toContain(oystenHeartOfGoldYellow.canonicalId);
    expect(Dash.zone("arena")).toContain("token:gold");
  });

  it("8.2.8b: end phase resets combat damage on an ally to its base life", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [prowlBlue], deck: 6 },
      { hero: dash, arena: [sekemArchangelOfRavages], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const sekem = Dash.findCardInZone("arena", sekemArchangelOfRavages);

    Bravo.attackWith(prowlBlue, { target: sekem });
    game.helpers.resolveRestOfCombat();
    // Prowl Blue is printed 1{p}; Sekem is printed 4{h}.
    expect(game.objectLife(sekem)).toBe(3);

    Bravo.endTurn();
    expect(game.objectLife(sekem)).toBe(4);
  });

  it("8.2.8c: an ally attack makes its controller the attacking hero for that link", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [sekemArchangelOfRavages], resourcePoints: 2, deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(sekemArchangelOfRavages);
    game.advanceToDecision(Bravo, "entity-target");
    Bravo.targetRequired(game.as(dash));
    game.passBoth();

    expect(game.combat()?.activeLink).toMatchObject({
      attackingPlayerId: Bravo.id,
      defendingPlayerId: game.as(dash).id,
    });
  });

  it("8.2.8d: an ally target assigns a defending hero but rejects ordinary defenders", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, hand: [prowlBlue, sinkBelowRed], arena: [cintariSellsword], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const ally = Dash.findCardInZone("arena", cintariSellsword);

    Bravo.attackWith(snatchRed, { target: ally });
    expect(game.combat()?.activeLink).toMatchObject({ defendingPlayerId: Dash.id });
    expect(
      Dash.expectFailure({
        move: "defend",
        payload: { instanceIds: [Dash.findCardInZone("hand", prowlBlue)] },
      }).errorCode,
    ).toBe("ally_target_no_defend");

    Dash.defendWith([]);
    Bravo.pass();
    expect(
      Dash.expectFailure({
        move: "begin-play",
        payload: { instanceId: Dash.findCardInZone("hand", sinkBelowRed) },
      }).errorCode,
    ).toBe("ally_target_no_defend");
  });

  it("8.2.8e: ally combat damage does not count as damage dealt by its controller or hero", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [sekemArchangelOfRavages],
        resourcePoints: 2,
        actionPoints: 2,
        hand: [secondStrikeRed],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(sekemArchangelOfRavages);
    game.advanceToDecision(Bravo, "entity-target");
    Bravo.targetRequired(game.as(dash));
    game.passBoth();
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    expect(game.getState().players[Bravo.id]!.history.turn.dealtDamage).toBe(false);
    const dashLife = game.as(dash).life();
    Bravo.attackWith(secondStrikeRed);
    game.helpers.resolveRestOfCombat();
    // Second Strike's real on-attack condition must remain false, so its
    // 3-power attack does not receive the +1 power damage bonus.
    expect(game.as(dash).life()).toBe(dashLife - 3);
  });

  it("8.2.8f: damage to an ally does not count as damage dealt to its controller or hero", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [prowlBlue], deck: 6 },
      {
        hero: dash,
        arena: [sekemArchangelOfRavages, bloodspillInvocationRed],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);
    const sekem = Dash.findCardInZone("arena", sekemArchangelOfRavages);

    game.as(bravo).attackWith(prowlBlue, { target: sekem });
    game.helpers.resolveRestOfCombat();

    expect(game.getState().players[Dash.id]!.history.turn.beenDealtDamage).toBe(false);
    expect(Dash.zone("arena")).toContain(bloodspillInvocationRed.canonicalId);
  });

  it("7.2.2b / 7.7.5: an attacking ally joins the chain and returns to the arena", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [sekemArchangelOfRavages], resourcePoints: 2, deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(sekemArchangelOfRavages);
    game.passBoth();
    expect(Bravo.zone("combatChain")).toContain(sekemArchangelOfRavages.canonicalId);
    expect(Bravo.zone("arena")).not.toContain(sekemArchangelOfRavages.canonicalId);

    game.helpers.resolveRestOfCombat();
    expect(game.combat()).toBeNull();
    expect(Bravo.zone("arena")).toContain(sekemArchangelOfRavages.canonicalId);
    expect(Bravo.zone("graveyard")).not.toContain(sekemArchangelOfRavages.canonicalId);
  });

  it("1.4.5a: a living ally with printed life is attackable", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, arena: [barnacleYellow], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const barnacle = game.as(dash).findCardInZone("arena", barnacleYellow);
    expect(game.objectLife(barnacle)).toBe(3);

    game.as(bravo).attackWith(snatchRed, { target: barnacle });
    expect(game.combat()?.activeLink).toMatchObject({
      defendingPlayerId: game.as(dash).id,
    });
  });
});
