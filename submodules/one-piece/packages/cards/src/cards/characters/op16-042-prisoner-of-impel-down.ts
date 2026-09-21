import type { CharacterCard } from "@tcg/op-types";
import { op16PrisonerOfImpelDown042I18n } from "./op16-042-prisoner-of-impel-down.i18n.ts";

export const op16PrisonerOfImpelDown042: CharacterCard = {
  id: "OP16-042",
  canonicalId: "OP16-042",
  slug: "prisoner-of-impel-down/op16-042",
  name: "Prisoner of Impel Down",
  printings: [
    {
      id: "OP16-042",
      artId: "OP16-042",
      setCode: "OP16",
      collectorNumber: "042",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-042_senMnhl.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP16",
  cost: 6,
  power: 6000,
  counter: 2000,
  traits: ["Impel Down"],
  attribute: "strike",
  effect: "Under the rules of this game, you may have any number of this card in your deck.",
  effects: {
    deckBuildingRules: [
      {
        rule: "unlimitedCopies",
      },
    ],
  },
  i18n: op16PrisonerOfImpelDown042I18n,
};
