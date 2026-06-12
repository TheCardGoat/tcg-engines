import type { CharacterCard } from "@tcg/lorcana-types";
import { magicBroomDancingDusterI18n } from "./044-magic-broom-dancing-duster.i18n";

export const magicBroomDancingDuster: CharacterCard = {
  id: "hC1",
  canonicalId: "ci_hC1",
  reprints: ["set3-044"],
  cardType: "character",
  name: "Magic Broom",
  version: "Dancing Duster",
  inkType: ["amethyst"],
  franchise: "Fantasia",
  set: "003",
  cardNumber: 44,
  rarity: "uncommon",
  cost: 6,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_bf44f442286c4b5fa783412ae85c3b58",
    tcgPlayer: 539069,
  },
  text: [
    {
      title: "POWER CLEAN",
      description:
        "When you play this character, if you have a Sorcerer character in play, you may exert chosen opposing character. They can't ready at the start of their next turn.",
    },
  ],
  classifications: ["Dreamborn", "Broom"],
  abilities: [
    {
      id: "1k5-1",
      name: "POWER CLEAN",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      condition: {
        type: "has-character-with-classification",
        classification: "Sorcerer",
        controller: "you",
      },
      effect: {
        type: "optional",
        effect: {
          type: "sequence",
          effects: [
            {
              type: "exert",
              target: {
                selector: "chosen",
                count: 1,
                owner: "opponent",
                cardTypes: ["character"],
                zones: ["play"],
              },
            },
            {
              type: "restriction",
              restriction: "cant-ready",
              duration: "until-start-of-next-turn",
              target: {
                selector: "chosen",
                count: 1,
                owner: "opponent",
                cardTypes: ["character"],
                zones: ["play"],
              },
            },
          ],
        },
      },
      text: "POWER CLEAN When you play this character, if you have a Sorcerer character in play, you may exert chosen opposing character. They can't ready at the start of their next turn.",
    },
  ],
  i18n: magicBroomDancingDusterI18n,
};
