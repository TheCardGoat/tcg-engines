import type { CharacterCard } from "@tcg/lorcana-types";
import { johnSilverSternCaptainI18n } from "./194-john-silver-stern-captain.i18n";
import { shift } from "../../../helpers/abilities/shift";
import { resist } from "../../../helpers/abilities/resist";

export const johnSilverSternCaptain: CharacterCard = {
  id: "9kF",
  canonicalId: "ci_9kF",
  reprints: ["set6-194"],
  cardType: "character",
  name: "John Silver",
  version: "Stern Captain",
  inkType: ["steel"],
  franchise: "Treasure Planet",
  set: "006",
  cardNumber: 194,
  rarity: "legendary",
  cost: 8,
  strength: 6,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_10eefc9e8b2943c0a29f6e19a1c114a0",
    tcgPlayer: 588130,
  },
  text: [
    {
      title: "Shift 5",
    },
    {
      title: "Resist +2",
    },
    {
      title: "DON'T JUST SIT THERE!",
      description: "At the start of your turn, deal 1 damage to each opposing ready character.",
    },
  ],
  classifications: ["Floodborn", "Villain", "Alien", "Pirate", "Captain"],
  abilities: [
    shift(5),
    resist(2),
    {
      effect: {
        amount: 1,
        target: {
          cardTypes: ["character"],
          count: "all",
          owner: "opponent",
          selector: "all",
          zones: ["play"],
          filter: [
            {
              type: "ready",
            },
          ],
        },
        type: "deal-damage",
      },
      id: "19b-3",
      name: "DON'T JUST SIT THERE!",
      text: "DON'T JUST SIT THERE! At the start of your turn, deal 1 damage to each opposing ready character.",
      trigger: {
        event: "start-turn",
        on: "YOU",
        timing: "at",
      },
      type: "triggered",
    },
  ],
  i18n: johnSilverSternCaptainI18n,
};
