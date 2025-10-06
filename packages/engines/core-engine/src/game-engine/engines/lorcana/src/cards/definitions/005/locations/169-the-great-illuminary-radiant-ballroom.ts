import { gainAbilityWhileHere } from "~/game-engine/engines/lorcana/src/abilities";
import { thisCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaLocationCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const theGreatIlluminaryRadiantBallroom: LorcanaLocationCardDefinition =
  {
    id: "wys",
    name: "The Great Illuminary",
    title: "Radiant Ballroom",
    characteristics: ["location"],
    text: "**WARM WELCOME** Characters with **Support** get +1 {L} and +2 {W} while here.",
    type: "location",
    abilities: [
      gainAbilityWhileHere({
        name: "Warm Welcome",
        text: "Characters with **Support** get +1 {L} and +2 {W} while here.",
        target: {
          type: "card",
          value: "all",
          excludeSelf: true,
          filters: [
            {
              filter: "location",
              value: "source",
            },
            { filter: "ability", value: "support" },
            { filter: "zone", value: "play" },
            { filter: "type", value: "character" },
          ],
        },
        ability: {
          type: "static",
          ability: "effects",
          effects: [
            {
              type: "attribute",
              attribute: "willpower",
              amount: 2,
              modifier: "add",
              duration: "static",
              target: thisCharacter,
            },
            {
              type: "attribute",
              attribute: "lore",
              amount: 1,
              modifier: "add",
              duration: "static",
              target: thisCharacter,
            },
          ],
        },
      }),
    ],
    flavour: "Every surface glows with the joy of celebration.",
    inkwell: true,
    colors: ["sapphire"],
    cost: 3,
    willpower: 9,
    illustrator: "Carlos Ruiz",
    number: 169,
    set: "SSK",
    rarity: "rare",
    moveCost: 2,
  };
