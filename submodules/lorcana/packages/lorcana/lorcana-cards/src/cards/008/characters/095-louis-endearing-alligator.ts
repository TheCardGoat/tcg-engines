import type { CharacterCard } from "@tcg/lorcana-types";
import { louisEndearingAlligatorI18n } from "./095-louis-endearing-alligator.i18n";

export const louisEndearingAlligator: CharacterCard = {
  id: "hTp",
  canonicalId: "ci_hTp",
  reprints: ["set8-095"],
  cardType: "character",
  name: "Louis",
  version: "Endearing Alligator",
  inkType: ["emerald"],
  franchise: "Princess and the Frog",
  set: "008",
  cardNumber: 95,
  rarity: "uncommon",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_fbddbf17f5824cb38bc0b35502f0d9a9",
    tcgPlayer: 631775,
  },
  text: [
    {
      title: "SENSITIVE SOUL",
      description: "This character enters play exerted.",
    },
    {
      title: "FRIENDLIER THAN HE LOOKS",
      description:
        "When you play this character, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        restriction: "enters-play-exerted",
        target: "SELF",
        type: "restriction",
      },
      id: "h6i-1",
      name: "SENSITIVE SOUL",
      text: "SENSITIVE SOUL This character enters play exerted.",
      type: "static",
    },
    {
      effect: {
        type: "optional",
        effect: {
          keyword: "Reckless",
          duration: "their-next-turn",
          target: {
            selector: "chosen",
            count: 1,
            owner: "opponent",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "gain-keyword",
        },
      },
      id: "h6i-2",
      name: "FRIENDLIER THAN HE LOOKS",
      text: "FRIENDLIER THAN HE LOOKS When you play this character, chosen opposing character gains Reckless during their next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: louisEndearingAlligatorI18n,
};
