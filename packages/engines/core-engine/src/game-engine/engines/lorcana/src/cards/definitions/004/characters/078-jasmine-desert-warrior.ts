import type {
  LorcanitoCharacterCard,
  ResolutionAbility,
} from "@lorcanito/lorcana-engine";
import { discardACard } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { whenChallenged } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";

const smartManeuver: ResolutionAbility = {
  type: "resolution",
  name: "Smart Maneuver",
  text: "When you play this character and each time she is challenged, each opponent chooses and discards a card.",
  responder: "opponent",
  effects: [discardACard],
};

export const jasmineDesertWarrior: LorcanaCharacterCardDefinition = {
  id: "g9b",
  missingTestCase: true,
  name: "Jasmine",
  title: "Desert Warrior",
  characteristics: ["hero", "dreamborn", "princess"],
  text: "**SMART MANEUVER** When you play this character and each time she is challenged, each opponent chooses and discards a card.",
  type: "character",
  abilities: [
    smartManeuver,
    whenChallenged({
      ...smartManeuver,
    }),
  ],
  colors: ["emerald"],
  cost: 5,
  strength: 3,
  willpower: 3,
  lore: 2,
  illustrator: "Alice Pisoni",
  number: 78,
  set: "URR",
  rarity: "rare",
};
