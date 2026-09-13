import { testFabArt } from "./presentation-test-provider";
import { describe, expect, it } from "vitest";

import {
  entityFor,
  engineDefToPresentation,
  entityForFabViewer,
  zoneFor,
  projectFabTabletop,
  projectCombatToPresentation,
  matchStateToPresentation,
  coerceFabPresentationState,
  presentRuntime,
  viewerZonesToPresentationCards,
} from "./projection";
import { projectCombatChainView } from "./combatChainView";
import type { FabViewerResources, FabViewerState } from "@tcg/flesh-and-blood-engine/simulator";
import {
  FAB_FACE_DOWN,
  ids,
  registerFabCardDefinition,
} from "@tcg/flesh-and-blood-engine/simulator";
import { createFabPracticeMatch } from "@tcg/flesh-and-blood-engine/automation";
import { fleshAndBloodDeckCardLibrary } from "@tcg/flesh-and-blood-cards/deck-library";
import { fabObjectInstanceId, fabPlayerId } from "@tcg/flesh-and-blood-engine/testing";
import { getHeroSpecialScenario } from "./hero-special-ui";
import { getFabEngineScenario } from "./engineScenarios";
import { restlessLooterRed } from "@tcg/flesh-and-blood-cards/cards/actions/restless-looter";

import type { FabPresentationCard } from "./state";

const presentationCard = (overrides: Partial<FabPresentationCard> = {}): FabPresentationCard => ({
  id: "card-1",
  cardId: "test-card",
  ownerId: "p1",
  zone: "graveyard",
  face: "up",
  ...overrides,
});

describe("projectCombatToPresentation", () => {
  it("retains every closed engine link before the active link", () => {
    const target = {
      kind: "hero" as const,
      playerId: fabPlayerId("player-2"),
    };
    const resolvedLink = {
      activeAttack: {
        kind: "card" as const,
        sourceObjectId: fabObjectInstanceId("first-attack"),
      },
      attackingPlayerId: fabPlayerId("player-1"),
      defendingPlayerId: fabPlayerId("player-2"),
      attackTargetRef: target,
      defendingInstanceIdsByTarget: {
        "defending-hero": [fabObjectInstanceId("first-block")],
      },
      defendingOrigins: { "first-block": { kind: "hand" as const } },
      reactionInstanceIds: [fabObjectInstanceId("first-reaction")],
      damage: {
        status: "resolved" as const,
        outcomes: [{ target, damageDealtByActiveAttack: 2 }],
      },
      resolvedAttackLki: { power: 6, basePower: 6, totalDefense: 4 },
      wagers: [],
    };
    const combat = {
      open: true,
      step: "attack" as const,
      defenseDeclarationPending: false,
      chainLinkNumber: 2,
      closedLinks: [resolvedLink],
      activeLink: {
        ...resolvedLink,
        activeAttack: {
          kind: "card" as const,
          sourceObjectId: fabObjectInstanceId("second-attack"),
        },
        damage: {
          status: "pending" as const,
          outcomes: [{ target, damageDealtByActiveAttack: 0 }],
        },
        attackPower: 5,
        keywords: ["go again"],
        melded: false,
      },
    } satisfies FabViewerState["combat"];

    const presentation = projectCombatToPresentation(combat);

    expect(presentation?.defenseDeclarationPending).toBe(combat.defenseDeclarationPending);
    expect(presentation?.chainLinkNumber).toBe(2);
    expect(presentation?.resolvedLinks).toEqual([
      expect.objectContaining({
        attackInstanceId: "first-attack",
        defendingInstanceIds: ["first-block"],
        reactionInstanceIds: ["first-reaction"],
        attackPower: 6,
        totalDefense: 4,
        damage: 2,
        didHit: true,
      }),
    ]);
    expect(presentation?.activeLink?.attackInstanceId).toBe("second-attack");
    expect(presentation?.activeLink?.attackTarget).toEqual({
      kind: "hero",
      playerId: "player-2",
    });
    expect(presentation?.activeLink?.defendingInstanceIdsByTarget).toEqual({
      "defending-hero": ["first-block"],
    });
  });
});

describe("zoneFor", () => {
  it("maps deck to secret stack", () => {
    const zone = zoneFor("p1", "deck", ["c1", "c2"]);
    expect(zone.role).toBe("deck");
    expect(zone.visibility).toBe("secret");
    expect(zone.layoutHint).toBe("stack");
    expect(zone.entityIds).toEqual(["c1", "c2"]);
  });

  it("maps hand to owner fan", () => {
    const zone = zoneFor("p1", "hand", ["c1"]);
    expect(zone.role).toBe("hand");
    expect(zone.visibility).toBe("owner");
    expect(zone.layoutHint).toBe("fan");
  });

  it("maps graveyard to public discard stack", () => {
    const zone = zoneFor("p1", "graveyard", []);
    expect(zone.role).toBe("discard");
    expect(zone.visibility).toBe("public");
    expect(zone.layoutHint).toBe("stack");
  });

  it("maps pitch to public resource stack", () => {
    const zone = zoneFor("p1", "pitch", ["c1"]);
    expect(zone.role).toBe("resource");
    expect(zone.visibility).toBe("public");
    expect(zone.layoutHint).toBe("stack");
  });

  it("maps banished to public discard grid", () => {
    const zone = zoneFor("p1", "banished", []);
    expect(zone.role).toBe("discard");
    expect(zone.visibility).toBe("public");
    expect(zone.layoutHint).toBe("grid");
  });

  it("maps arsenal to owner stack", () => {
    const zone = zoneFor("p1", "arsenal", []);
    expect(zone.role).toBe("custom");
    expect(zone.visibility).toBe("owner");
    expect(zone.layoutHint).toBe("stack");
  });
});

describe("entityFor", () => {
  it("returns hidden entity for face-down sentinel", () => {
    const entity = entityFor(FAB_FACE_DOWN, undefined, "p1", true);
    expect(entity.face).toBe("hidden");
    expect(entity.title).toBe("Hidden card");
    expect(entity.backImageUrl).toBe(
      "https://cdn.tcg.online/public/fab/simulator/card-back/fab-card-back.webp",
    );
  });

  it("returns hidden entity when reveal is false", () => {
    const entity = entityFor("card-1", { name: "Test Card", type: "action" }, "p1", false);
    expect(entity.face).toBe("hidden");
    expect(entity.title).toBe("Hidden card");
  });

  it("returns public entity with metadata when revealed", () => {
    const entity = entityFor(
      "card-1",
      { name: "Test Card", type: "action", power: 4, defense: 3 },
      "p1",
      true,
    );
    expect(entity.face).toBe("public");
    expect(entity.title).toBe("Test Card");
    expect(entity.kind).toBe("card");
    expect(entity.states).toEqual([]);
    expect(entity.stats).toEqual([
      { label: "Power", value: "4" },
      { label: "Defense", value: "3" },
    ]);
  });

  it("adds an accessible color and value gem for a revealed pitch", () => {
    const entity = entityFor(
      "card-1",
      { name: "Blue Pitch", type: "action", pitchValue: 3 },
      "p1",
      true,
    );
    expect(entity.decorations).toEqual([
      {
        id: "fab-pitch-3",
        slot: "top-start",
        ariaLabel: "Blue pitch: 3",
        content: { kind: "text", text: "3" },
        tone: "neutral",
      },
    ]);
    expect(entity.frameStyle).toEqual({ color: "#347fd7" });
  });

  it.each([
    [1, "#d82938"],
    [2, "#e6b72d"],
    [3, "#347fd7"],
    [4, "#8b5cf6"],
  ])("maps pitch %i to its FAB card-frame color", (pitchValue, color) => {
    const entity = entityFor(
      `card-${pitchValue}`,
      { name: "Pitch Card", type: "action", pitchValue },
      "p1",
      true,
    );

    expect(entity.frameStyle).toEqual({ color });
  });

  it("can opt a revealed board card into the tactical FAB stat frame", () => {
    const entity = entityFor(
      "card-1",
      { name: "Nimblism", type: "action", pitchValue: 3, cost: 1, power: 4, defense: 3 },
      "p1",
      true,
      { frame: "tactical" },
    );

    expect(entity.dataAttributes).toMatchObject({
      "data-fab-card-frame": "tactical",
      "data-fab-pitch": 3,
    });
    expect(entity.decorations?.map((decoration) => decoration.id)).toEqual([
      "fab-pitch-3",
      "fab-frame-cost",
      "fab-frame-power",
      "fab-frame-defense",
    ]);
  });

  it("shows the engine-evaluated payable cost instead of the printed hand cost", () => {
    const entity = entityFor(
      "crowd-goes-wild",
      {
        name: "Crowd Goes Wild",
        type: "action",
        pitchValue: 2,
        cost: 3,
        power: 6,
        defense: 3,
      },
      "p1",
      true,
      { frame: "tactical", currentNumeric: { cost: 0, power: 9, defense: 7 } },
    );

    expect(entity.decorations).toContainEqual({
      id: "fab-frame-cost",
      slot: "top-end",
      ariaLabel: "Cost: 0",
      content: { kind: "text", text: "0" },
    });
    expect(entity.stats).toContainEqual({ label: "Cost", value: "0" });
    expect(entity.stats).toContainEqual({ label: "Power", value: "9" });
    expect(entity.stats).toContainEqual({ label: "Defense", value: "7" });
  });

  it("projects an Ally's current life for card-context presentation", () => {
    const definition = engineDefToPresentation(restlessLooterRed);
    const metadata = { ...definition, type: definition.cardType };
    const entity = entityFor("restless-looter", metadata, "p1", true, {
      frame: "tactical",
      tacticalBadgeMode: "permanent",
      currentNumeric: { life: 2 },
    });

    expect(definition.life).toBe(3);
    expect(entity.stats).toContainEqual({ label: "Life", value: "2" });
    expect(entity.decorations).toContainEqual({
      id: "fab-frame-life",
      slot: "bottom-end",
      ariaLabel: "Life: 2",
      content: { kind: "text", text: "2" },
    });
    expect(entity.decorations?.map((decoration) => decoration.id)).not.toContain(
      "fab-frame-defense",
    );
  });

  it("marks an owner-visible face-down card without removing tactical corner information", () => {
    const entity = entityFor(
      "arsenal-1",
      { name: "Searing Shot", type: "action", pitchValue: 1, cost: 0, power: 4, defense: 3 },
      "p1",
      true,
      { frame: "tactical", ownerVisibleFaceDown: true },
    );

    expect(entity.face).toBe("public");
    expect(entity.title).toBe("Searing Shot");
    expect(entity.accessibilityDescription).toBe("Face down, visible only to you");
    expect(entity.dataAttributes).toMatchObject({
      "data-fab-card-frame": "tactical",
      "data-fab-owner-face-down": "true",
      title: "Face down — visible only to you",
    });
    expect(entity.decorations?.map((decoration) => decoration.id)).toEqual([
      "fab-pitch-1",
      "fab-frame-cost",
      "fab-frame-power",
      "fab-frame-defense",
    ]);
  });

  it("does not reveal pitch through a hidden card face", () => {
    const entity = entityFor(
      "card-1",
      { name: "Blue Pitch", type: "action", pitchValue: 3 },
      "p1",
      false,
    );
    expect(entity.decorations).toBeUndefined();
    expect(entity.frameStyle).toBeUndefined();
  });

  it("maps hero type to leader kind", () => {
    const entity = entityFor("hero-1", { name: "Ira", type: "hero" }, "p1", true);
    expect(entity.kind).toBe("leader");
  });

  it("attaches public tapped and counter state as board-safe visual metadata", () => {
    const entity = entityFor("permanent-1", { name: "Teklo Core", type: "item" }, "p1", true, {
      tapped: true,
      counters: [
        { label: "steam", count: 2 },
        { label: "+1{p}", count: 1, modifier: { property: "power", value: 1 } },
      ],
    });

    expect(entity.dataAttributes).toMatchObject({
      "data-fab-tapped": "true",
      "data-fab-counter-summary": "steam ×2 · +1 p ×1",
    });
    expect(entity.decorations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "fab-counter-0",
          ariaLabel: "steam",
          content: { kind: "text", text: "×2" },
        }),
        expect.objectContaining({
          id: "fab-counter-1",
          ariaLabel: "+1 p",
          content: { kind: "text", text: "+1" },
        }),
      ]),
    );
  });

  it("groups equivalent counter records into one typed stack badge", () => {
    const entity = entityFor("weapon-1", { name: "Dawnblade", type: "weapon" }, "p1", true, {
      counters: [
        { label: "+1{p}", count: 2, modifier: { property: "power", value: 1 } },
        { label: "+1{p}", count: 4, modifier: { property: "power", value: 1 } },
      ],
    });

    expect(entity.dataAttributes?.["data-fab-counter-summary"]).toBe("+1 p ×6");
    expect(entity.decorations).toContainEqual(
      expect.objectContaining({
        id: "fab-counter-0",
        ariaLabel: "+1 p",
        content: { kind: "text", text: "+1 ×6" },
      }),
    );
    expect(
      entity.decorations?.filter((decoration) => decoration.id.startsWith("fab-counter-")),
    ).toHaveLength(1);
  });

  it("keeps only counters on non-ally permanents in the tactical board frame", () => {
    const entity = entityFor(
      "permanent-1",
      { name: "Teklo Core", type: "item", pitchValue: 2, cost: 1, power: 4, defense: 3 },
      "p1",
      true,
      {
        frame: "tactical",
        tacticalBadgeMode: "permanent",
        counters: [{ label: "steam", count: 2 }],
      },
    );

    expect(entity.frameStyle).toBeUndefined();
    expect(entity.dataAttributes).toMatchObject({ "data-fab-card-frame": "tactical" });
    expect(entity.dataAttributes).not.toHaveProperty("data-fab-pitch");
    expect(entity.decorations?.map((decoration) => decoration.id)).toEqual(["fab-counter-0"]);
  });

  it("keeps combat stats and counters for allies in the tactical permanent frame", () => {
    const entity = entityFor(
      "ally-1",
      {
        name: "Ash",
        type: "token",
        typeLine: "Draconic Ally",
        pitchValue: 1,
        cost: 0,
        power: 1,
        defense: 1,
      },
      "p1",
      true,
      {
        frame: "tactical",
        tacticalBadgeMode: "permanent",
        counters: [{ label: "+1{p}", count: 1, modifier: { property: "power", value: 1 } }],
      },
    );

    expect(entity.frameStyle).toBeUndefined();
    expect(entity.dataAttributes).not.toHaveProperty("data-fab-pitch");
    expect(entity.decorations?.map((decoration) => decoration.id)).toEqual([
      "fab-frame-power",
      "fab-frame-defense",
      "fab-counter-0",
    ]);
  });

  it("shows signed numeric counters and counter-modified tactical stats", () => {
    const entity = entityFor(
      "equipment-1",
      { name: "Battleworn Equipment", type: "equipment", defense: 2 },
      "p1",
      true,
      {
        frame: "tactical",
        counters: [{ label: "-1{d}", count: 1, modifier: { property: "defense", value: -1 } }],
      },
    );

    expect(entity.decorations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "fab-frame-defense",
          ariaLabel: "Defense: 1",
          content: { kind: "text", text: "1" },
        }),
        expect.objectContaining({
          id: "fab-counter-0",
          ariaLabel: "-1 d",
          content: { kind: "text", text: "-1" },
        }),
      ]),
    );
    expect(entity.stats).toContainEqual({ label: "Defense", value: "1" });
  });

  it("uses the engine-evaluated defense for a conditional tactical card", () => {
    const entity = entityFor(
      "no-hero-stands-alone",
      { name: "No Hero Stands Alone", type: "action", defense: 0 },
      "p1",
      true,
      { frame: "tactical", currentNumeric: { defense: 3 } },
    );

    expect(entity.decorations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "fab-frame-defense", ariaLabel: "Defense: 3" }),
      ]),
    );
    expect(entity.stats).toContainEqual({ label: "Defense", value: "3" });
  });
});

describe("entityForFabViewer", () => {
  const metadata = { name: "Private Test Card", type: "action", pitchValue: 2 };

  it("never unmasks an authoritative redacted card for the bottom viewing seat", () => {
    const entity = entityForFabViewer(
      presentationCard({ cardId: "face-down", face: "down" }),
      metadata,
      "p1",
    );
    expect(entity.face).toBe("hidden");
    expect(entity.title).toBe("Hidden card");
    expect(entity.backImageUrl).toContain("fab-card-back-square.webp");
    expect(entity.dataAttributes?.["data-fab-owner-face-down"]).toBeUndefined();
    expect(entity.decorations).toBeUndefined();
  });

  it("shows a face-down non-deck card to its owner with an explicit private marker", () => {
    const entity = entityForFabViewer(presentationCard({ face: "down" }), metadata, "p1", {
      frame: "tactical",
    });

    expect(entity.face).toBe("public");
    expect(entity.title).toBe("Private Test Card");
    expect(entity.accessibilityDescription).toBe("Face down, visible only to you");
    expect(entity.dataAttributes?.["data-fab-owner-face-down"]).toBe("true");
  });

  it("uses the square back and withholds metadata from an opponent", () => {
    const entity = entityForFabViewer(presentationCard({ face: "down" }), metadata, "p2");

    expect(entity.face).toBe("hidden");
    expect(entity.title).toBe("Hidden card");
    expect(entity.backImageUrl).toContain("fab-card-back-square.webp");
    expect(entity.hiddenBackLayout).toBe("square");
    expect(entity.imageAspectRatio).toBe(1);
    expect(entity.decorations).toBeUndefined();
  });

  it("keeps an owner's deck hidden and square", () => {
    const entity = entityForFabViewer(
      presentationCard({ zone: "deck", face: "down" }),
      metadata,
      "p1",
    );

    expect(entity.face).toBe("hidden");
    expect(entity.backImageUrl).toContain("fab-card-back-square.webp");
    expect(entity.hiddenBackLayout).toBe("square");
  });

  it("uses the same square back for a hidden hand card", () => {
    const entity = entityForFabViewer(
      presentationCard({ zone: "hand", face: "down" }),
      metadata,
      "p2",
    );

    expect(entity.face).toBe("hidden");
    expect(entity.backImageUrl).toContain("fab-card-back-square.webp");
    expect(entity.hiddenBackLayout).toBe("square");
    expect(entity.imageAspectRatio).toBe(1);
  });
});

describe("projectFabTabletop", () => {
  const emptyZones = {
    deck: [] as string[],
    hand: [] as string[],
    graveyard: [] as string[],
    banished: [] as string[],
    arsenal: [] as string[],
    pitch: [] as string[],
    combatChain: [] as string[],
    stack: [] as string[],
    arena: [] as string[],
    head: [] as string[],
    chest: [] as string[],
    arms: [] as string[],
    legs: [] as string[],
    weapon1: [] as string[],
    weapon2: [] as string[],
    heroZone: [] as string[],
    soul: [] as string[],
    inventory: [] as string[],
    under: [] as string[],
  };

  const state: FabViewerState = {
    playerIds: ["p1", "p2"],
    firstTurnPlayerId: "p1",
    optionalTriggerAutomation: [],
    automation: null,
    priorityManualOnly: null,
    priorityWindow: null,
    priorityHoldArmed: null,
    players: {
      p1: {
        playerId: "p1",
        heroCardId: "hero-1",
        life: 20,
        actionPoints: 1,
        resourcePoints: 0,
        chiPoints: 0,
        intellect: 4,
        marked: false,
        heroSignals: [],
        zones: {
          ...emptyZones,
          deck: [FAB_FACE_DOWN, FAB_FACE_DOWN],
          hand: ["card-1", "card-2"],
        },
      },
      p2: {
        playerId: "p2",
        heroCardId: "hero-2",
        life: 19,
        actionPoints: 0,
        resourcePoints: 0,
        chiPoints: 0,
        intellect: 4,
        marked: false,
        heroSignals: [],
        zones: {
          ...emptyZones,
          deck: [FAB_FACE_DOWN],
          hand: [FAB_FACE_DOWN],
          graveyard: ["card-3"],
        },
      },
    },
    activePlayerId: "p1",
    priorityPlayerId: "p1",
    turnNumber: 3,
    phase: "action",
    combat: null,
    rulesStack: [],
    effects: [],
    subcardsByHostId: {},
    activeFaceIdsByInstanceId: {},
    faceDownInstanceIds: [],
    stateID: 10,
    gameEnded: false,
    winnerId: null,
    endReason: null,
  };

  it("produces zones for both players including arena equipment and combat chain", () => {
    const { zones } = projectFabTabletop(state, "p1");
    const p1Zones = zones.filter((z) => z.ownerId === "p1");
    const p2Zones = zones.filter((z) => z.ownerId === "p2");
    // deck, hand, gy, banished, arsenal, pitch, combatChain, stack, head, chest, arms, legs, weapon1, weapon2, heroZone
    expect(p1Zones).toHaveLength(15);
    expect(p2Zones).toHaveLength(15);
    expect(p1Zones.some((z) => z.hint === "combatChain")).toBe(true);
    expect(p1Zones.some((z) => z.hint === "heroZone")).toBe(true);
  });

  it("hides opponent hand face-down", () => {
    const { entities } = projectFabTabletop(state, "p1");
    const p2HandEntities = entities.filter((e) => e.ownerId === "p2" && e.face === "hidden");
    expect(p2HandEntities.length).toBeGreaterThanOrEqual(1);
  });

  it("reveals own hand", () => {
    const { entities } = projectFabTabletop(state, "p1");
    const p1HandEntities = entities.filter((e) => e.ownerId === "p1" && e.face === "public");
    expect(p1HandEntities).toHaveLength(2);
  });

  it("deck is always hidden", () => {
    const { entities } = projectFabTabletop(state, "p1");
    const deckEntities = entities.filter((e) => e.ownerId === "p1" && e.face === "hidden");
    expect(deckEntities.length).toBeGreaterThanOrEqual(2);
  });

  it("preserves authoritative face-down state for an owner's visible arsenal", () => {
    const viewer: FabViewerState = {
      ...state,
      players: {
        ...state.players,
        p1: {
          ...state.players.p1!,
          zones: {
            ...state.players.p1!.zones,
            arsenal: ["face-up-arsenal", "face-down-arsenal"],
          },
        },
        p2: {
          ...state.players.p2!,
          zones: { ...state.players.p2!.zones, arsenal: [FAB_FACE_DOWN] },
        },
      },
      faceDownInstanceIds: ["face-down-arsenal"],
    };

    const cards = viewerZonesToPresentationCards(viewer, "p1");
    expect(cards["face-up-arsenal"]?.face).toBe("up");
    expect(cards["face-down-arsenal"]?.face).toBe("down");
    expect(cards["p2:arsenal:hidden:0"]?.face).toBe("down");
  });

  it("projects a public hosted Aura under its exact Ally", () => {
    const viewer: FabViewerState = {
      ...state,
      players: {
        ...state.players,
        p1: {
          ...state.players.p1!,
          zones: { ...state.players.p1!.zones, arena: ["ally"] },
        },
      },
      subcardsByHostId: { ally: ["mark"] },
    };

    const cards = viewerZonesToPresentationCards(viewer, "p1", {
      resolveCardId: (instanceId) => (instanceId === "mark" ? "mark-of-ushering" : instanceId),
    });

    expect(cards.mark).toEqual({
      id: "mark",
      cardId: "mark-of-ushering",
      ownerId: "p1",
      zone: "hosted",
      face: "up",
      hostInstanceId: "ally",
    });
  });

  it("retains public tapped state and counter labels on the matching permanent", () => {
    const viewer = {
      ...state,
      players: {
        ...state.players,
        p1: {
          ...state.players.p1!,
          zones: { ...state.players.p1!.zones, heroZone: ["hero-1"] },
        },
      },
      tappedInstanceIds: ["hero-1"],
      countersByInstanceId: {
        "hero-1": [
          { kind: "named" as const, name: "steam", count: 2 },
          { kind: "numeric" as const, property: "power" as const, value: 1, count: 1 },
        ],
      },
    } satisfies FabViewerState;
    const presentation = matchStateToPresentation(viewer, "p1", {
      cardInstances: { "hero-1": "hero-card" },
      cardDefinitions: {},
    });

    expect(presentation.cards["hero-1"]).toMatchObject({
      tapped: true,
      counters: [
        { label: "steam", count: 2 },
        { label: "+1{p}", count: 1 },
      ],
    });
  });

  it("retains engine-evaluated numeric values without requiring a counter", () => {
    const viewer = {
      ...state,
      currentNumericByInstanceId: { "card-1": { defense: 3 } },
    } satisfies FabViewerState;
    const presentation = matchStateToPresentation(viewer, "p1", {
      cardInstances: { "card-1": "conditional-defense-card" },
      cardDefinitions: {},
    });

    expect(presentation.cards["card-1"]?.currentNumeric).toEqual({ defense: 3 });
  });

  it("copies a seated source's live power onto its synthetic attack-layer", () => {
    const viewer = {
      ...state,
      players: {
        ...state.players,
        p1: {
          ...state.players.p1!,
          zones: { ...state.players.p1!.zones, weapon1: ["weapon-1"] },
        },
      },
      rulesStack: [
        {
          layerId: "durendal-attack",
          kind: "activated" as const,
          controllerId: "p1",
          sourceInstanceId: "weapon-1",
          sourceCanonicalId: "durendal",
          sourceName: "Durendal",
          label: "Durendal — attack",
          playTiming: null,
          melded: false,
        },
      ],
      currentNumericByInstanceId: { "weapon-1": { power: 5 } },
      countersByInstanceId: {
        "weapon-1": [{ kind: "numeric" as const, property: "power" as const, value: 1, count: 2 }],
      },
    } satisfies FabViewerState;
    const presentation = matchStateToPresentation(viewer, "p1", {
      cardInstances: { "weapon-1": "durendal" },
      cardDefinitions: {},
    });
    const stackCard = Object.values(presentation.cards).find(
      (card) => card.id.startsWith("rules-stack:") && card.zone === "stack",
    );

    expect(stackCard).toMatchObject({
      sourceInstanceId: "weapon-1",
      currentNumeric: { power: 5 },
      counters: [{ label: "+1{p}", count: 2, modifier: { property: "power", value: 1 } }],
    });
  });
});

describe("matchStateToPresentation", () => {
  it("uses the engine-selected face for a double-faced card", async () => {
    const scenario = getFabEngineScenario("double-faced-card-preview");
    expect(scenario).toBeDefined();

    const match = scenario!.boot();

    const presentation = presentRuntime(match.runtime, "player-1", testFabArt);
    const front = Object.values(presentation.cards).find(
      (card) => card.ownerId === "player-1" && card.zone === "hand",
    );
    const back = Object.values(presentation.cards).find(
      (card) => card.ownerId === "player-1" && card.zone === "permanent",
    );

    expect(front).toBeDefined();
    expect(back).toBeDefined();
    expect(presentation.cardDefinitions[front!.cardId]).toMatchObject({
      name: "Invoke Yendurai",
    });
    expect(presentation.cardDefinitions[front!.cardId]?.imageUrl).toMatch(
      /\/public\/fab\/assets\/board\/[a-f0-9]{64}\.webp$/,
    );
    expect(presentation.cardDefinitions[back!.cardId]).toMatchObject({
      name: "Yendurai",
      power: 3,
    });
    expect(presentation.cardDefinitions[back!.cardId]?.imageUrl).toMatch(
      /\/public\/fab\/assets\/board\/[a-f0-9]{64}\.webp$/,
    );
  });

  it("keeps a canonical hero definition available when the engine stores it by alias", () => {
    const scenario = getHeroSpecialScenario("hero-special-dromai");
    expect(scenario).toBeDefined();
    const presentation = presentRuntime(scenario!.boot().runtime, "player-1");
    const hero = Object.values(presentation.cards).find(
      (card) => card.ownerId === "player-1" && card.zone === "hero",
    );

    expect(hero).toBeDefined();
    expect(presentation.cardDefinitions[hero!.cardId]?.name).toBe("Dromai, Ash Artist");
  });
});

describe("matchStateToPresentation", () => {
  it("projects triggered rules layers as labeled public stack entries", () => {
    const scenario = getFabEngineScenario("trigger-decision-lab");
    expect(scenario).toBeDefined();
    const match = scenario!.boot();
    const runtime = match.runtime;
    const decision = runtime.getState().decision;
    if (!decision || decision.kind !== "ordering") throw new Error("Missing trigger ordering.");
    match.engine.answerDecision(decision.actorId, {
      kind: "ordering",
      orderedIds: decision.entries.map((entry) => entry.id),
    });
    expect(runtime.viewer({ role: "player", actorId: "player-1" }).rulesStack.at(-1)).toMatchObject(
      { kind: "triggered" },
    );

    const presentation = presentRuntime(runtime, "player-1");
    expect(presentation.combat?.chainLinkNumber).toBe(1);
    const triggeredEntry = Object.values(presentation.cards).find(
      (card) => card.id.startsWith("rules-stack:") && card.zone === "stack",
    );
    expect(triggeredEntry).toBeDefined();
    expect(presentation.cardDefinitions[triggeredEntry!.cardId]?.name).toBe(
      "Snatch · Trigger Lab — hit trigger",
    );
    expect(presentation.cardDefinitions[triggeredEntry!.cardId]?.presentationCanonicalId).toBe(
      "fixture-trigger-decision-snatch",
    );
    expect(presentation.stackInstanceIds).toEqual([triggeredEntry!.id]);
  });

  it("keeps a triggered layer's source catalog identity after the source leaves play", () => {
    const sourceCanonicalId = "jdkmHT8QfQmMbPLBHPrHJ";
    const emptyZones = {
      deck: [] as string[],
      hand: [] as string[],
      graveyard: [] as string[],
      banished: [] as string[],
      arsenal: [] as string[],
      pitch: [] as string[],
      combatChain: [] as string[],
      stack: [] as string[],
      arena: [] as string[],
      head: [] as string[],
      chest: [] as string[],
      arms: [] as string[],
      legs: [] as string[],
      weapon1: [] as string[],
      weapon2: [] as string[],
      heroZone: [] as string[],
      soul: [] as string[],
      inventory: [] as string[],
      under: [] as string[],
    };
    const viewer: FabViewerState = {
      playerIds: ["player-1", "player-2"],
      optionalTriggerAutomation: [],
      automation: null,
      priorityManualOnly: null,
      priorityWindow: null,
      priorityHoldArmed: null,
      players: {
        "player-1": {
          playerId: "player-1",
          heroCardId: "p1-hero",
          life: 20,
          actionPoints: 1,
          resourcePoints: 0,
          chiPoints: 0,
          intellect: 4,
          marked: false,
          heroSignals: [],
          zones: emptyZones,
        },
        "player-2": {
          playerId: "player-2",
          heroCardId: "p2-hero",
          life: 20,
          actionPoints: 0,
          resourcePoints: 0,
          chiPoints: 0,
          intellect: 4,
          marked: false,
          heroSignals: [],
          zones: emptyZones,
        },
      },
      firstTurnPlayerId: "player-1",
      activePlayerId: "player-1",
      priorityPlayerId: "player-1",
      turnNumber: 1,
      phase: "action",
      combat: null,
      rulesStack: [
        {
          layerId: "layer-1",
          kind: "triggered",
          controllerId: "player-1",
          sourceInstanceId: "departed-flurry",
          sourceCanonicalId,
          sourceName: "Flurry",
          label: "Flurry — activate trigger",
          playTiming: null,
          melded: false,
        },
      ],
      effects: [],
      subcardsByHostId: {},
      activeFaceIdsByInstanceId: {},
      faceDownInstanceIds: [],
      stateID: 1,
      gameEnded: false,
      winnerId: null,
      endReason: null,
    };
    const presentation = matchStateToPresentation(viewer, "player-1", {
      cardInstances: {},
      cardDefinitions: {},
    });
    const stackCard = Object.values(presentation.cards).find((card) => card.zone === "stack");
    expect(stackCard).toBeDefined();
    expect(presentation.cardDefinitions[stackCard!.cardId]).toMatchObject({
      name: "Flurry — activate trigger",
      presentationCanonicalId: sourceCanonicalId,
    });
    expect(projectCombatChainView(presentation).stack[0]?.entity.dataAttributes).toMatchObject({
      "data-fab-canonical-id": sourceCanonicalId,
    });
  });

  it("does not present frozen rules layers as a live stack after game end", () => {
    const scenario = getFabEngineScenario("trigger-decision-lab");
    expect(scenario).toBeDefined();
    const match = scenario!.boot();
    const runtime = match.runtime;
    const decision = runtime.getState().decision;
    if (!decision || decision.kind !== "ordering") throw new Error("Missing trigger ordering.");
    match.engine.answerDecision(decision.actorId, {
      kind: "ordering",
      orderedIds: decision.entries.map((entry) => entry.id),
    });

    const actor = { role: "player" as const, actorId: "player-1" };
    const frozenViewer = {
      ...runtime.viewer(actor),
      gameEnded: true,
      winnerId: "player-1",
      endReason: "concede" as const,
    };
    expect(frozenViewer.rulesStack.length).toBeGreaterThan(0);

    const presentation = matchStateToPresentation(
      frozenViewer,
      "player-1",
      runtime.viewerResources(actor),
    );

    expect(presentation.terminal).toBe(true);
    expect(presentation.result).toEqual({
      kind: "win",
      winnerId: "player-1",
      loserId: "player-2",
      reason: "by concession",
    });
    expect(presentation.combat).toBeNull();
    expect(Object.values(presentation.cards).filter((card) => card.zone === "stack")).toEqual([]);
  });

  it("presents a claimed timeout from each player's perspective", () => {
    const scenario = getFabEngineScenario("trigger-decision-lab");
    expect(scenario).toBeDefined();
    const match = scenario!.boot();
    const winnerView = {
      ...match.runtime.viewer({ role: "player" as const, actorId: "player-1" }),
      gameEnded: true,
      winnerId: "player-1",
      endReason: "timeout" as const,
    };
    const loserView = {
      ...match.runtime.viewer({ role: "player" as const, actorId: "player-2" }),
      gameEnded: true,
      winnerId: "player-1",
      endReason: "timeout" as const,
    };

    expect(
      matchStateToPresentation(
        winnerView,
        "player-1",
        match.runtime.viewerResources({ role: "player", actorId: "player-1" }),
      ).result,
    ).toMatchObject({ reason: "Opponent timed out" });
    expect(
      matchStateToPresentation(
        loserView,
        "player-2",
        match.runtime.viewerResources({ role: "player", actorId: "player-2" }),
      ).result,
    ).toMatchObject({ reason: "You timed out" });
  });

  it("projects an engine practice match into tabletop presentation state", () => {
    const match = createFabPracticeMatch(fleshAndBloodDeckCardLibrary, {
      seed: "proj-1",
      player1DeckId: "cc-guilherme-coutinho-rhinar",
    });
    const presentation = presentRuntime(match.runtime, "player-1", testFabArt);

    expect(presentation.players).toEqual(["player-1", "player-2"]);
    expect(presentation.activePlayerId).toBe("player-1");
    expect(presentation.phase).toBe("action");
    expect(presentation.terminal).toBe(false);
    expect(presentation.combat).toBeNull();

    const p1Hand = Object.values(presentation.cards).filter(
      (c) => c.ownerId === "player-1" && c.zone === "hand" && c.face === "up",
    );
    const p2Hand = Object.values(presentation.cards).filter(
      (c) => c.ownerId === "player-2" && c.zone === "hand",
    );
    expect(p1Hand.length).toBe(4);
    expect(p2Hand.every((c) => c.face === "down")).toBe(true);
    expect(
      Object.values(presentation.cardDefinitions).some((card) => /Rhinar/i.test(card.name ?? "")),
    ).toBe(true);
    expect(presentation.life["player-1"]).toBe(40);
    expect(presentation.resourcePoints["player-1"]).toBeTypeOf("number");
    expect(presentation.chiPoints?.["player-1"]).toBeTypeOf("number");
    expect(presentation.actionPoints["player-1"]).toBeTypeOf("number");
    expect(presentation.intellect["player-1"]).toBeTypeOf("number");
  });

  it("uses active-link reaction membership without relabeling a prior-link block", () => {
    const priorAttackId = "prior-attack";
    const priorReactionBlockId = "prior-reaction-block";
    const attackId = "active-attack";
    const reactionId = "attack-reaction";
    const blockId = "defender";
    const defendingHeroId = "p2-hero";
    const emptyZones = {
      deck: [] as string[],
      hand: [] as string[],
      graveyard: [] as string[],
      banished: [] as string[],
      arsenal: [] as string[],
      pitch: [] as string[],
      combatChain: [] as string[],
      stack: [] as string[],
      arena: [] as string[],
      head: [] as string[],
      chest: [] as string[],
      arms: [] as string[],
      legs: [] as string[],
      weapon1: [] as string[],
      weapon2: [] as string[],
      heroZone: [] as string[],
      soul: [] as string[],
      inventory: [] as string[],
      under: [] as string[],
    };
    const resources: FabViewerResources = {
      cardInstances: {
        [priorAttackId]: ids.snatch,
        [priorReactionBlockId]: ids.pummel,
        [attackId]: ids.alphaRampage,
        [reactionId]: ids.pummel,
        [blockId]: ids.enlightenedStrike,
      },
      cardDefinitions: {
        [ids.pummel]: registerFabCardDefinition({
          canonicalId: ids.pummel,
          name: "Pummel",
          types: ["Generic", "Attack Reaction"],
          pitch: 1,
          cost: 0,
          defense: 3,
        }),
        [ids.snatch]: registerFabCardDefinition({
          canonicalId: ids.snatch,
          name: "Snatch",
          types: ["Generic", "Attack", "Action"],
          pitch: 1,
          cost: 0,
          power: 4,
          defense: 2,
        }),
        [ids.alphaRampage]: registerFabCardDefinition({
          canonicalId: ids.alphaRampage,
          name: "Alpha Rampage",
          types: ["Brute", "Attack", "Action"],
        }),
        [ids.enlightenedStrike]: registerFabCardDefinition({
          canonicalId: ids.enlightenedStrike,
          name: "Enlightened Strike",
          types: ["Generic", "Attack", "Action"],
        }),
      },
    };
    const viewer: FabViewerState = {
      playerIds: ["player-1", "player-2"],
      firstTurnPlayerId: "player-1",
      optionalTriggerAutomation: [],
      automation: null,
      priorityManualOnly: null,
      priorityWindow: null,
      priorityHoldArmed: null,
      players: {
        "player-1": {
          playerId: "player-1",
          heroCardId: "p1-hero",
          life: 20,
          actionPoints: 1,
          resourcePoints: 0,
          chiPoints: 0,
          intellect: 4,
          marked: false,
          heroSignals: [],
          zones: {
            ...emptyZones,
            combatChain: [priorAttackId, attackId, reactionId],
          },
        },
        "player-2": {
          playerId: "player-2",
          heroCardId: defendingHeroId,
          life: 20,
          actionPoints: 0,
          resourcePoints: 0,
          chiPoints: 0,
          intellect: 4,
          marked: false,
          heroSignals: [],
          zones: {
            ...emptyZones,
            combatChain: [priorReactionBlockId, blockId],
          },
        },
      },
      activePlayerId: "player-1",
      priorityPlayerId: "player-1",
      turnNumber: 1,
      phase: "action",
      combat: {
        open: true,
        step: "reaction",
        defenseDeclarationPending: false,
        activeLink: {
          activeAttack: { kind: "card", sourceObjectId: fabObjectInstanceId(attackId) },
          attackingPlayerId: fabPlayerId("player-1"),
          defendingPlayerId: fabPlayerId("player-2"),
          attackTargetRef: {
            kind: "hero",
            playerId: fabPlayerId("player-2"),
          },
          defendingInstanceIdsByTarget: { [defendingHeroId]: [fabObjectInstanceId(blockId)] },
          defendingOrigins: { [blockId]: { kind: "hand" } },
          reactionInstanceIds: [fabObjectInstanceId(reactionId)],
          damage: { status: "pending", outcomes: [] },
          wagers: [],
          attackPower: 6,
          keywords: [],
          melded: false,
        },
      } as FabViewerState["combat"],
      rulesStack: [],
      effects: [],
      subcardsByHostId: {},
      activeFaceIdsByInstanceId: {},
      faceDownInstanceIds: [],
      stateID: 1,
      gameEnded: false,
      winnerId: null,
      endReason: null,
    };

    const presentation = matchStateToPresentation(viewer, "player-1", resources);
    expect(presentation.combat?.open).toBe(true);
    expect(presentation.combat?.activeLink?.reactionInstanceIds).toContain(reactionId);
    expect(presentation.combat?.activeLink?.reactionInstanceIds).not.toContain(
      priorReactionBlockId,
    );
    expect(presentation.combat?.activeLink?.reactionInstanceIds).not.toContain(priorAttackId);
    expect(presentation.cards[priorAttackId]?.chainRole).toBeUndefined();
    expect(presentation.cards[priorReactionBlockId]?.chainRole).toBeUndefined();
    expect(presentation.cards[reactionId]?.chainRole).toMatch(/reaction/);
    expect(presentation.cards[attackId]?.chainRole).toBe("attack");
    expect(presentation.cards[blockId]?.chainRole).toBe("defend");
  });
});

describe("per-instance printing art", () => {
  const attackId = "player-1-wtr-snatch-0";
  const emptyZones = {
    deck: [] as string[],
    hand: [] as string[],
    graveyard: [] as string[],
    banished: [] as string[],
    arsenal: [] as string[],
    pitch: [] as string[],
    combatChain: [] as string[],
    stack: [] as string[],
    arena: [] as string[],
    head: [] as string[],
    chest: [] as string[],
    arms: [] as string[],
    legs: [] as string[],
    weapon1: [] as string[],
    weapon2: [] as string[],
    heroZone: [] as string[],
  };
  const makeViewer = (faceDown = false): FabViewerState => ({
    playerIds: ["player-1", "player-2"],
    optionalTriggerAutomation: [],
    automation: null,
    priorityManualOnly: null,
    priorityWindow: null,
    priorityHoldArmed: null,
    players: {
      "player-1": {
        playerId: "player-1",
        heroCardId: "p1-hero",
        life: 20,
        actionPoints: 1,
        resourcePoints: 0,
        chiPoints: 0,
        intellect: 4,
        marked: false,
        heroSignals: [],
        zones: { ...emptyZones, hand: [attackId] },
      },
      "player-2": {
        playerId: "player-2",
        heroCardId: "p2-hero",
        life: 20,
        actionPoints: 0,
        resourcePoints: 0,
        chiPoints: 0,
        intellect: 4,
        marked: false,
        heroSignals: [],
        zones: emptyZones,
      },
    },
    activePlayerId: "player-1",
    priorityPlayerId: "player-1",
    turnNumber: 1,
    phase: "action",
    combat: null,
    rulesStack: [],
    effects: [],
    subcardsByHostId: {},
    activeFaceIdsByInstanceId: {},
    faceDownInstanceIds: faceDown ? [attackId] : [],
    stateID: 1,
    gameEnded: false,
    winnerId: null,
    endReason: null,
  });
  const resources = {
    cardInstances: { [attackId]: "canon-snatch" },
    cardDefinitions: {},
  } as unknown as Parameters<typeof matchStateToPresentation>[2];

  it("matchStateToPresentation stamps printingId on face-up instances from matchArt", () => {
    const presentation = matchStateToPresentation(makeViewer(), "player-1", resources, {
      [attackId]: "printing-x",
    });
    expect(presentation.cards[attackId]?.printingId).toBe("printing-x");
    expect(
      matchStateToPresentation(makeViewer(), "player-1", resources).cards[attackId]?.printingId,
    ).toBeUndefined();
  });

  it("never stamps printingId on hidden instances", () => {
    const presentation = matchStateToPresentation(makeViewer(true), "player-1", resources, {
      [attackId]: "printing-x",
    });
    expect(presentation.cards[attackId]?.face).toBe("down");
    expect(presentation.cards[attackId]?.printingId).toBeUndefined();
  });

  it("entityFor resolves a printing to its canonical CDN crop and stamps data-fab-printing-id", async () => {
    const entity = entityFor(
      attackId,
      {
        canonicalId: "tCkMg9kPCkhTDTbJkdHjB",
        printingId: "pzMPggLDLGfBLcqPzbH6R",
        name: "Buckwild",
        type: "Action",
      },
      "player-1",
      true,
      { art: testFabArt },
    );
    expect(entity.imageUrl).toMatch(/\/public\/fab\/assets\/board\/[a-f0-9]{64}\.webp$/);
    expect(entity.imageAspectRatio).toBe(1);
    expect(entity.dataAttributes?.["data-fab-printing-id"]).toBe("pzMPggLDLGfBLcqPzbH6R");
    expect(entity.dataAttributes?.["data-fab-canonical-id"]).toBe("tCkMg9kPCkhTDTbJkdHjB");

    const hidden = entityFor(
      attackId,
      {
        canonicalId: "tCkMg9kPCkhTDTbJkdHjB",
        printingId: "pzMPggLDLGfBLcqPzbH6R",
        name: "Buckwild",
        type: "Action",
      },
      "player-2",
      false,
      { art: testFabArt },
    );
    expect(hidden.face).toBe("hidden");
    expect(hidden.dataAttributes?.["data-fab-printing-id"]).toBeUndefined();
  });

  it("does not fall back to an upstream image when the card is absent from our assets manifest", () => {
    const entity = entityFor(
      attackId,
      {
        canonicalId: "unknown-canonical-id",
        name: "Unknown card",
        type: "Action",
        imageUrl: "https://storage.googleapis.com/fabmaster/cardfaces/unknown.png",
      },
      "player-1",
      true,
    );

    expect(entity.imageUrl).toBeUndefined();
    expect(entity.dataAttributes?.["data-art-variant"]).toBeUndefined();
  });
});

describe("coerceFabPresentationState", () => {
  const emptyZones = {
    deck: [] as string[],
    hand: [] as string[],
    graveyard: [] as string[],
    banished: [] as string[],
    arsenal: [] as string[],
    pitch: [] as string[],
    combatChain: [] as string[],
    stack: [] as string[],
    arena: [] as string[],
    head: [] as string[],
    chest: [] as string[],
    arms: [] as string[],
    legs: [] as string[],
    weapon1: [] as string[],
    weapon2: [] as string[],
    heroZone: [] as string[],
    soul: [] as string[],
    inventory: [] as string[],
    under: [] as string[],
  };
  const viewer: FabViewerState = {
    playerIds: ["p1", "p2"],
    firstTurnPlayerId: "p1",
    optionalTriggerAutomation: [],
    automation: null,
    priorityHoldArmed: null,
    priorityManualOnly: null,
    priorityWindow: null,
    players: {
      p1: {
        playerId: "p1",
        heroCardId: "hero-1",
        life: 20,
        actionPoints: 1,
        resourcePoints: 0,
        chiPoints: 0,
        intellect: 4,
        marked: false,
        heroSignals: [],
        zones: { ...emptyZones, hand: ["card-1"] },
      },
      p2: {
        playerId: "p2",
        heroCardId: "hero-2",
        life: 20,
        actionPoints: 0,
        resourcePoints: 0,
        chiPoints: 0,
        intellect: 4,
        marked: false,
        heroSignals: [],
        zones: { ...emptyZones, graveyard: ["card-3"] },
      },
    },
    activePlayerId: "p1",
    priorityPlayerId: "p1",
    turnNumber: 1,
    phase: "action",
    combat: null,
    rulesStack: [],
    effects: [],
    subcardsByHostId: {},
    activeFaceIdsByInstanceId: {},
    faceDownInstanceIds: [],
    stateID: 1,
    gameEnded: false,
    winnerId: null,
    endReason: null,
  };
  const resources = { cardInstances: { "card-1": "def-1" }, cardDefinitions: {} };

  it("passes presentation-shaped state through untouched", () => {
    const presentation = matchStateToPresentation(viewer, "p1", resources);
    expect(coerceFabPresentationState(presentation, "p1")).toBe(presentation);
  });

  it("converts engine viewer state plus resources into presentation state", () => {
    expect(coerceFabPresentationState(viewer, "p1", resources)).toEqual(
      matchStateToPresentation(viewer, "p1", resources),
    );
  });

  it("refuses engine state without a viewer id or resources", () => {
    expect(coerceFabPresentationState(viewer, null, resources)).toBeNull();
    expect(coerceFabPresentationState(viewer, "p1", undefined)).toBeNull();
    expect(coerceFabPresentationState({ nonsense: true }, "p1")).toBeNull();
  });

  it("coerces shape-valid but malformed payloads to null instead of throwing", () => {
    const brokenViewer = {
      ...viewer,
      players: {
        ...viewer.players,
        p1: {
          ...viewer.players.p1,
          zones: { ...viewer.players.p1.zones, hand: "not-an-array" },
        },
      },
    } as unknown as FabViewerState;
    // Prove the malformation really breaks projection before relying on the catch.
    expect(() => matchStateToPresentation(brokenViewer, "p1", resources)).toThrow();
    expect(coerceFabPresentationState(brokenViewer, "p1", resources)).toBeNull();
  });

  it("forwards matchArt into the projection", () => {
    const matchArt = { "card-1": "printing-x" };
    const coerced = coerceFabPresentationState(viewer, "p1", resources, matchArt);
    expect(coerced).toEqual(matchStateToPresentation(viewer, "p1", resources, matchArt));
    expect(coerced?.cards["card-1"]?.printingId).toBe("printing-x");
  });
});
