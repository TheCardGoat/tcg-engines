import type { StageCard } from "@tcg/op-types";
import { op04CorridaColiseum096I18n } from "./op04-096-corrida-coliseum.i18n.ts";

export const op04CorridaColiseum096: StageCard = {
  id: "OP04-096",
  canonicalId: "OP04-096",
  slug: "corrida-coliseum",
  name: "Corrida Coliseum",
  printings: [
    {
      id: "OP04-096",
      artId: "OP04-096",
      setCode: "OP04",
      collectorNumber: "096",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-096.jpg",
    },
    {
      id: "OP04-096_p1",
      artId: "OP04-096_p1",
      setCode: "OP04",
      collectorNumber: "096",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-096_p1.jpg",
    },
    {
      id: "OP04-096_r1",
      artId: "OP04-096_r1",
      setCode: "OP04",
      collectorNumber: "096",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-096_r1.jpg",
      label: "Corrida Coliseum (Reprint)",
    },
  ],
  cardType: "stage",
  color: ["black"],
  rarity: "C",
  setId: "OP04",
  cost: 1,
  traits: ["Dressrosa"],
  effect:
    "If your Leader has the [Dressrosa] type, your [Dressrosa] type Characters can attack Characters on the turn in which they are played.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Dressrosa",
            match: "includes",
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "trait",
                  value: "Dressrosa",
                  match: "includes",
                },
              ],
            },
            keyword: "rushCharacter",
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op04CorridaColiseum096I18n,
};
