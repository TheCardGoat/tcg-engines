import type { CharacterCard } from "@tcg/lorcana-types";
import { bagheeraGuardianJaguarI18n } from "./198-bagheera-guardian-jaguar.i18n";
import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const bagheeraGuardianJaguar: CharacterCard = {
  id: "n5M",
  canonicalId: "ci_n5M",
  reprints: ["set7-198"],
  cardType: "character",
  name: "Bagheera",
  version: "Guardian Jaguar",
  inkType: ["steel"],
  franchise: "Jungle Book",
  set: "007",
  cardNumber: 198,
  rarity: "legendary",
  cost: 5,
  strength: 4,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_cb99ab75225f41d49a1a33be32c8a170",
    tcgPlayer: 619522,
  },
  text: [
    {
      title: "Bodyguard",
    },
    {
      title: "YOU MUST BE BRAVE",
      description:
        "When this character is banished during an opponent's turn, deal 2 damage to each opposing character.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    bodyguard,
    {
      effect: {
        amount: 2,
        target: {
          cardTypes: ["character"],
          count: "all",
          owner: "opponent",
          selector: "all",
          zones: ["play"],
        },
        type: "deal-damage",
      },
      id: "132-2",
      name: "YOU MUST BE BRAVE",
      text: "YOU MUST BE BRAVE When this character is banished during an opponent's turn, deal 2 damage to each opposing character.",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
        restrictions: [
          {
            type: "during-turn",
            whose: "opponent",
          },
        ],
      },
      type: "triggered",
    },
  ],
  i18n: bagheeraGuardianJaguarI18n,
};
