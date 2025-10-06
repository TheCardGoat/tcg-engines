import { self } from "@lorcanito/lorcana-engine/abilities/targets";
import { whenMovesToALocation } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const peterPanLostBoyLeader: LorcanitoCharacterCardDefinition = {
  id: "twu",
  name: "Peter Pan",
  title: "Lost Boy Leader",
  characteristics: ["hero", "dreamborn"],
  text: "**I CAME TO LISTEN TO THE STORIES** Once per turn, when this character moves to a location, gain lore equal to that location's {L}.",
  type: "character",
  abilities: [
    whenMovesToALocation({
      name: "I Came to Listen to the Stories",
      text: "Once per turn, when this character moves to a location, gain lore equal to that location's {L}.",
      oncePerTurn: true,
      effects: [
        {
          type: "lore",
          modifier: "add",
          target: self,
          resolveAmountBeforeCreatingLayer: true,
          amount: {
            dynamic: true,
            targetLocation: { attribute: "lore" },
          },
        },
      ],
    }),
  ],
  flavour:
    "The Illumineers needed someone to find a missing spellbook, and Peter was the first to volunteer.",
  inkwell: true,
  colors: ["emerald"],
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  illustrator: "Grace Tran",
  number: 82,
  set: "ITI",
  rarity: "rare",
};
