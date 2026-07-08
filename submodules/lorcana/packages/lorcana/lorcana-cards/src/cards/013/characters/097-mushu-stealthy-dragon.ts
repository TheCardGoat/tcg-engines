import type { CharacterCard } from "@tcg/lorcana-types";
import { mushuStealthyDragonI18n } from "./097-mushu-stealthy-dragon.i18n";

import { evasive } from "../../../helpers/abilities/evasive";

export const mushuStealthyDragon: CharacterCard = {
  id: "Bqs",
  canonicalId: "ci_Bqs",
  slug: "lorcana-ci_Bqs",
  printings: [
    {
      id: "set13-097",
      artId: "set13-097",
      setCode: "set13",
      collectorNumber: "97",
      rarity: "legendary",
      imageUrl: "",
    },
  ],
  reprints: ["set13-097"],
  cardType: "character",
  name: "Mushu",
  version: "Stealthy Dragon",
  inkType: ["emerald"],
  franchise: "Mulan",
  set: "013",
  cardNumber: 97,
  rarity: "legendary",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "Evasive",
    },
    {
      title: "Tip the Scales",
      description:
        "Whenever this character quests, if an opponent has more cards in their hand than you, you may draw a card.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Dragon"],
  abilities: [
    evasive,
    {
      type: "triggered",
      name: "TIP THE SCALES",
      text: "TIP THE SCALES Whenever this character quests, if an opponent has more cards in their hand than you, you may draw a card.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      condition: {
        type: "comparison",
        left: {
          type: "cards-in-hand",
          controller: "opponent",
        },
        comparison: "greater",
        right: {
          type: "cards-in-hand",
          controller: "you",
        },
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
      },
    },
  ],
  i18n: mushuStealthyDragonI18n,
};
