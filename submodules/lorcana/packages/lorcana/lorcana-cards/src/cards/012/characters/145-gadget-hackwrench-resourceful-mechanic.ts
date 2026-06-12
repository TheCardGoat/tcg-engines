import type { CharacterCard } from "@tcg/lorcana-types";
import { gadgetHackwrenchResourcefulMechanicI18n } from "./145-gadget-hackwrench-resourceful-mechanic.i18n";

export const gadgetHackwrenchResourcefulMechanic: CharacterCard = {
  id: "fJ4",
  canonicalId: "ci_fJ4",
  reprints: ["set12-145"],
  cardType: "character",
  name: "Gadget Hackwrench",
  version: "Resourceful Mechanic",
  inkType: ["sapphire"],
  franchise: "Rescue Rangers",
  set: "012",
  cardNumber: 145,
  rarity: "common",
  cost: 4,
  strength: 1,
  willpower: 5,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_ddc2c44f61984a82b0020763c4e4a5e8",
  },
  text: [
    {
      title: "TIME TO TINKER",
      description:
        "When you play this character, you may play an item with cost 3 or less for free.",
    },
    {
      title: "WELL SUPPLIED",
      description: "Your characters with Support get +1 {L}.",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Inventor"],
  abilities: [
    {
      id: "DQn-1",
      name: "TIME TO TINKER",
      type: "triggered",
      text: "TIME TO TINKER When you play this character, you may play an item with cost 3 or less for free.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "play-card",
          cardType: "item",
          cost: "free",
          costRestriction: {
            comparison: "less-or-equal",
            value: 3,
          },
          from: "hand",
        },
      },
    },
    {
      id: "DQn-2",
      name: "WELL SUPPLIED",
      type: "static",
      text: "WELL SUPPLIED Your characters with Support get +1 {L}.",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-keyword",
              keyword: "Support",
            },
          ],
        },
      },
    },
  ],
  i18n: gadgetHackwrenchResourcefulMechanicI18n,
};
