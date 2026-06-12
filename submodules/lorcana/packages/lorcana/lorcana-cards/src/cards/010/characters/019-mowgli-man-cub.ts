import type { CharacterCard } from "@tcg/lorcana-types";
import { mowgliManCubI18n } from "./019-mowgli-man-cub.i18n";

export const mowgliManCub: CharacterCard = {
  id: "65q",
  canonicalId: "ci_65q",
  reprints: ["set10-019"],
  cardType: "character",
  name: "Mowgli",
  version: "Man Cub",
  inkType: ["amber"],
  franchise: "Jungle Book",
  set: "010",
  cardNumber: 19,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_8cb497be95844e9ba41be7ed0e6aa2e2",
    tcgPlayer: 659761,
  },
  text: [
    {
      title: "HAVE A BETTER LOOK",
      description:
        "When you play this character, chosen opponent reveals their hand and discards a non-character card of their choice.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      id: "65q-1",
      type: "triggered",
      name: "HAVE A BETTER LOOK",
      text: "HAVE A BETTER LOOK When you play this character, chosen opponent reveals their hand and discards a non-character card of their choice.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "reveal-hand",
            target: "OPPONENT",
          },
          {
            type: "discard",
            amount: 1,
            target: "OPPONENT",
            from: "hand",
            chosen: true,
            chosenBy: "opponent",
            filter: {
              notCardType: "character",
            },
          },
        ],
      },
    },
  ],
  i18n: mowgliManCubI18n,
};
