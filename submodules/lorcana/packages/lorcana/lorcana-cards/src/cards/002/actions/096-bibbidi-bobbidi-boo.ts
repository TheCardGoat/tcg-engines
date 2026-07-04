import type { ActionCard } from "@tcg/lorcana-types";
import { bibbidiBobbidiBooI18n } from "./096-bibbidi-bobbidi-boo.i18n";

export const bibbidiBobbidiBoo: ActionCard = {
  id: "GrH",
  canonicalId: "ci_GrH",
  slug: "lorcana-ci_GrH",
  printings: [
    {
      id: "set2-096",
      artId: "set2-096",
      setCode: "set2",
      collectorNumber: "96",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set2-096"],
  cardType: "action",
  name: "Bibbidi Bobbidi Boo",
  inkType: ["emerald"],
  franchise: "Cinderella",
  set: "002",
  cardNumber: 96,
  rarity: "rare",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_5438ceaeaafb4d50a66613cc5df1ac84",
    tcgPlayer: "524184",
  },
  text: "Return chosen character of yours to your hand to play another character with the same cost or less for free.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "return-to-hand",
            target: {
              cardTypes: ["character"],
              count: 1,
              owner: "you",
              selector: "chosen",
              zones: ["play"],
            },
          },
          {
            type: "conditional",
            condition: {
              type: "if-you-do",
            },
            then: {
              type: "play-card",
              from: "hand",
              cardType: "character",
              cost: "free",
              filter: {
                maxCost: {
                  type: "chosen-card-cost",
                },
              },
            },
          },
        ],
      },
    },
  ],
  i18n: bibbidiBobbidiBooI18n,
};
