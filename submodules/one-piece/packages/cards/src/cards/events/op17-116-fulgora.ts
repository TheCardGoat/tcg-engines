import type { EventCard } from "@tcg/op-types";
import { op17Fulgora116I18n } from "./op17-116-fulgora.i18n.ts";

export const op17Fulgora116: EventCard = {
  id: "OP17-116",
  canonicalId: "OP17-116",
  slug: "fulgora/op17-116",
  name: "Fulgora",
  printings: [
    {
      id: "OP17-116",
      artId: "OP17-116",
      setCode: "OP17",
      collectorNumber: "116",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-116_kWE8DVL.jpg",
    },
  ],
  cardType: "event",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP17",
  cost: 1,
  traits: ["The Four Emperors Big Mom Pirates"],
  effect:
    "[Main] You may rest 2 of your DON!! cards: K.O. up to 1 of your opponent's Stages.\n[Counter] If you have 2 or more Characters with a [Trigger], up to 1 of your Leader or Characters gains +4000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [
          {
            cost: "restDon",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["stage"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op17Fulgora116I18n,
};
