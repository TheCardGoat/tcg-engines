import type { CharacterCard } from "@tcg/lorcana-types";
import { zipperAstuteDecoyI18n } from "./141-zipper-astute-decoy.i18n";
import { ward } from "../../../helpers/abilities/ward";

export const zipperAstuteDecoy: CharacterCard = {
  id: "aVD",
  canonicalId: "ci_aVD",
  reprints: ["set6-141"],
  cardType: "character",
  name: "Zipper",
  version: "Astute Decoy",
  inkType: ["sapphire"],
  franchise: "Rescue Rangers",
  set: "006",
  cardNumber: 141,
  rarity: "rare",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_975737e961724e1983ed15fa1f6fbb33",
    tcgPlayer: 588338,
  },
  text: [
    {
      title: "Ward",
    },
    {
      title: "RUN INTERFERENCE",
      description:
        "During your turn, whenever a card is put into your inkwell, another chosen character gains Resist +1 until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    ward,
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          keyword: "Resist",
          target: {
            cardTypes: ["character"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
            excludeSelf: true,
          },
          type: "gain-keyword",
          value: 1,
          duration: "until-start-of-next-turn",
        },
        type: "optional",
      },
      id: "n08-2",
      name: "RUN INTERFERENCE",
      text: "RUN INTERFERENCE During your turn, whenever a card is put into your inkwell, another chosen character gains Resist +1 until the start of your next turn.",
      trigger: {
        event: "ink",
        on: "CONTROLLER",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: zipperAstuteDecoyI18n,
};
