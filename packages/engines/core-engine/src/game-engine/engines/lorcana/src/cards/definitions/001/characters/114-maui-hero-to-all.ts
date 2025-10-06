import {
  recklessAbility,
  rushAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mauiHeroToAll: LorcanaCharacterCardDefinition = {
  id: "tkz",
  name: "Maui",
  title: "Hero to All",
  characteristics: ["hero", "storyborn", "deity"],
  text: "**Rush** _(This character can challenge the turn they're played.)_\n\n**Reckless** _(This character can't quest and must challenge each turn if able.)_",
  type: "character",
  illustrator: "Pirel / Marco Giorgianni",
  abilities: [rushAbility, recklessAbility],
  flavour: "What I believe you were trying to say is 'Thank you.",
  inkwell: true,
  colors: ["ruby"],
  cost: 5,
  strength: 6,
  willpower: 5,
  lore: 0,
  number: 114,
  set: "TFC",
  rarity: "rare",
};
