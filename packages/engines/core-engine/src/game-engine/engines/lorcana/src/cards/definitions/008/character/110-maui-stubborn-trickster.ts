import {
  allOpposingCharacters,
  allOpposingItems,
  allOpposingLocations,
  chosenCharacter,
} from "@lorcanito/lorcana-engine/abilities/targets";
import { whenThisCharacterBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { putDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const imNotFinishedYet = whenThisCharacterBanished({
  name: "I'M NOT FINISHED YET",
  text: "When this character is banished, choose one:\n- Put 2 damage counters on all opposing characters.\n- Banish all opposing items.\n- Banish all opposing locations.",
  effects: [
    {
      type: "modal",
      // TODO: Get rid of target
      target: chosenCharacter,
      modes: [
        {
          id: "1",
          text: "Put 2 damage counters on all opposing characters.",
          effects: [putDamageEffect(2, allOpposingCharacters)],
        },
        {
          id: "2",
          text: "Banish all opposing items.",
          effects: [
            {
              type: "banish",
              target: allOpposingItems,
            },
          ],
        },
        {
          id: "3",
          text: "Banish all opposing locations.",
          effects: [
            {
              type: "banish",
              target: allOpposingLocations,
            },
          ],
        },
      ],
    },
  ],
});

export const mauiStubbornTrickster: LorcanaCharacterCardDefinition = {
  id: "o9q",
  name: "Maui",
  title: "Stubborn Trickster",
  characteristics: ["storyborn", "hero", "deity"],
  text: "I'M NOT FINISHED YET When this character is banished, choose one:\n- Put 2 damage counters on all opposing characters.\n- Banish all opposing items.\n- Banish all opposing locations.",
  type: "character",
  abilities: [imNotFinishedYet],
  inkwell: true,
  colors: ["emerald", "steel"],
  cost: 6,
  strength: 4,
  willpower: 4,
  illustrator: "Natalie Dombois",
  number: 110,
  set: "008",
  rarity: "super_rare",
  lore: 3,
};
