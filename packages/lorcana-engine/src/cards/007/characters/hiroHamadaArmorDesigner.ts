import {
  evasiveAbility,
  shiftAbility,
  wardAbility,
} from "@lorcanito/lorcana-engine/abilities/abilities";
import { yourFloodbornCharsThatHaveACardUnder } from "@lorcanito/lorcana-engine/abilities/targets";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const hiroHamadaArmorDesigner: LorcanitoCharacterCard = {
  id: "ney",
  name: "Hiro Hamada",
  title: "Armor Designer",
  characteristics: ["floodborn", "hero", "inventor"],
  text: "Shift 5\nYOU CAN BE WAY MORE Your Floodborn characters that have a card under them gain Evasive and Ward.",
  type: "character",
  abilities: [
    shiftAbility(5, "Hiro Hamada"),
    {
      type: "static",
      ability: "gain-ability",
      name: "YOU CAN BE WAY MORE",
      text: "Your Floodborn characters that have a card under them gain Evasive.",
      gainedAbility: evasiveAbility,
      target: yourFloodbornCharsThatHaveACardUnder,
    },
    {
      type: "static",
      ability: "gain-ability",
      name: "YOU CAN BE WAY MORE",
      text: "Your Floodborn characters that have a card under them gain Ward.",
      gainedAbility: wardAbility,
      target: yourFloodbornCharsThatHaveACardUnder,
    },
  ],
  inkwell: true,
  colors: ["emerald", "sapphire"],
  cost: 7,
  strength: 4,
  willpower: 6,
  illustrator: "Alan Batson",
  number: 96,
  set: "007",
  rarity: "super_rare",
  lore: 3,
};
