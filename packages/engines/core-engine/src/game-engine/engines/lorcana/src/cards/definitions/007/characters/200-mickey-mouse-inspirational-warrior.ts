import { duringYourTurnWheneverBanishesCharacterInChallenge } from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mickeyMouseInspirationalWarrior: LorcanitoCharacterCardDefinition =
  {
    id: "khu",
    name: "Mickey Mouse",
    title: "Inspirational Warrior",
    characteristics: ["dreamborn", "hero"],
    type: "character",
    inkwell: false,
    colors: ["steel"],
    cost: 2,
    strength: 1,
    willpower: 1,
    illustrator: "Leonardo Giammichele",
    number: 200,
    set: "007",
    rarity: "legendary",
    lore: 1,
    text: "STIRRING SPIRIT During your turn, whenever this character banishes another character in a challenge, you may play a character for free.",
    abilities: [
      duringYourTurnWheneverBanishesCharacterInChallenge({
        name: "STIRRING SPIRIT",
        text: "During your turn, whenever this character banishes another character in a challenge, you may play a character for free.",
        effects: [
          {
            type: "play",
            forFree: true,
            target: {
              type: "card",
              value: 1,
              filters: [
                { filter: "type", value: "character" },
                { filter: "zone", value: "hand" },
                { filter: "owner", value: "self" },
              ],
            },
          },
        ],
      }),
    ],
  };
