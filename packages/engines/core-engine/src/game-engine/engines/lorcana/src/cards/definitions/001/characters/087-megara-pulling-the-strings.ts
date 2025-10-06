import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const megaraPullingTheStrings: LorcanaCharacterCardDefinition = {
  id: "kv6",
  reprints: ["g7m"],
  name: "Megara",
  title: "Pulling the Strings",
  characteristics: ["dreamborn", "ally"],
  text: "**WONDER BOY** When you play this character, chosen character gets +2 {S} this turn.",
  type: "character",
  illustrator: "Aubrey Archer",
  abilities: [
    whenYouPlayThisCharAbility({
      type: "resolution",
      name: "Wonder Boy",
      text: "When you play this character, chosen character gets +2 {S} this turn.",
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 2,
          modifier: "add",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
            ],
          },
        },
      ],
    }),
  ],
  flavour:
    "A deal's a deal. But falling in love was never supposed to be part of it.",
  inkwell: true,
  colors: ["emerald"],
  cost: 2,
  strength: 2,
  willpower: 1,
  lore: 1,
  number: 87,
  set: "TFC",
  rarity: "common",
};
