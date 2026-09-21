import type { FabAmount } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import { FabRulesEvaluationError } from "../errors.ts";
import {
  countCounters,
  playerIdsForFacts,
  refKey,
  requireBoundNumber,
  toCatalogZone,
  type MutableObject,
  zoneObjectMatchesPlayer,
} from "../helpers.ts";
import { catalogZoneMatchesTargetZones } from "../../zones.ts";
import { countCandidates } from "../count-candidates.ts";
import { matchesFilter } from "../matches-filter.ts";
import { assertNever } from "../assert-never.ts";

export function evaluateCount(
  amount: Exclude<FabAmount, number> & { type: "count" },
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): number {
  const candidates = countCandidates(amount, context, objects);
  let value: number;
  switch (amount.what) {
    case "cards-in-hand":
      value = candidates.filter((object) => object.input.zone.zone === "hand").length;
      break;
    case "cards-in-zone":
      if (!amount.zone) throw new FabRulesEvaluationError("cards-in-zone without zone");
      // Catalog `permanent` is an umbrella for arena + equipment + weapon seats
      // (CR "permanents you control" / "equipment you control" with zone permanent).
      // Strict equality would miss head/chest/arms/legs/weapon (Arcanite Fortress).
      // Defending equipment sits on combat-chain but is still controlled permanent.
      value = candidates
        .filter((object) => {
          const catalog = toCatalogZone(object.input.zone.zone);
          if (catalogZoneMatchesTargetZones(catalog, [amount.zone!])) return true;
          if (
            amount.zone === "permanent" &&
            object.input.zone.zone === "combatChain" &&
            object.properties.types.includes("Equipment")
          ) {
            return true;
          }
          return false;
        })
        .filter((object) =>
          amount.filter ? matchesFilter(object, amount.filter, context, objects) : true,
        ).length;
      break;
    case "chain-links":
      // Chain links inherit the properties and controller of their active
      // attack (CR 7.0.3c). The rules view records the Draconic subset while
      // combat is built, so do not silently treat a filtered count as the
      // unfiltered chain-link total.
      if (amount.filter?.typeBox?.supertypes?.includes("Draconic")) {
        if (amount.player && amount.player !== "controller") {
          throw new FabRulesEvaluationError("filtered chain-links requires controller player");
        }
        value = context.facts?.playerDraconicChainLinks[context.controllerId] ?? 0;
        // Include this attack while it is still resolving as a layer
        // (CR 7.1 → 7.2). The combat reducer only increments the fact when
        // the Attack Step opens. Attack reactions are Draconic cards on the
        // stack but never become chain links themselves.
        const sourceRef = context.source;
        const source = sourceRef ? objects.get(refKey(sourceRef)) : undefined;
        if (source) {
          const types = source.properties.types as readonly string[];
          const isDraconic =
            source.properties.supertypes.includes("Draconic") || types.includes("Draconic");
          const isAttack =
            source.properties.subtypes.includes("Attack") ||
            (types.includes("Attack") && !types.includes("Attack Reaction"));
          if (isDraconic && isAttack && source.input.zone.zone === "stack") {
            value += 1;
          }
        }
      } else if (amount.filter) {
        throw new FabRulesEvaluationError("unsupported chain-links filter");
      } else {
        const combat = context.facts?.combat;
        // CR 7.0.3c: links inherit the active attack's controller. In 1v1,
        // every link on the open chain belongs to its attacking player.
        const includesAttacker =
          combat &&
          (!amount.player ||
            playerIdsForFacts(amount.player, context).includes(combat.attackingPlayerId));
        value = includesAttacker ? combat.chainLinkNumber : 0;
      }
      break;
    case "distinct-costs": {
      // CR 5.4.5 / 1.7.4f (Mutated Mass): count the distinct COST-property
      // values among cards in the target zone (the pitch zone). Cards that
      // lack the cost property (e.g. Heart of Fyendal) do not count.
      if (!amount.zone) throw new FabRulesEvaluationError("distinct-costs without zone");
      const distinctCosts = new Set<number>();
      for (const object of candidates) {
        if (!catalogZoneMatchesTargetZones(toCatalogZone(object.input.zone.zone), [amount.zone]))
          continue;
        const cost = object.baseNumeric.cost ?? object.properties.numeric.cost;
        if (cost !== undefined) distinctCosts.add(cost);
      }
      value = distinctCosts.size;
      break;
    }
    case "damage-dealt": {
      const facts = context.facts;
      if (!facts) {
        throw new FabRulesEvaluationError("damage-dealt without rules facts");
      }
      const scopeName = amount.per === "turn" ? "turn" : "chainLink";
      // "damage dealt by [this / Dampen / Aether Spindle]" is a source filter,
      // not the controller's unfiltered turn total.
      if (amount.filter) {
        const sourceMap =
          scopeName === "turn"
            ? facts.sourceDamageDealtThisTurn
            : facts.sourceDamageDealtThisChainLink;
        value = Object.entries(sourceMap ?? {}).reduce((total, [instanceId, dealt]) => {
          const object = [...objects.values()].find(
            (candidate) => candidate.input.ref.instanceId === instanceId,
          );
          if (!object) return total;
          if (!matchesFilter(object, amount.filter!, context, objects)) return total;
          return total + dealt;
        }, 0);
        break;
      }
      value = playerIdsForFacts(amount.player ?? "controller", context).reduce(
        (total, playerId) => {
          const damage =
            amount.recipient === "opposing-heroes"
              ? facts.playerDamageDealt[playerId]?.opposingHeroes?.[scopeName]
              : facts.playerDamageDealt[playerId]?.[scopeName];
          if (!damage) return total;
          return (
            total +
            (amount.damageType
              ? damage[amount.damageType]
              : damage.arcane + damage.physical + damage.generic)
          );
        },
        0,
      );
      break;
    }
    case "cards-pitched-this-turn":
      // countCandidates already applied amount.filter to the live objects.
      value = candidates.reduce(
        (total, object) =>
          total +
          object.input.history.moves.filter(
            (move) => move.turnNumber === context.facts?.turnNumber && move.to.zone === "pitch",
          ).length,
        0,
      );
      break;
    case "boosts-this-turn": {
      value = playerIdsForFacts(amount.player ?? "controller", context).reduce(
        (total, playerId) => total + (context.facts?.playerBoostsThisTurn[playerId] ?? 0),
        0,
      );
      break;
    }
    case "intimidates-this-turn": {
      value = playerIdsForFacts(amount.player ?? "controller", context).reduce(
        (total, playerId) => total + (context.facts?.playerIntimidatesThisTurn[playerId] ?? 0),
        0,
      );
      break;
    }
    case "runechants-created-this-turn": {
      value = playerIdsForFacts(amount.player ?? "controller", context).reduce(
        (total, playerId) =>
          total + (context.facts?.playerRunechantsCreatedThisTurn[playerId] ?? 0),
        0,
      );
      break;
    }
    case "combat-chain-hits": {
      value = playerIdsForFacts(amount.player ?? "controller", context).reduce(
        (total, playerId) => total + (context.facts?.playerCombatChainHits[playerId] ?? 0),
        0,
      );
      break;
    }
    case "consecutive-chain-links-that-hit": {
      const combat = context.facts?.combat;
      if (!combat) {
        value = 0;
        break;
      }
      const history = [...(combat.closedLinkHits ?? []), combat.didHit];
      let run = 0;
      for (let i = history.length - 1; i >= 0; i--) {
        if (!history[i]) break;
        run += 1;
      }
      value = run;
      break;
    }
    case "attacks-this-turn": {
      value = playerIdsForFacts(amount.player ?? "controller", context).reduce(
        (total, playerId) => total + (context.facts?.playerAttacksThisTurn[playerId] ?? 0),
        0,
      );
      break;
    }
    case "weapon-attacks-this-turn": {
      value = playerIdsForFacts(amount.player ?? "controller", context).reduce(
        (total, playerId) => total + (context.facts?.playerWeaponAttacks[playerId] ?? 0),
        0,
      );
      break;
    }
    case "attacks-with-subject-this-turn": {
      const subjectId =
        context.facts?.combat?.attackSourceInstanceId ??
        (context.subject ?? context.source)?.instanceId;
      value = subjectId
        ? playerIdsForFacts(amount.player ?? "controller", context).reduce(
            (total, playerId) =>
              total +
              (context.facts?.playerWeaponAttackCountsByInstanceIdThisTurn[playerId]?.[subjectId] ??
                0),
            0,
          )
        : 0;
      break;
    }
    case "times-attacked-this-turn": {
      value = playerIdsForFacts(amount.player ?? "controller", context).reduce(
        (total, playerId) => total + (context.facts?.playerTimesAttackedThisTurn[playerId] ?? 0),
        0,
      );
      break;
    }
    case "attack-reactions-this-chain-link": {
      value = context.facts?.combat?.attackReactionCount ?? 0;
      break;
    }
    case "objects-under-source": {
      const subjectRef = context.subject ?? context.source;
      const subject = subjectRef ? objects.get(refKey(subjectRef)) : undefined;
      const hosted = subject?.input.underInstanceIds ?? [];
      value = [...objects.values()].filter(
        (object) =>
          object.input.ref.instanceId !== undefined &&
          hosted.includes(object.input.ref.instanceId) &&
          (amount.filter ? matchesFilter(object, amount.filter, context, objects) : true),
      ).length;
      break;
    }
    case "cards-drawn-this-turn": {
      const playerIds = playerIdsForFacts(amount.player ?? "controller", context);
      value = playerIds.reduce(
        (total, playerId) => total + (context.facts?.playerCardsDrawn[playerId] ?? 0),
        0,
      );
      break;
    }
    case "cards-played-this-turn": {
      const typeBox = amount.filter?.typeBox;
      const countsNonAttackActions =
        typeBox?.types?.length === 1 &&
        typeBox.types[0] === "Action" &&
        typeBox.excludeSubtypes?.length === 1 &&
        typeBox.excludeSubtypes[0] === "Attack" &&
        !typeBox.supertypes?.length &&
        !typeBox.subtypes?.length;
      if (countsNonAttackActions) {
        value = playerIdsForFacts(amount.player ?? "controller", context).reduce(
          (total, playerId) => total + (context.facts?.playerNonAttackActionPlayed[playerId] ?? 0),
          0,
        );
        break;
      }
      // Names are event-relative: a card may gain a name while played and lose
      // it later in the turn, or cease to exist entirely. The play event locks
      // every effective name into turn history; re-scanning live objects would
      // incorrectly substitute their later properties (CR 2.7, 6.2.2b).
      let names = playerIdsForFacts(amount.player ?? "controller", context).flatMap((playerId) =>
        (context.facts?.playerPlayedCardNamesThisTurn[playerId] ?? []).map((name) =>
          name.toLocaleLowerCase().replace(/[^a-z0-9]+/g, ""),
        ),
      );
      if (amount.filter?.sameNameAs) {
        const refs = context.bindings.objects[amount.filter.sameNameAs.binding];
        const reference = refs?.length === 1 ? objects.get(refKey(refs[0]!)) : undefined;
        const matchingNames =
          reference?.properties.names.map((name) =>
            name.toLocaleLowerCase().replace(/[^a-z0-9]+/g, ""),
          ) ?? [];
        names = names.filter((name) => matchingNames.includes(name));
      }
      if (amount.groupBy === "name") {
        const buckets = new Map<string, number>();
        for (const name of names) {
          if (!name) continue;
          buckets.set(name, (buckets.get(name) ?? 0) + 1);
        }
        value = [...buckets.values()].reduce((max, count) => Math.max(max, count), 0);
      } else {
        value = names.length;
      }
      break;
    }
    case "equipped-objects":
      value = candidates.filter((object) => {
        const zone = object.input.zone.zone;
        if (["head", "chest", "arms", "legs", "weapon1", "weapon2"].includes(zone)) return true;
        // Defending equipment remains equipped/controlled on the combat chain.
        return zone === "combatChain" && object.properties.types.includes("Equipment");
      }).length;
      break;
    case "counters-on-source": {
      const locked = context.bindings?.numbers?.["counters-on-source"];
      if (typeof locked === "number") {
        value = locked;
        break;
      }
      const source = context.source ? objects.get(refKey(context.source)) : undefined;
      value = source ? countCounters(source, amount.counter) : 0;
      break;
    }
    case "counters-on-objects":
      if (!amount.counter) throw new FabRulesEvaluationError("counters-on-objects without counter");
      value = candidates.reduce(
        (total, object) => total + countCounters(object, amount.counter),
        0,
      );
      break;
    case "heroes":
      value = candidates.filter((object) => object.properties.types.includes("Hero")).length;
      break;
    case "cards-defending": {
      const defending = context.facts?.combat?.defending ?? [];
      if (!amount.filter) {
        value = defending.length;
        break;
      }
      value = defending.filter((ref) => {
        const object = objects.get(refKey(ref));
        return object ? matchesFilter(object, amount.filter!, context, objects) : false;
      }).length;
      break;
    }
    case "defending-cards-controlled-by-opponent":
      value = (context.facts?.combat?.defending ?? []).filter((ref) => {
        const object = objects.get(refKey(ref));
        return object?.controllerId !== null && object?.controllerId !== context.controllerId;
      }).length;
      break;
    case "life-difference-vs-opponent": {
      const ownLife = context.facts?.playerLife[context.controllerId];
      const opponentLife = Object.entries(context.facts?.playerLife ?? {}).find(
        ([playerId]) => playerId !== context.controllerId,
      )?.[1];
      if (ownLife === undefined || opponentLife === undefined) {
        throw new FabRulesEvaluationError("life-difference-vs-opponent without life facts");
      }
      value = Math.abs(ownLife - opponentLife);
      break;
    }
    case "base-power-of-source": {
      const source = context.source ? objects.get(refKey(context.source)) : undefined;
      const power = source?.baseNumeric.power;
      if (power === undefined)
        throw new FabRulesEvaluationError("base-power-of-source without power");
      value = power;
      break;
    }
    // Event-relative count: multi-card draws are often one atomic batch of N
    // single-card `draw` events. Trigger collection binds the summed amount as
    // `event-amount` (CR 1.9.2a — one trigger per source per batch), so Valda's
    // "for each card drawn this way" creates that many tokens.
    case "drawn-this-way": {
      const bound = context.bindings?.numbers?.["drawn-this-way"];
      const eventAmount = context.bindings?.numbers?.["event-amount"];
      value = typeof bound === "number" ? bound : typeof eventAmount === "number" ? eventAmount : 0;
      break;
    }
    // Counter-removal effects stage the amount on their resolving layer. A
    // missing binding means no counters were removed, which is a valid zero
    // outcome rather than an unsupported amount (Treasure Island, Divvy Up).
    case "counters-removed": {
      const removed = context.bindings?.numbers?.["counters-removed"];
      value = typeof removed === "number" ? removed : 0;
      break;
    }
    // CR 8.5.22 / Blaze Firemind: cards looked at by the opt that triggered.
    // Bound as event-amount from the opt event's count (top+bottom).
    case "looked-at-this-way":
      value = requireBoundNumber("event-amount", context);
      break;
    // Hope Merchant's Hood / surge family: cards moved into the deck and
    // shuffled this resolution. move-card→deck stamps a numeric
    // "shuffled-this-way" binding (cardinality).
    case "shuffled-this-way": {
      const asNumber = context.bindings?.numbers?.["shuffled-this-way"];
      if (typeof asNumber === "number") {
        value = asNumber;
        break;
      }
      value = context.bindings?.objects?.["shuffled-this-way"]?.length ?? 0;
      break;
    }
    // Sift / Potion of Luck / The Moat Exchange: cards put on the bottom of
    // a deck (or shuffled into it) earlier in this resolution.
    case "put-on-bottom-this-way": {
      const asNumber = context.bindings?.numbers?.["put-on-bottom-this-way"];
      if (typeof asNumber === "number") {
        value = asNumber;
        break;
      }
      value = context.bindings?.objects?.["put-on-bottom-this-way"]?.length ?? 0;
      break;
    }
    // Teklo Foundry Heart / "for each Mechanologist card banished this way":
    // banish stamps banished-this-way object cohort (+ optional numeric count).
    // When amount.filter is set, count only matching LKI objects — never fall
    // through to the unfiltered cardinality (that would ignore the filter).
    case "banished-this-way": {
      const refs =
        context.bindings?.objects?.["banished-this-way"] ??
        context.bindings?.objects?.["them"] ??
        context.bindings?.objects?.["it"] ??
        [];
      if (amount.groupBy === "name") {
        const buckets = new Map<string, number>();
        for (const ref of refs) {
          const object = objects.get(refKey(ref));
          const printed = object
            ? (object.properties.names[0] ?? object.input.base.names[0] ?? "")
            : "";
          const name = printed.toLocaleLowerCase().replace(/[^a-z0-9]+/g, "");
          if (!name) continue;
          buckets.set(name, (buckets.get(name) ?? 0) + 1);
        }
        value = [...buckets.values()].reduce((max, count) => Math.max(max, count), 0);
        break;
      }
      if (amount.filter) {
        value = refs.filter((ref) => {
          const object = objects.get(refKey(ref));
          return object
            ? (!amount.player || zoneObjectMatchesPlayer(object, amount.player, context)) &&
                matchesFilter(object, amount.filter!, context, objects)
            : false;
        }).length;
        break;
      }
      if (amount.player) {
        value = refs.filter((ref) => {
          const object = objects.get(refKey(ref));
          return object ? zoneObjectMatchesPlayer(object, amount.player!, context) : false;
        }).length;
        break;
      }
      const asNumber =
        context.bindings?.numbers?.["banished-this-way-count"] ??
        context.bindings?.numbers?.["banished-this-way"];
      if (typeof asNumber === "number") {
        value = asNumber;
        break;
      }
      value = refs.length;
      break;
    }
    case "created-this-way": {
      if (amount.filter) {
        const refs = context.bindings?.objects?.["created-this-way-objects"] ?? [];
        value = refs.filter((ref) => {
          const object = objects.get(refKey(ref));
          return object ? matchesFilter(object, amount.filter!, context, objects) : false;
        }).length;
        break;
      }
      const total = context.bindings?.numbers?.["created-this-way"];
      value = typeof total === "number" ? total : 0;
      break;
    }
    case "turned-face-down-this-way": {
      const refs = context.bindings?.objects?.["turned-face-down-this-way"] ?? [];
      if (amount.filter) {
        value = refs.filter((ref) => {
          const object = objects.get(refKey(ref));
          return object ? matchesFilter(object, amount.filter!, context, objects) : false;
        }).length;
        break;
      }
      const asNumber = context.bindings?.numbers?.["turned-face-down-this-way-count"];
      value = typeof asNumber === "number" ? asNumber : refs.length;
      break;
    }
    case "put-into-arena-this-way": {
      const refs = context.bindings?.objects?.["put-into-arena-this-way"] ?? [];
      if (amount.filter) {
        value = refs.filter((ref) => {
          const object = objects.get(refKey(ref));
          return object ? matchesFilter(object, amount.filter!, context, objects) : false;
        }).length;
        break;
      }
      const asNumber = context.bindings?.numbers?.["put-into-arena-this-way-count"];
      value = typeof asNumber === "number" ? asNumber : refs.length;
      break;
    }
    case "put-into-hand-this-way": {
      const refs = context.bindings?.objects?.["put-into-hand-this-way"] ?? [];
      const asNumber = context.bindings?.numbers?.["put-into-hand-this-way-count"];
      value = typeof asNumber === "number" ? asNumber : refs.length;
      break;
    }
    case "put-into-graveyard-this-way": {
      const refs = context.bindings?.objects?.["put-into-graveyard-this-way"] ?? [];
      if (amount.filter) {
        value = refs.filter((ref) => {
          const object = objects.get(refKey(ref));
          return object ? matchesFilter(object, amount.filter!, context, objects) : false;
        }).length;
        break;
      }
      const asNumber = context.bindings?.numbers?.["put-into-graveyard-this-way-count"];
      value = typeof asNumber === "number" ? asNumber : refs.length;
      break;
    }
    case "discarded-this-way": {
      const refs =
        context.bindings?.objects?.["discarded-this-way"] ??
        context.bindings?.objects?.["it"] ??
        [];
      if (amount.property) {
        value = refs.reduce((total, ref) => {
          const object = objects.get(refKey(ref));
          if (
            !object ||
            (amount.filter && !matchesFilter(object, amount.filter, context, objects))
          ) {
            return total;
          }
          const stat = object.baseNumeric[amount.property!];
          return typeof stat === "number" ? total + stat : total;
        }, 0);
        break;
      }
      if (amount.filter) {
        value = refs.filter((ref) => {
          const object = objects.get(refKey(ref));
          return object ? matchesFilter(object, amount.filter!, context, objects) : false;
        }).length;
        break;
      }
      value = context.bindings?.numbers?.["discarded-this-way-count"] ?? refs.length;
      break;
    }
    // Deathly Delight: number of heroes who lost {h} this turn.
    case "heroes-lost-life-this-turn": {
      const lost = context.facts?.playerLostLifeThisTurn ?? {};
      value = Object.values(lost).filter(Boolean).length;
      break;
    }
    // Thistle Bloom and Sowing Thorns use life actually gained, not a mutable
    // fixture field or a prospective amount before replacement effects settle.
    case "clashes-won-this-turn":
      value = context.facts?.playerClashesWonThisTurn?.[context.controllerId] ?? 0;
      break;
    case "life-gained-this-turn": {
      const gained = context.facts?.playerLifeGainedThisTurn ?? {};
      const player = amount.player ?? "controller";
      if (player === "controller" || player === "self") {
        value = gained[context.controllerId] ?? 0;
        break;
      }
      if (player === "opponent" || player === "another-hero" || player === "each-other-hero") {
        value = Object.entries(gained).reduce(
          (total, [playerId, life]) => (playerId === context.controllerId ? total : total + life),
          0,
        );
        break;
      }
      if (player === "any" || player === "each") {
        value = Object.values(gained).reduce((total, life) => total + life, 0);
        break;
      }
      throw new FabRulesEvaluationError(`life-gained-this-turn player ${player as string}`);
    }
    // Kassai Cintari Sellsword: Copper for each weapon attack that hit this turn.
    case "weapon-attacks-that-hit-this-turn":
      value = context.facts?.playerWeaponHits[context.controllerId] ?? 0;
      break;
    // Glory Plate: +1{d} for each Toughness token that left the arena this turn.
    // Prefer leave-arena event LKI (tokens cease to exist and leave objects).
    case "left-arena-this-turn": {
      const rows = context.facts?.leftArenaThisTurn ?? [];
      const player = amount.player ?? "controller";
      value = rows.filter((row) => {
        if (player === "controller" || player === "self") {
          if (row.controllerId !== context.controllerId) return false;
        } else if (player === "opponent" || player === "another-hero") {
          if (row.controllerId === context.controllerId) return false;
        }
        if (!amount.filter) return true;
        if (amount.filter.name) {
          const want = amount.filter.name.toLocaleLowerCase("en-US");
          if (!row.names.some((name) => name.toLocaleLowerCase("en-US") === want)) return false;
        }
        const exact = amount.filter.typeBox;
        if (exact?.metatypes?.some((meta) => !row.metatypes.includes(meta))) {
          return false;
        }
        if (exact?.types?.some((type) => !row.types.includes(type))) {
          return false;
        }
        return true;
      }).length;
      break;
    }
    case "evos-equipped":
      // CR 8.4.11 Evo Upgrade — "for each evo you have equipped". An evo is any
      // object whose type line carries the "Evo" token. The normalized runtime
      // type box routes "Evo" to subtypes (FAB_SUBTYPES; see reducers/mechanics.ts
      // evoBanishedFromBoostingThisTurn and automation isEvo for the same read),
      // while module authoring lines and hand-built fixtures may carry it in
      // `types` — check both, mirroring the matches-filter "Reaction" shorthand.
      // `properties.types` is typed to the narrower FAB_TYPES union, so cast
      // (same pattern as matches-filter.ts). Defending equipment remains
      // equipped on the combat chain (mirrors the equipped-objects case above).
      value = candidates.filter((object) => {
        const types = object.properties.types as readonly string[];
        const subtypes = object.properties.subtypes as readonly string[];
        if (!subtypes.includes("Evo") && !types.includes("Evo")) return false;
        const zone = object.input.zone.zone;
        if (["head", "chest", "arms", "legs", "weapon1", "weapon2"].includes(zone)) return true;
        return zone === "combatChain" && types.includes("Equipment");
      }).length;
      break;
    case "boosts-this-combat-chain":
      value = context.facts?.playerBoostsThisCombatChain[context.controllerId] ?? 0;
      break;
    case "cards-banished-from-soul-this-combat-chain":
      value = context.facts?.playerCardsBanishedFromSoulThisCombatChain[context.controllerId] ?? 0;
      break;
    case "attacks-hit-this-combat-chain": {
      const subtypes = amount.filter?.typeBox?.subtypes ?? [];
      const daggerOnly =
        Boolean(amount.filter) &&
        subtypes.length === 1 &&
        subtypes[0] === "Dagger" &&
        !amount.filter?.typeBox?.types &&
        !amount.filter?.name;
      if (amount.filter && !daggerOnly) {
        throw new FabRulesEvaluationError("unsupported attacks-hit-this-combat-chain filter");
      }
      value = daggerOnly
        ? (context.facts?.playerDaggerHitsThisCombatChain[context.controllerId] ?? 0)
        : (context.facts?.playerCombatChainHits[context.controllerId] ?? 0);
      break;
    }
    case "different-names-among-aura-tokens": {
      // Printed "among aura tokens in the arena" is arena-wide, not controller-only.
      const names = new Set<string>();
      for (const object of objects.values()) {
        if (object.input.zone.zone !== "arena") continue;
        const types = object.properties.types as readonly string[];
        const subtypes = object.properties.subtypes as readonly string[];
        const metatypes = object.properties.metatypes as readonly string[];
        if (
          !types.includes("Token") &&
          !subtypes.includes("Token") &&
          !metatypes.includes("Token")
        ) {
          continue;
        }
        if (!subtypes.includes("Aura") && !types.includes("Aura")) continue;
        for (const name of object.properties.names) names.add(name.toLocaleLowerCase());
      }
      value = names.size;
      break;
    }
    case "destroyed-this-way": {
      const refs =
        context.bindings?.objects?.["destroyed-this-way"] ??
        context.bindings?.objects?.["it"] ??
        [];
      if (amount.filter) {
        value = refs.filter((ref) => {
          const object = objects.get(refKey(ref));
          return object ? matchesFilter(object, amount.filter!, context, objects) : false;
        }).length;
        break;
      }
      const asNumber = context.bindings?.numbers?.["destroyed-this-way"];
      value = typeof asNumber === "number" ? asNumber : refs.length;
      break;
    }
    // Song of Sinew / Cast Bones: cards revealed earlier in this resolution.
    // Reveal stamps the full cohort on `revealed-this-way`.
    case "cards-revealed-this-way":
    case "revealed-this-way": {
      const dedupe = new Set<string>();
      const refs = (["revealed-this-way", "revealed", "them", "it"] as const).flatMap((name) =>
        (context.bindings?.objects?.[name] ?? []).filter((ref) => {
          const key = refKey(ref);
          if (dedupe.has(key)) return false;
          dedupe.add(key);
          return true;
        }),
      );
      if (amount.filter) {
        value = refs.filter((ref) => {
          const object = objects.get(refKey(ref));
          return object ? matchesFilter(object, amount.filter!, context, objects) : false;
        }).length;
        break;
      }
      value = refs.length;
      break;
    }
    case "resources-paid-this-way":
      value = context.bindings?.numbers?.["resources-paid-this-way"] ?? 0;
      break;
    // V of the Vanguard: +1{p} for each Light card charged this way.
    // Play-time charge stamps `charged-this-way` / `chargedCard` on the play layer.
    case "charged-this-way": {
      if (amount.per === "turn") {
        value = context.facts?.playerCharged[context.controllerId] === true ? 1 : 0;
        break;
      }
      const refs = [
        ...(context.bindings?.objects?.["charged-this-way"] ?? []),
        ...(context.bindings?.objects?.["chargedCard"] ?? []),
      ];
      const seen = new Set<string>();
      const unique = refs.filter((ref) => {
        const key = refKey(ref);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      if (amount.filter) {
        value = unique.filter((ref) => {
          const object = objects.get(refKey(ref));
          return object ? matchesFilter(object, amount.filter!, context, objects) : false;
        }).length;
        break;
      }
      value = unique.length;
      break;
    }
    case "banished-for-cost":
    case "banished-to-play-this": {
      const asNumber = context.bindings?.numbers?.["banished-for-cost"];
      if (typeof asNumber === "number") {
        value = asNumber;
        break;
      }
      value = context.bindings?.objects?.["banished-this-way"]?.length ?? 0;
      break;
    }
    case "counters-removed-for-cost":
      value = context.bindings?.numbers?.["counters-removed-for-cost"] ?? 0;
      break;
    case "times-it-has-wagered":
      value = context.facts?.combat?.wagers?.length ?? 0;
      break;
    case "wagers-this-chain-link": {
      const wagers = context.facts?.combat?.wagers ?? [];
      const player = amount.player ?? "controller";
      value =
        player === "controller" || player === "self"
          ? wagers.filter((wager) => wager.controllerId === context.controllerId).length
          : wagers.length;
      break;
    }
    case "heroes-dealt-damage-this-way": {
      const refs = context.bindings?.objects?.["heroes-dealt-damage-this-way"] ?? [];
      const asNumber =
        context.bindings?.numbers?.["heroes-dealt-damage-this-way-count"] ??
        context.bindings?.numbers?.["heroes-dealt-damage-this-way"];
      value = typeof asNumber === "number" ? asNumber : refs.length;
      break;
    }
    case "cards-scrapped-by-this": {
      const refs =
        context.bindings?.objects?.scrappedCard ??
        context.bindings?.objects?.["scrapped-this-way"] ??
        [];
      const asNumber = context.bindings?.numbers?.["cards-scrapped-by-this"];
      if (typeof asNumber === "number") {
        value = asNumber;
      } else if (refs.length > 0) {
        value = refs.length;
      } else {
        const source = context.source ? objects.get(refKey(context.source)) : undefined;
        value =
          source?.input.declarationFacts?.some((fact) => fact.kind === "scrap") === true ? 1 : 0;
      }
      break;
    }
    case "pending-damage-to-hero": {
      // Pending damage lives on the facts (rulesFacts): the open link's
      // attack-minus-defense for hero targets plus unresolved stack
      // deal-damage amounts. No combat open no longer means zero — arcane
      // and generic pings on the stack count (Amulet of Intervention).
      const playerIds = playerIdsForFacts(amount.player ?? "controller", context);
      value = playerIds.reduce(
        (total, playerId) => total + (context.facts?.pendingDamageByPlayerId?.[playerId] ?? 0),
        0,
      );
      break;
    }
    case "highest-power-revealed-this-turn": {
      const playerIds = playerIdsForFacts(amount.player ?? "controller", context);
      value = playerIds.reduce(
        (total, playerId) =>
          Math.max(total, context.facts?.playerHighestPowerRevealedThisTurn?.[playerId] ?? 0),
        0,
      );
      break;
    }
    case "heroes-started-game":
      // 1v1 product: seated heroes are the keys of playerLife / heroRefs.
      value = Object.keys(context.facts?.heroRefs ?? context.facts?.playerLife ?? {}).length;
      break;
    case "greatest-base-stat-among": {
      const property = amount.property;
      if (!property) {
        throw new FabRulesEvaluationError("greatest-base-stat-among requires property");
      }
      value = candidates.reduce((highest, object) => {
        const stat = object.baseNumeric[property];
        return typeof stat === "number" ? Math.max(highest, stat) : highest;
      }, 0);
      break;
    }
    default:
      return assertNever(amount, "FabCountable");
  }
  const divided = amount.divisor
    ? amount.rounding === "up"
      ? Math.ceil(value / amount.divisor)
      : Math.floor(value / amount.divisor)
    : value;
  return divided * (amount.multiplier ?? 1) + (amount.plus ?? 0);
}
