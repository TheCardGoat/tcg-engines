import type {
  BanishEffect,
  LorcanitoCharacterCard,
} from "@lorcanito/lorcana-engine";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";

export const aladdinBraveRescuer: LorcanitoCharacterCardDefinition = {
  id: "gf4",
  name: "Aladdin",
  title: "Brave Rescuer",
  characteristics: ["hero", "floodborn"],
  text: "**Shift: Discard a location card** _(You may discard a location card to play this on top of one of your characters named Aladdin.)_\n\n**CRASHING THROUGH** Whenever this character quests, you may banish chosen item.",
  type: "character",
  abilities: [
    shiftAbility(
      [
        {
          type: "card",
          action: "discard",
          amount: 1,
          filters: [
            { filter: "zone", value: "hand" },
            { filter: "owner", value: "self" },
            { filter: "type", value: "location" },
          ],
        },
      ],
      "Aladdin",
      "**Shift: Discard a location card** _(You may discard a location card to play this on top of one of your characters named Aladdin.)",
    ),
    wheneverQuests({
      optional: true,
      name: "CRASHING THROUGH",
      text: "Whenever this character quests, you may banish chosen item.",
      effects: [
        {
          type: "banish",
          amount: 1,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "item" },
              { filter: "zone", value: "play" },
            ],
          },
        } as BanishEffect,
      ],
    }),
    {
      name: "**CRASHING THROUGH** Whenever this character quests, you may banish chosen item.",
    },
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  illustrator: "Randy Bishop",
  number: 171,
  set: "URR",
  rarity: "uncommon",
};
