import type { AcEffect } from "@tcg/alpha-clash-types";
import { resolveEffectTargets } from "../../../../../../../../../alpha-clash/packages/engine/src/effects.ts";
import {
  abilitiesOf,
  grantedActivatedAbilities,
  effectiveDefense,
} from "../../../../../../../../../alpha-clash/packages/engine/src/state.ts";
import { collectChosenSelectorEntries } from "../../../../../../../../../alpha-clash/packages/engine/src/target-declarations.ts";
import { alphaClashCardValue } from "./evaluate.ts";
import { alphaClashSearchActor } from "./search-state.ts";
import type {
  AcCommand,
  MatchState,
  PlayerId,
  RuntimeCard,
} from "../../../../../../../../../alpha-clash/packages/engine/src/types.ts";

/** Bounded, deterministic combinations; native dispatch remains the legality authority. */
function combinations(ids: readonly string[], count: number, limit = 24): string[][] {
  const out: string[][] = [];
  const visit = (start: number, selected: string[]) => {
    if (out.length >= limit) return;
    if (selected.length === count) {
      out.push([...selected]);
      return;
    }
    for (let n = start; n < ids.length; n++) {
      selected.push(ids[n]);
      visit(n + 1, selected);
      selected.pop();
      if (out.length >= limit) break;
    }
  };
  if (count >= 0 && count <= ids.length) visit(0, []);
  return out;
}

function orders(ids: readonly string[]): string[][] {
  if (ids.length <= 1) return [[...ids]];
  const out = [[...ids], [...ids].reverse()];
  // Vary the first resolution without enumerating factorially many orders.
  for (const id of ids) out.push([id, ...ids.filter((other) => other !== id)]);
  return out.slice(0, 12);
}

function targetOptions(
  state: MatchState,
  seat: PlayerId,
  sourceId: string,
  effects: readonly AcEffect[],
): string[][] {
  const slots = new Map<number, Set<string>>();
  for (const { target, index } of collectChosenSelectorEntries(effects)) {
    const candidates =
      target.type === "declared"
        ? Object.values(state.cards)
            .filter((card) => !["deck", "hand", "standby"].includes(card.zone))
            .map((card) => card.instanceId)
        : resolveEffectTargets(state, "chosen" in target ? { ...target, chosen: false } : target, {
            state,
            playerId: seat,
            sourceId,
          });
    const ids = slots.get(index) ?? new Set<string>();
    for (const id of candidates) ids.add(id);
    slots.set(index, ids);
  }
  let out: string[][] = [[]];
  for (const [, ids] of [...slots].sort(([a], [b]) => a - b)) {
    out = out.flatMap((prior) => [...ids].map((id) => [...prior, id])).slice(0, 32);
  }
  return out;
}

/** Raw proposals, not a claim that every command is legal or every combination is searched. */
export function alphaClashExpertCandidates(state: MatchState, seat: PlayerId): AcCommand[] {
  if (alphaClashSearchActor(state) !== seat) return [];
  const cards = Object.values(state.cards);
  const own = (zone: RuntimeCard["zone"]) =>
    cards.filter((card) => card.controller === seat && card.zone === zone);
  const hand = own("hand");
  const commands: AcCommand[] = [];
  const choice = state.pendingChoices[0];
  if (choice) {
    const base = { type: "resolveChoice" as const, playerId: seat, choiceId: choice.id };
    switch (choice.kind) {
      case "ordering":
        commands.push(
          ...orders(choice.candidates.map((item) => item.id)).map((orderedIds) => ({
            ...base,
            orderedIds,
          })),
        );
        break;
      case "option":
      case "modal":
        if (choice.kind === "modal" && choice.triggerOrder) {
          const order = choice.triggerOrder;
          commands.push(
            ...orders(
              order.batch
                .filter(
                  (entry) => entry.controller === seat && !order.orderedIds.includes(entry.id),
                )
                .map((entry) => entry.id),
            ).map((orderedIds) => ({ ...base, orderedIds })),
          );
        } else commands.push(...choice.options.map(({ id: optionId }) => ({ ...base, optionId })));
        break;
      case "target":
        commands.push(...choice.candidates.map((optionId) => ({ ...base, optionId })));
        break;
      case "count":
        for (let n = 0; n <= choice.max; n++) commands.push({ ...base, optionId: String(n) });
        break;
      case "division": {
        commands.push({ ...base, division: {} });
        for (const id of choice.candidates)
          commands.push({ ...base, division: { [id]: choice.total } });
        if (choice.maxTargets >= 2)
          for (const [a, b] of combinations(choice.candidates, 2, 12)) {
            for (let n = 1; n < choice.total; n++) {
              commands.push({ ...base, division: { [a]: n, [b]: choice.total - n } });
              if (commands.length >= 64) break;
            }
          }
        // Distribute to defeat thresholds, including three or more recipients.
        const ranked = [...choice.candidates].sort(
          (a, b) =>
            (state.cards[a] ? effectiveDefense(state, a) : 1) -
            (state.cards[b] ? effectiveDefense(state, b) : 1),
        );
        const division: Record<string, number> = {};
        let left = choice.total;
        for (const id of ranked.slice(0, choice.maxTargets)) {
          const amount = Math.min(
            left,
            Math.max(1, state.cards[id] ? effectiveDefense(state, id) : 1),
          );
          if (amount > 0) division[id] = amount;
          left -= amount;
        }
        if (ranked[0] && left) division[ranked[0]] = (division[ranked[0]] ?? 0) + left;
        commands.push({ ...base, division });
        break;
      }
    }
  } else if (state.phase.name === "setup") {
    if (state.mulligansResolved) commands.push({ type: "startGame" });
    else if (state.mulliganDeclarations[seat] === undefined)
      commands.push({ type: "declareMulligan", playerId: seat, take: false });
    else commands.push({ type: "mulligan", playerId: seat, cardIds: [] });
  } else if (state.phase.name === "expansion" && state.phase.step === "resource") {
    commands.push(
      ...[...hand]
        .sort((a, b) => alphaClashCardValue(state, a) - alphaClashCardValue(state, b))
        .map((card) => ({
          type: "deployResource" as const,
          playerId: seat,
          cardId: card.instanceId,
        })),
    );
    commands.push({ type: "pass", playerId: seat });
  } else {
    const pass: AcCommand = {
      type:
        state.phase.name === "primary" && !state.responseWindow && !state.clash
          ? "endTurn"
          : "pass",
      playerId: seat,
    };
    // Always consider passing, including declining a response which would cost a better future play.
    commands.push(pass);
    const primary = state.phase.name === "primary" && !state.responseWindow && !state.clash;
    const playing =
      primary ||
      (!state.responseWindow &&
        !!state.clash &&
        ["attackerBuff", "defenderBuff"].includes(state.clash.step));
    if (playing || state.responseWindow) {
      for (const source of cards.filter(
        (card) =>
          card.controller === seat &&
          ["contender", "clash", "clashground", "accessory", "oblivion", "hand"].includes(
            card.zone,
          ),
      )) {
        for (const [abilityIndex, ability] of [
          ...abilitiesOf(state.definitions[source.definitionId]),
          ...grantedActivatedAbilities(state, source.instanceId),
        ].entries()) {
          if (ability.kind !== "activated") continue;
          const targets = ability.requiredTargets
            ? combinations(
                resolveEffectTargets(state, ability.requiredTargets.target, {
                  state,
                  playerId: seat,
                  sourceId: source.instanceId,
                }),
                (state.portalOpen ? ability.requiredTargets.portalAmount : undefined) ??
                  ability.requiredTargets.amount,
              )
            : targetOptions(state, seat, source.instanceId, ability.effects);
          for (const ids of targets) {
            const groups = [ids];
            for (const group of groups) {
              for (
                let costIndex = 0;
                costIndex <= (ability.alternateCosts?.length ?? 0);
                costIndex++
              )
                commands.push({
                  type: "activateAbility",
                  playerId: seat,
                  cardId: source.instanceId,
                  abilityIndex,
                  costIndex,
                  targetId: group[0],
                  targetIds: group.slice(1),
                });
            }
          }
        }
      }
      const playable = playing
        ? [
            ...hand,
            ...own("banished"),
            ...own("oblivion").filter(
              (card) =>
                "replay" in state.definitions[card.definitionId] ||
                state.playPermissions.some((permission) => permission.cardId === card.instanceId),
            ),
          ]
        : [...hand, ...own("accessory").filter((card) => card.faceDown)];
      const plays: AcCommand[][] = [];
      for (const card of playable) {
        const def = state.definitions[card.definitionId];
        const group: AcCommand[] = [];
        const modes =
          def.cardType === "action" || (def.cardType === "accessory" && def.subtype === "trap")
            ? def.modes
            : undefined;
        const selections = modes
          ? combinations(
              modes.map((_, index) => String(index)),
              def.cardType === "action" ? (def.modeCount ?? 1) : 1,
            ).map((ids) => ids.map(Number))
          : [undefined];
        for (const modeIndices of selections) {
          const effects =
            modeIndices && modes
              ? modeIndices.flatMap((index) => modes[index].effects)
              : "effects" in def
                ? (def.effects ?? [])
                : [];
          let targets = targetOptions(state, seat, card.instanceId, effects);
          if (def.cardType === "action" && def.targetDeclaration) {
            const declaration = def.targetDeclaration;
            const ids = resolveEffectTargets(
              state,
              { ...declaration.target, chosen: false },
              { state, playerId: seat, sourceId: card.instanceId },
            );
            targets = [];
            for (
              let count = declaration.min;
              count <= Math.min(declaration.max, ids.length);
              count++
            )
              targets.push(...combinations(ids, count));
          }
          if (
            primary &&
            card.zone === "hand" &&
            ((def.cardType === "accessory" && def.subtype === "trap") ||
              ("keywords" in def && def.keywords?.includes("ambush")))
          )
            group.push({ type: "setCard", playerId: seat, cardId: card.instanceId });
          const discards = def.additionalDiscard
            ? combinations(
                hand.filter((other) => other !== card).map((other) => other.instanceId),
                def.additionalDiscard,
                8,
              )
            : [undefined];
          for (const ids of targets)
            for (const discardCostIds of discards) {
              if (playing) {
                const base = {
                  type: "playCard" as const,
                  playerId: seat,
                  cardId: card.instanceId,
                  targetId: ids[0],
                  targetIds: ids.slice(1),
                  discardCostIds,
                  modeIndices,
                };
                group.push(base);
                if (def.cardType === "action" && def.manifestDiminishCost)
                  group.push({ ...base, manifest: true });
              } else {
                const base = {
                  type: "respond" as const,
                  playerId: seat,
                  cardId: card.instanceId,
                  targetId: ids[0],
                  targetIds: ids.slice(1),
                  discardCostIds,
                  modeIndices,
                };
                group.push(base);
                if (def.cardType === "action" && def.healthCostReduction)
                  for (let n = 1; n <= def.healthCostReduction.max; n++)
                    group.push({ ...base, healthReduction: n });
                if (
                  def.cardType === "accessory" &&
                  def.subtype === "trap" &&
                  def.sacrificeCostReduction &&
                  state.portalOpen
                )
                  for (let count = 1; count <= 2; count++)
                    for (const costReductionSacrificeIds of combinations(
                      own("clash").map((ally) => ally.instanceId),
                      count,
                      8,
                    ))
                      group.push({ ...base, costReductionSacrificeIds });
              }
            }
        }
        const expanded: AcCommand[] = [];
        for (const command of group) {
          if (
            (command.type === "playCard" || command.type === "respond") &&
            "cost" in def &&
            def.cost?.x
          ) {
            for (
              let xValue = 0;
              xValue <= Math.min(16, own("resource").filter((resource) => resource.ready).length);
              xValue++
            )
              expanded.push({ ...command, xValue });
          } else expanded.push(command);
          if (command.type === "playCard" && def.cardType === "clash" && def.alternateCost) {
            let payments: string[][] = [[]];
            for (const payment of def.alternateCost.payments) {
              const ids = resolveEffectTargets(state, payment.target, {
                state,
                playerId: seat,
                sourceId: card.instanceId,
              });
              payments = payments
                .flatMap((prior) =>
                  combinations(ids, payment.amount, 8).map((selection) => [...prior, ...selection]),
                )
                .slice(0, 8);
            }
            for (const alternateCostCardIds of payments)
              expanded.push({ ...command, alternateCostCardIds });
          }
        }
        plays.push(expanded);
      }
      // Interleave cards so target-rich cards cannot consume the whole candidate budget.
      for (let index = 0; plays.some((group) => index < group.length); index++)
        for (const group of plays) if (group[index]) commands.push(group[index]);
    }
    if (primary) {
      for (const weapon of own("accessory").filter((card) => !card.faceDown && !card.attachedTo))
        for (const host of [...own("clash"), ...own("contender")])
          commands.push({
            type: "attachWeapon",
            playerId: seat,
            weaponId: weapon.instanceId,
            targetId: host.instanceId,
          });
      for (const attacker of [...own("clash"), ...own("contender")].filter((card) => card.ready))
        for (const target of cards.filter(
          (card) => card.controller !== seat && ["clash", "contender"].includes(card.zone),
        ))
          commands.push({
            type: "initiateClash",
            playerId: seat,
            attackerId: attacker.instanceId,
            targetId: target.instanceId,
          });
      commands.push({ type: "activatePortal", playerId: seat });
    }
    if (!state.responseWindow && state.clash?.step === "obstruct") {
      const ids = own("clash")
        .filter((card) => card.ready)
        .map((card) => card.instanceId);
      for (let n = 1; n <= Math.min(ids.length, 4); n++)
        for (const obstructorIds of combinations(ids, n, 20))
          commands.push({ type: "declareObstructors", playerId: seat, obstructorIds });
      if (ids.length > 4)
        commands.push({ type: "declareObstructors", playerId: seat, obstructorIds: ids });
    }
  }
  const seen = new Set<string>();
  return commands.filter((command) => {
    const key = JSON.stringify(command);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Alternative explicit payments based on the resources the native command actually spent. */
export function alphaClashPaymentVariants(
  from: MatchState,
  command: AcCommand,
  after: MatchState,
): AcCommand[] {
  if ((command.type !== "playCard" && command.type !== "respond") || command.resourcePayment)
    return [];
  const available = Object.values(from.cards).filter(
    (card) => card.controller === command.playerId && card.zone === "resource" && card.ready,
  );
  const spent = available.filter((card) => after.cards[card.instanceId]?.ready === false).length;
  if (!spent || spent >= available.length) return [];
  const out: AcCommand[] = [];
  for (const ids of combinations(
    available.map((card) => card.instanceId),
    spent,
    8,
  )) {
    let payments: import("../../../../../../../../../alpha-clash/packages/engine/src/types.ts").AcResourcePayment[][] =
      [[]];
    for (const id of ids)
      payments = payments
        .flatMap((prior) =>
          from.definitions[from.cards[id].definitionId].colors.map((color) => [
            ...prior,
            { cardId: id, color },
          ]),
        )
        .slice(0, 8);
    for (const resourcePayment of payments) out.push({ ...command, resourcePayment });
  }
  return out.slice(0, 16);
}
