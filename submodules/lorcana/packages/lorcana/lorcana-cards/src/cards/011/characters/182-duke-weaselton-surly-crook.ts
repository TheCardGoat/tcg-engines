import type { CharacterCard } from "@tcg/lorcana-types";
import { dukeWeaseltonSurlyCrookI18n } from "./182-duke-weaselton-surly-crook.i18n";

export const dukeWeaseltonSurlyCrook: CharacterCard = {
  id: "aK6",
  canonicalId: "ci_aK6",
  reprints: ["set11-182"],
  cardType: "character",
  name: "Duke Weaselton",
  version: "Surly Crook",
  inkType: ["steel"],
  franchise: "Zootropolis",
  set: "011",
  cardNumber: 182,
  rarity: "rare",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_d7aa2aa9bd12495096d00d33c6f09821",
    tcgPlayer: 676239,
  },
  text: [
    {
      title: "APPREHENDED",
      description:
        "When this character is banished, you may play a character with cost 2 or less for free.",
    },
  ],
  classifications: ["Storyborn"],
  abilities: [
    {
      id: "13a-1",
      effect: {
        chooser: "CONTROLLER",
        effect: {
          cardType: "character",
          cost: "free",
          costRestriction: {
            comparison: "less-or-equal",
            value: 2,
          },
          from: "hand",
          type: "play-card",
        },
        type: "optional",
      },
      name: "APPREHENDED",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
      text: "APPREHENDED When this character is banished, you may play a character with cost 2 or less for free.",
    },
  ],
  i18n: dukeWeaseltonSurlyCrookI18n,
};
