import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
import { challengerAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/challengerAbility";
import { wheneverTargetPlays } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const philoctetesNoNonsenseInstructor: LorcanitoCharacterCardDefinition =
  {
    id: "onn",
    reprints: ["g10"],
    name: "Philoctetes",
    title: "No-Nonsense Instructor",
    characteristics: ["storyborn", "ally"],
    text: "**YOU GOTTA STAY FOCUSED** Your Hero characters gain **Challenger** +1. _(They get +1 {S} while challenging.)_\n\n\n**SHAMELESS PROMOTER** Whenever you play a Hero character, gain 1 lore.",
    type: "character",
    abilities: [
      {
        type: "static",
        ability: "gain-ability",
        name: "You Gotta Stay Focused",
        text: "Your Hero characters gain **Challenger** +1. _(They get +1 {S} while challenging.)_",
        gainedAbility: challengerAbility(1),
        target: {
          type: "card",
          value: "all",
          filters: [
            { filter: "zone", value: "play" },
            { filter: "owner", value: "self" },
            { filter: "characteristics", value: ["hero"] },
          ],
        },
      },
      {
        name: "Shameless Promoter",
        text: "Whenever you play a Hero character, gain 1 lore.",
        ...wheneverTargetPlays({
          triggerFilter: [
            { filter: "type", value: "character" },
            { filter: "characteristics", value: ["hero"] },
            { filter: "owner", value: "self" },
          ],
          effects: [youGainLore(1)],
        }),
      },
    ],
    inkwell: true,
    colors: ["steel"],
    cost: 4,
    strength: 2,
    willpower: 3,
    lore: 2,
    illustrator: "Stefano Spagnuolo",
    number: 190,
    set: "URR",
    rarity: "rare",
  };
