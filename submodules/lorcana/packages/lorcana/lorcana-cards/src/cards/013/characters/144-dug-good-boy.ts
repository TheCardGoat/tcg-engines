import type { CharacterCard } from "@tcg/lorcana-types";
import { dugGoodBoyI18n } from "./144-dug-good-boy.i18n";

export const dugGoodBoy: CharacterCard = {
  id: "BnV",
  canonicalId: "ci_BnV",
  slug: "lorcana-ci_BnV",
  printings: [
    {
      id: "set13-144",
      artId: "set13-144",
      setCode: "set13",
      collectorNumber: "144",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-144"],
  cardType: "character",
  name: "Dug",
  version: "Good Boy",
  inkType: ["sapphire"],
  franchise: "Up",
  set: "013",
  cardNumber: 144,
  rarity: "uncommon",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "Fetch!",
      description: "When you play this character, if you have an item in play, draw a card.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      type: "triggered",
      name: "FETCH!",
      text: "FETCH! When you play this character, if you have an item in play, draw a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      condition: {
        type: "has-item-count",
        controller: "you",
        comparison: "greater-or-equal",
        count: 1,
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
    },
  ],
  i18n: dugGoodBoyI18n,
};
