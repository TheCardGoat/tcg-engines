import type { CharacterCard } from "@tcg/lorcana-types";
import { aliceTeaAlchemistI18n } from "./035-alice-tea-alchemist.i18n";

export const aliceTeaAlchemist: CharacterCard = {
  id: "Vs7",
  canonicalId: "ci_Vs7",
  reprints: ["set3-035"],
  cardType: "character",
  name: "Alice",
  version: "Tea Alchemist",
  inkType: ["amethyst"],
  franchise: "Alice in Wonderland",
  set: "003",
  cardNumber: 35,
  rarity: "common",
  cost: 6,
  strength: 4,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_df136840866d426db031332e34942735",
    tcgPlayer: 538729,
  },
  text: [
    {
      title: "CURIOUSER AND CURIOUSER",
      description:
        "{E} — Exert chosen opposing character and all other opposing characters with the same name.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Sorcerer"],
  abilities: [
    {
      id: "Vs7-1",
      name: "CURIOUSER AND CURIOUSER",
      type: "activated",
      cost: {
        exert: true,
      },
      text: "CURIOUSER AND CURIOUSER {E} — Exert chosen opposing character and all other opposing characters with the same name.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "exert",
            target: "CHOSEN_OPPOSING_CHARACTER",
          },
          {
            type: "exert",
            target: {
              selector: "all",
              count: "all",
              owner: "opponent",
              zones: ["play"],
              cardTypes: ["character"],
              filter: {
                sameNameAsChosenCard: true,
                excludeChosenCard: true,
              },
            },
          },
        ],
      },
    },
  ],
  i18n: aliceTeaAlchemistI18n,
};
