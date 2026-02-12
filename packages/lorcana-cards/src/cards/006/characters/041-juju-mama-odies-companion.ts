import type { CharacterCard } from "@tcg/lorcana-types";

export const jujuMamaOdiesCompanion: CharacterCard = {
  abilities: [
    {
      effect: {
        from: "hand",
        type: "play-card",
      },
      id: "fzy-1",
      name: "BEES' KNEES",
      text: "BEES' KNEES When you play this character, move 1 damage counter from chosen character to chosen opposing character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 41,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 2,
  externalIds: {
    ravensburger: "39a8ffade10cf36dfd0f60244ac7f44bc589453a",
  },
  franchise: "Princess and the Frog",
  fullName: "Juju - Mama Odie's Companion",
  id: "fzy",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Juju",
  set: "006",
  strength: 1,
  text: "BEES' KNEES When you play this character, move 1 damage counter from chosen character to chosen opposing character.",
  version: "Mama Odie's Companion",
  willpower: 2,
};
