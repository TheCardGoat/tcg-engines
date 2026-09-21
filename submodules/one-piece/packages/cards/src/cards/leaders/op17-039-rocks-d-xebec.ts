import type { LeaderCard } from "@tcg/op-types";
import { op17RocksDXebec039I18n } from "./op17-039-rocks-d-xebec.i18n.ts";

export const op17RocksDXebec039: LeaderCard = {
  id: "OP17-039",
  canonicalId: "OP17-039",
  slug: "rocks-d-xebec/op17-039",
  name: "Rocks.D.Xebec",
  printings: [
    {
      id: "OP17-039",
      artId: "OP17-039",
      setCode: "OP17",
      collectorNumber: "039",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-039_pZKVdpd.jpg",
      label: "Rocks.D.Xebec (039)",
    },
    {
      id: "OP17-039_p1",
      artId: "OP17-039_p1",
      setCode: "OP17",
      collectorNumber: "039",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-039_p1_Tyq1Tm8.jpg",
      label: "Rocks.D.Xebec (039) (Alternate Art)",
    },
  ],
  cardType: "leader",
  color: ["blue"],
  rarity: "L",
  setId: "OP17",
  power: 5000,
  life: 5,
  traits: ["Rocks Pirates"],
  attribute: "slash",
  effect:
    '[When Attacking] You may trash 1 card from your hand: Reveal 1 card from the top of your deck. If the revealed card\'s type includes "Rocks Pirates", draw 2 cards.',
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "revealFromDeck",
            player: "self",
            count: 1,
            ifRevealedCardMatches: {
              filters: [
                {
                  filter: "trait",
                  value: "Rocks Pirates",
                  match: "includes",
                },
              ],
              actions: [
                {
                  action: "draw",
                  player: "self",
                  amount: 2,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op17RocksDXebec039I18n,
};
