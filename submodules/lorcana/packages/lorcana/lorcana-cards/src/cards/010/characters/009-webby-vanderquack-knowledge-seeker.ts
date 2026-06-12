import type { CharacterCard } from "@tcg/lorcana-types";
import { webbyVanderquackKnowledgeSeekerI18n } from "./009-webby-vanderquack-knowledge-seeker.i18n";

export const webbyVanderquackKnowledgeSeeker: CharacterCard = {
  id: "uBf",
  canonicalId: "ci_uBf",
  reprints: ["set10-009"],
  cardType: "character",
  name: "Webby Vanderquack",
  version: "Knowledge Seeker",
  inkType: ["amber"],
  franchise: "Ducktales",
  set: "010",
  cardNumber: 9,
  rarity: "uncommon",
  cost: 3,
  strength: 1,
  willpower: 6,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_5608e887343c4adbadaacf7ba7379ff0",
    tcgPlayer: 659445,
  },
  text: [
    {
      title: "I'VE READ ABOUT THIS",
      description:
        "While you have a character or location in play with a card under them, this character gets +1 {L}.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      condition: {
        comparison: {
          operator: "gte",
          value: 1,
        },
        query: {
          filters: [
            {
              comparison: "gte",
              type: "cards-under",
              value: 1,
            },
          ],
          owner: "you",
          selector: "all",
          zones: ["play"],
        },
        type: "target-query",
      },
      effect: {
        modifier: 1,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "15d-1",
      name: "I'VE READ ABOUT THIS",
      text: "I'VE READ ABOUT THIS While you have a character or location in play with a card under them, this character gets +1 {L}.",
      type: "static",
    },
  ],
  i18n: webbyVanderquackKnowledgeSeekerI18n,
};
