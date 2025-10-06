import type { ActivatedAbility } from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";
export const theQueenWickedAndVain: LorcanitoCharacterCardDefinition = {
  id: "y32",
  reprints: ["k4l"],
  name: "The Queen",
  title: "Wicked and Vain",
  characteristics: ["queen", "storyborn", "villain"],
  text: "**I SUMMON THEE** {E} − Draw a card.",
  type: "character",
  abilities: [
    {
      type: "activated",
      responder: "self",
      costs: [{ type: "exert" }],
      name: "I Summon Thee",
      text: "Draw a card.",
      effects: [
        {
          type: "draw",
          amount: 1,
          target: {
            type: "player",
            value: "self",
          },
        },
      ],
    } as ActivatedAbility,
  ],
  flavour:
    "Sublime beauty matched with peerless cunning. Is there any question who is fairest?",
  inkwell: true,
  colors: ["amethyst"],
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 1,
  illustrator: "Matthew Robert Davies",
  number: 56,
  set: "TFC",
  rarity: "super_rare",
};
