import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FabTestEngine,
} from "../../../../engine/src/testing/index.ts";
import { dash } from "../heroes/dash.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { kassaiOfTheGoldenSand } from "../heroes/kassai-of-the-golden-sand.ts";
import { snatchRed } from "../actions/snatch.ts";
import { glintTheQuicksilverBlue } from "./glint-the-quicksilver.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

function run(defendsFromHand: boolean): void {
  const game = FabTestEngine.start(
    {
      hero: kassaiOfTheGoldenSand,
      weapon1: [cintariSaber],
      hand: [glintTheQuicksilverBlue, snatchRed, snatchRed, snatchRed],
      deck: 6,
      resourcePoints: 1,
    },
    {
      hero: dash,
      hand: defendsFromHand ? [snatchRed] : [],
      deck: 6,
      life: 20,
    },
    manual,
  );
  const Kassai = game.as(kassaiOfTheGoldenSand);
  const Defender = game.as(dash);

  // Arrange — a real Cintari Saber proxy is attacking in Reaction Step.
  Kassai.must.activate(cintariSaber);
  game.advanceCombatTo("defend");
  if (defendsFromHand) Defender.must.defend(snatchRed);
  else Defender.must.defend();
  game.advanceCombatTo("reaction");
  game.helpers.passPriorityTo(Kassai);

  // Act — Glint declares the active Weapon attack and resolves publicly.
  Kassai.must.play(glintTheQuicksilverBlue);
  game.helpers.resolveUntilIdle({ ordering: "listed" });

  // Assert — go again applies in both branches; Reprise draws only after a
  // defending card was declared from hand on this chain link.
  expectFabCard(Kassai, glintTheQuicksilverBlue).toBeIn("graveyard");
  expectFabPlayer(Kassai).toHaveHandCount(defendsFromHand ? 4 : 3);
  expectFabPlayer(Kassai).toHaveAP(1);
}

describe("Glint the Quicksilver (WTR118)", () => {
  it("targets an active Weapon attack and resolves Reprise", () => run(true));

  it("grants go again without drawing when Reprise is false", () => run(false));

  it("is rejected outside a Weapon attack Reaction Step", () => {
    const game = FabTestEngine.start(
      { hero: kassaiOfTheGoldenSand, hand: [glintTheQuicksilverBlue], deck: 6 },
      { hero: dash, deck: 6 },
      manual,
    );
    expect(() => game.as(kassaiOfTheGoldenSand).play(glintTheQuicksilverBlue)).toThrow();
  });
});
