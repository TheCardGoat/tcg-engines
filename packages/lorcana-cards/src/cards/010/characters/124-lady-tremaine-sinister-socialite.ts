import type { CharacterCard } from "@tcg/lorcana-types";

export const ladyTremaineSinisterSocialite: CharacterCard = {
  abilities: [
    {
      id: "a1d-1",
      keyword: "Boost",
      text: "Boost 2 {I}",
      type: "keyword",
      value: 2,
    },
    {
      effect: {
        condition: {
          expression: "you've put a card under her this turn",
          type: "if",
        },
        then: {
          target: {
            cardTypes: ["card"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
          type: "put-on-bottom",
        },
        type: "conditional",
      },
      id: "a1d-2",
      name: "EXPEDIENT SCHEMES",
      text: "EXPEDIENT SCHEMES Whenever this character quests, if you've put a card under her this turn, you may play an action with cost 5 or less from your discard for free, then put that action card on the bottom of your deck instead of into your discard.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 124,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Whisper"],
  cost: 5,
  externalIds: {
    ravensburger: "242d9e84ef714b95089283f0534b5f2a23b01f50",
  },
  franchise: "Cinderella",
  fullName: "Lady Tremaine - Sinister Socialite",
  id: "a1d",
  inkType: ["ruby"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Lady Tremaine",
  set: "010",
  strength: 5,
  text: "Boost 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck facedown under this character.)\nEXPEDIENT SCHEMES Whenever this character quests, if you've put a card under her this turn, you may play an action with cost 5 or less from your discard for free, then put that action card on the bottom of your deck instead of into your discard.",
  version: "Sinister Socialite",
  willpower: 4,
};
