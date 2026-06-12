import type { CharacterCard } from "@tcg/lorcana-types";
import { shift } from "../../../helpers/abilities/shift";
import { balooCarefreeBearI18n } from "./085-baloo-carefree-bear.i18n";

export const balooCarefreeBear: CharacterCard = {
  id: "VNz",
  canonicalId: "ci_3I5",
  reprints: ["set10-085"],
  cardType: "character",
  name: "Baloo",
  version: "Carefree Bear",
  inkType: ["emerald"],
  franchise: "Jungle Book",
  set: "010",
  cardNumber: 85,
  rarity: "rare",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_9a1c82a2d3dd4ef898fb86f089242018",
    tcgPlayer: 659443,
  },
  text: [
    {
      title: "Shift 3 {I}",
    },
    {
      title: "ROLL WITH IT",
      description:
        "When you play this character, choose one:\n- Each player draws a card.\n- Each player chooses and discards a card.",
    },
  ],
  classifications: ["Floodborn", "Ally"],
  abilities: [
    shift(3),
    {
      id: "VNz-2",
      name: "ROLL WITH IT",
      text: "ROLL WITH IT When you play this character, choose one: Each player draws a card. Each player chooses and discards a card.",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "choice",
        optionLabels: ["Each player draws a card.", "Each player chooses and discards a card."],
        options: [
          {
            type: "draw",
            amount: 1,
            target: "EACH_PLAYER",
          },
          {
            type: "discard",
            from: "hand",
            amount: 1,
            chosen: true,
            target: "EACH_PLAYER",
          },
        ],
      },
    },
  ],
  i18n: balooCarefreeBearI18n,
};
