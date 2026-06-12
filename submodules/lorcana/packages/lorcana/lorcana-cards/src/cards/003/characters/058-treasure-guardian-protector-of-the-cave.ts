import type { CharacterCard } from "@tcg/lorcana-types";
import { treasureGuardianProtectorOfTheCaveI18n } from "./058-treasure-guardian-protector-of-the-cave.i18n";

export const treasureGuardianProtectorOfTheCave: CharacterCard = {
  id: "gsz",
  canonicalId: "ci_gsz",
  reprints: ["set3-058"],
  cardType: "character",
  name: "Treasure Guardian",
  version: "Protector of the Cave",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "003",
  cardNumber: 58,
  rarity: "rare",
  cost: 4,
  strength: 6,
  willpower: 6,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_8b9133c809b04113a3b464d0f1c2ca82",
    tcgPlayer: 539077,
  },
  text: [
    {
      title: "WHO DISTURBS MY SLUMBER?",
      description: "This character can't challenge or quest unless it is at a location.",
    },
  ],
  classifications: ["Storyborn"],
  abilities: [
    {
      condition: {
        type: "not",
        condition: {
          type: "at-location",
        },
      },
      effect: {
        steps: [
          {
            restriction: "cant-challenge",
            target: "SELF",
            type: "restriction",
          },
          {
            restriction: "cant-quest",
            target: "SELF",
            type: "restriction",
          },
        ],
        type: "sequence",
      },
      id: "1bw-2",
      name: "WHO DISTURBS MY SLUMBER?",
      text: "WHO DISTURBS MY SLUMBER? This character can't challenge or quest unless it is at a location.",
      type: "static",
    },
  ],
  i18n: treasureGuardianProtectorOfTheCaveI18n,
};
