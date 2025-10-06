// TODO: Once the set is released, we organize the cards by set and type

import { lookAtTopCardOfYourDeckAndPutItOnTopOrBottom } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { resistAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/resistAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const hiroHamadaTeamLeader: LorcanaCharacterCardDefinition = {
  id: "oef",
  name: "Hiro Hamada",
  title: "Team Leader",
  characteristics: ["hero", "storyborn", "inventor"],
  text: "**I NEED TO UPGRADE ALL OF YOU** Your other Inventor characters gain **Resist** +1. _(Damage dealt to them is reduced by 1.)_\n\n**SHAPE THE FUTURE** 2 {I} − Look at the top card of your deck. Put it on either the top or the bottom of your deck.",
  type: "character",
  abilities: [
    {
      type: "static",
      ability: "gain-ability",
      name: "I NEED TO UPGRADE ALL OF YOU",
      text: "Your other Inventor characters gain **Resist** +1. _(Damage dealt to them is reduced by 1.)",
      gainedAbility: resistAbility(1),
      target: {
        type: "card",
        value: "all",
        excludeSelf: true,
        filters: [
          { filter: "zone", value: "play" },
          { filter: "type", value: "character" },
          { filter: "owner", value: "self" },
          { filter: "characteristics", value: ["inventor"] },
        ],
      },
    },
    {
      type: "activated",
      costs: [{ type: "ink", amount: 2 }],
      name: "SHAPE THE FUTURE",
      text: "Look at the top card of your deck. Put it on either the top or the bottom of your deck.",
      effects: [lookAtTopCardOfYourDeckAndPutItOnTopOrBottom],
    },
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 4,
  strength: 1,
  willpower: 5,
  lore: 1,
  illustrator: "Gonzalo Kenny",
  number: 154,
  set: "006",
  rarity: "rare",
};
