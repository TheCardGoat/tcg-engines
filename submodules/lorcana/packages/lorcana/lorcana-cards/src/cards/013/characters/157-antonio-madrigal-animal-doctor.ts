import type { CharacterCard } from "@tcg/lorcana-types";
import { antonioMadrigalAnimalDoctorI18n } from "./157-antonio-madrigal-animal-doctor.i18n";

export const antonioMadrigalAnimalDoctor: CharacterCard = {
  id: "5gt",
  canonicalId: "ci_5gt",
  slug: "lorcana-ci_5gt",
  printings: [
    {
      id: "set13-157",
      artId: "set13-157",
      setCode: "set13",
      collectorNumber: "157",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-157"],
  cardType: "character",
  name: "Antonio Madrigal",
  version: "Animal Doctor",
  inkType: ["sapphire"],
  franchise: "Encanto",
  set: "013",
  cardNumber: 157,
  rarity: "uncommon",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_c0013cabd524455db8ef541c176fb3b3",
  },
  text: [
    {
      title: "HEALING HANDS",
      description:
        "When you play this character, you may remove up to 3 damage from chosen character of yours. If you removed damage this way, put the top card of your deck into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Madrigal"],
  abilities: [
    {
      type: "triggered",
      name: "Healing Hands",
      text: "Healing Hands When you play this character, you may remove up to 3 damage from chosen character of yours. If you removed damage this way, put the top card of your deck into your inkwell facedown and exerted.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "remove-damage",
              amount: {
                type: "up-to",
                value: 3,
              },
              target: {
                selector: "chosen",
                count: 1,
                owner: "you",
                zones: ["play"],
                cardTypes: ["character"],
              },
            },
            {
              type: "conditional",
              condition: {
                type: "if-you-do",
              },
              then: {
                type: "put-into-inkwell",
                source: "top-of-deck",
                target: "CONTROLLER",
                exerted: true,
                facedown: true,
              },
            },
          ],
        },
      },
    },
  ],
  i18n: antonioMadrigalAnimalDoctorI18n,
};
