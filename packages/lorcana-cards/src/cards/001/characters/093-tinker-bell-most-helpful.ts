import type { CharacterCard } from "@tcg/lorcana-types";

export const TinkerBellMostHelpful: CharacterCard = {
  id: "xkn",
  cardType: "character",
  name: "Tinker Bell",
  version: "Most Helpful",
  fullName: "Tinker Bell - Most Helpful",
  inkType: ["emerald"],
  franchise: "Disney",
  set: "001",
  text: "**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n**PIXIE DUST** When you play this character, chosen character gains **Evasive** this turn.",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 93,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n**PIXIE DUST** When you play this character, chosen character gains **Evasive** this turn.",
      id: "xkn-1",
      effect: {
        type: "play-card",
        from: "hand",
      },
    },
  ],
  classifications: ["Storyborn", "Ally", "Fairy"],
};
