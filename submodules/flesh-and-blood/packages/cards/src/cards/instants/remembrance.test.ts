import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { autumnSTouchBlue } from "../actions/autumn-s-touch.ts";
import { brutalAssaultBlue } from "../actions/brutal-assault.ts";
import { briar } from "../shared/test-recipients.ts";
import { snatchRed } from "../actions/snatch.ts";
import { sigilOfSolaceRed } from "./sigil-of-solace.ts";
import { remembranceYellow } from "./remembrance.ts";

describe("Remembrance (WTR163) AAA", () => {
  it("happy: shuffles up to 3 action cards from graveyard into the deck and banishes itself", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [remembranceYellow],
        graveyard: [snatchRed, brutalAssaultBlue, autumnSTouchBlue],
        actionPoints: 1,
        deck: [sigilOfSolaceRed],
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(remembranceYellow);
    game.passBoth();
    Briar.chooseTargets(snatchRed, brutalAssaultBlue, autumnSTouchBlue);
    game.passBoth();

    expectFabCard(Briar, remembranceYellow).toBeBanished();
    expect(Briar.zone("graveyard")).toHaveLength(0);
    expect(Briar.zone("deck")).toHaveLength(4);
    expectFabPlayer(Briar).toHaveAP(1);
  });

  it("boundary: a non-action instant in the graveyard is not shuffled back", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [remembranceYellow],
        graveyard: [sigilOfSolaceRed, snatchRed],
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(remembranceYellow);
    game.passBoth();
    const decision = Briar.expectDecision("entity-target");
    expect(decision.candidates).toHaveLength(1);
    Briar.chooseTargets(snatchRed);
    game.passBoth();

    expect(Briar.zone("graveyard")).toContain(sigilOfSolaceRed.canonicalId);
    expect(Briar.zone("graveyard")).not.toContain(snatchRed.canonicalId);
    expect(Briar.zone("deck")).toContain(snatchRed.canonicalId);
    expectFabCard(Briar, remembranceYellow).toBeBanished();
  });
});
