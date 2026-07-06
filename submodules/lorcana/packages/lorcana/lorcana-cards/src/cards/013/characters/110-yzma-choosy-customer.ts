import type { CharacterCard } from "@tcg/lorcana-types";
import { yzmaChoosyCustomerI18n } from "./110-yzma-choosy-customer.i18n";

export const yzmaChoosyCustomer: CharacterCard = {
  id: "Znx",
  canonicalId: "ci_Znx",
  slug: "lorcana-ci_Znx",
  printings: [
    {
      id: "set13-110",
      artId: "set13-110",
      setCode: "set13",
      collectorNumber: "110",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-110"],
  cardType: "character",
  name: "Yzma",
  version: "Choosy Customer",
  inkType: ["ruby"],
  franchise: "Emperors New Groove",
  set: "013",
  cardNumber: 110,
  rarity: "common",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 2,
  inkable: true,
  text: [
    {
      title: "Get This Right",
      description: "When you play this character, each opponent loses 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  abilities: [
    {
      type: "triggered",
      name: "GET THIS RIGHT",
      text: "GET THIS RIGHT When you play this character, each opponent loses 1 lore.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "lose-lore",
        amount: 1,
        target: "EACH_OPPONENT",
      },
    },
  ],
  i18n: yzmaChoosyCustomerI18n,
};
