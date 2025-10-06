import {
  challengerAbility,
  evasiveAbility,
  type GainAbilityStaticAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const tinkerBellPeterPan: LorcanaCharacterCardDefinition = {
  id: "xbz",

  name: "Tinker Bell",
  title: "Peter Pan's Ally",
  characteristics: ["storyborn", "ally", "fairy"],
  text: "**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n**LOYAL AND DEVOTED** Your characters named Peter Pan gain **Challenger +1.** _(They get +1 {S} while challenging.)_",
  type: "character",
  abilities: [
    {
      type: "static",
      name: "Loyal and Devoted",
      text: "Your characters named Peter Pan gain **Challenger +1.** _(They get +1 {S} while challenging.)_",
      ability: "gain-ability",
      gainedAbility: challengerAbility(1),
      target: {
        type: "card",
        value: "all",
        filters: [
          { filter: "zone", value: "play" },
          { filter: "type", value: "character" },
          { filter: "owner", value: "self" },
          {
            filter: "attribute",
            value: "name",
            comparison: { operator: "eq", value: "Peter Pan" },
          },
        ],
      },
    } as GainAbilityStaticAbility,
    evasiveAbility,
  ],
  colors: ["amethyst"],
  cost: 5,
  strength: 3,
  willpower: 3,
  lore: 2,
  illustrator: "Adrianne Gumaya",
  number: 58,
  set: "TFC",
  rarity: "common",
};
