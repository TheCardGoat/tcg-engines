import { resistAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/resistAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const namaariResoluteDaughter: LorcanaCharacterCardDefinition = {
  id: "p4n",
  name: "Namaari",
  title: "Resolute Daughter",
  characteristics: ["storyborn", "villain", "princess"],
  text: "**I DON’T HAVE ANY OTHER CHOICE** For each opposing character banished in a challenge this turn, you pay 2 {I} less to play this character. **Resist** +3 _(Damage dealt to this character is reduced by 3.)_",
  type: "character",
  abilities: [resistAbility(3)],
  colors: ["steel"],
  cost: 9,
  strength: 5,
  willpower: 5,
  lore: 3,
  illustrator: "Jenna Gray",
  number: 182,
  set: "SSK",
  rarity: "rare",
};
