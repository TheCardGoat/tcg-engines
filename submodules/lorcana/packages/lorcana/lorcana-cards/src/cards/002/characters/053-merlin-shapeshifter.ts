import type { CharacterCard } from "@tcg/lorcana-types";
import { merlinShapeshifterI18n } from "./053-merlin-shapeshifter.i18n";

export const merlinShapeshifter: CharacterCard = {
  id: "ijy",
  canonicalId: "ci_ijy",
  reprints: ["set2-053"],
  cardType: "character",
  name: "Merlin",
  version: "Shapeshifter",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "002",
  cardNumber: 53,
  rarity: "rare",
  cost: 4,
  strength: 1,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_05560bab5aba45cd8cd838e0d3597cce",
    tcgPlayer: 516329,
  },
  text: [
    {
      title: "BATTLE OF WITS",
      description:
        "Whenever one of your other characters is returned to your hand from play, this character gets +1 {L} this turn.",
    },
  ],
  classifications: ["Storyborn", "Mentor", "Sorcerer"],
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 1,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "fck-1",
      name: "BATTLE OF WITS",
      text: "BATTLE OF WITS Whenever one of your other characters is returned to your hand from play, this character gets +1 {L} this turn.",
      trigger: {
        event: "return-to-hand",
        on: "YOUR_OTHER_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: merlinShapeshifterI18n,
};
