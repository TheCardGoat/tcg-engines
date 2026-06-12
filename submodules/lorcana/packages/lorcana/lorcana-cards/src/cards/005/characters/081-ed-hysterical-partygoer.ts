import type { CharacterCard } from "@tcg/lorcana-types";
import { edHystericalPartygoerI18n } from "./081-ed-hysterical-partygoer.i18n";

export const edHystericalPartygoer: CharacterCard = {
  id: "28X",
  canonicalId: "ci_28X",
  reprints: ["set5-081"],
  cardType: "character",
  name: "Ed",
  version: "Hysterical Partygoer",
  inkType: ["emerald"],
  franchise: "Lion King",
  set: "005",
  cardNumber: 81,
  rarity: "uncommon",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_f291329542f04339988b4051333a446e",
    tcgPlayer: 559626,
  },
  text: [
    {
      title: "ROWDY GUEST",
      description: "Damaged characters can't challenge this character.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Hyena"],
  abilities: [
    {
      effect: {
        restriction: "cant-be-challenged",
        target: "SELF",
        type: "restriction",
        challengerFilter: {
          type: "is-damaged",
        },
      },
      id: "q6u-1",
      name: "ROWDY GUEST",
      text: "ROWDY GUEST Damaged characters can't challenge this character.",
      type: "static",
    },
  ],
  i18n: edHystericalPartygoerI18n,
};
