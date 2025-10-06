import {
  bodyguardAbility,
  evasiveAbility,
  type GainAbilityStaticAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const donaldDuckMusketeer: LorcanaCharacterCardDefinition = {
  id: "xnp",
  name: "Donald Duck",
  title: "Musketeer",
  characteristics: ["hero", "dreamborn", "musketeer"],
  text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_\n\n**STAY ALERT!** During your turn, your Musketeer characters gain **Evasive.** _(They can challenge characters with Evasive.)_",
  type: "character",
  abilities: [
    {
      type: "static",
      ability: "gain-ability",
      name: "Stay Alert!",
      text: "During your turn, your Musketeer characters gain **Evasive.** _(They can challenge characters with Evasive.)_",
      gainedAbility: evasiveAbility,
      conditions: [{ type: "during-turn", value: "self" }],
      target: {
        type: "card",
        value: "all",
        filters: [
          { filter: "zone", value: "play" },
          { filter: "owner", value: "self" },
          { filter: "characteristics", value: ["musketeer"] },
        ],
      },
    } as GainAbilityStaticAbility,
    bodyguardAbility,
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 1,
  illustrator: "Dav Augereau / Guykua Ruva",
  number: 177,
  set: "TFC",
  rarity: "uncommon",
};
