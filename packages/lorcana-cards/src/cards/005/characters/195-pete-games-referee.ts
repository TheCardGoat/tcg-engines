import type { CharacterCard } from "@tcg/lorcana-types";

export const peteGamesReferee: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "play-card",
        from: "hand",
      },
      id: "1bd-1",
      name: "BLOW THE WHISTLE",
      text: "BLOW THE WHISTLE When you play this character, opponents can't play actions until the start of your next turn.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 195,
  cardType: "character",
  classifications: ["Dreamborn", "Villain"],
  cost: 3,
  externalIds: {
    ravensburger: "aab48ef177d56da2e65eea439a8141af1e998b77",
  },
  fullName: "Pete - Games Referee",
  id: "1bd",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Pete",
  set: "005",
  strength: 3,
  text: "BLOW THE WHISTLE When you play this character, opponents can't play actions until the start of your next turn.",
  version: "Games Referee",
  willpower: 3,
};
