import {
  type ActivatedAbility,
  challengerAbility,
  exertCharCost,
  type GainAbilityStaticAbility,
  type ResolutionAbility,
  resistAbility,
  yourOtherCharactersGet,
} from "~/game-engine/engines/lorcana/src/abilities";
import { forEachItemYouHaveInPlay } from "~/game-engine/engines/lorcana/src/abilities/amounts";
import { atTheStartOfYourTurn } from "~/game-engine/engines/lorcana/src/abilities/atTheAbilities";
import {
  banishChosenItem,
  drawACard,
  enterPlaysExerted,
  mayBanish,
  millOpponentXCards,
  moveToLocation,
  readyAndCantQuest,
  removeDamageEffect,
  returnChosenCharacterWithStrength,
  revealTopOfDeckPutInHandOrDeck,
  youGainLore,
  youMayDrawThenChooseAndDiscard,
} from "~/game-engine/engines/lorcana/src/abilities/effect";
import { yourDamagedCharacters } from "~/game-engine/engines/lorcana/src/abilities/target";
import {
  anyTarget,
  chosenCharacter,
  chosenCharacterOfYours,
  chosenDamagedCharacter,
  eachOfYourCharacters,
  oneOfYourOpponentsCharactersItemsOrLocations,
} from "~/game-engine/engines/lorcana/src/abilities/targets";
import { wheneverIsReturnedToHand } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";

export const noRoomNoRoom: ActivatedAbility = {
  type: "activated",
  costs: [{ type: "ink", amount: 1 }, { type: "exert" }],
  name: "No Room, No Room",
  text: "{E}, 1 {I} – Each opponent puts the top card of their deck into their discard.",
  effects: millOpponentXCards(1),
};
export const makeARescue: ActivatedAbility = {
  type: "activated",
  costs: [{ type: "ink", amount: 3 }, { type: "exert" }],
  name: "Make A Rescue",
  text: "Return a Pirate character card from your discard to your hand.",
  effects: [
    {
      type: "move",
      to: "hand",
      target: {
        type: "card",
        value: 1,
        filters: [
          { filter: "owner", value: "self" },
          { filter: "type", value: ["character"] },
          { filter: "characteristics", value: ["pirate"] },
          { filter: "zone", value: "discard" },
        ],
      },
    },
  ],
};
export const faithAndTrust: ActivatedAbility = {
  type: "activated",
  costs: [{ type: "ink", amount: 2 }, { type: "exert" }],
  effects: [
    {
      type: "ability",
      ability: "evasive",
      modifier: "add",
      duration: "next_turn",
      until: true,
      target: chosenCharacter,
    },
    {
      type: "ability",
      ability: "custom",
      customAbility: challengerAbility(2),
      modifier: "add",
      duration: "next_turn",
      until: true,
      target: chosenCharacter,
    },
  ],
};
export const glitteringAccess: ActivatedAbility = {
  type: "activated",
  costs: [{ type: "ink", amount: 1 }, { type: "exert" }, { type: "banish" }],
  effects: readyAndCantQuest(chosenCharacterOfYours),
};
export const thereYouGo: ActivatedAbility = {
  type: "activated",
  costs: [{ type: "banish" }],
  resolveEffectsIndividually: true,
  effects: [removeDamageEffect(2, eachOfYourCharacters), drawACard],
};
export const resourceAllocation: ActivatedAbility = {
  type: "activated",
  costs: [{ type: "ink", amount: 1 }, { type: "banish" }],
  effects: [returnChosenCharacterWithStrength(2, "lte")],
};
export const tenThousandMedicalProcedures: ActivatedAbility = {
  type: "activated",
  costs: [{ type: "exert" }],
  effects: [
    {
      type: "modal",
      // TODO: Get rid of target
      target: chosenCharacter,
      modes: [
        {
          id: "1",
          text: "Remove up to 1 damage from chosen character.",
          effects: [removeDamageEffect(1, chosenCharacter)],
        },
        {
          id: "2",
          text: "If you have a Robot character in play, remove up to 3 damage from chosen character.",
          effects: [removeDamageEffect(3, chosenCharacter)],
        },
      ],
    },
  ],
};
export const spycraft: ActivatedAbility = {
  ...youMayDrawThenChooseAndDiscard,
  type: "activated",
  costs: [{ type: "exert" }],
};
export const handleWithCare: ActivatedAbility = {
  type: "activated",
  costs: [{ type: "exert" }, { type: "ink", amount: 2 }],
  effects: [
    {
      type: "ability",
      ability: "bodyguard",
      modifier: "add",
      duration: "next_turn",
      until: true,
      target: chosenCharacter,
    },
  ],
};
export const happyFace: ResolutionAbility = {
  type: "resolution",
  name: "Happy Face",
  text: "This item enters play exerted.",
  effects: [enterPlaysExerted],
};
export const destroy: ActivatedAbility = {
  type: "activated",
  costs: [{ type: "exert" }, { type: "banish" }],
  name: "Destroy!",
  text: "Choose one:\n* Banish chosen item.\n* Banish chosen damaged character.",
  effects: [
    {
      type: "modal",
      target: anyTarget,
      modes: [
        {
          id: "1",
          text: "Banish chosen item.",
          effects: [banishChosenItem],
        },
        {
          id: "2",
          text: "Banish chosen damaged character.",
          effects: [mayBanish(chosenDamagedCharacter)],
        },
      ],
    },
  ],
};
export const limitlessApplications: ResolutionAbility = {
  type: "resolution",
  name: "Inspired Tech",
  text: "When you play this item, chosen character gets -1 {S} this turn for each item named Microbots you have in play.",
  effects: [
    {
      type: "attribute",
      attribute: "strength",
      amount: forEachItemYouHaveInPlay,
      modifier: "subtract",
      duration: "turn",
      target: chosenCharacter,
    },
  ],
};
export const makeItSings: ActivatedAbility = {
  type: "activated",
  costs: [{ type: "banish" }, { type: "ink", amount: 1 }],
  name: "Make It Sing",
  text: "1 {I}, Banish this item - Chosen character counts as having +3 cost to sing songs this turn.",
  effects: [
    {
      type: "attribute",
      attribute: "singCost",
      amount: 3,
      modifier: "add",
      duration: "turn",
      target: chosenCharacter,
    },
  ],
};
export const iMadeHer: ActivatedAbility = {
  type: "activated",
  name: "I Made Her",
  text: "{E} one of your characters - Chosen character gets -2 {S} until the start of your next turn.",
  costs: [exertCharCost(1)],
  effects: [
    {
      type: "attribute",
      attribute: "strength",
      amount: 2,
      modifier: "subtract",
      duration: "next_turn",
      until: true,
      target: chosenCharacter,
    },
  ],
};
export const backFools = wheneverIsReturnedToHand({
  name: "Back, Fools!",
  text: "Whenever one of your opponents' characters, items, or locations is returned to their hand from play, gain 1 lore.",
  target: oneOfYourOpponentsCharactersItemsOrLocations,
  from: "play",
  effects: [youGainLore(1)],
});
export const giveThemAShow = atTheStartOfYourTurn({
  name: "Give 'Em A Show",
  text: "At the start of your turn, you may move a character of yours to a location for free.",
  optional: true,
  effects: [moveToLocation(chosenCharacterOfYours)],
});
export const takeItForASpin: ActivatedAbility = {
  type: "activated",
  name: "Take It For A Spin",
  text: "2 {I} – Chosen character of yours gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)",
  costs: [{ type: "ink", amount: 2 }],
  effects: [
    {
      type: "ability",
      ability: "evasive",
      duration: "next_turn",
      until: true,
      modifier: "add",
      target: chosenCharacter,
    },
  ],
};
export const aSuitableWeapon = yourOtherCharactersGet({
  name: "A Suitable Weapon",
  text: "Your damaged characters get +1 {S}.",
  effects: [
    {
      type: "attribute",
      attribute: "strength",
      amount: 1,
      modifier: "add",
      target: yourDamagedCharacters,
    },
  ],
});
export const simboulOfRoyalty: GainAbilityStaticAbility = {
  type: "static",
  ability: "gain-ability",
  name: "Symbol of Royalty",
  text: "Your Prince and King characters gain Resist +1. (Damage dealt to them is reduced by 1.)",
  gainedAbility: resistAbility(1),
  target: {
    type: "card",
    value: "all",
    excludeSelf: true,
    filters: [
      { filter: "zone", value: "play" },
      { filter: "type", value: "character" },
      { filter: "owner", value: "self" },
      {
        filter: "characteristics",
        conjunction: "or",
        value: ["prince", "king"],
      },
    ],
  },
};
export const royalSearch: ActivatedAbility = {
  type: "activated",
  costs: [{ type: "exert" }, { type: "ink", amount: 2 }],
  name: "Royal Search",
  text: "{E}, 2 {I} – Reveal the top card of your deck. If it’s a Prince or King character card, you may put it into your hand. Otherwise, put it on the top of your deck.",
  effects: revealTopOfDeckPutInHandOrDeck({
    mode: "top",
    tutorFilters: [
      { filter: "type", value: "character" },
      { filter: "owner", value: "self" },
      {
        filter: "characteristics",
        conjunction: "or",
        value: ["prince", "king"],
      },
    ],
  }),
};
