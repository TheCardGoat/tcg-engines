import type { EventCard } from "@tcg/op-types";
import { eb02AndThatSWhenSomebodyMakesFunOfTheirFriendSDream030I18n } from "./030-and-that-s-when-somebody-makes-fun-of-their-friend-s-dream.i18n.ts";

export const eb02AndThatSWhenSomebodyMakesFunOfTheirFriendSDream030: EventCard = {
  id: "EB02-030",
  canonicalId: "EB02-030",
  slug: "and-that-s-when-somebody-makes-fun-of-their-friend-s-dream",
  name: "And That's When Somebody Makes Fun of Their Friend's Dream!!!!",
  printings: [
    {
      id: "EB02-030",
      artId: "EB02-030",
      setCode: "EB02",
      collectorNumber: "030",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB02-030.jpg",
    },
  ],
  cardType: "event",
  color: ["blue"],
  rarity: "C",
  setId: "EB02",
  cost: 2,
  trigger: "Draw 1 card.",
  traits: ["Alabasta Straw Hat Crew"],
  effect:
    "[Counter] If any of your Characters would be K.O.'d in battle during this turn, you may trash 1 card from your hand instead.",
  effects: {
    replacementEffects: [
      {
        replacedEvent: "ko",
        replacementAction: {
          action: "trashFromHand",
          player: "self",
          amount: 1,
        },
      },
    ],
  },
  i18n: eb02AndThatSWhenSomebodyMakesFunOfTheirFriendSDream030I18n,
};
