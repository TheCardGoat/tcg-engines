import { drawCardEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { singerTogetherAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/singTogetherAbility";
import { chosenPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const secondStarToTheRight: LorcanaActionCardDefinition = {
  id: "k7z",
  missingTestCase: true,
  name: "Second Star To The Right",
  characteristics: ["action", "song"],
  text: "**Sing Together** 10 _(Any number of your of your teammates' characters with total cost 10 or more may {E} to sing this song for free.)_\n\n\nChosen player draws 5 cards.",
  type: "action",
  abilities: [
    singerTogetherAbility(10),
    {
      type: "static",
      text: "Chosen player draws 5 cards.",
      targets: [chosenPlayerTarget],
      effects: [drawCardEffect({ value: 5 })],
    },
  ],
  flavour: "Lead us to the land we dream of",
  colors: ["amethyst"],
  cost: 10,
  illustrator: "Natalia Trykowska",
  number: 61,
  set: "URR",
  rarity: "rare",
};
