import type { CharacterCard } from "@tcg/lorcana-types";
import { rabbitHunnyPaladinI18n } from "./005-rabbit-hunny-paladin.i18n";

import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const rabbitHunnyPaladin: CharacterCard = {
  id: "6c3",
  canonicalId: "ci_6c3",
  slug: "lorcana-ci_6c3",
  printings: [
    {
      id: "set13-005",
      artId: "set13-005",
      setCode: "set13",
      collectorNumber: "5",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-005"],
  cardType: "character",
  name: "Rabbit",
  version: "Hunny Paladin",
  inkType: ["amber"],
  franchise: "Winnie the Pooh",
  set: "013",
  cardNumber: 5,
  rarity: "uncommon",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_5126c6bc9b4d4c669b7edf2f2ceb32ba",
  },
  text: [
    {
      title: "Bodyguard",
      description: "(This character may enter play exerted.",
    },
    {
      title:
        "An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
    },
    {
      title: "HUNNY AURA",
      description: "When you play this character,",
    },
    {
      title: "chosen Hunny character gets +1 {L} this turn.",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Knight", "Hunny"],
  abilities: [
    bodyguard,
    {
      type: "triggered",
      name: "HUNNY AURA",
      text: "HUNNY AURA When you play this character, chosen Hunny character gets +1 {L} this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        duration: "this-turn",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [{ type: "has-classification", classification: "Hunny" }],
        },
      },
    },
  ],
  i18n: rabbitHunnyPaladinI18n,
};
