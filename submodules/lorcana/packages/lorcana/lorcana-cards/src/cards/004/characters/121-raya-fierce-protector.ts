import type { CharacterCard } from "@tcg/lorcana-types";
import { rayaFierceProtectorI18n } from "./121-raya-fierce-protector.i18n";

export const rayaFierceProtector: CharacterCard = {
  id: "l0K",
  canonicalId: "ci_l0K",
  reprints: ["set4-121"],
  cardType: "character",
  name: "Raya",
  version: "Fierce Protector",
  inkType: ["ruby"],
  franchise: "Raya and the Last Dragon",
  set: "004",
  cardNumber: 121,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_e79d0ba09f4342b5a7a3ffe96ebef508",
    tcgPlayer: 550598,
  },
  text: [
    {
      title: "DON'T CROSS ME",
      description:
        "Whenever this character challenges another character, gain 1 lore for each other damaged character you have in play.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    {
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      id: "arj-1",
      name: "DON'T CROSS ME",
      text: "DON'T CROSS ME Whenever this character challenges another character, gain 1 lore for each other damaged character you have in play.",
      trigger: {
        event: "challenge",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: rayaFierceProtectorI18n,
};
