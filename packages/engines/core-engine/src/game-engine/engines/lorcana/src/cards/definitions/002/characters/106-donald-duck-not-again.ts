import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const donaldDuckNotAgain: LorcanitoCharacterCardDefinition = {
  id: "adi",
  name: "Donald Duck",
  title: "Not Again!",
  characteristics: ["hero", "dreamborn"],
  text: "**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n**PHOOEY!** This character gets +1 {L} for each 1 damage on him.",
  type: "character",
  abilities: [
    evasiveAbility,
    wheneverQuests({
      name: "PHOOEY!",
      text: "This character gets +1 {L} for each 1 damage on him.",
      effects: [youGainLore({ dynamic: true, sourceAttribute: "damage" })],
    }),
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 5,
  strength: 1,
  willpower: 5,
  lore: 1,
  illustrator: "Carmine Pucci / Leonardo Giammichele",
  number: 106,
  set: "ROF",
  rarity: "legendary",
};
