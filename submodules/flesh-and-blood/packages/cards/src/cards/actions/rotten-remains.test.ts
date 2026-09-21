import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectWait,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { yintiYantiBlue } from "./yinti-yanti.ts";
import { browbeatBlue } from "./browbeat.ts";
import { nimblismBlue } from "./nimblism.ts";
import { rouseTheAncientsBlue } from "./rouse-the-ancients.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { rottenRemainsBlue } from "./rotten-remains.ts";

/**
 * Rotten Remains (HNT221) — Generic Attack Action, 1{p}.
 * Printed: When this attacks, you may banish a card with 1{p} from each hero's
 * graveyard. If you do, this gets +1{p}, then repeat this process.
 */

describe("Rotten Remains (HNT221) AAA", () => {
  it("happy: banishing 1{p} from each graveyard gives +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [rottenRemainsBlue],
        graveyard: [yintiYantiBlue, yintiYantiBlue],
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: bravo,
        hand: [],
        graveyard: [browbeatBlue, browbeatBlue],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    const Bravo = game.as(bravo);
    const own = Dash.cardsIn("graveyard", yintiYantiBlue);
    const opposing = Bravo.cardsIn("graveyard", browbeatBlue);
    Dash.playAttack(rottenRemainsBlue, { stopAt: "on-attack" });
    Dash.accept();
    game.advanceToDecision(Dash, "entity-target");
    Dash.target(opposing[0]!);
    game.advanceToDecision(Dash, "entity-target");
    Dash.target(own[0]!);
    expectCombat(game).toHaveAttackPower(2);
    expectFabCard(Dash, own[0]!).toBeBanished();
    expectFabCard(Bravo, opposing[0]!).toBeBanished();
    game.advanceToDecision(Dash, "boolean");
    Dash.decline();

    expectCombat(game).toHaveAttackPower(2);
    expectFabCard(Dash, own[1]!).toBeIn("graveyard");
    expectFabCard(Bravo, opposing[1]!).toBeIn("graveyard");
  });

  it("two accepted graveyard pairs commit both power increases and finish the attack", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [rottenRemainsBlue],
        graveyard: [yintiYantiBlue, yintiYantiBlue],
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: bravo,
        life: 20,
        hand: [],
        graveyard: [browbeatBlue, browbeatBlue],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);
    const own = Dash.cardsIn("graveyard", yintiYantiBlue);
    const opposing = Bravo.cardsIn("graveyard", browbeatBlue);

    Dash.playAttack(rottenRemainsBlue, { stopAt: "on-attack" });
    Dash.accept();
    game.advanceToDecision(Dash, "entity-target");
    Dash.target(opposing[0]!);
    game.advanceToDecision(Dash, "entity-target");
    Dash.target(own[0]!);
    expectCombat(game).toHaveAttackPower(2);
    game.advanceToDecision(Dash, "boolean");
    Dash.accept();
    // One eligible card remains in each graveyard, so both exact choices are forced.
    expectCombat(game).toHaveAttackPower(3);
    for (const card of own) expectFabCard(Dash, card).toBeBanished();
    for (const card of opposing) expectFabCard(Bravo, card).toBeBanished();
    game.closeCombat({ optionals: "throw" });
    expectFabPlayer(Bravo).toHaveLife(17);
    expectCombat(game).toBeClosed();
    expectWait(game).notToHaveDecision();
  });

  it("chooses exactly one 1-power card from each graveyard and excludes other power values", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [rottenRemainsBlue],
        graveyard: [
          yintiYantiBlue,
          yintiYantiBlue,
          yintiYantiBlue,
          brutalAssaultBlue,
          rouseTheAncientsBlue,
          nimblismBlue,
        ],
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: bravo,
        life: 20,
        hand: [],
        graveyard: [
          browbeatBlue,
          browbeatBlue,
          browbeatBlue,
          brutalAssaultBlue,
          rouseTheAncientsBlue,
          nimblismBlue,
        ],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);
    const own = Dash.cardsIn("graveyard", yintiYantiBlue);
    const opposing = Bravo.cardsIn("graveyard", browbeatBlue);
    Dash.playAttack(rottenRemainsBlue, { stopAt: "on-attack" });
    Dash.accept();
    const opposingChoice = Dash.expectDecision("entity-target");
    expect(opposingChoice.candidates.map((card) => card.instanceId).sort()).toEqual(
      opposing.map((card) => card.instanceId).sort(),
    );
    expect(opposingChoice.min).toBe(1);
    expect(opposingChoice.max).toBe(1);
    Dash.target(opposing[1]!);
    const ownChoice = Dash.expectDecision("entity-target");
    expect(ownChoice.candidates.map((card) => card.instanceId).sort()).toEqual(
      own.map((card) => card.instanceId).sort(),
    );
    expect(ownChoice.min).toBe(1);
    expect(ownChoice.max).toBe(1);
    Dash.target(own[1]!);
    expectCombat(game).toHaveAttackPower(2);
    game.advanceToDecision(Dash, "boolean");
    Dash.decline();
    expectFabCard(Dash, own[1]!).toBeBanished();
    expectFabCard(Bravo, opposing[1]!).toBeBanished();
    expectFabCard(Dash, own[0]!).toBeIn("graveyard");
    expectFabCard(Bravo, opposing[0]!).toBeIn("graveyard");
    expectFabCard(Dash, own[2]!).toBeIn("graveyard");
    expectFabCard(Bravo, opposing[2]!).toBeIn("graveyard");
    expectFabCard(Dash, brutalAssaultBlue).toBeIn("graveyard");
    expectFabCard(Bravo, brutalAssaultBlue).toBeIn("graveyard");
    expectFabCard(Dash, rouseTheAncientsBlue).toBeIn("graveyard");
    expectFabCard(Bravo, rouseTheAncientsBlue).toBeIn("graveyard");
    expectFabCard(Dash, nimblismBlue).toBeIn("graveyard");
    expectFabCard(Bravo, nimblismBlue).toBeIn("graveyard");
    game.closeCombat({ optionals: "throw" });
    expectFabPlayer(Bravo).toHaveLife(18);
    expectCombat(game).toBeClosed();
    expectWait(game).notToHaveDecision();
  });

  it("the bonus ends with its attack object and does not boost a second physical copy", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [rottenRemainsBlue, rottenRemainsBlue],
        graveyard: [yintiYantiBlue],
        actionPoints: 2,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: bravo,
        life: 20,
        hand: [],
        graveyard: [browbeatBlue],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);
    const [first, second] = Dash.cardsIn("hand", rottenRemainsBlue);
    Dash.playAttack(first!, { stopAt: "on-attack" });
    Dash.accept();
    expectCombat(game).toHaveAttackPower(2);
    expectFabCard(Dash, second!).toBeIn("hand").toHavePower(1);
    game.closeCombat({ optionals: "throw" });
    expectFabPlayer(Bravo).toHaveLife(18);
    expectFabCard(Dash, first!).toBeIn("graveyard").toHavePower(1);

    Dash.playAttack(second!, { stopAt: "on-attack" });
    expectWait(game).notToHaveDecision();
    expectCombat(game).toHaveAttackPower(1);
    game.closeCombat({ optionals: "throw" });
    expectFabPlayer(Bravo).toHaveLife(17);
    expectFabCard(Dash, first!).toBeIn("graveyard").toHavePower(1);
    expectFabCard(Dash, second!).toBeIn("graveyard").toHavePower(1);
    expectCombat(game).toBeClosed();
    expectWait(game).notToHaveDecision();
  });

  for (const missing of ["attacker", "defender"] as const) {
    it(`cannot banish a partial pair when the ${missing} graveyard has no eligible card`, () => {
      const game = FabTestEngine.start(
        {
          hero: dash,
          hand: [rottenRemainsBlue],
          graveyard: missing === "attacker" ? [] : [yintiYantiBlue],
          actionPoints: 1,
          deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        },
        {
          hero: bravo,
          life: 20,
          hand: [],
          graveyard: missing === "defender" ? [] : [browbeatBlue],
          deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        },
        FAB_MANUAL_HARNESS,
      );
      const Dash = game.as(dash);
      const Bravo = game.as(bravo);
      Dash.playAttack(rottenRemainsBlue, { stopAt: "on-attack" });
      expectCombat(game).toHaveAttackPower(1);
      expectWait(game).notToHaveDecision();
      game.closeCombat({ optionals: "throw" });
      if (missing === "attacker") {
        expectFabCard(Bravo, browbeatBlue).toBeIn("graveyard");
      } else {
        expectFabCard(Dash, yintiYantiBlue).toBeIn("graveyard");
      }
      expectFabPlayer(Bravo).toHaveLife(19);
      expectCombat(game).toBeClosed();
      expectWait(game).notToHaveDecision();
    });
  }

  it("boundary: empty graveyards leave printed 1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [rottenRemainsBlue],
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: bravo,
        hand: [],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    game.as(dash).playAttack(rottenRemainsBlue, { stopAt: "on-attack" });
    expectCombat(game).toHaveAttackPower(1);
  });

  it("timing: declining the banish leaves printed 1{p} on this attack only", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [rottenRemainsBlue],
        graveyard: [yintiYantiBlue],
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: bravo,
        hand: [],
        graveyard: [browbeatBlue],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    Dash.playAttack(rottenRemainsBlue, { stopAt: "on-attack" });
    Dash.decline();
    expectCombat(game).toHaveAttackPower(1);
    expectFabCard(Dash, yintiYantiBlue).toBeIn("graveyard");
  });
});
