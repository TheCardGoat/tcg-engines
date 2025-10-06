import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const winnieThePoohHavingAThink: LorcanitoCharacterCardDefinition = {
  id: "o3g",
  reprints: ["vvd"],

  name: "Winnie the Pooh",
  title: "Having a Think",
  characteristics: ["hero", "storyborn"],
  text: "**HUNNY POT** Whenever this character quests, you may put a card from your hand into your inkwell facedown.",
  type: "character",
  abilities: [
    wheneverQuests({
      name: "Hunny Pot",
      text: "Whenever this character quests, you may put a card from your hand into your inkwell facedown.",
      optional: true,
      effects: [
        {
          type: "move",
          to: "inkwell",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "zone", value: "hand" },
              { filter: "owner", value: "self" },
            ],
          },
        },
      ],
    }),
  ],
  flavour:
    "When he thought, he thought in the most thoughtful way he could think.",
  inkwell: true,
  colors: ["sapphire"],
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  illustrator: "Rianti Hidayat",
  number: 161,
  set: "ROF",
  rarity: "rare",
};
