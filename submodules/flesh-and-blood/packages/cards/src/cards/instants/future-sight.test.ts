import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { iyslander } from "../heroes/iyslander.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { futureSightBlue, futureSightRed, futureSightYellow } from "./future-sight.ts";

const variants = [
  { label: "Future Sight Red (PEN117)", card: futureSightRed, count: 3 },
  { label: "Future Sight Yellow (PEN118)", card: futureSightYellow, count: 2 },
  { label: "Future Sight Blue (PEN119)", card: futureSightBlue, count: 1 },
] as const;

describe.each(variants)("$label family behavior AAA", ({ card, count }) => {
  it(`happy: paying 1 creates ${count} Sigil of Fate token${count === 1 ? "" : "s"}`, () => {
    const game = FabTestEngine.start(
      { hero: iyslander, hand: [card], resourcePoints: 1, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);

    Iyslander.play(card);
    game.untilIdle();

    expectFabPlayer(Iyslander).toHaveTokenCount("sigil-of-fate", count);
    expectFabPlayer(Iyslander).toHaveAP(1);
    expectFabCard(Iyslander, card).toBeIn("graveyard");
  });

  it("boundary: with no resources the cast is rejected", () => {
    const game = FabTestEngine.start(
      { hero: iyslander, hand: [card], resourcePoints: 0, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);

    expectFabUnplayable(() => Iyslander.play(card));
    expectFabPlayer(Iyslander).toHaveTokenCount("sigil-of-fate", 0);
  });

  it("timing: may be cast during the defender reaction window", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [brutalAssaultBlue], actionPoints: 1, deck: 6 },
      { hero: iyslander, hand: [card], resourcePoints: 1, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Iyslander = game.as(iyslander);

    Dash.playAttack(brutalAssaultBlue);
    game.toReaction("defender");
    Iyslander.play(card);
    game.untilIdle();

    expectFabPlayer(Iyslander).toHaveTokenCount("sigil-of-fate", count);
  });
});
