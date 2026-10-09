import type { CharacterCard } from "@tcg/lorcana-types";
import { nickWildeInquisitiveHarbormasterI18n } from "./011-nick-wilde-inquisitive-harbormaster.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const nickWildeInquisitiveHarbormaster: CharacterCard = {
  id: "gFZ",
  canonicalId: "ci_gFZ",
  slug: "lorcana-ci_gFZ",
  printings: [
    {
      id: "set14-011",
      artId: "set14-011",
      setCode: "set14",
      collectorNumber: "11",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-011"],
  cardType: "character",
  name: "Nick Wilde",
  version: "Inquisitive Harbormaster",
  inkType: ["amber"],
  franchise: "Zootropolis",
  set: "014",
  cardNumber: 11,
  rarity: "rare",
  cost: 6,
  strength: 3,
  willpower: 5,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_44606b91eae5430e9ee3290986734dbd",
  },
  text: [
    {
      title: "Shift 4 {I}",
    },
    {
      title: "RESTRICTED ROUTE",
      description:
        "Whenever this character quests, you may give chosen character Adventurous until the start of your next turn. (They can't challenge and must quest if able.)",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Detective"],
  abilities: [
    shift(4),
    {
      id: "gFZ-2",
      name: "RESTRICTED ROUTE",
      type: "triggered",
      text: "RESTRICTED ROUTE Whenever this character quests, you may give chosen character Adventurous until the start of your next turn. (They can't challenge and must quest if able.)",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "restriction",
              restriction: "cant-challenge",
              duration: "until-start-of-next-turn",
              target: {
                selector: "chosen",
                count: 1,
                owner: "any",
                zones: ["play"],
                cardTypes: ["character"],
              },
            },
            {
              type: "restriction",
              restriction: "must-quest",
              duration: "until-start-of-next-turn",
              target: { ref: "previous-target" },
            },
          ],
        },
      },
    },
  ],
  i18n: nickWildeInquisitiveHarbormasterI18n,
};
