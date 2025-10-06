import { bodyguardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/bodyguardAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mickeyMouseMusketeer: LorcanaCharacterCardDefinition = {
  id: "o71",
  name: "Mickey Mouse",
  title: "Musketeer",
  characteristics: ["hero", "dreamborn", "musketeer"],
  text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_\n**ALL FOR ONE** Your other Musketeer characters\rget +1 {S}.",
  type: "character",
  abilities: [
    {
      type: "static",
      ability: "effects",
      name: "All For One",
      text: "Your other Musketeer characters get +1 {S}.",
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 1,
          modifier: "add",
          duration: "turn",
          target: {
            type: "card",
            value: "all",
            excludeSelf: true,
            filters: [
              { filter: "zone", value: "play" },
              { filter: "owner", value: "self" },
              { filter: "characteristics", value: ["musketeer"] },
            ],
          },
        },
      ],
    },
    bodyguardAbility,
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 6,
  strength: 2,
  willpower: 7,
  lore: 2,
  illustrator: "Jochem Van Gool",
  number: 186,
  set: "TFC",
  rarity: "rare",
};
