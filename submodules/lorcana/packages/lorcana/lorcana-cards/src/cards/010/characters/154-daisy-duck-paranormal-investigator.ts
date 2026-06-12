import type { CharacterCard } from "@tcg/lorcana-types";
import { shift } from "../../../helpers/abilities/shift";
import { support } from "../../../helpers/abilities/support";
import { daisyDuckParanormalInvestigatorI18n } from "./154-daisy-duck-paranormal-investigator.i18n";

export const daisyDuckParanormalInvestigator: CharacterCard = {
  id: "yOS",
  canonicalId: "ci_yOS",
  reprints: ["set10-154"],
  cardType: "character",
  name: "Daisy Duck",
  version: "Paranormal Investigator",
  inkType: ["sapphire"],
  set: "010",
  cardNumber: 154,
  rarity: "legendary",
  cost: 6,
  strength: 4,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_ca1180986a264b5f815f69fb01406b4e",
    tcgPlayer: 657886,
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
  i18n: daisyDuckParanormalInvestigatorI18n,
};
