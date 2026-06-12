import type { CharacterCard } from "@tcg/lorcana-types";
import { flintheartGlomgoldLoneCheaterI18n } from "./140-flintheart-glomgold-lone-cheater.i18n";

export const flintheartGlomgoldLoneCheater: CharacterCard = {
  id: "BVy",
  canonicalId: "ci_BVy",
  reprints: ["set3-140"],
  cardType: "character",
  name: "Flintheart Glomgold",
  version: "Lone Cheater",
  inkType: ["sapphire"],
  franchise: "Ducktales",
  set: "003",
  cardNumber: 140,
  rarity: "uncommon",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_1121277f1b454321be2740185a61c1c7",
    tcgPlayer: 538237,
  },
  text: [
    {
      title: "THEY'LL NEVER SEE IT COMING!",
      description:
        "During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
    },
  ],
  classifications: ["Storyborn", "Villain"],
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
      id: "BVy-1",
      name: "THEY'LL NEVER SEE IT COMING!",
      text: "THEY'LL NEVER SEE IT COMING! During your turn, this character gains Evasive.",
      type: "static",
    },
  ],
  i18n: flintheartGlomgoldLoneCheaterI18n,
};
