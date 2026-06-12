import type { CharacterCard } from "@tcg/lorcana-types";
import { tamatoaSoShinyI18n } from "./159-tamatoa-so-shiny.i18n";

export const tamatoaSoShiny: CharacterCard = {
  id: "Z2D",
  canonicalId: "ci_Z2D",
  reprints: ["set1-159"],
  cardType: "character",
  name: "Tamatoa",
  version: "So Shiny!",
  inkType: ["sapphire"],
  franchise: "Moana",
  set: "001",
  cardNumber: 159,
  rarity: "common",
  cost: 8,
  strength: 5,
  willpower: 8,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_43467fa51d7b4bcc9ebe110d9fe9e3b9",
    tcgPlayer: 508881,
  },
  text: [
    {
      title: "WHAT HAVE WE HERE?",
      description:
        "When you play this character and whenever he quests, you may return an item card from your discard to your hand.",
    },
    {
      title: "GLAM",
      description: "This character gets +1 {L} for each item you have in play.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          cardType: "item",
          target: "CONTROLLER",
          type: "return-from-discard",
        },
        type: "optional",
      },
      id: "sj3-1",
      name: "WHAT HAVE WE HERE?",
      text: "WHAT HAVE WE HERE? When you play this character and whenever he quests, you may return an item card from your discard to your hand.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          cardType: "item",
          target: "CONTROLLER",
          type: "return-from-discard",
        },
        type: "optional",
      },
      id: "sj3-3",
      name: "WHAT HAVE WE HERE?",
      text: "WHAT HAVE WE HERE? When you play this character and whenever he quests, you may return an item card from your discard to your hand.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
    {
      effect: {
        modifier: {
          controller: "you",
          type: "items-in-play",
        },
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "sj3-2",
      name: "GLAM",
      text: "GLAM This character gets +1 {L} for each item you have in play.",
      type: "static",
    },
  ],
  i18n: tamatoaSoShinyI18n,
};
