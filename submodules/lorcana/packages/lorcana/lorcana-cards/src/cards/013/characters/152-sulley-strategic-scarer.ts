import type { CharacterCard } from "@tcg/lorcana-types";
import { sulleyStrategicScarerI18n } from "./152-sulley-strategic-scarer.i18n";

export const sulleyStrategicScarer: CharacterCard = {
  id: "7g9",
  canonicalId: "ci_7g9",
  slug: "lorcana-ci_7g9",
  printings: [
    {
      id: "set13-152",
      artId: "set13-152",
      setCode: "set13",
      collectorNumber: "152",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-152"],
  cardType: "character",
  name: "Sulley",
  version: "Strategic Scarer",
  inkType: ["sapphire"],
  franchise: "Monsters, Inc.",
  set: "013",
  cardNumber: 152,
  rarity: "common",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "Jump Scare",
      description: "While you have 5 or more cards in your inkwell, this character gets +2 {S}.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Monster"],
  abilities: [
    {
      type: "static",
      name: "JUMP SCARE",
      text: "JUMP SCARE While you have 5 or more cards in your inkwell, this character gets +2 {S}.",
      condition: {
        type: "resource-count",
        what: "cards-in-inkwell",
        controller: "you",
        comparison: "greater-or-equal",
        value: 5,
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
      },
    },
  ],
  i18n: sulleyStrategicScarerI18n,
};
