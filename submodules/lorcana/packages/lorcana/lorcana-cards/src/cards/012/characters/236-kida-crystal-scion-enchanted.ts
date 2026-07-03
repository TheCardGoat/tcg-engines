import type { CharacterCard } from "@tcg/lorcana-types";
import { kidaCrystalScionEnchantedI18n } from "./236-kida-crystal-scion-enchanted.i18n";

import { shift } from "../../../helpers/abilities/shift";

export const kidaCrystalScionEnchanted: CharacterCard = {
  id: "n0L",
  canonicalId: "ci_21E",
  slug: "lorcana-ci_21E",
  printings: [
    {
      id: "set12-236-enchanted",
      artId: "ci_21E-enchanted",
      setCode: "set12",
      collectorNumber: "236",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set12-160"],
  cardType: "character",
  name: "Kida",
  version: "Crystal Scion",
  inkType: ["sapphire"],
  franchise: "Atlantis",
  set: "012",
  cardNumber: 236,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 8,
  strength: 7,
  willpower: 7,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_8197b190acad44c7a28b50a83fb573f1",
    tcgPlayer: "692227",
  },
  text: [
    {
      title: "Shift 6 {I}",
    },
    {
      title: "FLOOD OF POWER",
      description:
        "When you play this character, each player may put up to 5 cards from their discard into their inkwell facedown and exerted.",
    },
    {
      title: "THE PATH REVEALED 7",
      description:
        "{I} — Look at the top 2 cards of your deck. Put one into your hand and the other on the bottom of your deck.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Princess"],
  abilities: [
    shift(6),
    {
      id: "21E-2",
      name: "FLOOD OF POWER",
      type: "triggered",
      text: "FLOOD OF POWER When you play this character, each player may put up to 5 cards from their discard into their inkwell facedown and exerted.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "put-into-inkwell",
        source: {
          selector: "chosen",
          count: {
            upTo: 5,
          },
          owner: "you",
          zones: ["discard"],
        },
        target: "CONTROLLER",
        chooser: "CONTROLLER",
        facedown: true,
        exerted: true,
      },
    },
    {
      id: "21E-2-opponent",
      name: "FLOOD OF POWER",
      type: "triggered",
      text: "FLOOD OF POWER When you play this character, each player may put up to 5 cards from their discard into their inkwell facedown and exerted.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "put-into-inkwell",
        source: {
          selector: "chosen",
          count: {
            upTo: 5,
          },
          owner: "opponent",
          zones: ["discard"],
        },
        target: "OPPONENT",
        chosenBy: "opponent",
        chooser: "OPPONENT",
        facedown: true,
        exerted: true,
      },
    },
    {
      id: "21E-3",
      name: "THE PATH REVEALED",
      type: "activated",
      text: "THE PATH REVEALED 7 {I} — Look at the top 2 cards of your deck. Put one into your hand and the other on the bottom of your deck.",
      cost: {
        ink: 7,
      },
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
  ],
  i18n: kidaCrystalScionEnchantedI18n,
};
