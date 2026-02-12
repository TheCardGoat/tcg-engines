import type { CharacterCard } from "@tcg/lorcana-types";

export const cogsworthIlluminaryWatchman: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "gain-keyword",
        keyword: "Rush",
        target: "SELF",
        duration: "this-turn",
      },
      id: "1n5-1",
      name: "TIME TO MOVE IT!",
      text: "TIME TO MOVE IT! When you play this character, chosen character gains Rush this turn.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 37,
  cardType: "character",
  classifications: ["Dreamborn", "Ally"],
  cost: 1,
  externalIds: {
    ravensburger: "d53b466012ff4e0996263ae54a024db42cbfed5b",
  },
  franchise: "Beauty and the Beast",
  fullName: "Cogsworth - Illuminary Watchman",
  id: "1n5",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Cogsworth",
  set: "005",
  strength: 1,
  text: "TIME TO MOVE IT! When you play this character, chosen character gains Rush this turn. (They can challenge the turn they're played.)",
  version: "Illuminary Watchman",
  willpower: 1,
};
