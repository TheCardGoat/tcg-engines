import type { CharacterCard } from "@tcg/lorcana-types";
import { flitReflectiveHummingbirdI18n } from "./039-flit-reflective-hummingbird.i18n";

export const flitReflectiveHummingbird: CharacterCard = {
  id: "lgw",
  canonicalId: "ci_lgw",
  reprints: ["set11-039"],
  cardType: "character",
  name: "Flit",
  version: "Reflective Hummingbird",
  inkType: ["amethyst"],
  franchise: "Pocahontas",
  set: "011",
  cardNumber: 39,
  rarity: "uncommon",
  cost: 1,
  strength: 0,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_fcdeeb8639c74831b6c234d81ad2f476",
    tcgPlayer: 674697,
  },
  text: [
    {
      title: "LOOK OUT!",
      description:
        "When you play this character, move up to 1 damage from chosen character to chosen opposing character.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "14k-1",
      name: "LOOK OUT!",
      text: "LOOK OUT! When you play this character, move up to 1 damage from chosen character to chosen opposing character.",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "move-damage",
          amount: { type: "up-to", value: 1 },
          from: "CHOSEN_CHARACTER",
          to: "CHOSEN_OPPOSING_CHARACTER",
        },
      },
    },
  ],
  i18n: flitReflectiveHummingbirdI18n,
};
