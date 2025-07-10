import { whenPlayOnThisCard } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
import type { CardEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";

const shifter: CardEffectTarget["filters"] = [
  { filter: "owner", value: "self" },
  { filter: "type", value: "character" },
  { filter: "characteristics", value: ["floodborn"] },
];

const shifted: CardEffectTarget["filters"] = [
  { filter: "source", value: "self" },
];

export const hiroHamadaFutureChampion: LorcanitoCharacterCard = {
  id: "mc6",
  name: "Hiro Hamada",
  title: "Future Champion",
  characteristics: ["storyborn", "hero", "inventor"],
  text: "ORIGIN STORY When you play a Floodborn character on this card, draw a card.",
  type: "character",
  abilities: [
    whenPlayOnThisCard({
      name: "ORIGIN STORY",
      text: "When you play a Floodborn character on this card, draw a card.",
      effects: [drawACard],
      shifterTargetFilters: shifter,
      shiftedTargetFilters: shifted,
    }),
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  strength: 3,
  willpower: 3,
  illustrator: "Jennifer Wu",
  number: 90,
  set: "007",
  rarity: "common",
  lore: 1,
};
