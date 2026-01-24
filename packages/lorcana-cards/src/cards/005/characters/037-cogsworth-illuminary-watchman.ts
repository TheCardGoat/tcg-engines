import type { CharacterCard } from "@tcg/lorcana-types";

export const cogsworthIlluminaryWatchman: CharacterCard = {
  id: "1n5",
  cardType: "character",
  name: "Cogsworth",
  version: "Illuminary Watchman",
  fullName: "Cogsworth - Illuminary Watchman",
  inkType: ["amethyst"],
  franchise: "Beauty and the Beast",
  set: "005",
  text: "TIME TO MOVE IT! When you play this character, chosen character gains Rush this turn. (They can challenge the turn they're played.)",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
  cardNumber: 37,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d53b466012ff4e0996263ae54a024db42cbfed5b",
  },
  abilities: [
    {
      id: "1n5-1",
      type: "triggered",
      name: "TIME TO MOVE IT!",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Rush",
        target: "SELF",
        duration: "this-turn",
      },
      text: "TIME TO MOVE IT! When you play this character, chosen character gains Rush this turn.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
};
