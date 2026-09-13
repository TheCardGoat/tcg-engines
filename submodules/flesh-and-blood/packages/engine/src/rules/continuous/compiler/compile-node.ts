import type { FabCondition, FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabContinuousAtom } from "../ir.ts";
import { compileNumeric } from "./compile-numeric.ts";
import { compileActivationCost } from "./compile-activation-cost.ts";
import { compileProperty } from "./compile-property.ts";
import { compileRule } from "./compile-rule.ts";
import { dependencyStages } from "./dependencies.ts";
import { atomBase, failure } from "./helpers.ts";
import type { CompileCursor, FabContinuousCompileResult } from "./types.ts";

/**
 * Conditions whose has-status markers predicate on the attack participation
 * OF THE SUBJECT ("attacking a Royal hero"). These evaluate per resolved
 * application subject; every other condition keeps the legacy subjectless
 * evaluation (subject = ability source).
 */
function isSubjectRelativeCondition(condition: FabCondition): boolean {
  switch (condition.type) {
    case "has-status":
      // Only attacking-* markers predicate on the granted object (e.g. a
      // latched attack). defending-/defended- markers describe the ability
      // source's own participation and keep legacy source-subject evaluation.
      return /^attacking[-_]/.test(condition.status);
    case "and":
    case "or":
      return condition.conditions.some(isSubjectRelativeCondition);
    case "not":
      return isSubjectRelativeCondition(condition.condition);
    default:
      return false;
  }
}

export function compileNode(effect: FabEffect, cursor: CompileCursor): FabContinuousCompileResult {
  if (
    effect.type !== "conditional" &&
    effect.type !== "optional" &&
    effect.type !== "if-you-do" &&
    "then" in effect &&
    effect.then
  ) {
    return failure(
      cursor.effectId,
      cursor.path,
      "unsupported_mechanic",
      "effect-gated then continuation cannot generate one continuous instance",
    );
  }
  switch (effect.type) {
    case "if-you-do":
      return failure(
        cursor.effectId,
        cursor.path,
        "unsupported_mechanic",
        "if-you-do cannot generate a continuous instance before its event gate is expressible",
      );
    case "sequence": {
      const atoms: FabContinuousAtom[] = [];
      for (let index = 0; index < effect.steps.length; index += 1) {
        const result = compileNode(effect.steps[index]!, {
          ...cursor,
          path: [...cursor.path, "steps", index],
        });
        if (!result.ok) return result;
        atoms.push(...result.atoms);
      }
      return { ok: true, atoms };
    }
    case "conditional": {
      // A subject-relative gate ("if it's attacking a Royal hero") predicates
      // on the object this effect is applied to, so it compiles as a
      // per-application-subject gate instead of merging into the ability-level
      // (subjectless) atom condition. Controller-oriented gates keep the
      // legacy merged path.
      const subjectRelative = isSubjectRelativeCondition(effect.condition);
      if (subjectRelative) {
        const subjectCondition: FabCondition = cursor.subjectCondition
          ? { type: "and", conditions: [cursor.subjectCondition, effect.condition] }
          : effect.condition;
        const thenResult = compileNode(effect.then, {
          ...cursor,
          subjectCondition,
          path: [...cursor.path, "then"],
        });
        if (!thenResult.ok || !effect.else) return thenResult;
        const elseSubjectCondition: FabCondition = {
          type: "and",
          conditions: [
            ...(cursor.subjectCondition ? [cursor.subjectCondition] : []),
            { type: "not", condition: effect.condition },
          ],
        };
        const elseResult = compileNode(effect.else, {
          ...cursor,
          subjectCondition: elseSubjectCondition,
          path: [...cursor.path, "else"],
        });
        return elseResult.ok
          ? { ok: true, atoms: [...thenResult.atoms, ...elseResult.atoms] }
          : elseResult;
      }
      const condition: FabCondition = cursor.condition
        ? { type: "and", conditions: [cursor.condition, effect.condition] }
        : effect.condition;
      const thenResult = compileNode(effect.then, {
        ...cursor,
        condition,
        path: [...cursor.path, "then"],
      });
      if (!thenResult.ok || !effect.else) return thenResult;
      const elseCondition: FabCondition = {
        type: "and",
        conditions: [
          ...(cursor.condition ? [cursor.condition] : []),
          { type: "not", condition: effect.condition },
        ],
      };
      const elseResult = compileNode(effect.else, {
        ...cursor,
        condition: elseCondition,
        path: [...cursor.path, "else"],
      });
      return elseResult.ok
        ? { ok: true, atoms: [...thenResult.atoms, ...elseResult.atoms] }
        : elseResult;
    }
    case "modify-numeric":
      return compileNumeric(effect, cursor);
    case "modify-activation-cost":
      return compileActivationCost(effect, cursor);
    case "grant-property":
    case "remove-property":
      return compileProperty(effect, cursor);
    case "rule-modification": {
      // Keep the authored limit verbatim — a dynamic FabAmount count
      // ("X is the number of Evos you have equipped", CR 8.4.11) must
      // survive compilation; the rules view resolves it in the effect
      // controller's seat at evaluation time. Dropping it here degenerated
      // the required count to 1 (EVO059 Meganetic Protocol).
      const limit = effect.limit ? { count: effect.limit.count } : undefined;
      const explicitSubjectTarget =
        effect.subject && "selector" in effect.subject ? effect.subject : null;
      // Printed "must choose this as the target of attacks if able" (Chum,
      // Arc Light Sentinel) omits an explicit subject. CR 1.4.5a / 8.2.8:
      // the required attack-target is the source itself.
      const subjectTarget =
        explicitSubjectTarget ??
        (effect.action === "be-attacked" ? { selector: "self" as const } : null) ??
        // Crush Confidence / Humble / Sleep Dart omit a subject. The printed
        // "they" is the hit or damaged hero (attack-target).
        (effect.action === "lose-abilities" ? { selector: "attack-target" as const } : null);
      const subjectFilter =
        effect.subject && !("selector" in effect.subject) ? effect.subject : null;
      // Data-driven defender-count cap (Confidence CR 8.6.35 "can't be defended
      // by more than N non-block cards"). Carry it on the rule atom so the defend
      // legality path can enforce it. Only literal numeric counts are supported;
      // "non-block" is a TYPE concept (CR 8.1.12), expressed via the cap filter.
      const maxDefenders =
        effect.maxDefenders && typeof effect.maxDefenders.count === "number"
          ? { count: effect.maxDefenders.count, filter: effect.maxDefenders.filter ?? null }
          : null;
      return compileRule(
        cursor,
        subjectTarget,
        effect.filter ?? null,
        effect.mode,
        effect.action,
        {
          kind: "rule-modification",
          ...(effect.targetPlayer ? { targetPlayer: effect.targetPlayer } : {}),
          attackTargetMode: effect.target ?? null,
          subjectFilter,
          sourceRestriction:
            effect.source === "opponents-effects" ||
            effect.source === "self-or-attack-reaction-effects"
              ? effect.source
              : null,
          maxDefenders,
          handedness: effect.handedness ?? null,
          keyword: effect.keyword ?? null,
          damageType: effect.damageType ?? null,
          gainDelta:
            effect.mode === "amplify" && effect.action === "gain-power"
              ? (effect.amount ?? 1)
              : null,
        },
        limit,
      );
    }
    case "play-card":
      return compileRule(cursor, effect.source, null, "allow", "play", {
        kind: "play-card",
        costModification: effect.costModification ?? null,
        asType: effect.asType ?? null,
        fromZones: effect.fromZones ?? null,
      });
    case "can-be-attacked":
      return compileRule(cursor, effect.target, null, "allow", "be-attacked", {
        kind: "can-be-attacked",
      });
    case "freeze": {
      const play = compileRule(
        cursor,
        effect.target,
        null,
        "restrict",
        "play",
        { kind: "freeze" },
        undefined,
        "freeze-play",
      );
      if (!play.ok) return play;
      const activate = compileRule(
        cursor,
        effect.target,
        null,
        "restrict",
        "activate",
        { kind: "freeze" },
        undefined,
        "freeze-activate",
      );
      return activate.ok ? { ok: true, atoms: [...play.atoms, ...activate.atoms] } : activate;
    }
    case "copy": {
      const dependencies = dependencyStages({
        condition: cursor.condition,
        target: effect.target,
      });
      if (!dependencies.ok)
        return failure(
          cursor.effectId,
          cursor.path,
          "unsupported_dependency",
          dependencies.mechanic,
        );
      return {
        ok: true,
        atoms: [
          effect.abilitiesOnly
            ? {
                ...atomBase(cursor, effect.target, dependencies.stages, 6),
                kind: "copy-abilities",
                stage: 6,
                source: effect.source,
              }
            : {
                ...atomBase(cursor, effect.target, dependencies.stages, 1),
                kind: "copy",
                stage: 1,
                source: effect.source,
                frozenSource: null,
                sourceProvenance: null,
                except: effect.except ?? null,
              },
        ],
      };
    }
    case "gain-control":
    case "give":
    case "steal": {
      const dependencies = dependencyStages({ condition: cursor.condition, target: effect.target });
      if (!dependencies.ok)
        return failure(
          cursor.effectId,
          cursor.path,
          "unsupported_dependency",
          dependencies.mechanic,
        );
      return {
        ok: true,
        atoms: [
          {
            ...atomBase(cursor, effect.target, dependencies.stages, 2),
            kind: "controller",
            stage: 2,
            controller: effect.controller,
          },
        ],
      };
    }
    case "become": {
      if (effect.keywords && effect.keywords.length > 0) {
        return failure(
          cursor.effectId,
          cursor.path,
          "unsupported_mechanic",
          "become keyword strings must migrate to strict FabKeyword atoms",
        );
      }
      const dependencies = dependencyStages({
        condition: cursor.condition,
        filter: effect.filter,
        amount: effect.basePower ?? effect.baseLife,
        target: { selector: "self" },
      });
      if (!dependencies.ok)
        return failure(
          cursor.effectId,
          cursor.path,
          "unsupported_dependency",
          dependencies.mechanic,
        );
      return {
        ok: true,
        atoms: [
          {
            ...atomBase(cursor, { selector: "self" }, dependencies.stages, 1),
            kind: "become",
            stage: 1,
            source: effect.source,
            except: effect.except ?? null,
            filter: effect.filter ?? null,
            basePower: effect.basePower ?? null,
            baseLife: effect.baseLife ?? null,
            frozenSource: null,
          },
        ],
      };
    }
    case "optional": {
      // Without a `.then` continuation, an "optional" wrapper in a continuous
      // effect is semantically transparent for permission-type inner effects
      // (play-card, can-be-attacked, etc.) — the player already chooses
      // whether to exercise the permission. Delegate to the inner effect.
      if (effect.then) {
        return failure(
          cursor.effectId,
          [...cursor.path, "then"],
          "unsupported_mechanic",
          "optional with then continuation requires a persisted generation decision",
        );
      }
      return compileNode(effect.effect, { ...cursor, path: [...cursor.path, "effect"] });
    }
    case "choice":
    case "for-each":
    case "repeat":
    case "unless":
      return failure(
        cursor.effectId,
        cursor.path,
        "unsupported_mechanic",
        `${effect.type} requires a persisted generation decision`,
      );
    default:
      return failure(
        cursor.effectId,
        cursor.path,
        "not_continuous",
        `${effect.type} is not a continuous-effect producer`,
      );
  }
}
