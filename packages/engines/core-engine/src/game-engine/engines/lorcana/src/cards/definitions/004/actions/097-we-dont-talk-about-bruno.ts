import {
  chosenCharacter,
  thisCharacter,
} from "@lorcanito/lorcana-engine/abilities/targets";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const weDontTalkAboutBruno: LorcanaActionCardDefinition = {
  id: "wwi",
  name: "We Don't Talk About Bruno",
  characteristics: ["action", "song"],
  text: "Return chosen character to their player's hand, then that player discards a card at random.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "We Don't Talk About Bruno",
      text: "Return chosen character to their player's hand, then that player discards a card at random.",
      effects: [
        {
          type: "move",
          to: "hand",
          target: chosenCharacter,
          afterEffect: [
            {
              type: "create-layer-based-on-target",
              // TODO: get rid of target
              target: thisCharacter,
              responder: "target_card_owner",
              effects: [
                {
                  type: "discard",
                  amount: 1,
                  target: {
                    type: "card",
                    value: 1,
                    random: true,
                    filters: [
                      { filter: "zone", value: "hand" },
                      { filter: "owner", value: "self" },
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 5,
  illustrator: 'Victor "Yano" Covarrubias',
  number: 97,
  set: "URR",
  rarity: "rare",
};
