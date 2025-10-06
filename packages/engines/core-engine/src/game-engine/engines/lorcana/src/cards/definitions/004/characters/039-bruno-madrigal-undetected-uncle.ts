import {
  anyCard,
  namedCard,
} from "@lorcanito/lorcana-engine/abilities/targets";
import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const brunoMadrigalUndetectedUncle: LorcanitoCharacterCardDefinition = {
  id: "le7",
  reprints: ["tiq"],
  name: "Bruno Madrigal",
  title: "Undetected Uncle",
  characteristics: ["storyborn", "ally", "madrigal"],
  text: "**Evasive** _(Only characters with Evasive can challenge this character.)_\n**YOU JUST HAVE TO SEE IT** {E} − Name a card, then reveal the top card of your deck. If it's the named card, put that card into your hand and gain 3 lore. Otherwise, put it on the top of your deck.",
  type: "character",
  abilities: [
    evasiveAbility,
    {
      type: "activated",
      name: "You Just Have To See It",
      text: "Name a card, then reveal the top card of your deck. If it's the named card, put that card into your hand and gain 3 lore. Otherwise, put it on the top of your deck.",
      nameACard: true,
      costs: [{ type: "exert" }],
      effects: [
        {
          type: "reveal-top-card",
          target: namedCard,
          onTargetMatchEffects: [
            {
              type: "move",
              to: "hand",
              target: anyCard,
            },
            youGainLore(3),
          ],
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  illustrator: "Juan Diego Leon",
  number: 39,
  set: "URR",
  rarity: "super_rare",
};
