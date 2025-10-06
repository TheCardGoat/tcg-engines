import { eachOpposingDamagedCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const basilSecretInformer: LorcanaCharacterCardDefinition = {
  id: "zkd",
  name: "Basil",
  title: "Secret Informer",
  characteristics: ["dreamborn", "hero", "detective"],
  text: "DRAW THEM OUT Whenever this character quests, opposing damaged characters gain Reckless during their next turn. (They can't quest and must challenge if able.)",
  type: "character",
  abilities: [
    wheneverQuests({
      name: "DRAW THEM OUT",
      text: "Whenever this character quests, opposing damaged characters gain Reckless during their next turn. (They can't quest and must challenge if able.)",
      effects: [
        {
          type: "ability",
          ability: "reckless",
          modifier: "add",
          duration: "next_turn",
          target: eachOpposingDamagedCharacter,
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 6,
  strength: 3,
  willpower: 6,
  illustrator: "Valerio Buonfantino",
  number: 93,
  set: "007",
  rarity: "rare",
  lore: 3,
};
