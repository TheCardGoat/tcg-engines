import { targetCard } from "@lorcanito/lorcana-engine/abilities/targets";
import {
  atEndOfTurnBanishItself,
  shiftAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const madamMimRivalOfMerlin: LorcanaCharacterCardDefinition = {
  id: "esw",
  name: "Madam Mim",
  title: "Rival of Merlin",
  characteristics: ["floodborn", "sorcerer", "villain"],
  text: "**Shift** 3 (_You may pay 3 {I} to play this on top of one of your characters named Madam Mim._)\n\n**GRUESOME AND GRIM** {E} − Play a character with cost 4 or less for free. They gain **Rush**. At the end of the turn, banish them. _They can challenge the turn they're played._",
  type: "character",
  abilities: [
    shiftAbility(3, "madam mim"),
    {
      type: "activated",
      name: "Gruesome and Grim",
      text: "{E} − Play a character with cost 4 or less for free. They gain **Rush**. At the end of the turn, banish them. _They can challenge the turn they're played._",
      optional: false,
      costs: [{ type: "exert" }],
      effects: [
        {
          type: "play",
          forFree: true,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "owner", value: "self" },
              { filter: "zone", value: "hand" },
              { filter: "type", value: "character" },
              {
                filter: "attribute",
                value: "cost",
                comparison: { operator: "lte", value: 4 },
              },
            ],
          },
          afterEffect: [
            {
              type: "create-layer-based-on-target",
              target: targetCard,
              filters: targetCard.filters,
              effects: [
                {
                  type: "ability",
                  ability: "custom",
                  modifier: "add",
                  duration: "turn",
                  customAbility: atEndOfTurnBanishItself,
                  target: targetCard,
                },
                {
                  type: "ability",
                  ability: "rush",
                  modifier: "add",
                  duration: "turn",
                  target: targetCard,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 5,
  strength: 2,
  willpower: 5,
  lore: 2,
  illustrator: "Mane Kandalyan / Pix Smith",
  number: 48,
  set: "ROF",
  rarity: "rare",
};
