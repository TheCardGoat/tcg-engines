import {
  discardCardEffect,
  returnCardEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import { targetOwnerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const weDontTalkAboutBruno: LorcanaActionCardDefinition = {
  id: "wwi",
  name: "We Don't Talk About Bruno",
  characteristics: ["action", "song"],
  text: "Return chosen character to their player's hand, then that player discards a card at random.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Return chosen character to their player's hand, then that player discards a card at random.",
      effects: [
        returnCardEffect({
          targets: [chosenCharacterTarget],
          from: "play",
          to: "hand",
          followedBy: discardCardEffect({
            targets: [targetOwnerTarget],
            random: true,
            value: 1,
          }),
        }),
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
