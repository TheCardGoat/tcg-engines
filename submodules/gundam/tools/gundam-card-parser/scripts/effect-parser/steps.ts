import type {
  ConditionalDirective,
  Directive,
  EffectAction,
  KeywordEffect,
  TargetFilter,
} from "@tcg/gundam-types";
import { parseDuration, parseKeywordEffectName } from "./helpers.ts";
import { parseCondition } from "./conditions.ts";
import { parseSingleAction, patchActionTarget, splitClauses } from "./actions.ts";
import { parseTargetFilter } from "./target-filter.ts";
import { parseTokenSpec } from "./token-spec.ts";

// ─────────────────────────────────────────────────────────────────────────────
// Token branching
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse the complex White Base-style token branching:
 * "deploy [A] if you have 0 Units, deploy [B] if only 1, or deploy [C] if 2+"
 */
function wrapAction(action: EffectAction): Directive {
  return { action };
}

function parseTokenChoice(text: string): Directive | undefined {
  const tokenPattern = `(\\[[^\\]]+\\]\\([^)]*(?:\\([^)]*\\)[^)]*)*\\))`;
  const match = text.match(
    new RegExp(
      `deploy\\s+1\\s+${tokenPattern}\\s+(?:Unit\\s+token\\s+)?or\\s+1\\s+${tokenPattern}\\s+Unit\\s+token`,
      "i",
    ),
  );
  if (!match) return undefined;
  const first = parseTokenSpec(match[1]);
  const second = parseTokenSpec(match[2]);
  if (!first || !second) return undefined;
  return {
    kind: "chooseOne",
    options: [first, second].map((token) => ({
      label: token.name,
      directives: [wrapAction({ action: "deployToken", token })],
    })),
  };
}

export function parseTokenBranchingClause(text: string): Directive | undefined {
  // Match three branches separated by ", ... or "
  const branchPattern =
    /deploy\s+\d+\s+(\[[^\]]+\]\([^)]*(?:\([^)]*\)[^)]*)*\))\s+Unit\s+token\s+if\s+(you have\s+(?:no|only\s+\d+|\d+\s+or\s+more)\s+Units?\s+in\s+play)/gi;
  const matches = [...text.matchAll(branchPattern)];
  if (matches.length < 2) return undefined;

  interface ParsedBranch {
    condText: string;
    tokenText: string;
  }

  const parsed: ParsedBranch[] = matches.map((m) => ({
    condText: m[2],
    tokenText: m[1],
  }));

  function buildBranch(idx: number): Directive | undefined {
    if (idx >= parsed.length) return undefined;
    const { condText, tokenText } = parsed[idx];
    const cond = parseCondition(condText);
    if (!cond) return undefined;
    const spec = parseTokenSpec(tokenText);
    if (!spec) return undefined;
    const thenDirectives: Directive[] = [wrapAction({ action: "deployToken", token: spec })];
    const precedingCounts = parsed
      .slice(0, idx)
      .map(({ condText }) => parseCondition(condText))
      .filter((condition): condition is NonNullable<typeof condition> => condition !== undefined);
    // A final "2 or more" branch after explicit zero and one branches is the
    // exhaustive fallback. Represent it directly so no redundant condition is
    // evaluated after the prior branches have failed.
    if (
      idx === parsed.length - 1 &&
      cond.type === "unitCount" &&
      cond.owner === "friendly" &&
      cond.comparison === "gte" &&
      precedingCounts.length === cond.count &&
      precedingCounts.every(
        (condition, index) =>
          condition.type === "unitCount" &&
          condition.owner === "friendly" &&
          condition.comparison === "eq" &&
          condition.count === index,
      )
    ) {
      return thenDirectives[0];
    }
    const elseBranch = buildBranch(idx + 1);
    return {
      condition: cond,
      thenDirectives,
      ...(elseBranch ? { elseDirectives: [elseBranch] } : {}),
    };
  }

  return buildBranch(0);
}

// ─────────────────────────────────────────────────────────────────────────────
// Steps parsing
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse an action body string into ordered EffectSteps.
 * Handles:
 *  - "if you do, X" conditional chaining
 *  - bare "Choose N [target]" → pending target propagated to next action clause
 *  - multi-stat: "it gets AP+1 and HP+1" → two statModifier steps
 *  - stat+keyword combo: "it gets AP+1 and <Blocker>" → statModifier + grantKeyword
 */
export function parseSteps(body: string): Directive[] {
  if (!body) return [];
  const directives: Directive[] = [];
  const damageStepBattleM = body.match(
    /^Choose (\d+) enemy Unit\. Begin a battle between this Unit and it and only perform the damage step\.?$/i,
  );
  if (damageStepBattleM) {
    return [
      wrapAction({
        action: "beginDamageStepBattle",
        target: {
          owner: "opponent",
          cardType: "unit",
          zone: "battleArea",
          count: Number.parseInt(damageStepBattleM[1]!, 10),
        },
      }),
    ];
  }
  const destroyedBattleSharedDrawM = body.match(
    /^If this Unit is destroyed with battle damage, you and the player who destroyed this Unit draw (\d+)\.?$/i,
  );
  if (destroyedBattleSharedDrawM) {
    const count = Number.parseInt(destroyedBattleSharedDrawM[1]!, 10);
    return [
      wrapAction({ action: "draw", count }),
      wrapAction({ action: "drawEventDestroyer", count }),
    ];
  }
  const millThenDrawIfTraitM = body.match(
    /^Place the top (\d+) cards? of your deck into your trash\. If you place a \(([^)]+)\) card with this effect, draw (\d+)\.?$/i,
  );
  if (millThenDrawIfTraitM) {
    return [
      wrapAction({
        action: "millDeckThenDrawIfTrait",
        count: Number.parseInt(millThenDrawIfTraitM[1]!, 10),
        trait: millThenDrawIfTraitM[2]!.toLowerCase(),
        drawCount: Number.parseInt(millThenDrawIfTraitM[3]!, 10),
      }),
    ];
  }
  const chosenUnitsBattleDrawM = body.match(
    /^Choose (\d+) to (\d+) of your Units\. During this turn, when they destroy an enemy card with battle damage, draw (\d+)\.?$/i,
  );
  if (chosenUnitsBattleDrawM) {
    const [, minimum, maximum, drawCount] = chosenUnitsBattleDrawM;
    return [
      wrapAction({
        action: "createDelayedTrigger",
        duration: "thisTurn",
        eventType: "attackerDestroyedDefender",
        additionalEventTypes: ["shieldAreaCardDestroyedByBattle"],
        eventDamageType: "battle",
        oncePerSimultaneousGroup: true,
        eventCardFilter: { owner: "friendly", cardType: "unit" },
        eventSourceFilter: {
          owner: "friendly",
          cardType: "unit",
          count: { min: Number.parseInt(minimum!, 10), max: Number.parseInt(maximum!, 10) },
        },
        effect: {
          type: "triggered",
          activation: {},
          directives: [{ action: { action: "draw", count: Number.parseInt(drawCount!, 10) } }],
          sourceText: "When the chosen Unit destroys an enemy card with battle damage, draw 1.",
        },
      }),
    ];
  }
  const targetKeywordDamageM = body.match(
    /^Choose (\d+) enemy Unit\. Deal (\d+) damage to it\. If it has <([^>]+)>, deal (\d+) damage instead\.?$/i,
  );
  if (targetKeywordDamageM) {
    return [
      wrapAction({
        action: "dealDamageByTargetKeyword",
        amount: Number.parseInt(targetKeywordDamageM[2], 10),
        keyword: parseKeywordEffectName(targetKeywordDamageM[3].trim())!,
        keywordAmount: Number.parseInt(targetKeywordDamageM[4], 10),
        target: {
          owner: "opponent",
          cardType: "unit",
          count: Number.parseInt(targetKeywordDamageM[1], 10),
        },
      }),
    ];
  }
  const leadingTokenPattern = `(\\[[^\\]]+\\]\\([^)]*(?:\\([^)]*\\)[^)]*)*\\))`;
  const enemyCountTokenBranchesM = body.match(
    new RegExp(
      `^If (\\d+) to (\\d+) enemy Units? are in play, deploy (\\d+) ${leadingTokenPattern} Unit tokens?\\. If (\\d+) or more are in play, deploy (\\d+) ${leadingTokenPattern} Unit tokens?\\.?$`,
      "i",
    ),
  );
  if (enemyCountTokenBranchesM) {
    const firstToken = parseTokenSpec(enemyCountTokenBranchesM[4]);
    const secondToken = parseTokenSpec(enemyCountTokenBranchesM[7]);
    if (firstToken && secondToken) {
      const deployToken = (token: typeof firstToken, countText: string): EffectAction => ({
        action: "deployToken",
        token,
        ...(Number.parseInt(countText, 10) > 1 ? { count: Number.parseInt(countText, 10) } : {}),
      });
      return [
        {
          condition: {
            type: "and",
            conditions: [
              {
                type: "unitCount",
                owner: "opponent",
                comparison: "gte",
                count: Number.parseInt(enemyCountTokenBranchesM[1], 10),
              },
              {
                type: "unitCount",
                owner: "opponent",
                comparison: "lte",
                count: Number.parseInt(enemyCountTokenBranchesM[2], 10),
              },
            ],
          },
          thenDirectives: [wrapAction(deployToken(firstToken, enemyCountTokenBranchesM[3]))],
        },
        {
          condition: {
            type: "unitCount",
            owner: "opponent",
            comparison: "gte",
            count: Number.parseInt(enemyCountTokenBranchesM[5], 10),
          },
          thenDirectives: [wrapAction(deployToken(secondToken, enemyCountTokenBranchesM[6]))],
        },
      ];
    }
  }
  const restThenDamageByChosenUnitLevelM = body.match(
    /^Choose 1 active friendly Unit\. Rest it\. If you do, choose 1 enemy Unit whose Lv\. is equal to or lower than the Unit rested with this ability\. Deal (\d+) damage to it\.?$/i,
  );
  if (restThenDamageByChosenUnitLevelM) {
    return [
      {
        action: {
          action: "restThenDamageByChosenUnitLevel",
          amount: Number.parseInt(restThenDamageByChosenUnitLevelM[1], 10),
          referenceTarget: {
            owner: "friendly",
            cardType: "unit",
            state: "active",
            count: 1,
          },
          target: { owner: "opponent", cardType: "unit", count: 1 },
        },
      },
    ];
  }
  const optionalRestThenDamageAllByChosenUnitLevelM = body.match(
    /^You may choose (1 of your other active(?: \([^)]+\))? Units)\. Rest it\. If you do, deal (\d+) damage to all enemy Units whose Lv\. is equal to or lower than that Unit\.?$/i,
  );
  if (optionalRestThenDamageAllByChosenUnitLevelM) {
    return [
      {
        action: {
          action: "restThenDamageByChosenUnitLevel",
          amount: Number.parseInt(optionalRestThenDamageAllByChosenUnitLevelM[2], 10),
          referenceTarget: parseTargetFilter(optionalRestThenDamageAllByChosenUnitLevelM[1]),
          target: { owner: "opponent", cardType: "unit", count: "all" },
        },
        optional: true,
      },
    ];
  }
  const pairedPilotBattleDamageThresholdM = body.match(
    /^Choose 1 friendly Unit paired with an \(([^)]+)\) Pilot\. It can['’]t receive battle damage from enemy Units with (\d+) or less AP during this battle\. If you are Lv\.(\d+) or higher, it can['’]t receive battle damage from enemy Units with (\d+) or less AP instead\.?$/i,
  );
  if (pairedPilotBattleDamageThresholdM) {
    const [, trait, ordinaryMaximumAp, requiredLevel, broaderMaximumAp] =
      pairedPilotBattleDamageThresholdM;
    const target = {
      owner: "friendly" as const,
      cardType: "unit" as const,
      count: 1,
      attributeFilters: [
        {
          attribute: "pairedPilotTrait" as const,
          comparison: "includes" as const,
          value: trait!.toLowerCase(),
        },
      ],
    };
    const preventDamage = (maximumAp: string): EffectAction => ({
      action: "preventDamage",
      damageType: "battle",
      duration: "thisBattle",
      target,
      unitFilter: {
        owner: "opponent",
        cardType: "unit",
        attributeFilters: [
          { attribute: "ap", comparison: "lte", value: Number.parseInt(maximumAp, 10) },
        ],
      },
    });
    return [
      wrapAction(preventDamage(ordinaryMaximumAp!)),
      {
        condition: {
          type: "playerLevel",
          comparison: "gte",
          value: Number.parseInt(requiredLevel!, 10),
        },
        thenDirectives: [wrapAction(preventDamage(broaderMaximumAp!))],
      },
    ];
  }
  const damageThenDrawIfDestroyedM = body.match(
    /^Choose (\d+ rested enemy Unit)\. Deal (\d+) damage to it\. When this effect destroys an enemy Unit, draw (\d+)\.?$/i,
  );
  if (damageThenDrawIfDestroyedM) {
    return [
      {
        action: {
          action: "dealDamageThenDrawIfDestroyed",
          amount: Number.parseInt(damageThenDrawIfDestroyedM[2], 10),
          target: parseTargetFilter(damageThenDrawIfDestroyedM[1]),
          drawCount: Number.parseInt(damageThenDrawIfDestroyedM[3], 10),
        },
      },
    ];
  }
  const selfStatModifierByRestedTraitCountM = body.match(
    /^This Unit gets (AP|HP)([+-]\d+) for each of your rested \(([^)]+)\) Units\.?$/i,
  );
  if (selfStatModifierByRestedTraitCountM) {
    return [
      {
        action: {
          action: "statModifierByCount",
          countFilter: {
            owner: "friendly",
            cardType: "unit",
            state: "rested",
            attributeFilters: [
              {
                attribute: "trait",
                comparison: "includes",
                value: selfStatModifierByRestedTraitCountM[3].toLowerCase(),
              },
            ],
          },
          stat: selfStatModifierByRestedTraitCountM[1].toLowerCase() as "ap" | "hp",
          amountPerMatch: Number.parseInt(selfStatModifierByRestedTraitCountM[2], 10),
          duration: "permanent",
          target: { owner: "self", cardType: "unit" },
        },
      },
    ];
  }
  const pairedPilotAttackTargetPermissionM = body.match(
    /^Choose (\d+ of your Units paired with an? \([^)]+\) Pilot)\. During this turn, it may choose (an? active enemy Unit that is Lv\.\d+ or lower) as its attack target\.?$/i,
  );
  if (pairedPilotAttackTargetPermissionM) {
    return [
      {
        action: {
          action: "chooseAttackTarget",
          unit: parseTargetFilter(pairedPilotAttackTargetPermissionM[1]),
          attackTarget: parseTargetFilter(pairedPilotAttackTargetPermissionM[2]),
          duration: "thisTurn",
        },
      },
    ];
  }
  const conditionalDrawThenDiscardM = body.match(
    /^If (.+?), draw (\d+)\. Then, discard (\d+)\.?$/i,
  );
  if (conditionalDrawThenDiscardM) {
    const condition = parseCondition(conditionalDrawThenDiscardM[1]);
    if (condition) {
      return [
        {
          condition,
          thenDirectives: [
            {
              action: {
                action: "drawThenDiscard",
                drawCount: Number.parseInt(conditionalDrawThenDiscardM[2], 10),
                discardCount: Number.parseInt(conditionalDrawThenDiscardM[3], 10),
              },
            },
          ],
        },
      ];
    }
  }
  const destroyTopOpponentShieldsM = body.match(
    /^Choose 1 enemy player\. Destroy the first (\d+) cards? in that player['’]s shield area\.?$/i,
  );
  if (destroyTopOpponentShieldsM) {
    return [
      {
        action: {
          action: "destroyTopOpponentShields",
          count: Number.parseInt(destroyTopOpponentShieldsM[1], 10),
        },
      },
    ];
  }
  const recoverThenDrawIfPairedPilotLevelM = body.match(
    /^Choose (\d+ friendly .+? Unit)\. It recovers (\d+) HP\. Then, if it is paired with a Pilot that is Lv\.(\d+) or lower, draw (\d+)\.?$/i,
  );
  if (recoverThenDrawIfPairedPilotLevelM) {
    const [, targetText, recoveryAmount, maximumPilotLevel, drawCount] =
      recoverThenDrawIfPairedPilotLevelM;
    const target = parseTargetFilter(targetText!);
    return [
      {
        action: {
          action: "recoverHP",
          amount: Number.parseInt(recoveryAmount!, 10),
          target,
        },
      },
      {
        action: {
          action: "drawIfTargetMatches",
          count: Number.parseInt(drawCount!, 10),
          target: {
            ...target,
            attributeFilters: [
              ...(target.attributeFilters ?? []),
              {
                attribute: "pairedPilotLevel",
                comparison: "lte",
                value: Number.parseInt(maximumPilotLevel!, 10),
              },
            ],
          },
        },
      },
    ];
  }
  const millThenDamageByTraitCountM = body.match(
    /^Place the top (\d+) cards of your deck into your trash\. If you do, choose 1 enemy Unit with (\d+) or less AP\. Deal an amount of damage equal to the number of \(([^)]+)\) cards placed with this effect to that enemy Unit\.?$/i,
  );
  if (millThenDamageByTraitCountM) {
    const [, count, maximumAp, trait] = millThenDamageByTraitCountM;
    return [
      {
        action: {
          action: "millDeckThenDamageByTraitCount",
          count: Number.parseInt(count!, 10),
          owner: "self",
          traits: trait!.toLowerCase(),
          target: {
            owner: "opponent",
            cardType: "unit",
            count: 1,
            attributeFilters: [
              {
                attribute: "ap",
                comparison: "lte",
                value: Number.parseInt(maximumAp!, 10),
              },
            ],
          },
        },
      },
    ];
  }
  // Recovering from trash changes the legal discard candidates: the recovered
  // card may itself be discarded. Keep the two printed sentences atomic so
  // the runtime opens the discard prompt only after the recovery resolves.
  const addFromTrashThenDiscardM = body.match(
    /^You may choose (\d+\s+.+?) from your trash and add it to your hand\. If you do, discard (\d+)\.?$/i,
  );
  if (addFromTrashThenDiscardM) {
    const target = parseTargetFilter(`${addFromTrashThenDiscardM[1]} from your trash`);
    return [
      {
        action: {
          action: "addFromTrashThenDiscard",
          target: { ...target, owner: "friendly", zone: "trash" },
          discardCount: Number.parseInt(addFromTrashThenDiscardM[2], 10),
        },
        optional: true,
      },
    ];
  }
  const chooseAddFromTrashThenDiscardM = body.match(
    /^Choose (\d+\s+.+?) from your trash\. Add it to your hand\. If you do, discard (\d+)\.?$/i,
  );
  if (chooseAddFromTrashThenDiscardM) {
    const target = parseTargetFilter(`${chooseAddFromTrashThenDiscardM[1]} from your trash`);
    return [
      {
        action: {
          action: "resolveThenQueue",
          first: {
            action: "addFromTrash",
            target: { ...target, owner: "friendly", zone: "trash" },
          },
          followUp: {
            type: "triggered",
            activation: {},
            directives: [
              {
                action: {
                  action: "discard",
                  count: Number.parseInt(chooseAddFromTrashThenDiscardM[2], 10),
                },
              },
            ],
            sourceText: `Then, discard ${chooseAddFromTrashThenDiscardM[2]}.`,
          },
        },
      },
    ];
  }
  const returnPairedPilotThenDiscardM = body.match(
    /^Return this Unit's paired Pilot to its owner's hand\. Then, discard (\d+)\.?$/i,
  );
  if (returnPairedPilotThenDiscardM) {
    return [
      {
        action: {
          action: "resolveThenQueue",
          first: { action: "returnPairedPilotToHand" },
          followUp: {
            type: "triggered",
            activation: { timing: [] },
            directives: [
              {
                action: {
                  action: "discard",
                  count: Number.parseInt(returnPairedPilotThenDiscardM[1], 10),
                },
              },
            ],
            sourceText: `Then, discard ${returnPairedPilotThenDiscardM[1]}.`,
          },
        },
      },
    ];
  }
  const exileFromTrashThenDamageStepBattleM = body.match(
    /^You may choose (\d+\s+.+?) from your trash\. Exile (?:it|them) from the game\. If you do, choose (\d+) enemy Unit\. Begin a battle between this Unit and it and only perform the damage step\.?$/i,
  );
  if (exileFromTrashThenDamageStepBattleM) {
    const target = parseTargetFilter(`${exileFromTrashThenDamageStepBattleM[1]} from your trash`);
    const enemyCount = Number.parseInt(exileFromTrashThenDamageStepBattleM[2]!, 10);
    return [
      {
        action: {
          action: "resolveThenQueue",
          first: { action: "exile", target: { ...target, owner: "friendly", zone: "trash" } },
          followUp: {
            type: "triggered",
            activation: { timing: [] },
            directives: [
              wrapAction({
                action: "beginDamageStepBattle",
                target: {
                  owner: "opponent",
                  cardType: "unit",
                  zone: "battleArea",
                  count: enemyCount,
                },
              }),
            ],
            sourceText: `If you do, choose ${enemyCount} enemy Unit. Begin a battle between this Unit and it and only perform the damage step.`,
          },
        },
        optional: true,
      },
    ];
  }
  const exileFromTrashThenFollowUpM = body.match(
    /^You may choose (\d+\s+.+?) from your trash\. Exile (?:it|them) from the game\. If you do, (choose \d+ .+?\. It gets (?:AP|HP)[+-]\d+ during this turn\.?)$/i,
  );
  if (exileFromTrashThenFollowUpM) {
    const target = parseTargetFilter(`${exileFromTrashThenFollowUpM[1]} from your trash`);
    const sourceText = `If you do, ${exileFromTrashThenFollowUpM[2]}`;
    return [
      {
        action: {
          action: "resolveThenQueue",
          first: { action: "exile", target: { ...target, owner: "friendly", zone: "trash" } },
          followUp: {
            type: "triggered",
            activation: { timing: [] },
            directives: parseSteps(exileFromTrashThenFollowUpM[2]),
            sourceText,
          },
        },
        optional: true,
      },
    ];
  }
  const exileFromTrashThenAddFromTrashM = body.match(
    /^You may choose (\d+\s+.+?) from your trash\. Exile (?:it|them) from the game\. If you do, choose (\d+\s+.+?) from your trash\. Add it to your hand\.?$/i,
  );
  if (exileFromTrashThenAddFromTrashM) {
    const exileTarget = parseTargetFilter(`${exileFromTrashThenAddFromTrashM[1]} from your trash`);
    const addTarget = parseTargetFilter(`${exileFromTrashThenAddFromTrashM[2]} from your trash`);
    return [
      {
        action: {
          action: "resolveThenQueue",
          first: {
            action: "exile",
            target: { ...exileTarget, owner: "friendly", zone: "trash" },
          },
          followUp: {
            type: "triggered",
            activation: { timing: [] },
            directives: [
              {
                action: {
                  action: "addFromTrash",
                  target: { ...addTarget, owner: "friendly", zone: "trash" },
                },
              },
            ],
            sourceText: `If you do, choose ${exileFromTrashThenAddFromTrashM[2]} from your trash. Add it to your hand.`,
          },
        },
        optional: true,
      },
    ];
  }
  const restFriendlyUnitsThenDamageM = body.match(
    /^Choose (\d+) of your active Units\. Rest them\. If you do, choose (\d+) enemy Unit\. Deal (\d+) damage to it\.?$/i,
  );
  if (restFriendlyUnitsThenDamageM) {
    const friendlyCount = Number.parseInt(restFriendlyUnitsThenDamageM[1], 10);
    const enemyCount = Number.parseInt(restFriendlyUnitsThenDamageM[2], 10);
    const damage = Number.parseInt(restFriendlyUnitsThenDamageM[3], 10);
    return [
      {
        action: {
          action: "resolveThenQueue",
          first: {
            action: "rest",
            target: {
              owner: "friendly",
              cardType: "unit",
              state: "active",
              count: friendlyCount,
            },
          },
          followUp: {
            type: "triggered",
            activation: { timing: [] },
            directives: [
              {
                action: {
                  action: "dealDamage",
                  amount: damage,
                  target: { owner: "opponent", cardType: "unit", count: enemyCount },
                },
              },
            ],
            sourceText: `If you do, choose ${enemyCount} enemy Unit. Deal ${damage} damage to it.`,
          },
        },
      },
    ];
  }
  const damagedLowLevelKeywordM = body.match(
    /^If this Unit is damaged and Lv\.?(\d+) or lower, it gains <([\w\s-]+?)(?:\s+(\d+))?>\s*(?:during this (turn|battle))?\.?(?:\s*\(.*\))?$/i,
  );
  if (damagedLowLevelKeywordM) {
    const keyword = parseKeywordEffectName(damagedLowLevelKeywordM[2]);
    if (keyword) {
      return [
        {
          condition: { type: "selfIsDamaged" },
          thenDirectives: [
            {
              action: {
                action: "grantKeyword",
                keyword,
                ...(damagedLowLevelKeywordM[3]
                  ? { keywordValue: Number.parseInt(damagedLowLevelKeywordM[3], 10) }
                  : {}),
                duration: parseDuration(body),
                target: {
                  owner: "self",
                  cardType: "unit",
                  attributeFilters: [
                    {
                      attribute: "level",
                      comparison: "lte",
                      value: Number.parseInt(damagedLowLevelKeywordM[1], 10),
                    },
                  ],
                },
              },
            },
          ],
        },
      ];
    }
  }
  const destroySelfThenDamageM = body.match(
    /^Destroy this(?: Unit| card)? and choose (1 .+?)\. Deal (\d+) damage to it\.?$/i,
  );
  if (destroySelfThenDamageM) {
    return [
      { action: { action: "destroy", target: { owner: "self", cardType: "unit", count: 1 } } },
      {
        action: {
          action: "dealDamage",
          amount: Number.parseInt(destroySelfThenDamageM[2], 10),
          target: parseTargetFilter(destroySelfThenDamageM[1]),
        },
      },
    ];
  }
  const mixedOwnerDamageM = body.match(
    /^Choose (1 (?:of your|friendly).+?Units?) and (1 enemy Unit)\. Deal (\d+) damage to them\.?$/i,
  );
  if (mixedOwnerDamageM) {
    const amount = Number.parseInt(mixedOwnerDamageM[3], 10);
    return [
      {
        action: {
          action: "dealDamage",
          amount,
          target: parseTargetFilter(mixedOwnerDamageM[1]),
        },
      },
      {
        action: {
          action: "dealDamage",
          amount,
          target: parseTargetFilter(mixedOwnerDamageM[2]),
        },
      },
    ];
  }
  const damageBySourceStatM = body.match(
    /^Choose (.+?)\. Deal (\d+) damage to it for each (\d+) (AP|HP) this Unit has\.?$/i,
  );
  if (damageBySourceStatM) {
    return [
      {
        action: {
          action: "dealDamageBySourceStat",
          stat: damageBySourceStatM[4]!.toLowerCase() as "ap" | "hp",
          divisor: Number.parseInt(damageBySourceStatM[3], 10),
          damagePerStep: Number.parseInt(damageBySourceStatM[2], 10),
          target: parseTargetFilter(damageBySourceStatM[1]!),
        },
      },
    ];
  }
  // A single "choose ... and ... Rest them" instruction can name two card
  // types. Keep each choice independent instead of collapsing the second
  // target over the first. Unlike Units, Bases and Pilots need not be active
  // for their selected rest action to remain a legal no-op.
  const mixedOwnerNonUnitRestM = body.match(
    /^(You may )?choose (\d+ .*?\b(?:of your|friendly)\b (?:.+? )?(?:Bases?|Pilots?)) and (\d+ enemy Units?(?: (?:that is|with) .+?)?)\. Rest them\.?$/i,
  );
  if (mixedOwnerNonUnitRestM) {
    const optional = mixedOwnerNonUnitRestM[1] !== undefined;
    return [
      {
        action: { action: "rest", target: parseTargetFilter(mixedOwnerNonUnitRestM[2]!) },
        ...(optional ? { optional: true } : {}),
      },
      {
        action: { action: "rest", target: parseTargetFilter(mixedOwnerNonUnitRestM[3]!) },
        ...(optional ? { sharesTargetChoiceWithPrevious: true } : {}),
      },
    ];
  }

  // A single "choose ... and ... Rest them" instruction creates two target
  // groups.  Do not collapse it into one target filter: ownership and the
  // friendly card's printed qualifications are independently meaningful.
  const mixedOwnerRestM = body.match(
    /^(You may )?choose (\d+ .*?\b(?:of your|friendly)\b .*?Units?(?: with .+?)?) and (\d+ enemy Units?(?: that is .+?)?)\. Rest them\.?$/i,
  );
  if (mixedOwnerRestM) {
    const optional = mixedOwnerRestM[1] !== undefined;
    // Resting a chosen Unit requires it to be active.  This is implicit in
    // the printed imperative even when only the other target group explicitly
    // says "active"; keep both independently chosen groups legal at
    // resolution time.
    const restTarget = (text: string) => ({
      ...parseTargetFilter(text),
      state: "active" as const,
    });
    return [
      {
        action: { action: "rest", target: restTarget(mixedOwnerRestM[2]!) },
        ...(optional ? { optional: true } : {}),
      },
      {
        action: { action: "rest", target: restTarget(mixedOwnerRestM[3]!) },
        ...(optional ? { sharesTargetChoiceWithPrevious: true } : {}),
      },
    ];
  }
  const tokenPattern = `(\\[[^\\]]+\\]\\([^)]*(?:\\([^)]*\\)[^)]*)*\\))`;
  const deployTokenM = body.match(
    new RegExp(`^Deploy\\s+(\\d+)\\s+(rested\\s+)?${tokenPattern}\\s+Unit\\s+tokens?\\.?$`, "i"),
  );
  if (deployTokenM) {
    const token = parseTokenSpec(`${deployTokenM[2] ?? ""}${deployTokenM[3]}`);
    if (token) {
      return [
        {
          action: {
            action: "deployToken",
            token,
            ...(Number.parseInt(deployTokenM[1], 10) > 1
              ? { count: Number.parseInt(deployTokenM[1], 10) }
              : {}),
          },
        },
      ];
    }
  }
  const dualRestedTokenM = body.match(
    new RegExp(
      `^Deploy\\s+1\\s+rested\\s+${tokenPattern}\\s+Unit token and 1 rested\\s+${tokenPattern}\\s+Unit token\\.?$`,
      "i",
    ),
  );
  if (dualRestedTokenM) {
    const first = parseTokenSpec(`rested ${dualRestedTokenM[1]}`);
    const second = parseTokenSpec(`rested ${dualRestedTokenM[2]}`);
    if (first && second) {
      return [
        { action: { action: "deployToken", token: first } },
        { action: { action: "deployToken", token: second } },
      ];
    }
  }
  const optionalEnemyAndSelfDamageM = body.match(
    /^You may choose (1 enemy Unit)\. Deal (\d+) damage to it and this Unit\.?$/i,
  );
  if (optionalEnemyAndSelfDamageM) {
    const amount = Number.parseInt(optionalEnemyAndSelfDamageM[2], 10);
    return [
      {
        action: {
          action: "dealDamage",
          amount,
          target: parseTargetFilter(optionalEnemyAndSelfDamageM[1]),
        },
        optional: true,
      },
      {
        action: {
          action: "dealDamage",
          amount,
          target: { owner: "self", cardType: "unit" },
        },
        dependsOnPrevious: true,
      },
    ];
  }
  const statReductionByTrashNameM = body.match(
    /^Choose (1 enemy Unit that is Lv\.\d+ or lower)\. During this turn, reduce its (AP|HP) by an amount equal to the number of (Unit|Pilot|Command|Base) cards with "([^"]+)" in their card names in your trash\.?$/i,
  );
  if (statReductionByTrashNameM) {
    return [
      {
        action: {
          action: "statModifierByCount",
          countFilter: {
            owner: "friendly",
            cardType: statReductionByTrashNameM[3].toLowerCase() as
              | "unit"
              | "pilot"
              | "command"
              | "base",
            zone: "trash",
            attributeFilters: [
              {
                attribute: "name",
                comparison: "includes",
                value: statReductionByTrashNameM[4],
              },
            ],
          },
          stat: statReductionByTrashNameM[2].toLowerCase() as "ap" | "hp",
          amountPerMatch: -1,
          duration: "thisTurn",
          target: parseTargetFilter(statReductionByTrashNameM[1]),
        },
      },
    ];
  }
  const statModifierByTrashTraitM = body.match(
    /^Choose (.+?)\. For each (?:\(([^)]+)\) )?(Unit|Pilot|Command|Base) card in your trash, it gets (AP|HP)([+-]\d+) during this turn\.?$/i,
  );
  if (statModifierByTrashTraitM) {
    return [
      {
        action: {
          action: "statModifierByCount",
          countFilter: {
            owner: "friendly",
            cardType: statModifierByTrashTraitM[3].toLowerCase() as
              | "unit"
              | "pilot"
              | "command"
              | "base",
            zone: "trash",
            ...(statModifierByTrashTraitM[2]
              ? {
                  attributeFilters: [
                    {
                      attribute: "trait" as const,
                      comparison: "includes" as const,
                      value: statModifierByTrashTraitM[2].toLowerCase(),
                    },
                  ],
                }
              : {}),
          },
          stat: statModifierByTrashTraitM[4].toLowerCase() as "ap" | "hp",
          amountPerMatch: Number.parseInt(statModifierByTrashTraitM[5], 10),
          duration: "thisTurn",
          target: parseTargetFilter(statModifierByTrashTraitM[1]),
        },
      },
    ];
  }
  const restThenOptionalKeywordM = body.match(
    /^Choose (1 enemy Unit with \d+ or less HP)\. Rest it\. Then, you may choose (1 of your Units with "[^"]+" in its card name)\. It gets <([^>]+)> during this turn\./i,
  );
  if (restThenOptionalKeywordM) {
    const optionalTarget = parseTargetFilter(restThenOptionalKeywordM[2]);
    optionalTarget.count = { min: 0, max: 1 };
    return [
      {
        action: {
          action: "rest",
          target: parseTargetFilter(restThenOptionalKeywordM[1]),
        },
      },
      {
        action: {
          action: "grantKeyword",
          keyword: parseKeywordEffectName(restThenOptionalKeywordM[3])!,
          duration: "thisTurn",
          target: optionalTarget,
        },
      },
    ];
  }
  const chooseTwoTraitTrashExileReadyM = body.match(
    /^Choose (\d+) \(([^)]+)\) card and (\d+) \(([^)]+)\) card from your trash\. Exile them from the game\. If you do, set this Unit as active\. It can't attack during this turn\.?$/i,
  );
  if (chooseTwoTraitTrashExileReadyM) {
    const firstTarget = {
      owner: "friendly" as const,
      zone: "trash" as const,
      count: Number.parseInt(chooseTwoTraitTrashExileReadyM[1], 10),
      attributeFilters: [
        {
          attribute: "trait" as const,
          comparison: "includes" as const,
          value: chooseTwoTraitTrashExileReadyM[2].toLowerCase(),
        },
      ],
    };
    const secondTarget = {
      owner: "friendly" as const,
      zone: "trash" as const,
      count: Number.parseInt(chooseTwoTraitTrashExileReadyM[3], 10),
      attributeFilters: [
        {
          attribute: "trait" as const,
          comparison: "includes" as const,
          value: chooseTwoTraitTrashExileReadyM[4].toLowerCase(),
        },
      ],
    };
    return [
      { action: { action: "exile", target: firstTarget } },
      {
        action: { action: "exile", target: secondTarget },
        dependsOnPrevious: true,
        sharesTargetChoiceWithPrevious: true,
      },
      {
        action: {
          action: "setActive",
          target: { owner: "self", cardType: "unit" },
        },
        dependsOnPrevious: true,
      },
      {
        action: {
          action: "cantAttack",
          duration: "thisTurn",
          target: { owner: "self", cardType: "unit" },
        },
        dependsOnPrevious: true,
      },
    ];
  }
  const deployRestedByNamedFriendlyUnitsM = body.match(
    /^Count up the number of your Units with "([^"]+)"\/"([^"]+)" in their card name, plus this Unit\. All enemy Units whose Lv\. is equal to or lower than that number are deployed rested\.?$/i,
  );
  if (deployRestedByNamedFriendlyUnitsM) {
    return [
      {
        action: {
          action: "deployRestedByFriendlyNameCount",
          names: [deployRestedByNamedFriendlyUnitsM[1]!, deployRestedByNamedFriendlyUnitsM[2]!],
          target: { owner: "opponent", cardType: "unit", isToken: false, count: "all" },
        },
      },
    ];
  }
  const exileSelfThenDeployNamedBaseM = body.match(
    /^You may exile this card in your trash from the game\. If you do, you may deploy 1 Base card with "([^"]+)" in its card name from your hand\.?$/i,
  );
  if (exileSelfThenDeployNamedBaseM) {
    return [
      { action: { action: "exileSelf" }, optional: true },
      {
        action: {
          action: "deploy",
          target: {
            owner: "friendly",
            cardType: "base",
            zone: "hand",
            count: 1,
            attributeFilters: [
              {
                attribute: "name",
                comparison: "includes",
                value: exileSelfThenDeployNamedBaseM[1]!,
              },
            ],
          },
        },
        optional: true,
        dependsOnPrevious: true,
      },
    ];
  }
  const optionalNamedPilotPairM = body.match(
    /^You may pair 1 Pilot card with "([^"]+)" in its card name from your hand with this Unit\.?$/i,
  );
  if (optionalNamedPilotPairM) {
    return [
      {
        action: {
          action: "pairPilot",
          target: {
            owner: "friendly",
            cardType: "pilot",
            zone: "hand",
            count: 1,
            attributeFilters: [
              {
                attribute: "name",
                comparison: "includes",
                value: optionalNamedPilotPairM[1]!,
              },
            ],
          },
        },
        optional: true,
      },
    ];
  }
  const returnThenNamedTrashBlockerM = body.match(
    /^Choose 1 rested enemy Unit that is Lv\.(\d+) or lower\. Return it to its owner's hand\. Then, if there are (\d+) or more cards with "([^"]+)" in their card name in your trash, you may choose 1 friendly Unit\. It gains <Blocker> during this turn\.?\s*(?:\(Rest this Unit to change the attack target to it\.\))?$/i,
  );
  if (returnThenNamedTrashBlockerM) {
    const [, maximumLevel, requiredCount, name] = returnThenNamedTrashBlockerM;
    return [
      wrapAction({
        action: "returnToHand",
        target: {
          owner: "opponent",
          cardType: "unit",
          state: "rested",
          count: 1,
          attributeFilters: [
            { attribute: "level", comparison: "lte", value: Number.parseInt(maximumLevel!, 10) },
          ],
        },
      }),
      {
        condition: {
          type: "cardInZone",
          owner: "friendly",
          zone: "trash",
          cardType: "command",
          comparison: "gte",
          count: Number.parseInt(requiredCount!, 10),
          hasName: name!,
        },
        thenDirectives: [
          {
            action: {
              action: "grantKeyword",
              keyword: "Blocker",
              duration: "thisTurn",
              target: { owner: "friendly", cardType: "unit", count: 1 },
            },
            optional: true,
          },
        ],
      },
    ];
  }
  const namedTrashBroadensDamageTargetM = body.match(
    /^Choose 1 enemy Unit that is Lv\.(\d+) or lower\. Deal (\d+) damage to it\. If there are (\d+) or more cards with "([^"]+)" in their card name in your trash, choose 1 enemy Unit instead\.?$/i,
  );
  if (namedTrashBroadensDamageTargetM) {
    const [, maximumLevel, damage, requiredCount, name] = namedTrashBroadensDamageTargetM;
    const damageAction = (target: TargetFilter): EffectAction => ({
      action: "dealDamage",
      amount: Number.parseInt(damage!, 10),
      target,
    });
    return [
      {
        condition: {
          type: "cardInZone",
          owner: "friendly",
          zone: "trash",
          cardType: "command",
          comparison: "gte",
          count: Number.parseInt(requiredCount!, 10),
          hasName: name!,
        },
        thenDirectives: [
          wrapAction(damageAction({ owner: "opponent", cardType: "unit", count: 1 })),
        ],
        elseDirectives: [
          wrapAction(
            damageAction({
              owner: "opponent",
              cardType: "unit",
              count: 1,
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: Number.parseInt(maximumLevel!, 10),
                },
              ],
            }),
          ),
        ],
      },
    ];
  }
  const linkUnitBroadensReturnTargetM = body.match(
    /^Choose 1 enemy Unit with (\d+) or less HP\. Return it to its owner's hand\. If you have a Link Unit in play, choose 1 enemy Unit with (\d+) or less HP instead\.?$/i,
  );
  if (linkUnitBroadensReturnTargetM) {
    const [, ordinaryMaximumHp, linkedMaximumHp] = linkUnitBroadensReturnTargetM;
    const returnAction = (maximumHp: string): EffectAction => ({
      action: "returnToHand",
      target: {
        owner: "opponent",
        cardType: "unit",
        count: 1,
        attributeFilters: [
          { attribute: "hp", comparison: "lte", value: Number.parseInt(maximumHp, 10) },
        ],
      },
    });
    return [
      {
        condition: {
          type: "unitCount",
          owner: "friendly",
          comparison: "gte",
          count: 1,
          isLinkUnit: true,
        },
        thenDirectives: [wrapAction(returnAction(linkedMaximumHp!))],
        elseDirectives: [wrapAction(returnAction(ordinaryMaximumHp!))],
      },
    ];
  }
  const traitLinkBroadensRestTargetM = body.match(
    /^Choose 1 enemy Unit with (\d+) or less HP\. Rest it\. If a friendly \(([^)]+)\) Link Unit is in play, choose (\d+) to (\d+) enemy Units with (\d+) or less HP instead\.?$/i,
  );
  if (traitLinkBroadensRestTargetM) {
    const [, ordinaryMaximumHp, trait, minimumCount, maximumCount, linkedMaximumHp] =
      traitLinkBroadensRestTargetM;
    const restAction = (maximumHp: string, count: TargetFilter["count"]): EffectAction => ({
      action: "rest",
      target: {
        owner: "opponent",
        cardType: "unit",
        count,
        attributeFilters: [
          { attribute: "hp", comparison: "lte", value: Number.parseInt(maximumHp, 10) },
        ],
      },
    });
    return [
      {
        condition: {
          type: "unitCount",
          owner: "friendly",
          comparison: "gte",
          count: 1,
          hasTrait: trait!.toLowerCase(),
          isLinkUnit: true,
        },
        thenDirectives: [
          wrapAction(
            restAction(linkedMaximumHp!, {
              min: Number.parseInt(minimumCount!, 10),
              max: Number.parseInt(maximumCount!, 10),
            }),
          ),
        ],
        elseDirectives: [wrapAction(restAction(ordinaryMaximumHp!, 1))],
      },
    ];
  }
  const trashCountBroadensDestroyTargetM = body.match(
    /^Choose 1 active enemy Unit that is Lv\.(\d+) or lower\. Destroy it\. If there are (\d+) or more cards in your trash, choose 1 active enemy Unit that is Lv\.(\d+) or lower instead\.?$/i,
  );
  if (trashCountBroadensDestroyTargetM) {
    const [, ordinaryMaximumLevel, requiredTrashCount, broaderMaximumLevel] =
      trashCountBroadensDestroyTargetM;
    const destroyAction = (maximumLevel: string): EffectAction => ({
      action: "destroy",
      target: {
        owner: "opponent",
        cardType: "unit",
        state: "active",
        count: 1,
        attributeFilters: [
          { attribute: "level", comparison: "lte", value: Number.parseInt(maximumLevel, 10) },
        ],
      },
    });
    return [
      {
        condition: {
          type: "cardInZone",
          owner: "friendly",
          zone: "trash",
          comparison: "gte",
          count: Number.parseInt(requiredTrashCount!, 10),
        },
        thenDirectives: [wrapAction(destroyAction(broaderMaximumLevel!))],
        elseDirectives: [wrapAction(destroyAction(ordinaryMaximumLevel!))],
      },
    ];
  }
  const addShieldThenMixedOwnerRestM = body.match(
    /^Add 1 of your Shields to your hand\. Then, (You may )?choose (\d+ .*?\b(?:of your|friendly)\b .+?Units?) and (\d+ enemy Units?)\. Rest them\.?$/i,
  );
  if (addShieldThenMixedOwnerRestM) {
    const optional = addShieldThenMixedOwnerRestM[1] !== undefined;
    return [
      { action: { action: "addShieldToHand", count: 1 } },
      {
        action: { action: "rest", target: parseTargetFilter(addShieldThenMixedOwnerRestM[2]!) },
        ...(optional ? { optional: true } : {}),
      },
      {
        action: { action: "rest", target: parseTargetFilter(addShieldThenMixedOwnerRestM[3]!) },
        ...(optional ? { sharesTargetChoiceWithPrevious: true } : {}),
      },
    ];
  }
  const addShieldThenTargetM = body.match(
    /^Add 1 of your Shields to your hand\. Then, choose 1 enemy Unit with (\d+) or less HP\. (Rest it|Return it to its owner's hand)\.?$/i,
  );
  if (addShieldThenTargetM) {
    const [, maximumHp, consequence] = addShieldThenTargetM;
    const target = {
      owner: "opponent" as const,
      cardType: "unit" as const,
      count: 1,
      attributeFilters: [
        {
          attribute: "hp" as const,
          comparison: "lte" as const,
          value: Number.parseInt(maximumHp!, 10),
        },
      ],
    };
    const action: EffectAction = consequence!.toLowerCase().startsWith("rest")
      ? { action: "rest", target }
      : { action: "returnToHand", target };
    return [
      {
        action: {
          action: "resolveThenQueue",
          first: { action: "addShieldToHand", count: 1 },
          followUp: {
            type: "triggered",
            activation: { timing: [] },
            directives: [wrapAction(action)],
            sourceText: `Then, choose 1 enemy Unit with ${maximumHp} or less HP. ${consequence}.`,
          },
        },
      },
    ];
  }
  const addShieldThenConditionalDeployM = body.match(
    /^Add 1 of your Shields to your hand\. Then, if it is your turn, you may deploy 1 \(([^)]+)\) Unit card that is Lv\.(\d+) or lower from your hand\.?$/i,
  );
  if (addShieldThenConditionalDeployM) {
    const [, trait, maximumLevel] = addShieldThenConditionalDeployM;
    return [
      {
        action: {
          action: "resolveThenQueue",
          first: { action: "addShieldToHand", count: 1 },
          followUp: {
            type: "triggered",
            activation: { timing: [] },
            directives: [
              {
                condition: { type: "isTurn", whose: "friendly" },
                thenDirectives: [
                  {
                    action: {
                      action: "deploy",
                      target: {
                        owner: "friendly",
                        zone: "hand",
                        cardType: "unit",
                        count: 1,
                        attributeFilters: [
                          {
                            attribute: "trait",
                            comparison: "includes",
                            value: trait!.toLowerCase(),
                          },
                          {
                            attribute: "level",
                            comparison: "lte",
                            value: Number.parseInt(maximumLevel!, 10),
                          },
                        ],
                      },
                    },
                    optional: true,
                  },
                ],
              },
            ],
            sourceText: `Then, if it is your turn, you may deploy 1 (${trait}) Unit card that is Lv.${maximumLevel} or lower from your hand.`,
          },
        },
      },
    ];
  }
  const drawThenNamedTrashRestM = body.match(
    /^Draw (\d+)\. Then, if there are (\d+) or more cards with "([^"]+)" in their card name in your trash, choose 1 enemy Unit with (\d+) or less HP\. Rest it\.?$/i,
  );
  if (drawThenNamedTrashRestM) {
    const [, drawCount, requiredCount, name, maximumHp] = drawThenNamedTrashRestM;
    return [
      {
        action: {
          action: "resolveThenQueue",
          first: { action: "draw", count: Number.parseInt(drawCount!, 10) },
          condition: {
            type: "cardInZone",
            owner: "friendly",
            zone: "trash",
            cardType: "command",
            comparison: "gte",
            count: Number.parseInt(requiredCount!, 10),
            hasName: name!,
          },
          followUp: {
            type: "triggered",
            activation: { timing: [] },
            directives: [
              {
                action: {
                  action: "rest",
                  target: {
                    owner: "opponent",
                    cardType: "unit",
                    count: 1,
                    attributeFilters: [
                      {
                        attribute: "hp",
                        comparison: "lte",
                        value: Number.parseInt(maximumHp!, 10),
                      },
                    ],
                  },
                },
              },
            ],
            sourceText: `Choose 1 enemy Unit with ${maximumHp} or less HP. Rest it.`,
          },
        },
      },
    ];
  }
  const repairByTokenCountM = body.match(
    /^This Unit gains the same number of <Repair (\d+)> as the number of \(([^)]+)\) Unit tokens you have in play\.?/i,
  );
  if (repairByTokenCountM) {
    return [
      {
        action: {
          action: "grantKeyword",
          keyword: "Repair",
          keywordValue: Number.parseInt(repairByTokenCountM[1], 10),
          countFilter: {
            owner: "friendly",
            zone: "battleArea",
            cardType: "unit",
            isToken: true,
            attributeFilters: [
              {
                attribute: "trait",
                comparison: "includes",
                value: repairByTokenCountM[2].toLowerCase(),
              },
            ],
          },
          duration: "permanent",
          target: { owner: "self", cardType: "unit" },
        },
      },
    ];
  }
  const restThenDamageAllM = body.match(
    /^You may choose (\d+) to (\d+) of your other active \(([^)]+)\) Units\. Rest them\. If you do, deal damage equal to the number of Units rested with this effect to all enemy Units that are Lv\.(\d+) or lower\.?$/i,
  );
  if (restThenDamageAllM) {
    const restedTarget = {
      owner: "friendly" as const,
      cardType: "unit" as const,
      count: {
        min: Number.parseInt(restThenDamageAllM[1], 10),
        max: Number.parseInt(restThenDamageAllM[2], 10),
      },
      excludeSource: true,
      state: "active" as const,
      attributeFilters: [
        {
          attribute: "trait" as const,
          comparison: "includes" as const,
          value: restThenDamageAllM[3].toLowerCase(),
        },
      ],
    };
    const { count: _resolvedTargetCount, ...countFilter } = restedTarget;
    return [
      { action: { action: "rest", target: restedTarget }, optional: true },
      {
        action: {
          action: "dealDamageByCount",
          countFilter: { ...countFilter, state: "rested" as const },
          countPreviousResolvedTargets: true,
          target: {
            owner: "opponent",
            cardType: "unit",
            count: "all",
            attributeFilters: [
              {
                attribute: "level",
                comparison: "lte",
                value: Number.parseInt(restThenDamageAllM[4], 10),
              },
            ],
          },
        },
        dependsOnPrevious: true,
      },
    ];
  }
  if (
    /^Increase this Unit['’]s AP by an amount equal to the amount of damage it has received\.?$/i.test(
      body,
    )
  ) {
    return [
      {
        action: {
          action: "statModifierByDamageReceived",
          stat: "ap",
          target: { owner: "self", cardType: "unit" },
        },
      },
    ];
  }
  const delayedBattleDestroyM = body.match(
    /^During this turn, when one of your (.+?) Units destroys an enemy Unit with battle damage, (choose 1 enemy Unit.+?\. Rest it\.)$/i,
  );
  if (delayedBattleDestroyM) {
    const eventCardFilter = parseTargetFilter(`one of your ${delayedBattleDestroyM[1]} Units`);
    const rest = parseSingleAction(delayedBattleDestroyM[2]);
    if (rest?.action === "rest") {
      return [
        {
          action: {
            action: "createDelayedTrigger",
            duration: "thisTurn",
            eventType: "attackerDestroyedDefender",
            eventCardFilter,
            effect: {
              type: "triggered",
              activation: { timing: ["onDestroyByBattle"] },
              directives: [
                {
                  action: {
                    ...rest,
                    target: { ...rest.target, state: "active" },
                  },
                },
              ],
              sourceText: body,
            },
          },
        },
      ];
    }
  }
  const delayedReadyAfterDestroyM = body.match(
    /^During this turn, if a friendly (.+?) Unit destroys an enemy Unit with battle damage, choose 1 rested friendly (.+?) Unit\. Set it as active\. It can['’]t attack during this turn\.?$/i,
  );
  if (delayedReadyAfterDestroyM) {
    const eventCardFilter = parseTargetFilter(`a friendly ${delayedReadyAfterDestroyM[1]} Unit`);
    const target = parseTargetFilter(`1 rested friendly ${delayedReadyAfterDestroyM[2]} Unit`);
    return [
      {
        action: {
          action: "createDelayedTrigger",
          duration: "thisTurn",
          eventType: "attackerDestroyedDefender",
          eventCardFilter,
          effect: {
            type: "triggered",
            activation: { timing: ["onDestroyByBattle"] },
            directives: [
              {
                action: {
                  action: "setActive",
                  target,
                  cantAttackDuration: "thisTurn",
                },
              },
            ],
            sourceText: body,
          },
        },
      },
    ];
  }
  const delayedBattleDamageDestroyM = body.match(
    /^Choose (\d+ of your Units)\. When it deals battle damage to an enemy Unit that is Lv\.(\d+) or lower during this turn, destroy that enemy Unit\.?$/i,
  );
  if (delayedBattleDamageDestroyM) {
    const eventSourceFilter = parseTargetFilter(delayedBattleDamageDestroyM[1]);
    const maximumLevel = Number.parseInt(delayedBattleDamageDestroyM[2], 10);
    return [
      {
        action: {
          action: "createDelayedTrigger",
          duration: "thisTurn",
          eventType: "battleDamageDealtToUnit",
          eventSourceFilter,
          eventCardFilter: {
            owner: "opponent",
            cardType: "unit",
            attributeFilters: [{ attribute: "level", comparison: "lte", value: maximumLevel }],
          },
          effect: {
            type: "triggered",
            activation: { timing: ["onBattleDamageDealtToUnit"] },
            directives: [{ action: { action: "destroyEventCard" } }],
            sourceText: `When it deals battle damage to an enemy Unit that is Lv.${maximumLevel} or lower during this turn, destroy that enemy Unit.`,
          },
        },
      },
    ];
  }
  const delayedChosenTraitBattleDrawM = body.match(
    /^Choose (\d+) of your \(([^)]+)\) Units\. When it destroys an enemy Unit with battle damage during this turn, if you have (\d+) or less cards in your hand, draw (\d+)\.?$/i,
  );
  if (delayedChosenTraitBattleDrawM) {
    const [, sourceCount, trait, maximumHandSize, drawCount] = delayedChosenTraitBattleDrawM;
    const eventSourceFilter = {
      owner: "friendly" as const,
      cardType: "unit" as const,
      count: Number.parseInt(sourceCount!, 10),
      attributeFilters: [
        {
          attribute: "trait" as const,
          comparison: "includes" as const,
          value: trait!.toLowerCase(),
        },
      ],
    };
    return [
      {
        action: {
          action: "createDelayedTrigger",
          duration: "thisTurn",
          eventType: "attackerDestroyedDefender",
          eventSourceFilter,
          eventCardFilter: { owner: "friendly", cardType: "unit" },
          effect: {
            type: "triggered",
            activation: {
              timing: ["onDestroyByBattle"],
              conditions: [
                {
                  type: "handCount",
                  owner: "friendly",
                  comparison: "lte",
                  count: Number.parseInt(maximumHandSize!, 10),
                },
              ],
            },
            directives: [{ action: { action: "draw", count: Number.parseInt(drawCount!, 10) } }],
            sourceText: `When it destroys an enemy Unit with battle damage during this turn, if you have ${maximumHandSize} or less cards in your hand, draw ${drawCount}.`,
          },
        },
      },
    ];
  }
  const millThenDamageM = body.match(
    /^Place the top (card|\d+ cards?) of your deck into your trash\. If you placed a \(([^)]+)\)(?:\/\(([^)]+)\))? card with this effect, choose 1 enemy Unit\. Deal (\d+) damage to it\.?$/i,
  );
  if (millThenDamageM) {
    const count = /^card$/i.test(millThenDamageM[1]) ? 1 : Number.parseInt(millThenDamageM[1], 10);
    const traits = [millThenDamageM[2], millThenDamageM[3]].filter((trait): trait is string =>
      Boolean(trait),
    );
    return [
      {
        action: {
          action: "millDeckThenDamageIfTrait",
          count,
          owner: "self",
          traits,
          damage: Number.parseInt(millThenDamageM[4], 10),
          target: { owner: "opponent", cardType: "unit", count: 1 },
        },
      },
    ];
  }
  const millThenStatM = body.match(
    /^Place the top (card|\d+ cards?) of your deck into your trash\. If you placed a \(([^)]+)\) card with this effect, choose 1 enemy Unit\. It gets (AP|HP)([+-]\d+) during this (turn|battle)\.?$/i,
  );
  if (millThenStatM) {
    return [
      {
        action: {
          action: "millDeckThenStatModifierIfTrait",
          count: /^card$/i.test(millThenStatM[1]) ? 1 : Number.parseInt(millThenStatM[1], 10),
          owner: "self",
          traits: millThenStatM[2].toLowerCase(),
          stat: millThenStatM[3].toLowerCase() as "ap" | "hp",
          amount: Number.parseInt(millThenStatM[4], 10),
          duration: millThenStatM[5].toLowerCase() === "turn" ? "thisTurn" : "thisBattle",
          target: { owner: "opponent", cardType: "unit", count: 1 },
        },
      },
    ];
  }
  const millThenLevelStatM = body.match(
    /^Place the top (card|\d+ cards?) of your deck into your trash\. If you placed a card that is Lv\.(\d+) or higher with this effect, choose 1 enemy Unit\. It gets (AP|HP)([+-]\d+) during this (turn|battle)\.?$/i,
  );
  if (millThenLevelStatM) {
    return [
      {
        action: {
          action: "millDeckThenStatModifierIfLevel",
          count: /^card$/i.test(millThenLevelStatM[1])
            ? 1
            : Number.parseInt(millThenLevelStatM[1], 10),
          owner: "self",
          minLevel: Number.parseInt(millThenLevelStatM[2], 10),
          stat: millThenLevelStatM[3].toLowerCase() as "ap" | "hp",
          amount: Number.parseInt(millThenLevelStatM[4], 10),
          duration: millThenLevelStatM[5].toLowerCase() === "turn" ? "thisTurn" : "thisBattle",
          target: { owner: "opponent", cardType: "unit", count: 1 },
        },
      },
    ];
  }
  const fixedHandLevelCostM = body.match(
    /^this card in your hand gets Lv\.\s*-([0-9]+) and cost\s*-([0-9]+)\.?$/i,
  );
  if (fixedHandLevelCostM) {
    const selfInHand = {
      owner: "self" as const,
      zone: "hand" as const,
      cardType: "unit" as const,
    };
    return [
      {
        action: {
          action: "levelReductionByCount",
          amountPerMatch: Number.parseInt(fixedHandLevelCostM[1], 10),
          countFilter: selfInHand,
          target: selfInHand,
        },
      },
      {
        action: {
          action: "costReductionByCount",
          amountPerMatch: Number.parseInt(fixedHandLevelCostM[2], 10),
          countFilter: selfInHand,
          target: selfInHand,
        },
      },
    ];
  }
  const handLevelCostByUnitM = body.match(
    /^this card in your hand gets Lv\.\s*-([0-9]+) and cost\s*-([0-9]+) for each of your \(([^)]+)\) Units in play\.?$/i,
  );
  if (handLevelCostByUnitM) {
    const countFilter = {
      owner: "friendly" as const,
      zone: "battleArea" as const,
      cardType: "unit" as const,
      attributeFilters: [
        {
          attribute: "trait" as const,
          comparison: "includes" as const,
          value: handLevelCostByUnitM[3].toLowerCase(),
        },
      ],
    };
    const target = { owner: "self" as const, zone: "hand" as const, cardType: "unit" as const };
    return [
      {
        action: {
          action: "levelReductionByCount",
          amountPerMatch: Number.parseInt(handLevelCostByUnitM[1], 10),
          countFilter,
          target,
        },
      },
      {
        action: {
          action: "costReductionByCount",
          amountPerMatch: Number.parseInt(handLevelCostByUnitM[2], 10),
          countFilter,
          target,
        },
      },
    ];
  }
  // Adding a Shield to hand can change the visible state before the following
  // instruction asks the player to choose a target. Keep these independently
  // parsed follow-ups queued so target legality is calculated after the Shield
  // move, rather than flattening both directives into one precommitted effect.
  const addShieldThenColorRecoverM = body.match(
    /^Add 1 of your Shields to your hand\. Then, choose 1 friendly (\w+) Unit\. It recovers (\d+) HP\.?$/i,
  );
  if (addShieldThenColorRecoverM) {
    const [, color, amount] = addShieldThenColorRecoverM;
    return [
      {
        action: {
          action: "resolveThenQueue",
          first: { action: "addShieldToHand", count: 1 },
          followUp: {
            type: "triggered",
            activation: { timing: [] },
            directives: [
              wrapAction({
                action: "recoverHP",
                amount: Number.parseInt(amount!, 10),
                target: {
                  owner: "friendly",
                  cardType: "unit",
                  count: 1,
                  attributeFilters: [
                    { attribute: "color", comparison: "eq", value: color!.toLowerCase() },
                  ],
                },
              }),
            ],
            sourceText: `Then, choose 1 friendly ${color} Unit. It recovers ${amount} HP.`,
          },
        },
      },
    ];
  }
  const addShieldThenRestedEnemyDamageM = body.match(
    /^Add 1 of your Shields to your hand\. Then, choose 1 rested enemy Unit that is Lv\.(\d+) or lower\. Deal (\d+) damage to it\.?$/i,
  );
  if (addShieldThenRestedEnemyDamageM) {
    const [, maximumLevel, amount] = addShieldThenRestedEnemyDamageM;
    return [
      {
        action: {
          action: "resolveThenQueue",
          first: { action: "addShieldToHand", count: 1 },
          followUp: {
            type: "triggered",
            activation: { timing: [] },
            directives: [
              wrapAction({
                action: "dealDamage",
                amount: Number.parseInt(amount!, 10),
                target: {
                  owner: "opponent",
                  cardType: "unit",
                  state: "rested",
                  count: 1,
                  attributeFilters: [
                    {
                      attribute: "level",
                      comparison: "lte",
                      value: Number.parseInt(maximumLevel!, 10),
                    },
                  ],
                },
              }),
            ],
            sourceText: `Then, choose 1 rested enemy Unit that is Lv.${maximumLevel} or lower. Deal ${amount} damage to it.`,
          },
        },
      },
    ];
  }
  const addShieldThenTokenAttackTargetM = body.match(
    /^Add 1 of your Shields to your hand\. Then, choose 1 friendly Unit token\. During this turn, it may choose an active enemy Unit with (\d+) or less AP as its attack target\.?$/i,
  );
  if (addShieldThenTokenAttackTargetM) {
    const maximumAp = Number.parseInt(addShieldThenTokenAttackTargetM[1]!, 10);
    return [
      {
        action: {
          action: "resolveThenQueue",
          first: { action: "addShieldToHand", count: 1 },
          followUp: {
            type: "triggered",
            activation: { timing: [] },
            directives: [
              wrapAction({
                action: "chooseAttackTarget",
                unit: { owner: "friendly", cardType: "unit", isToken: true, count: 1 },
                attackTarget: {
                  owner: "opponent",
                  cardType: "unit",
                  state: "active",
                  attributeFilters: [{ attribute: "ap", comparison: "lte", value: maximumAp }],
                },
                duration: "thisTurn",
              }),
            ],
            sourceText: `Then, choose 1 friendly Unit token. During this turn, it may choose an active enemy Unit with ${maximumAp} or less AP as its attack target.`,
          },
        },
      },
    ];
  }
  const addShieldThenTurnGatedColorDiscardDrawM = body.match(
    /^Add 1 of your Shields to your hand\. Then, if it is your turn, you may discard (\d+) (blue|green|red|white|purple) cards?\. If you do, draw (\d+)\.?$/i,
  );
  if (addShieldThenTurnGatedColorDiscardDrawM) {
    const [, discardCount, color, drawCount] = addShieldThenTurnGatedColorDiscardDrawM;
    return [
      {
        action: {
          action: "resolveThenQueue",
          first: { action: "addShieldToHand", count: 1 },
          condition: { type: "isTurn", whose: "friendly" },
          followUp: {
            type: "triggered",
            activation: { timing: [] },
            directives: [
              {
                action: {
                  action: "discard",
                  count: Number.parseInt(discardCount!, 10),
                  filter: {
                    owner: "friendly",
                    zone: "hand",
                    count: Number.parseInt(discardCount!, 10),
                    attributeFilters: [
                      { attribute: "color", comparison: "eq", value: color!.toLowerCase() },
                    ],
                  },
                },
                optional: true,
              },
              {
                action: { action: "draw", count: Number.parseInt(drawCount!, 10) },
                dependsOnPrevious: true,
              },
            ],
            sourceText: `You may discard ${discardCount} ${color} card${discardCount === "1" ? "" : "s"}. If you do, draw ${drawCount}.`,
          },
        },
      },
    ];
  }
  const addShieldThenConditionalEnemyUnitActionM = body.match(
    /^Add 1 of your Shields to your hand\. Then, if (.+?), (Choose 1 enemy Unit(?: with \d+ or less (?:AP|HP))?\. (?:Destroy it|It gets AP[+-]\d+ during this turn))\.?$/i,
  );
  if (addShieldThenConditionalEnemyUnitActionM) {
    const condition = parseCondition(addShieldThenConditionalEnemyUnitActionM[1]);
    const followUpDirectives = parseSteps(addShieldThenConditionalEnemyUnitActionM[2]);
    const followUpSourceText = `${addShieldThenConditionalEnemyUnitActionM[2].replace(/^./, (value) => value.toUpperCase())}.`;
    if (
      condition &&
      followUpDirectives.length > 0 &&
      !/^there are\b/i.test(addShieldThenConditionalEnemyUnitActionM[1])
    ) {
      return [
        {
          action: {
            action: "resolveThenQueue",
            first: { action: "addShieldToHand", count: 1 },
            condition,
            followUp: {
              type: "triggered",
              activation: { timing: [] },
              directives: followUpDirectives,
              sourceText: followUpSourceText,
            },
          },
        },
      ];
    }
  }
  const clauses = splitClauses(body);
  let i = 0;
  /** Target from a preceding bare "Choose N [target]" clause; applied to the next action. */
  let pendingTarget: TargetFilter | undefined;
  /** Most recent explicit Choose target for later “it” continuations. */
  let selectedTarget: TargetFilter | undefined;
  /**
   * True when the previous clause was "If you do, ...": the next emitted
   * directive is tagged with `dependsOnPrevious: true`. Cleared
   * as soon as a directive is emitted, so a single "If you do" only
   * gates a single follow-up directive.
   */
  let pendingDependsOnPrev = false;
  /** A leading "You may choose ..." makes the action applied to that target optional. */
  let pendingOptional = false;

  /** Push a directive, applying `pendingDependsOnPrev` if set. */
  function push(d: Directive): void {
    if ((pendingDependsOnPrev || pendingOptional) && "action" in d) {
      directives.push({
        ...d,
        ...(pendingDependsOnPrev ? { dependsOnPrevious: true } : {}),
        ...(pendingOptional ? { optional: true } : {}),
      });
      pendingDependsOnPrev = false;
      pendingOptional = false;
    } else {
      directives.push(d);
      if (pendingDependsOnPrev) pendingDependsOnPrev = false;
      if (pendingOptional) pendingOptional = false;
    }
  }

  while (i < clauses.length) {
    const clause = clauses[i].trim();
    if (!clause || clause.match(/^\(.*\)$/)) {
      i++;
      continue;
    } // skip explanations

    if (/^draw a number of cards equal to the number of enemy players$/i.test(clause)) {
      push(wrapAction({ action: "drawThenDiscardByOpponentCount" }));
      if (
        /^then,? discard the same number of cards you drew with this effect\.?$/i.test(
          clauses[i + 1] ?? "",
        )
      ) {
        i += 2;
      } else {
        i++;
      }
      continue;
    }

    const recoverAndStatM = clause.match(
      /^(.+?) recovers (\d+) HP and gets (AP|HP)([+-]\d+) during this turn\.?$/i,
    );
    if (recoverAndStatM) {
      const target = pendingTarget ?? selectedTarget ?? parseTargetFilter(recoverAndStatM[1]);
      pendingTarget = undefined;
      selectedTarget = target;
      push(
        wrapAction({
          action: "recoverHP",
          amount: Number.parseInt(recoverAndStatM[2], 10),
          target,
        }),
      );
      push(
        wrapAction({
          action: "statModifier",
          stat: recoverAndStatM[3].toLowerCase() as "ap" | "hp",
          amount: Number.parseInt(recoverAndStatM[4], 10),
          duration: "thisTurn",
          target,
        }),
      );
      i++;
      continue;
    }

    // “Draw N. Then/If you do, discard M.” is one staged action so the legal
    // discard candidates include the cards that were just drawn. `If you do`
    // is the printed dependency on the draw resolving, not a separate target
    // selection before the draw.
    const drawThenDiscardM = clause.match(/^draw (\d+)$/i);
    const discardAfterDrawM = clauses[i + 1]?.match(/^(?:then|if you do),?\s+discard (\d+)\.?$/i);
    if (drawThenDiscardM && discardAfterDrawM) {
      push(
        wrapAction({
          action: "drawThenDiscard",
          drawCount: parseInt(drawThenDiscardM[1]),
          discardCount: parseInt(discardAfterDrawM[1]),
        }),
      );
      i += 2;
      continue;
    }

    if (/^then,?\s+/i.test(clause)) {
      clauses[i] = clause.replace(/^then,?\s+/i, "");
      continue;
    }

    // A pronoun after a choice refers to the selected Unit, not the source
    // card. Keep that selection and evaluate its trait before drawing.
    const selectedTraitDrawM = clause.match(
      /^if it is an? \(([^)]+)\) Unit,?\s*draw (\d+)\.?(?:\s*\(.*\))?$/i,
    );
    if (selectedTraitDrawM && selectedTarget) {
      push(
        wrapAction({
          action: "drawIfTargetMatches",
          count: Number.parseInt(selectedTraitDrawM[2], 10),
          target: {
            ...selectedTarget,
            attributeFilters: [
              ...(selectedTarget.attributeFilters ?? []),
              {
                attribute: "trait",
                comparison: "includes",
                value: selectedTraitDrawM[1].toLowerCase(),
              },
            ],
          },
        }),
      );
      i++;
      continue;
    }

    // A standalone optional action (for example, "You may rest this Unit")
    // keeps its optionality on the directive rather than degrading to text.
    const optionalActionM = clause.match(/^you may\s+(.+)$/i);
    if (optionalActionM) {
      const optionalAction = parseSingleAction(optionalActionM[1]);
      if (optionalAction) {
        push({ action: optionalAction, optional: true });
        i++;
        continue;
      }
    }

    if (
      /^if .*reveal \d+ .* card from your hand$/i.test(clause) &&
      /^return it to the bottom of your deck/i.test(clauses[i + 1] ?? "")
    ) {
      clauses[i] = `${clause}. ${clauses[i + 1]}`;
      clauses.splice(i + 1, 1);
      continue;
    }

    // Tutor-style deck looks commonly print the reveal and random-bottom
    // routing as following sentences. They are one atomic deck-look action,
    // so parse them together instead of preserving the continuations as
    // unrelated unparsedText directives.
    if (/^look at the top (?:\d+ cards?|card) of your deck/i.test(clause)) {
      const revealClause = clauses[i + 1];
      if (
        revealClause &&
        /^(?:you may reveal \d+ |you may deploy \d+ |if it is .*you may reveal it and add it to your hand)/i.test(
          revealClause,
        )
      ) {
        const returnClause = clauses[i + 2];
        const consumesReturn = Boolean(
          returnClause && /^return (?:the|any) remaining cards?/i.test(returnClause),
        );
        const combined = [clause, revealClause, ...(consumesReturn ? [returnClause] : [])].join(
          ". ",
        );
        const action = parseSingleAction(combined);
        if (action) {
          push(wrapAction(action));
          i += consumesReturn ? 3 : 2;
          continue;
        }
      }
    }

    // A one-card look followed by its top-or-bottom routing is one action,
    // including when the look is the body of an If clause.
    if (
      /look at the top (?:\d+ cards?|card) of your deck/i.test(clause) &&
      /^return 1 to the top and 1 to the bottom/i.test(clauses[i + 1] ?? "")
    ) {
      clauses[i] = `${clause}. ${clauses[i + 1]}`;
      clauses.splice(i + 1, 1);
      continue;
    }

    if (
      /look at the top (?:\d+ cards?|card) of your deck/i.test(clause) &&
      /^return it to the top or bottom of your deck/i.test(clauses[i + 1] ?? "")
    ) {
      clauses[i] = `${clause}. ${clauses[i + 1]}`;
      clauses.splice(i + 1, 1);
      continue;
    }

    if (
      /look at the top (?:\d+ cards?|card) of your deck/i.test(clause) &&
      /^place the remaining cards? into your trash/i.test(clauses[i + 1] ?? "")
    ) {
      clauses[i] = `${clause}. ${clauses[i + 1]}`;
      clauses.splice(i + 1, 1);
      continue;
    }

    if (
      /look at the top (?:\d+ cards?|card) of your deck/i.test(clause) &&
      /^return the remaining cards? to the bottom of your deck/i.test(clauses[i + 1] ?? "")
    ) {
      clauses[i] = `${clause}. ${clauses[i + 1]}`;
      clauses.splice(i + 1, 1);
      continue;
    }

    if (
      /look at the top card of your deck/i.test(clause) &&
      /^return it to the top of your deck or place it into your trash/i.test(clauses[i + 1] ?? "")
    ) {
      clauses[i] = `${clause}. ${clauses[i + 1]}`;
      clauses.splice(i + 1, 1);
      continue;
    }

    if (
      /reduce the next (?:battle )?damage it receives by \d+/i.test(clause) &&
      /^if you use an EX Resource to play this card, reduce by \d+ instead/i.test(
        clauses[i + 1] ?? "",
      )
    ) {
      clauses[i] = `${clause}. ${clauses[i + 1]}`;
      clauses.splice(i + 1, 1);
      continue;
    }

    if (
      /may choose an? .*?enemy Unit.*?as its attack target/i.test(clause) &&
      /^if you use an EX Resource to play this card, choose \d+ to \d+ friendly .+ Units instead/i.test(
        clauses[i + 1] ?? "",
      )
    ) {
      clauses[i] = `${clause}. ${clauses[i + 1]}`;
      clauses.splice(i + 1, 1);
      continue;
    }

    // "If you do, X" — mark the next emitted directive with
    // `dependsOnPrevious: true`. This encodes the card-text
    // connective as an inter-directive dependency; the executor evaluates
    // it left-to-right against whether the preceding directive actually
    // resolved — including optional-declined and targeted-without-targets
    // misses (see `packages/engine/src/gundam/effects/executor.ts`).
    //
    // splitClauses preserves the "If you do," marker on the clause that
    // follows the connective. Three shapes show up in the catalog:
    //   (a) "If you do, <action>." — single-clause, action inline.
    //   (b) "If you do, choose 1 X. <action> it." — bare Choose on this
    //       clause + action on the NEXT clause (bare-Choose propagation).
    //   (c) "If you do, <action>. <follow-up>." — action inline, another
    //       independent clause after.
    // For (a) / (c) we strip the marker, let the normal clause path emit
    // the directive, then patch `dependsOnPrevious` onto it.
    // For (b) the marker also propagates through the bare-Choose → next
    // clause chain via `pendingDependsOnPrev`.
    if (/^if you do[,.]/i.test(clause)) {
      const stripped = clause.replace(/^if you do[,.]?\s*/i, "");
      const previous = directives[directives.length - 1];
      const inlineAction = parseSingleAction(stripped);
      if (previous && "condition" in previous && inlineAction) {
        previous.thenDirectives.push({ action: inlineAction, dependsOnPrevious: true });
        i++;
        continue;
      }
      clauses[i] = stripped;
      pendingDependsOnPrev = true;
      // Do NOT increment `i`: re-process the stripped clause so its
      // action (or bare-Choose → next-clause chain) is emitted normally,
      // then patched with the dependency flag via `push()`.
      continue;
    }

    const afterMainM = clause.match(
      /^after activating this card['’]s 【main】,?\s*(you may\s+.+)$/i,
    );
    if (afterMainM) {
      clauses[i] = afterMainM[1];
      continue;
    }

    const thenDuringTurnIfM = clause.match(/^(?:Then,?\s*)?during your turn,? if (.+?),\s*(.*)$/is);
    if (thenDuringTurnIfM) {
      const condition = parseCondition(thenDuringTurnIfM[1]);
      const action = parseSingleAction(thenDuringTurnIfM[2]);
      if (condition && action) {
        push({
          condition: {
            type: "and",
            conditions: [{ type: "isTurn", whose: "friendly" }, condition],
          },
          thenDirectives: [wrapAction(action)],
        });
        i++;
        continue;
      }
    }

    // Conditional "if" clause that introduces a branch — clear any pending target
    // A period in card notation (for example "Lv.7") is not the boundary
    // between the condition and its consequence.  Only treat a period as a
    // separator when it is followed by whitespace; commas remain separators.
    const ifM = clause.match(/^[Ii]f\s+(?!you do)(.*?)(?:,|\.(?=\s))\s*(?:then\s+)?(.*)/s);
    if (ifM) {
      pendingTarget = undefined;
      const condText = ifM[1];
      let thenText = ifM[2];
      const isInstead = /\binstead\.?\s*$/i.test(thenText);
      if (isInstead) thenText = thenText.replace(/\s*instead\.?\s*$/i, "");
      const cond = parseCondition(condText);
      const tokenChoice = thenText ? parseTokenChoice(thenText) : undefined;
      const thenAction = thenText ? parseSingleAction(thenText) : undefined;
      if (cond) {
        const conditionalChooseM = thenText.match(/^choose\s+(\d+)(?:\s+to\s+(\d+))?\s+(.+)$/i);
        if (conditionalChooseM) {
          const target = parseTargetFilter(thenText);
          const followUp = parseSingleAction(clauses[i + 1] ?? "");
          if (followUp) {
            push({
              condition: cond,
              thenDirectives: [wrapAction(patchActionTarget(followUp, target))],
            });
            selectedTarget = target;
            i += 2;
            continue;
          }
        }
        const conditionalOptionalChooseM = thenText.match(/^you may\s+(choose\s+.+)$/i);
        if (conditionalOptionalChooseM) {
          const combined = `${conditionalOptionalChooseM[1]}. ${clauses[i + 1] ?? ""}`;
          const combinedAction = parseSingleAction(combined);
          if (combinedAction) {
            push({
              condition: cond,
              thenDirectives: [{ action: combinedAction, optional: true }],
            });
            i += 2;
            continue;
          }
        }
        // "instead" clause: merge with the previous conditional branch.
        // "If A, do X. If A and B, do Y instead." → if (A) { if (B) { Y } else { X } }
        if (isInstead && thenAction) {
          const prevBranch = directives.length > 0 ? directives[directives.length - 1] : undefined;
          if (prevBranch && "condition" in prevBranch) {
            const subConditions =
              cond.type === "and"
                ? cond.conditions.filter(
                    (c) => JSON.stringify(c) !== JSON.stringify(prevBranch.condition),
                  )
                : [cond];
            const innerCond =
              subConditions.length === 1
                ? subConditions[0]
                : { type: "and" as const, conditions: subConditions };
            directives[directives.length - 1] = {
              condition: prevBranch.condition,
              thenDirectives: [
                {
                  condition: innerCond,
                  thenDirectives: [wrapAction(thenAction)],
                  elseDirectives: prevBranch.thenDirectives,
                },
              ],
            };
            i++;
            continue;
          }
          if (prevBranch && "action" in prevBranch) {
            const previousAction = prevBranch.action;
            const inheritedAction =
              thenAction.action === "statModifier" && previousAction.action === "statModifier"
                ? { ...thenAction, duration: previousAction.duration }
                : thenAction.action === "dealDamage" && previousAction.action === "dealDamage"
                  ? { ...thenAction, target: previousAction.target }
                  : thenAction;
            directives[directives.length - 1] = {
              condition: cond,
              thenDirectives: [wrapAction(inheritedAction)],
              elseDirectives: [prevBranch],
            };
            i++;
            continue;
          }
        }
        const branch: ConditionalDirective = {
          condition: cond,
          thenDirectives: tokenChoice
            ? [tokenChoice]
            : thenAction
              ? [
                  /^you may\b/i.test(thenText)
                    ? { action: thenAction, optional: true }
                    : wrapAction(thenAction),
                ]
              : [],
        };
        push(branch);
        i++;
        continue;
      }
    }

    // Token branching: "deploy X if you have 0 Units, deploy Y if only 1, or deploy Z if 2+"
    if (/deploy.*\[/.test(clause) && /if you have/.test(clause)) {
      const tokenBranch = parseTokenBranchingClause(clause);
      if (tokenBranch) {
        push(tokenBranch);
        i++;
        continue;
      }
    }

    // One unconditional self modifier followed by a Link-only keyword in the
    // same sentence. The qualification applies only after “if”, not to the
    // preceding stat modifier.
    const selfStatThenLinkKeywordM = clause.match(
      /this Unit gets (AP|HP)([+-]\d+) and,? if it is a Link Unit, it gains <([\w\s-]+?)(?:\s+(\d+))?>/i,
    );
    if (selfStatThenLinkKeywordM) {
      const keyword = parseKeywordEffectName(selfStatThenLinkKeywordM[3]);
      if (keyword) {
        const duration = parseDuration(clause);
        push(
          wrapAction({
            action: "statModifier",
            stat: selfStatThenLinkKeywordM[1].toLowerCase() as "ap" | "hp",
            amount: parseInt(selfStatThenLinkKeywordM[2]),
            duration,
            target: { owner: "self", cardType: "unit" },
          }),
        );
        push(
          wrapAction({
            action: "grantKeyword",
            keyword,
            ...(selfStatThenLinkKeywordM[4]
              ? { keywordValue: parseInt(selfStatThenLinkKeywordM[4]) }
              : {}),
            duration,
            target: { owner: "self", cardType: "unit", isLinkUnit: true },
          }),
        );
        i++;
        continue;
      }
    }

    // ── Multi-stat / stat+keyword combo ──────────────────────────────────────
    const handReductionM = clause.match(
      /this card in your hand gets Lv\.?\s*-(\d+) and cost -(\d+) for each enemy Unit in play/i,
    );
    if (handReductionM) {
      const countFilter: TargetFilter = {
        owner: "opponent",
        cardType: "unit",
        zone: "battleArea",
      };
      const target: TargetFilter = {
        owner: "self",
        cardType: "unit",
        zone: "hand",
      };
      push(
        wrapAction({
          action: "levelReductionByCount",
          amountPerMatch: parseInt(handReductionM[1]),
          countFilter,
          target,
        }),
      );
      push(
        wrapAction({
          action: "costReductionByCount",
          amountPerMatch: parseInt(handReductionM[2]),
          countFilter,
          target,
        }),
      );
      i++;
      continue;
    }

    const allStatMs = [...clause.matchAll(/\b(AP|HP|cost)\s*([+-])\s*(\d+)/gi)];
    const allKwMs: Array<{ kw: KeywordEffect; val: number | undefined }> = [];
    for (const m of clause.matchAll(/<([\w\s-]+?)(?:\s+(\d+))?>/g)) {
      const kw = parseKeywordEffectName(m[1]);
      if (kw) allKwMs.push({ kw, val: m[2] !== undefined ? parseInt(m[2]) : undefined });
    }
    if (
      /gets?\b/i.test(clause) &&
      (allStatMs.length > 1 || (allStatMs.length >= 1 && allKwMs.length >= 1))
    ) {
      const clauseForTarget = clause.replace(/<[\w\s-]+?(?:\s+\d+)?>/g, "").trim();
      const target = pendingTarget ?? parseTargetFilter(clauseForTarget);
      pendingTarget = undefined;
      const duration = parseDuration(clause);
      for (const m of allStatMs) {
        push(
          wrapAction({
            action: "statModifier",
            stat: m[1].toLowerCase() as "ap" | "hp" | "cost",
            amount: parseInt(m[2] + m[3]),
            duration,
            target,
          }),
        );
      }
      for (const { kw, val } of allKwMs) {
        push(
          wrapAction({
            action: "grantKeyword",
            keyword: kw,
            ...(val !== undefined ? { keywordValue: val } : {}),
            duration,
            target,
          }),
        );
      }
      i++;
      continue;
    }

    // ── Bare "Choose N [target]" — no embedded action ────────────────────────
    if (/^(?:[Yy]ou may )?[Cc]hoose\b/.test(clause)) {
      const isOptionalChoose = /^[Yy]ou may choose\b/.test(clause);
      // "Choose … from your trash. Pay its cost to deploy it." is one
      // atomic selection-and-deployment operation. Joining the two printed
      // sentences lets the action parser retain the card filter and payment.
      if (
        /from your trash\.?$/i.test(clause) &&
        /^Pay its cost to deploy it\.?$/i.test(clauses[i + 1] ?? "")
      ) {
        const action = parseSingleAction(`${clause}. ${clauses[i + 1]}`);
        if (action) {
          push(isOptionalChoose ? { action, optional: true } : wrapAction(action));
          i += 2;
          continue;
        }
      }
      const chooseClause = clause.replace(/^[Yy]ou may\s+/i, "");
      const action = parseSingleAction(chooseClause);
      if (action) {
        push(isOptionalChoose ? { action, optional: true } : wrapAction(action));
      } else {
        const chooseM = chooseClause.match(/^[Cc]hoose (\d+)(?:\s+to\s+(\d+))?\s+(.*)/);
        if (chooseM) {
          pendingTarget = parseTargetFilter(`${chooseM[1]} ${chooseM[3].trim()}`);
          pendingOptional = isOptionalChoose;
          if (chooseM[2]) {
            pendingTarget.count = { min: parseInt(chooseM[1]), max: parseInt(chooseM[2]) };
          } else {
            pendingTarget.count = parseInt(chooseM[1]);
          }
        }
      }
      i++;
      continue;
    }

    // ── Pending target: apply to the next action clause ──────────────────────
    if (pendingTarget) {
      const action = parseSingleAction(clause);
      if (action) {
        // “Choose a Unit. Battle damage it would receive is dealt to this
        // Unit instead” protects the preceding choice and redirects that
        // Unit's damage to the source. `this Unit` otherwise wins the simple
        // target parser, so restore the printed pronoun's antecedent here.
        const chosenUnitRedirectsToSelf =
          action.action === "redirectBattleDamage" &&
          /battle damage it would receive is dealt to this Unit instead/i.test(clause);
        push(
          wrapAction(
            chosenUnitRedirectsToSelf
              ? {
                  ...action,
                  target: pendingTarget,
                  redirectTo: { owner: "self", cardType: "unit" },
                }
              : patchActionTarget(action, pendingTarget),
          ),
        );
        selectedTarget = pendingTarget;
        pendingTarget = undefined;
      }
      i++;
      continue;
    }

    if (selectedTarget && /^it\b/i.test(clause)) {
      const action = parseSingleAction(clause);
      if (action) {
        const patched = patchActionTarget(action, selectedTarget);
        const previousDirective = directives.at(-1);
        const followsSetActive =
          previousDirective !== undefined &&
          "action" in previousDirective &&
          previousDirective.action.action === "setActive";
        // "Choose 1 … Rest it. It won't be set as active …" keeps the
        // same chosen Unit and only matters when the preceding rest resolved.
        // This is a distinct dependency from ordinary pronoun continuations
        // such as stat modifiers, which may be independently meaningful.
        if (patched.action === "preventActive") {
          push({
            action: patched,
            dependsOnPrevious: true,
            sharesTargetChoiceWithPrevious: true,
          });
        } else if (
          patched.action === "cantAttack" &&
          selectedTarget.state === "rested" &&
          followsSetActive
        ) {
          const { state: _previousState, ...postReadyTarget } = selectedTarget;
          push({
            action: { ...patched, target: postReadyTarget },
            dependsOnPrevious: true,
            sharesTargetChoiceWithPrevious: true,
          });
        } else {
          push(
            previousDirective && "optional" in previousDirective && previousDirective.optional
              ? { action: patched, dependsOnPrevious: true }
              : wrapAction(patched),
          );
        }
        i++;
        continue;
      }
    }

    const action = parseSingleAction(clause) ?? { action: "unparsedText" as const, text: clause };
    push(/^you may\b/i.test(clause) ? { action, optional: true } : wrapAction(action));
    i++;
  }

  return directives;
}
