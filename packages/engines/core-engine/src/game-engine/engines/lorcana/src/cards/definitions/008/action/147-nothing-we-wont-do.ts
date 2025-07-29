import type {
  AbilityEffect,
  LorcanitoActionCard,
  ResolutionAbility,
} from "@lorcanito/lorcana-engine";
import { singerTogetherAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import { allYourCharacters } from "@lorcanito/lorcana-engine/abilities/targets";
import { readyAndCantQuest } from "@lorcanito/lorcana-engine/effects/effects";

const gainsDamageProtection: AbilityEffect = {
  type: "ability",
  ability: "custom",
  modifier: "add",
  duration: "turn",
  target: allYourCharacters,
  customAbility: {
    type: "static",
    ability: "effects",
    effects: [
      {
        type: "protection",
        from: "damage",
        as: "attacker",
        target: {
          type: "card",
          value: "all",
          filters: [
            { filter: "type", value: "character" },
            { filter: "zone", value: "play" },
          ],
        },
      },
    ],
  },
};

const ability: ResolutionAbility = {
  type: "resolution",
  effects: [...readyAndCantQuest(allYourCharacters), gainsDamageProtection],
};

export const nothingWeWontDo: LorcanitoActionCard = {
  id: "pm2",
  name: "Nothing We Won't Do",
  characteristics: ["action", "song"],
  text: "Sing Together 8\nReady all your characters. For the rest of this turn, they take no damage from challenges and can't quest.",
  type: "action",
  abilities: [singerTogetherAbility(8), ability],
  inkwell: true,
  colors: ["ruby"],
  cost: 8,
  illustrator: "Jeanne Plattenet",
  number: 147,
  set: "008",
  rarity: "rare",
};
