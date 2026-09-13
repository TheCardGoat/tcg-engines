import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { bladeFlashBlue } from "../attack-reactions/blade-flash.ts";
import { toughenUpBlue } from "../defense-reactions/toughen-up.ts";
import { nimblismBlue } from "./nimblism.ts";
import { soundTheAlarmRed } from "./sound-the-alarm.ts";

describe("Sound the Alarm (HNT226) AAA", () => {
  it("happy: attacking a hero with an attack reaction revealed tutors a defense reaction to the top", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [soundTheAlarmRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, toughenUpBlue],
      },
      { hero: dash, hand: [bladeFlashBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(soundTheAlarmRed, { stopAt: "on-attack" });
    expect(game.committedEvents().some((event) => event.name === "reveal")).toBe(true);
    Bravo.accept();
    Bravo.chooseTargets(Bravo.cardIn("deck", toughenUpBlue));
    expect(Bravo.zone("deck").at(-1)).toBe(toughenUpBlue.canonicalId);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(15);
  });

  it("boundary: no attack reaction revealed does not tutor a defense reaction", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [soundTheAlarmRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(soundTheAlarmRed);
    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(15);
  });

  it("timing: the reveal is on attack, before defend", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [soundTheAlarmRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(soundTheAlarmRed, { stopAt: "on-attack" });
    expect(game.committedEvents().some((event) => event.name === "reveal")).toBe(true);
    expectCombat(game).toBeOpen();
    expectFabCard(game.as(dash), nimblismBlue).toBeIn("hand");
  });
});
