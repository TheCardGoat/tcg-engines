import { charactersWithCostXorLessCantChallenge } from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const gantuGalacticFederationCaptain: LorcanitoCharacterCardDefinition =
  {
    id: "ucw",

    name: "Gantu",
    title: "Galactic Federation Captain",
    characteristics: ["alien", "storyborn", "captain"],
    text: "**Under arrest** Characters with cost 2 or less can't challenge your characters.",
    type: "character",
    abilities: [
      charactersWithCostXorLessCantChallenge({
        name: "Under arrest",
        text: "Characters with cost 2 or less can't challenge your characters.",
        cost: 2,
      }),
    ],
    flavour: '"Relax, enjoy the trip... and don\'t get any ideas!"',
    inkwell: true,
    colors: ["steel"],
    cost: 8,
    strength: 6,
    willpower: 6,
    lore: 2,
    illustrator: "Luis Huerta",
    number: 178,
    set: "TFC",
    rarity: "legendary",
  };
