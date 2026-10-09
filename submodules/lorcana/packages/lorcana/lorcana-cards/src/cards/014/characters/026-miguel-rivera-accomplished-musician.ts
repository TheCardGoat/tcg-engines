import type { CharacterCard } from "@tcg/lorcana-types";
import { miguelRiveraAccomplishedMusicianI18n } from "./026-miguel-rivera-accomplished-musician.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const miguelRiveraAccomplishedMusician: CharacterCard = {
  id: "47o",
  canonicalId: "ci_47o",
  slug: "lorcana-ci_47o",
  printings: [
    {
      id: "set14-026",
      artId: "set14-026",
      setCode: "set14",
      collectorNumber: "26",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-026"],
  cardType: "character",
  name: "Miguel Rivera",
  version: "Accomplished Musician",
  inkType: ["amber"],
  franchise: "Coco",
  set: "014",
  cardNumber: 26,
  rarity: "uncommon",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 1,
  inkable: false,
  text: [
    {
      title: "Shift 3 {I}",
    },
    {
      title: "Transcendent Performance",
      description:
        "When you play this character, return a character card from your discard to your hand.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    shift(3),
    {
      id: "47o-2",
      name: "Transcendent Performance",
      type: "triggered",
      text: "Transcendent Performance When you play this character, return a character card from your discard to your hand.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "return-to-hand",
        target: {
          selector: "chosen",
          count: 1,
          owner: "you",
          zones: ["discard"],
          cardTypes: ["character"],
        },
      },
    },
  ],
  i18n: miguelRiveraAccomplishedMusicianI18n,
};
