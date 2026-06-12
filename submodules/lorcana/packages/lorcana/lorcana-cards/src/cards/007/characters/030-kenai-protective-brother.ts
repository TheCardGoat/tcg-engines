import type { CharacterCard } from "@tcg/lorcana-types";
import { kenaiProtectiveBrotherI18n } from "./030-kenai-protective-brother.i18n";

export const kenaiProtectiveBrother: CharacterCard = {
  id: "k5M",
  canonicalId: "ci_k5M",
  reprints: ["set7-030"],
  cardType: "character",
  name: "Kenai",
  version: "Protective Brother",
  inkType: ["amber"],
  franchise: "Brother Bear",
  set: "007",
  cardNumber: 30,
  rarity: "rare",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_11827c57989a4d9c961b1c5b08c42945",
    tcgPlayer: 619423,
  },
  text: [
    {
      title: "HE NEEDS ME",
      description:
        "At the end of your turn, if this character is exerted, you may ready another chosen character of yours and remove all damage from them.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      condition: {
        type: "exerted",
      },
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: "all",
          target: {
            selector: "chosen",
            count: 1,
            owner: "you",
            zones: ["play"],
            cardTypes: ["character"],
            excludeSelf: true,
          },
          thenReady: true,
          type: "remove-damage",
        },
        type: "optional",
      },
      id: "eiu-1",
      name: "HE NEEDS ME",
      text: "HE NEEDS ME At the end of your turn, if this character is exerted, you may ready another chosen character of yours and remove all damage from them.",
      trigger: {
        event: "end-turn",
        on: "YOU",
        timing: "at",
      },
      type: "triggered",
    },
  ],
  i18n: kenaiProtectiveBrotherI18n,
};
