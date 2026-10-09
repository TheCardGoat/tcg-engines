import type { FilteredEffectView } from "../../../../../../cyberpunk/packages/engine/src/view/filter.ts";
import type {
  NativeContext,
  NativeModifier,
  NativeState,
  ReferenceRuntime,
  Seat,
} from "./runtime.ts";

export function combatContext(
  state: NativeState,
  id: string,
): { opponent?: string; attacker?: string } {
  const combat = state.pendingCombat;
  if (!combat) return {};
  const defender = combat.target.kind === "unit" ? combat.target.instanceId : undefined;
  if (id === combat.attackerId) return { opponent: defender, attacker: id };
  if (id === defender) return { opponent: combat.attackerId, attacker: combat.attackerId };
  return {};
}

/** Descriptors expose native state; all predicates and numeric values use the pinned worker. */
export function nativeProjection(
  runtime: ReferenceRuntime,
  state: NativeState,
  viewer: Seat,
  oracle: boolean,
) {
  const { api, cards } = runtime;
  const activeSources = api.activeSources(state);
  function effect(
    id: string,
    sourceId: string | undefined,
    kind: string,
    label: string,
    options: Partial<FilteredEffectView> = {},
  ): FilteredEffectView {
    const instance = sourceId ? state.instances[sourceId] : undefined;
    const visible = instance && (oracle || api.visible(state, instance.instanceId, viewer));
    const sourceName = visible
      ? (runtime.catalog[instance.definitionId]?.displayName ?? "Effect")
      : "Effect";
    return {
      id,
      ...(visible ? { sourceCardId: instance.instanceId } : {}),
      sourceName,
      effectKind: kind,
      label,
      detail: `${sourceName}: ${label}.`,
      tone: "neutral",
      durationLabel: "while active",
      isTemporary: false,
      defeatsAtEndOfTurn: false,
      ...options,
    };
  }
  const sideMatches = (
    side: "friendly" | "rival" | "any" | undefined,
    source: Seat,
    target: Seat,
  ) => (side === "friendly" ? source === target : side === "rival" ? source !== target : true);
  function modifierEffect(target: string, mod: NativeModifier, index: number): FilteredEffectView {
    const options: Partial<FilteredEffectView> = {
      durationLabel: mod.duration === "thisTurn" ? "this turn" : `until turn ${mod.untilTurn}`,
      isTemporary: true,
    };
    let kind: string = "ruleGrant";
    let label: string = mod.kind;
    if (mod.kind === "power") {
      kind = "powerModifier";
      label = `${mod.value >= 0 ? "+" : ""}${mod.value} PWR${mod.whileFighting ? " while fighting" : ""}`;
      options.modifierLabel = `${mod.value >= 0 ? "+" : ""}${mod.value}`;
      options.tone = mod.value >= 0 ? "buff" : "debuff";
    } else if (mod.kind === "keyword") {
      label = mod.value;
      options.rule = mod.value === "GoSolo" ? "goSolo" : mod.value.toLowerCase();
    } else if (mod.kind === "lagExempt") {
      options.rule =
        mod.value === "unit" ? "canAttackOnPlayedTurnAgainstUnits" : "canAttackRivalOnPlayedTurn";
      label = options.rule;
    } else if (mod.kind === "stealPenalty") {
      label = `Steal ${mod.value} fewer Gigs`;
      options.rule = mod.value > 0 ? "stealsOneFewerGig" : undefined;
      options.tone = "debuff";
    } else {
      options.rule = mod.kind === "attackReady" ? "canAttackReadyUnits" : mod.kind;
      options.tone =
        mod.kind === "cantAttack" || mod.kind === "cantReady" || mod.kind === "mustAttack"
          ? "debuff"
          : "buff";
    }
    return effect(`${target}:modifier:${index}`, mod.source, kind, label, options);
  }
  function cardEffects(id: string): FilteredEffectView[] {
    const instance = state.instances[id];
    if (!instance) return [];
    const context: NativeContext = { state, cards, self: id, ...combatContext(state, id) };
    const effects = instance.modifiers.map((mod, index) => modifierEffect(id, mod, index));
    const statics = cards(instance.definitionId)?.statics ?? [];
    statics.forEach((entry, index) => {
      if (!entry.when(entry.kind === "keyword" ? { state, cards, self: id } : context)) return;
      if (entry.kind === "power") {
        const amount = typeof entry.amount === "number" ? entry.amount : entry.amount(context);
        effects.push(
          effect(
            `${id}:static:${index}`,
            id,
            "powerModifier",
            `${amount >= 0 ? "+" : ""}${amount} PWR`,
            { tone: amount >= 0 ? "buff" : "debuff", modifierLabel: String(amount) },
          ),
        );
      } else
        effects.push(
          effect(`${id}:static:${index}`, id, "ruleGrant", entry.value, {
            rule: entry.value.toLowerCase(),
          }),
        );
    });
    for (const gearId of instance.attachedGearIds) {
      const gear = state.instances[gearId];
      if (!gear) continue;
      const power = runtime.catalog[gear.definitionId]?.power ?? 0;
      if (power !== 0)
        effects.push(
          effect(`${id}:gear:${effects.length}`, gearId, "powerModifier", `+${power} PWR`, {
            modifierLabel: String(power),
            tone: "buff",
          }),
        );
      const definition = cards(gear.definitionId);
      const keywords = [
        ...(definition?.keywords ?? []),
        ...(definition?.statics ?? []).flatMap((entry) =>
          entry.kind === "keyword" && entry.when({ state, cards, self: id }) ? [entry.value] : [],
        ),
      ];
      keywords.forEach((keyword, index) =>
        effects.push(
          effect(`${id}:gear-keyword:${effects.length}:${index}`, gearId, "ruleGrant", keyword, {
            rule: keyword === "GoSolo" ? "goSolo" : keyword.toLowerCase(),
          }),
        ),
      );
    }
    for (const { pid, sourceId } of activeSources) {
      const source = state.instances[sourceId];
      if (!source) continue;
      (cards(source.definitionId)?.auras ?? []).forEach((entry, index) => {
        if (entry.kind !== "powerAura" && entry.kind !== "attackBanAura") return;
        if (
          !sideMatches(entry.target.side, pid, instance.owner) ||
          !api.matches(state, cards, id, entry.target) ||
          !entry.when(context)
        )
          return;
        if (entry.kind === "powerAura" && entry.excludeSource && sourceId === id) return;
        effects.push(
          entry.kind === "powerAura"
            ? effect(
                `${id}:aura:${effects.length}:${index}`,
                sourceId,
                "powerModifier",
                `${entry.amount >= 0 ? "+" : ""}${entry.amount} PWR`,
                {
                  modifierLabel: String(entry.amount),
                  tone: entry.amount >= 0 ? "buff" : "debuff",
                },
              )
            : effect(
                `${id}:aura:${effects.length}:${index}`,
                sourceId,
                "ruleGrant",
                "Cannot attack",
                { rule: "cantAttack", tone: "debuff" },
              ),
        );
      });
    }
    state.combatShields.forEach((shield, index) => {
      if (
        shield.turnNumber !== state.turnNumber ||
        shield.controller !== instance.owner ||
        (shield.unit !== undefined && shield.unit !== id)
      )
        return;
      effects.push(
        effect(
          `${id}:shield:${index}`,
          shield.source,
          "ruleGrant",
          "Cannot be defeated in a fight",
          {
            rule: "cantBeDefeatedInFight",
            isTemporary: true,
            durationLabel: shield.expires === "nextFight" ? "next fight this turn" : "this turn",
            tone: "buff",
          },
        ),
      );
    });
    state.delayedEffects.forEach((entry, index) => {
      if (
        entry.targetId !== id ||
        (entry.expires === "thisTurn" && entry.turnNumber !== state.turnNumber)
      )
        return;
      const cyberpsychosis =
        entry.definitionId === "cb-cyberpsychosis" && entry.key === "reckoning";
      const armed = cyberpsychosis && instance.turnFlags?.cyberpsychosis === entry.turnNumber;
      effects.push(
        effect(
          `${id}:delayed:${index}`,
          entry.source,
          cyberpsychosis ? "defeatAtEndOfTurnIfAttacked" : "nativeDelayedEffect",
          cyberpsychosis ? (armed ? "End defeat" : "Attack risk") : `Pending ${entry.key}`,
          {
            isTemporary: true,
            durationLabel:
              entry.expires === "thisTurn" ? "end of turn" : "until source's next turn",
            defeatsAtEndOfTurn: armed,
            defeatIfAttacksAtEndOfTurn: cyberpsychosis && !armed,
            tone: cyberpsychosis ? "debuff" : "neutral",
          },
        ),
      );
    });
    return effects;
  }
  function grantedRules(id: string, effects: FilteredEffectView[]): string[] {
    const rules = new Set(effects.flatMap((entry) => (entry.rule ? [entry.rule] : [])));
    if (api.attackForbidden(state, cards, id)) rules.add("cantAttack");
    if (api.attackTargetForbidden(state, cards, id, "gig")) rules.add("cantAttackRival");
    if (api.attackTargetForbidden(state, cards, id, "unit")) rules.add("cantAttackUnits");
    if (api.unblockable(state, cards, id)) rules.add("cantBeBlocked");
    if (api.canAttackWithLag(state, cards, id, "unit"))
      rules.add("canAttackOnPlayedTurnAgainstUnits");
    if (api.canAttackWithLag(state, cards, id, "gig")) rules.add("canAttackRivalOnPlayedTurn");
    // Target-dependent ready-attack permissions are evaluated against each real
    // defender by the native legal-action API, not promoted to a global rule.
    return [...rules];
  }
  function costEffects(
    id: string,
    printed: number | null,
    effective: number,
  ): FilteredEffectView[] {
    if (printed === null || effective === printed) return [];
    return [
      effect(
        `${id}:cost`,
        undefined,
        "costModifier",
        `${effective - printed >= 0 ? "+" : ""}${effective - printed} play cost`,
        {
          tone: effective < printed ? "buff" : "debuff",
          modifierLabel: String(effective - printed),
        },
      ),
    ];
  }
  function playerEffects(seat: Seat): FilteredEffectView[] {
    const effects: FilteredEffectView[] = [];
    const discount = state.players[seat].nextProgramDiscount;
    if (discount?.turnNumber === state.turnNumber)
      effects.push(
        effect(
          `p${seat}:program-discount`,
          undefined,
          "costModifier",
          `Next Program costs ${discount.amount} less (minimum ${Math.max(1, discount.minCost)})`,
          { isTemporary: true, durationLabel: "this turn", tone: "buff" },
        ),
      );
    state.goSoloDiscounts.forEach((entry, index) => {
      if (entry.controller === seat && entry.turnNumber === state.turnNumber)
        effects.push(
          effect(
            `p${seat}:solo-discount:${index}`,
            entry.source,
            "costModifier",
            `Go Solo costs ${entry.amount} less (minimum ${Math.max(1, entry.minCost)})`,
            { isTemporary: true, durationLabel: "this turn", tone: "buff" },
          ),
        );
    });
    state.combatShields.forEach((entry, index) => {
      if (
        entry.controller === seat &&
        entry.unit === undefined &&
        entry.turnNumber === state.turnNumber
      )
        effects.push(
          effect(
            `p${seat}:shield:${index}`,
            entry.source,
            "preventNextRivalFightDefeat",
            "Fight defeat prevention",
            {
              isTemporary: true,
              durationLabel: entry.expires === "nextFight" ? "next fight this turn" : "this turn",
              tone: "buff",
            },
          ),
        );
    });
    state.stealBans.forEach((entry, index) => {
      if (entry.controller === seat)
        effects.push(
          effect(
            `p${seat}:steal-ban:${index}`,
            entry.source,
            "nativeStealBan",
            `${entry.thief} cannot steal Gigs ${entry.protects === "aboveThiefPower" ? "above" : "below"} its power`,
            { isTemporary: true, durationLabel: "until source's next turn", tone: "buff" },
          ),
        );
    });
    state.delayedEffects.forEach((entry, index) => {
      if (
        entry.controller !== seat ||
        entry.targetId !== undefined ||
        (entry.expires === "thisTurn" && entry.turnNumber !== state.turnNumber)
      )
        return;
      effects.push(
        effect(
          `p${seat}:delayed:${index}`,
          entry.source,
          "nativeDelayedEffect",
          `Pending ${entry.key}`,
          {
            isTemporary: true,
            durationLabel: entry.expires === "thisTurn" ? "this turn" : "until source's next turn",
          },
        ),
      );
    });
    for (const { pid, sourceId } of activeSources) {
      const instance = state.instances[sourceId];
      if (!instance) continue;
      (cards(instance.definitionId)?.auras ?? []).forEach((entry, index) => {
        if (entry.kind === "playCost" && sideMatches(entry.target.side, pid, seat)) {
          const { side: _side, ...filter } = entry.target;
          const played = state.players[seat].cardsPlayedThisTurn;
          if (
            entry.firstEachTurn &&
            played?.turnNumber === state.turnNumber &&
            played.instanceIds.some((id) => api.matches(state, cards, id, entry.target))
          )
            return;
          effects.push(
            effect(
              `p${seat}:cost-aura:${effects.length}:${index}`,
              sourceId,
              "costModifier",
              `${entry.amount >= 0 ? "+" : ""}${entry.amount} play cost ${JSON.stringify(filter)}${entry.firstEachTurn ? " (first each turn)" : ""}`,
              { tone: entry.amount < 0 ? "buff" : "debuff" },
            ),
          );
        } else if (
          (entry.kind === "goSoloTax" || entry.kind === "callCost") &&
          sideMatches(entry.side, pid, seat)
        ) {
          if (
            entry.kind === "callCost" &&
            entry.when &&
            !entry.when({ state, cards, self: sourceId })
          )
            return;
          effects.push(
            effect(
              `p${seat}:cost-aura:${effects.length}:${index}`,
              sourceId,
              "costModifier",
              `${entry.amount >= 0 ? "+" : ""}${entry.amount} ${entry.kind === "goSoloTax" ? "Go Solo" : "Call"} cost`,
              { tone: entry.amount < 0 ? "buff" : "debuff" },
            ),
          );
        }
      });
    }
    return effects;
  }
  return { cardEffects, grantedRules, costEffects, playerEffects };
}
