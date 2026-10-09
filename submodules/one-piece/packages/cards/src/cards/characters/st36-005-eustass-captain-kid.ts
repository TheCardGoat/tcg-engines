import type { CharacterCard } from "@tcg/op-types";
import { st36EustassCaptainKid005I18n } from "./st36-005-eustass-captain-kid.i18n.ts";
export const st36EustassCaptainKid005: CharacterCard = {
  id: "ST36-005",
  canonicalId: "ST36-005",
  slug: "eustass-captain-kid/st36-005",
  name: 'Eustass"Captain"Kid',
  printings: [
    {
      id: "ST36-005",
      artId: "ST36-005",
      setCode: "ST36",
      collectorNumber: "005",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST36-005.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "ST36",
  cost: 6,
  traits: ["Supernovas", "Kid Pirates"],
  power: 7000,
  attribute: "special",
  effect:
    '[On Your Opponent\'s Attack] [Once Per Turn] You may turn 1 card from the top or bottom of your Life cards face-down: Change the target of the attack to your [Eustass"Captain"Kid] with 5000 base power or more. [Activate: Main] [Once Per Turn] You may turn 1 card from the top or bottom of your Life cards face-up: Give up to 1 rested DON!! card to your Leader.',
  effects: {
    effects: [
      {
        trigger: "onOpponentAttack",
        optional: true,
        oncePerTurn: true,
        costs: [
          {
            cost: "turnLifeFaceUp",
            count: 1,
            position: "choice",
            faceUp: false,
          },
        ],
        actions: [
          {
            action: "changeBattleTarget",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "name",
                  value: 'Eustass"Captain"Kid',
                },
                {
                  filter: "basePower",
                  comparison: "gte",
                  value: 5000,
                },
              ],
            },
          },
        ],
      },
      {
        trigger: "activateMain",
        optional: true,
        oncePerTurn: true,
        costs: [
          {
            cost: "turnLifeFaceUp",
            count: 1,
            position: "choice",
            faceUp: true,
          },
        ],
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
      },
    ],
  },
  i18n: st36EustassCaptainKid005I18n,
};
