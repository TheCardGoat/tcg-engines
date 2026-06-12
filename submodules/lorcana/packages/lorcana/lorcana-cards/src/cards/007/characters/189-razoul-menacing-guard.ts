import type { CharacterCard } from "@tcg/lorcana-types";
import { razoulMenacingGuardI18n } from "./189-razoul-menacing-guard.i18n";

export const razoulMenacingGuard: CharacterCard = {
  id: "ez3",
  canonicalId: "ci_ez3",
  reprints: ["set7-189"],
  cardType: "character",
  name: "Razoul",
  version: "Menacing Guard",
  inkType: ["steel"],
  franchise: "Aladdin",
  set: "007",
  cardNumber: 189,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_96a1de9a610e4a3e9dd061cc349d5870",
    tcgPlayer: 619516,
  },
  text: [
    {
      title: "MY ORDERS COME FROM JAFAR",
      description:
        "When you play this character, if you have a character named Jafar in play, you may banish chosen item.",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Captain"],
  abilities: [
    {
      condition: {
        controller: "you",
        name: "Jafar",
        type: "has-named-character",
      },
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["item"],
          },
          type: "banish",
        },
        type: "optional",
      },
      id: "1gi-1",
      name: "MY ORDERS COME FROM JAFAR",
      text: "MY ORDERS COME FROM JAFAR When you play this character, if you have a character named Jafar in play, you may banish chosen item.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: razoulMenacingGuardI18n,
};
