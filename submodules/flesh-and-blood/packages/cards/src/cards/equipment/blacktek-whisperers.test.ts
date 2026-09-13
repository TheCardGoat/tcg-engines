import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { infectRed } from "../actions/infect.ts";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { snatchRed } from "../actions/snatch.ts";
import { blacktekWhisperers } from "./blacktek-whisperers.ts";

describe("Blacktek Whisperers (DYN117) AAA", () => {
  it("happy: AR destroy grants the Assassin AAC on-hit go again", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        legs: [blacktekWhisperers],
        hand: [infectRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.playAttack(infectRed);
    game.toReaction("attacker");
    Arakni.activate(blacktekWhisperers);
    game.helpers.resolveUntilIdle({
      optionalBoolean: false,
      entityTargets: "minimum",
      ordering: "listed",
    });
    game.closeCombat({ ordering: "listed" });

    expectFabCard(Arakni, blacktekWhisperers).toBeIn("graveyard");
    expectFabPlayer(Arakni).toHaveAP(1);
  });

  it("boundary: a non-Assassin attack cannot be the AR target", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        legs: [blacktekWhisperers],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.playAttack(snatchRed);
    game.toReaction("attacker");
    Arakni.expectActivationRejected(blacktekWhisperers);
    expectFabCard(Arakni, blacktekWhisperers).toBeIn("legs");
    expectCombat(game).notToHaveKeyword("go-again");
  });

  it("timing: the AR is illegal outside the reaction step", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        legs: [blacktekWhisperers],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.expectActivationRejected(blacktekWhisperers);
    expectFabCard(Arakni, blacktekWhisperers).toBeIn("legs");
  });
});
