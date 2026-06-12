import type { ItemCard } from "@tcg/lorcana-types";
import { emeraldChromiconI18n } from "./100-emerald-chromicon.i18n";

export const emeraldChromicon: ItemCard = {
  id: "TUy",
  canonicalId: "ci_TUy",
  reprints: ["set5-100"],
  cardType: "item",
  name: "Emerald Chromicon",
  inkType: ["emerald"],
  franchise: "Lorcana",
  set: "005",
  cardNumber: 100,
  rarity: "uncommon",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_693273eeac4846a39a3539fc6ded617d",
    tcgPlayer: 560098,
  },
  text: [
    {
      title: "EMERALD LIGHT",
      description:
        "During opponents' turns, whenever one of your characters is banished, you may return chosen character to their player's hand.",
    },
  ],
  abilities: [
    {
      id: "1sl-1",
      name: "EMERALD LIGHT",
      type: "triggered",
      trigger: {
        event: "banish",
        on: "YOUR_CHARACTERS",
        restrictions: [
          {
            type: "during-turn",
            whose: "opponent",
          },
        ],
        timing: "whenever",
      },
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "return-to-hand",
        },
        type: "optional",
      },
      text: "EMERALD LIGHT During opponents' turns, whenever one of your characters is banished, you may return chosen character to their player's hand.",
    },
  ],
  i18n: emeraldChromiconI18n,
};
