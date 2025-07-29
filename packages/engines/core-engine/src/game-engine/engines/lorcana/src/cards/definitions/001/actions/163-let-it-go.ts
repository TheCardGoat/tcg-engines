import type { CardEffectTarget } from "@lorcanito/lorcana-engine";
import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

const chosenCharacter: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "type", value: "character" },
    { filter: "zone", value: "play" },
  ],
};

export const letItGo: LorcanitoActionCard = {
  id: "n1y",
  name: "Let It Go",
  characteristics: ["action", "song"],
  text: "_(A character with cost 5 or more can {E} to sing this song for free.)_\nPut chosen character into their player's inkwell facedown and exerted.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Let It Go",
      text: "Put chosen character into their player's inkwell facedown and exerted.",
      effects: [
        {
          type: "move",
          to: "inkwell",
          exerted: true,
          target: chosenCharacter,
        },
      ],
    },
  ],
  flavour:
    "It's time to see what I can do<br />To test the limits and break through",
  inkwell: true,
  colors: ["sapphire"],
  cost: 5,
  illustrator: "Milica Celikovic",
  number: 163,
  set: "TFC",
  rarity: "rare",
};
