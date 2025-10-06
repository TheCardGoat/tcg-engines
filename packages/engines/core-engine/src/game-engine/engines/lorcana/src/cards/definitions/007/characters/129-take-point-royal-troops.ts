import type { StaticAbility } from "~/game-engine/engines/lorcana/src/abilities";
import { whileADamagedCharacterIsInPlay } from "~/game-engine/engines/lorcana/src/abilities/conditions/conditions";
import { thisCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const takePoint: StaticAbility = {
  type: "static",
  name: "TAKE POINT",
  text: "While a damaged character is in play, this character gets +2 {S}.",
  conditions: [whileADamagedCharacterIsInPlay],
  ability: "effects",
  effects: [
    {
      type: "attribute",
      attribute: "strength",
      amount: 2,
      modifier: "add",
      target: thisCharacter,
      duration: "static",
    },
  ],
};

export const cardSoldiersRoyalTroops: LorcanaCharacterCardDefinition = {
  id: "z86",
  name: "Card Soldiers",
  title: "Royal Troops",
  characteristics: ["storyborn", "ally"],
  text: "TAKE POINT While a damaged character is in play, this character gets +2 {S}.",
  type: "character",
  abilities: [takePoint],
  inkwell: true,
  colors: ["ruby"],
  cost: 1,
  strength: 1,
  willpower: 2,
  illustrator: "Kamil Murzyn",
  number: 129,
  set: "007",
  rarity: "common",
  lore: 1,
};
