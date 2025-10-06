import type { BanishTrigger } from "@lorcanito/lorcana-engine/abilities/triggers";
import type { TriggeredAbility } from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const musketeerTabard: LorcanaItemCardDefinition = {
  characteristics: ["item"],
  id: "j3v",

  name: "Musketeer Tabard",
  text: "**ALL FOR ONE AND ONE FOR ALL** Whenever one of your characters with **Bodyguard** is banished, you may draw a card.",
  type: "item",
  abilities: [
    {
      type: "static-triggered",
      optional: false,
      trigger: {
        on: "banish",
        filters: [
          { filter: "owner", value: "self" },
          { filter: "type", value: "character" },
          { filter: "ability", value: "bodyguard" },
        ],
      } as BanishTrigger,
      layer: {
        type: "resolution",
        optional: true,
        effects: [
          {
            type: "draw",
            amount: 1,
            target: {
              type: "player",
              value: "self",
            },
          },
        ],
      },
    } as TriggeredAbility,
  ],
  flavour: "There's no such thing as a lone musketeer.",
  colors: ["steel"],
  cost: 4,
  illustrator: "Dav Augereau / Guykua Ruva",
  number: 203,
  set: "TFC",
  rarity: "rare",
};
