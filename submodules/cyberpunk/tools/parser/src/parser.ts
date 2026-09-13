import {
  adrenalineAbility,
  blockerAbility,
  goSoloAbility,
  quickAbility,
} from "@tcg/cyberpunk-types";
import type {
  Ability,
  AbilityLimit,
  AbilityTrigger,
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
  PerCountValue,
  PromoCardDefinition,
  StructuredCardDefinitionBySetCode,
  StructuredSetCode,
  StructuredCardDefinition,
  TargetDSL,
  TheHeistRetailStarterDeckCardDefinition,
  TimingTrigger,
  WelcomeToNightCityRetailCardDefinition,
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

function perCount(multiplier: number, target: TargetDSL): PerCountValue {
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

function hasEvenAndOddGigValuesCondition(): Condition {
  return {
    condition: "hasEvenAndOddGigValues",
    controller: "friendly",
  };
}

function fixerAreaEmpty(): Condition {
  return {
    condition: "fixerAreaCount",
    controller: "friendly",
    comparison: "eq",
    value: 0,
  };
}

function rivalHasAtLeastNMoreGigs(value: number): Condition {
  return {
    condition: "gigCountDifference",
    controller: "rival",
    comparison: "gte",
    other: "friendly",
    value,
  };
}

function hasGigCountCondition(args: {
  controller: "friendly" | "rival";
  minValue?: number;
  comparison: "eq" | "gt" | "gte" | "lt" | "lte";
  value: number;
}): Condition {
  return {
    condition: "hasGigCount",
    ...args,
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

function hasLagCondition(target: TargetDSL): Condition {
  return {
    condition: "hasLag",
    target,
  };
}

function duringFriendlyTurn(): Condition {
  return {
    condition: "turn",
    player: "friendly",
  };
}

function lessStreetCredThanRival(): Condition {
  return {
    condition: "streetCredComparison",
    controller: "friendly",
    comparison: "lt",
    other: "rival",
  };
}

function drawCards(player: "friendly" | "rival", amount: number): Effect {
  return {
    effect: "draw",
    player,
    amount,
  };
}

function friendlyUnitTarget(selection?: { min: number; max: number }): CardTargetDSL {
  return cardTarget({
    controller: "friendly",
    zones: ["field"],
    cardTypes: ["unit"],
    ...(selection ? { selection: { mode: "choose", min: selection.min, max: selection.max } } : {}),
  });
}

function rivalUnitTarget(selection?: { min: number; max: number }): CardTargetDSL {
  return cardTarget({
    controller: "rival",
    zones: ["field"],
    cardTypes: ["unit"],
    ...(selection ? { selection: { mode: "choose", min: selection.min, max: selection.max } } : {}),
  });
}

function anyGigTarget(): GigTargetDSL {
  return {
    selector: "gig",
    amount: 1,
    selection: { mode: "choose", min: 1, max: 1 },
  };
}

function chooseOneOrDraw(option: { id: string; label: string; effects: Effect[] }): Effect {
  return {
    effect: "chooseEffect",
    options: [
      option,
      {
        id: "draw",
        label: "Draw 1",
        effects: [drawCards("friendly", 1)],
      },
    ],
  };
}

function spendSelfCost(): Cost {
  return { cost: "spend", target: SELF_TARGET };
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
  return text
    .replace(
      /(?:\[|\{)(PLAY|ATTACK|FLIP|CALL|DEFEATED|BLOCKER|GO SOLO|ADRENALINE|QUICK|SPEND)(?:\]|\})/gi,
      "$1",
    )
    .replace(/\[Spend Icon:\]/gi, "SPEND")
    .replace(/\s+/g, " ")
    .trim();
}

function stripTrailingReminders(text: string, reminderText: string[]): string {
  const reminders = [
    /\s*\(Discard programs after they resolve\.\)$/i,
    /\s*\(Units steal an extra gig for every 10 power\.\)$/i,
    /\s*\(You can only Call a Legend once per turn\.\)$/i,
    /\s*\(You may only Call a Legend once per turn\.\)$/i,
    /\s*\(This Unit can attack the turn it's played\.\)$/i,
    /\s*\(Units with power 0 don't steal Gigs\.\)$/i,
    /\s*\(Otherwise, keep it on the top of your deck\.\)$/i,
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
    if (result.match) {
      abilities.push(goSoloAbility({ text: result.match }));
    } else if (card.keywords.includes("goSolo")) {
      abilities.push(goSoloAbility({ text: "GO SOLO" }));
    }
  }

  if (/BLOCKER(?:\s*\([^)]*\))?/i.test(working)) {
    const result = removeStandaloneKeywordText(
      working,
      /(^BLOCKER(?:\s*\([^)]*\))?|(?<=\.\s)(BLOCKER(?:\s*\([^)]*\))?))/i,
    );
    working = result.text;
    if (result.match) {
      abilities.push(blockerAbility({ text: result.match, host: card.type === "gear" }));
    }
  }

  if (/ADRENALINE(?:\s*\([^)]*\))?/i.test(working)) {
    const result = removeStandaloneKeywordText(
      working,
      /(^ADRENALINE(?:\s*\([^)]*\))?|(?<=\.\s)(ADRENALINE(?:\s*\([^)]*\))?))/i,
    );
    working = result.text;
    if (result.match) {
      abilities.push(
        adrenalineAbility({
          text: result.match,
          host: card.type === "gear",
        }),
      );
    }
  }

  if (/QUICK(?:\s*\([^)]*\))?/i.test(working)) {
    const result = removeStandaloneKeywordText(
      working,
      /(^QUICK(?:\s*\([^)]*\))?|(?<=\.\s)(QUICK(?:\s*\([^)]*\))?))/i,
    );
    working = result.text;
    if (result.match) {
      abilities.push(quickAbility({ text: result.match, host: card.type === "gear" }));
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

  if (
    /^Choose one effect\.\s*Draw 2\.\s*\/\/\s*A Unit can't attack until your next turn\.\s*\/\/\s*A friendly Legend may use GO SOLO for -2 €\$ this turn, to a minimum of 1 €\$\.$/i.test(
      text,
    )
  ) {
    const cantAttack: Effect = {
      effect: "grantRule",
      target: cardTarget({
        zones: ["field"],
        cardTypes: ["unit"],
        selection: { mode: "choose", min: 1, max: 1 },
      }),
      rule: "cantAttack",
      duration: "untilSourceNextTurn",
    };
    const goSoloDiscount: Effect = {
      effect: "grantCostModifier",
      player: "friendly",
      appliesTo: cardTarget({
        controller: "friendly",
        zones: ["legendArea"],
        cardTypes: ["legend"],
        keywords: ["goSolo"],
      }),
      modifier: {
        reducer: "flat",
        amount: 2,
        min: 1,
      },
      duration: "turn",
    };
    return [
      triggeredAbility({
        text,
        trigger: { trigger: "play" },
        source: SELF_TARGET,
        effects: [
          {
            effect: "chooseEffect",
            options: [
              {
                id: "draw",
                label: "Draw 2",
                effects: [drawCards("friendly", 2)],
              },
              {
                id: "cant-attack",
                label: "A Unit can't attack until your next turn",
                effects: [cantAttack],
              },
              {
                id: "go-solo",
                label:
                  "A friendly Legend may use Go Solo for -2 €$ this turn, to a minimum of 1 €$",
                effects: [goSoloDiscount],
              },
            ],
          },
        ],
      }),
    ];
  }

  if (
    /^The first time another friendly Unit steals a Gig with value less than its power each turn, ready 2 Eddies\.\s*2 €\$,\s*SPEND A rival Unit loses power equal to this Unit's power this turn\.$/i.test(
      text,
    )
  ) {
    return [
      triggeredAbility({
        text: "The first time another friendly Unit steals a Gig with value less than its power each turn, ready 2 Eddies.",
        trigger: {
          trigger: "event",
          event: {
            event: "gigStolen",
            player: "friendly",
            target: {
              selector: "gig",
              controller: "rival",
              amount: 1,
            },
            minAmount: 1,
            source: cardTarget({
              controller: "friendly",
              zones: ["field"],
              cardTypes: ["unit"],
              excludeSelf: true,
            }),
            valueLessThanSourcePower: true,
          },
        },
        source: SELF_TARGET,
        limits: ["firstTimeEachTurn"],
        effects: [
          {
            effect: "readyEddies",
            player: "friendly",
            amount: 2,
          },
        ],
      }),
      activatedAbility({
        text: "2 €$, SPEND A rival Unit loses power equal to this Unit's power this turn.",
        source: SELF_TARGET,
        costs: [{ cost: "payEddies", amount: 2 }, spendSelfCost()],
        effects: [
          {
            effect: "modifyPower",
            target: rivalUnitTarget({ min: 1, max: 1 }),
            value: { type: "sourcePower", multiplier: -1 },
            duration: "turn",
          },
        ],
      }),
    ];
  }

  if (
    /^Choose one effect\. If you have less (?:☆|\*) \(Street Cred\) than a Rival, choose both instead\.\s*Give all rival Units -5 power this turn\.\s*\/\/\s*Bottom-deck all rival Units with power 0\.$/i.test(
      text,
    )
  ) {
    const lessCred = lessStreetCredThanRival();
    const powerDown: Effect = {
      effect: "modifyPower",
      target: cardTarget({
        controller: "rival",
        zones: ["field"],
        cardTypes: ["unit"],
      }),
      value: -5,
      duration: "turn",
    };
    const bottomDeck: Effect = {
      effect: "moveCard",
      target: cardTarget({
        controller: "rival",
        zones: ["field"],
        cardTypes: ["unit"],
        maxPower: 0,
      }),
      destination: "deckBottom",
    };
    return [
      triggeredAbility({
        text,
        trigger: { trigger: "play" },
        source: SELF_TARGET,
        effects: [
          {
            effect: "chooseEffect",
            options: [
              {
                id: "both",
                label: "Both effects (less Street Cred than a Rival)",
                conditions: [lessCred],
                effects: [powerDown, bottomDeck],
              },
              {
                id: "power-down",
                label: "Give all rival Units -5 power this turn",
                conditions: [{ condition: "not", of: lessCred }],
                effects: [powerDown],
              },
              {
                id: "bottom-deck",
                label: "Bottom-deck all rival Units with power 0",
                conditions: [{ condition: "not", of: lessCred }],
                effects: [bottomDeck],
              },
            ],
          },
        ],
      }),
    ];
  }

  if (/^Play up to 2 Units with cost (\d+) or less from your trash for free\.$/i.test(text)) {
    const maxCost = Number.parseInt(
      /^Play up to 2 Units with cost (\d+) or less from your trash for free\.$/i.exec(text)![1]!,
      10,
    );
    const trashUnit: CardTargetDSL = cardTarget({
      controller: "friendly",
      zones: ["trash"],
      cardTypes: ["unit"],
      maxCost,
    });
    const playFromTrash: Effect = {
      effect: "playCard",
      target: trashUnit,
      free: true,
      optional: true,
    };
    return [
      triggeredAbility({
        text,
        trigger: { trigger: "play" },
        source: SELF_TARGET,
        effects: [playFromTrash, playFromTrash],
      }),
    ];
  }

  if (
    /^SPEND Swap a friendly Gig with a rival Gig\. At the start of your turn, draw 1 for each friendly value-pair of Gigs\.$/i.test(
      text,
    )
  ) {
    return [
      activatedAbility({
        text: "SPEND Swap a friendly Gig with a rival Gig.",
        source: SELF_TARGET,
        bindings: [
          {
            id: "friendlyGig",
            target: {
              ...FRIENDLY_GIG_TARGET,
              selection: { mode: "choose", min: 1, max: 1 },
            },
          },
          {
            id: "rivalGig",
            target: {
              ...RIVAL_GIG_TARGET,
              selection: { mode: "choose", min: 1, max: 1 },
            },
          },
        ],
        costs: [{ cost: "spend", target: SELF_TARGET }],
        effects: [
          {
            effect: "swapGigs",
            friendly: boundTarget("friendlyGig"),
            rival: boundTarget("rivalGig"),
          },
        ],
      }),
      triggeredAbility({
        text: "At the start of your turn, draw 1 for each friendly value-pair of Gigs.",
        trigger: {
          trigger: "event",
          event: { event: "turnStarted", player: "friendly" },
        },
        source: SELF_TARGET,
        effects: [
          {
            effect: "forEachFriendlyGigPair",
            effects: [{ effect: "draw", player: "friendly", amount: 1 }],
          },
        ],
      }),
    ];
  }

  if (
    /^The next time a friendly Unit wins a fight by 3\+ power this turn, it also steals a Gig\.$/i.test(
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
            effect: "grantNextFightWinGigSteal",
            minPowerMargin: 3,
            duration: "turn",
          },
        ],
      }),
    ];
  }

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
            conditions: [hasLagCondition(SELF_TARGET)],
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
            conditions: [hasLagCondition(SELF_TARGET)],
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
    /^CALL Choose one effect\. Give a friendly Unit \+2 power this turn\. \/\/ Draw 1\. SPEND:? Increase a Gig by up to 2\.$/i.test(
      text,
    )
  ) {
    return [
      triggeredAbility({
        text: "CALL Choose one effect. Give a friendly Unit +2 power this turn. // Draw 1.",
        trigger: { trigger: "call" },
        source: SELF_TARGET,
        effects: [
          chooseOneOrDraw({
            id: "buff",
            label: "Give a friendly Unit +2 power this turn",
            effects: [
              {
                effect: "modifyPower",
                target: friendlyUnitTarget({ min: 1, max: 1 }),
                value: 2,
                duration: "turn",
              },
            ],
          }),
        ],
      }),
      activatedAbility({
        text: "SPEND: Increase a Gig by up to 2.",
        source: SELF_TARGET,
        bindings: [{ id: "selectedGig", target: anyGigTarget() }],
        costs: [spendSelfCost()],
        effects: [
          {
            effect: "adjustGig",
            target: boundTarget("selectedGig"),
            maxAmount: 2,
            direction: "increase",
            chooseUpTo: true,
          },
        ],
      }),
    ];
  }

  if (
    /^PLAY Until your next turn, rival Units can't steal friendly Gigs with value higher than their power\.$/i.test(
      text,
    )
  ) {
    return [
      triggeredAbility({
        text,
        trigger: { trigger: "play" },
        source,
        effects: [
          {
            effect: "grantRule",
            target: SELF_TARGET,
            rule: "cantStealGigAbovePower",
            duration: "untilSourceNextTurn",
          },
        ],
      }),
    ];
  }

  if (
    /^When this Unit or Legend is spent, you may look at a friendly face-down Legend\. If that Legend is ARASAKA or has GO SOLO, you may Call it for free\.$/i.test(
      text,
    )
  ) {
    const faceDownLegend = cardTarget({
      controller: "friendly",
      zones: ["legendArea"],
      cardTypes: ["legend"],
      face: "faceDown",
      selection: { mode: "choose", min: 0, max: 1 },
    });
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
        bindings: [{ id: "selectedLegend", target: faceDownLegend }],
        effects: [
          {
            effect: "lookAt",
            target: boundTarget("selectedLegend"),
            revealToOpponent: false,
          },
          {
            effect: "callLegend",
            player: "friendly",
            target: boundTarget("selectedLegend"),
            free: true,
            optional: true,
            conditions: [
              {
                condition: "targetExists",
                target: {
                  selector: "bound",
                  id: "selectedLegend",
                  classifications: ["Arasaka"],
                },
              },
            ],
          },
          {
            effect: "callLegend",
            player: "friendly",
            target: boundTarget("selectedLegend"),
            free: true,
            optional: true,
            conditions: [
              {
                condition: "targetExists",
                target: {
                  selector: "bound",
                  id: "selectedLegend",
                  keywords: ["goSolo"],
                },
              },
            ],
          },
        ],
      }),
    ];
  }

  if (/^If this Unit would be defeated, defeat its "DEADMAN TRANSMITTER" instead\.$/i.test(text)) {
    return [
      staticAbility({
        text,
        source: SELF_TARGET,
        effects: [
          {
            effect: "grantRule",
            target: SELF_TARGET,
            rule: "sacrificeInsteadOfHostDefeat",
            duration: "continuous",
          },
        ],
      }),
    ];
  }

  if (
    /^Give a friendly Unit these effects\. If you have less (?:☆|\*) \(Street Cred\) than a Rival, they instead choose one effect for you\. The next time this Unit attacks this turn, it may attack ready Units\. \/\/ Give this Unit \+3 power this turn\.$/i.test(
      text,
    )
  ) {
    const lessCred = lessStreetCredThanRival();
    const readyAttack: Effect = {
      effect: "grantRule",
      target: boundTarget("selectedUnit"),
      rule: "canAttackReadyUnits",
      duration: "turn",
    };
    const plusPower: Effect = {
      effect: "modifyPower",
      target: boundTarget("selectedUnit"),
      value: 3,
      duration: "turn",
    };
    return [
      triggeredAbility({
        text,
        trigger: { trigger: "play" },
        source: SELF_TARGET,
        bindings: [{ id: "selectedUnit", target: friendlyUnitTarget({ min: 1, max: 1 }) }],
        effects: [
          {
            effect: "chooseEffect",
            chooser: "rival",
            options: [
              {
                id: "both",
                label: "Attack ready Units this turn and get +3 power",
                conditions: [{ condition: "not", of: lessCred }],
                effects: [readyAttack, plusPower],
              },
              {
                id: "ready-attack",
                label: "The next time this Unit attacks this turn, it may attack ready Units",
                conditions: [lessCred],
                effects: [readyAttack],
              },
              {
                id: "plus-power",
                label: "Give this Unit +3 power this turn",
                conditions: [lessCred],
                effects: [plusPower],
              },
            ],
          },
        ],
      }),
    ];
  }

  if (
    /^Each player discards their hand and may draw 5\. If the total number of discarded cards equals the value of a friendly Gig, draw 2\.$/i.test(
      text,
    )
  ) {
    const mayDrawFive = (chooser: "friendly" | "rival"): Effect => ({
      effect: "chooseEffect",
      chooser,
      options: [
        {
          id: "draw",
          label: "Draw 5",
          effects: [drawCards(chooser, 5)],
        },
        {
          id: "skip",
          label: "Do not draw",
          effects: [],
        },
      ],
    });
    return [
      triggeredAbility({
        text,
        trigger: { trigger: "play" },
        source: SELF_TARGET,
        effects: [
          { effect: "discardFromHand", player: "friendly", amount: "all" },
          { effect: "discardFromHand", player: "rival", amount: "all" },
          mayDrawFive("friendly"),
          mayDrawFive("rival"),
          {
            effect: "draw",
            player: "friendly",
            amount: 2,
            conditions: [{ condition: "discardedCountMatchesGig", controller: "friendly" }],
          },
        ],
      }),
    ];
  }

  if (
    /^CALL Choose one effect\. A friendly Unit can't be defeated in a fight this turn\. \/\/ Draw 1\. SPEND:? Adjust a Gig by 1\.$/i.test(
      text,
    )
  ) {
    return [
      triggeredAbility({
        text: "CALL Choose one effect. A friendly Unit can't be defeated in a fight this turn. // Draw 1.",
        trigger: { trigger: "call" },
        source: SELF_TARGET,
        effects: [
          chooseOneOrDraw({
            id: "protect",
            label: "A friendly Unit can't be defeated in a fight this turn",
            effects: [
              {
                effect: "grantRule",
                target: friendlyUnitTarget({ min: 1, max: 1 }),
                rule: "cantBeDefeatedInFight",
                duration: "turn",
              },
            ],
          }),
        ],
      }),
      activatedAbility({
        text: "SPEND Adjust a Gig by 1.",
        source: SELF_TARGET,
        bindings: [{ id: "selectedGig", target: anyGigTarget() }],
        costs: [spendSelfCost()],
        effects: [
          {
            effect: "adjustGig",
            target: boundTarget("selectedGig"),
            maxAmount: 1,
            direction: "either",
          },
        ],
      }),
    ];
  }

  if (/^When this Unit steals a Gig, if it's equipped, a Rival discards 1\.$/i.test(text)) {
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
            effect: "discardFromHand",
            player: "rival",
            amount: 1,
            conditions: [
              {
                condition: "targetExists",
                target: cardTarget({
                  controller: "friendly",
                  cardTypes: ["gear"],
                  attachedTo: SELF_TARGET,
                }),
              },
            ],
          },
        ],
      }),
    ];
  }

  if (
    /^Play your first CYBERWARE Gear each turn for -3 €\$ , to a minimum of 1 €\$\.$/i.test(text) ||
    /^Play your first CYBERWARE Gear each turn for -3 €\$, to a minimum of 1 €\$\.$/i.test(text)
  ) {
    return [
      staticAbility({
        text,
        limits: ["firstTimeEachTurn"],
        effects: [
          {
            effect: "grantCostModifier",
            player: "friendly",
            appliesTo: cardTarget({
              controller: "friendly",
              zones: ["hand"],
              cardTypes: ["gear"],
              classifications: ["Cyberware"],
            }),
            modifier: {
              reducer: "flat",
              amount: 3,
              min: 1,
            },
            duration: "continuous",
          },
        ],
      }),
    ];
  }

  if (
    /^If a Rival controls at least 2 more Gigs than you, this Unit has ADRENALINE\.$/i.test(text)
  ) {
    return [
      staticAbility({
        text,
        source: HOST_TARGET,
        effects: [
          {
            effect: "grantRule",
            target: HOST_TARGET,
            rule: "adrenaline",
            duration: "continuous",
            conditions: [
              {
                condition: "gigCountDifference",
                controller: "rival",
                comparison: "gte",
                other: "friendly",
                value: 2,
              },
            ],
          },
        ],
      }),
    ];
  }

  if (
    /^CALL Choose one effect\. Spend a rival Unit\. \/\/ Draw 1\. SPEND:? Set a player's Gig to the same value as another player's Gig\.$/i.test(
      text,
    )
  ) {
    return [
      triggeredAbility({
        text: "CALL Choose one effect. Spend a rival Unit. // Draw 1.",
        trigger: { trigger: "call" },
        source: SELF_TARGET,
        effects: [
          chooseOneOrDraw({
            id: "spend",
            label: "Spend a rival Unit",
            effects: [
              {
                effect: "spend",
                target: rivalUnitTarget({ min: 1, max: 1 }),
              },
            ],
          }),
        ],
      }),
      activatedAbility({
        text: "SPEND Set a player's Gig to the same value as another player's Gig.",
        source: SELF_TARGET,
        bindings: [
          {
            id: "selectedGigs",
            target: {
              selector: "gig",
              amount: 2,
              selection: { mode: "choose", min: 2, max: 2 },
            },
          },
        ],
        costs: [spendSelfCost()],
        effects: [
          {
            effect: "copyGigValue",
            source: boundTarget("selectedGigs", 0),
            target: boundTarget("selectedGigs", 1),
          },
        ],
      }),
    ];
  }

  if (/^PLAY You may swap a friendly Gig with a rival Gig\.$/i.test(text)) {
    return [
      triggeredAbility({
        text,
        trigger: { trigger: "play" },
        source,
        bindings: [
          {
            id: "friendlyGig",
            target: {
              ...FRIENDLY_GIG_TARGET,
              selection: { mode: "choose", min: 1, max: 1 },
            },
          },
          {
            id: "rivalGig",
            target: {
              ...RIVAL_GIG_TARGET,
              selection: { mode: "choose", min: 1, max: 1 },
            },
          },
        ],
        effects: [
          {
            effect: "swapGigs",
            friendly: boundTarget("friendlyGig"),
            rival: boundTarget("rivalGig"),
            optional: true,
          },
        ],
      }),
    ];
  }

  if (
    /^During your turn, you may Call a Legend for free\. ATTACK Discard 1\. If you do, draw 1 for each friendly face-up Legend\.$/i.test(
      text,
    )
  ) {
    return [
      staticAbility({
        text: "During your turn, you may Call a Legend for free.",
        effects: [
          {
            effect: "grantRule",
            target: SELF_TARGET,
            rule: "callLegendFree",
            duration: "continuous",
            conditions: [duringFriendlyTurn()],
          },
        ],
      }),
      triggeredAbility({
        text: "ATTACK Discard 1. If you do, draw 1 for each friendly face-up Legend.",
        trigger: { trigger: "attack" },
        source: SELF_TARGET,
        effects: [
          {
            effect: "ifYouDo",
            doEffect: {
              effect: "discardFromHand",
              player: "friendly",
              amount: 1,
              optional: true,
            },
            ifEffects: [
              {
                effect: "draw",
                player: "friendly",
                amount: perCount(
                  1,
                  cardTarget({
                    controller: "friendly",
                    zones: ["legendArea"],
                    cardTypes: ["legend"],
                    face: "faceUp",
                  }),
                ),
              },
            ],
          },
        ],
      }),
    ];
  }

  if (/^Spend all rival Units\. Then, defeat a spent Unit\.$/i.test(text)) {
    return [
      triggeredAbility({
        text,
        trigger: { trigger: "play" },
        source: SELF_TARGET,
        effects: [
          {
            effect: "spend",
            target: cardTarget({
              controller: "rival",
              zones: ["field"],
              cardTypes: ["unit"],
            }),
          },
          {
            effect: "defeat",
            target: cardTarget({
              zones: ["field"],
              cardTypes: ["unit"],
              state: "spent",
              selection: { mode: "choose", min: 1, max: 1 },
            }),
          },
        ],
      }),
    ];
  }

  if (
    /^CALL Choose one effect\. Give a rival Unit -2 power this turn\. \/\/ Draw 1\. SPEND:? Decrease a Gig by up to 2\.$/i.test(
      text,
    )
  ) {
    return [
      triggeredAbility({
        text: "CALL Choose one effect. Give a rival Unit -2 power this turn. // Draw 1.",
        trigger: { trigger: "call" },
        source: SELF_TARGET,
        effects: [
          chooseOneOrDraw({
            id: "weaken",
            label: "Give a rival Unit -2 power this turn",
            effects: [
              {
                effect: "modifyPower",
                target: rivalUnitTarget({ min: 1, max: 1 }),
                value: -2,
                duration: "turn",
              },
            ],
          }),
        ],
      }),
      activatedAbility({
        text: "SPEND: Decrease a Gig by up to 2.",
        source: SELF_TARGET,
        bindings: [{ id: "selectedGig", target: anyGigTarget() }],
        costs: [spendSelfCost()],
        effects: [
          {
            effect: "adjustGig",
            target: boundTarget("selectedGig"),
            maxAmount: 2,
            direction: "decrease",
            chooseUpTo: true,
          },
        ],
      }),
    ];
  }

  if (/^PLAY Draw 2\.$/i.test(text)) {
    return [
      triggeredAbility({
        text,
        trigger: { trigger: "play" },
        source,
        effects: [drawCards("friendly", 2)],
      }),
    ];
  }

  if (
    /^At the end of your turn, if you have less (?:☆|\*) \(Street Cred\) than a Rival, ready this Unit\.$/i.test(
      text,
    )
  ) {
    return [
      triggeredAbility({
        text,
        trigger: {
          trigger: "event",
          event: { event: "turnEnded", player: "friendly" },
        },
        source: SELF_TARGET,
        effects: [
          {
            effect: "ready",
            target: SELF_TARGET,
            conditions: [lessStreetCredThanRival()],
          },
        ],
      }),
    ];
  }

  if (
    /^When this Unit or Legend is spent, search the top card of your deck\. You may trash it\.$/i.test(
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
        effects: [
          {
            effect: "searchDeck",
            player: "friendly",
            lookCount: 1,
            target: cardTarget({
              controller: "friendly",
              zones: ["deck"],
            }),
            select: { kind: "upTo", max: 1 },
            reveal: false,
            destination: "trash",
            remainder: { zone: "deckTop" },
          },
        ],
      }),
    ];
  }

  if (
    /^PLAY You may defeat a Gear\. If its cost equals the value of a friendly Gig, draw 1\.$/i.test(
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
            id: "selectedGear",
            target: cardTarget({
              cardTypes: ["gear"],
              selection: { mode: "choose", min: 0, max: 1 },
            }),
          },
        ],
        effects: [
          {
            effect: "defeat",
            target: boundTarget("selectedGear"),
            optional: true,
          },
          {
            effect: "draw",
            player: "friendly",
            amount: 1,
            conditions: [
              {
                condition: "costMatchesGig",
                target: boundTarget("selectedGear"),
                controller: "friendly",
              },
            ],
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

    if (/^You may Call a Legend for free\.$/i.test(body)) {
      return triggeredAbility({
        text: fullText,
        trigger: { trigger: "play" },
        source,
        effects: [
          {
            effect: "callLegend",
            player: "friendly",
            free: true,
            optional: true,
            target: cardTarget({
              controller: "friendly",
              zones: ["legendArea"],
              cardTypes: ["legend"],
              face: "faceDown",
              selection: { mode: "choose", min: 1, max: 1 },
            }),
          },
        ],
      });
    }

    if (
      /^Until your next turn, rival Legends can't steal friendly Gigs with value less than their power\.$/i.test(
        body,
      )
    ) {
      return triggeredAbility({
        text: fullText,
        trigger: { trigger: "play" },
        source,
        effects: [
          {
            effect: "grantRule",
            target: SELF_TARGET,
            rule: "cantStealGigBelowPower",
            duration: "untilSourceNextTurn",
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
            logReason: "costMatchedFriendlyGig",
            conditions: [
              {
                condition: "costMatchesGig",
                target: {
                  selector: "context",
                  key: "discardedCards",
                },
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

  if (/^When this Unit uses Blocker, a Rival discards 1\.$/i.test(text)) {
    return triggeredAbility({
      text,
      trigger: {
        trigger: "event",
        event: {
          event: "blockerActivated",
          player: "friendly",
          target: SELF_TARGET,
        },
      },
      source: SELF_TARGET,
      effects: [
        {
          effect: "discardFromHand",
          player: "rival",
          amount: 1,
        },
      ],
    });
  }

  if (
    /^When a friendly Legend steals a Gig, if its value is even, draw 1\. If its value is odd, a Rival discards 1\.$/i.test(
      text,
    )
  ) {
    const stolenGig: TargetDSL = contextTarget("triggeredGigs");
    return triggeredAbility({
      text,
      trigger: {
        trigger: "event",
        event: {
          event: "gigStolen",
          player: "friendly",
          target: RIVAL_GIG_TARGET,
          minAmount: 1,
          source: cardTarget({
            controller: "friendly",
            cardTypes: ["legend"],
          }),
        },
      },
      source: SELF_TARGET,
      effects: [
        {
          effect: "draw",
          player: "friendly",
          amount: 1,
          conditions: [
            {
              condition: "targetParity",
              target: stolenGig,
              property: "gigValue",
              parity: "even",
            },
          ],
        },
        {
          effect: "discardFromHand",
          player: "rival",
          amount: 1,
          conditions: [
            {
              condition: "targetParity",
              target: stolenGig,
              property: "gigValue",
              parity: "odd",
            },
          ],
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

  if (/^This Unit can't attack unless you played a Program this turn\.$/i.test(text)) {
    return staticAbility({
      text,
      effects: [
        {
          effect: "grantRule",
          target: SELF_TARGET,
          rule: "requiresProgramPlayedThisTurn",
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

  const defeatRivalGear = /^Defeat a rival Gear with power (\d+) or less\.$/i.exec(text);
  if (defeatRivalGear) {
    return triggeredAbility({
      text,
      trigger: { trigger: "play" },
      source,
      effects: [
        {
          effect: "defeat",
          target: cardTarget({
            controller: "rival",
            zones: ["field"],
            cardTypes: ["gear"],
            maxPower: Number.parseInt(defeatRivalGear[1]!, 10),
            selection: { mode: "choose", min: 1, max: 1 },
          }),
        },
      ],
    });
  }

  if (
    /^Spend a rival Unit\. It can't ready until your next turn\. If your (?:☆|\*) \(Street Cred\) is an even number, draw 1\.$/i.test(
      text,
    )
  ) {
    return triggeredAbility({
      text,
      trigger: { trigger: "play" },
      source,
      bindings: [
        {
          id: "unit",
          target: rivalUnitTarget({ min: 1, max: 1 }),
        },
      ],
      effects: [
        { effect: "spend", target: boundTarget("unit") },
        {
          effect: "grantRule",
          target: boundTarget("unit"),
          rule: "cantReady",
          duration: "untilSourceNextTurn",
        },
        {
          effect: "draw",
          player: "friendly",
          amount: 1,
          conditions: [{ condition: "streetCredParity", controller: "friendly", parity: "even" }],
        },
      ],
    });
  }

  const searchTopAddMinGigs =
    /^Search the top (\d+) cards of your deck\. Add 1 to your hand\. You may add 1 more for each friendly min Gig\. Bottom-deck the rest\.$/i.exec(
      text,
    );
  if (searchTopAddMinGigs) {
    return triggeredAbility({
      text,
      trigger: { trigger: "play" },
      source,
      effects: [
        {
          effect: "searchDeck",
          player: "friendly",
          lookCount: Number.parseInt(searchTopAddMinGigs[1]!, 10),
          target: cardTarget({
            controller: "friendly",
            zones: ["deck"],
          }),
          select: {
            kind: "upTo",
            max: {
              type: "basePlusPerCount",
              base: 1,
              multiplier: 1,
              target: {
                selector: "gig",
                controller: "friendly",
                amount: "all",
                minValue: 1,
                maxValue: 1,
              },
            },
          },
          reveal: false,
          destination: "hand",
          remainder: { zone: "deckBottom", order: "random" },
        },
      ],
    });
  }

  if (card.slug === "les-e-le-mens") {
    return triggeredAbility({
      text,
      trigger: { trigger: "play" },
      source,
      effects: [
        {
          effect: "moveCard",
          target: cardTarget({
            controller: "rival",
            zones: ["field"],
            cardTypes: ["unit"],
            lowestPower: true,
            selection: { mode: "choose", min: 1, max: 1 },
          }),
          destination: "deckBottom",
        },
      ],
    });
  }

  if (card.slug === "unlikely-bond") {
    return triggeredAbility({
      text,
      trigger: { trigger: "play" },
      source,
      effects: [
        {
          effect: "ifYouDo",
          doEffect: {
            effect: "moveCard",
            target: cardTarget({
              controller: "friendly",
              zones: ["field"],
              cardTypes: ["unit"],
              state: "ready",
              selection: { mode: "choose", min: 1, max: 1 },
            }),
            destination: "deckBottom",
          },
          ifEffects: [
            {
              effect: "moveCard",
              target: cardTarget({
                controller: "rival",
                zones: ["field"],
                cardTypes: ["unit"],
                state: "spent",
                selection: { mode: "choose", min: 1, max: 1 },
              }),
              destination: "deckBottom",
            },
          ],
        },
      ],
    });
  }

  if (card.slug === "wild-in-the-streets") {
    return triggeredAbility({
      text,
      trigger: { trigger: "play" },
      source,
      effects: [
        {
          effect: "defeat",
          target: cardTarget({
            zones: ["field"],
            cardTypes: ["unit"],
            state: "spent",
            selection: { mode: "choose", min: 1, max: 1 },
          }),
        },
      ],
    });
  }

  if (
    /^Sell the top card of your deck\. If you control a Gig with an even value and a Gig with an odd value, draw 2\.$/i.test(
      text,
    )
  ) {
    return triggeredAbility({
      text,
      trigger: { trigger: "play" },
      source,
      effects: [
        {
          effect: "sellFromDeck",
          player: "friendly",
          amount: 1,
        },
        {
          effect: "draw",
          player: "friendly",
          amount: 2,
          conditions: [hasEvenAndOddGigValuesCondition()],
        },
      ],
    });
  }

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

  try {
    if (/^\[(?:Flavor|Flavour)(?: Text)?\]/i.test(text)) {
      return [];
    }
    const cantAttackPrefix = /^(This Unit can't attack\.)\s+([\s\S]+)$/i.exec(text);
    if (cantAttackPrefix) {
      const cantAttackAbility = parseStaticAbility(card, cantAttackPrefix[1]!);
      try {
        return [cantAttackAbility, ...parseMainAbility(card, cantAttackPrefix[2]!)];
      } catch (error) {
        if (isLegacySetCode(card.set.code)) {
          throw error;
        }

        return [
          cantAttackAbility,
          staticAbility({
            text: cantAttackPrefix[2]!,
            effects: [],
          }),
        ];
      }
    }

    const specialAbilities = parseSpecialAbilities(card, text);
    if (specialAbilities) {
      return specialAbilities;
    }

    const triggeredPrefix = /^(PLAY|ATTACK|FLIP|CALL|DEFEATED)\s+(.+)$/i.exec(text);
    if (triggeredPrefix) {
      const trigger = triggeredPrefix[1]!.toLowerCase() as
        | "play"
        | "attack"
        | "flip"
        | "call"
        | "defeated";
      return [parseTriggeredByPrefix(card, trigger, triggeredPrefix[2]!, text)];
    }

    if (card.slug === "v-roamer-of-the-badlands") {
      return [
        triggeredAbility({
          text: "When this Unit steals a Gig, increase it by up to 5.",
          trigger: {
            trigger: "event",
            event: {
              event: "gigStolen",
              player: "friendly",
              target: FRIENDLY_GIG_TARGET,
              minAmount: 1,
              source: SELF_TARGET,
            },
          },
          source: SELF_TARGET,
          effects: [
            {
              effect: "adjustGig",
              target: contextTarget("triggeredGigs"),
              maxAmount: 5,
              direction: "increase",
              chooseUpTo: true,
            },
          ],
        }),
        triggeredAbility({
          text: "At the end of your turn, if you control 2 or more Gigs with 8+ value, draw 1.",
          trigger: { trigger: "event", event: { event: "turnEnded", player: "friendly" } },
          source: SELF_TARGET,
          effects: [
            {
              effect: "draw",
              player: "friendly",
              amount: 1,
              conditions: [
                hasGigCountCondition({
                  controller: "friendly",
                  minValue: 8,
                  comparison: "gte",
                  value: 2,
                }),
              ],
            },
          ],
        }),
      ];
    }

    if (/^(When|The first time)/i.test(text)) {
      return [parseEventAbility(card, text)];
    }

    return [parseDirectEffectAbility(card, text)];
  } catch (error) {
    if (isLegacySetCode(card.set.code)) {
      throw error;
    }

    return [
      staticAbility({
        text,
        effects: [],
      }),
    ];
  }
}

const LEGACY_SET_CODES = ["promo"] as const satisfies readonly StructuredSetCode[];

const LEGACY_SET_CODE_SET: ReadonlySet<string> = new Set(LEGACY_SET_CODES);

function isLegacySetCode(setCode: string): boolean {
  return LEGACY_SET_CODE_SET.has(setCode);
}

const STRUCTURED_SET_CODES = [
  "promo",
  "PRM01",
  "boxtoppersretail",
  "theheistretailstarterdeck",
  "embracingpowerretailstarterdeck",
  "welcometonightcityretail",
] as const satisfies readonly StructuredSetCode[];

const STRUCTURED_SET_CODE_SET: ReadonlySet<string> = new Set(STRUCTURED_SET_CODES);

function isStructuredSetCode(setCode: string): setCode is StructuredSetCode {
  return STRUCTURED_SET_CODE_SET.has(setCode);
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
  const programGigMatch =
    /^Play this Program for -(\d+) €\$ for each friendly Gig with (\d+)\+ value, to a minimum of (\d+) €\$\.\s*/.exec(
      text,
    );
  if (programGigMatch) {
    const modifier: CostModifier = {
      reducer: "perTargetCount",
      reductionPerCount: Number.parseInt(programGigMatch[1]!, 10),
      target: {
        selector: "gig",
        controller: "friendly",
        amount: "all",
        minValue: Number.parseInt(programGigMatch[2]!, 10),
      },
      min: Number.parseInt(programGigMatch[3]!, 10),
    };
    return { text: normalizeText(text.slice(programGigMatch[0].length)), modifier };
  }

  const unitTrashMatch =
    /^Play this Unit for -(\d+) €\$ for each Unit in your trash, to a minimum of (\d+) €\$\.\s*/i.exec(
      text,
    );
  if (unitTrashMatch) {
    const modifier: CostModifier = {
      reducer: "perTargetCount",
      reductionPerCount: Number.parseInt(unitTrashMatch[1]!, 10),
      target: cardTarget({
        controller: "friendly",
        zones: ["trash"],
        cardTypes: ["unit"],
      }),
      min: Number.parseInt(unitTrashMatch[2]!, 10),
    };
    return { text: normalizeText(text.slice(unitTrashMatch[0].length)), modifier };
  }

  const gearLegendMatch =
    /^Play this Gear for -(\d+) €\$ for each friendly face-up Legend, to a minimum of (\d+) €\$\.\s*/i.exec(
      text,
    );
  if (gearLegendMatch) {
    const modifier: CostModifier = {
      reducer: "perTargetCount",
      reductionPerCount: Number.parseInt(gearLegendMatch[1]!, 10),
      target: cardTarget({
        controller: "friendly",
        zones: ["legendArea"],
        cardTypes: ["legend"],
        face: "faceUp",
      }),
      min: Number.parseInt(gearLegendMatch[2]!, 10),
    };
    return { text: normalizeText(text.slice(gearLegendMatch[0].length)), modifier };
  }

  const rivalUnitMatch =
    /^Play this Unit for -(\d+) €\$ for each of a Rival['’]s Units, to a minimum of (\d+) €\$\.\s*/i.exec(
      text,
    );
  if (rivalUnitMatch) {
    const modifier: CostModifier = {
      reducer: "perTargetCount",
      reductionPerCount: Number.parseInt(rivalUnitMatch[1]!, 10),
      target: cardTarget({
        controller: "rival",
        zones: ["field"],
        cardTypes: ["unit"],
      }),
      min: Number.parseInt(rivalUnitMatch[2]!, 10),
    };
    return { text: normalizeText(text.slice(rivalUnitMatch[0].length)), modifier };
  }

  const emptyFixerMatch =
    /^If your fixer area is empty, play this Program for (\d+) €\$\.\s*/i.exec(text);
  if (emptyFixerMatch) {
    const modifier: CostModifier = {
      reducer: "replace",
      amount: Number.parseInt(emptyFixerMatch[1]!, 10),
      conditions: [fixerAreaEmpty()],
    };
    return { text: normalizeText(text.slice(emptyFixerMatch[0].length)), modifier };
  }

  const rivalGigLeadMatch =
    /^If a Rival controls at least (\d+) more Gigs than you, play this Program for (\d+) €\$\.\s*/i.exec(
      text,
    );
  if (rivalGigLeadMatch) {
    const modifier: CostModifier = {
      reducer: "replace",
      amount: Number.parseInt(rivalGigLeadMatch[2]!, 10),
      conditions: [rivalHasAtLeastNMoreGigs(Number.parseInt(rivalGigLeadMatch[1]!, 10))],
    };
    return { text: normalizeText(text.slice(rivalGigLeadMatch[0].length)), modifier };
  }

  return { text };
}

export function parsePromoCard(card: CardDefinition): PromoCardDefinition {
  if (card.set.code !== "promo") {
    throw new Error(`Expected a promo card, received ${card.slug} from ${card.set.code}`);
  }

  return parseStructuredCard(card) as PromoCardDefinition;
}

export function parseTheHeistRetailStarterDeckCard(
  card: CardDefinition,
): TheHeistRetailStarterDeckCardDefinition {
  if (card.set.code !== "theheistretailstarterdeck") {
    throw new Error(
      `Expected a The Heist retail starter deck card, received ${card.slug} from ${card.set.code}`,
    );
  }

  return parseStructuredCard(card) as TheHeistRetailStarterDeckCardDefinition;
}

export function parseWelcomeToNightCityRetailCard(
  card: CardDefinition,
): WelcomeToNightCityRetailCardDefinition {
  if (card.set.code !== "welcometonightcityretail") {
    throw new Error(
      `Expected a Welcome to Night City retail card, received ${card.slug} from ${card.set.code}`,
    );
  }

  return parseStructuredCard(card) as WelcomeToNightCityRetailCardDefinition;
}

export function parseStructuredCards(cards: CardDefinition[]): StructuredCardDefinition[] {
  return cards
    .filter((card) => isStructuredSetCode(card.set.code))
    .map((card) => parseStructuredCard(card));
}

export function parseStructuredSetCards<TSetCode extends StructuredSetCode>(
  cards: CardDefinition[],
  setCode: TSetCode,
): StructuredCardDefinitionBySetCode[TSetCode][] {
  return cards
    .filter(
      (
        card,
      ): card is CardDefinition & {
        set: { code: TSetCode; name: string };
      } => {
        return card.set.code === setCode;
      },
    )
    .map((card) => parseStructuredCard(card) as StructuredCardDefinitionBySetCode[TSetCode]);
}

export function parsePromoCards(cards: CardDefinition[]): PromoCardDefinition[] {
  return parseStructuredSetCards(cards, "promo");
}

export function parsePrm01Cards(cards: CardDefinition[]) {
  return parseStructuredSetCards(cards, "PRM01");
}

export function parseBoxToppersRetailCards(cards: CardDefinition[]) {
  return parseStructuredSetCards(cards, "boxtoppersretail");
}

export function parseTheHeistRetailStarterDeckCards(
  cards: CardDefinition[],
): TheHeistRetailStarterDeckCardDefinition[] {
  return parseStructuredSetCards(cards, "theheistretailstarterdeck");
}

export function parseEmbracingPowerRetailStarterDeckCards(cards: CardDefinition[]) {
  return parseStructuredSetCards(cards, "embracingpowerretailstarterdeck");
}

export function parseWelcomeToNightCityRetailCards(
  cards: CardDefinition[],
): WelcomeToNightCityRetailCardDefinition[] {
  return parseStructuredSetCards(cards, "welcometonightcityretail");
}
