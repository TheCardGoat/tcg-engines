import type { CharacterCard } from "@tcg/lorcana-types";
import { pigletCocoaMakerI18n } from "./147-piglet-cocoa-maker.i18n";

export const pigletCocoaMaker: CharacterCard = {
  id: "4rc",
  canonicalId: "ci_4rc",
  reprints: ["set11-147"],
  cardType: "character",
  name: "Piglet",
  version: "Cocoa Maker",
  inkType: ["sapphire"],
  franchise: "Winnie the Pooh",
  set: "011",
  cardNumber: 147,
  rarity: "rare",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_be96288326484fd880acd268246cc300",
    tcgPlayer: 673741,
  },
  text: [
    {
      title: "Shift 3 {I}",
    },
    {
      title: "SPECIAL RECIPE",
      description: "At the end of your turn, remove up to 2 damage from each of your characters.",
    },
  ],
  classifications: ["Floodborn", "Ally"],
  abilities: [
    {
      id: "1iy-1",
      cost: {
        ink: 3,
      },
      keyword: "Shift",
      type: "keyword",
      text: "Shift 3 {I}",
    },
    {
      id: "1iy-2",
      name: "SPECIAL RECIPE",
      effect: {
        amount: { type: "up-to", value: 2 },
        target: {
          cardTypes: ["character"],
          count: "all",
          owner: "you",
          selector: "all",
          zones: ["play"],
        },
        type: "remove-damage",
      },
      text: "SPECIAL RECIPE At the end of your turn, remove up to 2 damage from each of your characters.",
      trigger: {
        event: "end-turn",
        on: "YOU",
        timing: "at",
      },
      type: "triggered",
    },
  ],
  i18n: pigletCocoaMakerI18n,
};
