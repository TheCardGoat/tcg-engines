import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { hunterSKlaive } from "../weapons/hunter-s-klaive.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { kabutoOfImperialAuthority } from "./kabuto-of-imperial-authority.ts";

describe("Kabuto of Imperial Authority (HNT115) AAA", () => {
  it("happy: after Kabuto defends, a second weapon attack this turn is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        weapon1: [hunterSKlaive],
        weapon2: [hunterSKlaive],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, head: [kabutoOfImperialAuthority], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);
    const first = Dash.cardIn("weapon1", hunterSKlaive);
    const second = Dash.cardIn("weapon2", hunterSKlaive);

    Dash.must.activate(first);
    game.advanceCombatTo("defend");
    Bravo.defendWith(kabutoOfImperialAuthority);
    game.helpers.resolveUntilIdle();

    Dash.expectActivationRejected(second);
    expectFabCard(Bravo, kabutoOfImperialAuthority).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveAP(1);
  });

  it("boundary: attack actions remain legal after Kabuto defends", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        weapon1: [hunterSKlaive],
        hand: [snatchRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: bravo, head: [kabutoOfImperialAuthority], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.activate(hunterSKlaive);
    game.advanceCombatTo("defend");
    Bravo.defendWith(kabutoOfImperialAuthority);
    game.helpers.resolveUntilIdle();

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Bravo).toHaveLife(16);
    expectFabCard(Dash, snatchRed).toBeIn("graveyard");
  });

  it("timing: the weapon restriction expires at the end of the turn", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        weapon1: [hunterSKlaive],
        weapon2: [hunterSKlaive],
        hand: [nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, head: [kabutoOfImperialAuthority], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);
    const first = Dash.cardIn("weapon1", hunterSKlaive);
    const second = Dash.cardIn("weapon2", hunterSKlaive);

    Dash.must.activate(first);
    game.advanceCombatTo("defend");
    Bravo.defendWith(kabutoOfImperialAuthority);
    game.helpers.resolveUntilIdle();
    Dash.expectActivationRejected(second);

    Dash.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Bravo.endTurn();
    game.helpers.resolveUntilIdle();
    Dash.must.activate(second);
    game.helpers.resolveUntilIdle({
      paymentCanonicalId: nimblismBlue.canonicalId,
      optionalBoolean: false,
    });

    expectFabPlayer(Bravo).toHaveLife(19);
  });
});
