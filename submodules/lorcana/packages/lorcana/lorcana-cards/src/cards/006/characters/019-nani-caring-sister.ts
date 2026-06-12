import type { CharacterCard } from "@tcg/lorcana-types";
import { naniCaringSisterI18n } from "./019-nani-caring-sister.i18n";
import { support } from "../../../helpers/abilities/support";

export const naniCaringSister: CharacterCard = {
  id: "eOi",
  canonicalId: "ci_eOi",
  reprints: ["set6-019"],
  cardType: "character",
  name: "Nani",
  version: "Caring Sister",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "006",
  cardNumber: 19,
  rarity: "rare",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_43a7721fdfb145f8a5216c85da2c77ec",
    tcgPlayer: 592005,
  },
  text: [
    {
      title: "Support",
    },
    {
      title: "I AM SO SORRY 2",
      description: "{I} — Chosen character gets -1 {S} until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    support,
    {
      cost: {
        ink: 2,
      },
      effect: {
        modifier: -1,
        stat: "strength",
        duration: "until-start-of-next-turn",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "modify-stat",
      },
      id: "1fu-2",
      name: "I AM SO SORRY 2",
      text: "I AM SO SORRY 2 {I} - Chosen character gets -1 {S} until the start of your next turn.",
      type: "activated",
    },
  ],
  i18n: naniCaringSisterI18n,
};
