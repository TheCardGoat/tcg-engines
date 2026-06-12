import type { CharacterCard } from "@tcg/lorcana-types";
import { miloThatchUndauntedScholarI18n } from "./145-milo-thatch-undaunted-scholar.i18n";

export const miloThatchUndauntedScholar: CharacterCard = {
  id: "eBp",
  canonicalId: "ci_eBp",
  reprints: ["set7-145"],
  cardType: "character",
  name: "Milo Thatch",
  version: "Undaunted Scholar",
  inkType: ["ruby"],
  franchise: "Atlantis",
  set: "007",
  cardNumber: 145,
  rarity: "rare",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_afc3f865b594418e86f60e638df7351b",
    tcgPlayer: 619489,
  },
  text: [
    {
      title: "I'M YOUR GUY",
      description: "Whenever you play an action, you may give chosen character +2 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          duration: "this-turn",
          modifier: 2,
          stat: "strength",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "modify-stat",
        },
        type: "optional",
      },
      id: "1ah-1",
      name: "I'M YOUR GUY",
      text: "I'M YOUR GUY Whenever you play an action, you may give chosen character +2 {S} this turn.",
      trigger: {
        event: "play",
        on: {
          cardType: "action",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: miloThatchUndauntedScholarI18n,
};
