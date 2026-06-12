import type { ItemCard } from "@tcg/lorcana-types";
import { fortisphereI18n } from "./200-fortisphere.i18n";

export const fortisphere: ItemCard = {
  id: "PSk",
  canonicalId: "ci_PSk",
  reprints: ["set4-200"],
  cardType: "item",
  name: "Fortisphere",
  inkType: ["steel"],
  franchise: "Lorcana",
  set: "004",
  cardNumber: 200,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_5359fd5a9e4f43568d3419a2cd737640",
    tcgPlayer: 550626,
  },
  text: [
    {
      title: "RESOURCEFUL",
      description: "When you play this item, you may draw a card.",
    },
    {
      title: "EXTRACT OF STEEL 1",
      description:
        "{I}, Banish this item — Chosen character of yours gains Bodyguard until the start of your next turn. (An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
    },
  ],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      id: "s5n-1",
      name: "RESOURCEFUL",
      text: "RESOURCEFUL When you play this item, you may draw a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      cost: {
        ink: 1,
        banishSelf: true,
      },
      effect: {
        keyword: "Bodyguard",
        duration: "until-start-of-next-turn",
        target: "CHOSEN_CHARACTER_OF_YOURS",
        type: "gain-keyword",
      },
      id: "s5n-2",
      name: "EXTRACT OF STEEL",
      text: "EXTRACT OF STEEL 1 {I}, Banish this item — Chosen character of yours gains Bodyguard until the start of your next turn.",
      type: "activated",
    },
  ],
  i18n: fortisphereI18n,
};
