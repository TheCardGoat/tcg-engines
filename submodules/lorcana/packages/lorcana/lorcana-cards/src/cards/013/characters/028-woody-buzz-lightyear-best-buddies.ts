import type { CharacterCard } from "@tcg/lorcana-types";
import { woodyBuzzLightyearBestBuddiesI18n } from "./028-woody-buzz-lightyear-best-buddies.i18n";

import { shift } from "../../../helpers/abilities/shift";

export const woodyBuzzLightyearBestBuddies: CharacterCard = {
  id: "OZw",
  canonicalId: "ci_OZw",
  slug: "lorcana-ci_OZw",
  printings: [
    {
      id: "set13-028",
      artId: "set13-028",
      setCode: "set13",
      collectorNumber: "28",
      rarity: "legendary",
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
  cardNumber: 28,
  rarity: "legendary",
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
      title: "Shift 5 {}",
      description:
        "(You may pay 5 {} to play this on top of one of your characters named Woody or Buzz Lightyear.)",
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
  i18n: woodyBuzzLightyearBestBuddiesI18n,
};
