import type { CharacterCard } from "@tcg/lorcana-types";
import { maleficentDiabloEvilIncarnateI18n } from "./063-maleficent-diablo-evil-incarnate.i18n";

import { shift } from "../../../helpers/abilities/shift";

export const maleficentDiabloEvilIncarnate: CharacterCard = {
  id: "yFO",
  canonicalId: "ci_yFO",
  slug: "lorcana-ci_yFO",
  printings: [
    {
      id: "set13-063",
      artId: "set13-063",
      setCode: "set13",
      collectorNumber: "63",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set13-063"],
  cardType: "character",
  name: "Maleficent & Diablo",
  version: "Evil Incarnate",
  inkType: ["amethyst", "steel"],
  franchise: "Sleeping Beauty",
  set: "013",
  cardNumber: 63,
  rarity: "rare",
  cost: 7,
  strength: 6,
  willpower: 5,
  lore: 2,
  inkable: true,
  text: [
    {
      title: "Shift 5 {I}",
    },
    {
      title: "Fools!",
      description:
        "You may put 5 character cards from your discard on the bottom of your deck in any order to shift this character for free.",
    },
    {
      title: "Raven's Call",
      description: "During your turn, whenever this character exerts, draw a card.",
    },
  ],
  classifications: ["Storyborn", "Team", "Villain", "Sorcerer"],
  abilities: [
    shift("Maleficent or Diablo", 5),
    {
      type: "action",
      alternativeCost: "put-5-character-cards-on-deck-bottom-to-shift",
      name: "Fools!",
      text: "Fools! You may put 5 character cards from your discard on the bottom of your deck in any order to shift this character for free.",
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "put-on-bottom",
          target: {
            selector: "chosen",
            count: 5,
            owner: "you",
            zones: ["discard"],
            cardTypes: ["character"],
          },
        },
      },
    },
    {
      type: "triggered",
      name: "Raven's Call",
      text: "Raven's Call During your turn, whenever this character exerts, draw a card.",
      trigger: {
        event: "exert",
        on: "SELF",
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
    },
  ],
  i18n: maleficentDiabloEvilIncarnateI18n,
};
