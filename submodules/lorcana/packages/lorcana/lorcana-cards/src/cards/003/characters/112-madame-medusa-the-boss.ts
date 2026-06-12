import type { CharacterCard } from "@tcg/lorcana-types";
import { madameMedusaTheBossI18n } from "./112-madame-medusa-the-boss.i18n";

export const madameMedusaTheBoss: CharacterCard = {
  id: "ktd",
  canonicalId: "ci_ktd",
  reprints: ["set3-112"],
  cardType: "character",
  name: "Madame Medusa",
  version: "The Boss",
  inkType: ["ruby"],
  franchise: "Rescuers",
  set: "003",
  cardNumber: 112,
  rarity: "common",
  cost: 6,
  strength: 4,
  willpower: 4,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_62c656f20cba4c43a1ed1f7ebc2ca720",
    tcgPlayer: 539089,
  },
  text: [
    {
      title: "THAT TERRIBLE WOMAN",
      description:
        "When you play this character, banish chosen opposing character with 3 {S} or less.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      effect: {
        target: {
          cardTypes: ["character"],
          count: 1,
          filter: [
            {
              comparison: "less-or-equal",
              type: "strength-comparison",
              value: 3,
            },
          ],
          owner: "opponent",
          selector: "chosen",
          zones: ["play"],
        },
        type: "banish",
      },
      id: "162-1",
      name: "THAT TERRIBLE WOMAN",
      text: "THAT TERRIBLE WOMAN When you play this character, banish chosen opposing character with 3 {S} or less.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: madameMedusaTheBossI18n,
};
