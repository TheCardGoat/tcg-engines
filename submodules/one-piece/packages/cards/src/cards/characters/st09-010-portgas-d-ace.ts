import type { CharacterCard } from "@tcg/op-types";
import { st09PortgasDAce010I18n } from "./st09-010-portgas-d-ace.i18n.ts";
export const st09PortgasDAce010: CharacterCard = {
  id: "ST09-010",
  canonicalId: "ST09-010",
  slug: "portgas-d-ace/st09-010",
  name: "Portgas.D.Ace",
  printings: [
    {
      id: "ST09-010",
      artId: "ST09-010",
      setCode: "ST09",
      collectorNumber: "010",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST09-010.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "ST09",
  cost: 6,
  traits: ["Land of Wano", "Whitebeard Pirates"],
  power: 7000,
  attribute: "special",
  effect:
    "[Once Per Turn] If this Character would be K.O.'d, you may trash 1 card from the top or bottom of your Life cards instead.",
  effects: {
    replacementEffects: [
      {
        replacedEvent: "ko",
        eventFilter: {
          targetSelf: true,
        },
        oncePerTurn: true,
        replacementAction: {
          action: "removeFromLife",
          player: "self",
          count: {
            amount: 1,
          },
          destination: "trash",
          position: "choice",
        },
      },
    ],
  },
  i18n: st09PortgasDAce010I18n,
};
