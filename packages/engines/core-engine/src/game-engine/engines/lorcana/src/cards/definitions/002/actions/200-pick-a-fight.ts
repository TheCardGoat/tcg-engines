import type { CardEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const chosenCharacter: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "zone", value: "play" },
    { filter: "type", value: "character" },
  ],
};

export const pickAFight: LorcanaActionCardDefinition = {
  id: "mmh",

  name: "Pick a Fight",
  characteristics: ["action"],
  text: "Chosen character can challenge ready characters this turn.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Pick a Fight",
      text: "Chosen character can challenge ready characters this turn.",
      effects: [
        {
          type: "ability",
          ability: "challenge_ready_chars",
          modifier: "add",
          duration: "turn",
          until: true,
          target: chosenCharacter,
        },
      ],
    },
  ],
  flavour: "I'm gonna wreck it!",
  colors: ["steel"],
  cost: 2,
  illustrator: "Pablo Hidalgo / Jeff Merghart",
  number: 200,
  set: "ROF",
  rarity: "uncommon",
};
