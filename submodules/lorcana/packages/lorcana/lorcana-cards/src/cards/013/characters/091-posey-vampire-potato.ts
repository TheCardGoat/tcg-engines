import type { CharacterCard } from "@tcg/lorcana-types";
import { poseyVampirePotatoI18n } from "./091-posey-vampire-potato.i18n";

export const poseyVampirePotato: CharacterCard = {
  id: "yZR",
  canonicalId: "ci_yZR",
  slug: "lorcana-ci_yZR",
  printings: [
    {
      id: "set13-091",
      artId: "set13-091",
      setCode: "set13",
      collectorNumber: "91",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-091"],
  cardType: "character",
  name: "Posey",
  version: "Vampire Potato",
  inkType: ["emerald"],
  franchise: "Darkwing Duck",
  set: "013",
  cardNumber: 91,
  rarity: "uncommon",
  cost: 7,
  strength: 7,
  willpower: 8,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_ab0dd349cb8546d38ae9a4bfc0afdb7a",
  },
  text: [
    {
      title: "Potato Shift 5 {I}",
      description: "(You may pay 5 {I} to play this on top of one of your items named Potato.)",
    },
  ],
  classifications: ["Storyborn", "Monster"],
  abilities: [
    {
      type: "keyword",
      keyword: "Shift",
      text: "Potato Shift 5",
      cost: {
        ink: 5,
      },
      shiftTarget: "Potato",
      shiftTargetCardType: "item",
    },
  ],
  i18n: poseyVampirePotatoI18n,
};
