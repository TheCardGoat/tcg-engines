import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import { yourOtherCharacters } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { wheneverChallengesAnotherChar } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const goofyExtremeAthlete: LorcanaCharacterCardDefinition = {
  id: "pve",
  name: "Goofy",
  title: "Extreme Athlete",
  characteristics: ["storyborn", "ally"],
  text: "Evasive\nSTAR POWER Whenever this character challenges another character, your other characters get +1 {L} this turn.",
  type: "character",
  abilities: [
    evasiveAbility,
    wheneverChallengesAnotherChar({
      name: "STAR POWER",
      text: "Whenever this character challenges another character, your other characters get +1 {L} this turn.",
      effects: [
        {
          type: "attribute",
          attribute: "lore",
          amount: 1,
          modifier: "add",
          duration: "turn",
          target: yourOtherCharacters,
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 7,
  strength: 7,
  willpower: 6,
  illustrator: "Teresita O.",
  number: 139,
  set: "007",
  rarity: "super_rare",
  lore: 1,
};
