import type { CharacterCard } from "@tcg/lorcana-types";
import { moanaChosenByTheOceanI18n } from "./117-moana-chosen-by-the-ocean.i18n";

export const moanaChosenByTheOcean: CharacterCard = {
  id: "c4p",
  canonicalId: "ci_c4p",
  reprints: ["set1-117"],
  cardType: "character",
  name: "Moana",
  version: "Chosen by the Ocean",
  inkType: ["ruby"],
  franchise: "Moana",
  set: "001",
  cardNumber: 117,
  rarity: "uncommon",
  cost: 5,
  strength: 2,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_49b96ca319434f588d5d36b30597c832",
    tcgPlayer: 508786,
  },
  text: [
    {
      title: "THIS IS NOT WHO YOU ARE",
      description: "When you play this character, you may banish chosen character named Te Kā.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
            // We must clear diacritics
            filter: [{ type: "has-name", name: "Te Ka" }],
          },
          type: "banish",
        },
        type: "optional",
      },
      id: "176-1",
      name: "THIS IS NOT WHO YOU ARE",
      text: "THIS IS NOT WHO YOU ARE When you play this character, you may banish chosen character named Te Kā.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: moanaChosenByTheOceanI18n,
};
