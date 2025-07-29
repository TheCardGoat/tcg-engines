import type { CardEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const chosenCharacterOfYour: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "zone", value: "play" },
    { filter: "type", value: "character" },
    { filter: "owner", value: "self" },
  ],
};

export const fallingDownTheRabbitHole: LorcanaActionCardDefinition = {
  id: "j9g",
  name: "Falling Down the Rabbit Hole",
  characteristics: ["action"],
  text: "Each player chooses one of their characters and puts them into their inkwell facedown and exerted.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Falling Down the Rabbit Hole",
      text: "Each player chooses one of their characters and puts them into their inkwell facedown and exerted.",
      responder: "self",
      effects: [
        {
          type: "move",
          to: "inkwell",
          exerted: true,
          target: chosenCharacterOfYour,
        },
      ],
    },
    {
      type: "resolution",
      name: "Falling Down the Rabbit Hole",
      text: "Each player chooses one of their characters and puts them into their inkwell facedown and exerted.",
      responder: "opponent",
      effects: [
        {
          type: "move",
          to: "inkwell",
          exerted: true,
          target: chosenCharacterOfYour,
        },
      ],
    },
  ],
  flavour:
    "Down, down, down she went, floating in a swirl of ink. How curious!",
  colors: ["sapphire"],
  cost: 4,
  illustrator: "Lissette Carrera",
  number: 162,
  set: "ROF",
  rarity: "rare",
};
