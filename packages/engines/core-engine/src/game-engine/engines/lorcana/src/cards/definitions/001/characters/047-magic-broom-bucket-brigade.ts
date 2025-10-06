import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const magicBroomBucketBrigade: LorcanaCharacterCardDefinition = {
  id: "zyc",
  name: "Magic Broom",
  title: "Bucket Brigade",
  characteristics: ["dreamborn", "broom"],
  text: "**SWEEP** When you play this character, you may shuffle a card from any discard into its player's deck.",
  type: "character",
  abilities: [
    whenYouPlayThisCharAbility({
      type: "resolution",
      optional: true,
      name: "SWEEP",
      text: "When you play this character, you may shuffle a card from any discard into its player's deck.",
      effects: [
        {
          type: "shuffle",
          target: {
            type: "card",
            value: 1,
            filters: [{ filter: "zone", value: "discard" }],
          },
        },
      ],
    }),
  ],
  flavour:
    "In the immense story-forge known as the Great Illuminary, there is always work to be done.",
  inkwell: true,
  colors: ["amethyst"],
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  illustrator: "Dav Augereau / Guykua Ruva",
  number: 47,
  set: "TFC",
  rarity: "common",
};
