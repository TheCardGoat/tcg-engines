import {
  supportAbility,
  wardAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const wendyDarlingAuthorityOnPeterPan: LorcanitoCharacterCardDefinition =
  {
    id: "s1z",
    name: "Wendy Darling",
    title: "Authority on Peter Pan",
    characteristics: ["hero", "storyborn"],
    text: "**Ward** _(Opponents can't choose this character except to challenge.)_\n\n**Support** _(Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)_",
    type: "character",
    abilities: [wardAbility, supportAbility],
    inkwell: true,
    colors: ["sapphire"],
    cost: 3,
    strength: 3,
    willpower: 1,
    lore: 2,
    illustrator: "Julie Vu",
    number: 158,
    set: "ITI",
    rarity: "super_rare",
  };
