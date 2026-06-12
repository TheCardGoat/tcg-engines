import type { CharacterCard } from "@tcg/lorcana-types";
import { rcRemotecontrolledCarI18n } from "./077-rc-remote-controlled-car.i18n";

export const rcRemotecontrolledCar: CharacterCard = {
  id: "Q20",
  canonicalId: "ci_Q20",
  reprints: ["set12-077"],
  cardType: "character",
  name: "RC",
  version: "Remote-Controlled Car",
  inkType: ["emerald"],
  franchise: "Toy Story",
  set: "012",
  cardNumber: 77,
  rarity: "common",
  cost: 1,
  strength: 3,
  willpower: 2,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_82226e6a95b54a879f3428c272b34108",
  },
  text: [
    {
      title: "LOW BATTERIES",
      description:
        "This character can't quest or challenge unless you pay 1 {I}. (You pay this cost each time.)",
    },
  ],
  classifications: ["Storyborn", "Ally", "Toy", "Racer"],
  abilities: [
    {
      id: "Q20-1",
      name: "LOW BATTERIES",
      type: "static",
      effect: {
        type: "restriction",
        restriction: "cant-quest-or-challenge",
        target: "SELF",
        bypass: {
          cost: {
            ink: 1,
          },
        },
      },
      text: "LOW BATTERIES This character can't quest or challenge unless you pay 1 {I}. (You pay this cost each time.)",
    },
  ],
  i18n: rcRemotecontrolledCarI18n,
};
