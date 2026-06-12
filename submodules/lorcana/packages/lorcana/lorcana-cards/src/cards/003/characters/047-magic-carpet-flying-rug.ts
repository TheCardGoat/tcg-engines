import type { CharacterCard } from "@tcg/lorcana-types";
import { magicCarpetFlyingRugI18n } from "./047-magic-carpet-flying-rug.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const magicCarpetFlyingRug: CharacterCard = {
  id: "oLg",
  canonicalId: "ci_oLg",
  reprints: ["set3-047"],
  cardType: "character",
  name: "Magic Carpet",
  version: "Flying Rug",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "003",
  cardNumber: 47,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_308bd5ecd73f4d26af79fb786fab2eea",
    tcgPlayer: 539072,
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "FIND THE WAY",
      description: "{E} — Move a character of yours to a location for free.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    evasive,
    {
      id: "oLg-2",
      name: "FIND THE WAY",
      text: "FIND THE WAY {E} — Move a character of yours to a location for free.",
      type: "activated",
      cost: {
        exert: true,
      },
      effect: {
        type: "move-to-location",
        character: "CHOSEN_CHARACTER_OF_YOURS",
        location: {
          selector: "chosen",
          count: 1,
          owner: "you",
          zones: ["play"],
          cardTypes: ["location"],
        },
        cost: "free",
      },
    },
  ],
  i18n: magicCarpetFlyingRugI18n,
};
