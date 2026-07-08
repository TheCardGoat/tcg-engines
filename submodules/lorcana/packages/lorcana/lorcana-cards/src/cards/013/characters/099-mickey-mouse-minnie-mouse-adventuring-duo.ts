import type { CharacterCard } from "@tcg/lorcana-types";
import { mickeyMouseMinnieMouseAdventuringDuoI18n } from "./099-mickey-mouse-minnie-mouse-adventuring-duo.i18n";

import { duoShift } from "../../../helpers/abilities/shift";

export const mickeyMouseMinnieMouseAdventuringDuo: CharacterCard = {
  id: "d10",
  canonicalId: "ci_d10",
  slug: "lorcana-ci_d10",
  printings: [
    {
      id: "set13-099",
      artId: "set13-099",
      setCode: "set13",
      collectorNumber: "99",
      rarity: "legendary",
      imageUrl: "",
    },
  ],
  reprints: ["set13-099"],
  cardType: "character",
  name: "Mickey Mouse & Minnie Mouse",
  version: "Adventuring Duo",
  inkType: ["emerald", "sapphire"],
  set: "013",
  cardNumber: 99,
  rarity: "legendary",
  cost: 7,
  strength: 5,
  willpower: 5,
  lore: 5,
  inkable: true,
  externalIds: {
    lorcast: "crd_a02034ec2089499f81f2038b33ca473a",
  },
  text: [
    {
      title: "Duo Shift 0 {I}",
      description:
        "(You may pay 0 {I} to play this on top of two of your characters, one named Mickey Mouse and one named Minnie Mouse.)",
    },
    {
      title: "THINKING OF YOU",
      description:
        "If this character would be banished, put them into your inkwell facedown and exerted instead.",
    },
  ],
  classifications: ["Dreamborn", "Team", "Hero"],
  abilities: [
    duoShift(["Mickey Mouse", "Minnie Mouse"], 0),
    {
      type: "replacement",
      name: "Thinking of You",
      text: "Thinking of You If this character would be banished, put them into your inkwell facedown and exerted instead.",
      replaces: "banish-self",
      replacement: {
        type: "zone-destination",
        eventKinds: ["zone-change"],
        targetRef: "source",
        fromZones: ["play"],
        toZone: "discard",
        replacementZone: "inkwell",
        replacementState: "exerted",
        replacementPublicFaceState: "faceDown",
        consumeOnApply: false,
      },
    },
  ],
  i18n: mickeyMouseMinnieMouseAdventuringDuoI18n,
};
