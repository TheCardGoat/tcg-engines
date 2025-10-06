import type {
  AbilityEffect,
  LorcanitoCharacterCard,
} from "@lorcanito/lorcana-engine";
import { whenThisCharacterBanishedInAChallenge } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";

export const fairyGodmotherMysticArmorer: LorcanitoCharacterCardDefinition = {
  id: "fg2",

  name: "Fairy Godmother",
  title: "Mystic Armorer",
  characteristics: ["floodborn", "fairy", "mentor"],
  text: "**Shift** 2 _(You may pay 2 {I} to play this on top of one of your characters named Fairy Godmother.)_\n\n**FORGET THE COACH, HERE'S A SWORD** Whenever this character quests, your characters gain **Challenger** +3 and When this character is banished in a challenge, return this card to your hand this turn.",
  type: "character",
  abilities: [
    shiftAbility(2, "fairy godmother"),
    wheneverQuests({
      name: "Forget the Coach, Here's a Sword",
      text: "Whenever this character quests, your characters gain **Challenger** +3 and When this character is banished in a challenge, return this card to your hand this turn.",
      effects: [
        {
          type: "ability",
          ability: "challenger",
          amount: 3,
          modifier: "add",
          duration: "turn",
          target: {
            type: "card",
            value: "all",
            filters: [
              { filter: "zone", value: "play" },
              { filter: "owner", value: "self" },
              { filter: "type", value: "character" },
            ],
          },
        } as AbilityEffect,
        {
          type: "ability",
          ability: "custom",
          modifier: "add",
          duration: "turn",
          customAbility: whenThisCharacterBanishedInAChallenge({
            effects: [
              {
                type: "move",
                to: "hand",
                target: {
                  type: "card",
                  value: "all",
                  filters: [{ filter: "source", value: "self" }],
                },
              },
            ],
          }),
          target: {
            type: "card",
            value: "all",
            filters: [
              { filter: "zone", value: "play" },
              { filter: "owner", value: "self" },
              { filter: "type", value: "character" },
            ],
          },
        } as AbilityEffect,
      ],
    }),
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 2,
  illustrator: "Filipe Laurentino",
  number: 41,
  set: "ROF",
  rarity: "legendary",
};
