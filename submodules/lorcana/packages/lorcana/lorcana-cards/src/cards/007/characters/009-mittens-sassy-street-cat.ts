import type { CharacterCard } from "@tcg/lorcana-types";
import { mittensSassyStreetCatI18n } from "./009-mittens-sassy-street-cat.i18n";
import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const mittensSassyStreetCat: CharacterCard = {
  id: "msV",
  canonicalId: "ci_msV",
  reprints: ["set7-009"],
  cardType: "character",
  name: "Mittens",
  version: "Sassy Street Cat",
  inkType: ["amber"],
  franchise: "Bolt",
  set: "007",
  cardNumber: 9,
  rarity: "rare",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_9b5d0e7c5c15447d9f17ea4419b07e3f",
    tcgPlayer: 618159,
  },
  text: [
    {
      title: "Bodyguard",
    },
    {
      title: "NO THANKS NECESSARY",
      description:
        "Once during your turn, whenever a card is put into your inkwell, your other characters with Bodyguard get +1 {L} this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    bodyguard,
    {
      effect: {
        duration: "this-turn",
        modifier: 1,
        stat: "lore",
        target: {
          count: "all",
          selector: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [{ type: "has-keyword", keyword: "Bodyguard" }],
          excludeSelf: true,
        },
        type: "modify-stat",
      },
      id: "et6-2",
      name: "NO THANKS NECESSARY",
      text: "NO THANKS NECESSARY Once during your turn, whenever a card is put into your inkwell, your other characters with Bodyguard get +1 {L} this turn.",
      trigger: {
        event: "ink",
        on: "CONTROLLER",
        timing: "whenever",
        restrictions: [{ type: "during-turn", whose: "your" }, { type: "once-per-turn" }],
      },
      type: "triggered",
    },
  ],
  i18n: mittensSassyStreetCatI18n,
};
