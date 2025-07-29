import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { soMuchToGiveAbility } from "~/game-engine/engines/lorcana/src/cards/definitions/007/abilities";

export const soMuchToGive: LorcanaActionCardDefinition = {
  id: "qi0",
  name: "So Much To Give",
  characteristics: ["song", "action"],
  text: "(A character with cost 2 or more can {E} to sing this song for free.)\nDraw a card. Chosen character gains Bodyguard until the start of your next turn.",
  type: "action",
  abilities: [soMuchToGiveAbility],
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  illustrator: "Andrea Femerstrand",
  number: 38,
  set: "007",
  rarity: "common",
};
