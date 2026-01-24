import type { CharacterCard } from "@tcg/lorcana-types";

export const peteGamesReferee: CharacterCard = {
  id: "1bd",
  cardType: "character",
  name: "Pete",
  version: "Games Referee",
  fullName: "Pete - Games Referee",
  inkType: ["steel"],
  set: "005",
  text: "BLOW THE WHISTLE When you play this character, opponents can't play actions until the start of your next turn.",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 195,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "aab48ef177d56da2e65eea439a8141af1e998b77",
  },
  abilities: [
    {
      id: "1bd-1",
      type: "triggered",
      name: "BLOW THE WHISTLE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "play-card",
        from: "hand",
      },
      text: "BLOW THE WHISTLE When you play this character, opponents can't play actions until the start of your next turn.",
    },
  ],
  classifications: ["Dreamborn", "Villain"],
};
