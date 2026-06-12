import type { CharacterCard } from "@tcg/lorcana-types";
import { namaariHeirOfFangI18n } from "./117-namaari-heir-of-fang.i18n";

export const namaariHeirOfFang: CharacterCard = {
  id: "BYL",
  canonicalId: "ci_BYL",
  reprints: ["set4-117"],
  cardType: "character",
  name: "Namaari",
  version: "Heir of Fang",
  inkType: ["ruby"],
  franchise: "Raya and the Last Dragon",
  set: "004",
  cardNumber: 117,
  rarity: "rare",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_5c2aaf063d1f46c89b17dae93940f47c",
    tcgPlayer: 549460,
  },
  text: [
    {
      title: "TWO-WEAPON FIGHTING",
      description:
        "During your turn, whenever this character deals damage to another character in a challenge, you may deal the same amount of damage to another chosen character.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Princess"],
  abilities: [
    {
      id: "BYL-1",
      name: "TWO-WEAPON FIGHTING",
      text: "TWO-WEAPON FIGHTING During your turn, whenever this character deals damage to another character in a challenge, you may deal the same amount of damage to another chosen character.",
      type: "triggered",
      trigger: {
        event: "deal-damage",
        on: "SELF",
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
          {
            type: "in-challenge",
          },
        ],
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "deal-damage",
          amount: {
            type: "trigger-amount",
          },
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
            excludeChallenger: true,
          },
        },
      },
    },
  ],
  i18n: namaariHeirOfFangI18n,
};
