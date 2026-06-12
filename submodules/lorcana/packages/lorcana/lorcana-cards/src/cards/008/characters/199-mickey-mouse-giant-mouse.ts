import type { CharacterCard } from "@tcg/lorcana-types";
import { mickeyMouseGiantMouseI18n } from "./199-mickey-mouse-giant-mouse.i18n";
import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const mickeyMouseGiantMouse: CharacterCard = {
  id: "eAJ",
  canonicalId: "ci_eAJ",
  reprints: ["set8-199"],
  cardType: "character",
  name: "Mickey Mouse",
  version: "Giant Mouse",
  inkType: ["steel"],
  set: "008",
  cardNumber: 199,
  rarity: "legendary",
  cost: 10,
  strength: 10,
  willpower: 10,
  lore: 5,
  inkable: false,
  externalIds: {
    lorcast: "crd_475efa3afb754da4bba8e1d7104ebdf1",
    tcgPlayer: 631331,
  },
  text: [
    {
      title: "Bodyguard",
    },
    {
      title: "THE BIGGEST STAR EVER",
      description: "When this character is banished, deal 5 damage to each opposing character.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    bodyguard,
    {
      effect: {
        amount: 5,
        target: {
          cardTypes: ["character"],
          count: "all",
          owner: "opponent",
          selector: "all",
          zones: ["play"],
        },
        type: "deal-damage",
      },
      id: "17p-2",
      name: "THE BIGGEST STAR EVER",
      text: "THE BIGGEST STAR EVER When this character is banished, deal 5 damage to each opposing character.",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: mickeyMouseGiantMouseI18n,
};
