import type { AttributeFilter, EffectAction, TargetFilter, TargetOwner } from "@tcg/gundam-types";
import { parseCardType, parseDuration, parseKeywordEffectName } from "./helpers.ts";
import { parseTargetFilter } from "./target-filter.ts";
import { parseTokenSpec } from "./token-spec.ts";

// ─────────────────────────────────────────────────────────────────────────────
// Clause splitting
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Split a body string into individual action clauses.
 * Sentences are split on ". " and "Then, " while preserving token spec brackets.
 */
export function splitClauses(body: string): string[] {
  // Protect token specs [Name](...) from being split
  const placeholder = "__TOKEN__";
  const tokens: string[] = [];
  const protected_ = body.replace(/\[[^\]]+\]\([^)]*(?:\([^)]*\)[^)]*)*\)/g, (m) => {
    tokens.push(m);
    return placeholder + (tokens.length - 1) + "__";
  });

  // Split on ". Then," (discarded), ". If you do," (preserve "If you do,"
  // marker on the following clause so `parseSteps` can recognise the
  // inter-directive dependency), and plain ". " sentence boundaries
  // (followed by an uppercase word).
  //
  // Lookahead-based split: connective prefixes stay attached to the start of
  // their clauses so parseSteps can distinguish an atomic “Then, discard”.
  const parts = protected_
    .split(/\.\s+(?=Then,?\s+)|\.\s+(?=If you do,?\s+)|\.\s+(?=[A-Z])/g)
    .map((s) => s.trim())
    .filter(Boolean);

  return parts.map((p) => p.replace(/__TOKEN__(\d+)__/g, (_, i) => tokens[parseInt(i)]));
}

// ─────────────────────────────────────────────────────────────────────────────
// Single action parsing
// ─────────────────────────────────────────────────────────────────────────────

export function parseSingleAction(clause: string): EffectAction | undefined {
  const t = clause.trim();
  const lower = t.toLowerCase();

  const payResourcesM = t.match(/^you may pay ([①②③④⑤⑥]+)\.?$/i);
  if (payResourcesM) {
    const circleDigits: Record<string, number> = {
      "①": 1,
      "②": 2,
      "③": 3,
      "④": 4,
      "⑤": 5,
      "⑥": 6,
    };
    return {
      action: "payResources",
      count: Array.from(payResourcesM[1]).reduce(
        (total, digit) => total + (circleDigits[digit] ?? 0),
        0,
      ),
    };
  }

  if (/draw a number of cards equal to the number of enemy players/i.test(t)) {
    return { action: "drawThenDiscardByOpponentCount" };
  }

  // ── Draw ──
  const drawAllM = t.match(/^all players draw (\d+)\.?$/i);
  if (drawAllM) return { action: "drawAll", count: parseInt(drawAllM[1], 10) };
  const drawM = t.match(/[Dd]raw (\d+)/);
  if (drawM) return { action: "draw", count: parseInt(drawM[1]) };

  // ── Discard ──
  const qualifiedTypedDiscardM = t.match(
    /discard (\d+)\s+(?:(blue|green|red|white|purple)\s+)?(?:\(([^)]+)\)\s+)?(Unit|Pilot|Command|Base) cards?/i,
  );
  if (qualifiedTypedDiscardM) {
    const [, countText, color, trait, cardTypeText] = qualifiedTypedDiscardM;
    const attributeFilters = [
      ...(color
        ? [{ attribute: "color" as const, comparison: "eq" as const, value: color.toLowerCase() }]
        : []),
      ...(trait
        ? [
            {
              attribute: "trait" as const,
              comparison: "includes" as const,
              value: trait.toLowerCase(),
            },
          ]
        : []),
    ];
    return {
      action: "discard",
      count: parseInt(countText),
      filter: {
        owner: "friendly",
        zone: "hand",
        cardType: parseCardType(cardTypeText)!,
        count: parseInt(countText),
        ...(attributeFilters.length > 0 ? { attributeFilters } : {}),
      },
    };
  }
  const typedDiscardM = t.match(/discard (\d+) (Unit|Pilot|Command|Base) cards?/i);
  if (typedDiscardM)
    return {
      action: "discard",
      count: parseInt(typedDiscardM[1]),
      filter: {
        owner: "friendly",
        zone: "hand",
        cardType: parseCardType(typedDiscardM[2])!,
        count: parseInt(typedDiscardM[1]),
      },
    };
  const discardM = t.match(/[Dd]iscard (\d+)/);
  if (discardM) return { action: "discard", count: parseInt(discardM[1]) };

  // ── Add this card to your hand ──
  if (/add this card to your hand/i.test(t)) return { action: "addSelfToHand" };

  // ── Deploy this card ──
  if (/^deploy this card\.?$/i.test(t)) return { action: "deploySelf" };
  if (/^deploy 1 EX Base\.?$/i.test(t)) return { action: "deployExBase" };
  const deployRestedM = t.match(
    /^All Units that are Lv\.(\d+) or lower other than Unit tokens are deployed rested\.?$/i,
  );
  if (deployRestedM) {
    return {
      action: "deployRested",
      target: {
        owner: "any",
        cardType: "unit",
        isToken: false,
        attributeFilters: [
          { attribute: "level", comparison: "lte", value: Number.parseInt(deployRestedM[1], 10) },
        ],
      },
    };
  }

  // ── Static unit restrictions ──
  if (/can'?t (?:be )?set as active|(?:can'?t be |or )paired with a Pilot/i.test(t)) {
    const restrictions: ("cannotSetActive" | "cannotPairPilot")[] = [];
    if (/can'?t (?:be )?set as active/i.test(t)) restrictions.push("cannotSetActive");
    if (/(?:can'?t be |or )paired with a Pilot/i.test(t)) restrictions.push("cannotPairPilot");
    if (restrictions.length > 0) {
      return {
        action: "restrictUnit",
        target: { owner: "self", cardType: "unit", count: 1 },
        restrictions,
        duration: parseDuration(t),
      };
    }
  }

  // ── Activate this card's 【Main】 / 【Action】 ──
  const activateTimingM = t.match(/[Aa]ctivate this card'?s?\s*【(\w+)】/);
  if (activateTimingM)
    return {
      action: "activateTiming",
      timing: activateTimingM[1].toLowerCase() as "main" | "action",
    };

  // ── Add N of your Shields to your hand ──
  const shieldM = t.match(/[Aa]dd (\d+) of your Shields? to your hand/);
  if (shieldM) return { action: "addShieldToHand", count: parseInt(shieldM[1]) };

  const destroyTopOpponentShieldsM = t.match(
    /^Choose 1 enemy player\. Destroy the first (\d+) cards? in that player['’]s shield area\.?$/i,
  );
  if (destroyTopOpponentShieldsM) {
    return {
      action: "destroyTopOpponentShields",
      count: Number.parseInt(destroyTopOpponentShieldsM[1], 10),
    };
  }

  // ── Place resource ──
  const exResourceM = t.match(/[Pp]lace (\d+) (rested )?EX [Rr]esource/);
  if (exResourceM) {
    const count = parseInt(exResourceM[1]);
    return {
      action: "placeExResource",
      ...(count > 1 ? { count } : {}),
      state: exResourceM[2] ? "rested" : "active",
      ...(/all players/i.test(t) ? { recipients: "all" as const } : {}),
    };
  }
  const restedResourceM = t.match(/[Pp]lace (\d+) rested [Rr]esource/);
  if (restedResourceM)
    return {
      action: "placeResource",
      state: "rested",
    };
  const activeResourceM = t.match(/[Ss]et (?:this|1 of your) [Rr]esource(?:s)? as active/);
  if (activeResourceM)
    return {
      action: "setActive",
      target: { owner: "friendly", cardType: "resource", count: 1 },
    };

  // ── Mill deck ──
  const millM = t.match(/[Pp]lace the top (?:(\d+) cards?|card) of your deck into your trash/);
  if (millM) return { action: "millDeck", count: millM[1] ? parseInt(millM[1]) : 1, owner: "self" };

  // ── Paired Pilot routing ──
  if (
    /return (?:this Unit['’]s |the )?paired (?:Pilot|card) to (?:its|the) owner['’]s hand/i.test(
      t,
    ) ||
    /return the card paired with this Unit to your hand/i.test(t)
  ) {
    return { action: "returnPairedPilotToHand" };
  }

  const returnColoredPairedPilotM = t.match(
    /return a (blue|green|red|white|purple) Pilot paired with this Unit to its owner['’]s hand/i,
  );
  if (returnColoredPairedPilotM) {
    return {
      action: "returnPairedPilotToHand",
      color: returnColoredPairedPilotM[1].toLowerCase() as
        | "blue"
        | "green"
        | "red"
        | "white"
        | "purple",
    };
  }

  const returnPairedToDeckM = t.match(
    /return the card paired with this Unit to the (top|bottom) of its owner['’]s deck/i,
  );
  if (returnPairedToDeckM) {
    return {
      action: "returnPairedCardToDeck",
      position: returnPairedToDeckM[1].toLowerCase() as "top" | "bottom",
    };
  }

  if (/^Activate 【(Main|Action)】 on the card paired with this Unit\.?$/i.test(t)) {
    const timing = t.match(/【(Main|Action)】/i)?.[1].toLowerCase() as "main" | "action";
    return { action: "activatePairedCardTiming", timing };
  }

  // ── Deploy token ──
  const tokenM = t.match(
    /[Dd]eploy\s+(\d+)\s+((?:rested\s+)?)\[([^\]]+)\]\(([^()]*(?:\([^)]*\)[^()]*)*)\)\s*Unit\s+token/,
  );
  if (tokenM) {
    const tokenCount = parseInt(tokenM[1]);
    const spec = parseTokenSpec(`[${tokenM[3]}](${tokenM[4]})`);
    if (spec) {
      if (/rested/i.test(tokenM[2])) spec.deployState = "rested";
      return {
        action: "deployToken",
        token: spec,
        ...(tokenCount > 1 ? { count: tokenCount } : {}),
      };
    }
  }

  // ── Deploy card from hand ──
  // The trait slot accepts either a single "(X)" or a trait-OR group such
  // as "(X)/(Y)" or "(X) OR (Y)". Capture the full trait cluster then
  // split into individual traits downstream.
  const deployHandM = t.match(
    /[Dd]eploy (\d+) ((?:\([^)]+\)(?:\s*(?:\/|or)\s*\([^)]+\))*)\s+)?(\w+) card(?:s)? (?:that (?:is|are) Lv\.?\s*(\d+) or lower )?from your hand/i,
  );
  if (deployHandM) {
    const tf: TargetFilter = {
      owner: "friendly",
      zone: "hand",
      count: parseInt(deployHandM[1]),
    };
    const ct = parseCardType(deployHandM[3]);
    if (ct) tf.cardType = ct;
    const deployHandFilters: AttributeFilter[] = [];
    const traitCluster = deployHandM[2];
    if (traitCluster) {
      const traits: string[] = [];
      const single = /\(([^)·\d][^)]*)\)/g;
      let m: RegExpExecArray | null;
      while ((m = single.exec(traitCluster)) !== null) {
        if (!m[1].match(/^(AP|HP)\d/)) traits.push(m[1].toLowerCase());
      }
      if (traits.length === 1) {
        deployHandFilters.push({
          attribute: "trait",
          comparison: "includes",
          value: traits[0],
        });
      } else if (traits.length >= 2) {
        deployHandFilters.push({
          attribute: "or",
          filters: traits.map((tv) => ({
            attribute: "trait" as const,
            comparison: "includes" as const,
            value: tv,
          })),
        });
      }
    }
    if (deployHandM[4])
      deployHandFilters.push({
        attribute: "level",
        comparison: "lte",
        value: parseInt(deployHandM[4]),
      });
    if (deployHandFilters.length > 0) tf.attributeFilters = deployHandFilters;
    return { action: "deploy", target: tf };
  }
  if (/^Deploy it\.?$/i.test(t)) return { action: "deploy", target: { owner: "any" } };

  // ── Pair pilot from hand ──
  const pairM = t.match(/pair (\d+) (?:\(([^)]+)\) )?Pilot card from your hand with this Unit/i);
  if (pairM) {
    const tf: TargetFilter = {
      owner: "friendly",
      zone: "hand",
      cardType: "pilot",
      count: parseInt(pairM[1]),
    };
    if (pairM[2])
      tf.attributeFilters = [
        { attribute: "trait", comparison: "includes", value: pairM[2].toLowerCase() },
      ];
    return { action: "pairPilot", target: tf };
  }
  const pairSelfFromTrashM = t.match(
    /^pair this card from your trash with one of your (?:\(([^)]+)\) )?Units?\.?$/i,
  );
  if (pairSelfFromTrashM) {
    return {
      action: "pairPilot",
      target: {
        owner: "friendly",
        cardType: "unit",
        count: 1,
        ...(pairSelfFromTrashM[1]
          ? {
              attributeFilters: [
                {
                  attribute: "trait" as const,
                  comparison: "includes" as const,
                  value: pairSelfFromTrashM[1].toLowerCase(),
                },
              ],
            }
          : {}),
      },
    };
  }
  const pairEventCardM = t.match(
    /^pair that card from your trash with one of your Units with "([^"]+)" in its card name\.?$/i,
  );
  if (pairEventCardM) {
    return {
      action: "pairEventCardAsPilot",
      target: {
        owner: "friendly",
        cardType: "unit",
        count: 1,
        attributeFilters: [{ attribute: "name", comparison: "includes", value: pairEventCardM[1] }],
      },
    };
  }

  // ── Deploy from trash ──
  const deployTrashM = t.match(
    /[Dd]eploy (\d+) (?:Unit card )?(?:that is Lv\.?\s*(\d+) or lower )?from your trash/i,
  );
  if (deployTrashM)
    return {
      action: "deployFromTrash",
      ...(deployTrashM[2] ? { levelAtMost: parseInt(deployTrashM[2]) } : {}),
      payCost: /pay its cost/i.test(t),
    };

  const chooseDeployTrashM = t.match(
    /[Cc]hoose\s+(\d+)\s+(.+?)\s+from your trash\.\s*Pay its cost to deploy it\.?$/i,
  );
  if (chooseDeployTrashM) {
    return {
      action: "deployFromTrash",
      target: parseTargetFilter(
        `${chooseDeployTrashM[1]} ${chooseDeployTrashM[2]} from your trash`,
      ),
      payCost: true,
    };
  }

  // ── Add from trash ──
  const addTrashM = t.match(
    /[Aa]dd (?:(?:it|them|(\d+) (?:\(([^)]+)\) )?(?:[\w\s]+?) card)s?) (?:among them )?(?:from your trash )?to your hand/i,
  );
  if (addTrashM && lower.includes("trash")) {
    const tf: TargetFilter = { owner: "friendly" };
    if (addTrashM[1]) tf.count = parseInt(addTrashM[1]);
    const addTrashFilters: AttributeFilter[] = [
      { attribute: "zone", comparison: "eq", value: "trash" },
    ];
    if (addTrashM[2])
      addTrashFilters.push({
        attribute: "trait",
        comparison: "includes",
        value: addTrashM[2].toLowerCase(),
      });
    tf.attributeFilters = addTrashFilters;
    return { action: "addFromTrash", target: tf };
  }
  if (/^add it to your hand\.?$/i.test(t)) {
    return {
      action: "addFromTrash",
      target: { owner: "friendly", zone: "trash" },
    };
  }

  const returnSelfDeckM = t.match(
    /return this (?:Unit|card) to the (top|bottom) of its owner['’]s deck/i,
  );
  if (returnSelfDeckM)
    return {
      action: "returnToDeck",
      position: returnSelfDeckM[1].toLowerCase() as "top" | "bottom",
      target: { owner: "self", cardType: "unit" },
    };

  // Reveal a hand card, then route that exact card to the bottom of deck.
  const revealReturnBottomM = t.match(
    /reveal (\d+) \(([^)]+)\) ([\w ]+?) card from your hand\.\s*return it to the bottom of your deck/i,
  );
  if (revealReturnBottomM) {
    const cardType = parseCardType(revealReturnBottomM[3]);
    return {
      action: "returnToDeck",
      position: "bottom",
      target: {
        owner: "friendly",
        zone: "hand",
        count: parseInt(revealReturnBottomM[1]),
        ...(cardType ? { cardType } : {}),
        attributeFilters: [
          {
            attribute: "trait",
            comparison: "includes",
            value: revealReturnBottomM[2].toLowerCase(),
          },
        ],
      },
    };
  }

  // ── Look at top deck ──
  const lookM = t.match(/[Ll]ook at the top (?:(\d+) cards?|card) of your deck/);
  if (lookM) {
    const count = lookM[1] ? parseInt(lookM[1]) : 1;
    // Check for tutor clause: "You may reveal 1 (Trait) Unit/Pilot card among them and add it to your hand"
    const tutorM = t.match(
      /reveal (\d+) (?:\(([^)]+)\)\/?\(([^)]+)\) )?([\w ]+?) card.*?add it to your hand/i,
    );
    let tutorFilter: TargetFilter | undefined;
    const singleTraitTutorM = t.match(
      /reveal (\d+) \(([^)]+)\) (Unit card\/(?:Pilot|Command) card|[\w ]+? card).*?(?:add it to your hand|return it to the top of your deck)/i,
    );
    const coloredTraitTutorM = t.match(
      /reveal (\d+) (blue|green|red|white|purple) \(([^)]+)\) ([\w ]+?) card among them and add it to your hand/i,
    );
    const coloredTraitOrNamedTutorM = t.match(
      /reveal (\d+) (blue|green|red|white|purple) \(([^)]+)\) Unit card\/\d+ card with "([^"]+)" in its card name among them and add it to your hand/i,
    );
    const conditionalTopCardM = t.match(
      /if it is a \(([^)]+)\)(?:\/\(([^)]+)\))?\s*(Unit|Pilot|Command|Base)?\s*card, you may reveal it and add it to your hand/i,
    );
    const deployTutorM = t.match(
      /you may deploy (\d+) \(([^)]+)\) (Unit) card that is Lv\.?\s*(\d+) or lower among them/i,
    );
    if (coloredTraitOrNamedTutorM) {
      tutorFilter = {
        owner: "friendly",
        count: Number.parseInt(coloredTraitOrNamedTutorM[1], 10),
        attributeFilters: [
          {
            attribute: "or",
            filters: [
              {
                attribute: "and",
                filters: [
                  { attribute: "cardType", comparison: "eq", value: "unit" },
                  {
                    attribute: "color",
                    comparison: "eq",
                    value: coloredTraitOrNamedTutorM[2].toLowerCase(),
                  },
                  {
                    attribute: "trait",
                    comparison: "includes",
                    value: coloredTraitOrNamedTutorM[3].toLowerCase(),
                  },
                ],
              },
              {
                attribute: "name",
                comparison: "includes",
                value: coloredTraitOrNamedTutorM[4],
              },
            ],
          },
        ],
      };
    } else if (deployTutorM) {
      tutorFilter = {
        owner: "friendly",
        count: Number.parseInt(deployTutorM[1], 10),
        cardType: "unit",
        attributeFilters: [
          { attribute: "trait", comparison: "includes", value: deployTutorM[2].toLowerCase() },
          { attribute: "level", comparison: "lte", value: Number.parseInt(deployTutorM[4], 10) },
        ],
      };
    } else if (coloredTraitTutorM) {
      tutorFilter = {
        owner: "friendly",
        count: Number.parseInt(coloredTraitTutorM[1], 10),
        cardType: parseCardType(coloredTraitTutorM[4]) ?? undefined,
        attributeFilters: [
          {
            attribute: "color",
            comparison: "eq",
            value: coloredTraitTutorM[2].toLowerCase(),
          },
          {
            attribute: "trait",
            comparison: "includes",
            value: coloredTraitTutorM[3].toLowerCase(),
          },
        ],
      };
    } else if (singleTraitTutorM) {
      const levelM = singleTraitTutorM[0].match(
        /that is Lv\.?\s*(\d+)(?:\s+or\s+(lower|higher))?/i,
      );
      const levelComparison: "eq" | "lte" | "gte" =
        levelM?.[2]?.toLowerCase() === "lower"
          ? "lte"
          : levelM?.[2]?.toLowerCase() === "higher"
            ? "gte"
            : "eq";
      const levelAttributeFilters: AttributeFilter[] = levelM
        ? [{ attribute: "level", comparison: levelComparison, value: +levelM[1] }]
        : [];
      tutorFilter = {
        owner: "friendly",
        count: parseInt(singleTraitTutorM[1]),
        cardType: /unit card\/(?:pilot|command) card/i.test(singleTraitTutorM[3])
          ? /unit card\/command card/i.test(singleTraitTutorM[3])
            ? ["unit", "command"]
            : ["unit", "pilot"]
          : (parseCardType(singleTraitTutorM[3]) ?? undefined),
        attributeFilters: [
          {
            attribute: "trait",
            comparison: "includes",
            value: singleTraitTutorM[2].toLowerCase(),
          },
          ...levelAttributeFilters,
        ],
      };
    } else if (conditionalTopCardM) {
      const traits = [conditionalTopCardM[1], conditionalTopCardM[2]].filter(Boolean);
      tutorFilter = {
        owner: "friendly",
        count: 1,
        ...(conditionalTopCardM[3]
          ? {
              cardType: conditionalTopCardM[3].toLowerCase() as
                | "unit"
                | "pilot"
                | "command"
                | "base",
            }
          : {}),
        attributeFilters:
          traits.length === 1
            ? [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: traits[0]!.toLowerCase(),
                },
              ]
            : [
                {
                  attribute: "or",
                  filters: traits.map((trait) => ({
                    attribute: "trait" as const,
                    comparison: "includes" as const,
                    value: trait!.toLowerCase(),
                  })),
                },
              ],
      };
    }
    if (!tutorFilter && tutorM) {
      tutorFilter = { owner: "friendly", count: parseInt(tutorM[1]) };
      // traits from the reveal clause
      const traits = [tutorM[2], tutorM[3]].filter(Boolean);
      if (traits.length === 1)
        tutorFilter.attributeFilters = [
          { attribute: "trait", comparison: "includes", value: traits[0].toLowerCase() },
        ];
      else if (traits.length >= 2)
        tutorFilter.attributeFilters = [
          {
            attribute: "or",
            filters: traits.map((trait) => ({
              attribute: "trait" as const,
              comparison: "includes" as const,
              value: trait.toLowerCase(),
            })),
          },
        ];
      if (/Unit card\/Pilot card/i.test(tutorM[0])) {
        tutorFilter.cardType = ["unit", "pilot"];
      } else {
        const ct = parseCardType(tutorM[4]);
        if (ct) tutorFilter.cardType = ct;
      }
    }

    const returnStr = /return (?:1 to the top and 1 to the bottom|it to the top or bottom)/i.test(t)
      ? "topAndBottom"
      : /return it to the top of your deck or place it into your trash/i.test(t)
        ? "topOrTrash"
        : "chooseTop";
    return {
      action: "lookAtTopDeck",
      count,
      return: returnStr,
      ...(/randomly to the bottom/i.test(t) ? { randomizeRemainingToBottom: true } : {}),
      ...(/place the remaining cards? into your trash/i.test(t)
        ? { remainingDestination: "trash" as const }
        : /return the remaining cards? to the bottom of your deck/i.test(t)
          ? { remainingDestination: "bottom" as const }
          : {}),
      ...(tutorFilter ? { tutorFilter } : {}),
      ...(/may reveal \d+ .+? among them and return it to the top of your deck/i.test(t)
        ? { tutorDestination: "deckTop" as const }
        : {}),
      ...(deployTutorM ? { tutorDestination: "battleArea" as const } : {}),
    };
  }

  // ── Exile ──
  const exileFromTrashM = t.match(
    /^Exile (\d+) (?:\(([^)]+)\) )?([\w]+) cards? from your trash\.?$/i,
  );
  if (exileFromTrashM) {
    const cardType = parseCardType(exileFromTrashM[3]);
    return {
      action: "exile",
      target: {
        owner: "friendly",
        zone: "trash",
        count: Number.parseInt(exileFromTrashM[1], 10),
        ...(cardType ? { cardType } : {}),
        ...(exileFromTrashM[2]
          ? {
              attributeFilters: [
                {
                  attribute: "trait" as const,
                  comparison: "includes" as const,
                  value: exileFromTrashM[2].toLowerCase(),
                },
              ],
            }
          : {}),
      },
    };
  }
  const exileM = t.match(/[Ee]xile (?:it|them|(\d+)[\w\s]+) from the game/);
  if (exileM) {
    const tf = parseTargetFilter(t);
    return { action: "exile", target: tf };
  }

  // ── Destroy ──
  const destroyM = t.match(/[Dd]estroy (?:it|that enemy Unit|all(?:\s+\w+)? Units?)/);
  if (destroyM || /^Destroy\b/.test(t)) {
    const tf = parseTargetFilter(t);
    if (/^Destroy all\b/i.test(t)) tf.count = "all";
    return { action: "destroy", target: tf };
  }

  // ── Return to hand ──
  if (/^return the enemy Unit to its owner['’]s hand\.?$/i.test(t)) {
    return { action: "returnToHand", target: { owner: "opponent", cardType: "unit", count: 1 } };
  }
  if (/[Rr]eturn (?:it|them) to (?:its?|their) owners?[’']?s? hands?/.test(t)) {
    const tf = parseTargetFilter(t);
    return { action: "returnToHand", target: tf };
  }

  // ── Rest ──
  // Keep mixed friendly/enemy choices as two distinct directives.  The
  // target-selection runtime coalesces those directives into visible groups,
  // preserving the printed requirement to choose one card from each side.
  const mixedOwnerRestM = t.match(
    /^(You may )?choose (\d+ .*?\b(?:of your|friendly)\b .*?Units?(?: with .+?)?) and (\d+ enemy Units?(?: that is .+?)?)\. Rest them\.?$/i,
  );
  if (mixedOwnerRestM) {
    // `parseSingleAction` has a one-action return type.  Let parseSteps
    // handle this multi-directive sentence instead of collapsing it below.
    return undefined;
  }
  if (/^[Rr]est (?:it|them|this (?:Unit|Base))/.test(t)) {
    const tf = parseTargetFilter(t);
    if (/^[Rr]est this Base\b/.test(t)) {
      tf.state = "active";
      tf.count = 1;
    }
    return { action: "rest", target: tf };
  }
  // "Choose N enemy Unit ... Rest it/them."
  if (/^[Cc]hoose/.test(t) && lower.includes("rest it")) {
    const tf = parseTargetFilter(t);
    return { action: "rest", target: tf };
  }
  if (/^[Cc]hoose/.test(t) && lower.includes("rest them")) {
    const tf = parseTargetFilter(t);
    return { action: "rest", target: tf };
  }

  // ── Set as active ──
  if (/[Ss]et (?:it|this Unit) as active/.test(t)) {
    const tf = /\b[Ss]et this Unit as active\b/.test(t)
      ? { owner: "self" as TargetOwner, cardType: "unit" as const }
      : /\b[Ss]et it as active\b/.test(t)
        ? { owner: "self" as TargetOwner }
        : parseTargetFilter(t);
    return { action: "setActive", target: tf };
  }

  // ── Deal damage ──
  const damageFirstOpponentShieldM = t.match(
    /deal (\d+) damage to the first card in your opponent'?s? shield area\.?$/i,
  );
  if (damageFirstOpponentShieldM) {
    return {
      action: "dealDamageToFirstOpponentShield",
      amount: Number.parseInt(damageFirstOpponentShieldM[1], 10),
    };
  }
  const damageBySourceStatM = t.match(
    /^Choose (.+?)\. Deal (\d+) damage to it for each (\d+) (AP|HP) this Unit has\.?$/i,
  );
  if (damageBySourceStatM) {
    return {
      action: "dealDamageBySourceStat",
      stat: damageBySourceStatM[4]!.toLowerCase() as "ap" | "hp",
      divisor: Number.parseInt(damageBySourceStatM[3], 10),
      damagePerStep: Number.parseInt(damageBySourceStatM[2], 10),
      target: parseTargetFilter(damageBySourceStatM[1]!),
    };
  }
  // "Deal N damage to all Units with <Blocker>"
  const dmgAllM = t.match(/[Dd]eal (\d+) damage to all (.+)$/);
  if (dmgAllM) {
    const tf = parseTargetFilter(dmgAllM[2]);
    return {
      action: "dealDamageAll",
      amount: parseInt(dmgAllM[1]),
      target: { ...tf, count: "all" },
    };
  }
  // "Deal N damage to it/them/target"
  const dmgM = t.match(
    /[Dd]eal (\d+) damage to (it|a card in that opponent'?s? shield area|(?:1 )?(?:enemy )?(?:Unit|damaged enemy Unit)?)/i,
  );
  if (dmgM) {
    const targetText = dmgM[2].toLowerCase().includes("shield")
      ? "1 card in opponent's shield area"
      : t;
    const tf = targetText.includes("shield")
      ? { owner: "opponent" as TargetOwner, zone: "shieldArea" as const, count: 1 }
      : parseTargetFilter(t);
    return { action: "dealDamage", amount: parseInt(dmgM[1]), target: tf };
  }
  // "Deal 2 damage to it" with subject being from earlier choose clause
  if (/deal damage to it equal to the number of friendly Unit tokens in play/i.test(t)) {
    return {
      action: "dealDamageByCount",
      countFilter: { owner: "friendly", cardType: "unit", isToken: true, zone: "battleArea" },
      target: { owner: "self", cardType: "unit", count: 1 },
    };
  }
  if (lower.includes("deal") && lower.includes("damage")) {
    const amtM = t.match(/(\d+) damage/);
    if (amtM) {
      const tf = parseTargetFilter(t);
      return { action: "dealDamage", amount: parseInt(amtM[1]), target: tf };
    }
  }

  // ── Recover HP ──
  const recoverM = t.match(/(?:it )?[Rr]ecovers? (\d+) HP/);
  if (recoverM) {
    const tf = parseTargetFilter(t);
    return { action: "recoverHP", amount: parseInt(recoverM[1]), target: tf };
  }

  // ── Grant keyword ──
  // "it gains <Breach 3> during this turn"
  const grantKwM = t.match(/(?:it |this Unit )?gains? <([\w\s-]+?)(?:\s+(\d+))?>/i);
  if (grantKwM) {
    const kw = parseKeywordEffectName(grantKwM[1]);
    if (kw) {
      const target = /^(?:this Unit|this|it) gains?/i.test(t)
        ? { owner: "self" as TargetOwner, cardType: "unit" as const }
        : parseTargetFilter(t);
      // The keyword in "all Units gain <Blocker>" is what is granted,
      // not an eligibility predicate on recipients.
      delete target.hasKeyword;
      delete target.lacksKeyword;
      return {
        action: "grantKeyword",
        keyword: kw,
        ...(grantKwM[2] ? { keywordValue: parseInt(grantKwM[2]) } : {}),
        duration: parseDuration(t),
        target,
      };
    }
  }

  const grantTraitM = t.match(/^(All your Units|this Unit) gains? \(([^)]+)\)\.?$/i);
  if (grantTraitM) {
    return {
      action: "grantTrait",
      trait: grantTraitM[2].toLowerCase(),
      duration: parseDuration(t),
      target: /^this Unit$/i.test(grantTraitM[1])
        ? { owner: "self", cardType: "unit" }
        : { owner: "friendly", cardType: "unit", count: "all" },
    };
  }

  // ── Stat modifier ──
  // "it gets AP+2 during this turn" / "All your Units get AP+2 during this turn"
  // Note: cost can have a space before the sign: "gets cost -1"
  //
  // Conditional cost reductions ("While X, this card in your hand gets
  // cost -N", e.g. GD01-016 Jegan / GD01-070 Gundam Aerial) now use the
  // dedicated `costReduction` action shape (see EffectAction in types).
  // The engine's `computeEffectiveCostInHand` consumes both the legacy
  // `statModifier { stat: "cost" }` path AND the new `costReduction`
  // action. New card data should prefer `costReduction` for clarity.
  //
  const selfCostReductionM = t.match(/^this card in your (hand|trash) gets cost\s*-([0-9]+)\.?$/i);
  if (selfCostReductionM) {
    return {
      action: "costReduction",
      amount: Number.parseInt(selfCostReductionM[2], 10),
      target: { owner: "self", zone: selfCostReductionM[1].toLowerCase() as "hand" | "trash" },
    };
  }

  // For "X Units cost N less to play" phrasings, emit `costReduction` with
  // the appropriate target filter.
  const countedHandCostM = t.match(
    /^Reduce the cost of this card in your hand by an amount equal to the number of ((?:\([^)]+\)\/)*\([^)]+\)) ([\w]+) cards? in your trash\.?$/i,
  );
  if (countedHandCostM) {
    const traits = Array.from(countedHandCostM[1].matchAll(/\(([^)]+)\)/g)).map((m) =>
      m[1].toLowerCase(),
    );
    const cardType = parseCardType(countedHandCostM[2]);
    return {
      action: "costReductionByCount",
      amountPerMatch: 1,
      countFilter: {
        owner: "friendly",
        zone: "trash",
        ...(cardType ? { cardType } : {}),
        attributeFilters: [
          {
            attribute: "or",
            filters: traits.map((value) => ({
              attribute: "trait" as const,
              comparison: "includes" as const,
              value,
            })),
          },
        ],
      },
      target: { owner: "self", zone: "hand", cardType: "unit" },
    };
  }

  const uniqueTrashStatM = t.match(
    /^Increase this Unit['’]s (AP|HP) by an amount equal to the number of \(([^)]+)\) ([\w]+) cards?\/([\w]+) cards? with unique names in your trash\.?$/i,
  );
  if (uniqueTrashStatM) {
    const firstType = parseCardType(uniqueTrashStatM[3]);
    const secondType = parseCardType(uniqueTrashStatM[4]);
    return {
      action: "statModifierByUniqueNameCount",
      countFilter: {
        owner: "friendly",
        zone: "trash",
        ...(firstType && secondType ? { cardType: [firstType, secondType] } : {}),
        attributeFilters: [
          {
            attribute: "trait",
            comparison: "includes",
            value: uniqueTrashStatM[2].toLowerCase(),
          },
        ],
      },
      stat: uniqueTrashStatM[1].toLowerCase() as "ap" | "hp",
      amountPerUniqueName: 1,
      duration: "permanent",
      target: { owner: "self", cardType: "unit" },
    };
  }

  const eventPaidCostStatM = t.match(
    /^increase this Unit['’]s (AP|HP) during this turn by an amount equal to the cost paid\.?$/i,
  );
  if (eventPaidCostStatM) {
    return {
      action: "statModifierByEventPaidCost",
      stat: eventPaidCostStatM[1].toLowerCase() as "ap" | "hp",
      duration: "thisTurn",
      target: { owner: "self", cardType: "unit" },
    };
  }

  const otherFriendlyExactLevelStatM = t.match(
    /^all other \(([^)]+)\) Units that are Lv\.?\s*(\d+) get\s+(AP|HP|cost)\s*([+-])\s*(\d+)/i,
  );
  if (otherFriendlyExactLevelStatM) {
    return {
      action: "statModifier",
      stat: otherFriendlyExactLevelStatM[3].toLowerCase() as "ap" | "hp" | "cost",
      amount: Number.parseInt(
        otherFriendlyExactLevelStatM[4]! + otherFriendlyExactLevelStatM[5]!,
        10,
      ),
      duration: parseDuration(t),
      target: {
        owner: "friendly",
        cardType: "unit",
        count: "all",
        excludeSource: true,
        attributeFilters: [
          {
            attribute: "trait",
            comparison: "includes",
            value: otherFriendlyExactLevelStatM[1]!.toLowerCase(),
          },
          {
            attribute: "level",
            comparison: "eq",
            value: Number.parseInt(otherFriendlyExactLevelStatM[2]!, 10),
          },
        ],
      },
    };
  }
  const statM = t.match(/gets?\s+(AP|HP|cost)\s*([+-])\s*(\d+)/i);
  if (statM) {
    const stat = statM[1].toLowerCase() as "ap" | "hp" | "cost";
    const amount = parseInt(statM[2] + statM[3]);
    const target = /\bthis\s+(?:Unit|Base|card\s*)?gets?\b/i.test(t)
      ? { owner: "self" as const }
      : parseTargetFilter(t);
    return {
      action: "statModifier",
      stat,
      amount,
      duration: parseDuration(t),
      target,
    };
  }

  // ── Prevent stat reduction ──
  if (/AP can'?t be reduced by enemy effects/i.test(t))
    return {
      action: "preventStatReduction",
      stat: "ap",
      target: { owner: "self" },
      source: "enemy",
    };

  // ── Prevent damage ──
  // "When this Unit receives effect damage from an enemy, reduce it by 2."
  // This is encoded as a constant damage-reduction modifier; the battle/effect
  // damage resolver evaluates `reduceNextDamage` inline when damage is applied.
  const reduceDamageM = t.match(/reduce it by (\d+)/i);
  const reduceNextDamageM = t.match(/reduce the next (?:battle )?damage it receives by (\d+)/i);
  const reduceReceivedDamageM = t.match(/reduce (?:battle |effect )?damage it receives by (\d+)/i);
  if (
    (reduceDamageM || reduceNextDamageM || reduceReceivedDamageM) &&
    /receives? (?:enemy )?(?:effect |battle )?damage|(?:effect |battle )?damage it receives/i.test(
      t,
    )
  ) {
    return {
      action: "reduceNextDamage",
      amount: parseInt((reduceDamageM ?? reduceNextDamageM ?? reduceReceivedDamageM)![1]),
      ...(t.match(/If you use an EX Resource to play this card, reduce by (\d+) instead/i)
        ? {
            exResourceAmount: Number.parseInt(
              t.match(/If you use an EX Resource to play this card, reduce by (\d+) instead/i)![1],
              10,
            ),
          }
        : {}),
      target: { owner: "self" },
      ...(/effect damage/i.test(t) ? { damageType: "effect" as const } : {}),
      ...(/battle damage/i.test(t) ? { damageType: "battle" as const } : {}),
      ...(/from an enemy|enemy damage|enemy effect|enemy Unit/i.test(t)
        ? { source: "enemy" as const }
        : {}),
      duration: parseDuration(t),
    };
  }

  // "friendly Shields can't receive battle damage from enemy Units"
  // Shields are the face-down cards in the Shield section, not every card in
  // the rules-level shield area (which also contains the Base section).
  const shieldDmgM = t.match(
    /(?:friendly\s+)?Shields? can'?t receive (?:battle )?damage from (.+?)\.?$/i,
  );
  if (shieldDmgM) {
    const unitFilter = parseTargetFilter(shieldDmgM[1].trim());
    if (unitFilter.owner === "any") unitFilter.owner = "opponent";
    return {
      action: "preventDamageToZone",
      protectedArea: { kind: "zone", zone: "shieldArea" },
      unitFilter,
      duration: parseDuration(t),
    };
  }

  // "this Unit can't receive battle damage from enemy Units with 3 or less AP"
  const preventDmgM = t.match(/can'?t receive battle damage from (.+)/i);
  if (preventDmgM) {
    const unitFilter = parseTargetFilter(preventDmgM[1]);
    if (unitFilter.owner === "any") unitFilter.owner = "opponent";
    if (!unitFilter.cardType) unitFilter.cardType = "unit";
    return {
      action: "preventDamage",
      target: { owner: "self" },
      unitFilter,
      damageType: "battle",
      duration: parseDuration(t),
    };
  }

  const preventSmallEffectDamageM = t.match(
    /^friendly ((?:\([^)]+\)\/)*\([^)]+\)) Units? can'?t receive (\d+) or less enemy effect damage\.?$/i,
  );
  if (preventSmallEffectDamageM) {
    const traits = Array.from(preventSmallEffectDamageM[1].matchAll(/\(([^)]+)\)/g)).map((m) =>
      m[1].toLowerCase(),
    );
    return {
      action: "preventDamage",
      target: {
        owner: "friendly",
        cardType: "unit",
        count: "all",
        attributeFilters: [
          traits.length === 1
            ? { attribute: "trait", comparison: "includes", value: traits[0] }
            : {
                attribute: "or",
                filters: traits.map((value) => ({
                  attribute: "trait" as const,
                  comparison: "includes" as const,
                  value,
                })),
              },
        ],
      },
      damageType: "effect",
      source: "enemy",
      maxDamageAmount: Number.parseInt(preventSmallEffectDamageM[2], 10),
      duration: "permanent",
    };
  }

  if (/this Unit can'?t receive battle damage\.?$/i.test(t)) {
    return {
      action: "preventDamage",
      target: { owner: "self", cardType: "unit" },
      damageType: "battle",
      duration: parseDuration(t),
    };
  }

  if (/this Unit can'?t receive enemy battle damage\.?$/i.test(t)) {
    return {
      action: "preventDamage",
      target: { owner: "self", cardType: "unit" },
      damageType: "battle",
      source: "enemy",
      duration: parseDuration(t),
    };
  }

  if (/it can'?t receive battle damage during this battle\.?$/i.test(t)) {
    return {
      action: "preventDamage",
      target: { owner: "self", cardType: "unit" },
      damageType: "battle",
      duration: "thisBattle",
    };
  }

  if (/this Unit can'?t receive effect damage from enemy Commands?\.?$/i.test(t)) {
    return {
      action: "preventDamage",
      target: { owner: "self", cardType: "unit" },
      damageType: "effect",
      source: "enemy",
      sourceCardType: "command",
      duration: parseDuration(t),
    };
  }

  const preventAnyDmgM = t.match(/this (?:Base|Unit) can'?t receive damage from (.+)/i);
  if (preventAnyDmgM) {
    const unitFilter = parseTargetFilter(preventAnyDmgM[1]);
    if (unitFilter.owner === "any") unitFilter.owner = "opponent";
    if (!unitFilter.cardType) unitFilter.cardType = "unit";
    return {
      action: "preventDamage",
      target: { owner: "self" },
      unitFilter,
      duration: parseDuration(t),
    };
  }

  const preventEnemyEffectDamageM = t.match(
    /this (Base|Unit) can(?:'|’)?t receive enemy effect damage\.?$/i,
  );
  if (preventEnemyEffectDamageM) {
    return {
      action: "preventDamage",
      target: {
        owner: "self",
        cardType: preventEnemyEffectDamageM[1].toLowerCase() as "base" | "unit",
      },
      damageType: "effect",
      source: "enemy",
      duration: parseDuration(t),
    };
  }

  // ── Prevent damage to a zone ──
  // "your shield area cards can't receive damage from enemy Units that are Lv.N or lower"
  const zoneDmgM = t.match(/shield area cards? can'?t receive damage from (.+?)\.?$/i);
  if (zoneDmgM) {
    const unitFilter = parseTargetFilter(zoneDmgM[1].trim());
    // Ensure captured unit description is parsed as opponent units
    if (unitFilter.owner === "any") unitFilter.owner = "opponent";
    return {
      action: "preventDamageToZone",
      protectedArea: { kind: "shieldArea" },
      unitFilter,
      duration: parseDuration(t),
    };
  }

  // ── Can't attack ──
  if (/can'?t attack/i.test(t)) {
    const tf = parseTargetFilter(t);
    return { action: "cantAttack", duration: parseDuration(t), target: tf };
  }

  // ── Can't target player ──
  if (
    /can'?t choose (?:the(?: same)?|that same) enemy player(?: or enemy team)? as its attack target/i.test(
      t,
    )
  ) {
    return { action: "cantTargetPlayer", whose: "opponent" };
  }

  // ── Redirect an ongoing attack ──
  if (/change the attack target of the battling enemy Unit to it/i.test(t)) {
    return {
      action: "changeAttackTarget",
      target: { owner: "friendly", cardType: "unit", count: 1 },
    };
  }

  if (/change a battling enemy Unit[’']?s attack target to it/i.test(t)) {
    return {
      action: "changeAttackTarget",
      target: { owner: "friendly", cardType: "unit", count: 1 },
    };
  }

  if (/all enemy Units must choose that Unit as their attack target when attacking/i.test(t)) {
    return {
      action: "forceAttackTarget",
      unit: { owner: "opponent", cardType: "unit", count: "all" },
      attackTarget: parseTargetFilter(t),
      duration: parseDuration(t),
    };
  }

  const forceRestedTraitM = t.match(
    /^Enemy Units choose one of your rested \(([^)]+)\) Units as their attack target if possible when attacking\.?$/i,
  );
  if (forceRestedTraitM) {
    return {
      action: "forceAttackTarget",
      unit: { owner: "opponent", cardType: "unit", count: "all" },
      attackTarget: {
        owner: "friendly",
        cardType: "unit",
        state: "rested",
        attributeFilters: [
          {
            attribute: "trait",
            comparison: "includes",
            value: forceRestedTraitM[1].toLowerCase(),
          },
        ],
      },
      duration: "permanent",
    };
  }

  if (
    /^Enemy Units choose this rested Unit as their attack target if possible when attacking\.?$/i.test(
      t,
    )
  ) {
    return {
      action: "forceAttackTarget",
      unit: { owner: "opponent", cardType: "unit", count: "all" },
      attackTarget: { owner: "self", cardType: "unit", state: "rested", count: 1 },
      duration: parseDuration(t),
    };
  }

  if (
    /^Enemy Units other than Link Units choose this rested Unit as their attack target if possible when attacking\.?$/i.test(
      t,
    )
  ) {
    return {
      action: "forceAttackTarget",
      unit: { owner: "opponent", cardType: "unit", count: "all", isLinkUnit: false },
      attackTarget: { owner: "self", cardType: "unit", state: "rested", count: 1 },
      duration: parseDuration(t),
    };
  }

  if (/it may attack on the turn it is deployed/i.test(t)) {
    return {
      action: "allowAttackDeployedThisTurn",
      target: parseTargetFilter(t),
      duration: "thisTurn",
    };
  }

  const blockerLevelRestrictionM = t.match(
    /^Units? that (?:are )?Lv\.(\d+) or lower can'?t activate <Blocker> during this battle\.?$/i,
  );
  if (blockerLevelRestrictionM) {
    return {
      action: "restrictUnit",
      target: {
        owner: "any",
        cardType: "unit",
        count: "all",
        attributeFilters: [
          {
            attribute: "level",
            comparison: "lte",
            value: Number.parseInt(blockerLevelRestrictionM[1], 10),
          },
        ],
      },
      restrictions: ["cannotActivateBlocker"],
      duration: "thisBattle",
    };
  }

  if (/it can'?t activate <Blocker> during this turn/i.test(t)) {
    return {
      action: "restrictUnit",
      target: parseTargetFilter(t),
      restrictions: ["cannotActivateBlocker"],
      duration: "thisTurn",
    };
  }

  if (/battle damage this Unit would receive is dealt to that Unit instead/i.test(t)) {
    return {
      action: "redirectBattleDamage",
      target: { owner: "self", cardType: "unit", count: 1 },
      redirectTo: parseTargetFilter(t),
      duration: parseDuration(t),
    };
  }

  if (/battle damage it would receive is dealt to this Unit instead/i.test(t)) {
    return {
      action: "redirectBattleDamage",
      target: parseTargetFilter(t),
      redirectTo: { owner: "self", cardType: "unit", count: 1 },
      duration: parseDuration(t),
    };
  }

  const chosenUnitPreventEffectDamageM = t.match(
    /^Choose\s+(.+?)\.\s*It can'?t receive effect damage from enemy Units(?:\s+during|\.|$)/i,
  );
  if (/it can'?t receive effect damage from enemy Units/i.test(t)) {
    if (/enemy Units?\s+(?:that are|with)\b/i.test(t)) {
      return {
        action: "preventDamage",
        target: { owner: "self", cardType: "unit" },
        unitFilter: parseTargetFilter(t.replace(/^.*?from\s+/i, "")),
        damageType: "effect",
        source: "enemy",
        duration: parseDuration(t),
      };
    }
    return {
      action: "preventDamage",
      target: chosenUnitPreventEffectDamageM
        ? parseTargetFilter(chosenUnitPreventEffectDamageM[1])
        : { owner: "self", cardType: "unit" },
      damageType: "effect",
      sourceCardType: "unit",
      unitFilter: { owner: "opponent", cardType: "unit" },
      duration: parseDuration(t),
    };
  }

  // ── Prevent readying at the opponent's next Start Phase ──
  if (/it won(?:['’]\s*|\s*)t be set as active during the start phase/i.test(t)) {
    return {
      action: "preventActive",
      target: { owner: "opponent", cardType: "unit", count: 1 },
    };
  }

  // ── Prevent destruction ──
  if (/can'?t be destroyed by enemy effects/i.test(t)) {
    const target = lower.includes("friendly units")
      ? ({ owner: "friendly", cardType: "unit", count: "all" } as const)
      : parseTargetFilter(t);
    return {
      action: "preventDestroy",
      target,
      source: "enemy",
      duration: parseDuration(t),
    };
  }

  // ── Choose attack target ──
  const attackTargetM = t.match(
    /(it|this unit) may choose (an? .*?enemy Unit.*?) as its attack target/i,
  );
  if (attackTargetM) {
    const attackTarget = parseTargetFilter(attackTargetM[2]);
    const exResourceCountM = t.match(
      /If you use an EX Resource to play this card, choose (\d+) to (\d+) friendly .+ Units instead/i,
    );
    return {
      action: "chooseAttackTarget",
      unit: { owner: "self", cardType: "unit" },
      ...(exResourceCountM
        ? {
            exResourceUnitCount: {
              min: Number.parseInt(exResourceCountM[1], 10),
              max: Number.parseInt(exResourceCountM[2], 10),
            },
          }
        : {}),
      attackTarget,
      duration: parseDuration(t),
    };
  }

  const allAttackTargetM = t.match(
    /all your \(([^)]+)\) Units may choose (an? .*?enemy Unit.*?) as their attack target/i,
  );
  if (allAttackTargetM) {
    return {
      action: "chooseAttackTarget",
      unit: {
        owner: "friendly",
        cardType: "unit",
        count: "all",
        attributeFilters: [
          { attribute: "trait", comparison: "includes", value: allAttackTargetM[1].toLowerCase() },
        ],
      },
      attackTarget: parseTargetFilter(allAttackTargetM[2]),
      duration: parseDuration(t),
    };
  }

  return undefined;
}

// ─────────────────────────────────────────────────────────────────────────────
// Target patching
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Replace the `target` field on any action that carries one.
 * Used to apply a target captured from a preceding "Choose N [target]" clause.
 */
export function patchActionTarget(action: EffectAction, target: TargetFilter): EffectAction {
  switch (action.action) {
    case "recoverHP":
    case "rest":
    case "setActive":
    case "returnToHand":
    case "destroy":
    case "exile":
    case "dealDamage":
    case "dealDamageByCount":
    case "dealDamageByTargetKeyword":
    case "deploy":
    case "grantKeyword":
    case "statModifier":
    case "reduceNextDamage":
    case "cantAttack":
    case "restrictUnit":
    case "preventDestruction":
    case "preventDamage":
    case "addFromTrash":
    case "changeAttackTarget":
    case "preventActive":
    case "allowAttackDeployedThisTurn":
      return { ...action, target };
    case "forceAttackTarget":
      return { ...action, attackTarget: target };
    case "redirectBattleDamage":
      return { ...action, redirectTo: target };
    case "chooseAttackTarget":
      return { ...action, unit: target };
    default:
      return action;
  }
}
