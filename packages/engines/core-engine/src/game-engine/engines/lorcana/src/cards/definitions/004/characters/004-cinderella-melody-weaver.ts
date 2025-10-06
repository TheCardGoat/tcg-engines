import { singerAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/singerAbility";
import { wheneverThisCharSings } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const cinderellaMelodyWeaver: LorcanitoCharacterCardDefinition = {
  id: "mma",
  name: "Cinderella",
  title: "Melody Weaver",
  characteristics: ["hero", "dreamborn", "princess"],
  text: "**Singer** 9 _(This character counts as cost 9 to sing songs.)_\n\n\n**BEAUTIFUL VOICE** Whenever this character sings a song, your other Princess characters get +1 {L} this turn.",
  type: "character",
  abilities: [
    singerAbility(9),
    wheneverThisCharSings({
      name: "Beautiful Voice",
      text: "Whenever this character sings a song, your other Princess characters get +1 {L} this turn.",
      effects: [
        {
          type: "attribute",
          attribute: "lore",
          amount: 1,
          modifier: "add",
          duration: "turn",
          target: {
            type: "card",
            value: "all",
            excludeSelf: true,
            filters: [
              { filter: "owner", value: "self" },
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
              { filter: "characteristics", value: ["princess"] },
            ],
          },
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 5,
  strength: 1,
  willpower: 5,
  lore: 2,
  illustrator: "Miss Tania Soler",
  number: 4,
  set: "URR",
  rarity: "legendary",
};
