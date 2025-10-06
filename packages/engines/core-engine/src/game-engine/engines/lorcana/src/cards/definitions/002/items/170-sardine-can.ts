import type { GainAbilityStaticAbility } from "~/game-engine/engines/lorcana/src/abilities";
import { wardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/wardAbility";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const sardineCan: LorcanaItemCardDefinition = {
  id: "sdr",

  name: "Sardine Can",
  characteristics: ["item"],
  text: "**FLIGHT CABIN** Your exerted characters gain **Ward**. _(Opponents can't choose them except to challenge.)_",
  type: "item",
  abilities: [
    {
      type: "static",
      ability: "gain-ability",
      name: "Flight Cabin",
      text: "Your exerted characters gain **Ward**.",
      gainedAbility: wardAbility,
      target: {
        type: "card",
        value: "all",
        filters: [
          { filter: "owner", value: "self" },
          { filter: "zone", value: "play" },
          { filter: "type", value: "character" },
          { filter: "status", value: "exerted" },
        ],
      },
    } as GainAbilityStaticAbility,
  ],
  flavour: "Flight 3759 boarding now! Let's go get that lore! \n–Orville",
  inkwell: true,
  colors: ["sapphire"],
  cost: 4,
  illustrator: "Peter Brockhammer",
  number: 170,
  set: "ROF",
  rarity: "uncommon",
};
