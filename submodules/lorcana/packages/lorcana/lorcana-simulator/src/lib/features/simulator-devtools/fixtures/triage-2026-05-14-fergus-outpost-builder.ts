import { mauiHeroToAll, mickeyMouseTrueFriend } from "@tcg/lorcana-cards/cards/001";
import {
  fergusOutpostBuilder,
  theIslandOfNomanisanSyndromesHeadquarters,
} from "@tcg/lorcana-cards/cards/012";
import { createFixture } from "./fixture-factory";

export const triage20260514FergusOutpostBuilderFixture = createFixture({
  id: "triage-2026-05-14-fergus-outpost-builder",
  name: "Triage 2026-05-14 - Fergus Outpost Builder HOLD FAST",
  description:
    "Visual repro for Fergus - Outpost Builder HOLD FAST bug. Fergus is placed at Island of Nomanisan. P2 challenges and banishes the location — Fergus's HOLD FAST ability should trigger and offer to deal 4 damage to a chosen character.",
  skipPreGame: true,
  playerOne: {
    inkwell: 2,
    hand: [],
    play: [
      theIslandOfNomanisanSyndromesHeadquarters,
      {
        card: fergusOutpostBuilder,
        isDrying: false,
        atLocation: theIslandOfNomanisanSyndromesHeadquarters,
      },
    ],
    deck: 10,
    lore: 0,
  },
  playerTwo: {
    hand: [],
    play: [
      { card: mauiHeroToAll, isDrying: false },
      { card: mickeyMouseTrueFriend, isDrying: false },
    ],
    deck: 10,
    lore: 0,
  },
  seed: "triage-2026-05-14-fergus-outpost-builder",
});
