import { describe, expect, it } from "vitest";
import { expectFabCard, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prowlBlue } from "./prowl.ts";
import { avastYeBlue } from "./avast-ye.ts";
import { barnacleYellow } from "./barnacle.ts";
import { limpitHopALongYellow } from "./limpit-hop-a-long.ts";
import { oystenHeartOfGoldYellow } from "./oysten-heart-of-gold.ts";
import { gravyBones } from "../heroes/gravy-bones.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Avast Ye! (AGB025) AAA", () => {
  it("gives the next Pirate ally attack go again and creates Gold on hit", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [avastYeBlue],
        arena: [oystenHeartOfGoldYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      manual,
    );
    const Gravy = game.as(gravyBones);

    // The grant latches onto the next Pirate ally *attack*, not the sitting ally.
    expectFabCard(Gravy, oystenHeartOfGoldYellow).notToHaveKeyword("go-again");

    Gravy.play(avastYeBlue);
    game.passBoth();

    expectFabCard(Gravy, oystenHeartOfGoldYellow).notToHaveKeyword("go-again");

    Gravy.activate(oystenHeartOfGoldYellow);

    game.passBoth();
    game.helpers.resolveRestOfCombat();

    expect(game.as(dash).life()).toBe(17);

    // Can we create a more fluent assert that we can do by import a gold token card definition and using it? I prefer using real references to cards.
    expect(Gravy.zone("arena")).toContain("token:gold");
    expect(Gravy.actionPoints()).toBe(1);
  });

  it("does not create Gold when the ally attack is fully defended, while go again still resolves", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [avastYeBlue],
        arena: [oystenHeartOfGoldYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [prowlBlue], life: 20, deck: 6 },
      manual,
    );
    const Gravy = game.as(gravyBones);
    const Dash = game.as(dash);

    Gravy.play(avastYeBlue);
    game.passBoth();
    Gravy.activate(oystenHeartOfGoldYellow);

    // It would be nice to have a helper that let's us advance to defend step, and with the player having priority
    game.passBoth();
    game.passBoth();
    Dash.defendWith([prowlBlue]);
    game.helpers.resolveRestOfCombat();

    expect(Dash.life()).toBe(20);
    expect(Gravy.zone("arena")).not.toContain("token:gold");
    expect(Gravy.actionPoints()).toBe(1);
  });

  it("does not create Gold when a Pirate ally hits an opposing ally", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [avastYeBlue],
        arena: [barnacleYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arena: [limpitHopALongYellow], deck: 6 },
      manual,
    );
    const Gravy = game.as(gravyBones);
    const Dash = game.as(dash);

    Gravy.play(avastYeBlue);
    game.passBoth();
    game.exec({
      move: "activate",
      actorId: Gravy.id,
      payload: {
        instanceId: Gravy.ref(barnacleYellow).instanceId,
        target: Dash.ref(limpitHopALongYellow).instanceId,
      },
    });
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    expect(Gravy.zone("arena")).not.toContain("token:gold");
    expect(Dash.zone("arena")).not.toContain(limpitHopALongYellow.canonicalId);
    expect(Gravy.actionPoints()).toBe(1);
  });

  it("creates Gold only from the granted Pirate ally's hit", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [avastYeBlue],
        arena: [barnacleYellow, oystenHeartOfGoldYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      manual,
    );
    const Gravy = game.as(gravyBones);

    Gravy.play(avastYeBlue);
    game.passBoth();
    Gravy.activate(barnacleYellow);
    game.helpers.resolveRestOfCombat();
    Gravy.activate(oystenHeartOfGoldYellow);
    game.helpers.resolveRestOfCombat();

    expect(game.as(dash).life()).toBe(13);
    expect(Gravy.zone("arena").filter((id) => id === "token:gold")).toHaveLength(1);
  });
});
