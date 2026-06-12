import type { ItemCard } from "@tcg/lorcana-types";
import { darkwingsChairSetI18n } from "./168-darkwings-chair-set.i18n";

export const darkwingsChairSet: ItemCard = {
  id: "TkX",
  canonicalId: "ci_TkX",
  reprints: ["set11-168"],
  cardType: "item",
  name: "Darkwing's Chair Set",
  inkType: ["sapphire"],
  franchise: "Darkwing Duck",
  set: "011",
  cardNumber: 168,
  rarity: "rare",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_2663ccb2084547c0a55220f63f46a36c",
    tcgPlayer: 676232,
  },
  text: [
    {
      title: "SECRET ENTRANCE",
      description:
        "When you play this item, you may put the top card of your deck into your inkwell facedown and exerted.",
    },
    {
      title: "SUDDEN SPIN",
      description:
        "{E}, Banish this item — Remove up to 2 damage from chosen character. If a character named Darkwing Duck is chosen, remove up to 4 damage instead.",
    },
  ],
  abilities: [
    {
      id: "1lr-1",
      effect: {
        chooser: "CONTROLLER",
        effect: {
          source: "top-of-deck",
          target: "CONTROLLER",
          type: "put-into-inkwell",
          exerted: true,
          facedown: true,
        },
        type: "optional",
      },
      name: "SECRET ENTRANCE",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
      text: "SECRET ENTRANCE When you play this item, you may put the top card of your deck into your inkwell facedown and exerted.",
    },
    {
      id: "1lr-2",
      name: "SUDDEN SPIN",
      type: "activated",
      cost: {
        exert: true,
        banishSelf: true,
      },
      effect: {
        amount: { type: "up-to", value: 2 },
        selfReplacement: {
          condition: {
            type: "selected-target-name",
            name: "Darkwing Duck",
          },
          value: 4,
        },
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "remove-damage",
      },
      text: "SUDDEN SPIN {E}, Banish this item — Remove up to 2 damage from chosen character. If a character named Darkwing Duck is chosen, remove up to 4 damage instead.",
    },
  ],
  i18n: darkwingsChairSetI18n,
};
