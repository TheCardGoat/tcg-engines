import type { ActionCard } from "@tcg/lorcana-types";
import { shesYourPersonI18n } from "./040-shes-your-person.i18n";

export const shesYourPerson: ActionCard = {
  id: "znP",
  canonicalId: "ci_znP",
  reprints: ["set8-040"],
  cardType: "action",
  name: "She's Your Person",
  inkType: ["amber", "steel"],
  franchise: "Bolt",
  set: "008",
  cardNumber: 40,
  rarity: "uncommon",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_45f97fb5ff014a158519e81b63e644c5",
    tcgPlayer: 631378,
  },
  text: "Choose one:\n- Remove up to 3 damage from chosen character.\n- Remove up to 3 damage from each of your characters with Bodyguard.",
  abilities: [
    {
      type: "action",
      text: "Choose one:\n- Remove up to 3 damage from chosen character.\n- Remove up to 3 damage from each of your characters with Bodyguard.",
      effect: {
        type: "choice",
        options: [
          {
            type: "remove-damage",
            amount: { type: "up-to", value: 3 },
            target: "CHOSEN_CHARACTER",
          },
          {
            type: "remove-damage",
            amount: { type: "up-to", value: 3 },
            target: {
              selector: "all",
              count: "all",
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
              filter: [
                {
                  type: "has-keyword",
                  keyword: "Bodyguard",
                },
              ],
            },
          },
        ],
      },
    },
  ],
  i18n: shesYourPersonI18n,
};
