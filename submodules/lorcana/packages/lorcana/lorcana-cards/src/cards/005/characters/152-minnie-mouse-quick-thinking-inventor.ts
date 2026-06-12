import type { CharacterCard } from "@tcg/lorcana-types";
import { minnieMouseQuickthinkingInventorI18n } from "./152-minnie-mouse-quick-thinking-inventor.i18n";

export const minnieMouseQuickthinkingInventor: CharacterCard = {
  id: "JJ3",
  canonicalId: "ci_JJ3",
  reprints: ["set5-152"],
  cardType: "character",
  name: "Minnie Mouse",
  version: "Quick-Thinking Inventor",
  inkType: ["sapphire"],
  set: "005",
  cardNumber: 152,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_a5dbf42b10974a1d96749b32de706c58",
    tcgPlayer: 561649,
  },
  text: [
    {
      title: "CAKE CATAPULT",
      description: "When you play this character, chosen character gets -2 {S} this turn.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Inventor"],
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: -2,
        stat: "strength",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "modify-stat",
      },
      id: "1h2-1",
      name: "CAKE CATAPULT",
      text: "CAKE CATAPULT When you play this character, chosen character gets -2 {S} this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: minnieMouseQuickthinkingInventorI18n,
};
