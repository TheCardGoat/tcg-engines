import { describe, expect, it } from "vitest";
import { expectFabCard, expectFabPlayer, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { eyeOfOphidiaBlue } from "../resources/eye-of-ophidia.ts";
import { beastWithinYellow } from "../actions/beast-within.ts";
import { swingBigRed } from "../actions/swing-big.ts";
import { pulpingRed } from "../actions/pulping.ts";
import { rhinarRecklessRampage } from "../heroes/rhinar-reckless-rampage.ts";
import { wreckerRompBlue } from "../actions/wrecker-romp.ts";
import { snatchRed } from "../actions/snatch.ts";
import { recklessSwingBlue } from "./reckless-swing.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Reckless Swing (WTR008) public AAA", () => {
  it("randomly discards a seeded 6+ card, defends for 4, and deals 2 to the attacking hero", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinarRecklessRampage,
        hand: [recklessSwingBlue, beastWithinYellow, wreckerRompBlue, swingBigRed],
        arsenal: [pulpingRed],
        deck: [
          wreckerRompBlue,
          wreckerRompBlue,
          wreckerRompBlue,
          wreckerRompBlue,
          wreckerRompBlue,
          wreckerRompBlue,
          wreckerRompBlue,
          wreckerRompBlue,
        ],
      },
      { hero: dash, hand: [snatchRed, snatchRed, snatchRed, snatchRed], deck: 8 },
      { ...manual, seed: "rh-d1-5" },
    );
    const Rhinar = game.as(rhinarRecklessRampage);
    const Attacker = game.as(dash);

    Rhinar.must.endTurn();
    Attacker.must.playAttack(Attacker.cardsIn("hand", snatchRed)[0]!);
    game.advanceCombatTo("defend");
    Rhinar.must.defend();
    game.advanceCombatTo("reaction");
    game.helpers.passPriorityTo(Rhinar);
    Rhinar.must.playReaction(recklessSwingBlue);
    game.helpers.resolveRestOfCombat();

    const discard = game
      .committedEvents()
      .find((event) => event.name === "discard" && event.data.playerId === Rhinar.id);
    expect(discard?.name === "discard" && discard.data.object.canonicalId).toBe(
      beastWithinYellow.canonicalId,
    );
    expectFabCard(Rhinar, recklessSwingBlue).toBeIn("graveyard");
    expectFabCard(Rhinar, beastWithinYellow).toBeIn("graveyard");
    expectFabPlayer(Rhinar).toHaveLife(39);
    expectFabPlayer(Attacker).toHaveLife(18).toHaveHandCount(3);
    expect(Rhinar.zone("arsenal")).toEqual([pulpingRed.canonicalId]);
    expect(discard?.name === "discard" && discard.data.random).toBe(true);

    Attacker.must.endTurn();
    Rhinar.must.endTurn();
    expectFabPlayer(Rhinar).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
  });

  it("still defends for 4 but deals no damage after a seeded card without power", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinarRecklessRampage,
        hand: [swingBigRed, recklessSwingBlue, eyeOfOphidiaBlue, beastWithinYellow],
        arsenal: [pulpingRed],
        deck: 8,
      },
      { hero: dash, hand: [snatchRed, snatchRed, snatchRed, snatchRed], deck: 8 },
      { ...manual, seed: "rh-h1-7" },
    );
    const Rhinar = game.as(rhinarRecklessRampage);
    const Attacker = game.as(dash);

    Rhinar.must.endTurn();
    Attacker.must.playAttack(Attacker.cardsIn("hand", snatchRed)[0]!);
    game.advanceCombatTo("defend");
    Rhinar.must.defend();
    game.advanceCombatTo("reaction");
    game.helpers.passPriorityTo(Rhinar);
    Rhinar.must.playReaction(recklessSwingBlue);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Rhinar, eyeOfOphidiaBlue).toBeIn("graveyard");
    expectFabPlayer(Rhinar).toHaveLife(40);
    expectFabPlayer(Attacker).toHaveLife(20).toHaveHandCount(3);
    expect(Rhinar.zone("arsenal")).toEqual([pulpingRed.canonicalId]);
    const discard = game
      .committedEvents()
      .find((event) => event.name === "discard" && event.data.playerId === Rhinar.id);
    expect(discard?.name === "discard" && discard.data.random).toBe(true);
    expect(discard?.name === "discard" && discard.data.object.canonicalId).toBe(
      eyeOfOphidiaBlue.canonicalId,
    );

    Attacker.must.endTurn();
    Rhinar.must.endTurn();
    expectFabPlayer(Rhinar).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
  });
});
