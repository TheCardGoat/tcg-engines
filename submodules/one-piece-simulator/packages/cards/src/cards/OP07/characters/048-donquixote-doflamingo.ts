import type { CharacterCard } from "@tcg/op-types";
import { op07DonquixoteDoflamingo048I18n } from "./048-donquixote-doflamingo.i18n.ts";

export const op07DonquixoteDoflamingo048: CharacterCard = {
  id: "OP07-048",
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP07",
  cost: 3,
  power: 4000,
  traits: ["Donquixote Pirates The Seven Warlords of the Sea"],
  attribute: "special",
  effect:
    "[Activate:Main] [Once Per Turn] (2) (You may rest the specified number of DON!! cards in your cost area.): Reveal 1 card from the top of your deck. If that card is a [The Seven Warlords of the Sea] type Character card with a cost of 4 or less, you may play that card rested. Then, place the rest at the bottom of your deck.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restDon",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "rearrangeDeck",
            player: "self",
            count: 1,
            position: "top",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op07DonquixoteDoflamingo048I18n,
};
