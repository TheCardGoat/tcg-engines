import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import { chosenOpposingCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { wheneverPlays } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mickeyMouseArtfulRogue: LorcanaCharacterCardDefinition = {
  id: "dul",
  name: "Mickey Mouse",
  title: "Artful Rogue",
  characteristics: ["hero", "floodborn"],
  type: "character",
  text: "**Shift** 5 (_You may pay 5 {I} to play this on top of one of your characters named Tinker Bell._)\n**MISDIRECTION** Whenever you play an action, chosen opposing character can't quest during their next turn.",
  abilities: [
    shiftAbility(5, "Mickey Mouse"),
    wheneverPlays({
      name: "Misdirection",
      text: "Whenever you play an action, chosen opposing character can't quest during their next turn.",
      triggerTarget: {
        type: "card",
        value: 1,
        filters: [
          { filter: "type", value: "action" },
          { filter: "characteristics", value: ["action"] },
          { filter: "owner", value: "self" },
        ],
      },
      effects: [
        {
          type: "restriction",
          restriction: "quest",
          duration: "next_turn",
          until: true,
          target: chosenOpposingCharacter,
        },
      ],
    }),
  ],
  flavour: "Quiet as a . . . well, you know.",
  colors: ["emerald"],
  cost: 7,
  strength: 6,
  willpower: 5,
  lore: 2,
  illustrator: "Alex Accorsi",
  number: 88,
  set: "TFC",
  rarity: "super_rare",
};
