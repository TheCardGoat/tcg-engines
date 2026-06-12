import type { CharacterCard } from "@tcg/lorcana-types";
import { chiefBogoRespectedOfficerI18n } from "./175-chief-bogo-respected-officer.i18n";

export const chiefBogoRespectedOfficer: CharacterCard = {
  id: "mU4",
  canonicalId: "ci_mU4",
  reprints: ["set2-175"],
  cardType: "character",
  name: "Chief Bogo",
  version: "Respected Officer",
  inkType: ["steel"],
  franchise: "Zootropolis",
  set: "002",
  cardNumber: 175,
  rarity: "rare",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_2f24650e05da4e108e8988b03fb64a01",
    tcgPlayer: 526396,
  },
  text: [
    {
      title: "INSUBORDINATION!",
      description:
        "Whenever you play a Floodborn character, deal 1 damage to each opposing character.",
    },
  ],
  classifications: ["Dreamborn"],
  abilities: [
    {
      effect: {
        amount: 1,
        target: {
          cardTypes: ["character"],
          count: "all",
          owner: "opponent",
          selector: "all",
          zones: ["play"],
        },
        type: "deal-damage",
      },
      id: "1q6-1",
      name: "INSUBORDINATION!",
      text: "INSUBORDINATION! Whenever you play a Floodborn character, deal 1 damage to each opposing character.",
      trigger: {
        event: "play",
        on: {
          cardType: "character",
          classification: "Floodborn",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: chiefBogoRespectedOfficerI18n,
};
