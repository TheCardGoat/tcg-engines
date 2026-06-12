import type { CharacterCard } from "@tcg/lorcana-types";
import { elsaIceArtisanI18n } from "./123-elsa-ice-artisan.i18n";

export const elsaIceArtisan: CharacterCard = {
  id: "TnE",
  canonicalId: "ci_8cv",
  reprints: ["set11-123"],
  cardType: "character",
  name: "Elsa",
  version: "Ice Artisan",
  inkType: ["ruby"],
  franchise: "Frozen",
  set: "011",
  cardNumber: 123,
  rarity: "legendary",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_b35b509f95d441c1bd11ec67d755db5d",
    tcgPlayer: 675515,
  },
  text: [
    {
      title: "Shift 4 {I}",
    },
    {
      title: "ENDLESS WINTER",
      description:
        "When you play this character and whenever you play a location, you may exert chosen character with 3 {S} or less.",
    },
    {
      title: "DISTANT CALL",
      description: "While this character is at a location, she gets +3 {L}.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Queen", "Sorcerer"],
  abilities: [
    {
      id: "vt4-1",
      cost: {
        ink: 4,
      },
      keyword: "Shift",
      type: "keyword",
      text: "Shift 4 {I}",
    },
    {
      id: "vt4-2",
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            cardTypes: ["character"],
            count: 1,
            filter: [
              {
                comparison: "less-or-equal",
                type: "strength-comparison",
                value: 3,
              },
            ],
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
          type: "exert",
        },
        type: "optional",
      },
      name: "ENDLESS WINTER",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
      text: "ENDLESS WINTER When you play this character and whenever you play a location, you may exert chosen character with 3 {S} or less.",
    },
    {
      id: "vt4-3",
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            cardTypes: ["character"],
            count: 1,
            filter: [
              {
                comparison: "less-or-equal",
                type: "strength-comparison",
                value: 3,
              },
            ],
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
          type: "exert",
        },
        type: "optional",
      },
      name: "ENDLESS WINTER",
      trigger: {
        event: "play",
        on: {
          cardType: "location",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
      text: "ENDLESS WINTER When you play this character and whenever you play a location, you may exert chosen character with 3 {S} or less.",
    },
    {
      id: "vt4-4",
      name: "DISTANT CALL",
      condition: {
        type: "at-location",
      },
      effect: {
        modifier: 3,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      type: "static",
      text: "DISTANT CALL While this character is at a location, she gets +3 {L}.",
    },
  ],
  i18n: elsaIceArtisanI18n,
};
