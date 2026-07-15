import type { CharacterCard } from "@tcg/lorcana-types";
import { olafHappyPassengerEnchantedI18n } from "./209-olaf-happy-passenger-enchanted.i18n";

import { evasive } from "../../../helpers/abilities/evasive";

export const olafHappyPassengerEnchanted: CharacterCard = {
  id: "tGR",
  canonicalId: "ci_8YL",
  slug: "lorcana-ci_8YL",
  printings: [
    {
      id: "set5-209-enchanted",
      artId: "ci_8YL-enchanted",
      setCode: "set5",
      collectorNumber: "209",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set5-050"],
  cardType: "character",
  name: "Olaf",
  version: "Happy Passenger",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "005",
  cardNumber: 209,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 9,
  strength: 6,
  willpower: 6,
  lore: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_19b1f802f23a4673aac60e04df0fb2ba",
    tcgPlayer: "561994",
  },
  text: [
    {
      title: "CLEAR THE PATH",
      description:
        "For each exerted character opponents have in play, you pay 1 {I} less to play this character.",
    },
    {
      title: "Evasive",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "trf-1",
      name: "CLEAR THE PATH",
      effect: {
        type: "cost-reduction",
        amount: {
          type: "filtered-count",
          owner: "opponent",
          zones: ["play"],
          cardType: "character",
          filters: [{ type: "exerted" }],
        },
      },
      sourceZones: ["hand"],
      type: "static",
      text: "CLEAR THE PATH For each exerted character opponents have in play, you pay 1 {I} less to play this character.",
    },
    evasive,
  ],
  i18n: olafHappyPassengerEnchantedI18n,
};
