import { self } from "@lorcanito/lorcana-engine/abilities/targets";
import type { ActivatedAbility } from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const cogsworthTalkingClock: LorcanaCharacterCardDefinition = {
  id: "ozp",
  name: "Cogsworth",
  title: "Talking Clock",
  characteristics: ["storyborn", "ally"],
  text: "**WAIT A MINUTE** Your character with **Reckless** gain {E} − Gain 1 lore.",
  type: "character",
  abilities: [
    {
      type: "static",
      ability: "gain-ability",
      name: "Wait a Minute",
      text: "Your character with **Reckless** gain {E} − Gain 1 lore.",
      gainedAbility: {
        type: "activated",
        costs: [{ type: "exert" }],
        optional: false,
        name: "Wait a Minute",
        text: "{E} − Gain 1 lore.",
        effects: [
          {
            type: "lore",
            modifier: "add",
            amount: 1,
            target: self,
          },
        ],
      } as ActivatedAbility,
      target: {
        type: "card",
        value: "all",
        filters: [
          { filter: "zone", value: "play" },
          { filter: "type", value: "character" },
          { filter: "owner", value: "self" },
          { filter: "ability", value: "reckless" },
        ],
      },
    },
  ],
  flavour: "This has gone far enough. I'm charge here.",
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  illustrator: "Leonardo Giammichele",
  number: 143,
  set: "ROF",
  rarity: "uncommon",
};
