import type { CharacterCard } from "@tcg/op-types";
import { prb02MonkeyDLuffySt13014PirateFoil014I18n } from "./014-monkey-d-luffy-st13-014-pirate-foil.i18n.ts";

export const prb02MonkeyDLuffySt13014PirateFoil014: CharacterCard = {
  id: "ST13-014",
  canonicalId: "ST13-014",
  slug: "monkey-d-luffy-st13-014-pirate-foil",
  name: "Monkey.D.Luffy - ST13-014 (Pirate Foil)",
  alternateNames: ["Monkey.D.Luffy"],
  printings: [
    {
      id: "ST13-014",
      artId: "ST13-014",
      setCode: "PRB02",
      collectorNumber: "014",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST13-014_p2.jpg",
    },
    {
      id: "ST13-014_r1",
      artId: "ST13-014_r1",
      setCode: "PRB02",
      collectorNumber: "014",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST13-014_r1.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "PRB02",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Goa Kingdom"],
  attribute: "strike",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST13-014_r1.jpg",
      imageId: "ST13-014_r1",
    },
  ],
  effect:
    "[Activate:Main] You may trash this Character: Reveal 1 card from the top of your Life cards. If that card is a [Monkey.D.Luffy] with a cost of 5, you may play that card. If you do, up to 1 of your Leader gains +2000 power until the end of your opponent's next turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashThisCard",
          },
        ],
        actions: [
          {
            action: "revealFromLife",
            player: "self",
            conditionalPlay: {
              filters: [
                {
                  filter: "name",
                  value: "Monkey.D.Luffy",
                },
                {
                  filter: "cost",
                  comparison: "eq",
                  value: 5,
                },
              ],
              thenActions: [
                {
                  action: "modifyPower",
                  target: {
                    player: "self",
                    zones: ["leader"],
                    count: {
                      amount: 1,
                      upTo: true,
                    },
                  },
                  value: 2000,
                  duration: "untilEndOfOpponentNextTurn",
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: prb02MonkeyDLuffySt13014PirateFoil014I18n,
};
