import type { CharacterCard } from "@tcg/lorcana-types";
import { pleakleyScientificExpertI18n } from "./144-pleakley-scientific-expert.i18n";

export const pleakleyScientificExpert: CharacterCard = {
  id: "ron",
  canonicalId: "ci_ron",
  reprints: ["set6-144"],
  cardType: "character",
  name: "Pleakley",
  version: "Scientific Expert",
  inkType: ["sapphire"],
  franchise: "Lilo and Stitch",
  set: "006",
  cardNumber: 144,
  rarity: "uncommon",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_b513512cb8c04917ae7d0cbe7e1aa355",
    tcgPlayer: 588341,
  },
  text: [
    {
      title: "REPORTING FOR DUTY",
      description:
        "When you play this character, put chosen character of yours into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Alien"],
  abilities: [
    {
      effect: {
        exerted: true,
        facedown: true,
        source: "chosen-card-in-play",
        target: {
          selector: "chosen",
          count: 1,
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "put-into-inkwell",
      },
      id: "159-1",
      name: "REPORTING FOR DUTY",
      text: "REPORTING FOR DUTY When you play this character, put chosen character of yours into your inkwell facedown and exerted.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: pleakleyScientificExpertI18n,
};
