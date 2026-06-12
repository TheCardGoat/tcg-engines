import type { CharacterCard } from "@tcg/lorcana-types";
import { thunderboltWonderDogI18n } from "./023-thunderbolt-wonder-dog.i18n";
import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const thunderboltWonderDog: CharacterCard = {
  id: "xjz",
  canonicalId: "ci_xjz",
  reprints: ["set7-023"],
  cardType: "character",
  name: "Thunderbolt",
  version: "Wonder Dog",
  inkType: ["amber", "sapphire"],
  franchise: "101 Dalmatians",
  set: "007",
  cardNumber: 23,
  rarity: "uncommon",
  cost: 5,
  strength: 3,
  willpower: 7,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_5a0a0d8b44824cf3b19fd61fc940df4a",
    tcgPlayer: 619418,
  },
  text: [
    {
      title: "Puppy Shift 3",
      description: "(You may pay 3 {I} to play this on top of one of your Puppy characters.)",
    },
    {
      title: "Bodyguard",
    },
  ],
  classifications: ["Floodborn", "Hero"],
  abilities: [
    {
      cost: {
        ink: 3,
      },
      id: "18d-1",
      keyword: "Shift",
      text: "Puppy Shift 3",
      type: "keyword",
    },
    bodyguard,
  ],
  i18n: thunderboltWonderDogI18n,
};
