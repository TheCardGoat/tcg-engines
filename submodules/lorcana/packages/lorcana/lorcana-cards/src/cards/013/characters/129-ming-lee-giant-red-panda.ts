import type { CharacterCard } from "@tcg/lorcana-types";
import { mingLeeGiantRedPandaI18n } from "./129-ming-lee-giant-red-panda.i18n";

import { temporaryShift } from "../../../helpers/abilities/shift";

export const mingLeeGiantRedPanda: CharacterCard = {
  id: "oGi",
  canonicalId: "ci_oGi",
  slug: "lorcana-ci_oGi",
  printings: [
    {
      id: "set13-129",
      artId: "set13-129",
      setCode: "set13",
      collectorNumber: "129",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-129"],
  cardType: "character",
  name: "Ming Lee",
  version: "Giant Red Panda",
  inkType: ["ruby"],
  franchise: "Turning Red",
  set: "013",
  cardNumber: 129,
  rarity: "common",
  cost: 9,
  strength: 10,
  willpower: 10,
  lore: 2,
  inkable: true,
  text: [
    {
      title:
        "<Temporary Shift> 7 {I} (You may pay 7 {I} to play this on top of one of your characters named Ming Lee. At the end of your turn, remove all damage from this character and return only this card to your hand.)",
    },
    {
      title: "Path of Destruction",
      description:
        "Whenever this character challenges another character, ready her. She can't quest for the rest of this turn.",
    },
  ],
  classifications: ["Storyborn", "Mentor", "Giant", "Red Panda"],
  abilities: [
    temporaryShift("Ming Lee", 7),
    {
      type: "triggered",
      name: "Path of Destruction",
      text: "Whenever this character challenges another character, ready her. She can't quest for the rest of this turn.",
      trigger: {
        event: "challenge",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "ready",
            target: "SELF",
          },
          {
            type: "restriction",
            restriction: "cant-quest",
            duration: "this-turn",
            target: "SELF",
          },
        ],
      },
    },
  ],
  i18n: mingLeeGiantRedPandaI18n,
};
