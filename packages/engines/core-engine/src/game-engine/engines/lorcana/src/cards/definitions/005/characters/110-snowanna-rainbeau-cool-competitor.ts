import { rushAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/rushAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const snowannaRainbeauCoolCompetitor: LorcanitoCharacterCardDefinition =
  {
    id: "ibm",
    name: "Snowanna Rainbeau",
    title: "Cool Competitor",
    characteristics: ["storyborn", "ally", "racer"],
    text: "**Rush** _(This character can challenge the turn they’re played.)_",
    type: "character",
    abilities: [rushAbility],
    flavour: "When it comes to racing, she never gets cold feet.",
    colors: ["ruby"],
    cost: 3,
    strength: 2,
    willpower: 4,
    lore: 1,
    illustrator: "Simangaliso Sibaya",
    number: 110,
    set: "SSK",
    rarity: "common",
  };
