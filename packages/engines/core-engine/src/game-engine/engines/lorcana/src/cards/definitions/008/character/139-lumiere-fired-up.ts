import {
  evasiveAbility,
  shiftAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import { thisCharacterGetsLore } from "~/game-engine/engines/lorcana/src/abilities/effect";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const lumiereFiredUp: LorcanaCharacterCardDefinition = {
  id: "goi",
  name: "Lumiere",
  title: "Fired Up",
  characteristics: ["floodborn", "ally"],
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Lumiere.)\nEvasive (Only characters with Evasive can challenge this character.)\nSACREBLEU!: Whenever one of your items is banished, this character gets +1 {L} this turn.",
  type: "character",
  abilities: [
    shiftAbility(3, "Lumiere"),
    evasiveAbility,
    {
      type: "resolution",
      name: "SACREBLEU!",
      text: "Whenever one of your items is banished, this character gets +1 {L} this turn.",
      trigger: {
        on: "banish",
        filters: [
          { filter: "type", value: "item" },
          { filter: "owner", value: "self" },
        ],
      },
      effects: [thisCharacterGetsLore(1)],
    } as any,
  ],
  inkwell: true,
  colors: ["ruby", "sapphire"],
  cost: 5,
  strength: 4,
  willpower: 3,
  illustrator: "Justin Runfola",
  number: 139,
  set: "008",
  rarity: "super_rare",
  lore: 2,
};
