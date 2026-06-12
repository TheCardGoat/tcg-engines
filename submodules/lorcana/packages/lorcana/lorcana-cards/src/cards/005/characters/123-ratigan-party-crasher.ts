import type { CharacterCard } from "@tcg/lorcana-types";
import { ratiganPartyCrasherI18n } from "./123-ratigan-party-crasher.i18n";
import { shift } from "../../../helpers/abilities/shift";
import { evasive } from "../../../helpers/abilities/evasive";

export const ratiganPartyCrasher: CharacterCard = {
  id: "7v2",
  canonicalId: "ci_7v2",
  reprints: ["set5-123"],
  cardType: "character",
  name: "Ratigan",
  version: "Party Crasher",
  inkType: ["ruby"],
  franchise: "Great Mouse Detective",
  set: "005",
  cardNumber: 123,
  rarity: "rare",
  cost: 7,
  strength: 5,
  willpower: 5,
  lore: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_e49684f046464f2fac248bd11ba54f5d",
    tcgPlayer: 557537,
  },
  text: [
    {
      title: "Shift 4",
    },
    {
      title: "Evasive",
    },
    {
      title: "DELIGHTFULLY WICKED",
      description: "Your damaged characters get +2 {S}.",
    },
  ],
  classifications: ["Floodborn", "Villain"],
  abilities: [
    shift(4),
    evasive,
    {
      effect: {
        modifier: 2,
        stat: "strength",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [{ type: "status", status: "damaged" }],
        },
        type: "modify-stat",
      },
      id: "1b4-3",
      name: "DELIGHTFULLY WICKED",
      text: "DELIGHTFULLY WICKED Your damaged characters get +2 {S}.",
      type: "static",
    },
  ],
  i18n: ratiganPartyCrasherI18n,
};
