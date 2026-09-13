import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kano } from "../heroes/kano.ts";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { zyggyStarlight } from "../heroes/zyggy-starlight.ts";
import {
  corrosiveSpaceDustBlue,
  corrosiveSpaceDustRed,
  corrosiveSpaceDustYellow,
} from "./corrosive-space-dust.ts";

const variants = [
  { label: "Corrosive Space Dust Red (AZS016)", card: corrosiveSpaceDustRed },
  { label: "Corrosive Space Dust Yellow (OMN013)", card: corrosiveSpaceDustYellow },
  { label: "Corrosive Space Dust Blue (OMN014)", card: corrosiveSpaceDustBlue },
] as const;

describe.each(variants)("$label family behavior AAA", ({ card }) => {
  it("happy: leaving the arena deals one arcane damage to a hero", () => {
    const game = FabTestEngine.start(
      { hero: kano, hand: [volticBoltRed], actionPoints: 1, resourcePoints: 2, deck: 6 },
      { hero: zyggyStarlight, arena: [card], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);

    game.as(kano).play(volticBoltRed, { target: Zyggy.id });
    game.untilIdle({ entityTargets: "minimum" });

    expectFabCard(Zyggy, card).toBeIn("graveyard");
    expectFabPlayer(Zyggy).toHaveLife(16);
  });

  it("boundary: remaining in the arena does not deal arcane damage", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      { hero: zyggyStarlight, arena: [card], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);

    expectFabCard(Zyggy, card).toBeIn("arena");
    expectFabPlayer(Zyggy).toHaveLife(20);
    expectFabPlayer(game.as(dash)).toHaveLife(20);
  });

  it("timing: entering the arena does not deal arcane damage", () => {
    const game = FabTestEngine.start(
      { hero: zyggyStarlight, hand: [card], resourcePoints: 1, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);

    Zyggy.play(card);
    game.untilIdle();

    expectFabCard(Zyggy, card).toBeIn("arena").toHaveKeyword("ward");
    expectFabPlayer(game.as(dash)).toHaveLife(20);
  });
});
