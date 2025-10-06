import { rushAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/rushAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const luisaMadrigalMagicallyStrongOne: LorcanitoCharacterCardDefinition =
  {
    id: "kcf",
    reprints: ["utw"],
    name: "Luisa Madrigal",
    title: "Magically Strong One",
    characteristics: ["storyborn", "ally", "madrigal"],
    text: "**Rush** _(This character can challenge the turn they're played.)_",
    type: "character",
    abilities: [rushAbility],
    flavour: '"This rock? No problem. Go get that prophecy, hermana!"',
    colors: ["amethyst"],
    cost: 4,
    strength: 4,
    willpower: 3,
    lore: 1,
    illustrator: "Juan Diego Leon",
    number: 47,
    set: "URR",
    rarity: "common",
  };
