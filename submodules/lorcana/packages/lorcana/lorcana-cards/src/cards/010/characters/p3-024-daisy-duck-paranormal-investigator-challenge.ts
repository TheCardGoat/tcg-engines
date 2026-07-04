import type { CharacterCard } from "@tcg/lorcana-types";
import { daisyDuckParanormalInvestigatorP3ChallengeI18n } from "./p3-024-daisy-duck-paranormal-investigator-challenge.i18n";

import { shift } from "../../../helpers/abilities/shift";
import { support } from "../../../helpers/abilities/support";

export const daisyDuckParanormalInvestigatorP3Challenge: CharacterCard = {
  id: "zHS",
  canonicalId: "ci_1Fj",
  slug: "lorcana-ci_1Fj",
  printings: [
    {
      id: "set10-p3-024-challenge",
      artId: "ci_1Fj-challenge",
      setCode: "set10",
      collectorNumber: "24",
      rarity: "challenge",
      imageUrl: "",
    },
  ],
  reprints: ["set10-154"],
  cardType: "character",
  name: "Daisy Duck",
  version: "Paranormal Investigator",
  inkType: ["sapphire"],
  set: "010",
  cardNumber: 24,
  rarity: "special",
  specialRarity: "challenge",
  cost: 6,
  strength: 4,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_ca1180986a264b5f815f69fb01406b4e",
    tcgPlayer: "657886",
  },
  text: [
    {
      title: "Shift 4 {I}",
    },
    {
      title: "Support",
    },
    {
      title: "STRANGE HAPPENINGS",
      description: "While this character is exerted, cards enter opponents' inkwells exerted.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Detective"],
  abilities: [
    shift(4),
    support,
    {
      id: "yOS-3",
      condition: {
        type: "is-exerted",
      },
      effect: {
        type: "exert",
        target: {
          ref: "trigger-subject",
        },
      },
      name: "STRANGE HAPPENINGS",
      text: "STRANGE HAPPENINGS While this character is exerted, cards enter opponents' inkwells exerted.",
      trigger: {
        event: "ink",
        on: "OPPONENT",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: daisyDuckParanormalInvestigatorP3ChallengeI18n,
};
