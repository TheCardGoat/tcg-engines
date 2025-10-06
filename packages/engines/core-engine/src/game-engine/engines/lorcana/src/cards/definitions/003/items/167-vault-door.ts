import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
import { resistAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/resistAbility";

export const vaultDoor: LorcanaItemCardDefinition = {
  id: "doz",
  name: "Vault Door",
  characteristics: ["item"],
  text: "**SEALED AWAY** Your locations and character at locations gain **Resist** +1. _(Damage dealt to them is reduced by 1.)_",
  type: "item",
  abilities: [
    {
      type: "static",
      ability: "gain-ability",
      name: "Sealed Away",
      text: "Your locations and character at locations gain **Resist** +1",
      gainedAbility: resistAbility(1),
      target: {
        type: "card",
        value: "all",
        filters: [
          {
            filter: "type",
            value: "location",
          },
          { filter: "owner", value: "self" },
        ],
      },
    },
    {
      type: "static",
      ability: "gain-ability",
      name: "Sealed Away",
      text: "Your locations and character at locations gain **Resist** +1",
      gainedAbility: resistAbility(1),
      target: {
        type: "card",
        value: "all",
        filters: [
          { filter: "owner", value: "self" },
          {
            filter: "type",
            value: "character",
          },
          {
            filter: "status",
            value: "at-location",
          },
        ],
      },
    },
  ],
  flavour:
    "Only Scrooge knows about this vault. And he's going to keep it that way.",
  inkwell: true,
  colors: ["sapphire"],
  cost: 4,
  illustrator: "Nicolas Ky",
  number: 167,
  set: "ITI",
  rarity: "common",
};
