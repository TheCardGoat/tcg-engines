import { opponentCharactersLoseStrengthUntilNextTurn } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";

import { wheneverYouPlayAnotherPrincess } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const vanellopeVonSchweetzSugarRushPrincess: LorcanaCharacterCardDefinition =
  {
    id: "tiv",
    name: "Vanellope von Schweetz",
    title: "Sugar Rush Princess",
    characteristics: ["hero", "floodborn", "princess", "racer"],
    text: "**Shift** 2 _You may pay 2 {I} to play this on top of one of your characters named Vanellope von Schweetz.)_\n \n**I HEARBY DECREE** Whenever you play another Princess character, all opposing characters get -1 {S} until the start of your next turn.",
    type: "character",
    abilities: [
      shiftAbility(2, "Vanellope von Schweetz"),
      wheneverYouPlayAnotherPrincess({
        name: "I HEARBY DECREE",
        text: "Whenever you play another Princess character, all opposing characters get -1 {S} until the start of your next turn.",
        effects: [opponentCharactersLoseStrengthUntilNextTurn(1)],
      }),
    ],
    inkwell: true,
    colors: ["amber"],
    cost: 4,
    strength: 2,
    willpower: 4,
    lore: 2,
    illustrator: "Vanessa Morales",
    number: 19,
    set: "SSK",
    rarity: "rare",
  };
