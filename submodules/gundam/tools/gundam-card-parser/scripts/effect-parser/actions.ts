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
  // Lookahead-based split: the "If you do" prefix stays attached to the
  // start of its clause; "Then," is swallowed by a matched-group split.
  const parts = protected_
    .split(/\.\s*Then,?\s+|\.\s+(?=If you do,?\s+)|\.\s+(?=[A-Z])/g)
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

  // ── Draw ──
  const drawM = t.match(/[Dd]raw (\d+)/);
  if (drawM) return { action: "draw", count: parseInt(drawM[1]) };

  // ── Discard ──
  const discardM = t.match(/[Dd]iscard (\d+)/);
  if (discardM) return { action: "discard", count: parseInt(discardM[1]) };

  // ── Add this card to your hand ──
  if (/add this card to your hand/i.test(t)) return { action: "addSelfToHand" };

  // ── Deploy this card ──
  if (/^deploy this card\.?$/i.test(t)) return { action: "deploySelf" };

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

  // ── Place resource ──
  const exResourceM = t.match(/[Pp]lace (\d+) EX [Rr]esource/);
  if (exResourceM) return { action: "placeResource", resourceType: "EX", state: "active" };
  const restedResourceM = t.match(/[Pp]lace (\d+) rested [Rr]esource/);
  if (restedResourceM)
    return {
      action: "placeResource",
      resourceType: "normal",
      state: "rested",
    };
  const activeResourceM = t.match(/[Ss]et (?:this|1 of your) [Rr]esource(?:s)? as active/);
  if (activeResourceM)
    return {
      action: "setActive",
      target: { owner: "friendly", cardType: "resource", count: 1 },
    };

  // ── Mill deck ──
  const millM = t.match(/[Pp]lace the top (\d+) cards? of your deck into your trash/);
  if (millM) return { action: "millDeck", count: parseInt(millM[1]), owner: "self" };

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

  // ── Pair pilot from hand ──
  const pairM = t.match(/pair (\d+) (?:\(([^)]+)\) )?Pilot card from your hand with this Unit/i);
  if (pairM) {
    const tf: TargetFilter = { owner: "friendly", cardType: "pilot", count: parseInt(pairM[1]) };
    if (pairM[2])
      tf.attributeFilters = [
        { attribute: "trait", comparison: "includes", value: pairM[2].toLowerCase() },
      ];
    return { action: "pairPilot", target: tf };
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

  // ── Look at top deck ──
  const lookM = t.match(/[Ll]ook at the top (\d+) cards? of your deck/);
  if (lookM) {
    const count = parseInt(lookM[1]);
    // Check for tutor clause: "You may reveal 1 (Trait) Unit/Pilot card among them and add it to your hand"
    const tutorM = t.match(
      /reveal (\d+) (?:\(([^)]+)\)\/?\(([^)]+)\) )?([\w ]+?) card.*?add it to your hand/i,
    );
    let tutorFilter: TargetFilter | undefined;
    if (tutorM) {
      tutorFilter = { owner: "friendly", count: parseInt(tutorM[1]) };
      // traits from the reveal clause
      const traits = [tutorM[2], tutorM[3]].filter(Boolean);
      if (traits.length === 1)
        tutorFilter.attributeFilters = [
          { attribute: "trait", comparison: "includes", value: traits[0].toLowerCase() },
        ];
      const ct = parseCardType(tutorM[4]);
      if (ct) tutorFilter.cardType = ct;
    }

    const returnStr = /return 1 to the top and 1 to the bottom/i.test(t)
      ? "topAndBottom"
      : "chooseTop";
    return {
      action: "lookAtTopDeck",
      count,
      return: returnStr,
      ...(tutorFilter ? { tutorFilter } : {}),
    };
  }

  // ── Exile ──
  const exileM = t.match(/[Ee]xile (?:it|them|(\d+)[\w\s]+) from the game/);
  if (exileM) {
    const tf = parseTargetFilter(t);
    return { action: "exile", target: tf };
  }

  // ── Destroy ──
  const destroyM = t.match(/[Dd]estroy (?:it|that enemy Unit|all(?:\s+\w+)? Units?)/);
  if (destroyM || /^Destroy\b/.test(t)) {
    const tf = parseTargetFilter(t);
    return { action: "destroy", target: tf };
  }

  // ── Return to hand ──
  if (/[Rr]eturn (?:it|them) to its? owner'?s? hand/.test(t)) {
    const tf = parseTargetFilter(t);
    return { action: "returnToHand", target: tf };
  }

  // ── Rest ──
  if (/^[Rr]est (?:it|them|this Unit)/.test(t)) {
    const tf = parseTargetFilter(t);
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
    const tf = /\b[Ss]et it as active\b/.test(t)
      ? { owner: "self" as TargetOwner }
      : parseTargetFilter(t);
    return { action: "setActive", target: tf };
  }

  // ── Deal damage ──
  // "Deal N damage to all Units with <Blocker>"
  const dmgAllM = t.match(/[Dd]eal (\d+) damage to all ([\w\s<>]+)/);
  if (dmgAllM) {
    const tf = parseTargetFilter(dmgAllM[2]);
    return { action: "dealDamageAll", amount: parseInt(dmgAllM[1]), target: tf };
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
      const target = parseTargetFilter(t);
      return {
        action: "grantKeyword",
        keyword: kw,
        ...(grantKwM[2] ? { keywordValue: parseInt(grantKwM[2]) } : {}),
        duration: parseDuration(t),
        target,
      };
    }
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
  // TODO: for "this card in your hand gets cost -N" phrasings, emit
  // `costReduction` instead of `statModifier`. For "X Units cost N less
  // to play" phrasings, emit `costReduction` with the appropriate target
  // filter.
  const statM = t.match(/gets?\s+(AP|HP|cost)\s*([+-])\s*(\d+)/i);
  if (statM) {
    const stat = statM[1].toLowerCase() as "ap" | "hp" | "cost";
    const amount = parseInt(statM[2] + statM[3]);
    const target = parseTargetFilter(t);
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
    };

  // ── Prevent damage ──
  // "When this Unit receives effect damage from an enemy, reduce it by 2."
  // This is encoded as a constant damage-reduction modifier; the battle/effect
  // damage resolver evaluates `reduceNextDamage` inline when damage is applied.
  const reduceDamageM = t.match(/reduce it by (\d+)/i);
  if (reduceDamageM && /receives? (?:effect |battle )?damage/i.test(t)) {
    return {
      action: "reduceNextDamage",
      amount: parseInt(reduceDamageM[1]),
      target: { owner: "self" },
      ...(/effect damage/i.test(t) ? { damageType: "effect" as const } : {}),
      ...(/battle damage/i.test(t) ? { damageType: "battle" as const } : {}),
      ...(/from an enemy|enemy effect|enemy Unit/i.test(t) ? { source: "enemy" as const } : {}),
      duration: parseDuration(t),
    };
  }

  // "this Unit can't receive battle damage from enemy Units with 3 or less AP"
  const preventDmgM = t.match(
    /can'?t receive battle damage from (?:enemy Units? (?:that are |with )?)?(.+)/i,
  );
  if (preventDmgM) {
    const unitFilter = parseTargetFilter(preventDmgM[1]);
    return {
      action: "preventDamage",
      target: { owner: "self" },
      unitFilter,
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
      zone: "shieldArea",
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
  if (/can'?t choose the enemy player as its attack target/i.test(t)) {
    return { action: "cantTargetPlayer", whose: "opponent" };
  }

  // ── Prevent destruction ──
  if (/can'?t be destroyed by enemy effects/i.test(t)) {
    const target = lower.includes("friendly units")
      ? ({ owner: "friendly", cardType: "unit", count: "all" } as const)
      : parseTargetFilter(t);
    return {
      action: "preventDestruction",
      target,
      source: "enemy",
      cause: "effect",
      duration: parseDuration(t),
    };
  }

  // ── Choose attack target ──
  const attackTargetM = t.match(
    /(?:it|this unit) may choose (an? (?:active )?enemy Unit.+?) as its attack target/i,
  );
  if (attackTargetM) {
    const attackTarget = parseTargetFilter(attackTargetM[1]);
    return {
      action: "chooseAttackTarget",
      unit: { owner: "friendly", count: 1 },
      attackTarget,
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
    case "deploy":
    case "grantKeyword":
    case "statModifier":
    case "reduceNextDamage":
    case "cantAttack":
    case "restrictUnit":
    case "preventDestruction":
      return { ...action, target };
    default:
      return action;
  }
}
