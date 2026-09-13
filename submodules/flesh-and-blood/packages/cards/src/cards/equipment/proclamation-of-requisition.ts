import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/proclamation-of-requisition.generated.ts";

export const proclamationOfRequisition = defineCard(
  fabCardIdentitiesByCanonicalId["nPNcp7BDrghp6dLPfHnNp"],
  {
    abilities: {
      actionDiscardRedDestroyProclamationRequisitionEachOpponentChooses: {
        kind: "activated",
        abilityType: "action",
        cost: {
          class: "mixed",
          type: "all",
          costs: [
            {
              class: "effect",
              type: "discard",
              count: 1,
              filter: {
                color: ["red"],
              },
            },
            {
              class: "effect",
              type: "destroy-self",
            },
          ],
        },
        effect: {
          type: "for-each",
          target: {
            selector: "each-other-hero",
          },
          effect: {
            type: "sequence",
            steps: [
              {
                type: "choose-card",
                chooser: "iteration-subject",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "iteration-subject",
                  zones: ["permanent"],
                  filter: {
                    or: [
                      {
                        typeBox: {
                          subtypes: ["Item"],
                        },
                      },
                      {
                        typeBox: {
                          subtypes: ["Landmark"],
                        },
                      },
                    ],
                  },
                  count: 1,
                },
                outputBinding: "it",
              },
              {
                type: "gain-control",
                target: {
                  selector: "binding",
                  binding: "it",
                },
                controller: "controller",
              },
            ],
          },
        },
      },
    },
  },
);
