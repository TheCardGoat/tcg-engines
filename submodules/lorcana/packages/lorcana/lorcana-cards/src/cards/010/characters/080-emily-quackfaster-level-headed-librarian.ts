import type { CharacterCard } from "@tcg/lorcana-types";
import { emilyQuackfasterLevelheadedLibrarianI18n } from "./080-emily-quackfaster-level-headed-librarian.i18n";

export const emilyQuackfasterLevelheadedLibrarian: CharacterCard = {
  id: "Gtk",
  canonicalId: "ci_Gtk",
  reprints: ["set10-080"],
  cardType: "character",
  name: "Emily Quackfaster",
  version: "Level-Headed Librarian",
  inkType: ["emerald"],
  franchise: "Ducktales",
  set: "010",
  cardNumber: 80,
  rarity: "uncommon",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_9309b1cf13e545c2a5ef5292f2ffae01",
    tcgPlayer: 659451,
  },
  text: [
    {
      title: "RECOMMENDED READING",
      description:
        "When you play this character, you may put the top card of your deck facedown under one of your characters or locations with Boost.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "Gtk-1",
      name: "RECOMMENDED READING",
      text: "RECOMMENDED READING When you play this character, you may put the top card of your deck facedown under one of your characters or locations with Boost.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        chooser: "CONTROLLER",
        effect: {
          source: "top-of-deck",
          type: "put-under",
          under: {
            cardTypes: ["character", "location"],
            count: 1,
            owner: "you",
            selector: "chosen",
            zones: ["play"],
            filter: [
              {
                keyword: "Boost",
                type: "has-keyword",
              },
            ],
          },
        },
        type: "optional",
      },
      type: "triggered",
    },
  ],
  i18n: emilyQuackfasterLevelheadedLibrarianI18n,
};
