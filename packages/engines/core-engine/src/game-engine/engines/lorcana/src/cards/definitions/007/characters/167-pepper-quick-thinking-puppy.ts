import { wheneverOneOfYouCharactersIsBanished } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const pepperQuickthinkingPuppy: LorcanaCharacterCardDefinition = {
  id: "q6x",
  name: "Pepper",
  title: "Quick-Thinking Puppy",
  characteristics: ["storyborn", "puppy"],
  type: "character",
  inkwell: true,
  colors: ["sapphire"],
  cost: 3,
  strength: 2,
  willpower: 2,
  illustrator: "Rachel Elissa",
  number: 167,
  set: "007",
  rarity: "common",
  lore: 1,
  text: "IN THE NICK OF TIME Whenever one of your Puppy characters is banished, you may put that card into your inkwell facedown and exerted.",
  abilities: [
    wheneverOneOfYouCharactersIsBanished({
      name: "In the Nick of Time",
      text: "Whenever one of your Puppy characters is banished, you may put that card into your inkwell facedown and exerted.",
      optional: true,
      triggerTarget: [
        { filter: "owner", value: "self" },
        { filter: "type", value: "character" },
        { filter: "characteristics", value: ["puppy"] },
      ],
      effects: [
        {
          type: "move",
          to: "inkwell",
          exerted: true,
          target: {
            type: "card",
            value: "all",
            filters: [{ filter: "trigger", value: "target" }],
          },
        },
      ],
    }),
  ],
};
