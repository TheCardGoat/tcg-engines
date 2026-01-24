import type { CharacterCard } from "@tcg/lorcana-types";

export const jujuMamaOdiesCompanion: CharacterCard = {
  id: "fzy",
  cardType: "character",
  name: "Juju",
  version: "Mama Odie's Companion",
  fullName: "Juju - Mama Odie's Companion",
  inkType: ["amethyst"],
  franchise: "Princess and the Frog",
  set: "006",
  text: "BEES' KNEES When you play this character, move 1 damage counter from chosen character to chosen opposing character.",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 41,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "39a8ffade10cf36dfd0f60244ac7f44bc589453a",
  },
  abilities: [
    {
      id: "fzy-1",
      type: "triggered",
      name: "BEES' KNEES",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "play-card",
        from: "hand",
      },
      text: "BEES' KNEES When you play this character, move 1 damage counter from chosen character to chosen opposing character.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
