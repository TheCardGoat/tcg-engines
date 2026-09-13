import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { azalea, dash, deathDealer, longShotRed } from "../../../fixtures.ts";
import { boltNBoots } from "../../../../../../cards/src/cards/equipment/bolt-n-boots.ts";

/** This attack's target decision requires one-at-a-time passes to reach Reaction. */
function enterReaction(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let i = 0; i < 12 && game.combat()?.step !== "reaction"; i += 1) {
    if (game.declareNoDefenseIfPending()) continue;
    const actorId = game.getPriorityPlayerId();
    if (!actorId) throw new Error("combat priority missing");
    game.exec({ move: "pass", actorId, payload: {} });
  }
  expect(game.combat()?.step).toBe("reaction");
}

describe("bolt-n-boots (PEN082)", () => {
  it("AAA: destroys itself in reaction and gives an aimed Long Shot go again", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        legs: [boltNBoots],
        arsenal: [{ card: longShotRed, state: { aimCounters: 1 } }],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Azalea = game.as(azalea);
    Azalea.playFromArsenal(longShotRed, { target: game.as(dash).id });
    enterReaction(game);

    Azalea.activate(boltNBoots);
    game.passBoth();
    expect(Azalea.zone("graveyard")).toContain(boltNBoots.canonicalId);
    game.helpers.resolveRestOfCombat();

    expect(game.as(dash).life()).toBe(15);
    expect(Azalea.actionPoints()).toBe(1);
  });

  it("boundary: an unbuffed arrow is not a legal target", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        legs: [boltNBoots],
        arsenal: [longShotRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Azalea = game.as(azalea);
    Azalea.playFromArsenal(longShotRed, { target: game.as(dash).id });
    enterReaction(game);

    expect(() => Azalea.activate(boltNBoots)).toThrow();
    expect(Azalea.zone("legs")).toContain(boltNBoots.canonicalId);
  });
});
