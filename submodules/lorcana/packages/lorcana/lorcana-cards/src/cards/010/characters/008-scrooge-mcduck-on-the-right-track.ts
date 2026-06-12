import type { CharacterCard } from "@tcg/lorcana-types";
import { scroogeMcduckOnTheRightTrackI18n } from "./008-scrooge-mcduck-on-the-right-track.i18n";

export const scroogeMcduckOnTheRightTrack: CharacterCard = {
  id: "NQo",
  canonicalId: "ci_NQo",
  reprints: ["set10-008"],
  cardType: "character",
  name: "Scrooge McDuck",
  version: "On the Right Track",
  inkType: ["amber"],
  franchise: "Ducktales",
  set: "010",
  cardNumber: 8,
  rarity: "uncommon",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_c44b5e749e584c13a821007c6dce1cec",
    tcgPlayer: 660032,
  },
  text: [
    {
      title: "FABULOUS WEALTH",
      description:
        "When you play this character, chosen character with a card under them gets +1 {L} this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          duration: "this-turn",
          modifier: 1,
          stat: "lore",
          target: {
            cardTypes: ["character"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
            filter: [{ type: "cards-under", comparison: "greater-or-equal", value: 1 }],
          },
          type: "modify-stat",
        },
      },
      id: "ut8-1",
      name: "FABULOUS WEALTH",
      text: "FABULOUS WEALTH When you play this character, chosen character with a card under them gets +1 {L} this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: scroogeMcduckOnTheRightTrackI18n,
};
