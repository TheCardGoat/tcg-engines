import type { CharacterCard } from "@tcg/lorcana-types";
import { yamaNotoriousCriminalI18n } from "./107-yama-notorious-criminal.i18n";

export const yamaNotoriousCriminal: CharacterCard = {
  id: "CaX",
  canonicalId: "ci_CaX",
  slug: "lorcana-ci_CaX",
  printings: [
    {
      id: "set14-107",
      artId: "set14-107",
      setCode: "set14",
      collectorNumber: "107",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-107"],
  cardType: "character",
  name: "Yama",
  version: "Notorious Criminal",
  inkType: ["ruby"],
  franchise: "Big Hero 6",
  set: "014",
  cardNumber: 107,
  rarity: "uncommon",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 2,
  inkable: false,
  text: [
    {
      title: "Keep 'Em Coming",
      description:
        "6 {I} — Whenever one of your characters challenges another character this turn, get 1 ink drop. (You may remove an ink drop to pay 1 {I}.)",
    },
  ],
  classifications: ["Storyborn"],
  abilities: [
    {
      id: "CaX-1",
      name: "Keep 'Em Coming",
      type: "activated",
      text: "Keep 'Em Coming 6 {I} — Whenever one of your characters challenges another character this turn, get 1 ink drop. (You may remove an ink drop to pay 1 {I}.)",
      cost: { ink: 6 },
      effect: {
        type: "create-triggered-ability",
        lifecycle: { kind: "floating", duration: "this-turn" },
        ability: {
          name: "Keep 'Em Coming",
          trigger: {
            event: "challenge",
            on: "YOUR_CHARACTERS",
            timing: "whenever",
            restrictions: [{ type: "defender-is-character" }],
          },
          effect: {
            type: "gain-ink-drop",
            amount: 1,
            target: "CONTROLLER",
          },
        },
      },
    },
  ],
  i18n: yamaNotoriousCriminalI18n,
};
