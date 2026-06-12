import type {
  Ability,
  AbilityLimit,
  AbilityTrigger,
  AlphaCardDefinition,
  AttachmentDefinition,
  CardDefinition,
  CardKeyword,
  CardTargetDSL,
  Condition,
  ContextKey,
  Cost,
  CostModifier,
  Effect,
  GigTargetDSL,
  NumericValue,
  PromoCardDefinition,
  SpoilerCardDefinition,
  StructuredCardDefinition,
  TargetDSL,
  TimingTrigger,
} from "@tcg/cyberpunk-types";

const SELF_TARGET: TargetDSL = { selector: "self" };
const HOST_TARGET: TargetDSL = { selector: "host" };
const FRIENDLY_GIG_TARGET: GigTargetDSL = {
  selector: "gig",
  controller: "friendly",
  amount: 1,
};
const RIVAL_GIG_TARGET: GigTargetDSL = {
  selector: "gig",
  controller: "rival",
  amount: 1,
};

function cardTarget(target: Omit<CardTargetDSL, "selector">): CardTargetDSL {
  return {
    selector: "card",
    ...target,
  };
}

function boundTarget(id: string, index?: number): TargetDSL {
  return {
    selector: "bound",
    id,
    ...(index === undefined ? {} : { index }),
  };
}

function contextTarget(key: ContextKey): TargetDSL {
  return {
    selector: "context",
    key,
  };
}

function perCount(multiplier: number, target: TargetDSL): NumericValue {
  return {
    type: "perCount",
    multiplier,
    target,
  };
}

function streetCredAtLeast(value: number): Condition {
  return {
    condition: "streetCred",
    controller: "friendly",
    comparison: "gte",
    value,
  };
}

function streetCredLessThan(value: number): Condition {
  return {
    condition: "streetCred",
    controller: "friendly",
    comparison: "lt",
    value,
  };
}

function spentCondition(target: TargetDSL): Condition {
  return {
    condition: "cardState",
    target,
    state: "spent",
  };
}

function targetAtMaxValue(target: TargetDSL): Condition {
  return {
    condition: "targetValue",
    target,
    property: "gigValue",
    comparison: "eq",
    value: "max",
  };
}

function gigAtMaxValueCondition(): Condition {
  return {
    condition: "hasGigAtMaxValue",
    controller: "friendly",
  };
}

function hasGigPairCondition(): Condition {
  return {
    condition: "hasGigPair",
    controller: "friendly",
  };
}

function hasDistinctGigValuesCondition(minCount: number): Condition {
  return {
    condition: "hasDistinctGigValues",
    controller: "friendly",
    minCount,
  };
}

function hasMinGigCondition(): Condition {
  return {
    condition: "hasMinGig",
    controller: "friendly",
  };
}

function matchingGigValueCondition(target: TargetDSL, controller: "friendly" | "rival"): Condition {
  return {
    condition: "matchingGig",
    controller,
    target,
    property: "value",
  };
}

function playedThisTurnCondition(target: TargetDSL): Condition {
  return {
    condition: "playedThisTurn",
    target,
  };
}

function duringFriendlyTurn(): Condition {
  return {
    condition: "turn",
    player: "friendly",
  };
}

function attackingCondition(target: TargetDSL): Condition {
  return {
    condition: "attacking",
    target,
  };
}

function fightWonAgainstRivalUnit(target: TargetDSL): Condition {
  return {
    condition: "fightKind",
    target,
    kind: "fight",
  };
}

function keywordAbility(text: string, keyword: "blocker" | "goSolo", source?: TargetDSL): Ability {
  return {
    kind: "keyword",
    text,
    keyword,
    source: source ?? SELF_TARGET,
    effects: [],
  };
}

function staticAbility(args: {
  text: string;
  source?: TargetDSL;
  limits?: AbilityLimit[];
  effects: Effect[];
  conditions?: Condition[];
}): Ability {
  return {
    kind: "static",
    text: args.text,
    ...(args.source ? { source: args.source } : {}),
    ...(args.limits ? { limits: args.limits } : {}),
    ...(args.conditions ? { conditions: args.conditions } : {}),
    effects: args.effects,
  };
}

function triggeredAbility(args: {
  text: string;
  trigger: AbilityTrigger;
  source?: TargetDSL;
  limits?: AbilityLimit[];
  bindings?: Ability["bindings"];
  conditions?: Condition[];
  costs?: Cost[];
  effects: Effect[];
}): Ability {
  return {
    kind: "triggered",
    text: args.text,
    trigger: args.trigger,
    source: args.source ?? SELF_TARGET,
    ...(args.limits ? { limits: args.limits } : {}),
    ...(args.bindings ? { bindings: args.bindings } : {}),
    ...(args.conditions ? { conditions: args.conditions } : {}),
    ...(args.costs ? { costs: args.costs } : {}),
    effects: args.effects,
  };
}

function activatedAbility(args: {
  text: string;
  source?: TargetDSL;
  limits?: AbilityLimit[];
  bindings?: Ability["bindings"];
  conditions?: Condition[];
  costs?: Cost[];
  effects: Effect[];
}): Ability {
  return triggeredAbility({
    ...args,
    trigger: { trigger: "activated" },
  });
}

function gearHostOrSelf(card: CardDefinition): TargetDSL {
  return card.type === "gear" ? HOST_TARGET : SELF_TARGET;
}

function gearAttachment(): AttachmentDefinition {
  return {
    text: "Equip to a unit or face-up legend.",
    target: cardTarget({
      controller: "friendly",
      zones: ["field", "legendArea"],
      cardTypes: ["unit", "legend"],
      face: "faceUp",
    }),
  };
}

function removeStandaloneKeywordText(
  text: string,
  pattern: RegExp,
): { text: string; match?: string } {
  const match = pattern.exec(text);
  if (!match) {
    return { text };
  }

  const matchedText = match[1] ?? match[0];
  return {
    text: normalizeText(text.replace(matchedText, " ")),
    match: matchedText.trim(),
  };
}

function normalizeText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function stripTrailingReminders(text: string, reminderText: string[]): string {
  const reminders = [
    /\s*\(Discard programs after they resolve\.\)$/i,
    /\s*\(Units steal an extra gig for every 10 power\.\)$/i,
    /\s*\(You can only Call a Legend once per turn\.\)$/i,
  ];

  let working = text;
  let changed = true;

  while (changed) {
    changed = false;

    for (const reminder of reminders) {
      const match = reminder.exec(working);
      if (!match) {
        continue;
      }

      reminderText.push(match[0].trim().slice(1, -1));
      working = normalizeText(working.slice(0, match.index));
      changed = true;
    }
  }

  return working;
}

function parseKeywordAbilities(
  card: CardDefinition,
  text: string,
): { abilities: Ability[]; text: string } {
  let working = text;
  const abilities: Ability[] = [];

  if (card.keywords.includes("goSolo") || /GO SOLO\b/i.test(working)) {
    const result = removeStandaloneKeywordText(
      working,
      /(^GO SOLO(?:\s*\([^)]*\))?)(?=\s|$|[A-Z])/i,
    );
    working = result.text;
    abilities.push(keywordAbility(result.match ?? "GO SOLO", "goSolo"));
  }

  if (/BLOCKER(?:\s*\([^)]*\))?/i.test(working)) {
    const result = removeStandaloneKeywordText(
      working,
      /(^BLOCKER(?:\s*\([^)]*\))?|(?<=\.\s)(BLOCKER(?:\s*\([^)]*\))?))/i,
    );
    working = result.text;
    if (result.match) {
      abilities.push(keywordAbility(result.match, "blocker", gearHostOrSelf(card)));
    }
  }

  return {
    abilities,
    text: working,
  };
}

const TIMING_TRIGGERS: ReadonlySet<TimingTrigger> = new Set(["play", "attack", "flip", "call"]);
const PROGRAM_REMINDER = "Discard programs after they resolve.";

function deriveTimingTriggers(abilities: readonly Ability[]): TimingTrigger[] {
  const seen: TimingTrigger[] = [];

  for (const ability of abilities) {
    const trigger = ability.trigger?.trigger;

    if (trigger && TIMING_TRIGGERS.has(trigger as TimingTrigger)) {
      const timingTrigger = trigger as TimingTrigger;

      if (!seen.includes(timingTrigger)) {
        seen.push(timingTrigger);
      }
    }
  }

  return seen;
}

function deriveKeywords(abilities: readonly Ability[]): CardKeyword[] {
  const seen: CardKeyword[] = [];

  for (const ability of abilities) {
    if (ability.kind !== "keyword" || !ability.keyword || seen.includes(ability.keyword)) {
      continue;
    }

    seen.push(ability.keyword);
  }

  return seen;
}

function parseSpecialAbilities(card: CardDefinition, text: string): Ability[] | null {
  const source = gearHostOrSelf(card);

  if (/^PLAY Defeat all other Units\.$/i.test(text)) {
    return [
      triggeredAbility({
        text,
        trigger: { trigger: "play" },
        source,
        effects: [
          {
            effect: "defeat",
            target: cardTarget({
              zones: ["field"],
              cardTypes: ["unit"],
              excludeSelf: true,
            }),
          },
        ],
      }),
    ];
  }

  if (
    /^Adjust a rival Gig by up to ±2\. Then, if a friendly Gig has the same value, draw a card\.$/i.test(
      text,
    )
  ) {
    return [
      triggeredAbility({
        text,
        trigger: { trigger: "play" },
        source,
        bindings: [
          {
            id: "selectedGig",
            target: RIVAL_GIG_TARGET,
          },
        ],
        effects: [
          {
            effect: "adjustGig",
            target: boundTarget("selectedGig"),
            maxAmount: 2,
            direction: "either",
            chooseUpTo: true,
          },
          {
            effect: "draw",
            player: "friendly",
            amount: 1,
            conditions: [matchingGigValueCondition(boundTarget("selectedGig"), "friendly")],
          },
        ],
      }),
    ];
  }

  if (
    /^When this Legend steals a Gig, you may remove this Legend from the game\. If you do, choose a Program from your trash\. Play it for free\.$/i.test(
      text,
    )
  ) {
    return [
      triggeredAbility({
        text,
        trigger: {
          trigger: "event",
          event: {
            event: "gigStolen",
            player: "friendly",
            target: RIVAL_GIG_TARGET,
            minAmount: 1,
            source: SELF_TARGET,
          },
        },
        source: SELF_TARGET,
        effects: [
          {
            effect: "ifYouDo",
            doEffect: {
              effect: "removeFromGame",
              target: SELF_TARGET,
              optional: true,
            },
            ifEffects: [
              {
                effect: "playCard",
                target: cardTarget({
                  controller: "friendly",
                  zones: ["trash"],
                  cardTypes: ["program"],
                }),
                free: true,
              },
            ],
          },
        ],
      }),
    ];
  }

  if (
    /^You may also play this Program when a Unit attacks by paying this card's cost and spending a friendly Unit or face-up Legend\. Give an equipped Unit \+2 power this turn for each of its equipped Gear\. Defeat the Unit at the end of this turn\.$/i.test(
      text,
    )
  ) {
    return [
      triggeredAbility({
        text,
        trigger: {
          trigger: "event",
          event: {
            event: "cardAttacks",
            player: "any",
            target: cardTarget({
              zones: ["field"],
              cardTypes: ["unit"],
            }),
          },
        },
        source,
        costs: [
          { cost: "payCardCost" },
          {
            cost: "spend",
            target: cardTarget({
              controller: "friendly",
              zones: ["field", "legendArea"],
              cardTypes: ["unit", "legend"],
              face: "faceUp",
            }),
          },
        ],
        bindings: [
          {
            id: "selectedUnit",
            target: cardTarget({
              controller: "friendly",
              zones: ["field"],
              cardTypes: ["unit"],
              hasAttachedCards: true,
            }),
          },
        ],
        effects: [
          {
            effect: "modifyPower",
            target: boundTarget("selectedUnit"),
            value: perCount(
              2,
              cardTarget({
                controller: "friendly",
                cardTypes: ["gear"],
                attachedTo: boundTarget("selectedUnit"),
              }),
            ),
            duration: "turn",
          },
          {
            effect: "delayed",
            timing: "endOfTurn",
            effects: [
              {
                effect: "defeat",
                target: boundTarget("selectedUnit"),
              },
            ],
          },
        ],
      }),
    ];
  }

  if (
    /^CALL You may defeat a friendly Gear\. If you do, draw 4 cards\. Otherwise, draw 1 card\.$/i.test(
      text,
    )
  ) {
    return [
      triggeredAbility({
        text,
        trigger: { trigger: "call" },
        source: SELF_TARGET,
        effects: [
          {
            effect: "ifYouDo",
            doEffect: {
              effect: "defeat",
              target: cardTarget({
                controller: "friendly",
                cardTypes: ["gear"],
              }),
              optional: true,
            },
            ifEffects: [
              {
                effect: "draw",
                player: "friendly",
                amount: 4,
              },
            ],
            elseEffects: [
              {
                effect: "draw",
                player: "friendly",
                amount: 1,
              },
            ],
          },
        ],
      }),
    ];
  }

  if (
    /^CALL Decrease a rival Gig's value by 3\. \[Spend Icon\]: Search the top 3 cards of your deck for up to 1 Braindance Program\. Add it to your hand\. Bottom-deck the rest\.$/i.test(
      text,
    )
  ) {
    return [
      triggeredAbility({
        text: "CALL Decrease a rival Gig's value by 3.",
        trigger: { trigger: "call" },
        source: SELF_TARGET,
        effects: [
          {
            effect: "modifyGig",
            target: RIVAL_GIG_TARGET,
            operation: "decrease",
            value: 3,
          },
        ],
      }),
      activatedAbility({
        text: "[Spend Icon]: Search the top 3 cards of your deck for up to 1 Braindance Program. Add it to your hand. Bottom-deck the rest.",
        source: SELF_TARGET,
        costs: [
          {
            cost: "spend",
            target: SELF_TARGET,
          },
        ],
        effects: [
          {
            effect: "searchDeck",
            player: "friendly",
            lookCount: 3,
            target: cardTarget({
              controller: "friendly",
              zones: ["deck"],
              cardTypes: ["program"],
              classifications: ["Braindance"],
            }),
            select: {
              kind: "upTo",
              max: 1,
            },
            reveal: false,
            destination: "hand",
            remainder: {
              zone: "deckBottom",
            },
          },
        ],
      }),
    ];
  }

  if (
    /^The first time this Unit steals a Gig each turn, you may steal a rival Gig with the same number of sides\.$/i.test(
      text,
    )
  ) {
    return [
      triggeredAbility({
        text,
        trigger: {
          trigger: "event",
          event: {
            event: "gigStolen",
            player: "friendly",
            target: RIVAL_GIG_TARGET,
            minAmount: 1,
            source: HOST_TARGET,
          },
        },
        source: HOST_TARGET,
        limits: ["firstTimeEachTurn"],
        effects: [
          {
            effect: "stealGig",
            target: {
              selector: "gig",
              controller: "rival",
              sameSidesAs: contextTarget("triggeredGigs"),
            },
            optional: true,
          },
        ],
      }),
    ];
  }

  if (
    /^CALL Ready this Legend\. When a rival Unit attacks, \[Spend Icon\]: If you have a sided-pair of Gigs, give a friendly Unit with cost 4 or less \+1 power and BLOCKER this turn\.$/i.test(
      text,
    )
  ) {
    return [
      triggeredAbility({
        text: "CALL Ready this Legend.",
        trigger: { trigger: "call" },
        source: SELF_TARGET,
        effects: [
          {
            effect: "ready",
            target: SELF_TARGET,
          },
        ],
      }),
      triggeredAbility({
        text: "When a rival Unit attacks, [Spend Icon]: If you have a sided-pair of Gigs, give a friendly Unit with cost 4 or less +1 power and BLOCKER this turn.",
        trigger: {
          trigger: "event",
          event: {
            event: "cardAttacks",
            player: "rival",
            target: cardTarget({
              controller: "rival",
              zones: ["field"],
              cardTypes: ["unit"],
            }),
          },
        },
        source: SELF_TARGET,
        costs: [
          {
            cost: "spend",
            target: SELF_TARGET,
          },
        ],
        bindings: [
          {
            id: "selectedUnit",
            target: cardTarget({
              controller: "friendly",
              zones: ["field"],
              cardTypes: ["unit"],
              maxCost: 4,
            }),
          },
        ],
        effects: [
          {
            effect: "modifyPower",
            target: boundTarget("selectedUnit"),
            value: 1,
            duration: "turn",
            conditions: [hasGigPairCondition()],
          },
          {
            effect: "grantRule",
            target: boundTarget("selectedUnit"),
            rule: "blocker",
            duration: "turn",
            conditions: [hasGigPairCondition()],
          },
        ],
      }),
    ];
  }

  if (
    /^PLAY Reveal the top 4 cards of your deck\. Then choose a friendly Gig\. Add all cards with cost equal to that Gig's value to your hand\. Trash the rest\.$/i.test(
      text,
    )
  ) {
    return [
      triggeredAbility({
        text,
        trigger: { trigger: "play" },
        source,
        bindings: [
          {
            id: "selectedGig",
            target: FRIENDLY_GIG_TARGET,
          },
        ],
        effects: [
          {
            effect: "searchDeck",
            player: "friendly",
            lookCount: 4,
            target: cardTarget({
              controller: "friendly",
              zones: ["deck"],
              costEqualsGigValueOf: boundTarget("selectedGig"),
            }),
            select: {
              kind: "all",
            },
            reveal: true,
            destination: "hand",
            remainder: {
              zone: "trash",
            },
          },
        ],
      }),
    ];
  }

  if (/^\[Spend Icon\]: If you have a Gig at max value, draw 2 cards\.$/i.test(text)) {
    return [
      activatedAbility({
        text,
        source,
        costs: [
          {
            cost: "spend",
            target: SELF_TARGET,
          },
        ],
        effects: [
          {
            effect: "draw",
            player: "friendly",
            amount: 2,
            conditions: [gigAtMaxValueCondition()],
          },
        ],
      }),
    ];
  }

  if (
    /^When a rival decreases the value of your friendly Gig, you may choose a card from your trash and add it to your hand\.$/i.test(
      text,
    )
  ) {
    return [
      triggeredAbility({
        text,
        trigger: {
          trigger: "event",
          event: {
            event: "gigValueChanged",
            player: "rival",
            target: FRIENDLY_GIG_TARGET,
            direction: "decrease",
          },
        },
        source,
        effects: [
          {
            effect: "moveCard",
            target: cardTarget({
              controller: "friendly",
              zones: ["trash"],
            }),
            destination: "hand",
            optional: true,
          },
        ],
      }),
    ];
  }

  if (
    /^CALL Ready this Legend\. When a friendly Unit attacks, \[Spend Icon\]: Choose a Gear from this Legend and equip it to that Unit\. If you do, ready that Unit\.$/i.test(
      text,
    )
  ) {
    return [
      triggeredAbility({
        text: "CALL Ready this Legend.",
        trigger: { trigger: "call" },
        source: SELF_TARGET,
        effects: [
          {
            effect: "ready",
            target: SELF_TARGET,
          },
        ],
      }),
      triggeredAbility({
        text: "When a friendly Unit attacks, [Spend Icon]: Choose a Gear from this Legend and equip it to that Unit. If you do, ready that Unit.",
        trigger: {
          trigger: "event",
          event: {
            event: "cardAttacks",
            player: "friendly",
            target: cardTarget({
              controller: "friendly",
              zones: ["field"],
              cardTypes: ["unit"],
            }),
          },
        },
        source: SELF_TARGET,
        costs: [
          {
            cost: "spend",
            target: SELF_TARGET,
          },
        ],
        bindings: [
          {
            id: "attackingUnit",
            target: contextTarget("triggerCard"),
          },
        ],
        effects: [
          {
            effect: "ifYouDo",
            doEffect: {
              effect: "moveCard",
              target: cardTarget({
                controller: "friendly",
                cardTypes: ["gear"],
                attachedTo: SELF_TARGET,
              }),
              destination: "field",
              attachTo: boundTarget("attackingUnit"),
              optional: true,
            },
            ifEffects: [
              {
                effect: "ready",
                target: boundTarget("attackingUnit"),
              },
            ],
          },
        ],
      }),
    ];
  }

  if (
    /^PLAY ATTACK You may discard a Program from your hand\. If you do, bottom-deck a rival Unit\.$/i.test(
      text,
    )
  ) {
    const placideEffects: Effect[] = [
      {
        effect: "ifYouDo",
        doEffect: {
          effect: "moveCard",
          target: cardTarget({
            controller: "friendly",
            zones: ["hand"],
            cardTypes: ["program"],
          }),
          destination: "trash",
          optional: true,
        },
        ifEffects: [
          {
            effect: "moveCard",
            target: cardTarget({
              controller: "rival",
              zones: ["field"],
              cardTypes: ["unit"],
            }),
            destination: "deckBottom",
          },
        ],
      },
    ];

    return [
      triggeredAbility({
        text,
        trigger: { trigger: "play" },
        source,
        effects: placideEffects,
      }),
      triggeredAbility({
        text,
        trigger: { trigger: "attack" },
        source,
        effects: placideEffects,
      }),
    ];
  }

  if (/^This Unit can attack spent rival Units the turn it's played\.$/i.test(text)) {
    return [
      staticAbility({
        text,
        effects: [
          {
            effect: "grantRule",
            target: SELF_TARGET,
            rule: "canAttackOnPlayedTurnAgainstUnits",
            duration: "continuous",
            conditions: [playedThisTurnCondition(SELF_TARGET)],
          },
        ],
      }),
    ];
  }

  if (
    /^CALL Draw a card\. When a Unit attacks, \[Spend Icon\]: Choose a Gear from your hand with cost 2 or less\. Equip it for free to a friendly Yellow Unit with no equipped Gears\.$/i.test(
      text,
    )
  ) {
    return [
      triggeredAbility({
        text: "CALL Draw a card.",
        trigger: { trigger: "call" },
        source: SELF_TARGET,
        effects: [
          {
            effect: "draw",
            player: "friendly",
            amount: 1,
          },
        ],
      }),
      triggeredAbility({
        text: "When a Unit attacks, [Spend Icon]: Choose a Gear from your hand with cost 2 or less. Equip it for free to a friendly Yellow Unit with no equipped Gears.",
        trigger: {
          trigger: "event",
          event: {
            event: "cardAttacks",
            player: "any",
            target: cardTarget({
              zones: ["field"],
              cardTypes: ["unit"],
            }),
          },
        },
        source: SELF_TARGET,
        costs: [
          {
            cost: "spend",
            target: SELF_TARGET,
          },
        ],
        bindings: [
          {
            id: "selectedUnit",
            target: cardTarget({
              controller: "friendly",
              zones: ["field"],
              cardTypes: ["unit"],
              colors: ["yellow"],
              hasAttachedCards: false,
            }),
          },
        ],
        effects: [
          {
            effect: "playCard",
            target: cardTarget({
              controller: "friendly",
              zones: ["hand"],
              cardTypes: ["gear"],
              maxCost: 2,
            }),
            free: true,
            attachTo: boundTarget("selectedUnit"),
          },
        ],
      }),
    ];
  }

  if (/^During your turn, this Legend has \+2 power for each equipped Gear\.$/i.test(text)) {
    return [
      staticAbility({
        text,
        source: SELF_TARGET,
        effects: [
          {
            effect: "modifyPower",
            target: SELF_TARGET,
            value: perCount(
              2,
              cardTarget({
                controller: "friendly",
                cardTypes: ["gear"],
                attachedTo: SELF_TARGET,
              }),
            ),
            duration: "continuous",
            conditions: [duringFriendlyTurn()],
          },
        ],
      }),
    ];
  }

  if (
    /^PLAY Defeat a rival Unit with power 2 or less\. If you have more ☆ \(Street Cred\) than a Rival, defeat a rival Unit with power 3 or less instead\.$/.test(
      text,
    )
  ) {
    const friendlyHasMoreCred: Condition = {
      condition: "streetCredComparison",
      controller: "friendly",
      comparison: "gt",
      other: "rival",
    };
    const friendlyHasEqualOrLessCred: Condition = {
      condition: "streetCredComparison",
      controller: "friendly",
      comparison: "lte",
      other: "rival",
    };
    return [
      triggeredAbility({
        text,
        trigger: { trigger: "play" },
        source: SELF_TARGET,
        effects: [
          {
            effect: "defeat",
            target: cardTarget({
              controller: "rival",
              zones: ["field"],
              cardTypes: ["unit"],
              maxPower: 3,
              selection: {
                mode: "choose",
                min: 1,
                max: 1,
              },
            }),
            conditions: [friendlyHasMoreCred],
          },
          {
            effect: "defeat",
            target: cardTarget({
              controller: "rival",
              zones: ["field"],
              cardTypes: ["unit"],
              maxPower: 2,
              selection: {
                mode: "choose",
                min: 1,
                max: 1,
              },
            }),
            conditions: [friendlyHasEqualOrLessCred],
          },
        ],
      }),
    ];
  }

  if (
    /^PLAY Spend a rival Unit for each friendly value-pair of Gigs\. This Unit can attack rival Units the turn it's played\.$/.test(
      text,
    )
  ) {
    return [
      triggeredAbility({
        text: "PLAY Spend a rival Unit for each friendly value-pair of Gigs.",
        trigger: { trigger: "play" },
        source: SELF_TARGET,
        effects: [
          {
            effect: "forEachFriendlyGigPair",
            effects: [
              {
                effect: "spend",
                target: cardTarget({
                  controller: "rival",
                  zones: ["field"],
                  cardTypes: ["unit"],
                  state: "ready",
                  selection: {
                    mode: "choose",
                    min: 1,
                    max: 1,
                  },
                }),
              },
            ],
          },
        ],
      }),
      staticAbility({
        text: "This Unit can attack rival Units the turn it's played.",
        effects: [
          {
            effect: "grantRule",
            target: SELF_TARGET,
            rule: "canAttackOnPlayedTurnAgainstUnits",
            duration: "continuous",
            conditions: [playedThisTurnCondition(SELF_TARGET)],
          },
        ],
      }),
    ];
  }

  if (
    /^You may set a Gig's value to the value of another Gig\. Then, if you control a value-pair, draw 1\.$/.test(
      text,
    )
  ) {
    return [
      triggeredAbility({
        text,
        trigger: { trigger: "play" },
        source: SELF_TARGET,
        bindings: [
          {
            id: "selectedGigs",
            target: {
              selector: "gig",
              amount: 2,
              selection: {
                mode: "choose",
                min: 2,
                max: 2,
              },
            },
          },
        ],
        effects: [
          {
            effect: "copyGigValue",
            source: boundTarget("selectedGigs", 0),
            target: boundTarget("selectedGigs", 1),
            optional: true,
          },
          {
            effect: "draw",
            player: "friendly",
            amount: 1,
            conditions: [hasGigPairCondition()],
          },
        ],
      }),
    ];
  }

  if (/^Defeat a rival Unit with less power than a friendly Unit\.$/.test(text)) {
    return [
      triggeredAbility({
        text,
        trigger: { trigger: "play" },
        source: SELF_TARGET,
        effects: [
          {
            effect: "defeat",
            target: cardTarget({
              controller: "rival",
              zones: ["field"],
              cardTypes: ["unit"],
              powerLessThanAnyOf: cardTarget({
                controller: "friendly",
                zones: ["field"],
                cardTypes: ["unit"],
              }),
              selection: {
                mode: "choose",
                min: 1,
                max: 1,
              },
            }),
          },
        ],
      }),
    ];
  }

  if (
    /^DEFEATED Discard the top 3 cards of your deck\. Then, choose 1 Braindance Program from your trash and add it to your hand\.$/i.test(
      text,
    )
  ) {
    return [
      triggeredAbility({
        text,
        trigger: { trigger: "defeated" },
        source: SELF_TARGET,
        effects: [
          {
            effect: "trashFromDeck",
            player: "friendly",
            amount: 3,
          },
          {
            effect: "moveCard",
            target: cardTarget({
              controller: "friendly",
              zones: ["trash"],
              cardTypes: ["program"],
              classifications: ["Braindance"],
            }),
            destination: "hand",
          },
        ],
      }),
    ];
  }

  if (
    /^PLAY You may defeat a friendly Gear\. If you do, defeat a rival Unit with cost 3 or less\.$/i.test(
      text,
    )
  ) {
    return [
      triggeredAbility({
        text,
        trigger: { trigger: "play" },
        source: SELF_TARGET,
        effects: [
          {
            effect: "ifYouDo",
            doEffect: {
              effect: "defeat",
              target: cardTarget({
                controller: "friendly",
                cardTypes: ["gear"],
              }),
              optional: true,
            },
            ifEffects: [
              {
                effect: "defeat",
                target: cardTarget({
                  controller: "rival",
                  zones: ["field"],
                  cardTypes: ["unit"],
                  maxCost: 3,
                  selection: {
                    mode: "choose",
                    min: 1,
                    max: 1,
                  },
                }),
              },
            ],
          },
        ],
      }),
    ];
  }

  if (
    /^PLAY You may discard 2 Programs\. If you do, bottom-deck a rival unequipped Unit\.$/i.test(
      text,
    )
  ) {
    return [
      triggeredAbility({
        text,
        trigger: { trigger: "play" },
        source: SELF_TARGET,
        effects: [
          {
            effect: "ifYouDo",
            doEffect: {
              effect: "discardFromHand",
              player: "friendly",
              amount: 2,
              target: cardTarget({
                controller: "friendly",
                zones: ["hand"],
                cardTypes: ["program"],
              }),
              optional: true,
            },
            ifEffects: [
              {
                effect: "moveCard",
                target: cardTarget({
                  controller: "rival",
                  zones: ["field"],
                  cardTypes: ["unit"],
                  hasAttachedCards: false,
                  selection: {
                    mode: "choose",
                    min: 1,
                    max: 1,
                  },
                }),
                destination: "deckBottom",
              },
            ],
          },
        ],
      }),
    ];
  }

  if (
    /^When this Unit or Legend is spent, adjust a Gig by up to 1\. Then, if you control 3 or more Gigs with different values, draw 1\.$/i.test(
      text,
    )
  ) {
    return [
      triggeredAbility({
        text,
        trigger: {
          trigger: "event",
          event: {
            event: "cardSpent",
            player: "friendly",
            target: HOST_TARGET,
          },
        },
        source: HOST_TARGET,
        bindings: [
          {
            id: "selectedGig",
            target: {
              selector: "gig",
              amount: 1,
              selection: {
                mode: "choose",
                min: 0,
                max: 1,
              },
            },
          },
        ],
        effects: [
          {
            effect: "adjustGig",
            target: boundTarget("selectedGig"),
            maxAmount: 1,
            direction: "either",
            chooseUpTo: true,
          },
          {
            effect: "draw",
            player: "friendly",
            amount: 1,
            conditions: [hasDistinctGigValuesCondition(3)],
          },
        ],
      }),
    ];
  }

  if (
    /^A rival Unit can't attack until your next turn\. If you control a min Gig, you may Call a Legend for free\.$/i.test(
      text,
    )
  ) {
    return [
      triggeredAbility({
        text,
        trigger: { trigger: "play" },
        source: SELF_TARGET,
        effects: [
          {
            effect: "grantRule",
            target: cardTarget({
              controller: "rival",
              zones: ["field"],
              cardTypes: ["unit"],
              selection: {
                mode: "choose",
                min: 1,
                max: 1,
              },
            }),
            rule: "cantAttack",
            duration: "untilSourceNextTurn",
            optional: true,
          },
          {
            effect: "callLegend",
            player: "friendly",
            target: cardTarget({
              controller: "friendly",
              zones: ["legendArea"],
              cardTypes: ["legend"],
              face: "faceDown",
              selection: {
                mode: "choose",
                min: 1,
                max: 1,
              },
            }),
            free: true,
            optional: true,
            conditions: [hasMinGigCondition()],
          },
        ],
      }),
    ];
  }

  return null;
}

function parseTriggeredByPrefix(
  card: CardDefinition,
  trigger: "play" | "attack" | "flip" | "call" | "defeated",
  body: string,
  fullText: string,
): Ability {
  const source = gearHostOrSelf(card);

  if (trigger === "play") {
    const armoredMinotaur =
      /^If you have (\d+)\+ \* \(Street Cred\), defeat a rival unit with power (\d+) or less\.$/i.exec(
        body,
      );
    if (armoredMinotaur) {
      return triggeredAbility({
        text: fullText,
        trigger: { trigger: "play" },
        source,
        effects: [
          {
            effect: "defeat",
            target: cardTarget({
              controller: "rival",
              zones: ["field"],
              cardTypes: ["unit"],
              maxPower: Number.parseInt(armoredMinotaur[2]!, 10),
              selection: {
                mode: "choose",
                min: 1,
                max: 1,
              },
            }),
            conditions: [streetCredAtLeast(Number.parseInt(armoredMinotaur[1]!, 10))],
          },
        ],
      });
    }

    if (/^This unit can attack spent units this turn\.$/i.test(body)) {
      return triggeredAbility({
        text: fullText,
        trigger: { trigger: "play" },
        source,
        effects: [
          {
            effect: "grantRule",
            target: source,
            rule: "canAttackOnPlayedTurnAgainstUnits",
            duration: "turn",
          },
        ],
      });
    }
  }

  if (trigger === "attack") {
    const defeatGear =
      /^If you have (\d+)\+ \* \(Street Cred\), defeat a rival gear card that costs (\d+) or less\.$/i.exec(
        body,
      );
    if (defeatGear) {
      return triggeredAbility({
        text: fullText,
        trigger: { trigger: "attack" },
        source,
        effects: [
          {
            effect: "defeat",
            target: cardTarget({
              controller: "rival",
              zones: ["field", "legendArea"],
              cardTypes: ["gear"],
              maxCost: Number.parseInt(defeatGear[2]!, 10),
              selection: {
                mode: "choose",
                min: 1,
                max: 1,
              },
            }),
            conditions: [streetCredAtLeast(Number.parseInt(defeatGear[1]!, 10))],
          },
        ],
      });
    }

    if (/^Look at a friendly face-down legend without revealing it\.$/i.test(body)) {
      return triggeredAbility({
        text: fullText,
        trigger: { trigger: "attack" },
        source,
        effects: [
          {
            effect: "lookAt",
            target: cardTarget({
              controller: "friendly",
              zones: ["legendArea"],
              cardTypes: ["legend"],
              face: "faceDown",
              selection: {
                mode: "choose",
                min: 1,
                max: 1,
              },
            }),
            revealToOpponent: false,
          },
        ],
      });
    }

    if (/^If this unit wins a fight against a rival unit, draw a card\.$/i.test(body)) {
      return triggeredAbility({
        text: fullText,
        trigger: { trigger: "attack" },
        source,
        effects: [
          {
            effect: "draw",
            player: "friendly",
            amount: 1,
            conditions: [fightWonAgainstRivalUnit(source)],
          },
        ],
      });
    }

    const doublePowerMatch = /^While fighting a rival Unit, double this Unit's power\.$/i.exec(
      body,
    );
    if (doublePowerMatch) {
      return triggeredAbility({
        text: fullText,
        trigger: { trigger: "attack" },
        source,
        conditions: [
          {
            condition: "fightKind",
            target: source,
            kind: "fight",
          },
        ],
        effects: [
          {
            effect: "multiplyPower",
            target: source,
            multiplier: 2,
            duration: "turn",
          },
        ],
      });
    }
  }

  if (trigger === "flip") {
    const searchMatch =
      /^Search the top (\d+) cards of your deck for up (?:to|yo) (\d+) gear that costs (\d+) or less each\. Reveal them and add them to your hand\. \(Place the other cards on the bottom of your deck in a random order\.\)$/i.exec(
        body,
      );
    if (searchMatch) {
      return triggeredAbility({
        text: fullText,
        trigger: { trigger: "flip" },
        effects: [
          {
            effect: "searchDeck",
            player: "friendly",
            lookCount: Number.parseInt(searchMatch[1]!, 10),
            target: cardTarget({
              controller: "friendly",
              zones: ["deck"],
              cardTypes: ["gear"],
              maxCost: Number.parseInt(searchMatch[3]!, 10),
            }),
            select: {
              kind: "upTo",
              max: Number.parseInt(searchMatch[2]!, 10),
            },
            reveal: true,
            destination: "hand",
            remainder: {
              zone: "deckBottom",
              order: "random",
            },
          },
        ],
      });
    }
  }

  if (trigger === "defeated") {
    const rivalDiscardCostGig =
      /^A rival discards 1\. If the card's cost is equal to the value of a friendly Gig, that rival discards 1 more\.$/i.exec(
        body,
      );
    if (rivalDiscardCostGig) {
      return triggeredAbility({
        text: fullText,
        trigger: { trigger: "defeated" },
        source: SELF_TARGET,
        effects: [
          {
            effect: "discardFromHand",
            player: "rival",
            amount: 1,
          },
          {
            effect: "discardFromHand",
            player: "rival",
            amount: 1,
            conditions: [
              {
                condition: "costMatchesGig",
                target: SELF_TARGET,
                controller: "friendly",
              },
            ],
          },
        ],
      });
    }
  }

  throw new Error(`Unsupported ${trigger.toUpperCase()} ability for ${card.slug}: ${body}`);
}

function parseEventAbility(card: CardDefinition, text: string): Ability {
  if (/^When a rival steals one or more friendly gigs,/i.test(text)) {
    const drawCard =
      /^When a rival steals one or more friendly gigs, if this unit is spent, draw a card\.$/i.test(
        text,
      );
    if (drawCard) {
      return triggeredAbility({
        text,
        trigger: {
          trigger: "event",
          event: {
            event: "gigStolen",
            player: "rival",
            target: FRIENDLY_GIG_TARGET,
            minAmount: 1,
          },
        },
        effects: [
          {
            effect: "draw",
            player: "friendly",
            amount: 1,
            conditions: [spentCondition(SELF_TARGET)],
          },
        ],
      });
    }

    const resetGigs =
      /^When a rival steals one or more friendly gigs, if this unit is spent, the value of those gigs becomes 1\.$/i.test(
        text,
      );
    if (resetGigs) {
      return triggeredAbility({
        text,
        trigger: {
          trigger: "event",
          event: {
            event: "gigStolen",
            player: "rival",
            target: FRIENDLY_GIG_TARGET,
            minAmount: 1,
          },
        },
        effects: [
          {
            effect: "modifyGig",
            target: contextTarget("triggeredGigs"),
            operation: "set",
            value: 1,
            conditions: [spentCondition(SELF_TARGET)],
          },
        ],
      });
    }
  }

  if (
    /^The first time you play a blue unit or blue gear each turn, you may increase a friendly gig by 2\. Then, if it's at max value, draw a card\.$/i.test(
      text,
    )
  ) {
    return triggeredAbility({
      text,
      trigger: {
        trigger: "event",
        event: {
          event: "cardPlayed",
          player: "friendly",
          target: cardTarget({
            controller: "friendly",
            cardTypes: ["unit", "gear"],
            colors: ["blue"],
          }),
        },
      },
      limits: ["firstTimeEachTurn"],
      bindings: [
        {
          id: "selectedGig",
          target: FRIENDLY_GIG_TARGET,
        },
      ],
      effects: [
        {
          effect: "modifyGig",
          target: boundTarget("selectedGig"),
          operation: "increase",
          value: 2,
          optional: true,
        },
        {
          effect: "draw",
          player: "friendly",
          amount: 1,
          conditions: [targetAtMaxValue(boundTarget("selectedGig"))],
        },
      ],
    });
  }

  if (
    /^The first time a friendly Arasaka unit attacks each turn, draw a card\. Then, if you have less than 20 \* \(Street Cred\), discard 1 card from your hand to your trash\.$/i.test(
      text,
    )
  ) {
    return triggeredAbility({
      text,
      trigger: {
        trigger: "event",
        event: {
          event: "cardAttacks",
          player: "friendly",
          target: cardTarget({
            controller: "friendly",
            zones: ["field"],
            cardTypes: ["unit"],
            classifications: ["Arasaka"],
          }),
        },
      },
      limits: ["firstTimeEachTurn"],
      effects: [
        {
          effect: "draw",
          player: "friendly",
          amount: 1,
        },
        {
          effect: "discardFromHand",
          player: "friendly",
          amount: 1,
          conditions: [streetCredLessThan(20)],
        },
      ],
    });
  }

  throw new Error(`Unsupported event ability for ${card.slug}: ${text}`);
}

function parseStaticAbility(card: CardDefinition, text: string): Ability {
  if (/^This unit can't attack\.$/i.test(text)) {
    return staticAbility({
      text,
      effects: [
        {
          effect: "grantRule",
          target: SELF_TARGET,
          rule: "cantAttack",
          duration: "continuous",
        },
      ],
    });
  }

  const powerDuringTurn =
    /^This unit has \+(\d+) power during your turn for each face-up legend in your legends area\.$/i.exec(
      text,
    );
  if (powerDuringTurn) {
    return staticAbility({
      text,
      effects: [
        {
          effect: "modifyPower",
          target: SELF_TARGET,
          value: perCount(
            Number.parseInt(powerDuringTurn[1]!, 10),
            cardTarget({
              controller: "friendly",
              zones: ["legendArea"],
              cardTypes: ["legend"],
              face: "faceUp",
            }),
          ),
          duration: "continuous",
          conditions: [duringFriendlyTurn()],
        },
      ],
    });
  }

  const powerPerGig = /^This unit has \+(\d+) power for each of your friendly gigs\.$/i.exec(text);
  if (powerPerGig) {
    return staticAbility({
      text,
      effects: [
        {
          effect: "modifyPower",
          target: SELF_TARGET,
          value: perCount(Number.parseInt(powerPerGig[1]!, 10), FRIENDLY_GIG_TARGET),
          duration: "continuous",
        },
      ],
    });
  }

  const cantBeBlocked =
    /^If you have (\d+)\+ \* \(Street Cred\), this unit can't be blocked\.$/i.exec(text);
  if (cantBeBlocked) {
    return staticAbility({
      text,
      effects: [
        {
          effect: "grantRule",
          target: SELF_TARGET,
          rule: "cantBeBlocked",
          duration: "continuous",
          conditions: [streetCredAtLeast(Number.parseInt(cantBeBlocked[1]!, 10))],
        },
      ],
    });
  }

  if (/^Your Arasaka units have \+1 power when attacking\.$/i.test(text)) {
    const arasakaUnits = cardTarget({
      controller: "friendly",
      zones: ["field"],
      cardTypes: ["unit"],
      classifications: ["Arasaka"],
    });

    return staticAbility({
      text,
      effects: [
        {
          effect: "modifyPower",
          target: arasakaUnits,
          value: 1,
          duration: "continuous",
          conditions: [attackingCondition(arasakaUnits)],
        },
      ],
    });
  }

  throw new Error(`Unsupported static ability for ${card.slug}: ${text}`);
}

function parseDirectEffectAbility(card: CardDefinition, text: string): Ability {
  const source = gearHostOrSelf(card);

  const spendUnit = /^Spend a rival unit with cost (\d+) or less\.$/i.exec(text);
  if (spendUnit) {
    return triggeredAbility({
      text,
      trigger: { trigger: "play" },
      source,
      effects: [
        {
          effect: "spend",
          target: cardTarget({
            controller: "rival",
            zones: ["field"],
            cardTypes: ["unit"],
            maxCost: Number.parseInt(spendUnit[1]!, 10),
          }),
        },
      ],
    });
  }

  const returnSpentUnit =
    /^Return a spent unit with cost (\d+) or less to its owner's hand\.$/i.exec(text);
  if (returnSpentUnit) {
    return triggeredAbility({
      text,
      trigger: { trigger: "play" },
      source,
      effects: [
        {
          effect: "returnToHand",
          target: cardTarget({
            zones: ["field"],
            cardTypes: ["unit"],
            state: "spent",
            maxCost: Number.parseInt(returnSpentUnit[1]!, 10),
          }),
          destinationOwner: "owner",
        },
      ],
    });
  }

  const increaseGigThenDraw =
    /^Increase a friendly gig by (\d+)\. Then, if you have (\d+)\+ \* \(Street Cred\), draw a card\.$/i.exec(
      text,
    );
  if (increaseGigThenDraw) {
    return triggeredAbility({
      text,
      trigger: { trigger: "play" },
      source,
      effects: [
        {
          effect: "modifyGig",
          target: FRIENDLY_GIG_TARGET,
          operation: "increase",
          value: Number.parseInt(increaseGigThenDraw[1]!, 10),
        },
        {
          effect: "draw",
          player: "friendly",
          amount: 1,
          conditions: [streetCredAtLeast(Number.parseInt(increaseGigThenDraw[2]!, 10))],
        },
      ],
    });
  }

  const rebootOptics =
    /^Give a friendly unit \+(\d+) power this turn\. Defeat it at the end of the turn\.$/i.exec(
      text,
    );
  if (rebootOptics) {
    return triggeredAbility({
      text,
      trigger: { trigger: "play" },
      source,
      bindings: [
        {
          id: "selectedUnit",
          target: cardTarget({
            controller: "friendly",
            zones: ["field"],
            cardTypes: ["unit"],
          }),
        },
      ],
      effects: [
        {
          effect: "modifyPower",
          target: boundTarget("selectedUnit"),
          value: Number.parseInt(rebootOptics[1]!, 10),
          duration: "turn",
        },
        {
          effect: "delayed",
          timing: "endOfTurn",
          effects: [
            {
              effect: "defeat",
              target: boundTarget("selectedUnit"),
            },
          ],
        },
      ],
    });
  }

  return parseStaticAbility(card, text);
}

function parseMainAbility(card: CardDefinition, text: string): Ability[] {
  if (!text) {
    return [];
  }

  const specialAbilities = parseSpecialAbilities(card, text);
  if (specialAbilities) {
    return specialAbilities;
  }

  const triggeredPrefix = /^(PLAY|ATTACK|FLIP|CALL|DEFEATED)\s+(.+)$/.exec(text);
  if (triggeredPrefix) {
    const trigger = triggeredPrefix[1]!.toLowerCase() as
      | "play"
      | "attack"
      | "flip"
      | "call"
      | "defeated";
    return [parseTriggeredByPrefix(card, trigger, triggeredPrefix[2]!, text)];
  }

  if (/^(When|The first time)/i.test(text)) {
    return [parseEventAbility(card, text)];
  }

  return [parseDirectEffectAbility(card, text)];
}

export function parseStructuredCard(card: CardDefinition): StructuredCardDefinition {
  let workingText = card.rulesText ? normalizeText(card.rulesText) : "";
  const reminderText: string[] = [];
  let attachment: AttachmentDefinition | null | undefined;

  const gearEquipReminder = /^\(Equip to (?:a )?(?:friendly )?Unit or face-up Legend\.\)/i;
  if (card.type === "gear" && gearEquipReminder.test(workingText)) {
    attachment = gearAttachment();
    workingText = normalizeText(workingText.replace(gearEquipReminder, ""));
  }

  workingText = stripTrailingReminders(workingText, reminderText);

  const costModifierResult = parseCostModifier(workingText);
  workingText = costModifierResult.text;
  const costModifier = costModifierResult.modifier;

  const parsedKeywords = parseKeywordAbilities(card, workingText);
  workingText = parsedKeywords.text;

  const abilities = [...parsedKeywords.abilities, ...parseMainAbility(card, workingText)];
  const keywords = deriveKeywords(abilities);
  const timingTriggers = deriveTimingTriggers(abilities);

  if (card.type === "program" && !reminderText.includes(PROGRAM_REMINDER)) {
    reminderText.push(PROGRAM_REMINDER);
  }

  return {
    ...card,
    timingTriggers,
    keywords,
    abilities,
    reminderText,
    ...(attachment ? { attachment } : {}),
    ...(costModifier ? { costModifier } : {}),
  };
}

function parseCostModifier(text: string): { text: string; modifier?: CostModifier } {
  const match =
    /^Play this Program for -(\d+) €\$ for each friendly Gig with (\d+)\+ value, to a minimum of (\d+) €\$\.\s*/.exec(
      text,
    );
  if (!match) {
    return { text };
  }
  const modifier: CostModifier = {
    reducer: "perTargetCount",
    reductionPerCount: Number.parseInt(match[1]!, 10),
    target: {
      selector: "gig",
      controller: "friendly",
      amount: "all",
      minValue: Number.parseInt(match[2]!, 10),
    },
    min: Number.parseInt(match[3]!, 10),
  };
  return { text: normalizeText(text.slice(match[0].length)), modifier };
}

export function parseAlphaCard(card: CardDefinition): AlphaCardDefinition {
  if (card.set.code !== "alpha") {
    throw new Error(`Expected an alpha card, received ${card.slug} from ${card.set.code}`);
  }

  return parseStructuredCard(card) as AlphaCardDefinition;
}

export function parseSpoilerCard(card: CardDefinition): SpoilerCardDefinition {
  if (card.set.code !== "spoiler") {
    throw new Error(`Expected a spoiler card, received ${card.slug} from ${card.set.code}`);
  }

  return parseStructuredCard(card) as SpoilerCardDefinition;
}

export function parsePromoCard(card: CardDefinition): PromoCardDefinition {
  if (card.set.code !== "promo") {
    throw new Error(`Expected a promo card, received ${card.slug} from ${card.set.code}`);
  }

  return parseStructuredCard(card) as PromoCardDefinition;
}

export function parseStructuredCards(cards: CardDefinition[]): StructuredCardDefinition[] {
  return cards
    .filter((card) => ["alpha", "spoiler", "promo"].includes(card.set.code))
    .map((card) => parseStructuredCard(card));
}

export function parseAlphaCards(cards: CardDefinition[]): AlphaCardDefinition[] {
  return cards
    .filter((card): card is CardDefinition & { set: { code: "alpha"; name: string } } => {
      return card.set.code === "alpha";
    })
    .map((card) => parseAlphaCard(card));
}

export function parseSpoilerCards(cards: CardDefinition[]): SpoilerCardDefinition[] {
  return cards
    .filter((card): card is CardDefinition & { set: { code: "spoiler"; name: string } } => {
      return card.set.code === "spoiler";
    })
    .map((card) => parseSpoilerCard(card));
}

export function parsePromoCards(cards: CardDefinition[]): PromoCardDefinition[] {
  return cards
    .filter((card): card is CardDefinition & { set: { code: "promo"; name: string } } => {
      return card.set.code === "promo";
    })
    .map((card) => parsePromoCard(card));
}
