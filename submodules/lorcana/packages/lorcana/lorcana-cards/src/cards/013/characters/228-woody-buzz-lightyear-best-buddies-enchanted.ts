import type { CharacterCard } from "@tcg/lorcana-types";
import { woodyBuzzLightyearBestBuddiesEnchantedI18n } from "./228-woody-buzz-lightyear-best-buddies-enchanted.i18n";

import { shift } from "../../../helpers/abilities/shift";

export const woodyBuzzLightyearBestBuddiesEnchanted: CharacterCard = {
  id: "ZP1",
  canonicalId: "ci_OZw",
  slug: "lorcana-ci_OZw",
  printings: [
    {
      id: "set13-228-enchanted",
      artId: "ci_OZw-enchanted",
      setCode: "set13",
      collectorNumber: "228",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set13-028"],
  cardType: "character",
  name: "Woody & Buzz Lightyear",
  version: "Best Buddies",
  inkType: ["amber", "emerald"],
  franchise: "Toy Story",
  set: "013",
  cardNumber: 228,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 7,
  strength: 4,
  willpower: 4,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_862f035f533244a8a59a469e5c0cae9c",
  },
  text: [
    {
      title: "Shift 5 {I}",
    },
    {
      title: "TO INFINITY...",
      description:
        "When you play this character, if chosen opponent has more cards in their hand than you, draw cards until you have the same number....",
    },
    {
      title: "AND BEYOND!",
      description:
        "Whenever this character quests, you may play a card with cost 2 or less for free.",
    },
  ],
  classifications: ["Storyborn", "Team", "Hero", "Toy", "Captain"],
  abilities: [
    shift("Woody or Buzz Lightyear", 5),
    {
      type: "triggered",
      name: "TO INFINITY...",
      text: "TO INFINITY... When you play this character, if chosen opponent has more cards in their hand than you, draw cards until you have the same number.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      condition: {
        type: "comparison",
        left: {
          type: "cards-in-hand",
          controller: "opponent",
        },
        comparison: "greater-than",
        right: {
          type: "cards-in-hand",
          controller: "you",
        },
      },
      effect: {
        type: "draw",
        target: "CONTROLLER",
        amount: {
          type: "difference",
          left: {
            type: "cards-in-hand",
            controller: "you",
          },
          right: {
            type: "cards-in-hand",
            controller: "opponent",
          },
          invert: true,
        },
      },
    },
    {
      type: "triggered",
      name: "AND BEYOND!",
      text: "AND BEYOND! Whenever this character quests, you may play a card with cost 2 or less for free.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "play-card",
          from: "hand",
          cost: "free",
          costRestriction: {
            comparison: "less-or-equal",
            value: 2,
          },
        },
      },
    },
  ],
  i18n: woodyBuzzLightyearBestBuddiesEnchantedI18n,
};
