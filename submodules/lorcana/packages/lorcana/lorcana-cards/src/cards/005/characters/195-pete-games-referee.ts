import type { CharacterCard } from "@tcg/lorcana-types";
import { peteGamesRefereeI18n } from "./195-pete-games-referee.i18n";

export const peteGamesReferee: CharacterCard = {
  id: "MzI",
  canonicalId: "ci_MzI",
  reprints: ["set5-195"],
  cardType: "character",
  name: "Pete",
  version: "Games Referee",
  inkType: ["steel"],
  set: "005",
  cardNumber: 195,
  rarity: "uncommon",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_d82108b67c434df495ba7ce11b811e79",
    tcgPlayer: 561975,
  },
  text: [
    {
      title: "BLOW THE WHISTLE",
      description:
        "When you play this character, opponents can't play actions until the start of your next turn.",
    },
  ],
  classifications: ["Dreamborn", "Villain"],
  abilities: [
    {
      effect: {
        type: "restriction",
        restriction: "cant-play-actions",
        target: "OPPONENTS",
        duration: "until-start-of-next-turn",
      },
      id: "1bd-1",
      name: "BLOW THE WHISTLE",
      text: "BLOW THE WHISTLE When you play this character, opponents can't play actions until the start of your next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: peteGamesRefereeI18n,
};
