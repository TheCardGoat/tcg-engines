import { propertyStaticAbilities } from "@lorcanito/lorcana-engine/abilities/propertyStaticAbilities";
import { resistAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/resistAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const magicBroomBrigadeCommander: LorcanaCharacterCardDefinition = {
  id: "arp",
  missingTestCase: true,
  name: "Magic Broom",
  title: "Brigade Commander",
  characteristics: ["dreamborn", "broom"],
  text: "**Resist** +1 _(Damage dealt to this character is reduced by 1.)_\n\n**ARMY OF BROOMS** This character gets +2 {S} for each other Broom character you have in play.",
  type: "character",
  abilities: [
    resistAbility(1),
    propertyStaticAbilities({
      name: "Army Of Brooms",
      text: "This character gets +1 {S} for each other Broom character you have in play.",
      attribute: "strength",
      amount: {
        dynamic: true,
        excludeSelf: true,
        filterMultiplier: 2,
        filters: [
          { filter: "zone", value: "play" },
          { filter: "owner", value: "self" },
          { filter: "type", value: "character" },
          { filter: "characteristics", value: ["broom"] },
        ],
      },
    }),
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 6,
  strength: 2,
  willpower: 6,
  lore: 2,
  illustrator: "Otto Paredes",
  number: 186,
  set: "URR",
  rarity: "super_rare",
};
