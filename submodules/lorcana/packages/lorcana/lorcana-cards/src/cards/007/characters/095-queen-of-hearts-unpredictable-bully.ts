import type { CharacterCard } from "@tcg/lorcana-types";
import { queenOfHeartsUnpredictableBullyI18n } from "./095-queen-of-hearts-unpredictable-bully.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const queenOfHeartsUnpredictableBully: CharacterCard = {
  id: "4p4",
  canonicalId: "ci_4p4",
  reprints: ["set7-095"],
  cardType: "character",
  name: "Queen of Hearts",
  version: "Unpredictable Bully",
  inkType: ["emerald", "ruby"],
  franchise: "Alice in Wonderland",
  set: "007",
  cardNumber: 95,
  rarity: "common",
  cost: 5,
  strength: 2,
  willpower: 6,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_1a8a91c84777485892034cbc17d8359d",
    tcgPlayer: 618320,
  },
  text: [
    {
      title: "Shift 3",
    },
    {
      title: "IF I LOSE MY TEMPER...",
      description: "Whenever another character is played, put a damage counter on them.",
    },
  ],
  classifications: ["Floodborn", "Villain", "Queen"],
  abilities: [
    shift("Queen of Hearts", 3),
    {
      id: "4p4-2",
      name: "IF I LOSE MY TEMPER...",
      text: "IF I LOSE MY TEMPER... Whenever another character is played, put a damage counter on them.",
      type: "triggered",
      trigger: {
        event: "play",
        on: "OTHER_CHARACTERS",
        timing: "whenever",
      },
      effect: {
        type: "put-damage",
        amount: 1,
        target: { ref: "trigger-subject" },
      },
    },
  ],
  i18n: queenOfHeartsUnpredictableBullyI18n,
};
