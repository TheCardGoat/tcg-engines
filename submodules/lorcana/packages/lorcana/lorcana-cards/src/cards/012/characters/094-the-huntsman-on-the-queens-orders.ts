import type { CharacterCard } from "@tcg/lorcana-types";
import { theHuntsmanOnTheQueensOrdersI18n } from "./094-the-huntsman-on-the-queens-orders.i18n";
import { ward } from "../../../helpers/abilities/ward";

export const theHuntsmanOnTheQueensOrders: CharacterCard = {
  id: "xq2",
  canonicalId: "ci_xq2",
  reprints: ["set12-094"],
  cardType: "character",
  name: "The Huntsman",
  version: "On the Queen's Orders",
  inkType: ["emerald"],
  franchise: "Snow White",
  set: "012",
  cardNumber: 94,
  rarity: "uncommon",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_b3558cc6e55c47c6823f2324e28b0397",
  },
  text: "<Ward>",
  classifications: ["Storyborn", "Ally"],
  abilities: [ward],
  i18n: theHuntsmanOnTheQueensOrdersI18n,
};
