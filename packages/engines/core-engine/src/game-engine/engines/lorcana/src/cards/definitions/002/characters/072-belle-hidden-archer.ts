import { discardAllCards } from "@lorcanito/lorcana-engine/effects/effects";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import { whenChallenged } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const belleHiddenArcher: LorcanaCharacterCardDefinition = {
  id: "y10",
  name: "Belle",
  title: "Hidden Archer",
  characteristics: ["hero", "floodborn", "princess"],
  text: "**Shift** 3 _You may pay 3 {I} to play this on top of one of your characters named Belle.)_<br>\n**THORNY ARROWS** Whenever this character is challenged, the challenging character's player discards all cards in their hand.",
  type: "character",
  abilities: [
    shiftAbility(3, "belle"),
    whenChallenged({
      name: "Thorny Arrows",
      text: "Whenever this character is challenged, the challenging character's player discards all cards in their hand.",
      responder: "opponent",
      effects: [discardAllCards],
    }),
  ],
  flavour: "She slips through the trees as easily as shadow.",
  colors: ["emerald"],
  cost: 5,
  strength: 3,
  willpower: 3,
  lore: 3,
  illustrator: "Aisha Durmagambetova",
  number: 72,
  set: "ROF",
  rarity: "legendary",
};
