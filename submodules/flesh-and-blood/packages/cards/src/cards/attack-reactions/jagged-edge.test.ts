import { describe, expect, it } from "vitest";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { dorinthea } from "../heroes/dorinthea.ts";
import { dawnblade } from "../weapons/dawnblade.ts";
import { jaggedEdgeRed } from "./jagged-edge.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Jagged Edge (HNT116) AAA", () => {
  it("adds +3 to a weapon attack from the reaction step and makes its damage unpreventable", () => {
    const game = FabTestEngine.start(
      { hero: dorinthea, weapon1: [dawnblade], hand: [jaggedEdgeRed], resourcePoints: 2, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      manual,
    );
    const Dori = game.as(dorinthea);

    Dori.activateAttack(dawnblade);
    game.toReaction("attacker");
    Dori.play(jaggedEdgeRed);
    game.passBoth();
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expect(game.as(dash).life()).toBe(14);
  });

  it("is illegal outside the reaction step", () => {
    const game = FabTestEngine.start(
      { hero: dorinthea, weapon1: [dawnblade], hand: [jaggedEdgeRed], resourcePoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      manual,
    );
    expect(() => game.as(dorinthea).play(jaggedEdgeRed)).toThrow();
  });
});
