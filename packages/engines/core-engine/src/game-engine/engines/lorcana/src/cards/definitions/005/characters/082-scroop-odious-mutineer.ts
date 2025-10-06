import type {
  BanishEffect,
  LorcanitoCharacterCard,
} from "@lorcanito/lorcana-engine";
import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import { chosenDamagedCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";

export const scroopOdiousMutineer: LorcanaCharacterCardDefinition = {
  id: "ig9",
  name: "Scroop",
  title: "Odious Mutineer",
  characteristics: ["alien", "sorcerer", "villain", "pirate"],
  text: "**Evasive** _(Only characters with Evasive can challenge this character.)_ **DO SAY HELLO TO MR. ARROW** When you play this character, you may pay 3 {I} to banish chosen damaged character.",
  type: "character",
  abilities: [
    evasiveAbility,
    {
      type: "resolution",
      name: "DO SAY HELLO TO MR. ARROW",
      text: "When you play this character, you may pay 3 {I} to banish chosen damaged character.",
      costs: [{ type: "ink", amount: 3 }],
      optional: true,
      effects: [
        {
          type: "banish",
          target: chosenDamagedCharacter,
        } as BanishEffect,
      ],
    },
  ],
  colors: ["emerald"],
  cost: 3,
  strength: 2,
  willpower: 1,
  lore: 2,
  illustrator: "Justin Runfola",
  number: 82,
  set: "SSK",
  rarity: "super_rare",
};
