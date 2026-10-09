import {
  applyCommand,
  effectiveAttack,
  effectiveDefense,
  type AcCommand,
  type MatchState,
  type PlayerId,
  type RuntimeCard,
} from "@tcg/alpha-clash-engine";

export interface AlphaClashHeuristics {
  readonly playBeforeAttack: boolean;
  readonly playBeforeAttackWithVoidReplay?: boolean;
  readonly acceptOptionalTriggers: boolean;
  readonly keepClashWeight: number;
}

export const ALPHA_CLASH_HEURISTICS: Readonly<Record<string, AlphaClashHeuristics>> = {
  "meta-v3": {
    playBeforeAttack: false,
    playBeforeAttackWithVoidReplay: true,
    acceptOptionalTriggers: true,
    keepClashWeight: 3,
  },
  "meta-v1": { playBeforeAttack: false, acceptOptionalTriggers: true, keepClashWeight: 3 },
  "meta-v2": { playBeforeAttack: true, acceptOptionalTriggers: true, keepClashWeight: 5 },
};

export function validateAlphaClashOverrides(
  raw: Readonly<Record<string, unknown>>,
): Partial<AlphaClashHeuristics> {
  for (const [key, value] of Object.entries(raw)) {
    if (
      key === "playBeforeAttack" ||
      key === "playBeforeAttackWithVoidReplay" ||
      key === "acceptOptionalTriggers"
    ) {
      if (typeof value !== "boolean") throw new Error(`${key} must be boolean`);
    } else if (key === "keepClashWeight") {
      if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 20)
        throw new Error("keepClashWeight must be between zero and twenty");
    } else throw new Error(`Unknown Alpha Clash heuristic: ${key}`);
  }
  return raw;
}

function value(state: MatchState, card: RuntimeCard): number {
  const definition = state.definitions[card.definitionId];
  if (definition.cardType === "clash" || definition.cardType === "contender")
    return effectiveAttack(state, card.instanceId) * 2 + effectiveDefense(state, card.instanceId);
  if (definition.cardType === "accessory") return 2;
  return 1;
}

/** Deterministic laboratory policy. Legality is checked on a copy through public commands. */
export function alphaClashHeuristicCommand(
  state: MatchState,
  seat: PlayerId,
  config: AlphaClashHeuristics,
): AcCommand | null {
  const cards = Object.values(state.cards);
  const own = (zone: RuntimeCard["zone"]) =>
    cards.filter((card) => card.controller === seat && card.zone === zone);
  const hand = own("hand");
  const enemy = seat === "player-one" ? "player-two" : "player-one";
  const commands: AcCommand[] = [];
  const choice = state.pendingChoices[0];
  if (choice) {
    if (choice.playerId !== seat) return null;
    const base = { type: "resolveChoice" as const, playerId: seat, choiceId: choice.id };
    if (choice.kind === "option")
      commands.push(
        { ...base, optionId: config.acceptOptionalTriggers ? "yes" : "no" },
        { ...base, optionId: "no" },
      );
    if (choice.kind === "modal") {
      // Taking no card and choosing health loss are fallbacks. Card order is stable.
      const options = [...choice.options].sort(
        (a, b) =>
          Number(/Take no card|Lose one health/.test(a.label)) -
          Number(/Take no card|Lose one health/.test(b.label)),
      );
      commands.push(...options.map((option) => ({ ...base, optionId: option.id })));
    }
    if (choice.kind === "target") {
      const candidates = [...choice.candidates].sort((a, b) => {
        const left = state.cards[a],
          right = state.cards[b];
        // Preserve large allies for a sacrifice; remove large opposing cards.
        const score = (card: RuntimeCard) =>
          value(state, card) * (card.controller === seat && card.zone === "clash" ? -1 : 1);
        return score(right) - score(left);
      });
      commands.push(...candidates.map((optionId) => ({ ...base, optionId })));
    }
    if (choice.kind === "count")
      for (let count = choice.max; count >= 0; count--)
        commands.push({ ...base, optionId: String(count) });
    if (choice.kind === "division") {
      const division: Record<string, number> = {};
      if (choice.candidates[0]) division[choice.candidates[0]] = choice.total;
      commands.push({ ...base, division }, { ...base, division: {} });
    }
  } else if (state.phase.name === "setup") commands.push({ type: "startGame" });
  else if (state.phase.name === "expansion" && state.phase.step === "resource") {
    const ranked = [...hand].sort((a, b) => {
      const keep = (card: RuntimeCard) => {
        const definition = state.definitions[card.definitionId];
        return (definition.cardType === "clash" ? config.keepClashWeight : 0) + value(state, card);
      };
      return keep(a) - keep(b);
    });
    commands.push(
      ...ranked.map((card) => ({
        type: "deployResource" as const,
        playerId: seat,
        cardId: card.instanceId,
      })),
      { type: "pass", playerId: seat },
    );
  } else {
    const targets = cards
      .filter((card) =>
        ["clash", "contender", "accessory", "clashground", "oblivion", "resource"].includes(
          card.zone,
        ),
      )
      .sort(
        (a, b) =>
          Number(b.controller === enemy) - Number(a.controller === enemy) ||
          value(state, b) - value(state, a),
      );
    const targetIds: (string | undefined)[] = [
      undefined,
      ...targets.map((card) => card.instanceId),
    ];
    const inPlay = cards.filter(
      (card) =>
        card.controller === seat &&
        ["contender", "clash", "clashground", "accessory", "oblivion"].includes(card.zone),
    );
    const activations: AcCommand[] = [];
    for (const source of inPlay) {
      for (const [abilityIndex, ability] of (
        state.definitions[source.definitionId].abilities ?? []
      ).entries()) {
        if (ability.kind !== "activated") continue;
        // Overseer sacrifices a board card. Use it only with another small ally.
        if (
          state.definitions[source.definitionId].name === "Death, Overseer" &&
          !own("clash").some(
            (card) => card.instanceId !== source.instanceId && value(state, card) <= 3,
          )
        )
          continue;
        for (const targetId of targetIds) {
          const base = {
            type: "activateAbility" as const,
            playerId: seat,
            cardId: source.instanceId,
            abilityIndex,
            targetId,
          };
          if (
            ability.requiredTargets &&
            state.portalOpen &&
            ability.requiredTargets.portalAmount === 2
          ) {
            for (const otherTarget of targets.filter(
              (card) => card.zone === "oblivion" && card.instanceId !== targetId,
            ))
              activations.push({ ...base, targetIds: [otherTarget.instanceId] });
          } else activations.push(base);
        }
      }
    }
    if (state.responseWindow) {
      if (state.responseWindow.openFor !== seat) return null;
      commands.push(...activations);
      for (const card of [...own("accessory").filter((card) => card.faceDown), ...hand]) {
        const definition = state.definitions[card.definitionId];
        for (const targetId of targetIds) {
          const base = {
            type: "respond" as const,
            playerId: seat,
            cardId: card.instanceId,
            targetId,
          };
          commands.push(base);
          if (definition.cardType === "action" && definition.healthCostReduction) {
            for (
              let healthReduction = 1;
              healthReduction <= definition.healthCostReduction.max;
              healthReduction++
            )
              commands.push({ ...base, healthReduction });
          }
          if (
            definition.cardType === "accessory" &&
            definition.subtype === "trap" &&
            definition.sacrificeCostReduction &&
            state.portalOpen
          ) {
            const allies = own("clash")
              .filter((card) => state.definitions[card.definitionId].cardType === "clash")
              .sort((a, b) => value(state, a) - value(state, b));
            for (let count = 1; count <= Math.min(2, allies.length); count++)
              commands.push({
                ...base,
                costReductionSacrificeIds: allies.slice(0, count).map((card) => card.instanceId),
              });
          }
        }
      }
      commands.push({ type: "pass", playerId: seat });
    } else if (state.clash) {
      if (
        state.clash.step === "obstruct" &&
        state.cards[state.clash.targetId].controller === seat
      ) {
        for (const card of own("clash")
          .filter((card) => card.ready)
          .sort((a, b) => value(state, a) - value(state, b)))
          commands.push({
            type: "declareObstructors",
            playerId: seat,
            obstructorIds: [card.instanceId],
          });
      }
      commands.push({ type: "pass", playerId: seat });
    } else if (state.phase.name === "primary") {
      const attacks: AcCommand[] = [];
      const opposing = targets
        .filter((card) => card.controller === enemy && ["clash", "contender"].includes(card.zone))
        .sort(
          (a, b) =>
            Number(state.definitions[b.definitionId].cardType === "contender") -
            Number(state.definitions[a.definitionId].cardType === "contender"),
        );
      for (const source of [...own("clash"), ...own("contender")]
        .filter((card) => card.ready)
        .sort((a, b) => value(state, b) - value(state, a))) {
        for (const target of opposing)
          attacks.push({
            type: "initiateClash",
            playerId: seat,
            attackerId: source.instanceId,
            targetId: target.instanceId,
          });
      }
      const plays: AcCommand[] = [];
      for (const weapon of own("accessory").filter((card) => !card.faceDown && !card.attachedTo)) {
        for (const host of [...own("clash"), ...own("contender")])
          plays.push({
            type: "attachWeapon",
            playerId: seat,
            weaponId: weapon.instanceId,
            targetId: host.instanceId,
          });
      }
      const playable = [
        ...hand,
        ...own("banished").filter((card) =>
          state.definitions[card.definitionId].abilities?.some(
            (ability) => ability.kind === "triggered" && ability.trigger.event === "banished",
          ),
        ),
      ].sort(
        (a, b) =>
          Number(state.definitions[b.definitionId].cardType === "clash") -
            Number(state.definitions[a.definitionId].cardType === "clash") ||
          value(state, b) - value(state, a),
      );
      for (const card of playable) {
        const definition = state.definitions[card.definitionId];
        if (
          card.zone === "hand" &&
          ((definition.cardType === "accessory" && definition.subtype === "trap") ||
            (definition.cardType === "clash" && definition.keywords?.includes("ambush")))
        ) {
          if (
            definition.cardType === "accessory" ||
            own("resource").filter((card) => card.ready).length < (definition.cost?.total ?? 0)
          )
            plays.push({ type: "setCard", playerId: seat, cardId: card.instanceId });
        }
        const discardCostIds = definition.additionalDiscard
          ? hand
              .filter((other) => other.instanceId !== card.instanceId)
              .slice(0, definition.additionalDiscard)
              .map((other) => other.instanceId)
          : undefined;
        for (const targetId of targetIds)
          plays.push({
            type: "playCard",
            playerId: seat,
            cardId: card.instanceId,
            targetId,
            discardCostIds,
          });
      }
      // Buffs from entry and equipment should be established before declaring attacks.
      commands.push(
        ...(config.playBeforeAttack ||
        (config.playBeforeAttackWithVoidReplay &&
          state.definitions[own("contender")[0].definitionId].abilities?.some(
            (ability) => ability.kind === "static" && ability.allowVoidReplay,
          ))
          ? [...plays, ...attacks]
          : [...attacks, ...plays]),
        ...activations,
        { type: "endTurn", playerId: seat },
      );
    } else commands.push({ type: "pass", playerId: seat });
  }
  for (const command of commands) {
    const probe: MatchState = {
      ...structuredClone({ ...state, definitions: {}, moveLog: [] }),
      definitions: { ...state.definitions },
    };
    if (applyCommand(probe, command).success) return command;
  }
  return null;
}
