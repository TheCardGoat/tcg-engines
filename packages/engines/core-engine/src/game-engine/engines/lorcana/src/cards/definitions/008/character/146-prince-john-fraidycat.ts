import { dealDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
import { thisCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { wheneverTargetPlays } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const princeJohnFraidycat: LorcanaCharacterCardDefinition = {
  id: "ed5",
  name: "Prince John",
  title: "Fraidy-Cat",
  characteristics: ["storyborn", "villain", "prince"],
  text: "HELP! HELP! Whenever an opponent plays a character, deal 1 damage to this character.",
  type: "character",
  inkwell: false,
  colors: ["ruby"],
  cost: 3,
  strength: 5,
  willpower: 5,
  illustrator: "Denny Minonne",
  number: 146,
  set: "008",
  rarity: "rare",
  lore: 1,
  abilities: [
    wheneverTargetPlays({
      name: "HELP! HELP!",
      text: "Whenever an opponent plays a character, deal 1 damage to this character.",
      triggerFilter: [
        { filter: "owner", value: "opponent" },
        { filter: "type", value: "character" },
        { filter: "zone", value: "play" },
      ],
      effects: [dealDamageEffect(1, thisCharacter)],
    }),
  ],
};
