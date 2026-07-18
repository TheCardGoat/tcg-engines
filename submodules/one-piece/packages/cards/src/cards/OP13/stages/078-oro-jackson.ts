import type { StageCard } from "@tcg/op-types";
import { op13OroJackson078I18n } from "./078-oro-jackson.i18n.ts";

export const op13OroJackson078: StageCard = {
  id: "OP13-078",
  canonicalId: "OP13-078",
  slug: "oro-jackson",
  name: "Oro Jackson",
  printings: [
    {
      id: "OP13-078",
      artId: "OP13-078",
      setCode: "OP13",
      collectorNumber: "078",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-078_HORRusH.jpg",
    },
  ],
  cardType: "stage",
  color: ["purple"],
  rarity: "C",
  setId: "OP13",
  cost: 1,
  traits: ["Roger Pirates"],
  effect:
    '[Once Per Turn] When your Character with a type including "Roger Pirates" is removed from the field by your opponent\'s effect, add up to 1 DON!! card from your DON!! deck and rest it.',
  effects: {
    effects: [
      {
        trigger: "whenLeaving",
        eventFilter: {
          player: "self",
          causedBy: "opponent",
          filters: [
            {
              filter: "trait",
              value: "Roger Pirates",
              match: "includes",
            },
          ],
        },
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op13OroJackson078I18n,
};
