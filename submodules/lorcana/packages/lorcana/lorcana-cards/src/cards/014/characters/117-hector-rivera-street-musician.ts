import type { CharacterCard } from "@tcg/lorcana-types";
import { hctorRiveraStreetMusicianI18n } from "./117-hector-rivera-street-musician.i18n";
import { singer } from "../../../helpers/abilities/singer";

export const hctorRiveraStreetMusician: CharacterCard = {
  id: "sWk",
  canonicalId: "ci_sWk",
  slug: "lorcana-ci_sWk",
  printings: [
    {
      id: "set14-117",
      artId: "set14-117",
      setCode: "set14",
      collectorNumber: "117",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-117"],
  cardType: "character",
  name: "Héctor Rivera",
  version: "Street Musician",
  inkType: ["ruby"],
  franchise: "Coco",
  set: "014",
  cardNumber: 117,
  rarity: "uncommon",
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "Singer 2",
    },
    {
      title: "Strike a Chord",
      description:
        "When you play this character, you may put the top card of your deck into your discard.",
    },
  ],
  classifications: ["Storyborn", "Mentor"],
  abilities: [
    singer(2),
    {
      id: "sWk-1",
      name: "Strike a Chord",
      type: "triggered",
      text: "Strike a Chord When you play this character, you may put the top card of your deck into your discard.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "mill",
          amount: 1,
          target: "CONTROLLER",
        },
      },
    },
  ],
  i18n: hctorRiveraStreetMusicianI18n,
};
