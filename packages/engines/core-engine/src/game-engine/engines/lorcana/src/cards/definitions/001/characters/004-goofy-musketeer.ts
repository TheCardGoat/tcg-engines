import { bodyguardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/bodyguardAbility";
import { whenYouPlayThisCharAbility } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const goofyMusketeer: LorcanaCharacterCardDefinition = {
  id: "vf3",
  name: "Goofy",
  title: "Musketeer",
  characteristics: ["hero", "dreamborn", "musketeer"],
  text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_\n**AND TWO FOR TEA!** When you play this character, you may remove up to 2 damage from each of your Musketeer characters.",
  type: "character",
  abilities: [
    bodyguardAbility,
    whenYouPlayThisCharAbility({
      type: "resolution",
      name: "AND TWO FOR TEA",
      text: "When you play this character, you may remove up to 2 damage from each of your Musketeer characters.",
      optional: true,
      effects: [
        {
          type: "heal",
          amount: 2,
          target: {
            type: "card",
            value: "all",
            filters: [
              { filter: "zone", value: "play" },
              { filter: "owner", value: "self" },
              { filter: "type", value: "character" },
              { filter: "characteristics", value: ["musketeer"] },
            ],
          },
        },
      ],
    }),
  ],
  flavour: "„En gawrsh!",
  inkwell: true,
  colors: ["amber"],
  cost: 5,
  strength: 3,
  willpower: 6,
  lore: 1,
  illustrator: "Jochem Van Gool",
  number: 4,
  set: "TFC",
  rarity: "uncommon",
};
