import type { ItemCard } from "@tcg/lorcana-types";
import { blessedBagpipesI18n } from "./101-blessed-bagpipes.i18n";

export const blessedBagpipes: ItemCard = {
  id: "Vui",
  canonicalId: "ci_Vui",
  reprints: ["set10-101"],
  cardType: "item",
  name: "Blessed Bagpipes",
  inkType: ["emerald"],
  franchise: "Ducktales",
  set: "010",
  cardNumber: 101,
  rarity: "uncommon",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_e3db74a687664c44971134d8a326fa68",
    tcgPlayer: 659598,
  },
  text: [
    {
      title: "MCDUCK HEIRLOOM",
      description:
        "When you play this item, you may put the top card of your deck facedown under one of your characters or locations with Boost.",
    },
    {
      title: "BATTLE ANTHEM",
      description:
        "Whenever one of your characters or locations with a card under them is challenged, gain 1 lore.",
    },
  ],
  abilities: [
    {
      id: "1s8-1",
      name: "MCDUCK HEIRLOOM",
      text: "MCDUCK HEIRLOOM When you play this item, you may put the top card of your deck facedown under one of your characters or locations with Boost.",
      effect: {
        chooser: "CONTROLLER",
        effect: {
          source: "top-of-deck",
          type: "put-under",
          under: {
            cardTypes: ["character", "location"],
            count: 1,
            owner: "you",
            selector: "chosen",
            zones: ["play"],
            filter: [
              {
                keyword: "Boost",
                type: "has-keyword",
              },
            ],
          },
        },
        type: "optional",
      },
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      id: "1s8-2",
      name: "BATTLE ANTHEM",
      text: "BATTLE ANTHEM Whenever one of your characters or locations with a card under them is challenged, gain 1 lore.",
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "gain-lore",
      },
      trigger: {
        event: "challenged",
        on: "YOUR_CHARACTERS_OR_LOCATIONS_WITH_CARD_UNDER",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: blessedBagpipesI18n,
};
