import type { CharacterCard } from "@tcg/lorcana-types";
import { ednaModeSuperSuitDesignerI18n } from "./149-edna-mode-super-suit-designer.i18n";

export const ednaModeSuperSuitDesigner: CharacterCard = {
  id: "1Nh",
  canonicalId: "ci_1Nh",
  reprints: ["set12-149"],
  cardType: "character",
  name: "Edna Mode",
  version: "Super Suit Designer",
  inkType: ["sapphire"],
  franchise: "Incredibles",
  set: "012",
  cardNumber: 149,
  rarity: "rare",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_911059054d6c417eac48594ab4b94e7c",
  },
  text: [
    {
      title: "KEY ACCESSORY",
      description: "{E} — Ready chosen item.",
    },
    {
      title: "ALL THE BASICS",
      description: "While you have an item named Super Suit in play, this character gains Ward.",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Inventor"],
  abilities: [
    {
      id: "1Nh-1",
      name: "KEY ACCESSORY",
      type: "activated",
      text: "KEY ACCESSORY {E} — Ready chosen item.",
      cost: {
        exert: true,
      },
      effect: {
        type: "ready",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["item"],
        },
      },
    },
    {
      id: "1Nh-2",
      name: "ALL THE BASICS",
      type: "static",
      text: "ALL THE BASICS While you have an item named Super Suit in play, this character gains Ward.",
      condition: {
        type: "has-named-item",
        name: "Super Suit",
        controller: "you",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Ward",
        target: "SELF",
      },
    },
  ],
  i18n: ednaModeSuperSuitDesignerI18n,
};
