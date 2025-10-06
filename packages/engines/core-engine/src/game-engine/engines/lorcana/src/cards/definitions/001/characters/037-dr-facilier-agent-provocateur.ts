import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import { wheneverOneOfYourCharactersIsBanishedInAChallenge } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const drFacilierAgentProvocateur: LorcanaCharacterCardDefinition = {
  id: "pyt",

  name: "Dr. Facilier",
  title: "Agent Provocateur",
  characteristics: ["floodborn", "sorcerer", "villain"],
  text: "**Shift** 5 _(You may pay 5 {I} to play this on top of one of your characters named Dr. Facilier.)_\n\n**INTO THE SHADOWS** Whenever one of your other characters is banished in a challenge, you may return that card to your hand.",
  type: "character",
  abilities: [
    wheneverOneOfYourCharactersIsBanishedInAChallenge({
      name: "Into the Shadows",
      text: "Whenever one of your other characters is banished in a challenge, you may return that card to your hand.",
      optional: true,
      triggerFilter: [
        { filter: "owner", value: "self" },
        { filter: "type", value: "character" },
        { filter: "source", value: "other" },
      ],
      effects: [
        {
          type: "move",
          to: "hand",
          target: {
            type: "card",
            value: "all",
            filters: [{ filter: "source", value: "trigger" }],
          },
        },
      ],
    }),
    shiftAbility(5, "Dr. Facilier"),
  ],
  colors: ["amethyst"],
  cost: 7,
  strength: 4,
  willpower: 5,
  lore: 3,
  illustrator: "Isaiah Mesq",
  number: 37,
  set: "TFC",
  rarity: "rare",
};
