import type { CharacterCard } from "@tcg/lorcana-types";
import { herculesBabyDemigodI18n } from "./086-hercules-baby-demigod.i18n";
import { ward } from "../../../helpers/abilities/ward";

export const herculesBabyDemigod: CharacterCard = {
  id: "7Td",
  canonicalId: "ci_7Td",
  reprints: ["set6-086"],
  cardType: "character",
  name: "Hercules",
  version: "Baby Demigod",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "006",
  cardNumber: 86,
  rarity: "legendary",
  cost: 6,
  strength: 6,
  willpower: 3,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_3463916fe4e54939a91ee57a62d50ba2",
    tcgPlayer: 588071,
  },
  text: [
    {
      title: "Ward",
    },
    {
      title: "STRONG LIKE HIS DAD 3",
      description: "{I} — Deal 1 damage to chosen damaged character.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
  abilities: [
    ward,
    {
      cost: {
        ink: 3,
      },
      effect: {
        amount: 1,
        target: "CHOSEN_DAMAGED_CHARACTER",
        type: "deal-damage",
      },
      id: "844-2",
      text: "STRONG LIKE HIS DAD 3 {I} - Deal 1 damage to chosen damaged character.",
      type: "activated",
    },
  ],
  i18n: herculesBabyDemigodI18n,
};
