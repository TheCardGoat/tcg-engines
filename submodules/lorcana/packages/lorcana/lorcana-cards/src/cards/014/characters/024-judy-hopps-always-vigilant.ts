import type { CharacterCard } from "@tcg/lorcana-types";
import { judyHoppsAlwaysVigilantI18n } from "./024-judy-hopps-always-vigilant.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const judyHoppsAlwaysVigilant: CharacterCard = {
  id: "eUU",
  canonicalId: "ci_eUU",
  slug: "lorcana-ci_eUU",
  printings: [
    {
      id: "set14-024",
      artId: "set14-024",
      setCode: "set14",
      collectorNumber: "24",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-024"],
  cardType: "character",
  name: "Judy Hopps",
  version: "Always Vigilant",
  inkType: ["amber"],
  franchise: "Zootropolis",
  set: "014",
  cardNumber: 24,
  rarity: "rare",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_c0ecc42e2ece4bf393944a85ac0a8763",
  },
  text: [
    {
      title: "Shift 2 {I}",
    },
    {
      title: "GOT YOU NOW",
      description:
        "When you play this character, if you played another character this turn, you may banish chosen character with 5 {S} or more.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Detective"],
  abilities: [
    shift(2),
    {
      id: "eUU-2",
      name: "GOT YOU NOW",
      type: "triggered",
      text: "GOT YOU NOW When you play this character, if you played another character this turn, you may banish chosen character with 5 {S} or more.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      condition: {
        type: "turn-metric",
        metric: "played-character-with-classification",
        comparison: {
          operator: "gte",
          value: 1,
        },
        excludeSource: true,
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "banish",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
            filter: [
              {
                type: "strength-comparison",
                comparison: "greater-or-equal",
                value: 5,
              },
            ],
          },
        },
      },
    },
  ],
  i18n: judyHoppsAlwaysVigilantI18n,
};
