import { challengerAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/challengerAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const kronkUnlicensedInvestigator: LorcanitoCharacterCardDefinition = {
  id: "ylc",
  name: "Kronk",
  title: "Unlicensed Investigator",
  characteristics: ["dreamborn", "ally"],
  text: "**Challenger**  +1 _(While challenging, this character gets +1 {S}.)_",
  type: "character",
  abilities: [challengerAbility(1)],
  flavour:
    "Maybe this one’s a chromicon. Probably not. I really should have paid more attention when that wizard guy was talking . . .",
  inkwell: true,
  colors: ["steel"],
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 1,
  illustrator: "Alex Accorsi",
  number: 178,
  set: "SSK",
  rarity: "common",
};
