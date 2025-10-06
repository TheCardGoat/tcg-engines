import { opponent } from "@lorcanito/lorcana-engine/abilities/targets";
import { whenYourOtherCharactersIsBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const kingCandyRoyalRacer: LorcanaCharacterCardDefinition = {
  id: "fv1",
  name: "King Candy",
  title: "Royal Racer",
  characteristics: ["storyborn", "villain", "king", "racer"],
  text: "SWEET REVENGE Whenever one of your other Racer characters is banished, each opponent chooses and banishes one of their characters.",
  type: "character",
  abilities: [
    whenYourOtherCharactersIsBanished({
      name: "SWEET REVENGE",
      text: "Whenever one of your other Racer characters is banished, each opponent chooses and banishes one of their characters.",
      triggerTarget: [
        { filter: "type", value: "character" },
        { filter: "characteristics", value: ["racer"] },
        { filter: "owner", value: "self" },
      ],
      effects: [
        {
          type: "create-layer-for-player",
          target: opponent,
          layer: {
            type: "resolution",
            name: "Sweet Revenge",
            text: "Choose and banish one of your characters.",
            responder: "opponent",
            effects: [
              {
                type: "banish",
                target: {
                  type: "card",
                  value: 1,
                  filters: [
                    { filter: "type", value: "character" },
                    { filter: "zone", value: "play" },
                    { filter: "owner", value: "self" },
                  ],
                },
              },
            ],
          },
        },
      ],
    }),
  ],
  inkwell: false,
  // @ts-expect-error
  color: "",
  colors: ["amber", "ruby"],
  cost: 4,
  strength: 2,
  willpower: 2,
  illustrator: "Stefano Spagnuolo",
  number: 20,
  set: "007",
  rarity: "super_rare",
  lore: 2,
};
