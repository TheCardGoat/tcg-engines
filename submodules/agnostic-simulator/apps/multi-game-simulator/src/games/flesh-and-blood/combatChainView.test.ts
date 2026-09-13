import { testFabArt } from "./presentation-test-provider";
const { resolveFabCardArt } = testFabArt;
import { describe, expect, it } from "vitest";

import { fleshAndBloodCardsByCanonicalId } from "@tcg/flesh-and-blood-cards";
import { kassai } from "@tcg/flesh-and-blood-cards/cards/heroes/kassai";
import { durendal } from "@tcg/flesh-and-blood-cards/cards/weapons/durendal";
import { dash, rok, tuffnut } from "@tcg/flesh-and-blood-cards/simulator-scenario-cards";
import { FAB_MANUAL_HARNESS, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";

import { combatCardNumeric, projectCombatChainView } from "./combatChainView";
import {
  createClosedWithPermanentsFixtureState,
  createCombatFixtureState,
  createOpeningFixtureState,
} from "./fixtures";
import { matchStateToPresentation } from "./projection";
import type { FabPresentationState } from "./state";

describe("projectCombatChainView", () => {
  it("resolves board and preview art for Rok's activated attack layer", async () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        weapon1: [rok],
        hand: [],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);
    const runtime = game.getRuntime();
    const actor = { role: "player" as const, actorId: Tuffnut.id };
    const before = runtime.viewer(actor);
    const rokInstanceId = before.players[Tuffnut.id]?.zones.weapon1[0];
    const printingId = fleshAndBloodCardsByCanonicalId.get(rok.canonicalId)?.printings[0]?.id;
    expect(rokInstanceId).toBeDefined();
    expect(printingId).toBeDefined();

    Tuffnut.activate(rok);

    const presentation = matchStateToPresentation(
      runtime.viewer(actor),
      Tuffnut.id,
      runtime.viewerResources(actor),
      { [rokInstanceId!]: printingId! },
    );
    const pendingAttack = projectCombatChainView(presentation).pendingAttack;

    expect(pendingAttack?.entity).toMatchObject({
      title: "Rok",
      dataAttributes: {
        "data-fab-canonical-id": rok.canonicalId,
        "data-fab-printing-id": printingId,
      },
    });
    const art = resolveFabCardArt({
      canonicalId: rok.canonicalId,
      printingId,
      name: pendingAttack?.entity.title,
    });
    expect(art.boardImageUrl).toMatch(/\/public\/fab\/assets\/board\/[a-f0-9]{64}\.webp$/);
    expect(art.printedImageUrl).toMatch(/\/public\/fab\/assets\/full\/[a-f0-9]{64}\.webp$/);
  });

  it("shows Durendal's live power on the Layer Step attack, not its printed 3", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        weapon1: [{ card: durendal, state: { powerCounterTotal: 2 } }],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);
    const runtime = game.getRuntime();
    const actor = { role: "player" as const, actorId: Kassai.id };

    Kassai.activate(durendal);

    const presentation = matchStateToPresentation(
      runtime.viewer(actor),
      Kassai.id,
      runtime.viewerResources(actor),
    );
    const view = projectCombatChainView(presentation);
    const weapon = Object.values(presentation.cards).find(
      (card) => card.cardId === durendal.canonicalId && card.zone === "weapon",
    );

    expect(view.step).toBe("layer");
    expect(weapon?.currentNumeric?.power).toBe(5);
    expect(view.pendingAttack?.entity.title).toBe("Durendal");
    expect(combatCardNumeric(view.pendingAttack!, "power")).toBe(5);
    expect(view.pendingAttack?.entity.decorations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          content: { kind: "text", text: "+1 ×2" },
        }),
      ]),
    );
  });

  it("uses the seated weapon's live power when the synthetic layer only has printed stats", () => {
    const state = createOpeningFixtureState();
    const ownerId = state.players[0]!;
    const weaponId = "weapon-durendal";
    const layerId = "rules-stack:durendal-attack";
    const layerDefinitionId = "rules-stack-definition:durendal-attack";
    const view = projectCombatChainView({
      ...state,
      cards: {
        ...state.cards,
        [weaponId]: {
          id: weaponId,
          cardId: "durendal",
          ownerId,
          zone: "weapon",
          face: "up",
          currentNumeric: { power: 5 },
          counters: [{ label: "+1{p}", count: 2, modifier: { property: "power", value: 1 } }],
        },
        [layerId]: {
          id: layerId,
          cardId: layerDefinitionId,
          ownerId,
          zone: "stack",
          face: "up",
          sourceInstanceId: weaponId,
        },
      },
      cardDefinitions: {
        ...state.cardDefinitions,
        durendal: { name: "Durendal", cardType: "weapon", power: 3 },
        [layerDefinitionId]: {
          name: "Durendal — attack",
          cardType: "activated",
          power: 3,
          presentationName: "Durendal",
          presentationCanonicalId: "durendal",
        },
      },
      stackInstanceIds: [layerId],
      combat: {
        open: true,
        step: "layer",
        defenseDeclarationPending: false,
        activeLink: null,
        chainLinkNumber: 1,
        stackInstanceIds: [layerId],
      },
    });

    expect(view.pendingAttack?.entity.id).toBe(layerId);
    expect(view.pendingAttack?.entity.title).toBe("Durendal");
    expect(combatCardNumeric(view.pendingAttack!, "power")).toBe(5);
    expect(view.pendingAttack?.entity.decorations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          content: { kind: "text", text: "+1 ×2" },
        }),
      ]),
    );
  });

  it("reports empty closed chain for the opening fixture", () => {
    const view = projectCombatChainView(createOpeningFixtureState());
    expect(view.empty).toBe(true);
    expect(view.open).toBe(false);
    expect(view.mode).toBe("closed");
    expect(view.attacker).toBeNull();
    expect(view.defenders).toEqual([]);
    expect(view.projectedDamage).toBeNull();
    expect(view.resolvedLinks).toEqual([]);
    expect(view.summary).toMatch(/closed/i);
  });

  it("reports closed mode when combat is null even with permanents present", () => {
    const view = projectCombatChainView(createClosedWithPermanentsFixtureState());
    expect(view.mode).toBe("closed");
    expect(view.open).toBe(false);
    expect(view.empty).toBe(true);
  });

  it("surfaces attacker and declared blocks from engine-backed combat fixture", () => {
    const view = projectCombatChainView(createCombatFixtureState());
    expect(view.empty).toBe(false);
    expect(view.open).toBe(true);
    expect(view.mode).toBe("active-link");
    // Engine boots to defend with blocks declared (post-defend script).
    expect(view.step).toBe("defend");
    expect(view.attacker?.entity.title).toMatch(/Alpha Rampage|Snatch|Wrecker/i);
    expect(view.defenders.length).toBeGreaterThanOrEqual(1);
    expect(view.attackPower).toBeGreaterThan(0);
    expect(view.totalDefense).toBeGreaterThan(0);
    expect(view.stepProgress.map((s) => s.step)).toEqual([
      "layer",
      "attack",
      "defend",
      "reaction",
      "damage",
      "resolution",
    ]);
  });

  it.each(["hand", "banished", "graveyard"] as const)(
    "removes a defender from the active fan after an effect moves it to %s",
    (destination) => {
      const state = createCombatFixtureState();
      const activeLink = state.combat?.activeLink;
      const movedDefenderId = activeLink?.defendingInstanceIds[0];
      if (!activeLink || !movedDefenderId) throw new Error("expected a defending card");
      const movedDefender = state.cards[movedDefenderId];
      if (!movedDefender) throw new Error("expected the defending card projection");

      const view = projectCombatChainView({
        ...state,
        cards: {
          ...state.cards,
          [movedDefenderId]: { ...movedDefender, zone: destination },
        },
      });

      expect(view.defenders.map((card) => card.entity.id)).not.toContain(movedDefenderId);
      expect(view.totalDefense).toBeLessThan(projectCombatChainView(state).totalDefense);
    },
  );

  it("recognizes the Layer Step attack without relying on its source type line", () => {
    const state = createCombatFixtureState();
    const attackId = state.combat?.activeLink?.attackInstanceId;
    expect(attackId).toBeDefined();
    const attack = state.cards[attackId!];
    expect(attack).toBeDefined();

    const view = projectCombatChainView({
      ...state,
      stackInstanceIds: [attackId!],
      cardDefinitions: {
        ...state.cardDefinitions,
        [attack!.cardId]: { ...state.cardDefinitions[attack!.cardId]!, typeLine: "Weapon (2H)" },
      },
      combat: { ...state.combat!, step: "layer", activeLink: null, stackInstanceIds: [attackId!] },
    });

    expect(view.pendingAttack?.entity.title).toBe(state.cardDefinitions[attack!.cardId]!.name);
  });

  it("retains a triggered layer's source identity for card artwork and inspection", () => {
    const state = createOpeningFixtureState();
    const hero = Object.values(state.cards).find((card) => card.zone === "hero");
    expect(hero).toBeDefined();
    const sourceDefinition = state.cardDefinitions[hero!.cardId]!;
    const layerId = "rules-stack:rhinar-discard";
    const layerDefinitionId = "rules-stack-definition:rhinar-discard";

    const view = projectCombatChainView({
      ...state,
      cards: {
        ...state.cards,
        [layerId]: {
          id: layerId,
          cardId: layerDefinitionId,
          ownerId: hero!.ownerId,
          zone: "stack",
          face: "up",
        },
      },
      cardDefinitions: {
        ...state.cardDefinitions,
        [layerDefinitionId]: {
          ...sourceDefinition,
          name: `${sourceDefinition.name} — discard trigger`,
          presentationCanonicalId: hero!.cardId,
        },
      },
      stackInstanceIds: [layerId],
    });

    expect(view.stack[0]).toMatchObject({
      entity: {
        title: `${sourceDefinition.name} — discard trigger`,
        dataAttributes: { "data-fab-canonical-id": hero!.cardId },
      },
    });
  });

  it("keeps the Layer Step attack as pending when a response is above it", () => {
    const state = createCombatFixtureState();
    const attackId = state.combat?.activeLink?.attackInstanceId;
    expect(attackId).toBeDefined();
    const attack = state.cards[attackId!];
    expect(attack).toBeDefined();
    const responseId = `${attackId}-response`;

    const view = projectCombatChainView({
      ...state,
      cards: {
        ...state.cards,
        [responseId]: {
          ...attack!,
          id: responseId,
          zone: "stack",
        },
      },
      stackInstanceIds: [responseId, attackId!],
      combat: {
        ...state.combat!,
        step: "layer",
        activeLink: null,
        stackInstanceIds: [responseId, attackId!],
      },
    });

    expect(view.pendingAttack?.entity.id).toBe(attackId);
    expect(view.stack.map((entry) => entry.entity.id)).toEqual([responseId, attackId]);
  });

  it("projects a newly played attack as the pending next link while retaining the resolved prior link", () => {
    const state = createCombatFixtureState();
    const activeLink = state.combat?.activeLink;
    expect(activeLink).toBeDefined();
    const priorAttack = state.cards[activeLink!.attackInstanceId];
    expect(priorAttack).toBeDefined();
    const pendingAttackId = `${activeLink!.attackInstanceId}-next`;

    const view = projectCombatChainView({
      ...state,
      cards: {
        ...state.cards,
        [pendingAttackId]: {
          ...priorAttack!,
          id: pendingAttackId,
          zone: "stack",
        },
      },
      stackInstanceIds: [pendingAttackId],
      combat: {
        ...state.combat!,
        step: "layer",
        chainLinkNumber: 1,
        activeLink: {
          ...activeLink!,
          damageResolved: true,
          didHit: true,
          damage: 2,
        },
        stackInstanceIds: [pendingAttackId],
      },
    });

    expect(view.mode).toBe("active-link");
    expect(view.pendingAttack?.entity.id).toBe(pendingAttackId);
    expect(view.linkHistory).toEqual([
      expect.objectContaining({ index: 1, damageResolved: true, active: false }),
    ]);
  });

  it("projects open-between-links when presentation combat exposes no active link", () => {
    // Engine does not yet emit multi-link open-between history; exercise pure projection.
    const base = createOpeningFixtureState();
    const state: FabPresentationState = {
      ...base,
      combat: {
        open: true,
        step: "resolution",
        defenseDeclarationPending: false,
        activeLink: null,
        resolvedLinks: [
          {
            attackInstanceId: "a1",
            attackingPlayerId: "player-1",
            defendingPlayerId: "player-2",
            attackPower: 6,
            totalDefense: 4,
            damage: 2,
            didHit: true,
          },
          {
            attackInstanceId: "a2",
            attackingPlayerId: "player-1",
            defendingPlayerId: "player-2",
            attackPower: 5,
            totalDefense: 7,
            damage: 0,
            didHit: false,
          },
        ],
      },
    };
    const view = projectCombatChainView(state);
    expect(view.mode).toBe("between-links");
    expect(view.open).toBe(true);
    expect(view.resolvedLinks).toHaveLength(2);
    expect(view.resolvedLinks[0]?.outcomeLabel).toBe("2 damage");
    expect(view.resolvedLinks[1]?.outcomeLabel).toBe("Blocked");
  });

  it("projects multi-defender active link and optional stack from presentation facts", () => {
    const combat = createCombatFixtureState();
    // Stack history is presentation-only until engine projects it.
    const withStack: FabPresentationState = {
      ...combat,
      combat: combat.combat
        ? {
            ...combat.combat,
            stackInstanceIds: Object.keys(combat.cards).slice(0, 3),
          }
        : null,
    };
    const view = projectCombatChainView(withStack);
    expect(view.mode).toBe("active-link");
    expect(view.defenders.length).toBeGreaterThanOrEqual(1);
    expect(view.stack.length).toBeGreaterThanOrEqual(1);
  });

  it("uses the canonical rules-stack order even when no combat chain is open", () => {
    const base = createOpeningFixtureState();
    const [portsideExchangeId, compassId] = Object.keys(base.cards);
    if (!portsideExchangeId || !compassId) throw new Error("expected fixture cards");
    const state: FabPresentationState = {
      ...base,
      cards: {
        ...base.cards,
        [portsideExchangeId]: { ...base.cards[portsideExchangeId]!, zone: "stack" },
        [compassId]: { ...base.cards[compassId]!, zone: "stack" },
      },
      // Engine rulesStack is bottom-to-top. The projection reverses it before
      // passing it to the presentation state, so the last-played layer is first.
      stackInstanceIds: [compassId, portsideExchangeId],
      combat: null,
    };

    const view = projectCombatChainView(state);
    expect(view.stack.map((entry) => entry.entity.id)).toEqual([compassId, portsideExchangeId]);
    expect(view.stack.map((entry) => entry.order)).toEqual([1, 2]);
  });

  it("retains defending and reaction participants on resolved links", () => {
    const state = createCombatFixtureState();
    const activeLink = state.combat?.activeLink;
    if (!activeLink) throw new Error("expected active combat link");
    const defendingInstanceId = activeLink.defendingInstanceIds[0];
    if (!defendingInstanceId) throw new Error("expected a defending card");
    const withHistory: FabPresentationState = {
      ...state,
      combat: state.combat
        ? {
            ...state.combat,
            resolvedLinks: [
              {
                attackInstanceId: activeLink.attackInstanceId,
                attackingPlayerId: activeLink.attackingPlayerId,
                defendingPlayerId: activeLink.defendingPlayerId,
                defendingInstanceIds: [defendingInstanceId],
                reactionInstanceIds: activeLink.reactionInstanceIds,
                attackPower: activeLink.attackPower,
                totalDefense: 3,
                damage: Math.max(0, activeLink.attackPower - 3),
                didHit: activeLink.attackPower > 3,
              },
            ],
          }
        : null,
    };

    const [resolved] = projectCombatChainView(withHistory).resolvedLinks;
    expect(resolved?.defenders.map((card) => card.entity.id)).toEqual([defendingInstanceId]);
    expect(resolved?.reactions.map((card) => card.entity.id)).toEqual(
      activeLink.reactionInstanceIds,
    );
  });

  it("does not invent resolved-link history when source omits it", () => {
    const view = projectCombatChainView(createCombatFixtureState());
    expect(view.resolvedLinks).toEqual([]);
    expect(view.linkHistory.some((l) => l.active)).toBe(true);
  });

  it("shows authoritative resolved links even when final power snapshots are unavailable", () => {
    const state = createCombatFixtureState();
    const activeLink = state.combat?.activeLink;
    if (!activeLink) throw new Error("expected active combat link");

    const view = projectCombatChainView({
      ...state,
      combat: {
        ...state.combat!,
        chainLinkNumber: 2,
        resolvedLinks: [
          {
            attackInstanceId: activeLink.attackInstanceId,
            attackingPlayerId: activeLink.attackingPlayerId,
            defendingPlayerId: activeLink.defendingPlayerId,
            damage: 2,
            didHit: true,
          },
        ],
      },
    });

    expect(view.linkHistory.map((link) => [link.index, link.active])).toEqual([
      [1, false],
      [2, true],
    ]);
    expect(view.resolvedLinks[0]).toMatchObject({
      attackPower: null,
      totalDefense: null,
      outcomeLabel: "2 damage",
    });
  });

  it("uses the engine chain-link number even when prior-link history is unavailable", () => {
    const state = createCombatFixtureState();
    const view = projectCombatChainView({
      ...state,
      combat: state.combat ? { ...state.combat, chainLinkNumber: 2 } : null,
    });

    expect(view.linkHistory).toHaveLength(1);
    expect(view.linkHistory[0]).toMatchObject({ index: 2, active: true });
    expect(view.linkHistory[0]?.summary).toMatch(/^Link 2 /);
  });

  it.each([
    { damage: 5, didHit: true, outcomeLabel: "5 damage", blocked: false },
    { damage: 0, didHit: false, outcomeLabel: "Blocked", blocked: true },
  ])("shows the resolved damage outcome on the active Resolution link", (outcome) => {
    const state = createCombatFixtureState();
    const activeLink = state.combat?.activeLink;
    if (!state.combat || !activeLink) throw new Error("expected active combat link");

    const view = projectCombatChainView({
      ...state,
      combat: {
        ...state.combat,
        step: "resolution",
        activeLink: {
          ...activeLink,
          damageResolved: true,
          damage: outcome.damage,
          didHit: outcome.didHit,
        },
      },
    });

    expect(view.linkHistory.at(-1)).toMatchObject({
      active: true,
      damageResolved: true,
      damage: outcome.damage,
      outcomeLabel: outcome.outcomeLabel,
      blocked: outcome.blocked,
    });
  });

  it("falls back to zone card roles when combat metadata is absent", () => {
    const state = createCombatFixtureState();
    const view = projectCombatChainView({ ...state, combat: null });
    // With combat null, zone cards on combat-chain still open a view.
    if (Object.values(state.cards).some((c) => c.zone === "combat-chain")) {
      expect(view.empty).toBe(false);
      expect(view.mode).toBe("active-link");
    }
  });

  it("keeps a newly moved reaction visible before active-link bookkeeping catches up", () => {
    const state = createCombatFixtureState();
    const activeLink = state.combat?.activeLink;
    const reactionId = activeLink?.defendingInstanceIds[0];
    const reaction = reactionId ? state.cards[reactionId] : undefined;
    if (!state.combat || !activeLink || !reaction) throw new Error("expected a defending card");
    const definition = state.cardDefinitions[reaction.cardId];
    if (!definition) throw new Error("expected a reaction definition");

    const view = projectCombatChainView({
      ...state,
      cards: {
        ...state.cards,
        [reactionId!]: { ...reaction, chainRole: "defense-reaction" },
      },
      cardDefinitions: {
        ...state.cardDefinitions,
        [reaction.cardId]: { ...definition, cardType: "defense-reaction" },
      },
      combat: {
        ...state.combat,
        activeLink: {
          ...activeLink,
          defendingInstanceIds: activeLink.defendingInstanceIds.filter((id) => id !== reactionId),
          reactionInstanceIds: activeLink.reactionInstanceIds.filter((id) => id !== reactionId),
        },
      },
    });

    expect(view.reactions.map((card) => card.entity.id)).toContain(reactionId);
  });

  it("threads each instance's chosen printing into card and stack views", () => {
    const state = createCombatFixtureState();
    const attackId = state.combat?.activeLink?.attackInstanceId;
    expect(attackId).toBeDefined();
    const printingId = "printing-choice-alpha";
    const stamped: FabPresentationState = {
      ...state,
      cards: {
        ...state.cards,
        [attackId!]: { ...state.cards[attackId!]!, printingId },
      },
    };

    const view = projectCombatChainView(stamped);
    expect(view.attacker?.entity.id).toBe(attackId);
    expect(view.attacker?.entity.dataAttributes?.["data-fab-printing-id"]).toBe(printingId);
    expect(view.linkHistory.at(-1)?.attacker?.entity.dataAttributes?.["data-fab-printing-id"]).toBe(
      printingId,
    );

    const layerView = projectCombatChainView({
      ...stamped,
      stackInstanceIds: [attackId!],
      combat: {
        ...stamped.combat!,
        step: "layer",
        activeLink: null,
        stackInstanceIds: [attackId!],
      },
    });
    expect(layerView.pendingAttack?.entity.dataAttributes?.["data-fab-printing-id"]).toBe(
      printingId,
    );
    expect(layerView.stack[0]?.entity.dataAttributes?.["data-fab-printing-id"]).toBe(printingId);
  });

  it("carries the chosen printing onto resolved link attack views", () => {
    const state = createCombatFixtureState();
    const attackId = state.combat?.activeLink?.attackInstanceId;
    expect(attackId).toBeDefined();
    const printingId = "printing-choice-beta";
    const view = projectCombatChainView({
      ...state,
      cards: {
        ...state.cards,
        [attackId!]: { ...state.cards[attackId!]!, printingId },
      },
      combat: {
        ...state.combat!,
        open: true,
        step: "resolution",
        activeLink: null,
        resolvedLinks: [
          {
            attackInstanceId: attackId!,
            attackingPlayerId: state.combat!.activeLink!.attackingPlayerId,
            defendingPlayerId: state.combat!.activeLink!.defendingPlayerId,
            attackPower: 6,
            totalDefense: 4,
            damage: 2,
            didHit: true,
          },
        ],
        stackInstanceIds: [],
      },
    });

    expect(view.mode).toBe("between-links");
    expect(view.resolvedLinks[0]?.attacker?.entity.dataAttributes?.["data-fab-printing-id"]).toBe(
      printingId,
    );
  });
});
