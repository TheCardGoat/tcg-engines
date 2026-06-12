import type { CharacterCard } from "@tcg/lorcana-types";
import { mulanImperialGeneralI18n } from "./141-mulan-imperial-general.i18n";
import { shift } from "../../../helpers/abilities/shift";
import { evasive } from "../../../helpers/abilities/evasive";

export const mulanImperialGeneral: CharacterCard = {
  id: "jFo",
  canonicalId: "ci_jFo",
  reprints: ["set7-141"],
  cardType: "character",
  name: "Mulan",
  version: "Imperial General",
  inkType: ["ruby", "steel"],
  franchise: "Mulan",
  set: "007",
  cardNumber: 141,
  rarity: "common",
  cost: 7,
  strength: 5,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_5d754111355845818b81e2a9a506bab4",
    tcgPlayer: 619486,
  },
  text: [
    {
      title: "Shift 5",
    },
    {
      title: "Evasive",
    },
    {
      title: "EXCEPTIONAL LEADER",
      description:
        'Whenever this character challenges another character, your other characters gain "This character can challenge ready characters" this turn.',
    },
  ],
  classifications: ["Floodborn", "Hero", "Princess"],
  abilities: [
    shift(5),
    evasive,
    {
      effect: {
        ability: "can-challenge-ready",
        duration: "this-turn",
        target: "YOUR_OTHER_CHARACTERS",
        type: "grant-ability",
      },
      id: "17b-3",
      name: "EXCEPTIONAL LEADER",
      text: "EXCEPTIONAL LEADER Whenever this character challenges another character, your other characters gain “This character can challenge ready characters” this turn.",
      trigger: {
        event: "challenge",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: mulanImperialGeneralI18n,
};
