import { singerTogetherAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const nothingWeWontDo: LorcanaActionCardDefinition = {
  id: "pm2",
  name: "Nothing We Won't Do",
  characteristics: ["action", "song"],
  text: "Sing Together 8\nReady all your characters. For the rest of this turn, they take no damage from challenges and can't quest.",
  type: "action",
  abilities: [singerTogetherAbility(8)],
  inkwell: true,
  colors: ["ruby"],
  cost: 8,
  illustrator: "Jeanne Plattenet",
  number: 147,
  set: "008",
  rarity: "rare",
};
