import {
  chosenCharacter,
  chosenCharacterOfYours,
  chosenCharacterOrLocation,
  chosenOpposingCharacter,
  self,
  sourceTarget,
  thisCharacter,
  yourCharacters,
} from "@lorcanito/lorcana-engine/abilities/targets";
import { whenYouPlayThisForEachYouPayLess } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import {
  banishChosenItem,
  chosenCharacterGainsSupport,
  chosenOpposingCharacterCantQuestNextTurn,
  dealDamageEffect,
  discardACard,
  discardAllCardsInOpponentsHand,
  drawACard,
  drawXCards,
  exertChosenCharacter,
  mayBanish,
  millOpponentXCards,
  moveDamageEffect,
  opponentLoseLore,
  putDamageEffect,
  readyAndCantQuest,
  readyChosenCharacter,
  readyChosenItem,
  returnChosenCharacterWithCostLess,
  youGainLore,
  youMayPutAnAdditionalCardFromYourHandIntoYourInkwell,
} from "@lorcanito/lorcana-engine/effects/effects";
import type { TargetConditionalEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const weCouldBeImmortals: LorcanaActionCardDefinition = {
  id: "nb5",
  name: "We Could Be Immortals",
  characteristics: ["action", "song"],
  text: "Your Inventor characters gain **Resist** +6 this turn. Then, put this card into your inkwell facedown and exerted. _(Damage dealt to them is reduced by 6.)_",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "We Could Be Immortals",
      text: "Your Inventor characters gain **Resist** +6 this turn. Then, put this card into your inkwell facedown and exerted. _(Damage dealt to them is reduced by 6.)_",
      effects: [
        {
          type: "ability",
          ability: "resist",
          amount: 6,
          modifier: "add",
          duration: "turn",
          target: {
            type: "card",
            value: "all",
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
              { filter: "owner", value: "self" },
              { filter: "characteristics", value: ["inventor"] },
            ],
          },
        },
        {
          type: "move",
          to: "inkwell",
          exerted: true,
          target: {
            type: "card",
            value: 1,
            filters: [{ filter: "source", value: "self" }],
          },
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 4,
  lore: 6,
  illustrator: "Ian MacDonald",
  number: 162,
  set: "006",
  rarity: "rare",
};
