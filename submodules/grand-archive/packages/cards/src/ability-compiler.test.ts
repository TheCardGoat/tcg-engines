import { describe, expect, it } from "vitest";
import { compileGrandArchiveAbilities } from "../scripts/compile-card-abilities.ts";

function compile(rulesText: string) {
  return compileGrandArchiveAbilities({
    canonicalId: "fixture",
    name: "Fixture",
    rulesText,
    types: ["ACTION"],
  });
}

describe("Grand Archive ability compiler", () => {
  it("preserves separate per-unit buffers and the specified damage type", () => {
    for (const damageType of ["combat ", "non-combat ", ""]) {
      const result = compile(
        `Remove a durability counter from Fixture: Prevent the next 1 ${damageType}damage that would be dealt to each unit you control this turn.`,
      );
      expect(result.unparsedParagraphs).toBe(0);
      expect(result.abilities).toMatchObject([
        {
          kind: "activated",
          cost: { kind: "remove-counter", subject: { kind: "source" }, amount: 1 },
          effect: {
            event: {
              recipient: {
                controller: "controller",
                filter: { kind: "type", oneOf: ["ALLY", "CHAMPION"] },
              },
            },
            capacity: { amount: 1, scope: "per-object" },
          },
        },
      ]);
      const ability = result.abilities[0];
      if (ability?.kind !== "activated" || ability.effect?.kind !== "replacement")
        throw new Error("Expected activated prevention");
      expect(
        "combatDamage" in ability.effect.event ? ability.effect.event.combatDamage : undefined,
      ).toBe(damageType ? damageType === "combat " : undefined);
    }
  });
  it("compiles a champion counter payment as an optional printed-cost replacement", () => {
    expect(
      compile(
        "You may remove three preparation counters from your champion rather than pay this card's reserve cost.",
      ).abilities,
    ).toMatchObject([
      {
        kind: "static",
        effects: [
          {
            kind: "rule-modification",
            mode: "replace-cost",
            action: "pay-cost",
            subject: { kind: "source" },
            costKind: "reserve",
            cost: {
              kind: "remove-counter",
              subject: { kind: "champion", player: "controller" },
              counter: { named: "preparation" },
              amount: 3,
            },
          },
        ],
      },
    ]);
    expect(
      JSON.stringify(
        compile("You may remove three preparation counters from your champion.").abilities,
      ),
    ).not.toContain("replace-cost");
  });
  it("compiles a self prevention activated ability with its champion counter cost", () => {
    const result = compile(
      "Remove two enlighten counters from your champion: The next time damage would be dealt to Fixture this turn, prevent that damage.",
    );
    expect(result.unparsedParagraphs).toBe(0);
    expect(result.abilities).toMatchObject([
      {
        kind: "activated",
        cost: {
          kind: "remove-counter",
          subject: { kind: "champion", player: "controller" },
          counter: { named: "enlighten" },
          amount: 2,
        },
        effect: {
          kind: "replacement",
          event: { recipient: { kind: "source" } },
          duration: {
            kind: "for-next-event",
            event: "damage-dealt",
            expires: { kind: "this-turn" },
          },
        },
      },
    ]);
    expect(
      JSON.stringify(
        compile(
          "Remove two enlighten counters from your champion: The next time damage would be dealt to Another Unit this turn, prevent that damage.",
        ).abilities,
      ),
    ).not.toContain('"recipient":{"kind":"source"}');
  });
  it("limits prevent-all-but-one to the next damage event", () => {
    expect(
      compile(
        "The next time damage would be dealt to your champion this turn, prevent all but 1 of that damage.",
      ).abilities,
    ).toMatchObject([
      {
        effect: {
          duration: {
            kind: "for-next-event",
            event: "damage-dealt",
            expires: { kind: "this-turn" },
          },
        },
      },
    ]);
  });
  it("retains the defended champion restriction on an attacking ally target", () => {
    expect(
      compile("Deal 4 damage to target ally attacking your champion.").abilities,
    ).toMatchObject([
      {
        targets: [
          {
            candidates: {
              filter: {
                kind: "all",
                filters: expect.arrayContaining([
                  { kind: "type", oneOf: ["ALLY"] },
                  {
                    kind: "attacking-subject",
                    defender: { kind: "champion", player: "controller" },
                  },
                ]),
              },
            },
          },
        ],
      },
    ]);
    expect(
      JSON.stringify(compile("Deal 4 damage to target attacking ally.").abilities),
    ).not.toContain("attacking-subject");
  });
  it("adds the returned Sword's durability as it enters, before entry triggers", () => {
    const report = compile(
      "Choose a Sword regalia card with memory cost 1 or less from your banishment and put it onto the field. It enters the field with three additional durability counters on it.",
    );
    expect(report.unparsedParagraphs).toBe(0);
    expect(report.abilities).toMatchObject([
      {
        effect: {
          effect: {
            effects: [
              {
                kind: "replacement",
                event: { subject: { kind: "bound-object", binding: "chosen-sword-regalia" } },
                operation: {
                  kind: "add-object-counters",
                  counters: [{ counter: "durability", amount: 3 }],
                },
              },
              { kind: "move" },
            ],
          },
        },
      },
    ]);
  });
  it("preserves random selection before or after a zone phrase", () => {
    for (const text of [
      "Banish two cards at random from your memory.",
      "Banish two cards from your memory at random.",
    ]) {
      const report = compile(text);
      expect(report.unparsedParagraphs).toBe(0);
      expect(report.abilities).toMatchObject([
        {
          effect: {
            kind: "banish",
            selection: { method: "random", candidates: { zones: ["memory"] } },
          },
        },
      ]);
    }
  });
  it("retains all three arcane Mage Spell characteristics", () => {
    const report = compile(
      "Fixture gets +1 level for each arcane element Mage Spell card in your banishment.",
    );
    expect(report.unparsedParagraphs).toBe(0);
    expect(report.abilities).toMatchObject([
      {
        effects: [
          {
            change: {
              amount: {
                collection: {
                  filter: {
                    kind: "all",
                    filters: [
                      { kind: "element", oneOf: ["ARCANE"] },
                      { kind: "class", oneOf: ["MAGE"] },
                      { kind: "subtype", oneOf: ["SPELL"] },
                    ],
                  },
                },
              },
            },
          },
        ],
      },
    ]);
  });
  it("retains an unambiguous prior target across consecutive sentences", () => {
    const report = compile(
      "Deal 2 damage to target ally you control. That ally gets +2 POWER until end of turn.",
    );
    expect(report.unparsedParagraphs).toBe(0);
    expect(report.abilities).toMatchObject([
      {
        effect: {
          effects: [
            { kind: "deal-damage", recipient: { kind: "bound", binding: "target-1" } },
            { kind: "continuous", subjects: { kind: "bound", binding: "target-1" } },
          ],
        },
      },
    ]);
  });
  it("places self-damage-triggered counters on the damaged source, preserving explicit targets", () => {
    expect(
      compile("Whenever Fixture is dealt damage, put a buff counter on it.").abilities,
    ).toMatchObject([{ effect: { kind: "add-counter", subject: { kind: "source" } } }]);
    expect(
      compile("Whenever Fixture is dealt damage, put a buff counter on target ally.").abilities,
    ).toMatchObject([
      { effect: { kind: "add-counter", subject: { kind: "bound", binding: "target-1" } } },
    ]);
  });
  it("scopes the next filtered activation discount to its controller and this turn", () => {
    const report = compile(
      "The next Beast ally card you activate this turn costs 3 less to activate.",
    );
    expect(report.unparsedParagraphs).toBe(0);
    expect(report.abilities).toMatchObject([
      {
        effect: {
          subject: { kind: "player", player: "controller" },
          filter: {
            kind: "all",
            filters: [
              { kind: "type", oneOf: ["ALLY"] },
              { kind: "subtype", oneOf: ["BEAST"] },
            ],
          },
          duration: {
            kind: "for-next-event",
            event: "card-activated",
            expires: { kind: "this-turn" },
          },
        },
      },
    ]);
  });
  it("expires a global wake prohibition separately for each ally controller", () => {
    const report = compile(
      "Deal 1 damage to all allies and rest them. Those allies don't wake up during their controller's next wake up phase.",
    );
    expect(report.unparsedParagraphs).toBe(0);
    expect(report.abilities).toMatchObject([
      {
        effect: {
          effect: {
            effects: [
              { kind: "deal-damage" },
              { kind: "rest" },
              {
                kind: "for-each",
                bindEachAs: "frozen-ally",
                effect: {
                  duration: {
                    kind: "until-end-of-next-phase",
                    phase: "wake-up",
                    whose: { controllerOf: "frozen-ally" },
                  },
                },
              },
            ],
          },
        },
      },
    ]);
  });
  it("declares the opponents' hand selections before reserving them", () => {
    const report = compile(
      "Banish Blinding Orb: Each opponent puts two cards from their hand into their memory. Class Bonus: Draw a card.",
    );
    expect(report.unparsedParagraphs).toBe(0);
    expect(report.abilities).toMatchObject([
      {
        effect: {
          kind: "sequence",
          effects: [
            {
              kind: "reserve",
              player: "each-opponent",
              selection: { chooser: "each-opponent", count: { kind: "exactly", amount: 2 } },
            },
            { kind: "conditional" },
          ],
        },
      },
    ]);
  });
  it("binds a Class Bonus continuation to its sole declared ally target", () => {
    const report = compile(
      "Wake up target ally. Class Bonus: That ally gets +1 POWER until end of turn.",
    );
    expect(report.unparsedParagraphs).toBe(0);
    expect(report.abilities).toMatchObject([
      {
        effect: {
          kind: "sequence",
          effects: [
            { kind: "wake", subject: { kind: "bound", binding: "target-1" } },
            {
              kind: "conditional",
              then: { kind: "continuous", subjects: { kind: "bound", binding: "target-1" } },
            },
          ],
        },
      },
    ]);
  });
  it("requires stealth on the selected controlled ally", () => {
    const report = compile("Target ally you control with stealth gets +2 POWER until end of turn.");
    expect(report.unparsedParagraphs).toBe(0);
    expect(report.abilities).toMatchObject([
      {
        targets: [
          {
            candidates: {
              relationship: "controlled-by",
              player: "controller",
              filter: {
                kind: "all",
                filters: [
                  { kind: "type", oneOf: ["ALLY"] },
                  { kind: "has-keyword", keyword: "stealth" },
                ],
              },
            },
          },
        ],
      },
    ]);
  });
  it("preserves stealth on the opposing combat unit filter", () => {
    const report = compile(
      "As long as Fixture is attacking a unit with stealth, Fixture gets +1 POWER.",
    );
    expect(report.unparsedParagraphs).toBe(0);
    expect(report.abilities).toMatchObject([
      {
        effects: [
          {
            condition: {
              kind: "combat-relation",
              otherFilter: {
                kind: "all",
                filters: [
                  { kind: "type", oneOf: ["ALLY", "CHAMPION"] },
                  { kind: "has-keyword", keyword: "stealth" },
                ],
              },
            },
          },
        ],
      },
    ]);
  });
  it("distinguishes ally-or-regalia alternatives and opposing control", () => {
    const either = compile("Suppress target ally or regalia.");
    expect(either.unparsedParagraphs).toBe(0);
    expect(either.abilities).toMatchObject([
      {
        targets: [
          {
            candidates: {
              filter: {
                kind: "any",
                filters: [
                  { kind: "type", oneOf: ["ALLY"] },
                  { kind: "supertype", oneOf: ["REGALIA"] },
                ],
              },
            },
          },
        ],
      },
    ]);
    const opposing = compile("Suppress up to one target ally an opponent controls.");
    expect(opposing.abilities).toMatchObject([
      { targets: [{ candidates: { relationship: "controlled-by", player: "opponent" } }] },
    ]);
  });
  it("binds replacement counters to the previously declared ally target", () => {
    const report = compile(
      "Put a buff counter on another target ally you control. If that ally is a Beast, put two buff counters on it instead.",
    );
    expect(report.unparsedParagraphs).toBe(0);
    expect(report.abilities).toMatchObject([
      {
        effect: {
          kind: "conditional",
          then: { kind: "add-counter", subject: { kind: "bound", binding: "target-1" }, amount: 2 },
        },
      },
    ]);
  });

  it("preserves both alternatives in a Harmony or Melody card filter", () => {
    const report = compile("Whenever you activate a Harmony or Melody card, draw a card.");
    expect(report.unparsedParagraphs).toBe(0);
    expect(report.abilities).toMatchObject([
      {
        kind: "triggered",
        trigger: {
          event: { subject: { filter: { kind: "subtype", oneOf: ["HARMONY", "MELODY"] } } },
        },
      },
    ]);
  });

  it("keeps random memory reveals automatic before their conditional consequence", () => {
    const report = compile(
      "Reveal a card at random from your memory. If that card is wind element, draw a card.",
    );
    expect(report.unparsedParagraphs).toBe(0);
    expect(report.abilities).toMatchObject([
      {
        kind: "card-resolution",
        effect: {
          kind: "sequence",
          effects: [{ kind: "reveal", selection: { method: "random" } }, { kind: "conditional" }],
        },
      },
    ]);
  });

  it("keeps a no-allies condition negative and scoped to the controller", () => {
    const report = compile("Fixture gets +1 POWER as long as you control no allies.");
    expect(report.unparsedParagraphs).toBe(0);
    expect(report.abilities).toMatchObject([
      {
        kind: "static",
        effects: [
          {
            condition: {
              kind: "not",
              condition: {
                kind: "collection-exists",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: { kind: "type", oneOf: ["ALLY"] },
                },
              },
            },
          },
        ],
      },
    ]);
  });

  it("retains both Mage class and Spell subtype on an action activation trigger", () => {
    for (const [descriptor, filters] of [
      [
        "Mage action",
        [
          { kind: "type", oneOf: ["ACTION"] },
          { kind: "class", oneOf: ["MAGE"] },
        ],
      ],
      [
        "Mage Spell action",
        [
          { kind: "type", oneOf: ["ACTION"] },
          { kind: "class", oneOf: ["MAGE"] },
          { kind: "subtype", oneOf: ["SPELL"] },
        ],
      ],
    ] as const) {
      const report = compile(`Whenever you activate a ${descriptor}, draw a card.`);
      expect(report.unparsedParagraphs).toBe(0);
      expect(report.abilities).toMatchObject([
        {
          kind: "triggered",
          trigger: {
            kind: "event",
            event: {
              name: "card-activated",
              actor: "controller",
              subject: { kind: "event-object", filter: { kind: "all", filters } },
            },
          },
        },
      ]);
    }
  });
  it("grants +1 LIFE and retort without treating the bonus as a life filter", () => {
    const report = compile("Target Human ally gets +1 LIFE and gains retort 2 until end of turn.");
    expect(report.unparsedParagraphs).toBe(0);
    expect(report.abilities).toMatchObject([
      {
        kind: "card-resolution",
        targets: [
          {
            candidates: {
              filter: {
                kind: "all",
                filters: [
                  { kind: "type", oneOf: ["ALLY"] },
                  { kind: "subtype", oneOf: ["HUMAN"] },
                ],
              },
            },
          },
        ],
        effect: {
          kind: "sequence",
          effects: [
            {
              kind: "continuous",
              change: { kind: "numeric", property: "life", operation: "add", amount: 1 },
            },
            {
              kind: "continuous",
              change: { kind: "grant-keyword", keyword: { name: "retort", value: 2 } },
            },
          ],
        },
      },
    ]);
  });

  it("puts a durability counter on the targeted weapon after the power bonus", () => {
    const report = compile(
      "Target weapon gets +1 POWER until end of turn. Put a durability counter on it.",
    );
    expect(report.unparsedParagraphs).toBe(0);
    expect(report.abilities).toMatchObject([
      {
        kind: "card-resolution",
        effect: {
          kind: "sequence",
          effects: [
            {
              kind: "continuous",
              change: { kind: "numeric", property: "power", operation: "add", amount: 1 },
            },
            {
              kind: "add-counter",
              subject: { kind: "bound", binding: "target-1" },
              counter: "durability",
              amount: 1,
            },
          ],
        },
      },
    ]);
  });

  it("buffs Animal or Beast allies after granting +1 LIFE", () => {
    const report = compile(
      "Target ally gets +1 LIFE until end of turn. If that ally is an Animal or a Beast, put a buff counter on it.",
    );
    expect(report.unparsedParagraphs).toBe(0);
    expect(report.abilities).toMatchObject([
      {
        kind: "card-resolution",
        effect: {
          kind: "sequence",
          effects: [
            {
              kind: "continuous",
              change: { kind: "numeric", property: "life", operation: "add", amount: 1 },
            },
            {
              kind: "conditional",
              condition: {
                kind: "subject-matches",
                filter: {
                  kind: "any",
                  filters: [
                    { kind: "subtype", oneOf: ["ANIMAL"] },
                    { kind: "subtype", oneOf: ["BEAST"] },
                  ],
                },
              },
              then: {
                kind: "add-counter",
                subject: { kind: "bound", binding: "target-1" },
                counter: "buff",
              },
            },
          ],
        },
      },
    ]);
  });

  it("counts wind non-champion objects without requiring the champion type", () => {
    const report = compile(
      "On Enter: Empower X, where X is the amount of wind element non-champion objects you control.",
    );
    expect(report.unparsedParagraphs).toBe(0);
    expect(report.abilities).toMatchObject([
      {
        kind: "triggered",
        variables: [
          {
            symbol: "X",
            amount: {
              kind: "count",
              collection: {
                filter: {
                  kind: "all",
                  filters: [
                    { kind: "element", oneOf: ["WIND"] },
                    { kind: "not", filter: { kind: "type", oneOf: ["CHAMPION"] } },
                  ],
                },
              },
            },
          },
        ],
      },
    ]);
  });

  it("loads a graveyard arrow after banishing other fire cards", () => {
    const report = compileGrandArchiveAbilities({
      canonicalId: "molten-arrow-fixture",
      name: "Molten Arrow",
      rulesText:
        "REST: Load Molten Arrow into target unloaded Bow weapon you control.\n\nBanish three other fire element cards from your graveyard: Load the card from your graveyard into target unloaded Bow weapon you control.",
      types: ["ITEM"],
    });
    expect(report.unparsedParagraphs).toBe(0);
    expect(report.abilities[1]).toMatchObject({
      kind: "activated",
      functionalZones: ["graveyard"],
      cost: {
        kind: "select-and-move",
        from: "graveyard",
        to: "banishment",
        count: { kind: "exactly", amount: 3 },
        filter: {
          kind: "all",
          filters: [{ kind: "element", oneOf: ["FIRE"] }, { kind: "not-source" }],
        },
      },
      effect: {
        kind: "move",
        subject: { kind: "source" },
        from: "graveyard",
        destination: { zone: "loaded", host: { kind: "bound", binding: "target-weapon" } },
      },
    });
  });

  it("applies an inherited stat modifier to the lineage host", () => {
    const report = compile("Inherited Effect: This object gets -2 LIFE.");

    expect(report.unparsedParagraphs).toBe(0);
    expect(report.abilities).toMatchObject([
      {
        kind: "static",
        functionalZones: ["inner-lineage"],
        executionSource: "lineage-host",
        effects: [{ kind: "continuous", subjects: { kind: "ability-bearer" } }],
      },
    ]);
  });

  it("keeps a self-activation trigger functional while its card is on the Effects Stack", () => {
    const report = compile(
      "Whenever you activate this card, if there's exactly one target for its activation, draw a card into your memory.",
    );

    expect(report.unparsedParagraphs).toBe(0);
    expect(report.abilities).toMatchObject([
      {
        kind: "triggered",
        functionalZones: ["effects-stack"],
        trigger: {
          kind: "event",
          event: { name: "card-activated", actor: "controller", subject: { kind: "source" } },
        },
      },
    ]);
  });

  it("compiles sacrificing tokens as a reserve-cost replacement", () => {
    const report = compile(
      "You may sacrifice two tokens rather than pay this card's reserve cost.",
    );

    expect(report.unparsedParagraphs).toBe(0);
    expect(report.abilities).toMatchObject([
      {
        kind: "static",
        staticKind: "effects",
        effects: [
          {
            kind: "rule-modification",
            mode: "replace-cost",
            action: "pay-cost",
            costKind: "reserve",
            cost: {
              kind: "select-and-sacrifice",
              player: "controller",
              count: { kind: "exactly", amount: 2 },
              filter: { kind: "token", value: true },
            },
          },
        ],
      },
    ]);
  });

  it("counts only other controlled domains for Exalted Dorumegian Throne's upkeep", () => {
    const report = compile(
      "Upkeep — At the beginning of your recollection phase, if you control four or fewer other domains, sacrifice Exalted Dorumegian Throne.",
    );

    expect(report.unparsedParagraphs).toBe(0);
    expect(report.abilities).toMatchObject([
      {
        kind: "triggered",
        interveningCondition: {
          kind: "compare",
          comparison: {
            left: {
              kind: "count",
              collection: {
                zones: ["field"],
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [{ kind: "type", oneOf: ["DOMAIN"] }, { kind: "not-source" }],
                },
              },
            },
            operator: "lte",
            right: 4,
          },
        },
      },
    ]);
  });

  it("retains a trailing this-turn duration on damage prevention", () => {
    const report = compile(
      "If damage would be dealt to a unit you control this turn, prevent 1 of that damage. If the damage prevented had a unit as its source, deal 1 damage to that unit.",
    );

    expect(report.unparsedParagraphs).toBe(0);
    expect(report.abilities).toMatchObject([
      {
        effect: {
          kind: "replacement",
          duration: { kind: "this-turn" },
        },
      },
    ]);
  });

  it("binds a selected banished card's power to the resolution choice", () => {
    const report = compile(
      "[Class Bonus] On Attack: You may banish an attack card from your graveyard. If you do, Fixture gets +X POWER where X is the banished card's power.",
    );

    expect(report.unparsedParagraphs).toBe(0);
    expect(report.abilities[0]).not.toHaveProperty("variables");
    expect(report.abilities[0]).toMatchObject({
      effect: {
        kind: "optional",
        effect: {
          kind: "sequence",
          effects: [
            {
              kind: "banish",
              selection: { id: "banished-cards" },
              bindResultAs: "banished-cards",
            },
            {
              kind: "continuous",
              change: {
                kind: "numeric",
                property: "power",
                operation: "add",
                amount: {
                  kind: "property",
                  subject: { kind: "bound", binding: "banished-cards" },
                  property: "power",
                  basis: "last-known",
                  missing: "zero",
                },
              },
            },
          ],
        },
      },
    });
  });

  it("makes an explicitly intent-only activated ability functional in intent", () => {
    const report = compile(
      "[Class Bonus] (0): Suppress target ally you don't control. If you do, Fixture gets -2 POWER. Activate this ability only once. (To suppress an ally, banish it and return it to the field under its owner's control at the beginning of the next end phase. Activate this ability only while this card is in an intent.)",
    );

    expect(report.unparsedParagraphs).toBe(0);
    expect(report.abilities).toMatchObject([
      {
        kind: "activated",
        functionalZones: ["intent"],
        limit: { count: 1, per: "source-instance" },
      },
    ]);
  });

  it("checks each player's memory before Umbral Tithe damages their champion", () => {
    const report = compile(
      "Each player draws two cards into their memory. Then deal 4 damage to each champion controlled by players with six or more cards in their memory.",
    );

    expect(report.unparsedParagraphs).toBe(0);
    expect(report.abilities).toMatchObject([
      {
        effect: {
          kind: "sequence",
          effects: [
            { kind: "draw", player: "each-player", amount: 2, to: "memory" },
            {
              kind: "for-each-player",
              players: "each-player",
              bindEachAs: "memory-threshold-player",
              effect: {
                kind: "conditional",
                condition: {
                  kind: "compare",
                  comparison: {
                    left: {
                      kind: "count",
                      collection: {
                        zones: ["memory"],
                        player: { binding: "memory-threshold-player" },
                      },
                    },
                    operator: "gte",
                    right: 6,
                  },
                },
                then: {
                  kind: "deal-damage",
                  recipient: {
                    kind: "champion",
                    player: { binding: "memory-threshold-player" },
                  },
                  amount: 4,
                },
              },
            },
          ],
        },
      },
    ]);
  });

  it("snapshots Perfect Repulsion's memory count into X at resolution", () => {
    const report = compile(
      "The next time target unit you control would take exactly X damage this turn, prevent that damage, where X is the amount of cards in your memory. Draw a card if damage was prevented this way.",
    );

    expect(report.unparsedParagraphs).toBe(0);
    expect(report.abilities).toMatchObject([
      {
        variables: [
          {
            symbol: "X",
            kind: "derived",
            amount: { kind: "count", collection: { zones: ["memory"] } },
          },
        ],
        effect: {
          kind: "replacement",
          event: {
            amountComparison: {
              left: { kind: "event-amount" },
              operator: "eq",
              right: { kind: "variable", symbol: "X" },
            },
          },
        },
      },
    ]);
  });

  it("binds another-element lineage checks to the source champion's physical lineage", () => {
    const report = compileGrandArchiveAbilities({
      canonicalId: "fixture",
      name: "Vanitas, Test Schemer",
      types: ["CHAMPION"],
      rulesText: "On Enter: If there's another wind element card in Vanitas' lineage, glimpse 4.",
    });

    expect(report.unparsedParagraphs).toBe(0);
    expect(report.abilities).toMatchObject([
      {
        kind: "triggered",
        effect: {
          kind: "conditional",
          condition: {
            kind: "collection-exists",
            collection: {
              zones: ["inner-lineage"],
              host: { kind: "champion", player: "controller" },
              relationship: "lineage-of",
              filter: {
                kind: "all",
                filters: [{ kind: "element", oneOf: ["WIND"] }, { kind: "not-source" }],
              },
            },
          },
        },
      },
    ]);
  });

  it("retains the class on a next fast action permission", () => {
    const report = compile(
      "[Polkhawk Bonus] The next Ranger action card you activate this turn can be activated as though it had fast activation.",
    );

    expect(report.unparsedParagraphs).toBe(0);
    expect(report.abilities).toMatchObject([
      {
        restrictions: [{ name: "champion-bonus" }],
        effect: {
          kind: "rule-modification",
          mode: "allow",
          action: "activate-fast",
          filter: {
            kind: "all",
            filters: [
              { kind: "type", oneOf: ["ACTION"] },
              { kind: "class", oneOf: ["RANGER"] },
            ],
          },
          duration: { kind: "for-next-event", event: "card-activated" },
        },
      },
    ]);
  });

  it("fails closed when maintained override text drifts from the official paragraph", () => {
    expect(() =>
      compileGrandArchiveAbilities({
        canonicalId: "29lqrve8fz",
        name: "Nico, Rapture's Embrace",
        types: ["ACTION"],
        rulesText: "Changed official text.",
      }),
    ).toThrow("Grand Archive ability override text drift for Nico, Rapture's Embrace (29lqrve8fz)");
  });

  it("binds Flourishing Qi's activation counters to its Effects Stack source", () => {
    const report = compileGrandArchiveAbilities({
      canonicalId: "MDu0e3tib8",
      name: "Flourishing Qi",
      types: ["ACTION"],
      rulesText:
        "Whenever your Shifting Currents change from facing any direction to North while this card's activation is on the effects stack, put four charge counters on that activation.\n\nDeal LV+X damage to target unit, where X is the amount of charge counters on this card's activation.",
    });

    expect(report.unparsedParagraphs).toBe(0);
    expect(report.abilities).toMatchObject([
      {
        kind: "triggered",
        effect: {
          kind: "conditional",
          condition: { kind: "source-activation-zone", zone: "effects-stack" },
          then: { kind: "add-counter", subject: { kind: "source" }, amount: 4 },
        },
      },
      {
        kind: "card-resolution",
        effect: {
          kind: "deal-damage",
          amount: {
            kind: "calculate",
            operands: [
              expect.any(Object),
              {
                kind: "counter-count",
                subject: { kind: "source" },
                counter: { named: "charge" },
              },
            ],
          },
        },
      },
    ]);
  });

  it("compiles restricted intrinsic keywords without discarding printed text", () => {
    const report = compile(
      "[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
    );
    expect(report.unparsedParagraphs).toBe(0);
    expect(report.abilities).toEqual([
      {
        id: "fixture-a1",
        kind: "static",
        staticKind: "intrinsic",
        text: expect.any(String),
        keyword: { name: "floating-memory" },
        restrictions: [
          {
            kind: "static",
            name: "class-bonus",
            condition: { kind: "champion-matches-source", characteristic: "class" },
          },
        ],
      },
    ]);
  });

  it("compiles triggered sequences into ordered effects", () => {
    const [ability] = compile(
      "On Enter: Glimpse 6. Draw six cards. Then summon a Spirit Shard token.",
    ).abilities;
    expect(ability.kind).toBe("triggered");
    if (ability.kind !== "triggered" || "intrinsic" in ability || !ability.effect) return;
    expect(ability.trigger).toEqual({
      kind: "event",
      event: { name: "object-entered-field", subject: { kind: "source" } },
    });
    expect(ability.effect.kind).toBe("sequence");
  });

  it("binds On Hit 'that opponent' effects to the hit object's controller", () => {
    const [ability] = compile(
      "On Champion Hit: That opponent discards four cards. Then if that opponent's influence is four or less, destroy the hit champion.",
    ).abilities;
    expect(ability).toMatchObject({
      kind: "triggered",
      trigger: {
        event: {
          name: "attack-hit",
          recipient: { kind: "event-object", bindAs: "trigger-recipient" },
        },
      },
      effect: {
        kind: "sequence",
        effects: [
          {
            kind: "discard",
            player: "event-recipient-controller",
            selection: {
              chooser: "event-recipient-controller",
              candidates: { player: "event-recipient-controller" },
            },
          },
          {
            kind: "conditional",
            condition: { players: "event-recipient-controller" },
            then: { kind: "destroy", subject: { kind: "event-recipient" } },
          },
        ],
      },
    });
  });

  it("keeps an On Hit opponent and banished card bound through a delayed return", () => {
    const [ability] = compile(
      "On Champion Hit: That player banishes a card at random from their memory. Return that card to their memory at the beginning of their next end phase.",
    ).abilities;
    expect(ability).toMatchObject({
      kind: "triggered",
      effect: {
        kind: "sequence",
        effects: [
          {
            kind: "banish",
            player: "event-recipient-controller",
            selection: {
              id: "banished-memory-cards",
              chooser: "event-recipient-controller",
              candidates: { player: "event-recipient-controller" },
            },
          },
          {
            kind: "create-delayed-trigger",
            trigger: {
              event: { actor: "event-recipient-controller" },
            },
            effect: {
              kind: "move",
              subject: { kind: "bound", binding: "banished-memory-cards" },
            },
          },
        ],
      },
    });
  });

  it("keeps effects after a for-each sentence outside the repetition", () => {
    const [ability] = compile(
      "For each omen you have with a different reserve cost, draw a card. Until end of turn, you can't draw cards.",
    ).abilities;
    expect(ability).toMatchObject({
      kind: "card-resolution",
      effect: {
        kind: "sequence",
        effects: [
          {
            kind: "repeat",
            count: { kind: "count", distinctBy: "reserve-cost" },
            effect: { kind: "draw" },
          },
          { kind: "rule-modification", mode: "forbid", action: "draw" },
        ],
      },
    });
  });

  it("locks a group keyword-loss prohibition to the units affected at resolution", () => {
    const [ability] = compile(
      "Each unit loses stealth until end of turn. Those units can't gain stealth this turn.",
    ).abilities;
    expect(ability).toMatchObject({
      kind: "card-resolution",
      effect: {
        kind: "sequence",
        effects: [
          {
            kind: "continuous",
            affectedSet: "locked",
            change: { kind: "remove-keyword", keyword: { name: "stealth" } },
            bindResultAs: "affected-objects",
          },
          {
            kind: "rule-modification",
            mode: "forbid",
            action: "grant-keyword",
            subject: { kind: "tracked", key: "affected-objects" },
            affectedSet: "locked",
            grantedKeyword: { name: "stealth" },
          },
        ],
      },
    });
  });

  it("tracks Luxera's chosen card name for generation and its next activation trigger", () => {
    const [ability] = compile(
      "As you gain this boon, choose a non-champion non-regalia card name. The next time you activate a card with the same name this game, draw two cards and recover 3.",
    ).abilities;
    expect(ability).toMatchObject({
      kind: "triggered",
      trigger: { event: { name: "boon-gained" } },
      effect: {
        kind: "sequence",
        effects: [
          {
            kind: "choose-value",
            selection: {
              candidates: { kind: "characteristic", characteristic: "card-name" },
            },
            trackAs: "chosen-card-name",
          },
          {
            kind: "create-delayed-trigger",
            trigger: {
              event: {
                name: "card-activated",
                subject: {
                  filter: { kind: "matches-tracked-characteristic", key: "chosen-card-name" },
                },
              },
            },
            limit: 1,
          },
        ],
      },
    });
  });

  it("scopes Eternal Magistrate's exception to the affected player's materialize phase", () => {
    const [ability] = compile(
      "As long as Eternal Magistrate is imbued, cards can't leave your opponents' material decks unless it's their materialize phase.",
    ).abilities;
    expect(ability).toMatchObject({
      kind: "static",
      effects: [
        {
          kind: "rule-modification",
          mode: "forbid",
          action: "move",
          fromZone: "material-deck",
          condition: {
            kind: "all",
            conditions: [
              { kind: "activation-state", state: "imbued" },
              {
                kind: "not",
                condition: {
                  kind: "all",
                  conditions: [
                    { kind: "phase", phase: "materialize" },
                    { kind: "turn-player", player: "event-actor" },
                  ],
                },
              },
            ],
          },
        },
      ],
    });
  });

  it("preserves both Knox look permissions for its private banished card", () => {
    const [ability] = compile(
      "As you gain this boon, each opponent banishes a card at random from your memory face down. As long as that card is banished, that opponent may look at it and activate it, ignoring its elemental requirements. You draw a card for each card banished from your memory this way. (Start with the opponent next in turn order. You may still look at your own face down card.)",
    ).abilities;
    expect(ability).toMatchObject({
      kind: "card-resolution",
      effect: {
        kind: "for-each-player",
        effect: {
          kind: "sequence",
          effects: [
            { kind: "banish" },
            { kind: "rule-modification", action: "look-at", actor: { binding: "knox-opponent" } },
            { kind: "rule-modification", action: "look-at", actor: "controller" },
            { kind: "rule-modification", action: "activate" },
            { kind: "rule-modification", action: "ignore-element-requirement" },
            { kind: "draw" },
          ],
        },
      },
    });
  });

  it("compiles activated abilities with compound costs and targets", () => {
    const [ability] = compile("(1), REST: Deal 2 damage to target unit.").abilities;
    expect(ability.kind).toBe("activated");
    if (ability.kind !== "activated" || !ability.effect) return;
    expect(ability.cost).toEqual({
      kind: "all",
      costs: [
        { kind: "pay-reserve", amount: 1 },
        { kind: "rest", subject: { kind: "source" } },
      ],
    });
    expect(ability.targets).toHaveLength(1);
    expect(ability.effect).toMatchObject({ kind: "deal-damage", amount: 2 });
  });

  it("mills X for a sacrificed polar fractal", () => {
    const report = compileGrandArchiveAbilities({
      canonicalId: "polar-fixture",
      name: "Fractal of Polar Depths",
      rulesText:
        "[Class Bonus] Sacrifice Fractal of Polar Depths: Target player puts the top X cards from their deck into their graveyard, where X is the amount of water element cards in your graveyard.",
      types: ["PHANTASIA"],
    });
    expect(report.unparsedParagraphs).toBe(0);
    expect(report.abilities[0]).toMatchObject({
      kind: "activated",
      cost: { kind: "sacrifice", subject: { kind: "source" } },
      effect: { kind: "mill" },
    });
  });

  it("deals triggered damage to the event subject", () => {
    const [ability] = compile("Whenever a unit declares an attack, deal 2 damage to it.").abilities;
    expect(ability).toMatchObject({
      kind: "triggered",
      effect: { kind: "deal-damage", recipient: { kind: "event-subject" }, amount: 2 },
    });
  });

  it("matches polearm weapons or attack cards for inherited Jin attacks", () => {
    const report = compileGrandArchiveAbilities({
      canonicalId: "jin-fixture",
      name: "Jin, Fate Defiant",
      rulesText:
        "Inherited Effect — Whenever Jin attacks with a Polearm weapon and/or Polearm attack card, target Horse or Human ally you control gets +1 POWER until end of turn.",
      types: ["CHAMPION"],
    });
    const [ability] = report.abilities;
    expect(ability).toMatchObject({
      kind: "triggered",
      trigger: {
        kind: "event",
        event: { using: { kind: "event-object", filter: { kind: "any" } } },
      },
    });
  });

  it("returns revealed memory cards to hand", () => {
    const [ability] = compile(
      "On Hit: Reveal up to two wind element cards from your memory and return them to your hand.",
    ).abilities;
    expect(ability).toMatchObject({
      kind: "triggered",
      effect: {
        kind: "sequence",
        effects: [{ kind: "reveal" }, { kind: "move", destination: { zone: "hand" } }],
      },
    });
  });

  it("discards a fire card then damages the champion to pump the attack", () => {
    const report = compileGrandArchiveAbilities({
      canonicalId: "dawn-fixture",
      name: "Dragon's Dawn",
      rulesText:
        '[Class Bonus] On Attack: You may discard a fire element card and have Dragon\'s Dawn deal 2 unpreventable damage to your champion. If you do, this attack gets +2 POWER and gains "On Champion Hit: Draw a card."',
      types: ["WEAPON"],
    });
    const [ability] = report.abilities;
    expect(ability).toMatchObject({
      kind: "triggered",
      effect: {
        kind: "optional",
        effect: {
          kind: "sequence",
          effects: [
            { kind: "discard" },
            { kind: "deal-damage", amount: 2, preventable: false },
            { kind: "continuous" },
            { kind: "continuous" },
          ],
        },
      },
    });
  });

  it("keeps optional actions and their if-you-do continuation atomic", () => {
    const [ability] = compile(
      "On Attack: You may discard a card. If you do, draw a card.",
    ).abilities;
    expect(ability.kind).toBe("triggered");
    if (ability.kind !== "triggered" || "intrinsic" in ability) return;
    expect(ability.effect).toMatchObject({
      kind: "optional",
      allOrNothing: true,
      effect: { kind: "sequence" },
    });
  });

  it("compiles source-state conditions without turning them into statuses", () => {
    const [ability] = compile("On Enter: If Fixture was prepared, draw a card.").abilities;
    expect(ability.kind).toBe("triggered");
    if (ability.kind !== "triggered" || "intrinsic" in ability) return;
    expect(ability.effect).toMatchObject({
      kind: "conditional",
      condition: { kind: "activation-state", state: "prepared" },
      then: { kind: "draw" },
    });
  });

  it("binds inherited abilities to the champion hosting the lineage card", () => {
    const [ability] = compile("Inherited Effect — Ranged 2").abilities;
    expect(ability).toMatchObject({
      kind: "static",
      executionSource: "lineage-host",
      functionalZones: ["inner-lineage"],
      label: { name: "Inherited Effect" },
      keyword: { name: "ranged", value: 2 },
    });
  });

  it("keeps mode targets scoped to the selected mode", () => {
    const [ability] = compile(
      "Choose one—\n• Destroy target phantasia.\n• Put a buff counter on target ally.",
    ).abilities;
    expect(ability.kind).toBe("card-resolution");
    if (ability.kind !== "card-resolution") return;
    expect(ability.effect).toMatchObject({
      kind: "select-modes",
      choose: { kind: "exactly", amount: 1 },
      modes: [
        { targets: [expect.objectContaining({ kind: "target" })] },
        { targets: [expect.objectContaining({ kind: "target" })] },
      ],
    });
  });

  it("compiles phase triggers with their actor and enforceable limit", () => {
    const [ability] = compile(
      "At the beginning of your recollection phase, draw a card into your memory. Trigger this ability only twice.",
    ).abilities;
    expect(ability).toMatchObject({
      kind: "triggered",
      trigger: {
        kind: "event",
        event: { name: "phase-begins", phase: "recollection", actor: "controller" },
      },
      limit: { count: 2, per: "source-instance" },
      effect: { kind: "draw", to: "memory" },
    });
  });

  it("compiles conditional static keywords as layered continuous effects", () => {
    const [ability] = compile(
      "As long as Fixture is imbued, Fixture gets +1 POWER and has vigor.",
    ).abilities;
    expect(ability).toMatchObject({
      kind: "static",
      effects: [
        { kind: "continuous", layer: { layer: "E" } },
        {
          kind: "continuous",
          layer: { layer: "D" },
          change: { kind: "grant-keyword", keyword: { name: "vigor" } },
        },
      ],
    });
  });

  it("models cascade progress as source-instance state selected before resolution", () => {
    const [ability] = compile(
      "REST: Cascade—\n• 1— Draw a card.\n• 2 and 3— Recover 2.\n(This ability changes each cascade.)",
    ).abilities;
    expect(ability).toMatchObject({
      kind: "activated",
      cost: { kind: "rest" },
      cascade: {
        kind: "cascade",
        advanceOn: "activation",
        tracking: {
          scope: "source-instance",
          includesCurrent: true,
          advancesIfStackEntryFailsToResolve: true,
        },
        copiedAbility: "repeat-pending-effect-without-advancing",
        modes: [
          { counts: [1], effect: { kind: "draw" } },
          { counts: [2, 3], effect: { kind: "recover" } },
        ],
      },
    });
  });

  it("tracks whether a preceding effect succeeded for an if-you-do continuation", () => {
    const [ability] = compile(
      "Rest target Potion. If you do, put LV age counters on it.",
    ).abilities;
    expect(ability).toMatchObject({
      kind: "card-resolution",
      effect: {
        kind: "sequence",
        effects: [
          { kind: "attempt", bindSucceededAs: "prior-effect-succeeded" },
          {
            kind: "conditional",
            condition: { kind: "effect-succeeded", binding: "prior-effect-succeeded" },
          },
        ],
      },
    });
  });

  it("distinguishes a resolution-time loading choice from an announced target", () => {
    const [ability] = compile(
      "Draw a card into your memory. Then you may load Fixture into an Aetherwing weapon you control.",
    ).abilities;
    expect(ability).toMatchObject({
      kind: "card-resolution",
      effect: {
        kind: "sequence",
        effects: [
          { kind: "draw", to: "memory" },
          {
            kind: "optional",
            effect: {
              kind: "choose",
              selection: { kind: "choice", declared: "resolution" },
              effect: { kind: "move", destination: { zone: "loaded" } },
            },
          },
        ],
      },
    });
  });

  it("models entering rested as modification of the proposed entry event", () => {
    const [ability] = compile("Fixture enters the field rested.").abilities;
    expect(ability).toMatchObject({
      kind: "static",
      effects: [
        {
          kind: "replacement",
          event: { name: "object-entered-field", subject: { kind: "source" } },
          operation: { kind: "modify-object-state", state: "rested", value: true },
        },
      ],
    });
  });

  it("preserves distinct-characteristic constraints in selection costs", () => {
    const [ability] = compile(
      "As an additional cost to activate this card, banish three Slime ally cards each with different elements from your graveyard.",
    ).abilities;
    expect(ability).toMatchObject({
      kind: "static",
      effects: [
        {
          kind: "rule-modification",
          mode: "add-cost",
          cost: { kind: "select-and-move", distinctBy: "element" },
        },
      ],
    });
  });

  it("limits a next-attack modifier to the first matching declaration", () => {
    const [ability] = compile(
      "Target ally's next attack this turn gets +2 POWER until end of turn.",
    ).abilities;
    expect(ability).toMatchObject({
      kind: "card-resolution",
      effect: {
        kind: "create-delayed-trigger",
        limit: 1,
        trigger: { event: { name: "attack-declared" } },
        effect: {
          kind: "continuous",
          subjects: { kind: "current-attack" },
          duration: { kind: "this-attack" },
        },
      },
    });
  });

  it("applies a named source's next-attack modifier to the attack", () => {
    const [ability] = compile("Fixture's next attack this turn gets +3 POWER.").abilities;
    expect(ability).toMatchObject({
      kind: "card-resolution",
      effect: {
        kind: "create-delayed-trigger",
        limit: 1,
        trigger: { event: { name: "attack-declared", subject: { kind: "source" } } },
        effect: {
          kind: "continuous",
          subjects: { kind: "current-attack" },
          duration: { kind: "this-attack" },
        },
      },
    });
  });

  it("uses last-known source counters when past-tense text counts counters that were on it", () => {
    const report = compile(
      "Banish Fixture: For every four refinement counters that was on Fixture, draw a card.",
    );
    expect(report.unparsedParagraphs).toBe(0);
    expect(report.abilities).toMatchObject([
      {
        kind: "activated",
        cost: { kind: "banish-self" },
        effect: {
          kind: "draw",
          amount: {
            kind: "calculate",
            operator: "divide",
            operands: [
              {
                kind: "counter-count",
                subject: { kind: "source" },
                counter: { named: "refinement" },
                basis: "last-known",
                missing: "zero",
              },
              4,
            ],
            rounding: "down",
          },
        },
      },
    ]);
  });

  it("grants a lowercase your-champion keyword to the controller's champion", () => {
    const report = compile(
      "Put the top two cards of your deck into your graveyard. Then you may banish a card with floating memory from your graveyard. If you do, your champion gains ranged 3 until end of turn.",
    );
    expect(report.unparsedParagraphs).toBe(0);
    expect(report.abilities).toMatchObject([
      {
        kind: "card-resolution",
        effect: {
          kind: "sequence",
          effects: [
            { kind: "mill", amount: 2 },
            {
              kind: "optional",
              effect: {
                kind: "sequence",
                effects: [
                  {
                    kind: "attempt",
                    effect: { kind: "banish" },
                    bindSucceededAs: "optional-action-succeeded",
                  },
                  {
                    kind: "conditional",
                    condition: { kind: "effect-succeeded", binding: "optional-action-succeeded" },
                    then: {
                      kind: "continuous",
                      subjects: { kind: "champion", player: "controller" },
                      affectedSet: "locked",
                      duration: { kind: "this-turn" },
                      change: {
                        kind: "grant-keyword",
                        keyword: { name: "ranged", value: 3 },
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ]);
  });

  it("preserves a capitalized subtype before an Item copy subject", () => {
    const report = compile(
      "At the beginning of your recollection phase, summon a token copy of an Herb item you control.",
    );
    expect(report.unparsedParagraphs).toBe(0);
    expect(report.abilities).toMatchObject([
      {
        kind: "triggered",
        effect: {
          kind: "choose",
          selection: {
            candidates: {
              kind: "object",
              relationship: "controlled-by",
              player: "controller",
              filter: {
                kind: "all",
                filters: [
                  { kind: "type", oneOf: ["ITEM"] },
                  { kind: "subtype", oneOf: ["HERB"] },
                ],
              },
            },
          },
          effect: { kind: "summon", copyOf: { kind: "bound", binding: "copied-object" } },
        },
      },
    ]);
  });

  it("does not reinterpret a capitalized card type as a subtype", () => {
    const report = compile("Domain cards you activate cost 1 less to activate.");
    expect(report.unparsedParagraphs).toBe(0);
    expect(report.abilities).toMatchObject([
      {
        kind: "static",
        staticKind: "effects",
        effects: [
          {
            kind: "rule-modification",
            action: "activate",
            filter: { kind: "type", oneOf: ["DOMAIN"] },
            costOperation: "subtract",
            amount: 1,
          },
        ],
      },
    ]);
  });

  it("preserves alternative reveal-to-hand characteristics as a disjunction", () => {
    const report = compile(
      "Look at the top three cards of your deck. You may reveal a wind element card or a Reaction card from among them and put it into your hand. Put the rest on the bottom of your deck in any order.",
    );
    expect(report.unparsedParagraphs).toBe(0);
    expect(report.abilities).toMatchObject([
      {
        kind: "card-resolution",
        effect: {
          kind: "sequence",
          effects: [
            { kind: "look-at" },
            {
              kind: "choose",
              selection: {
                candidates: {
                  filter: {
                    kind: "any",
                    filters: [
                      { kind: "element", oneOf: ["WIND"] },
                      { kind: "subtype", oneOf: ["REACTION"] },
                    ],
                  },
                },
              },
              effect: {
                kind: "sequence",
                effects: [
                  {
                    kind: "reveal",
                    selection: {
                      count: { kind: "all" },
                      candidates: { kind: "card", binding: "chosen-card" },
                    },
                  },
                  { kind: "move" },
                ],
              },
            },
            {
              kind: "choose",
              selection: {
                id: "ordered-remainder",
                count: { kind: "all" },
                ordered: true,
                candidates: {
                  kind: "card",
                  binding: "referenced-cards",
                  excluding: ["chosen-card"],
                },
              },
              effect: {
                kind: "move",
                subject: { kind: "bound", binding: "ordered-remainder" },
              },
            },
          ],
        },
      },
    ]);
  });

  it("binds an unless-paid activation's controller and negated source", () => {
    for (const [text, sourceFilter, amount] of [
      [
        "Negate target ally card activation unless its controller pays (4). Banish the card that had its activation negated this way.",
        { kind: "type", oneOf: ["ALLY"] },
        4,
      ],
      [
        "Negate target card activation unless its controller pays (LV). Banish the card that had its activation negated this way.",
        undefined,
        expect.objectContaining({ kind: "property", property: "level" }),
      ],
    ] as const) {
      const report = compile(text);
      expect(report.unparsedParagraphs).toBe(0);
      expect(report.abilities).toMatchObject([
        {
          kind: "card-resolution",
          targets: [
            {
              id: "target-stack-item",
              candidates: {
                kind: "stack-item",
                itemTypes: ["card-activation"],
                ...(sourceFilter ? { sourceFilter } : {}),
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "unless-paid",
                player: { controllerOf: "target-stack-item" },
                cost: { kind: "pay-reserve", amount },
                otherwise: {
                  kind: "negate",
                  bindResultAs: "negated-stack-item",
                },
              },
              {
                kind: "banish-object",
                subject: { kind: "stack-source", binding: "negated-stack-item" },
              },
            ],
          },
        },
      ]);
    }
  });

  it("can remove every valued instance of a keyword", () => {
    const [ability] = compile("Fixture loses pride.").abilities;
    expect(ability).toMatchObject({
      kind: "static",
      effects: [
        {
          kind: "continuous",
          change: { kind: "remove-keyword", keyword: { name: "pride", anyValue: true } },
        },
      ],
    });
  });

  it("distinguishes a champion name from a complete card name in level-up restrictions", () => {
    const [ability] = compile('Fixture can only level up into a "Mordred" champion.').abilities;
    expect(ability).toMatchObject({
      kind: "static",
      effects: [
        {
          kind: "rule-modification",
          mode: "require",
          action: "level-up",
          destinationFilter: { kind: "champion-name", value: "Mordred" },
        },
      ],
    });
  });

  it("excludes the source from damage dealt to each other unit", () => {
    const [ability] = compile("Deal 1 damage to each other unit.").abilities;
    expect(ability).toMatchObject({
      kind: "card-resolution",
      effect: {
        kind: "deal-damage",
        recipient: {
          kind: "each",
          collection: {
            zones: ["field"],
            filter: {
              kind: "all",
              filters: [{ kind: "type", oneOf: ["ALLY", "CHAMPION"] }, { kind: "not-source" }],
            },
          },
        },
      },
    });
  });

  it("keeps attack-card weapon prohibitions active through declaration", () => {
    const [ability] = compile("Weapons can't be used for this attack.").abilities;
    expect(ability).toMatchObject({
      kind: "card-resolution",
      effect: {
        kind: "rule-modification",
        mode: "forbid",
        action: "use-weapon-for-attack",
        duration: { kind: "while-source-in-functional-zone" },
      },
    });
  });

  it("compiles variable Herb sacrifices and carries Y into Horticounter's payment", () => {
    expect(
      compile("As an additional cost to activate this card, sacrifice Y Herbs.").abilities,
    ).toMatchObject([
      {
        kind: "static",
        effects: [
          {
            kind: "rule-modification",
            mode: "add-cost",
            cost: {
              kind: "select-and-sacrifice",
              count: { kind: "exactly", amount: { kind: "variable", symbol: "Y" } },
              bindResultAs: "sacrificed-objects",
              filter: { kind: "subtype", oneOf: ["HERB"] },
            },
          },
        ],
      },
    ]);
    expect(
      compile(
        "Negate target card activation unless its controller pays (X+Y). Banish the card that had its activation negated this way. When an activation is negated this way, glimpse 3.",
      ).abilities,
    ).toMatchObject([
      { kind: "card-resolution", variables: [{ symbol: "Y", kind: "chosen", minimum: 0 }] },
    ]);
  });

  it("grants token weapons Tonoris' sacrifice ability", () => {
    expect(
      compile(
        'Token weapons you control have "Sacrifice this object: Target weapon gets +X POWER until end of turn where X is this object\'s power."',
      ).abilities,
    ).toMatchObject([
      {
        kind: "static",
        effects: [
          {
            kind: "continuous",
            subjects: {
              collection: {
                filter: {
                  filters: [
                    { kind: "type", oneOf: ["WEAPON"] },
                    { kind: "token", value: true },
                  ],
                },
              },
            },
            change: {
              kind: "grant-ability",
              ability: {
                kind: "activated",
                cost: { kind: "sacrifice", subject: { kind: "source" } },
                variables: [{ symbol: "X", amount: { basis: "last-known" } }],
                targets: [{ id: "target-weapon" }],
              },
            },
          },
        ],
      },
    ]);
  });

  it("compiles Freydis' permanent Ranger distance as an activated player state", () => {
    expect(
      compile(
        "Remove three tactic counters from Freydis: For the rest of the game, Ranger units you control are always distant.",
      ).abilities,
    ).toMatchObject([
      {
        kind: "activated",
        cost: {
          kind: "remove-counter",
          subject: { kind: "source" },
          counter: { named: "tactic" },
          amount: 3,
        },
        effect: {
          kind: "continuous-player-state",
          state: { named: "ranger-units-always-distant" },
          duration: { kind: "permanent" },
        },
      },
    ]);
  });

  it("grants power then distance instead of targeting a printed power", () => {
    expect(
      compile(
        "Target ally gets +2 POWER until end of turn and becomes distant. (Units stay distant until the end of their controller's turn.)",
      ).abilities,
    ).toMatchObject([
      {
        kind: "card-resolution",
        targets: [
          {
            candidates: {
              filter: { kind: "type", oneOf: ["ALLY"] },
            },
          },
        ],
        effect: {
          kind: "sequence",
          effects: [
            {
              kind: "continuous",
              change: { kind: "numeric", property: "power", operation: "add", amount: 2 },
            },
            { kind: "set-object-state", state: "distant", value: true },
          ],
        },
      },
    ]);
  });

  it("puts a buff on each damaged controlled ally rather than targeting one", () => {
    expect(compile("Put a buff counter on each damaged ally you control.").abilities).toMatchObject(
      [
        {
          kind: "card-resolution",
          effect: {
            kind: "add-counter",
            subject: {
              kind: "each",
              collection: {
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    { kind: "type", oneOf: ["ALLY"] },
                    { kind: "object-state", state: "damaged" },
                  ],
                },
              },
            },
          },
        },
      ],
    );
  });

  it("puts a buff on each controlled ally rather than targeting one", () => {
    expect(compile("Put a buff counter on each ally you control.").abilities).toMatchObject([
      {
        kind: "card-resolution",
        effect: {
          kind: "add-counter",
          subject: {
            kind: "each",
            collection: {
              player: "controller",
              filter: { kind: "type", oneOf: ["ALLY"] },
            },
          },
          counter: "buff",
          amount: 1,
        },
      },
    ]);
  });

  it("counts wind non-champion objects without also requiring champion type", () => {
    expect(
      compile(
        "Target Polearm weapon gets +1 POWER until end of turn for each wind element non-champion object you control.",
      ).abilities,
    ).toMatchObject([
      {
        kind: "card-resolution",
        effect: {
          kind: "continuous",
          change: {
            kind: "numeric",
            property: "power",
            operation: "add",
            amount: {
              kind: "count",
              collection: {
                filter: {
                  kind: "all",
                  filters: [
                    { kind: "element", oneOf: ["WIND"] },
                    { kind: "not", filter: { kind: "type", oneOf: ["CHAMPION"] } },
                  ],
                },
              },
            },
          },
        },
      },
    ]);
  });

  it("deals bonus damage only to the targeted ally's controller's champion", () => {
    expect(
      compile("Deal 3 damage to each champion controlled by the same player as that ally.")
        .abilities,
    ).toMatchObject([
      {
        kind: "card-resolution",
        effect: {
          kind: "deal-damage",
          recipient: {
            kind: "each",
            collection: {
              player: { controllerOf: "target-1" },
              filter: { kind: "type", oneOf: ["CHAMPION"] },
            },
          },
          amount: 3,
        },
      },
    ]);
  });

  it("destroys non-champions then conditionally damages opposing champions", () => {
    expect(
      compile(
        "At the beginning of your next recollection phase, destroy all non-champion objects and if your Shifting Currents face South, deal 10 damage to each champion you don't control.",
      ).abilities,
    ).toMatchObject([
      {
        kind: "card-resolution",
        effect: {
          kind: "create-delayed-trigger",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "destroy",
                subject: {
                  kind: "each",
                  collection: {
                    filter: { kind: "not", filter: { kind: "type", oneOf: ["CHAMPION"] } },
                  },
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "player-state",
                  state: { named: "shifting-currents", value: "south" },
                },
                then: {
                  kind: "deal-damage",
                  recipient: {
                    kind: "each",
                    collection: {
                      player: "each-opponent",
                      filter: { kind: "type", oneOf: ["CHAMPION"] },
                    },
                  },
                  amount: 10,
                },
              },
            ],
          },
        },
      },
    ]);
  });

  it("buffs a group then grants a quoted on-attack ability to a narrower group", () => {
    const report = compile(
      'Animal and Beast allies you control get +1 POWER until end of turn. Horse allies you control also gain "On Attack: Draw a card, then discard a card" until end of turn.',
    );
    expect(report.unparsedParagraphs).toBe(0);
    expect(report.abilities).toMatchObject([
      {
        kind: "card-resolution",
        effect: {
          kind: "sequence",
          effects: [
            {
              kind: "continuous",
              change: { kind: "numeric", property: "power", operation: "add", amount: 1 },
            },
            {
              kind: "continuous",
              change: { kind: "grant-ability" },
            },
          ],
        },
      },
    ]);
  });

  it("buffs other allies only while they attack rested units", () => {
    const report = compileGrandArchiveAbilities({
      canonicalId: "halocline",
      name: "Halocline Scout",
      rulesText:
        "[Class Bonus] Other allies you control get +1 POWER as long as they're attacking rested units.",
      types: ["ALLY"],
    });
    expect(report.unparsedParagraphs).toBe(0);
    expect(report.abilities[0]).toMatchObject({
      kind: "static",
      restrictions: [{ name: "class-bonus" }],
      effects: [
        {
          kind: "continuous",
          subjects: {
            kind: "each",
            collection: {
              filter: {
                kind: "all",
                filters: [
                  { kind: "type", oneOf: ["ALLY"] },
                  { kind: "not-source" },
                  { kind: "object-state", state: "attacking" },
                ],
              },
            },
          },
          condition: {
            kind: "current-attack-target-matches",
            filter: { kind: "object-state", state: "rested" },
          },
          change: { kind: "numeric", property: "power", operation: "add", amount: 1 },
        },
      ],
    });
  });

  it("treats Sword or Bow as either weapon subtype", () => {
    const report = compileGrandArchiveAbilities({
      canonicalId: "xia-hou-dun",
      name: "Xia Hou Dun, Gloryseeker",
      rulesText:
        "[Class Bonus] As long as you control a Sword or Bow weapon, Xia Hou Dun gets +1 POWER.",
      types: ["ALLY"],
    });
    expect(report.unparsedParagraphs).toBe(0);
    expect(report.abilities[0]).toMatchObject({
      kind: "static",
      restrictions: [{ name: "class-bonus" }],
      effects: [
        {
          kind: "continuous",
          condition: {
            kind: "collection-exists",
            collection: {
              filter: {
                kind: "all",
                filters: [
                  { kind: "type", oneOf: ["WEAPON"] },
                  {
                    kind: "any",
                    filters: [
                      { kind: "subtype", oneOf: ["SWORD"] },
                      { kind: "subtype", oneOf: ["BOW"] },
                    ],
                  },
                ],
              },
            },
          },
        },
      ],
    });
  });

  it("records champion damage history against the champion recipient", () => {
    const report = compile(
      "As long as your champion has taken damage this turn, Fixture gets +3 POWER.",
    );
    expect(report.unparsedParagraphs).toBe(0);
    expect(report.abilities[0]).toMatchObject({
      kind: "static",
      effects: [
        {
          kind: "continuous",
          condition: {
            kind: "history",
            event: "damage-dealt",
            recipient: { kind: "champion", player: "controller" },
          },
        },
      ],
    });
  });

  it("wakes the source when its next attack gains an On Attack wake", () => {
    const report = compileGrandArchiveAbilities({
      canonicalId: "jin",
      name: "Jin, Zealous Maverick",
      rulesText:
        'On Enter: Jin\'s next attack this turn gets +1 POWER and has "On Attack: Wake up Jin."',
      types: ["CHAMPION"],
    });
    expect(report.unparsedParagraphs).toBe(0);
    const ability = report.abilities[0];
    expect(ability).toMatchObject({ kind: "triggered" });
    if (ability?.kind !== "triggered" || ability.effect?.kind !== "create-delayed-trigger") {
      throw new Error("Expected a delayed next-attack trigger");
    }
    expect(ability.effect.effect).toMatchObject({
      kind: "sequence",
      effects: [
        { kind: "continuous", change: { kind: "numeric", property: "power", amount: 1 } },
        { kind: "continuous", change: { kind: "grant-ability" } },
        { kind: "wake", subject: { kind: "source" } },
      ],
    });
  });

  it("treats until-end-of-turn ally buffs as a resolution effect", () => {
    const report = compile(
      "Until end of turn, Human and Horse allies you control get +1 LIFE and gain ambush and steadfast.",
    );
    expect(report.unparsedParagraphs).toBe(0);
    expect(report.abilities[0]).toMatchObject({
      kind: "card-resolution",
      effect: { kind: "sequence" },
    });
    const first = report.abilities[0];
    if (first?.kind !== "card-resolution" || first.effect.kind !== "sequence") {
      throw new Error("Expected a sequenced card-resolution");
    }
    expect(first.effect.effects[0]).toMatchObject({
      kind: "continuous",
      duration: { kind: "this-turn" },
      change: { kind: "numeric", property: "life" },
    });
  });

  it("keeps unsupported text explicit and fail-closed", () => {
    const report = compile("Do something the compiler does not understand.");
    expect(report.executableParagraphs).toBe(0);
    expect(report.abilities[0]).toEqual({
      id: "fixture-a1",
      kind: "unparsed",
      text: "Do something the compiler does not understand.",
      unparsedSegments: ["Do something the compiler does not understand."],
    });
  });

  it("does not accept a supported prefix when an explicit continuation is unsupported", () => {
    const report = compile("Draw a card. Then perform an unknown continuation.");
    expect(report.executableParagraphs).toBe(0);
    expect(report.unparsedParagraphs).toBe(1);
  });
});

// Regression boundaries for grammar arms shared by generated cards across sets.
describe("PR review compiler boundaries", () => {
  it.each(["Power", "LIFE", "level"])(
    "preserves the case-insensitive %s stat before distant",
    (stat) => {
      expect(
        compile(`Target ally gets +1 ${stat} until end of turn and becomes distant.`).abilities,
      ).toMatchObject([
        {
          kind: "card-resolution",
          effect: {
            kind: "sequence",
            effects: [
              { change: { property: stat.toLowerCase() } },
              { kind: "set-object-state", state: "distant" },
            ],
          },
        },
      ]);
    },
  );

  it("binds damage pronouns to event subjects only inside triggers", () => {
    expect(
      compile("Whenever an ally enters the field, deal 2 damage to it.").abilities,
    ).toMatchObject([
      { kind: "triggered", effect: { kind: "deal-damage", recipient: { kind: "event-subject" } } },
    ]);
    expect(
      compile(
        "Deal 1 damage to target unit. If that unit has stealth, deal 4 damage to it instead.",
      ).abilities,
    ).toMatchObject([
      {
        kind: "card-resolution",
        effect: {
          kind: "conditional",
          then: { recipient: { kind: "bound", binding: "target-1" } },
        },
      },
    ]);
  });

  it("uses the self-banish cost clause to determine graveyard activation", () => {
    for (const cost of [
      "Banish Fixture",
      "Banish Fixture from your graveyard",
      "Banish this card from your graveyard",
    ]) {
      const report = compileGrandArchiveAbilities({
        canonicalId: "fixture",
        name: "Fixture",
        types: ["ITEM"],
        rulesText: `${cost}: Return target ally card from your graveyard to your hand.`,
      });
      expect(report.unparsedParagraphs).toBe(0);
      const ability = report.abilities[0];
      if (ability?.kind !== "activated") throw new Error("Expected activated ability");
      expect(ability.functionalZones).toEqual(
        cost.includes("from your graveyard") ? ["graveyard"] : undefined,
      );
    }
  });
});

describe("source-controlled Fairy duration boundaries", () => {
  it("limits the named wake lock to its controller's wake-up phase", () => {
    expect(
      compile(
        "On Enter: Rest target ally. That ally doesn't wake up during its controller's wake up phase as long as you control Fixture.",
      ).abilities,
    ).toMatchObject([
      {
        kind: "triggered",
        effect: {
          kind: "sequence",
          effects: [
            { kind: "rest" },
            {
              action: "wake",
              condition: {
                kind: "all",
                conditions: [
                  { kind: "phase", phase: "wake-up" },
                  { kind: "turn-player", player: { controllerOf: "target-1" } },
                  { kind: "controls-subject", player: "controller", subject: { kind: "source" } },
                ],
              },
              duration: { kind: "while-source-on-field" },
            },
          ],
        },
      },
    ]);
  });
  it("conditions a granted ability on controlling this source", () => {
    expect(
      compile(
        "On Enter: Target non-champion object gains “At the beginning of your recollection phase, deal 1 unpreventable damage to your champion” for as long as you control Fixture.",
      ).abilities,
    ).toMatchObject([
      {
        kind: "triggered",
        effect: {
          kind: "continuous",
          condition: {
            kind: "controls-subject",
            player: "controller",
            subject: { kind: "source" },
          },
          duration: { kind: "while-source-on-field" },
        },
      },
    ]);
  });
  it.each([
    "On Enter: Rest target ally. That ally doesn't wake up during its controller's wake up phase as long as you control Another Card.",
    "On Enter: Target non-champion object gains “At the beginning of your recollection phase, deal 1 unpreventable damage to your champion” for as long as you control Another Card.",
  ])("rejects a duration referring to a different named object: %s", (text) => {
    expect(compile(text).unparsedParagraphs).toBe(1);
  });
});

it("preserves both alternatives when choosing an Animal or Beast from looked-at cards", () => {
  const report = compile(
    "Look at the top five cards of your deck. You may reveal an Animal or Beast card from among them and put it into your hand. Put the rest on the bottom of your deck in any order.",
  );
  expect(report.unparsedParagraphs).toBe(0);
  expect(report.abilities).toMatchObject([
    {
      kind: "card-resolution",
      effect: {
        kind: "sequence",
        effects: [
          { kind: "look-at" },
          {
            kind: "choose",
            selection: { candidates: { filter: { kind: "subtype", oneOf: ["ANIMAL", "BEAST"] } } },
          },
          { kind: "choose", selection: { ordered: true } },
        ],
      },
    },
  ]);
});

it("binds a reveal-dependent iteration to the unique preceding reveal", () => {
  expect(
    compile(
      "At the beginning of your recollection phase, you may reveal all cards in your memory. For each luxem element card revealed, each opponent puts a card from their hand into their memory.",
    ).abilities,
  ).toMatchObject([
    {
      effect: {
        kind: "optional",
        effect: {
          kind: "sequence",
          effects: [
            { kind: "reveal", selection: { id: "revealed-memory" } },
            {
              kind: "for-each",
              collection: {
                binding: "revealed-memory",
                filter: { kind: "element", oneOf: ["LUXEM"] },
              },
            },
          ],
        },
      },
    },
  ]);
});

it("shuffles every unchosen revealed card in one pool after revealing until Arcane", () => {
  expect(
    compile(
      "Banish Storm Tyrant's Eye: Reveal cards from the top of your deck until you reveal an arcane element card. Deal unpreventable damage to your champion equal to the amount of cards revealed this way. Put one of those cards into your hand and the rest on the bottom of your deck in a random order.",
    ).abilities,
  ).toMatchObject([
    {
      kind: "activated",
      effect: {
        kind: "sequence",
        effects: [
          { kind: "reveal-until", bindResultAs: "revealed-cards" },
          {
            kind: "deal-damage",
            amount: { kind: "count", collection: { binding: "revealed-cards" } },
          },
          {
            kind: "choose",
            effect: {
              kind: "sequence",
              effects: [
                { kind: "move", destination: { zone: "hand" } },
                {
                  kind: "move",
                  subject: {
                    kind: "binding-remainder",
                    binding: "revealed-cards",
                    excluding: "chosen-revealed-card",
                  },
                  destination: { placement: { kind: "bottom", order: { kind: "random" } } },
                },
              ],
            },
          },
        ],
      },
    },
  ]);
});

it("matches damage using an attack rather than naming the attack as the damage source", () => {
  expect(
    compile("If this attack would deal damage, it deals double that damage instead.").abilities,
  ).toMatchObject([
    {
      effects: [
        {
          event: { name: "damage-dealt", using: { kind: "source" }, combatDamage: true },
          operation: { operation: "multiply", amount: 2 },
        },
      ],
    },
  ]);
});

it("keeps Ensoul's selection cost separate from its unrestricted Sword permission and next end", () => {
  const result = compile(
    "Choose any amount of Sword weapon cards with memory cost 1 or less from your banishment and/or material deck and put them onto the field. Until end of turn, Sword weapons you control can attack as though they were allies. At the beginning of your next end phase, sacrifice all Sword weapons you control.",
  );
  expect(result.unparsedParagraphs).toBe(0);
  const ability = result.abilities[0];
  if (
    ability?.kind !== "card-resolution" ||
    ability.effect.kind !== "choose" ||
    ability.effect.effect?.kind !== "sequence"
  )
    throw new Error("Expected Ensoul sequence");
  const permission = ability.effect.effect.effects[1],
    sacrifice = ability.effect.effect.effects[2];
  const subject = {
    kind: "each",
    collection: {
      zones: ["field"],
      player: "controller",
      filter: {
        kind: "all",
        filters: [
          { kind: "type", oneOf: ["WEAPON"] },
          { kind: "subtype", oneOf: ["SWORD"] },
        ],
      },
    },
  };
  expect(permission).toMatchObject({ action: "attack-as-ally", subject });
  expect(sacrifice).toMatchObject({
    kind: "create-delayed-trigger",
    effect: { kind: "sacrifice", subject },
  });
  expect(sacrifice).not.toHaveProperty("starts");
});

it("binds a class continuation to its preceding chosen redirect ally", () => {
  expect(
    compile(
      "Change the target of an attack that targets your champion to an ally you control. Class Bonus: That ally gets +1 LIFE until end of turn.",
    ).abilities,
  ).toMatchObject([
    {
      effect: {
        kind: "sequence",
        effects: [
          {
            kind: "conditional",
            condition: {
              kind: "current-attack-target-matches",
              controller: "controller",
              filter: { kind: "type", oneOf: ["CHAMPION"] },
            },
          },
          {
            kind: "conditional",
            then: { kind: "continuous", subjects: { kind: "bound", binding: "target-1" } },
          },
        ],
      },
    },
  ]);
});

it("guards Hymn's optional redirect independently from its optional ally entry", () => {
  expect(
    compile(
      "You may put an Animal or Beast ally card with reserve cost LV or less from your hand onto the field. If you do, you may change the target of an attack that targets your champion to that ally.",
    ).abilities,
  ).toMatchObject([
    {
      effect: {
        kind: "optional",
        effect: {
          kind: "choose",
          effect: {
            kind: "sequence",
            effects: [
              { kind: "move" },
              {
                kind: "conditional",
                condition: { kind: "current-attack-target-matches", controller: "controller" },
                then: { kind: "optional", effect: { kind: "retarget" } },
              },
            ],
          },
        },
      },
    },
  ]);
});

it("uses zero as the class-dependent lower bound for up to two modes", () => {
  expect(
    compile(
      "Choose one. Class Bonus: Choose up to two instead—\n• Your champion gets +1 level until end of turn.\n• Target Beast ally gets +1 POWER until end of turn.\n• Target Beast ally gains cleave until end of turn.",
    ).abilities,
  ).toMatchObject([
    {
      modes: {
        choose: {
          kind: "between",
          minimum: { kind: "conditional", then: 0, else: 1 },
          maximum: { kind: "conditional", then: 2, else: 1 },
        },
      },
    },
  ]);
});

it("preserves activation target context instead of an unbound target placeholder", () => {
  expect(
    compile(
      "[Class Bonus] Whenever you activate an action card that targets an ally, destroy that ally.",
    ).abilities,
  ).toMatchObject([
    {
      trigger: {
        event: {
          name: "card-activated",
          actor: "controller",
          recipient: { kind: "event-object", filter: { kind: "type", oneOf: ["ALLY"] } },
        },
      },
      effect: {
        kind: "destroy",
        subject: {
          kind: "each",
          collection: { binding: "eventRecipient", filter: { kind: "type", oneOf: ["ALLY"] } },
        },
      },
    },
  ]);
});

it("activates a self-return trigger in the graveyard and excludes self without restricting the mill actor", () => {
  const result = compile(
    "[Level 3+] Whenever another ally card enters your graveyard from your deck, return Fixture from your graveyard to the field rested.",
  );
  expect(result.abilities).toMatchObject([
    {
      functionalZones: ["graveyard"],
      trigger: {
        event: {
          name: "card-moved",
          from: "main-deck",
          to: "graveyard",
          subject: {
            owner: "controller",
            filter: {
              kind: "all",
              filters: [{ kind: "type", oneOf: ["ALLY"] }, { kind: "not-source" }],
            },
          },
        },
      },
    },
  ]);
  const ability = result.abilities[0];
  if (ability?.kind !== "triggered" || "intrinsic" in ability)
    throw new Error("Expected triggered effect");
  expect(ability.trigger).not.toHaveProperty("event.actor");
});

it("enables only a self-reveal memory trigger in memory", () => {
  const own = compile("Whenever you reveal this card from your memory, recover 3.");
  expect(own.abilities).toMatchObject([
    {
      kind: "triggered",
      functionalZones: ["memory"],
      trigger: { event: { name: "card-revealed", from: "memory", subject: { kind: "source" } } },
    },
  ]);
  const other = compile("Whenever you reveal a card from your memory, recover 3.");
  expect(other.abilities[0]).not.toHaveProperty("functionalZones");
});
it("scopes a self reserve-payment banish trigger to the graveyard and the reserve cost", () => {
  const result = compile(
    "Whenever this card is banished from your graveyard to pay for a reserve cost, put it onto the field.",
  );
  expect(result.unparsedParagraphs).toBe(0);
  expect(result.abilities).toMatchObject([
    {
      kind: "triggered",
      functionalZones: ["graveyard"],
      trigger: {
        event: {
          name: "card-banished",
          actor: "controller",
          subject: { kind: "source" },
          from: "graveyard",
          payment: { costKind: "reserve" },
        },
      },
      effect: {
        kind: "move",
        subject: { kind: "source" },
        from: "banishment",
        destination: { zone: "field" },
      },
    },
  ]);
});
it("treats a complete named-card descriptor as a name instead of parsing words inside the name", () => {
  const result = compile("Banish a card named Gleaming Cut from your memory. Draw two cards.");
  expect(result.abilities).toMatchObject([
    {
      effect: {
        kind: "sequence",
        effects: [
          {
            kind: "banish",
            selection: {
              candidates: { filter: { kind: "name", value: "Gleaming Cut", match: "exact" } },
            },
          },
          { kind: "draw", amount: 2 },
        ],
      },
    },
  ]);
});

it("pays a material-deck activation permission from the specified graveyard, waiving base costs", () => {
  expect(
    compile(
      "You may banish four Animal or Beast cards from your graveyard to activate this card from your material deck without paying its costs.",
    ).abilities,
  ).toMatchObject([
    {
      kind: "static",
      effects: [
        {
          kind: "rule-modification",
          mode: "allow",
          action: "activate",
          fromZone: "material-deck",
          cost: {
            kind: "select-and-move",
            from: "graveyard",
            to: "banishment",
            count: { kind: "exactly", amount: 4 },
          },
        },
        {
          kind: "rule-modification",
          mode: "replace-cost",
          fromZone: "material-deck",
          cost: { kind: "pay-reserve", amount: 0 },
        },
      ],
    },
  ]);
});
it("limits top-deck permission to the changing top position", () => {
  expect(
    compile("You may activate Animal or Beast ally cards from the top of your deck.").abilities,
  ).toMatchObject([
    { effects: [{ action: "activate", fromZone: "main-deck", fromTopOfDeck: true }] },
  ]);
});

it("compiles every exact name in lists of three or more names", () => {
  for (const names of [
    "Alpha or Beta or Gamma",
    "Alpha and/or Beta and/or Gamma",
    "Alpha or Beta and/or Gamma",
  ]) {
    expect(compile(`Banish a card named ${names} from your memory.`).abilities).toMatchObject([
      {
        effect: {
          selection: {
            candidates: {
              filter: {
                kind: "any",
                filters: [
                  { kind: "name", value: "Alpha", match: "exact" },
                  { kind: "name", value: "Beta", match: "exact" },
                  { kind: "name", value: "Gamma", match: "exact" },
                ],
              },
            },
          },
        },
      },
    ]);
  }
});

it("preserves both subtype alternatives when materializing from the material deck", () => {
  expect(
    compile("Materialize a Book or Scripture card from your material deck.").abilities,
  ).toMatchObject([
    {
      effect: {
        kind: "choose",
        selection: {
          candidates: {
            filter: {
              kind: "any",
              filters: [
                { kind: "subtype", oneOf: ["BOOK"] },
                { kind: "subtype", oneOf: ["SCRIPTURE"] },
              ],
            },
          },
        },
      },
    },
  ]);
});

it("sacrifices every matching object without asking the controller to choose one", () => {
  expect(compile("Sacrifice each regalia with a bond counter on it.").abilities).toMatchObject([
    {
      effect: {
        kind: "sacrifice",
        subject: {
          kind: "each",
          collection: {
            zones: ["field"],
            player: "controller",
            filter: {
              kind: "all",
              filters: [
                { kind: "supertype", oneOf: ["REGALIA"] },
                { kind: "has-counter", counter: { named: "bond" } },
              ],
            },
          },
        },
      },
    },
  ]);
});

it("links Slime King's return choice to the Slimes used for its activation", () => {
  expect(
    compile(
      "You may put any number of the Slime ally cards banished by Slime King onto the field under your control.",
    ).abilities,
  ).toMatchObject([
    {
      effect: {
        selection: {
          candidates: {
            zones: ["banishment"],
            relationship: "activation-payment-of",
            host: { kind: "source" },
          },
        },
      },
    },
  ]);
});
