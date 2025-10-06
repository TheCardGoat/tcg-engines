import { whenThisCharacterBanishedInAChallenge } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const heiheiPersistentPresence: LorcanaCharacterCardDefinition = {
  id: "anm",

  name: "HeiHei",
  title: "Persistent Presence",
  characteristics: ["dreamborn", "ally"],
  text: "**HE'S BACK!** When this character is banished in a challenge, return this card to your hand.",
  type: "character",
  abilities: [
    whenThisCharacterBanishedInAChallenge({
      name: "He's Back",
      text: "When this character is banished in a challenge, return this card to your hand.",
      effects: [
        {
          type: "move",
          to: "hand",
          target: {
            type: "card",
            value: "all",
            filters: [{ filter: "source", value: "self" }],
          },
        },
      ],
    }),
  ],
  flavour: "Power. Beauty. HeiHei.",
  inkwell: true,
  colors: ["amethyst"],
  cost: 2,
  strength: 2,
  willpower: 1,
  lore: 1,
  illustrator: "Ellie Horie",
  number: 43,
  set: "ROF",
  rarity: "uncommon",
};
