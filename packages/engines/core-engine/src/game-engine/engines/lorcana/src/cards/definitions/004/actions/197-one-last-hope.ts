import type {
  LorcanitoActionCard,
  TargetConditionalEffect,
} from "@lorcanito/lorcana-engine";
import { chosenCharacterGainsResist } from "@lorcanito/lorcana-engine/effects/effects";

const targetHero = {
  type: "card",
  value: 1,
  filters: [
    { filter: "type", value: "character" },
    { filter: "zone", value: "play" },
    {
      filter: "characteristics",
      value: ["hero"],
    },
  ],
};

export const oneLastHope: LorcanitoActionCard = {
  id: "b2r",
  name: "One Last Hope",
  characteristics: ["action", "song"],
  text: "_(A character with cost 3 or more can {E} to sing this song for free.)_\n\n\nChosen character gains **Resist** +2 until the start of your next turn. If a Hero character is chosen, they may also challenge ready characters this turn. _(Damage dealt to them is reduced by 2.)_",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "target-conditional",
          effects: [
            {
              type: "ability",
              ability: "challenge_ready_chars",
              modifier: "add",
              duration: "turn",
              until: true,
              target: targetHero,
            },
            {
              type: "ability",
              ability: "resist",
              amount: 2,
              modifier: "add",
              duration: "next_turn",
              until: true,
              target: targetHero,
            },
          ],
          fallback: [chosenCharacterGainsResist(2)],
          // TODO: Re implement conditional target
          target: targetHero,
        } as TargetConditionalEffect,
      ],
    },
  ],
  colors: ["steel"],
  cost: 3,
  illustrator: "Alice Pisoni",
  number: 197,
  set: "URR",
  rarity: "rare",
};
