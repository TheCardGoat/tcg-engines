import type {
  GainAbilityStaticAbility,
  LorcanitoCharacterCard,
} from "@lorcanito/lorcana-engine";
import {
  duringYourTurnGains,
  evasiveAbility,
  resistAbility,
} from "~/game-engine/engines/lorcana/src/abilities";

export const grumpySkepticalKnight: LorcanitoCharacterCardDefinition = {
  id: "fmq",
  missingTestCase: true,
  name: "Grumpy",
  title: "Skeptical Knight",
  characteristics: ["dreamborn", "ally", "knight", "seven dwarfs"],
  text: "**BOON OF RESILIENCE** While one of your Knight characters is at a location, that character gains Resist +2. _(Damage dealt to them is reduced by 2)._\n \n**BURST OF SPEED** During your turn, this character gains Evasive. _(They can challenge characters with Evasive.)_",
  type: "character",
  abilities: [
    {
      type: "static",
      ability: "gain-ability",
      name: "Boon of Resilience",
      text: "While one of your Knight characters is at a location, that character gains Resist +2.",
      gainedAbility: resistAbility(2),
      target: {
        type: "card",
        value: "all",
        filters: [
          { filter: "zone", value: "play" },
          { filter: "type", value: "character" },
          { filter: "owner", value: "self" },
          { filter: "status", value: "at-location" },
          { filter: "characteristics", value: ["knight"] },
        ],
      },
    } as GainAbilityStaticAbility,
    duringYourTurnGains(
      "BURST OF SPEED",
      "During your turn, this character gains **Evasive**. _(They can challenge characters with Evasive.)_",
      evasiveAbility,
    ),
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  strength: 3,
  willpower: 1,
  lore: 1,
  illustrator: "Alice Pisoni",
  number: 186,
  set: "SSK",
  rarity: "super_rare",
};
