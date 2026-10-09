import type { CharacterCard, ScryEffect } from "@tcg/lorcana-types";
import { hctorRiveraWorldwideSensationI18n } from "./106-hector-rivera-worldwide-sensation.i18n";
import { shift } from "../../../helpers/abilities/shift";

const bigHitScry: ScryEffect = {
  type: "scry",
  amount: 3,
  destinations: [
    {
      zone: "hand",
      min: 0,
      max: 1,
      reveal: true,
      filter: {
        type: "song",
      },
    },
    {
      zone: "discard",
      remainder: true,
    },
  ],
};

export const hctorRiveraWorldwideSensation: CharacterCard = {
  id: "etZ",
  canonicalId: "ci_etZ",
  slug: "lorcana-ci_etZ",
  printings: [
    {
      id: "set14-106",
      artId: "set14-106",
      setCode: "set14",
      collectorNumber: "106",
      rarity: "legendary",
      imageUrl: "",
    },
  ],
  reprints: ["set14-106"],
  cardType: "character",
  name: "Héctor Rivera",
  version: "Worldwide Sensation",
  inkType: ["ruby"],
  franchise: "Coco",
  set: "014",
  cardNumber: 106,
  rarity: "legendary",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: true,
  text: [
    {
      title: "Shift 4 {I}",
    },
    {
      title: "Big Hit",
      description:
        "Whenever this character quests and whenever he sings a song for the first time each turn, look at the top 3 cards of your deck. You may reveal a song card and put it into your hand. Put the rest into your discard.",
    },
  ],
  classifications: ["Dreamborn", "Mentor"],
  abilities: [
    shift(4),
    {
      id: "etZ-1",
      name: "Big Hit",
      type: "triggered",
      text: "Big Hit Whenever this character quests, look at the top 3 cards of your deck. You may reveal a song card and put it into your hand. Put the rest into your discard.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: bigHitScry,
    },
    {
      id: "etZ-2",
      name: "Big Hit",
      type: "triggered",
      text: "Big Hit Whenever this character sings a song for the first time each turn, look at the top 3 cards of your deck. You may reveal a song card and put it into your hand. Put the rest into your discard.",
      trigger: {
        event: "sing",
        on: "SELF",
        timing: "whenever",
        restrictions: [{ type: "first-time-each-turn" }],
      },
      effect: bigHitScry,
    },
  ],
  i18n: hctorRiveraWorldwideSensationI18n,
};
