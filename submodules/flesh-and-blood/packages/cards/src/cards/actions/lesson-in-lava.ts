import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/lesson-in-lava.generated.ts";

export const lessonInLava = definePitchFamily(fabPitchFamilies["lesson-in-lava"], {
  keywords: [
    {
      name: "specialization",
      hero: "Kano",
    },
  ],
  abilities: () => ({
    deal3ArcaneDamageTargetOpposing: {
      kind: "resolution",
      effect: {
        type: "deal-damage",
        damageType: "arcane",
        amount: 3,
        target: {
          selector: "opponent",
        },
      },
    },
    dealsDamageSearchDeckWizardResourceCostEqualLessThanDamageDealtLessonLavaRevealThenShuffleDeckPutTopDeck:
      {
        kind: "resolution",
        condition: {
          type: "has-status",
          status: "this-dealt-damage",
        },
        effect: {
          type: "sequence",
          steps: [
            {
              type: "optional",
              effect: {
                type: "search",
                zones: ["deck"],
                filter: {
                  typeBox: {
                    supertypes: ["Wizard"],
                  },
                  // Printed "{r} cost equal to or less than the damage dealt by
                  // Lesson in Lava": the ARC138 cost-ceiling filter shape,
                  // source-scoped on this card's own damage (Aether Spindle
                  // count-filter idiom) — the prior pseudo-keyword never matched.
                  // LIMITATION (plan §5, CR 2.12.3a): the name filter is
                  // NAME-scoped, not instance-scoped — damage attribution has no
                  // provenance link to the resolving card, so two same-named
                  // copies played in one turn combine their damage into the
                  // ceiling. Pinned by the two-copy pin test; same idiom family:
                  // UPR170-172, ARC126-128, ARC132-134, DYN119, DYN192.
                  cost: {
                    op: "lte",
                    value: {
                      type: "count",
                      what: "damage-dealt",
                      per: "turn",
                      filter: {
                        name: "Lesson in Lava",
                      },
                    },
                  },
                },
                mayFail: true,
                to: {
                  zone: "deck",
                  position: "top",
                },
              },
            },
          ],
        },
      },
  }),
});

export const { yellow: lessonInLavaYellow } = lessonInLava.cards;
