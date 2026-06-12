import type { CharacterCard } from "@tcg/lorcana-types";
import { nickWildeSlyFoxI18n } from "./150-nick-wilde-sly-fox.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const nickWildeSlyFox: CharacterCard = {
  id: "2oi",
  canonicalId: "ci_2oi",
  reprints: ["set6-150"],
  cardType: "character",
  name: "Nick Wilde",
  version: "Sly Fox",
  inkType: ["sapphire"],
  franchise: "Zootropolis",
  set: "006",
  cardNumber: 150,
  rarity: "uncommon",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_48304fa82c024098bf755ea123884358",
    tcgPlayer: 591133,
  },
  text: [
    {
      title: "Shift 1",
    },
    {
      title: "CAN'T TOUCH ME",
      description: "While you have an item in play, this character can't be challenged.",
    },
  ],
  classifications: ["Floodborn", "Ally"],
  abilities: [
    shift(1),
    {
      condition: {
        comparison: "greater-or-equal",
        controller: "you",
        count: 1,
        type: "has-item-count",
      },
      effect: {
        restriction: "cant-be-challenged",
        target: "SELF",
        type: "restriction",
      },
      id: "jsd-2",
      name: "CAN'T TOUCH ME",
      text: "CAN'T TOUCH ME While you have an item in play, this character can't be challenged.",
      type: "static",
    },
  ],
  i18n: nickWildeSlyFoxI18n,
};
