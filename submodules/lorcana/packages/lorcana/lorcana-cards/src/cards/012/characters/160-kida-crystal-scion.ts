import type { CharacterCard } from "@tcg/lorcana-types";
import { kidaCrystalScionI18n } from "./160-kida-crystal-scion.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const kidaCrystalScion: CharacterCard = {
  id: "21E",
  canonicalId: "ci_21E",
  reprints: ["set12-160"],
  cardType: "character",
  name: "Kida",
  version: "Crystal Scion",
  inkType: ["sapphire"],
  franchise: "Atlantis",
  set: "012",
  cardNumber: 160,
  rarity: "legendary",
  cost: 8,
  strength: 7,
  willpower: 7,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_9e3dda7a33de4861a5f81b5bea034db3",
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
  i18n: kidaCrystalScionI18n,
};
