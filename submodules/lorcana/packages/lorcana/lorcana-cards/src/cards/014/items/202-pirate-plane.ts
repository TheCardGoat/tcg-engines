import type { ItemCard } from "@tcg/lorcana-types";
import { piratePlaneI18n } from "./202-pirate-plane.i18n";

export const piratePlane: ItemCard = {
  id: "osH",
  canonicalId: "ci_osH",
  slug: "lorcana-ci_osH",
  printings: [
    {
      id: "set14-202",
      artId: "set14-202",
      setCode: "set14",
      collectorNumber: "202",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-202"],
  cardType: "item",
  name: "Pirate Plane",
  inkType: ["steel"],
  franchise: "Talespin",
  set: "014",
  cardNumber: 202,
  rarity: "uncommon",
  cost: 3,
  inkable: true,
  abilities: [
    {
      id: "osH-1",
      name: "Dodge This!",
      type: "triggered",
      trigger: { event: "play", on: "SELF", timing: "when" },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "deal-damage",
          amount: 1,
          target: "CHOSEN_CHARACTER",
        },
      },
      text: "Dodge This! When you play this item, you may deal 1 damage to chosen character.",
    },
    {
      id: "osH-2",
      name: "Barrel Roll",
      type: "activated",
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        type: "gain-keyword",
        keyword: "Alert",
        duration: "this-turn",
        target: "CHOSEN_CHARACTER",
      },
      text: "Barrel Roll {E}, 1 {I} — Chosen character gains Alert this turn. (They can challenge as if they had Evasive.)",
    },
  ],
  text: [
    {
      title: "Dodge This!",
      description: "When you play this item, you may deal 1 damage to chosen character.",
    },
    {
      title: "Barrel Roll",
      description:
        "{E}, 1 {I} — Chosen character gains Alert this turn. (They can challenge as if they had Evasive.)",
    },
  ],
  i18n: piratePlaneI18n,
};
