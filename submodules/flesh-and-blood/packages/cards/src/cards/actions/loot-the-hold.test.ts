import { describe, expect, it } from "vitest";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prowlBlue } from "./prowl.ts";
import { lootTheHoldBlue } from "./loot-the-hold.ts";
import { oystenHeartOfGoldYellow } from "./oysten-heart-of-gold.ts";
import { gravyBones } from "../heroes/gravy-bones.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Loot the Hold (AGB028) AAA", () => {
  it("makes the hit hero discard and creates Gold after a Pirate ally hits", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [lootTheHoldBlue],
        arena: [oystenHeartOfGoldYellow],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [prowlBlue], life: 20, deck: 6 },
      manual,
    );
    const Gravy = game.as(gravyBones);
    const Dash = game.as(dash);

    Gravy.play(lootTheHoldBlue);
    game.passBoth();
    Gravy.activate(oystenHeartOfGoldYellow);
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    expect(Dash.life()).toBe(17);
    expect(Dash.zone("hand")).toHaveLength(0);
    expect(Dash.zone("graveyard")).toContain(prowlBlue.canonicalId);
    expect(Gravy.zone("arena")).toContain("token:gold");
  });

  it("creates no Gold when the hit hero has no card to discard", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [lootTheHoldBlue],
        arena: [oystenHeartOfGoldYellow],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      manual,
    );
    const Gravy = game.as(gravyBones);

    Gravy.play(lootTheHoldBlue);
    game.passBoth();
    Gravy.activate(oystenHeartOfGoldYellow);
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    expect(Gravy.zone("arena")).not.toContain("token:gold");
  });

  it("does not discard or create Gold when the ally does not hit", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [lootTheHoldBlue],
        arena: [oystenHeartOfGoldYellow],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [prowlBlue, prowlBlue], life: 20, deck: 6 },
      manual,
    );
    const Gravy = game.as(gravyBones);
    const Dash = game.as(dash);

    Gravy.play(lootTheHoldBlue);
    game.passBoth();
    Gravy.activate(oystenHeartOfGoldYellow);
    game.passBoth();
    game.passBoth();
    Dash.defendWith([prowlBlue]);
    game.helpers.resolveRestOfCombat();

    expect(Dash.zone("hand")).toHaveLength(1);
    expect(Gravy.zone("arena")).not.toContain("token:gold");
  });
});
