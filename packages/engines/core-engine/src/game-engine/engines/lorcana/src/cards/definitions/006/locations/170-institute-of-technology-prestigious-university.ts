import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
import { atTheStartOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
import { ifYouHaveACharacterHere } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
import { gainAbilityWhileHere } from "~/game-engine/engines/lorcana/src/abilities";

export const instituteOfTechnologyPrestigiousUniversity: LorcanaLocationCardDefinition =
  {
    id: "hsg",
    name: "Institute of Technology",
    title: "Prestigious University",
    characteristics: ["location"],
    text: "WELCOME TO THE LAB Inventor characters get +1 {W} while here.\nPUSH THE BOUNDARIES At the start of your turn, if you have a character here, gain 1 lore.",
    type: "location",
    abilities: [
      atTheStartOfYourTurn({
        name: "Push the Boundaries",
        text: "At the start of your turn, if you have a character here, gain 1 lore.",
        conditions: [ifYouHaveACharacterHere],
        effects: [youGainLore(1)],
      }),
      gainAbilityWhileHere({
        name: "Welcome to the Lab",
        text: "Characters get +1 {W} while here.",
        ability: {
          type: "static",
          ability: "effects",
          effects: [
            {
              type: "attribute",
              attribute: "willpower",
              amount: 1,
              modifier: "add",
              duration: "static",
              target: thisCharacter,
            },
          ],
        },
      }),
    ],
    inkwell: true,
    colors: ["sapphire"],
    cost: 1,
    moveCost: 1,
    willpower: 5,
    illustrator: "Gabe",
    number: 170,
    set: "006",
    rarity: "common",
  };
