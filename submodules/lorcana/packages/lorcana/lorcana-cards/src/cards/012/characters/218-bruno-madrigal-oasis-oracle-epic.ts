import type { CharacterCard } from "@tcg/lorcana-types";
import { brunoMadrigalOasisOracleEpicI18n } from "./218-bruno-madrigal-oasis-oracle-epic.i18n";

export const brunoMadrigalOasisOracleEpic: CharacterCard = {
  id: "Fyk",
  canonicalId: "ci_6Lw",
  slug: "lorcana-ci_6Lw",
  printings: [
    {
      id: "set12-218-epic",
      artId: "ci_6Lw-epic",
      setCode: "set12",
      collectorNumber: "218",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set12-154"],
  cardType: "character",
  name: "Bruno Madrigal",
  version: "Oasis Oracle",
  inkType: ["sapphire"],
  franchise: "Encanto",
  set: "012",
  cardNumber: 218,
  rarity: "common",
  specialRarity: "epic",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_60e4bcd50631400eac4cf9544951e4ad",
    tcgPlayer: "692213",
  },
  text: [
    {
      title: "FIND THAT VISION",
      description:
        "Once during your turn, whenever you remove damage from one of your characters, you may look at the top 2 cards of your deck. Put one into your hand and the other on the bottom of your deck.",
    },
    {
      title: "YOU'LL BE OKAY",
      description:
        "Whenever this character quests, you may remove all damage from chosen character.",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Madrigal"],
  abilities: [
    {
      id: "6Lw-1",
      name: "FIND THAT VISION",
      type: "triggered",
      trigger: {
        event: "remove-damage",
        on: "YOUR_CHARACTERS",
        timing: "whenever",
        restrictions: [
          {
            type: "once-per-turn",
          },
          {
            type: "during-turn",
            whose: "your",
          },
        ],
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "scry",
          amount: 2,
          target: "CONTROLLER",
          destinations: [
            {
              zone: "hand",
              min: 1,
              max: 1,
            },
            {
              zone: "deck-bottom",
              remainder: true,
            },
          ],
        },
      },
      text: "FIND THAT VISION Once during your turn, whenever you remove damage from one of your characters, you may look at the top 2 cards of your deck. Put one into your hand and the other on the bottom of your deck.",
    },
    {
      id: "6Lw-2",
      name: "YOU'LL BE OKAY",
      type: "triggered",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "remove-damage",
          amount: "all",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
      },
      text: "YOU'LL BE OKAY Whenever this character quests, you may remove all damage from chosen character.",
    },
  ],
  i18n: brunoMadrigalOasisOracleEpicI18n,
};
