import { wheneverOneOfYouCharactersIsBanished } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const jafarNewlyCrowned: LorcanitoCharacterCardDefinition = {
  id: "zb8",
  name: "Jafar",
  title: "Newly Crowned",
  characteristics: ["dreamborn", "villain", "sorcerer"],
  text: "THIS IS NOT DONE YET During an opponent’s turn, whenever one of your Illusion characters is banished, you may return that card to your hand.",
  type: "character",
  abilities: [
    wheneverOneOfYouCharactersIsBanished({
      name: "THIS IS NOT DONE YET",
      text: "During an opponent's turn, whenever one of your Illusion characters is banished, you may return that card to your hand.",
      optional: true,
      conditions: [{ type: "during-turn", value: "opponent" }],
      triggerTarget: [
        { filter: "type", value: "character" },
        { filter: "characteristics", value: ["illusion"] },
        { filter: "owner", value: "self" },
      ],
      effects: [
        {
          type: "move",
          to: "hand",
          target: {
            type: "card",
            value: "all",
            filters: [{ filter: "source", value: "trigger" }],
          },
        },
      ],
    }),
  ],
  inkwell: true,
  // @ts-expect-error
  color: "",
  colors: ["amethyst", "steel"],
  cost: 4,
  strength: 2,
  willpower: 4,
  illustrator: "John Loren / Nicholas Kole",
  number: 51,
  set: "007",
  rarity: "super_rare",
  lore: 2,
};
