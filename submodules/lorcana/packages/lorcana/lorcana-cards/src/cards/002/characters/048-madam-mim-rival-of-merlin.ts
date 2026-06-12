import type { CharacterCard } from "@tcg/lorcana-types";
import { madamMimRivalOfMerlinI18n } from "./048-madam-mim-rival-of-merlin.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const madamMimRivalOfMerlin: CharacterCard = {
  id: "ozR",
  canonicalId: "ci_RM2",
  reprints: ["set2-048"],
  cardType: "character",
  name: "Madam Mim",
  version: "Rival of Merlin",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "002",
  cardNumber: 48,
  rarity: "rare",
  cost: 5,
  strength: 2,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_06dda85b506e4a448ce0615f07758bfa",
    tcgPlayer: 527737,
  },
  text: [
    {
      title: "Shift 3",
    },
    {
      title: "GRUESOME AND GRIM",
      description:
        "{E} — Play a character with cost 4 or less for free. They gain Rush. At the end of the turn, banish them. (They can challenge the turn they're played.)",
    },
  ],
  classifications: ["Floodborn", "Villain", "Sorcerer"],
  abilities: [
    shift(3),
    {
      id: "dz2-2",
      name: "GRUESOME AND GRIM",
      type: "activated",
      cost: {
        exert: true,
      },
      effect: {
        type: "play-card",
        from: "hand",
        cardType: "character",
        cost: "free",
        filter: {
          maxCost: 4,
        },
        grantsRush: true,
        banishAtEndOfTurn: true,
      },
      text: "GRUESOME AND GRIM {E} — Play a character with cost 4 or less for free. They gain Rush. At the end of the turn, banish them.",
    },
  ],
  i18n: madamMimRivalOfMerlinI18n,
};
