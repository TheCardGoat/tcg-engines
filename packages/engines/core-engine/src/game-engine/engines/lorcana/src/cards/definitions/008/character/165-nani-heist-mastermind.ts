import {
  type ActivatedAbility,
  supportAbility,
  yourCharactersNamedGain,
} from "~/game-engine/engines/lorcana/src/abilities";
import { chosenCharacterGainsResist } from "~/game-engine/engines/lorcana/src/abilities/effect";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const naniHeistMastermind: LorcanaCharacterCardDefinition = {
  id: "z0x",
  name: "Nani",
  title: "Heist Mastermind",
  characteristics: ["storyborn", "hero"],
  text: "STICK TO THE PLAN {E} – Another chosen character gains Resist +2 this turn. (Damage dealt to them is reduced by 2.)\nIT'S UP TO YOU, LILO Your characters named Lilo gain Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
  type: "character",
  abilities: [
    {
      type: "activated",
      name: "STICK TO THE PLAN",
      text: "Another chosen character gains Resist +2 this turn. (Damage dealt to them is reduced by 2.)",
      costs: [{ type: "exert" }],
      responder: "self",
      effects: [chosenCharacterGainsResist(2)],
    } as ActivatedAbility,
    yourCharactersNamedGain({
      name: "Lilo",
      ability: supportAbility,
    }),
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 4,
  strength: 3,
  willpower: 3,
  illustrator: "Alex Accorsi",
  number: 165,
  set: "008",
  rarity: "rare",
  lore: 1,
};
