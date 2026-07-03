import type { CharacterCard } from "@tcg/lorcana-types";
import { pachaPanickedCustomerI18n } from "./118-pacha-panicked-customer.i18n";

import { reckless } from "../../../helpers/abilities/reckless";

export const pachaPanickedCustomer: CharacterCard = {
  id: "b3s",
  canonicalId: "ci_b3s",
  slug: "lorcana-ci_b3s",
  printings: [
    {
      id: "set13-118",
      artId: "set13-118",
      setCode: "set13",
      collectorNumber: "118",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-118"],
  cardType: "character",
  name: "Pacha",
  version: "Panicked Customer",
  inkType: ["ruby"],
  franchise: "Emperors New Groove",
  set: "013",
  cardNumber: 118,
  rarity: "uncommon",
  cost: 4,
  strength: 2,
  willpower: 6,
  lore: 0,
  inkable: true,
  text: [
    {
      title: "<Reckless>",
    },
    {
      title: "Adrenaline Surge",
      description: "During your turn, this character gets +4 {S}.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    reckless,
    {
      id: "b3s-1",
      name: "Adrenaline Surge",
      text: "Adrenaline Surge During your turn, this character gets +4 {S}.",
      type: "static",
      condition: {
        type: "during-turn",
        whose: "your",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 4,
        target: "SELF",
      },
    },
  ],
  i18n: pachaPanickedCustomerI18n,
};
