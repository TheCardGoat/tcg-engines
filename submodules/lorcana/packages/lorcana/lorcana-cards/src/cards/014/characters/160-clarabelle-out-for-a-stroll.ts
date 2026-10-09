import type { CharacterCard } from "@tcg/lorcana-types";
import { clarabelleOutForAStrollI18n } from "./160-clarabelle-out-for-a-stroll.i18n";

export const clarabelleOutForAStroll: CharacterCard = {
  id: "OBX",
  canonicalId: "ci_OBX",
  slug: "lorcana-ci_OBX",
  printings: [
    {
      id: "set14-160",
      artId: "set14-160",
      setCode: "set14",
      collectorNumber: "160",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-160"],
  cardType: "character",
  name: "Clarabelle",
  version: "Out for a Stroll",
  inkType: ["sapphire"],
  set: "014",
  cardNumber: 160,
  rarity: "uncommon",
  cost: 6,
  strength: 5,
  willpower: 7,
  lore: 2,
  inkable: true,
  text: [
    {
      title: "Improve the View",
      description:
        "When you play this character, you may banish chosen item. If you do, its player puts the top card of their deck into their inkwell facedown and exerted.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "clarabelle-1",
      name: "Improve the View",
      type: "triggered",
      text: "Improve the View When you play this character, you may banish chosen item. If you do, its player puts the top card of their deck into their inkwell facedown and exerted.",
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
              type: "select-target",
              target: {
                selector: "chosen",
                count: 1,
                owner: "any",
                zones: ["play"],
                cardTypes: ["item"],
              },
            },
            {
              type: "banish",
              target: { ref: "selected-first" } as never,
            },
            {
              type: "conditional",
              condition: {
                type: "if-you-do",
              },
              then: {
                type: "put-into-inkwell",
                source: "top-of-deck",
                target: { ref: "selected-first" } as never,
                exerted: true,
                facedown: true,
              },
            },
          ],
        },
      },
    },
  ],
  i18n: clarabelleOutForAStrollI18n,
};
