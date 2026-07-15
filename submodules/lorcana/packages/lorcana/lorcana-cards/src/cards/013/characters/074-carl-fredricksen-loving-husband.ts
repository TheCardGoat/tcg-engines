import type { CharacterCard } from "@tcg/lorcana-types";
import { carlFredricksenLovingHusbandI18n } from "./074-carl-fredricksen-loving-husband.i18n";

export const carlFredricksenLovingHusband: CharacterCard = {
  id: "H16",
  canonicalId: "ci_H16",
  slug: "lorcana-ci_H16",
  printings: [
    {
      id: "set13-074",
      artId: "set13-074",
      setCode: "set13",
      collectorNumber: "74",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-074"],
  cardType: "character",
  name: "Carl Fredricksen",
  version: "Loving Husband",
  inkType: ["emerald"],
  franchise: "Up",
  set: "013",
  cardNumber: 74,
  rarity: "uncommon",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_5c8da2083bb14ef3b6b0536876a61a22",
  },
  text: [
    {
      title: "TAKE MY HAND",
      description:
        "When you play this character, you pay 2 {I} less for the next character named Ellie Fredricksen you play this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      id: "M1J-1",
      name: "TAKE MY HAND",
      type: "triggered",
      text: "TAKE MY HAND When you play this character, you pay 2 {I} less for the next character named Ellie Fredricksen you play this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "cost-reduction",
        amount: 2,
        cardType: "character",
        cardName: "Ellie Fredricksen",
        playMethod: "standard",
        duration: "next-play-this-turn",
      },
    },
  ],
  i18n: carlFredricksenLovingHusbandI18n,
};
