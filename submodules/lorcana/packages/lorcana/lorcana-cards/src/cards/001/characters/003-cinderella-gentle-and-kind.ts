import type { CharacterCard } from "@tcg/lorcana-types";
import { cinderellaGentleAndKindI18n } from "./003-cinderella-gentle-and-kind.i18n";
import { singer } from "../../../helpers/abilities/singer";

export const cinderellaGentleAndKind: CharacterCard = {
  id: "jZv",
  canonicalId: "ci_Rrb",
  reprints: ["set1-003", "set9-019"],
  cardType: "character",
  name: "Cinderella",
  version: "Gentle and Kind",
  inkType: ["amber"],
  franchise: "Cinderella",
  set: "001",
  cardNumber: 3,
  rarity: "uncommon",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_0ae012bfcad54631949412a2947a8f7d",
    tcgPlayer: 649967,
  },
  text: [
    {
      title: "Singer 5",
    },
    {
      title: "A WONDERFUL DREAM",
      description: "{E} — Remove up to 3 damage from chosen Princess character.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    singer(5),
    {
      cost: {
        exert: true,
      },
      effect: {
        amount: { type: "up-to", value: 3 },
        target: {
          cardTypes: ["character"],
          count: 1,
          filter: [
            {
              type: "has-classification",
              classification: "Princess",
            },
          ],
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "remove-damage",
      },
      id: "14u-2",
      name: "A WONDERFUL DREAM",
      text: "A WONDERFUL DREAM {E} — Remove up to 3 damage from chosen Princess character.",
      type: "activated",
    },
  ],
  i18n: cinderellaGentleAndKindI18n,
};
