import type { CharacterCard } from "@tcg/lorcana-types";
import { kakamoraLongrangeSpecialistI18n } from "./171-kakamora-long-range-specialist.i18n";

export const kakamoraLongrangeSpecialist: CharacterCard = {
  id: "8jt",
  canonicalId: "ci_8jt",
  reprints: ["set6-171"],
  cardType: "character",
  name: "Kakamora",
  version: "Long-Range Specialist",
  inkType: ["steel"],
  franchise: "Moana",
  set: "006",
  cardNumber: 171,
  rarity: "common",
  cost: 1,
  strength: 0,
  willpower: 2,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_6df56dd3dbb5471589800f12bba4eb46",
    tcgPlayer: 588366,
  },
  text: [
    {
      title: "A LITTLE HELP",
      description:
        "When you play this character, if you have another Pirate character in play, you may deal 1 damage to chosen character or location.",
    },
  ],
  classifications: ["Storyborn", "Pirate"],
  abilities: [
    {
      condition: {
        type: "has-another-character",
        classification: "Pirate",
      },
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character", "location"],
          },
          type: "deal-damage",
        },
        type: "optional",
      },
      id: "10z-1",
      name: "A LITTLE HELP",
      text: "A LITTLE HELP When you play this character, if you have another Pirate character in play, you may deal 1 damage to chosen character or location.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: kakamoraLongrangeSpecialistI18n,
};
