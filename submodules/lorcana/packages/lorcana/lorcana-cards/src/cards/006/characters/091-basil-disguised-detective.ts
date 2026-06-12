import type { CharacterCard } from "@tcg/lorcana-types";
import { basilDisguisedDetectiveI18n } from "./091-basil-disguised-detective.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const basilDisguisedDetective: CharacterCard = {
  id: "357",
  canonicalId: "ci_h57",
  reprints: ["set6-091"],
  cardType: "character",
  name: "Basil",
  version: "Disguised Detective",
  inkType: ["emerald"],
  franchise: "Great Mouse Detective",
  set: "006",
  cardNumber: 91,
  rarity: "uncommon",
  cost: 6,
  strength: 4,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_03fecbc6607a4948a586ccf4f0915c79",
    tcgPlayer: 591994,
  },
  text: [
    {
      title: "Shift 4",
    },
    {
      title: "TWISTS AND TURNS",
      description:
        "During your turn, whenever a card is put into your inkwell, you may pay 1 {I} to have chosen opponent choose and discard a card.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Detective"],
  abilities: [
    shift(4),
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "pay-cost",
          cost: {
            ink: 1,
          },
          effect: {
            type: "discard",
            from: "hand",
            amount: 1,
            chosen: true,
            chosenBy: "opponent",
            target: "OPPONENT",
          },
        },
        type: "optional",
      },
      id: "fop-2",
      name: "TWISTS AND TURNS",
      text: "TWISTS AND TURNS During your turn, whenever a card is put into your inkwell, you may pay 1 {I} to have chosen opponent choose and discard a card.",
      trigger: {
        event: "ink",
        on: "CONTROLLER",
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
      },
      type: "triggered",
    },
  ],
  i18n: basilDisguisedDetectiveI18n,
};
