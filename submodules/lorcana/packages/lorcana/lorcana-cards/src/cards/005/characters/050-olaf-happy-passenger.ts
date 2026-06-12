import type { CharacterCard } from "@tcg/lorcana-types";
import { olafHappyPassengerI18n } from "./050-olaf-happy-passenger.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const olafHappyPassenger: CharacterCard = {
  id: "MEQ",
  canonicalId: "ci_8YL",
  reprints: ["set5-050"],
  cardType: "character",
  name: "Olaf",
  version: "Happy Passenger",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "005",
  cardNumber: 50,
  rarity: "rare",
  cost: 9,
  strength: 6,
  willpower: 6,
  lore: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_19b1f802f23a4673aac60e04df0fb2ba",
    tcgPlayer: 561994,
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
  i18n: olafHappyPassengerI18n,
};
