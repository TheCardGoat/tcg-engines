import { lookAtTopCardOfYourDeckAndPutItOnTopOrBottom } from "@lorcanito/lorcana-engine/effects/effects";
import {
  exertItemCost,
  shiftAbility,
  wardAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const auroraLoreGuardian: LorcanaCharacterCardDefinition = {
  id: "i4c",
  name: "Aurora",
  title: "Lore Guardian",
  characteristics: ["hero", "floodborn", "princess"],
  text: "**Shift** 2 _(You may pay 2 ink to play this on top of one of your characters named Aurora.)_\n\n\n**GUARDIAN** Opponents can't choose your items.\n\n\n**ROYAL INVENTORY** {E} one of your items – look at the top card of your deck. Put it on either the top or the bottom of your deck.",
  type: "character",
  abilities: [
    shiftAbility(2, "Aurora"),
    {
      type: "static",
      ability: "gain-ability",
      name: "GUARDIAN",
      text: "Opponents can't choose your items.",
      gainedAbility: wardAbility,
      target: {
        type: "card",
        value: "all",
        filters: [
          { filter: "zone", value: "play" },
          { filter: "type", value: "item" },
          { filter: "owner", value: "self" },
        ],
      },
    },
    {
      type: "activated",
      name: "ROYAL INVENTORY",
      costs: [exertItemCost(1)],
      text: "{E} one of your items – look at the top card of your deck. Put it on either the top or the bottom of your deck.",
      effects: [lookAtTopCardOfYourDeckAndPutItOnTopOrBottom],
    },
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  illustrator: "Koni",
  number: 140,
  set: "URR",
  rarity: "super_rare",
};
