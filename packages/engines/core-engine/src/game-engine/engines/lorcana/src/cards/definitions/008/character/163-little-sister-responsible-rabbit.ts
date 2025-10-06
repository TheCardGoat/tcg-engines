import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { healEffect } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const littleSisterResponsibleRabbit: LorcanaCharacterCardDefinition = {
  id: "sud",
  name: "Little Sister",
  title: "Responsible Rabbit",
  characteristics: ["storyborn", "ally"],
  text: "LET ME HELP When you play this character, you may remove up to 1 damage from chosen character.",
  type: "character",
  abilities: [
    whenYouPlayThis({
      name: "LET ME HELP",
      text: "When you play this character, you may remove up to 1 damage from chosen character.",
      optional: true,
      effects: [
        healEffect(1, {
          type: "card",
          value: 1,
          filters: [
            { filter: "type", value: "character" },
            { filter: "zone", value: "play" },
          ],
        }),
      ],
    }),
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 1,
  strength: 1,
  willpower: 2,
  illustrator: "Andrea Parisi",
  number: 163,
  set: "008",
  rarity: "common",
  lore: 1,
};
