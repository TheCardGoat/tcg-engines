import { thisCharacterGetsStrength } from "@lorcanito/lorcana-engine/effects/effects";
import { bodyguardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/bodyguardAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const minnieMouseDaringDefender: LorcanaCharacterCardDefinition = {
  id: "p0a",
  name: "Minnie Mouse",
  title: "Daring Defender",
  characteristics: ["dreamborn", "hero"],
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nTRUE VALOR This character gets +1 {S} for each 1 damage on her.",
  type: "character",
  abilities: [
    bodyguardAbility,
    {
      type: "static",
      ability: "effects",
      effects: [
        thisCharacterGetsStrength({ dynamic: true, sourceAttribute: "damage" }),
      ],
    },
  ],
  inkwell: true,
  colors: ["amber", "ruby"],
  cost: 4,
  strength: 0,
  willpower: 8,
  illustrator: "Aubrey Archer",
  number: 6,
  set: "008",
  rarity: "rare",
  lore: 1,
};
