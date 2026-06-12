import type { CharacterCard } from "@tcg/lorcana-types";
import { wreckitRalphAdmiralUnderpantsI18n } from "./021-wreck-it-ralph-admiral-underpants.i18n";

export const wreckitRalphAdmiralUnderpants: CharacterCard = {
  id: "rui",
  canonicalId: "ci_rui",
  reprints: ["set5-021"],
  cardType: "character",
  name: "Wreck-It Ralph",
  version: "Admiral Underpants",
  inkType: ["amber"],
  franchise: "Wreck It Ralph",
  set: "005",
  cardNumber: 21,
  rarity: "rare",
  cost: 7,
  strength: 6,
  willpower: 7,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_4bb6eeb124574cc6ac3695e255598cfb",
    tcgPlayer: 559783,
  },
  text: [
    {
      title: "I'VE GOT THE COOLEST FRIEND",
      description:
        "When you play this character, return a character card from your discard to your hand. If that card is a Princess character card, gain 2 lore.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      effect: {
        type: "sequence",
        steps: [
          {
            type: "return-from-discard",
            cardType: "character",
            target: "CONTROLLER",
          },
          {
            type: "conditional",
            condition: {
              type: "returned-card-is-princess",
            },
            then: {
              amount: 2,
              type: "gain-lore",
            },
          },
        ],
      },
      id: "rui-1",
      name: "I'VE GOT THE COOLEST FRIEND",
      text: "I'VE GOT THE COOLEST FRIEND When you play this character, return a character card from your discard to your hand. If that card is a Princess character card, gain 2 lore.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: wreckitRalphAdmiralUnderpantsI18n,
};
