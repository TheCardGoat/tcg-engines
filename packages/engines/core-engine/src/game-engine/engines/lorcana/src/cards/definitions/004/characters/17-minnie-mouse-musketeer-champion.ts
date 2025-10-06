import { bodyguardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/bodyguardAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const minnieMouseMusketeerChampion: LorcanitoCharacterCardDefinition = {
  id: "mkk",
  name: "Minnie Mouse",
  title: "Musketeer Champion",
  characteristics: ["hero", "dreamborn", "musketeer"],
  text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your character must chose one with Bodyguard if able.)_\n\n\n**DRAMATIC ENTERANCE** When you play this character, banish chosen opposing character with 5  {S} or more.",
  type: "character",
  abilities: [
    bodyguardAbility,
    {
      type: "resolution",
      name: "DRAMATIC ENTERANCE",
      text: "When you play this character, banish chosen opposing character with 5  {S} or more.",
      effects: [
        {
          type: "banish",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
              {
                filter: "attribute",
                value: "strength",
                comparison: { operator: "gte", value: 5 },
              },
              { filter: "owner", value: "opponent" },
            ],
          },
        },
      ],
    },
  ],
  colors: ["amber"],
  cost: 5,
  strength: 1,
  willpower: 5,
  lore: 2,
  illustrator: "Leonardo Giammichele",
  number: 17,
  set: "URR",
  rarity: "super_rare",
};
