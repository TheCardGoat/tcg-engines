import {
  chosenOpposingReadyCharacter,
  thisCharacter,
} from "@lorcanito/lorcana-engine/abilities/targets";
import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const ursulaVoiceStealer: LorcanaCharacterCardDefinition = {
  id: "mkd",
  name: "Ursula",
  title: "Voice Stealer",
  characteristics: ["storyborn", "villain", "sorcerer"],
  text: "SING FOR ME When you play this character, exert chosen opposing ready character. Then, you may play a song with cost equal to or less than the exerted character's cost for free.",
  type: "character",
  inkwell: true,
  colors: ["amethyst"],
  cost: 5,
  strength: 3,
  willpower: 4,
  illustrator: "Max Ulichney",
  number: 44,
  set: "009",
  rarity: "super_rare",
  abilities: [
    whenYouPlayThis({
      optional: true,
      effects: [
        {
          type: "exert",
          exert: true,
          target: chosenOpposingReadyCharacter,
          afterEffect: [
            {
              type: "create-layer-based-on-target",
              target: thisCharacter,
              optional: true,
              effects: [
                {
                  type: "play",
                  forFree: true,
                  target: {
                    type: "card",
                    value: 1,
                    filters: [
                      { filter: "owner", value: "self" },
                      { filter: "zone", value: "hand" },
                      { filter: "characteristics", value: ["song"] },
                      {
                        filter: "attribute",
                        value: "cost",
                        compareWithParentsTarget: true,
                        comparison: { operator: "lte", value: "target" },
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
    }),
  ],
  lore: 1,
};
