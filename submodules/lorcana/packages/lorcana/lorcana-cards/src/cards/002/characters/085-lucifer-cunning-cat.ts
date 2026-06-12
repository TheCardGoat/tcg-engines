import type { CharacterCard } from "@tcg/lorcana-types";
import { luciferCunningCatI18n } from "./085-lucifer-cunning-cat.i18n";

export const luciferCunningCat: CharacterCard = {
  id: "NN3",
  canonicalId: "ci_NN3",
  reprints: ["set2-085"],
  cardType: "character",
  name: "Lucifer",
  version: "Cunning Cat",
  inkType: ["emerald"],
  franchise: "Cinderella",
  set: "002",
  cardNumber: 85,
  rarity: "rare",
  cost: 5,
  strength: 2,
  willpower: 2,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_436427be3a944c3983c61f6038ef6ea6",
    tcgPlayer: 525103,
  },
  text: [
    {
      title: "MOUSE CATCHER",
      description:
        "When you play this character, each opponent chooses and discards either 2 cards or 1 action card.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "oq4-1",
      name: "MOUSE CATCHER",
      text: "MOUSE CATCHER When you play this character, each opponent chooses and discards either 2 cards or 1 action card.",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "choice",
        chooser: "OPPONENT",
        optionLabels: ["discard 2 cards", "discard 1 action card"],
        options: [
          {
            amount: 2,
            chosen: true,
            target: "OPPONENT",
            type: "discard",
          },
          {
            amount: 1,
            chosen: true,
            target: "OPPONENT",
            type: "discard",
            filter: {
              cardType: "action",
            },
          },
        ],
      },
    },
  ],
  i18n: luciferCunningCatI18n,
};
