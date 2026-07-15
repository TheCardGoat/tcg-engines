import { createFixture } from "./fixture-factory";
import { robinHoodSharpshooter } from "@tcg/lorcana-cards/cards/005";
import { visionOfTheFuture } from "@tcg/lorcana-cards/cards/005";
import {
  dragonFire,
  friendsOnTheOtherSide,
  reflection,
  hakunaMatata,
  mickeyMouseTrueFriend,
} from "@tcg/lorcana-cards/cards/001";
import { moanaDeterminedExplorer, merlinBackFromBermuda } from "@tcg/lorcana-cards/cards/005";

// Scenario: Robin Hood Sharpshooter quests → scry 4 → player picks Vision of the Future to play for free.
// VotF itself has a scry 5 effect → we want to observe whether VotF's pending scry appears.
export const scryPlayActionFixture = createFixture({
  id: "scry-play-action",
  name: "Scry → Play Action (Robin Hood + Vision of the Future)",
  description:
    "Robin Hood Sharpshooter quests, triggering Scry 4. Vision of the Future sits on top of the deck. " +
    "Play VotF for free via the scry destination, then observe whether VotF's own Scry 5 appears as a pending effect.",
  skipPreGame: true,
  playerOne: {
    inkwell: 10,
    hand: [],
    play: [robinHoodSharpshooter],
    // VotF on top, then 3 filler action cards to fill the scry-4 window
    deck: [visionOfTheFuture, dragonFire, reflection, hakunaMatata, friendsOnTheOtherSide],
  },
  playerTwo: {
    hand: [mickeyMouseTrueFriend],
    play: [moanaDeterminedExplorer, merlinBackFromBermuda],
    deck: 5,
  },
});
