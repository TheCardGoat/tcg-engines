import { drawACard } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import { wheneverYouHeal } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const rapunzelGiftedArtist: LorcanaCharacterCardDefinition = {
  id: "d99",
  name: "Rapunzel",
  title: "Gifted Artist",
  characteristics: ["hero", "floodborn", "princess"],
  text: "**Shift** 3 (_You may pay 3 {I} to play this on top of one of your characters named Rapunzel._)\n\n**LET YOUR POWER SHINE** Whenever you remove 1 or more damage from one of your characters, you may draw a card.",
  type: "character",
  abilities: [
    wheneverYouHeal({
      name: "Ancient Insight",
      text: "Whenever you remove 1 or more damage from one of your characters, you may draw a card.",
      optional: true,
      effects: [drawACard],
    }),
    shiftAbility(3, "rapunzel"),
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 5,
  strength: 0,
  willpower: 6,
  lore: 2,
  illustrator: "Aubrey Archer",
  number: 19,
  set: "ROF",
  rarity: "uncommon",
};
