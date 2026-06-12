import type { CharacterCard } from "@tcg/lorcana-types";
import { merlinRabbitI18n } from "./052-merlin-rabbit.i18n";

export const merlinRabbit: CharacterCard = {
  id: "LZe",
  canonicalId: "ci_LZe",
  reprints: ["set2-052"],
  cardType: "character",
  name: "Merlin",
  version: "Rabbit",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "002",
  cardNumber: 52,
  rarity: "rare",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_6ebf8ca0c6b848e992e9927bf0d93d2b",
    tcgPlayer: 520939,
  },
  text: [
    {
      title: "HOPPITY HIP!",
      description: "When you play this character and when he leaves play, you may draw a card.",
    },
  ],
  classifications: ["Storyborn", "Mentor", "Sorcerer"],
  abilities: [
    {
      id: "LZe-1",
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      name: "HOPPITY HIP!",
      text: "HOPPITY HIP! When you play this character and when he leaves play, you may draw a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      id: "LZe-2",
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      name: "HOPPITY HIP!",
      text: "HOPPITY HIP! When you play this character and when he leaves play, you may draw a card.",
      trigger: {
        event: "leave-play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: merlinRabbitI18n,
};
