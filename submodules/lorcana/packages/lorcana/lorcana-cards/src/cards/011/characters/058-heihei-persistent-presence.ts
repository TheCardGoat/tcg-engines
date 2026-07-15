import type { CharacterCard } from "@tcg/lorcana-types";
import { heiheiPersistentPresenceI18n } from "./058-heihei-persistent-presence.i18n";

export const heiheiPersistentPresence: CharacterCard = {
  id: "kli",
  canonicalId: "ci_aw8",
  slug: "lorcana-ci_aw8",
  printings: [
    {
      id: "set11-058",
      artId: "set11-058",
      setCode: "set11",
      collectorNumber: "58",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set2-043", "set11-058"],
  cardType: "character",
  name: "Heihei",
  version: "Persistent Presence",
  inkType: ["amethyst"],
  franchise: "Moana",
  set: "011",
  cardNumber: 58,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_122d3f9ccb034f7d9e59245d311a7004",
    tcgPlayer: "675296",
  },
  text: [
    {
      title: "HE'S BACK!",
      description:
        "When this character is banished in a challenge, return this card from your discard to your hand.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
  abilities: [
    {
      id: "1a9-1",
      sourceZones: ["play", "discard"],
      effect: {
        target: {
          ref: "self",
        },
        type: "return-to-hand",
      },
      name: "HE'S BACK!",
      trigger: {
        event: "banish",
        on: "SELF",
        restrictions: [
          {
            type: "in-challenge",
          },
        ],
        timing: "when",
      },
      type: "triggered",
      text: "HE'S BACK! When this character is banished in a challenge, return this card from your discard to your hand.",
    },
  ],
  i18n: heiheiPersistentPresenceI18n,
};
