import type { CharacterCard } from "@tcg/lorcana-types";

export const ladyTremaineSinisterSocialite: CharacterCard = {
  id: "a1d",
  cardType: "character",
  name: "Lady Tremaine",
  version: "Sinister Socialite",
  fullName: "Lady Tremaine - Sinister Socialite",
  inkType: ["ruby"],
  franchise: "Cinderella",
  set: "010",
  text: "Boost 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck facedown under this character.)\nEXPEDIENT SCHEMES Whenever this character quests, if you've put a card under her this turn, you may play an action with cost 5 or less from your discard for free, then put that action card on the bottom of your deck instead of into your discard.",
  cost: 5,
  strength: 5,
  willpower: 4,
  lore: 2,
  cardNumber: 124,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "242d9e84ef714b95089283f0534b5f2a23b01f50",
  },
  abilities: [
    {
      id: "a1d-1",
      type: "keyword",
      keyword: "Boost",
      value: 2,
      text: "Boost 2 {I}",
    },
    {
      id: "a1d-2",
      type: "triggered",
      name: "EXPEDIENT SCHEMES",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you've put a card under her this turn",
        },
        then: {
          type: "put-on-bottom",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["card"],
          },
        },
      },
      text: "EXPEDIENT SCHEMES Whenever this character quests, if you've put a card under her this turn, you may play an action with cost 5 or less from your discard for free, then put that action card on the bottom of your deck instead of into your discard.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Whisper"],
};
