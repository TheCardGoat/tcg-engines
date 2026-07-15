import type { CharacterCard } from "@tcg/lorcana-types";
import { belleApprenticeInventorI18n } from "./159-belle-apprentice-inventor.i18n";

export const belleApprenticeInventor: CharacterCard = {
  id: "oP9",
  canonicalId: "ci_vbJ",
  slug: "lorcana-ci_vbJ",
  printings: [
    {
      id: "set7-159",
      artId: "set7-159",
      setCode: "set7",
      collectorNumber: "159",
      rarity: "common",
      imageUrl: "",
    },
  ],
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
    lorcast: "crd_fcb0a2f9a4044b86bba8e0ff3ade2988",
  },
  text: [
    {
      title: "WHAT",
      description:
        "A MESS During your turn, you may banish chosen item of yours to play this character for free.",
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
