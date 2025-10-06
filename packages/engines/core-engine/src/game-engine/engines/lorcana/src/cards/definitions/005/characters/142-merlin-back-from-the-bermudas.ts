import { resistAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/resistAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const merlinBackFromTheBermudas: LorcanaCharacterCardDefinition = {
  id: "tbu",
  name: "Merlin",
  title: "Back from Bermuda",
  characteristics: ["sorcerer", "storyborn", "mentor"],
  text: "**LONG LIVE THE KING!** Your Arthur characters gain **Resist** +1 _(Damage dealt to this character is reduced by 1)_",
  type: "character",
  abilities: [
    {
      type: "static",
      ability: "gain-ability",
      name: "LONG LIVE THE KING!",
      text: "Your Arthur characters gain **Resist** +1 _(Damage dealt to this character is reduced by 1)_",
      gainedAbility: resistAbility(1),
      target: {
        type: "card",
        value: "all",
        filters: [
          { filter: "owner", value: "self" },
          { filter: "zone", value: "play" },
          {
            filter: "attribute",
            value: "name",
            comparison: { operator: "eq", value: "Arthur" },
          },
        ],
      },
    },
  ],
  flavour: "A little rest and relaxation will do your health good, boy.",
  inkwell: true,
  colors: ["sapphire"],
  cost: 4,
  strength: 1,
  willpower: 4,
  lore: 2,
  illustrator: "Alice Pisoni",
  number: 142,
  set: "SSK",
  rarity: "common",
};
