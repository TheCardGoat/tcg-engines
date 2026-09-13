import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../testing/test-engine.ts";
import { dash, nimblismBlue, sigilOfSolaceRed } from "./fixtures.ts";
import { iyslander } from "../../../cards/src/cards/heroes/iyslander.ts";
import { emeritusScoldingRed } from "../../../cards/src/cards/actions/emeritus-scolding.ts";
import { emeritusScoldingYellow } from "../../../cards/src/cards/actions/emeritus-scolding.ts";
import { emeritusScoldingBlue } from "../../../cards/src/cards/actions/emeritus-scolding.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Emeritus Scolding alternative arcane damage", () => {
  it.each([
    [emeritusScoldingRed, 4],
    [emeritusScoldingYellow, 3],
    [emeritusScoldingBlue, 2],
  ] as const)("AAA own-turn branch: %s deals only its printed base %i", (card, damage) => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        resourcePoints: 2,
        hand: [card, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [sigilOfSolaceRed],
        deck: 4,
      },
      {
        hero: dash,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [sigilOfSolaceRed],
        deck: 4,
      },
      manual,
    );
    const Iyslander = game.as(iyslander);
    const Dash = game.as(dash);
    const lifeBefore = Dash.life();

    Iyslander.play(card, { target: Dash.id });
    game.helpers.resolveUntilIdle();

    expect(Dash.life()).toBe(lifeBefore - damage);
  });

  it("AAA opponent-turn branch: Iyslander may play the blue action from arsenal as an instant and deal exactly four", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [sigilOfSolaceRed],
        deck: 4,
      },
      {
        hero: iyslander,
        resourcePoints: 2,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [emeritusScoldingBlue],
        deck: 4,
      },
      manual,
    );
    const Dash = game.as(dash);
    const Iyslander = game.as(iyslander);
    const lifeBefore = Dash.life();

    Dash.pass();
    Iyslander.playFromArsenal(emeritusScoldingBlue, { target: Dash.id });
    game.helpers.resolveUntilIdle();

    expect(Dash.life()).toBe(lifeBefore - 4);
  });
});
