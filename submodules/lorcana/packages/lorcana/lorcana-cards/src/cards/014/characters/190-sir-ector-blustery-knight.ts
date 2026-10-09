import type { CharacterCard } from "@tcg/lorcana-types";
import { sirEctorBlusteryKnightI18n } from "./190-sir-ector-blustery-knight.i18n";

export const sirEctorBlusteryKnight: CharacterCard = {
  id: "LCo",
  canonicalId: "ci_LCo",
  slug: "lorcana-ci_LCo",
  printings: [
    {
      id: "set14-190",
      artId: "set14-190",
      setCode: "set14",
      collectorNumber: "190",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-190"],
  cardType: "character",
  name: "Sir Ector",
  version: "Blustery Knight",
  inkType: ["steel"],
  franchise: "Sword in the Stone",
  set: "014",
  cardNumber: 190,
  rarity: "uncommon",
  cost: 5,
  strength: 6,
  willpower: 4,
  lore: 2,
  inkable: true,
  text: [
    {
      title: "Well Deserved",
      description:
        "During your turn, whenever this character banishes another character in a challenge, draw a card.",
    },
  ],
  classifications: ["Storyborn", "Knight"],
  abilities: [
    {
      id: "sir-ector-1",
      name: "Well Deserved",
      type: "triggered",
      text: "Well Deserved During your turn, whenever this character banishes another character in a challenge, draw a card.",
      trigger: {
        event: "banish-in-challenge",
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
  i18n: sirEctorBlusteryKnightI18n,
};
