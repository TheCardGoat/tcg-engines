import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectWait,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { katsu } from "../heroes/katsu.ts";
import { gustwaveOfTheSecondWindRed } from "./gustwave-of-the-second-wind.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { retraceThePastBlue } from "./retrace-the-past.ts";

describe("Retrace the Past (HNT249) AAA", () => {
  it("happy: after a Gustwave last attack, naming Snatch grants +2{p} and go again", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [gustwaveOfTheSecondWindRed, retraceThePastBlue, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(gustwaveOfTheSecondWindRed);
    game.advanceUntil({ stopAt: "resolution", optionals: "decline", ordering: "listed" });
    Katsu.playAttack(retraceThePastBlue, { stopAt: "on-attack" });
    expectWait(game).toHaveDecision("effect-resolution");
    const wait = game.waitState();
    if (wait.kind !== "decision" || wait.decision.kind !== "effect-resolution") {
      throw new Error("Expected Retrace the Past to open a card-name decision.");
    }
    const snatchOption = wait.decision.options.find((option) => option.label === "Snatch");
    const nimblismOption = wait.decision.options.find((option) => option.label === "Nimblism");
    expect(snatchOption?.id).toMatch(/^fab-card-name:/);
    expect(snatchOption?.id).not.toBe("Snatch");
    expect(wait.decision.presentation).toMatchObject({
      kind: "card-name",
      suggestionGroups: [
        {
          id: "your-hand",
          optionIds: [snatchOption?.id],
        },
      ],
    });
    expect(
      wait.decision.presentation?.suggestionGroups.flatMap((group) => group.optionIds),
    ).not.toContain(nimblismOption?.id);
    Katsu.choose("Snatch");
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });

    expectFabCard(Katsu, retraceThePastBlue).toHaveName("Retrace The Past").toHaveName("Snatch");
    game.helpers.expectLog("flesh-and-blood.name-card", {
      playerId: Katsu.id,
      cardName: "Snatch",
    });
    game.helpers.expectLog("flesh-and-blood.gain-name", {
      cardName: "Retrace The Past",
      gainedName: "Snatch",
    });
    expectCombat(game).toHaveAttackPower(4);
    expectCombat(game).toHaveKeyword("go-again");
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(game.as(dash)).toHaveLife(12);
  });

  it("boundary: without a Gustwave last attack, this stays at printed 2{p}", () => {
    const game = FabTestEngine.start(
      { hero: katsu, hand: [retraceThePastBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(retraceThePastBlue);
    expectFabCard(Katsu, retraceThePastBlue).toHaveName("Retrace The Past");
    expectCombat(game).toHaveAttackPower(2);
    expectCombat(game).notToHaveKeyword("go-again");
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(game.as(dash)).toHaveLife(18);
  });

  it("timing: cannot be played as an instant during the opponent's combat", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: katsu, hand: [retraceThePastBlue], deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    game.as(dash).playAttack(snatchRed);
    game.toReaction();
    expect(() => game.as(katsu).play(retraceThePastBlue)).toThrow();
    expectFabCard(game.as(katsu), retraceThePastBlue).toBeIn("hand");
  });
});
