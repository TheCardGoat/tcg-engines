import { readyAndCantQuest } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { wheneverPlays } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const goofyMusketeerSwordsman: LorcanaCharacterCardDefinition = {
  id: "moa",
  name: "Goofy",
  title: "Musketeer Swordsman",
  characteristics: ["hero", "dreamborn", "musketeer"],
  text: "**EN GAWRSH!** Whenever you play a character with **Bodyguard**, ready this character. He can't quest for the rest of this turn.",
  type: "character",
  abilities: [
    wheneverPlays({
      name: "**EN GAWRSH!**",
      text: "Whenever you play a character with **Bodyguard**, ready this character. He can't quest for the rest of this turn.",
      triggerTarget: {
        type: "card",
        value: 1,
        filters: [
          { filter: "owner", value: "self" },
          {
            filter: "ability",
            value: "bodyguard",
          },
        ],
      },
      effects: [
        ...readyAndCantQuest({
          type: "card",
          value: "all",
          filters: [{ filter: "source", value: "self" }],
        }),
      ],
    }),
  ],
  flavour: "Count me in!",
  colors: ["amber"],
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  illustrator: "Carlos Luzzi",
  number: 12,
  set: "URR",
  rarity: "rare",
};
