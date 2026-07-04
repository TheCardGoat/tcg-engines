import type { CharacterCard } from "@tcg/lorcana-types";
import { yenSidPowerfulSorcererEpicI18n } from "./223-yen-sid-powerful-sorcerer-epic.i18n";

export const yenSidPowerfulSorcererEpic: CharacterCard = {
  id: "bnE",
  canonicalId: "ci_iNw",
  slug: "lorcana-ci_iNw",
  printings: [
    {
      id: "set4-223-epic",
      artId: "ci_iNw-epic",
      setCode: "set4",
      collectorNumber: "223",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set4-059"],
  cardType: "character",
  name: "Yen Sid",
  version: "Powerful Sorcerer",
  inkType: ["amethyst"],
  franchise: "Fantasia",
  set: "004",
  cardNumber: 223,
  rarity: "legendary",
  specialRarity: "epic",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_86d6559da2404639813a26adaa8ccedf",
    tcgPlayer: "544492",
  },
  text: [
    {
      title: "TIMELY INTERVENTION",
      description:
        "When you play this character, if you have a character named Magic Broom in play, you may draw a card.",
    },
    {
      title: "ARCANE STUDY",
      description: "While you have 2 or more Broom characters in play, this character gets +2 {L}.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Sorcerer"],
  abilities: [
    {
      condition: {
        controller: "you",
        name: "Magic Broom",
        type: "has-named-character",
      },
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      id: "7ea-1",
      name: "TIMELY INTERVENTION",
      text: "TIMELY INTERVENTION When you play this character, if you have a character named Magic Broom in play, you may draw a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      condition: {
        type: "has-character-count",
        classification: "Broom",
        controller: "you",
        count: 2,
        comparison: "greater-or-equal",
      },
      effect: {
        modifier: 2,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "7ea-2",
      name: "ARCANE STUDY",
      text: "ARCANE STUDY While you have 2 or more Broom characters in play, this character gets +2 {L}.",
      type: "static",
    },
  ],
  i18n: yenSidPowerfulSorcererEpicI18n,
};
