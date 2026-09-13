import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../shared/test-recipients.ts";
import { sigilOfSolaceBlue, sigilOfSolaceRed, sigilOfSolaceYellow } from "./sigil-of-solace.ts";

const variants = [
  { label: "Sigil of Solace Red (WTR173)", card: sigilOfSolaceRed, lifeGain: 3 },
  { label: "Sigil of Solace Yellow (WTR174)", card: sigilOfSolaceYellow, lifeGain: 2 },
  { label: "Sigil of Solace Blue (KSU030)", card: sigilOfSolaceBlue, lifeGain: 1 },
] as const;

describe.each(variants)("$label family behavior AAA", ({ card, lifeGain }) => {
  it(`happy: controller gains ${lifeGain} life`, () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [card], life: 20, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(card);
    game.passBoth();

    expectFabPlayer(Briar).toHaveLife(20 + lifeGain);
    expectFabCard(Briar, card).toBeIn("graveyard");
  });

  it("boundary: only the controller gains life", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [card], life: 20, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.play(card);
    game.passBoth();

    expectFabPlayer(Briar).toHaveLife(20 + lifeGain);
    expectFabPlayer(Dash).toHaveLife(20);
  });
});
