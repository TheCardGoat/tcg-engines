import { singerCount } from "~/game-engine/engines/lorcana/src/abilities/ability-types";
import {
  drawCardEffect,
  gainLoreEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { singerTogetherAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/singTogetherAbility";
import { selfPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const fantasticalAndMagical: LorcanaActionCardDefinition = {
  id: "h9s",
  name: "Fantastical And Magical",
  characteristics: ["action", "song"],
  text: "Sing Together 9\nFor each character that sang this song, draw a card and gain 1 lore.",
  type: "action",
  abilities: [
    singerTogetherAbility(9),
    {
      type: "static",
      text: "For each character that sang this song, draw a card and gain 1 lore.",
      effects: [
        drawCardEffect({
          targets: [selfPlayerTarget],
          value: singerCount("currentSong"),
        }),
        gainLoreEffect({
          targets: [selfPlayerTarget],
          value: singerCount("currentSong"),
        }),
      ],
    },
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 9,
  illustrator: "Matthew Robert Davies",
  number: 79,
  set: "008",
  rarity: "super_rare",
};
