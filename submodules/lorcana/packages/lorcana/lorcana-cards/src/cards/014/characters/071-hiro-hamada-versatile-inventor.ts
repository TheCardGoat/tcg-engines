import type { CharacterCard } from "@tcg/lorcana-types";
import { hiroHamadaVersatileInventorI18n } from "./071-hiro-hamada-versatile-inventor.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const hiroHamadaVersatileInventor: CharacterCard = {
  id: "mgU",
  canonicalId: "ci_mgU",
  slug: "lorcana-ci_mgU",
  printings: [
    {
      id: "set14-071",
      artId: "set14-071",
      setCode: "set14",
      collectorNumber: "71",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-071"],
  cardType: "character",
  name: "Hiro Hamada",
  version: "Versatile Inventor",
  inkType: ["emerald"],
  franchise: "Big Hero 6",
  set: "014",
  cardNumber: 71,
  rarity: "uncommon",
  cost: 2,
  strength: 3,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_2093d8e216c141d0b029ebcd1091ebf0",
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "TURBO THRUSTERS",
      description:
        "When you play this character, you may pay 1 {I} to give chosen character of yours Evasive until the start of your next turn.",
    },
  ],
  classifications: ["Dreamborn", "Super", "Hero", "Inventor"],
  abilities: [
    evasive,
    {
      id: "mgU-2",
      name: "TURBO THRUSTERS",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "pay-cost",
          cost: {
            ink: 1,
          },
          effect: {
            type: "gain-keyword",
            keyword: "Evasive",
            duration: "until-start-of-next-turn",
            target: {
              cardTypes: ["character"],
              count: 1,
              owner: "you",
              selector: "chosen",
              zones: ["play"],
            },
          },
        },
      },
      text: "TURBO THRUSTERS When you play this character, you may pay 1 {I} to give chosen character of yours Evasive until the start of your next turn.",
    },
  ],
  i18n: hiroHamadaVersatileInventorI18n,
};
