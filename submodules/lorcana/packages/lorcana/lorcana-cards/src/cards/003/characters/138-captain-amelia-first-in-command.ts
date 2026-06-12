import type { CharacterCard } from "@tcg/lorcana-types";
import { captainAmeliaFirstInCommandI18n } from "./138-captain-amelia-first-in-command.i18n";

export const captainAmeliaFirstInCommand: CharacterCard = {
  id: "TRx",
  canonicalId: "ci_TRx",
  reprints: ["set3-138"],
  cardType: "character",
  name: "Captain Amelia",
  version: "First in Command",
  inkType: ["sapphire"],
  franchise: "Treasure Planet",
  set: "003",
  cardNumber: 138,
  rarity: "common",
  cost: 3,
  strength: 1,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_9ada4799889b49d69ae388f141a0c52c",
    tcgPlayer: 539094,
  },
  text: [
    {
      title: "DISCIPLINE",
      description:
        "During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
    },
  ],
  classifications: ["Storyborn", "Alien", "Captain"],
  abilities: [
    {
      condition: {
        type: "turn",
        whose: "your",
      },
      effect: {
        keyword: "Evasive",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "1xb-1",
      name: "DISCIPLINE",
      text: "DISCIPLINE During your turn, this character gains Evasive.",
      type: "static",
    },
  ],
  i18n: captainAmeliaFirstInCommandI18n,
};
