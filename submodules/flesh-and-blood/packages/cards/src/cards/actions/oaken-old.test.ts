import { describe, expect, it } from "vitest";
import { FabTestEngine, expectWait } from "@tcg/flesh-and-blood-engine/testing";
import { prowlBlue } from "./prowl.ts";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { autumnSTouchBlue } from "./autumn-s-touch.ts";
import { brambleSparkRed } from "./bramble-spark.ts";
import { blizzardBlue } from "../instants/blizzard.ts";
import { oakenOldRed } from "./oaken-old.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Oaken Old (ELE005) AAA", () => {
  it("fuses with real Earth and Ice cards for +2, dominate, and two random cards to deck bottom", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [oakenOldRed, autumnSTouchBlue, blizzardBlue],
        resourcePoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [prowlBlue, prowlBlue, prowlBlue], life: 20, deck: 6 },
      manual,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(oakenOldRed, { fuse: true, fuseCards: [autumnSTouchBlue, blizzardBlue] });
    game.passBoth();
    expect(game.combat()?.activeLink?.attackPower).toBe(9);
    game.helpers.resolveRestOfCombat();

    expect(Dash.life()).toBe(11);
    expect(Dash.zone("hand")).toHaveLength(1);
  });

  it("without fusion stays at 7, has no dominate, and does not move cards from hand", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [oakenOldRed], resourcePoints: 3, deck: 6 },
      { hero: dash, hand: [prowlBlue, prowlBlue, prowlBlue], life: 20, deck: 6 },
      manual,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(oakenOldRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(7);
    Dash.defendWith([prowlBlue, prowlBlue]);
    game.helpers.resolveRestOfCombat();

    expect(Dash.life()).toBe(19);
    expect(Dash.zone("hand")).toHaveLength(1);
  });

  it("keeps each fused card's declaration fact after an earlier fusion this turn", () => {
    // Arrange: two independent fusion declarations and a follow-up attack.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [
          oakenOldRed,
          autumnSTouchBlue,
          blizzardBlue,
          brambleSparkRed,
          autumnSTouchBlue,
          prowlBlue,
        ],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    // Act: establish the player-scoped turn fact with the first fusion.
    Bravo.play(oakenOldRed, { fuse: true, fuseCards: [autumnSTouchBlue, blizzardBlue] });
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    // Act: fuse a second, distinct object and use its fused-only modifier.
    Bravo.play(brambleSparkRed, { fuse: true, fuseCards: [autumnSTouchBlue] });
    game.passBoth();
    Bravo.attackWith(prowlBlue);

    // Assert: Bramble Spark's fused-only +3 applies to the next attack.
    expect(game.combat()?.activeLink?.attackPower).toBe(4); // Prowl Blue 1 + fused Bramble +3
    game.helpers.resolveRestOfCombat();
    expect(Dash.life()).toBe(7); // 20 − Oaken 9 − Prowl 4
  });

  it("rejects an incomplete fusion declaration before the play procedure starts", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [oakenOldRed, autumnSTouchBlue], resourcePoints: 3, deck: 6 },
      { hero: dash, deck: 6 },
      manual,
    );
    const Bravo = game.as(bravo);

    expect(() => Bravo.play(oakenOldRed, { fuse: true, fuseCards: [autumnSTouchBlue] })).toThrow();
    expect(Bravo.zone("hand")).toContain(oakenOldRed.canonicalId);
    expect(Bravo.zone("hand")).toContain(autumnSTouchBlue.canonicalId);
    expectWait(game).notToHaveDecision();
  });
});
