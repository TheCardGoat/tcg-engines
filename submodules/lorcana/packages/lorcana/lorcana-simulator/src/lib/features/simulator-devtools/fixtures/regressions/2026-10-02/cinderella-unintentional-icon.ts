import { createFixture } from "../../fixture-factory";
import {
  cinderellaHomespunDressmaker,
  cinderellaUnintentionalIcon,
} from "@tcg/lorcana-cards/cards/014";
import { mickeyMouseBraveLittleTailor } from "@tcg/lorcana-cards/cards/001";
import { pawpsicle } from "@tcg/lorcana-cards/cards/002";

/**
 * Player report 2026-10-02: "Cinderella - Unintentional Icon is not working".
 * Shift onto Cinderella - Homespun Dressmaker, pass the turn — BESPOKE DESIGN
 * should offer to look at the top 2 cards at end of turn.
 */
export const triageCinderellaUnintentionalIconFixture = createFixture({
  id: "triage-2026-10-02-cinderella-unintentional-icon",
  name: "Triage 2026-10-02 Cinderella - Unintentional Icon",
  description:
    "Shift Cinderella - Unintentional Icon onto Cinderella - Homespun Dressmaker, pass turn, resolve BESPOKE DESIGN.",
  skipPreGame: true,
  playerOne: {
    inkwell: 10,
    hand: [cinderellaUnintentionalIcon],
    play: [{ card: cinderellaHomespunDressmaker, isDrying: false }],
    deck: [pawpsicle, mickeyMouseBraveLittleTailor],
  },
  playerTwo: {
    inkwell: 5,
    hand: [],
    play: [],
    deck: [mickeyMouseBraveLittleTailor],
  },
});
