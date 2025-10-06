import type { CardRestrictionEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const drFacilierFortuneTeller: LorcanaCharacterCardDefinition = {
  id: "mwx",

  name: "Dr. Facilier",
  title: "Fortune Teller",
  characteristics: ["sorcerer", "storyborn", "villain"],
  text: "**Evasive** (_Only characters with Evasive can challenge this character._)\n**YOU'RE IN MY WORLD** Whenever this character quests, chosen opposing character can't quest during their next turn.",
  type: "character",
  abilities: [
    evasiveAbility,
    wheneverQuests({
      name: "You're in my World",
      text: "Whenever this character quests, chosen opposing character can't quest during their next turn.",
      effects: [
        {
          type: "restriction",
          restriction: "quest",
          duration: "next_turn",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
              { filter: "owner", value: "opponent" },
            ],
          },
        } as CardRestrictionEffect,
      ],
    }),
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 7,
  strength: 4,
  willpower: 4,
  lore: 3,
  illustrator: "Ron Baird",
  number: 79,
  set: "ROF",
  rarity: "super_rare",
};
