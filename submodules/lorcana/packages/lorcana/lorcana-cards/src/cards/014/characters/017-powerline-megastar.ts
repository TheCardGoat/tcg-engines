import type { CharacterCard } from "@tcg/lorcana-types";
import { powerlineMegastarI18n } from "./017-powerline-megastar.i18n";
import { singer } from "../../../helpers/abilities/singer";

export const powerlineMegastar: CharacterCard = {
  id: "Vq1",
  canonicalId: "ci_Vq1",
  slug: "lorcana-ci_Vq1",
  printings: [
    {
      id: "set14-017",
      artId: "set14-017",
      setCode: "set14",
      collectorNumber: "17",
      rarity: "legendary",
      imageUrl: "",
    },
  ],
  reprints: ["set14-017"],
  cardType: "character",
  name: "Powerline",
  version: "Megastar",
  inkType: ["amber"],
  franchise: "Goofy Movie",
  set: "014",
  cardNumber: 17,
  rarity: "legendary",
  cost: 6,
  strength: 4,
  willpower: 6,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_15bf57ae3c7f4a5cafb9dcb0d8e08182",
  },
  text: [
    {
      title: "Singer 9",
    },
    {
      title: "BACKUP SINGERS",
      description:
        "Once during your turn, whenever you play a song, return a character card with Singer from your discard to your hand.",
    },
    {
      title: "PERFECT HARMONY",
      description:
        "This character gets +1 {L} for each other character with Singer you have in play.",
    },
  ],
  classifications: ["Storyborn"],
  abilities: [
    singer(9),
    {
      id: "Vq1-2",
      name: "BACKUP SINGERS",
      type: "triggered",
      text: "BACKUP SINGERS Once during your turn, whenever you play a song, return a character card with Singer from your discard to your hand.",
      trigger: {
        event: "play",
        on: {
          cardType: "song",
          controller: "you",
        },
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
          {
            type: "once-per-turn",
          },
        ],
        timing: "whenever",
      },
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "you",
          zones: ["discard"],
          cardType: "character",
          filters: [{ type: "has-keyword", keyword: "Singer" }],
        },
        comparison: { operator: "gte", value: 1 },
      },
      effect: {
        type: "return-to-hand",
        target: {
          selector: "chosen",
          count: 1,
          owner: "you",
          zones: ["discard"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-keyword",
              keyword: "Singer",
            },
          ],
        },
      },
    },
    {
      id: "Vq1-3",
      name: "PERFECT HARMONY",
      type: "static",
      text: "PERFECT HARMONY This character gets +1 {L} for each other character with Singer you have in play.",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: {
          type: "filtered-count",
          filters: [
            {
              type: "has-keyword",
              keyword: "Singer",
            },
          ],
          excludeSelf: true,
          owner: "you",
          zones: ["play"],
          cardType: "character",
        },
        target: "SELF",
      },
    },
  ],
  i18n: powerlineMegastarI18n,
};
