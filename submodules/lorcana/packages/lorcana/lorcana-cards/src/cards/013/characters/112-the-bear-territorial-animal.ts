import type { CharacterCard } from "@tcg/lorcana-types";
import { theBearTerritorialAnimalI18n } from "./112-the-bear-territorial-animal.i18n";

export const theBearTerritorialAnimal: CharacterCard = {
  id: "W16",
  canonicalId: "ci_W16",
  slug: "lorcana-ci_W16",
  printings: [
    {
      id: "set13-112",
      artId: "set13-112",
      setCode: "set13",
      collectorNumber: "112",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-112"],
  cardType: "character",
  name: "The Bear",
  version: "Territorial Animal",
  inkType: ["ruby"],
  franchise: "Fox and the Hound",
  set: "013",
  cardNumber: 112,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 5,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "Savage Fury",
      description: "While this character has damage, he gets +3 {S}.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      type: "static",
      name: "SAVAGE FURY",
      text: "SAVAGE FURY While this character has damage, he gets +3 {S}.",
      condition: {
        type: "self-has-damage",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 3,
        target: "SELF",
      },
    },
  ],
  i18n: theBearTerritorialAnimalI18n,
};
