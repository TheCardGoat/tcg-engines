import type { EventCard } from "@tcg/op-types";
import { op16GumGumTwinJetPistol039I18n } from "./op16-039-gum-gum-twin-jet-pistol.i18n.ts";

export const op16GumGumTwinJetPistol039: EventCard = {
  id: "OP16-039",
  canonicalId: "OP16-039",
  slug: "gum-gum-twin-jet-pistol/op16-039",
  name: "Gum-Gum Twin Jet Pistol",
  printings: [
    {
      id: "OP16-039",
      artId: "OP16-039",
      setCode: "OP16",
      collectorNumber: "039",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-039_WF7t9zU.jpg",
    },
  ],
  cardType: "event",
  color: ["green"],
  rarity: "C",
  setId: "OP16",
  cost: 1,
  trigger: "Rest your opponent's Leader.",
  traits: ["Straw Hat Crew Impel Down"],
  effect:
    "[Main] Up to 1 of your [Monkey.D.Luffy] cards gains [Double Attack] during this turn. Then, if your Leader has the {Impel Down} type, rest up to 2 of your opponent's Characters with a cost of 3 or less.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "name",
                  value: "Monkey.D.Luffy",
                },
              ],
            },
            keyword: "doubleAttack",
            duration: "thisTurn",
          },
          {
            action: "rest",
            condition: {
              condition: "leaderTrait",
              trait: "Impel Down",
              match: "includes",
            },
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 2,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 3,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op16GumGumTwinJetPistol039I18n,
};
