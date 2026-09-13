import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/warmonger-s-diplomacy.generated.ts";

export const warmongerSDiplomacy = definePitchFamily(fabPitchFamilies["warmonger-s-diplomacy"], {
  abilities: () => ({
    startingWithHeroLeftEachHeroChoosesWarPeaceTheyChooseWar: {
      kind: "resolution",
      effect: {
        // Walk every hero seat, binding the current hero as `iteration-subject`.
        // That binding is what scopes the per-hero `chose-war`/`chose-peace`
        // status read AND the resulting `require` rule's controllerId to the
        // choosing hero, so each hero is restricted on their own following turn.
        type: "for-each",
        target: { selector: "each-hero" },
        effect: {
          type: "sequence",
          steps: [
            {
              type: "choose-option",
              options: ["war", "peace"],
              chooser: "iteration-subject",
            },
            {
              type: "conditional",
              condition: {
                type: "has-status",
                status: "chose-war",
              },
              then: {
                // "only weapon and attack actions" — require filter (Oath of
                // Loyalty shape), scoped to this iteration-subject.
                type: "rule-modification",
                mode: "require",
                action: "play",
                filter: {
                  or: [
                    {
                      typeBox: {
                        types: ["Weapon"],
                      },
                    },
                    {
                      and: [
                        {
                          typeBox: {
                            types: ["Action"],
                          },
                        },
                        {
                          typeBox: {
                            subtypes: ["Attack"],
                          },
                        },
                      ],
                    },
                  ],
                },
                duration: "until-end-of-next-turn",
              },
            },
            {
              type: "conditional",
              condition: {
                type: "has-status",
                status: "chose-peace",
              },
              then: {
                type: "rule-modification",
                mode: "require",
                action: "play",
                filter: {
                  and: [
                    {
                      typeBox: {
                        types: ["Action"],
                      },
                    },
                    {
                      typeBox: {
                        excludeSubtypes: ["Attack"],
                      },
                    },
                    {
                      typeBox: {
                        excludeTypes: ["Weapon"],
                      },
                    },
                  ],
                },
                duration: "until-end-of-next-turn",
              },
            },
          ],
        },
      },
    },
  }),
});

export const { blue: warmongerSDiplomacyBlue } = warmongerSDiplomacy.cards;
