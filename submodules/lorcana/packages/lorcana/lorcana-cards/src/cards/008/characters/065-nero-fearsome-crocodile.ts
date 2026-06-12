import type { CharacterCard } from "@tcg/lorcana-types";
import { neroFearsomeCrocodileI18n } from "./065-nero-fearsome-crocodile.i18n";

export const neroFearsomeCrocodile: CharacterCard = {
  id: "hjp",
  canonicalId: "ci_hjp",
  reprints: ["set8-065"],
  cardType: "character",
  name: "Nero",
  version: "Fearsome Crocodile",
  inkType: ["amethyst"],
  franchise: "Rescuers",
  set: "008",
  cardNumber: 65,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_25752105ef234b63b373e43d61eaf48b",
    tcgPlayer: 633430,
  },
  text: [
    {
      title: "AND MEAN",
      description: "{E} — Move 1 damage counter from this character to chosen opposing character.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "hjp-1",
      name: "AND MEAN",
      text: "AND MEAN {E} — Move 1 damage counter from this character to chosen opposing character.",
      type: "activated",
      cost: {
        exert: true,
      },
      effect: {
        type: "move-damage",
        amount: 1,
        from: "SELF",
        to: "CHOSEN_OPPOSING_CHARACTER",
      },
    },
  ],
  i18n: neroFearsomeCrocodileI18n,
};
