import type { CharacterCard } from "@tcg/lorcana-types";
import { boost } from "../../../helpers/abilities/boost";
import { cheshireCatInexplicableI18n } from "./060-cheshire-cat-inexplicable.i18n";

export const cheshireCatInexplicable: CharacterCard = {
  id: "akT",
  canonicalId: "ci_akT",
  reprints: ["set10-060"],
  cardType: "character",
  name: "Cheshire Cat",
  version: "Inexplicable",
  inkType: ["amethyst"],
  franchise: "Alice in Wonderland",
  set: "010",
  cardNumber: 60,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_19c39ba1fb674390bbb747f8cdcaa9c3",
    tcgPlayer: 659412,
  },
  text: [
    {
      title: "Boost 2 {I}",
    },
    {
      title: "IT'S LOADS OF FUN",
      description:
        "Whenever you put a card under this character, you may move up to 2 damage counters from chosen character to chosen opposing character.",
    },
  ],
  classifications: ["Storyborn", "Whisper"],
  abilities: [
    boost(2),
    {
      id: "akT-2",
      name: "IT'S LOADS OF FUN",
      text: "IT'S LOADS OF FUN Whenever you put a card under this character, you may move up to 2 damage counters from chosen character to chosen opposing character.",
      type: "triggered",
      trigger: {
        event: "put-card-under",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "optional",
        effect: {
          type: "move-damage",
          amount: { type: "up-to", value: 2 },
          from: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          to: {
            selector: "chosen",
            count: 1,
            owner: "opponent",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
      },
    },
  ],
  i18n: cheshireCatInexplicableI18n,
};
