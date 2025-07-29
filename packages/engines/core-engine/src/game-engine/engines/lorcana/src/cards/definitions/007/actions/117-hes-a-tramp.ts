import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { hesATrampAbility } from "~/game-engine/engines/lorcana/src/cards/definitions/007/abilities";

export type LorcanaActionCardDefinition = any;

export const hesATramp: LorcanaActionCardDefinition = {
  id: "s0z",
  name: "He's A Tramp",
  characteristics: ["action", "song"],
  text: "(A character with cost 1 or more can {E} to sing this song for free.)\nChosen character gets +1 {S} this turn for each character you have in play.",
  type: "action",
  abilities: [hesATrampAbility],
  inkwell: true,
  colors: ["emerald"],
  cost: 1,
  illustrator: "Isaiah Mesq",
  number: 117,
  set: "007",
  rarity: "common",
};
