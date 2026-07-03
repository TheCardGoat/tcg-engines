import type { CharacterCard } from "@tcg/lorcana-types";
import { cinderellaMelodyWeaverEnchantedI18n } from "./205-cinderella-melody-weaver-enchanted.i18n";

import { singer } from "../../../helpers/abilities/singer";

export const cinderellaMelodyWeaverEnchanted: CharacterCard = {
  id: "N9b",
  canonicalId: "ci_rND",
  slug: "lorcana-ci_rND",
  printings: [
    {
      id: "set4-205-enchanted",
      artId: "ci_rND-enchanted",
      setCode: "set4",
      collectorNumber: "205",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set4-004"],
  cardType: "character",
  name: "Cinderella",
  version: "Melody Weaver",
  inkType: ["amber"],
  franchise: "Cinderella",
  set: "004",
  cardNumber: 205,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 5,
  strength: 1,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_eaf7db4a652b47939bddb0db4c9030e9",
    tcgPlayer: "550544",
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
  i18n: cinderellaMelodyWeaverEnchantedI18n,
};
