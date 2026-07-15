import type { EventCard } from "@tcg/op-types";
import { op12WeLlRingTheBellWaitingForYou116I18n } from "./116-we-ll-ring-the-bell-waiting-for-you.i18n.ts";

export const op12WeLlRingTheBellWaitingForYou116: EventCard = {
  id: "OP12-116",
  canonicalId: "OP12-116",
  slug: "we-ll-ring-the-bell-waiting-for-you",
  name: "We'll Ring the Bell Waiting for You!!",
  printings: [
    {
      id: "OP12-116",
      artId: "OP12-116",
      setCode: "OP12",
      collectorNumber: "116",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-116_wDTQKI0.jpg",
    },
  ],
  cardType: "event",
  color: ["yellow"],
  rarity: "C",
  setId: "OP12",
  cost: 3,
  trigger: "Draw 1 card.",
  traits: ["Sky Island Shandian Warrior Jaya"],
  effect:
    '[Main] Look at 5 cards from the top of your deck; reveal a total of up to 2 "Shandian Warrior" type Character cards or [Mont Blanc Noland] and add them to your hand. Then, place the rest at the bottom of your deck in any order.',
  i18n: op12WeLlRingTheBellWaitingForYou116I18n,
};
