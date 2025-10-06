import type {
  LorcanitoCharacterCard,
  TargetFilter,
} from "@lorcanito/lorcana-engine";
import { self } from "@lorcanito/lorcana-engine/abilities/targets";
import {
  shiftAbility,
  singerAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import { wheneverThisCharSings } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";

const filters: TargetFilter[] = [
  {
    filter: "attribute",
    value: "cost",
    comparison: { operator: "lte", value: 9 },
  },
  { filter: "owner", value: "self" },
  { filter: "zone", value: "deck" },
  { filter: "characteristics", value: ["song"] },
];

export const powerlineWorldsGreatestRockStar: LorcanitoCharacterCardDefinition =
  {
    id: "ia6",
    name: "Powerline",
    title: "World's Greatest Rock Star",
    characteristics: ["floodborn"],
    text: "Shift 4 {I} (You may pay 4 {I} to play this on top of one of your characters named Powerline.)\nSinger 9\nMASH-UP Once during your turn, whenever this character sings a song, look at the top 4 cards of your deck. You may reveal a song card with cost 9 or less and play it for free. Put the rest on the bottom of your deck in any order.",
    type: "character",
    inkwell: true,
    colors: ["ruby"],
    cost: 6,
    strength: 6,
    willpower: 4,
    illustrator: "Nicholas Kole",
    number: 110,
    set: "009",
    rarity: "super_rare",
    abilities: [
      shiftAbility(4, "Powerline"),
      singerAbility(9),
      wheneverThisCharSings({
        name: "MASH-UP",
        text: "Once during your turn, whenever this character sings a song, look at the top 4 cards of your deck. You may reveal a song card with cost 9 or less and play it for free. Put the rest on the bottom of your deck in any order.",
        oncePerTurn: true,
        effects: [
          {
            type: "scry",
            amount: 4,
            mode: "bottom",
            target: self,
            limits: {
              bottom: 4,
              play: 1,
              top: 0,
              inkwell: 0,
            },
            playFilters: filters,
            tutorFilters: filters,
          },
        ],
      }),
    ],
    lore: 2,
  };
