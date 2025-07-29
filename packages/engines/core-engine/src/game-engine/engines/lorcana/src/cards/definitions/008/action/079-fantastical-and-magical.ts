import type {
  DynamicAmount,
  LorcanitoActionCard,
} from "@lorcanito/lorcana-engine";
import { singerTogetherAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import {
  drawXCards,
  youGainLore,
} from "@lorcanito/lorcana-engine/effects/effects";

const singers: DynamicAmount = {
  dynamic: true,
  filters: [
    {
      filter: "sing",
      value: "singer",
    },
  ],
};

export const fantasticalAndMagical: LorcanaActionCardDefinition = {
  id: "h9s",
  name: "Fantastical And Magical",
  characteristics: ["action", "song"],
  text: "Sing Together 9\nFor each character that sang this song, draw a card and gain 1 lore.",
  type: "action",
  abilities: [
    singerTogetherAbility(9),
    {
      type: "resolution",
      resolveAmountBeforeCreatingLayer: true,
      effects: [youGainLore(singers), drawXCards(singers)],
    },
  ],
  inkwell: false,
  colors: ["amethyst"],
  cost: 9,
  illustrator: "Natalia Trykowska",
  number: 79,
  set: "008",
  rarity: "rare",
};
