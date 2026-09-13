import { describe, expect, it } from "vitest";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prowlBlue } from "./prowl.ts";
import { snatchRed } from "./snatch.ts";
import { lootTheArsenalBlue } from "./loot-the-arsenal.ts";
import { oystenHeartOfGoldYellow } from "./oysten-heart-of-gold.ts";
import { gravyBones } from "../heroes/gravy-bones.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Loot the Arsenal (AGB027) AAA", () => {
  it("happy: next Pirate ally hit destroys an arsenal card and creates Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [lootTheArsenalBlue],
        arena: [oystenHeartOfGoldYellow],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [prowlBlue], arsenal: [prowlBlue], life: 20, deck: 6 },
      manual,
    );
    const Gravy = game.as(gravyBones);
    const Dash = game.as(dash);

    Gravy.play(lootTheArsenalBlue);
    game.passBoth();
    Gravy.activate(oystenHeartOfGoldYellow);
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    expect(Dash.life()).toBe(17);
    expect(Dash.zone("arsenal")).toHaveLength(0);
    expect(Dash.zone("graveyard")).toContain(prowlBlue.canonicalId);
    expect(Gravy.zone("arena")).toContain("token:gold");
  });

  it("boundary: a non-ally attack does not consume the grant", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [lootTheArsenalBlue, snatchRed],
        arena: [oystenHeartOfGoldYellow],
        actionPoints: 3,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [prowlBlue], arsenal: [prowlBlue], life: 20, deck: 6 },
      manual,
    );
    const Gravy = game.as(gravyBones);
    const Dash = game.as(dash);

    Gravy.play(lootTheArsenalBlue);
    game.passBoth();
    Gravy.playAttack(snatchRed);
    game.helpers.resolveRestOfCombat();

    expect(Dash.life()).toBe(16);
    expect(Dash.zone("arsenal")).toHaveLength(1);
    expect(Gravy.zone("arena")).not.toContain("token:gold");

    Gravy.activate(oystenHeartOfGoldYellow);
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    expect(Dash.zone("arsenal")).toHaveLength(0);
    expect(Gravy.zone("arena")).toContain("token:gold");
  });

  it("timing: the grant expires at end of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [lootTheArsenalBlue],
        arena: [oystenHeartOfGoldYellow],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], arsenal: [prowlBlue], life: 20, deck: 6 },
      manual,
    );
    const Gravy = game.as(gravyBones);
    const Dash = game.as(dash);

    Gravy.play(lootTheArsenalBlue);
    game.passBoth();
    Gravy.endTurn();
    Dash.endTurn();
    game.helpers.untilIdle();
    Gravy.activate(oystenHeartOfGoldYellow);
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    expect(Dash.life()).toBe(17);
    expect(Dash.zone("arsenal")).toHaveLength(1);
    expect(Gravy.zone("arena")).not.toContain("token:gold");
  });
});
