import { atTheStartOfYourTurn } from "~/game-engine/engines/lorcana/src/abilities/atTheAbilities";
import { putTopCardOfYourDeckIntoYourInkwellExerted } from "~/game-engine/engines/lorcana/src/abilities/effect";
import type { LorcanaLocationCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const rescueRangersSubmarineMobileHeadquarters: LorcanaLocationCardDefinition =
  {
    id: "hwj",
    name: "Rescue Rangers Submarine",
    title: "Mobile Headquarters",
    characteristics: ["location"],
    text: "PLANNING SESSION At the start of your turn, if you have a character here, you may put the top card of your deck into your inkwell facedown and exerted.",
    type: "location",
    abilities: [
      atTheStartOfYourTurn({
        name: "Planning Session",
        text: "At the start of your turn, if you have a character here, you may put the top card of your deck into your inkwell facedown and exerted.",
        optional: true,
        conditions: [
          {
            type: "chars-at-location",
            comparison: { operator: "gte", value: 1 },
          },
        ],
        effects: [putTopCardOfYourDeckIntoYourInkwellExerted],
      }),
    ],
    inkwell: true,
    colors: ["sapphire"],
    cost: 2,
    moveCost: 1,
    willpower: 8,
    illustrator: "Geoffrey Boudout",
    number: 169,
    set: "006",
    rarity: "rare",
  };
