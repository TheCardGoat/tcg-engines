import { yourOtherCharacters } from "@lorcanito/lorcana-engine/abilities/targets";
import { whileNoOtherCharacterHasQuestedThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const isabelaMadrigalGoldenChild: LorcanaCharacterCardDefinition = {
  id: "fal",
  name: "Isabela Madrigal",
  title: "Golden Child",
  characteristics: ["storyborn", "ally", "madrigal"],
  text: "**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n\n**LADIES FIRST** During your turn, if no other character has quested this turn, this character gets +3 {L}.\n\n\n**LEAVE IT TO ME** Whenever this character quests, your other characters can't quest for the rest of this turn.",
  type: "character",
  abilities: [
    evasiveAbility,
    whileNoOtherCharacterHasQuestedThisCharacterGets({
      name: "Ladies First",
      text: "During your turn, if no other character has quested this turn, this character gets +3 {L}.",
      amount: 3,
      attribute: "lore",
    }),
    wheneverQuests({
      name: "LEAVE IT TO ME",
      text: "Whenever this character quests, your other characters can't quest for the rest of this turn.",
      effects: [
        {
          type: "restriction",
          restriction: "quest",
          duration: "turn",
          target: yourOtherCharacters,
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 1,
  illustrator: "Otto Paredes",
  number: 45,
  set: "URR",
  rarity: "rare",
};
