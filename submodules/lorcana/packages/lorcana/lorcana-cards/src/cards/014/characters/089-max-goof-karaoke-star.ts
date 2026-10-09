import type { CharacterCard } from "@tcg/lorcana-types";
import { maxGoofKaraokeStarI18n } from "./089-max-goof-karaoke-star.i18n";

export const maxGoofKaraokeStar: CharacterCard = {
  id: "9qv",
  canonicalId: "ci_9qv",
  slug: "lorcana-ci_9qv",
  printings: [
    {
      id: "set14-089",
      artId: "set14-089",
      setCode: "set14",
      collectorNumber: "89",
      rarity: "legendary",
      imageUrl: "",
    },
  ],
  reprints: ["set14-089"],
  cardType: "character",
  name: "Max Goof",
  version: "Karaoke Star",
  inkType: ["emerald"],
  franchise: "Goofy Movie",
  set: "014",
  cardNumber: 89,
  rarity: "legendary",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_4dd1978db30c48c59bb51e42294a31ac",
  },
  text: [
    {
      title: "SWEET REMIX",
      description:
        "When you play this character, you may choose and discard a song card. If you do, draw 2 cards.",
    },
    {
      title: "BRAND-NEW PLAYLIST",
      description:
        "While you have 5 or more song cards in your discard, this character gets +3 {L}.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    {
      id: "9qv-1",
      name: "SWEET REMIX",
      type: "triggered",
      text: "SWEET REMIX When you play this character, you may choose and discard a song card. If you do, draw 2 cards.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "discard",
              amount: 1,
              chosen: true,
              from: "hand",
              target: "CONTROLLER",
              filter: { type: "is-song" },
            },
            {
              type: "conditional",
              condition: {
                type: "if-you-do",
              },
              then: {
                type: "draw",
                amount: 2,
                target: "CONTROLLER",
              },
            },
          ],
        },
      },
    },
    {
      id: "9qv-2",
      name: "BRAND-NEW PLAYLIST",
      type: "static",
      text: "BRAND-NEW PLAYLIST While you have 5 or more song cards in your discard, this character gets +3 {L}.",
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "you",
          zones: ["discard"],
          cardType: "action",
          filters: [
            {
              type: "is-song",
            },
          ],
        },
        comparison: {
          operator: "gte",
          value: 5,
        },
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 3,
        target: "SELF",
      },
    },
  ],
  i18n: maxGoofKaraokeStarI18n,
};
