import type { CharacterCard } from "@tcg/lorcana-types";
import { nickWildeToyDriveOfficerI18n } from "./014-nick-wilde-toy-drive-officer.i18n";
import { support } from "../../../helpers/abilities/support";

export const nickWildeToyDriveOfficer: CharacterCard = {
  id: "IsT",
  canonicalId: "ci_IsT",
  slug: "lorcana-ci_IsT",
  printings: [
    {
      id: "set14-014",
      artId: "set14-014",
      setCode: "set14",
      collectorNumber: "14",
      rarity: "super_rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-014"],
  cardType: "character",
  name: "Nick Wilde",
  version: "Toy Drive Officer",
  inkType: ["amber"],
  franchise: "Zootropolis",
  set: "014",
  cardNumber: 14,
  rarity: "super_rare",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: false,
  text: [
    {
      title: "Support",
    },
    {
      title: "Community Outreach",
      description:
        "At the end of your turn, if you played 2 or more characters this turn, draw a card.",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Detective"],
  abilities: [
    support,
    {
      id: "IsT-2",
      name: "Community Outreach",
      type: "triggered",
      text: "Community Outreach At the end of your turn, if you played 2 or more characters this turn, draw a card.",
      trigger: {
        event: "end-turn",
        on: "YOU",
        timing: "at",
      },
      condition: {
        type: "turn-metric",
        metric: "played-character-with-classification",
        comparison: {
          operator: "gte",
          value: 2,
        },
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
    },
  ],
  i18n: nickWildeToyDriveOfficerI18n,
};
