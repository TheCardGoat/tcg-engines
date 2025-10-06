import {
  shiftAbility,
  wardAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const auroraDreamingGuardian: LorcanitoCharacterCardDefinition = {
  id: "wb5",
  reprints: ["kjf"],

  name: "Aurora",
  title: "Dreaming Guardian",
  characteristics: ["hero", "floodborn", "princess"],
  text: "**Shift** 3 (_You may pay 3 {I} to play this on top of one of your characters named Aurora._)\n**Protective Embrace** Your other characters gain **Ward**. _(Opponents can't choose them except to challenge.)_",
  type: "character",
  abilities: [
    {
      type: "static",
      ability: "gain-ability",
      name: "Protective Embrace",
      text: "Your other characters gain **Ward**. _(Opponents can't choose them except to challenge.)_",
      gainedAbility: wardAbility,
      target: {
        type: "card",
        value: "all",
        excludeSelf: true,
        filters: [
          { filter: "zone", value: "play" },
          { filter: "type", value: "character" },
          { filter: "owner", value: "self" },
        ],
      },
    },
    shiftAbility(3, "Aurora"),
  ],
  flavour: "As the princess slumbered, her power awoke.",
  inkwell: true,
  colors: ["sapphire"],
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  illustrator: "Nicholas Kole",
  number: 139,
  set: "TFC",
  rarity: "super_rare",
};
