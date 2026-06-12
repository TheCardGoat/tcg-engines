import type { CharacterCard } from "@tcg/lorcana-types";
import { belleApprenticeInventorI18n } from "./159-belle-apprentice-inventor.i18n";

export const belleApprenticeInventor: CharacterCard = {
  id: "hVz",
  canonicalId: "ci_hVz",
  reprints: ["set7-159"],
  cardType: "character",
  name: "Belle",
  version: "Apprentice Inventor",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "007",
  cardNumber: 159,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_13859ddeec154d23a532a94835179144",
    tcgPlayer: 619497,
  },
  text: [
    {
      title: "WHAT A MESS",
      description:
        "During your turn, you may banish chosen item of yours to play this character for free.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess", "Inventor"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "you",
            zones: ["play"],
            cardTypes: ["item"],
          },
          type: "banish",
        },
        type: "optional",
      },
      alternativeCost: "sacrifice-item",
      id: "sb6-1",
      name: "WHAT A MESS",
      text: "WHAT A MESS During your turn, you may banish chosen item of yours to play this character for free.",
      type: "action",
    },
  ],
  i18n: belleApprenticeInventorI18n,
};
