import type { CharacterCard } from "@tcg/lorcana-types";
import { cinderellaMelodyWeaverI18n } from "./004-cinderella-melody-weaver.i18n";
import { singer } from "../../../helpers/abilities/singer";

export const cinderellaMelodyWeaver: CharacterCard = {
  id: "Qug",
  canonicalId: "ci_rND",
  reprints: ["set4-004"],
  cardType: "character",
  name: "Cinderella",
  version: "Melody Weaver",
  inkType: ["amber"],
  franchise: "Cinderella",
  set: "004",
  cardNumber: 4,
  rarity: "legendary",
  cost: 5,
  strength: 1,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_eaf7db4a652b47939bddb0db4c9030e9",
    tcgPlayer: 550544,
  },
  text: [
    {
      title: "Singer 9",
    },
    {
      title: "BEAUTIFUL VOICE",
      description:
        "Whenever this character sings a song, your other Princess characters get +1 {L} this turn.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess"],
  abilities: [
    singer(9),
    {
      effect: {
        duration: "this-turn",
        modifier: 1,
        stat: "lore",
        target: {
          count: "all",
          selector: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-classification",
              classification: "Princess",
            },
          ],
          excludeSelf: true,
        },
        type: "modify-stat",
      },
      id: "juj-2",
      name: "BEAUTIFUL VOICE",
      text: "BEAUTIFUL VOICE Whenever this character sings a song, your other Princess characters get +1 {L} this turn.",
      trigger: {
        event: "sing",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: cinderellaMelodyWeaverI18n,
};
