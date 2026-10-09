import { expect, it } from "bun:test";
import { createCardId, createPlayerId } from "#core";
import {
  getDerivedHasChallengeRestriction,
  getDerivedHasQuestRestriction,
  type DerivedStateContext,
} from "./derived-state";
import type { MaterializedStaticEffect, StaticEffectRegistry } from "./static-effect-registry";
import { createMockCharacter } from "../testing";

const cardId = createCardId("restricted-character");
const controller = createPlayerId("controller");
const otherPlayer = createPlayerId("other-player");
const state: DerivedStateContext = {
  ctx: { zones: { private: { cardIndex: { [cardId]: { controllerID: controller } } } } },
  G: undefined,
};

const payableCharacter = createMockCharacter({
  id: "payable-restriction",
  name: "Payable restriction",
  cost: 1,
  abilities: [
    {
      type: "static",
      effect: {
        type: "restriction",
        target: "SELF",
        restriction: "cant-quest-or-challenge",
        bypass: { cost: { ink: 1 } },
      },
    },
  ],
});

for (const derive of [getDerivedHasChallengeRestriction, getDerivedHasQuestRestriction]) {
  it(`honors a one-ink bypass in ${derive.name} using only the controller's ready ink`, () => {
    const ink = createCardId("ready-ink");
    const otherInk = createCardId("other-player-ink");
    const payableState: DerivedStateContext = {
      ctx: {
        zones: {
          private: {
            cardIndex: { [cardId]: { controllerID: controller, zoneKey: `play:${controller}` } },
            zoneCards: {
              [`play:${controller}`]: [cardId],
              [`inkwell:${controller}`]: [ink],
              [`inkwell:${otherPlayer}`]: [otherInk],
            },
            cardMeta: { [ink]: { state: "ready" }, [otherInk]: { state: "ready" } },
          },
        },
      },
      G: undefined,
    };
    const read = (snapshot: DerivedStateContext) =>
      derive(undefined, 1, snapshot, cardId, () => payableCharacter);
    expect(read(payableState)).toBe(false);
    const unavailable: DerivedStateContext = {
      ...payableState,
      ctx: {
        zones: {
          private: {
            ...payableState.ctx.zones?.private,
            cardMeta: { [ink]: { state: "exerted" }, [otherInk]: { state: "ready" } },
          },
        },
      },
    };
    expect(read(unavailable)).toBe(true);
    const noInk: DerivedStateContext = {
      ...unavailable,
      ctx: {
        zones: {
          private: {
            ...unavailable.ctx.zones?.private,
            zoneCards: { [`play:${controller}`]: [cardId] },
          },
        },
      },
    };
    expect(read(noInk)).toBe(true);
  });
}

for (const [restriction, derive] of [
  ["cant-challenge", getDerivedHasChallengeRestriction],
  ["cant-quest", getDerivedHasQuestRestriction],
] as const) {
  for (const scope of ["card", "player"] as const) {
    it(`projects registry-backed ${restriction} for its ${scope} target only`, () => {
      const effect: MaterializedStaticEffect = {
        sourceId: createCardId("aura-source"),
        sourceControllerId: otherPlayer,
        abilityIndex: 0,
        kind: "restriction",
        payload: { restriction, playerTarget: "CONTROLLER" },
      };
      const registry: StaticEffectRegistry = {
        byTarget: new Map(scope === "card" ? [[cardId, [effect]]] : []),
        byPlayer: new Map(scope === "player" ? [[controller, [effect]]] : []),
        bySource: new Map(),
        global: [],
      };
      const read = () => derive(undefined, 1, state, cardId, () => undefined, registry);
      expect(read()).toBe(true);
      const otherState: DerivedStateContext = {
        ctx: { zones: { private: { cardIndex: { [cardId]: { controllerID: otherPlayer } } } } },
        G: undefined,
      };
      expect(
        derive(
          undefined,
          1,
          otherState,
          scope === "player" ? cardId : createCardId("other-character"),
          () => undefined,
          registry,
        ),
      ).toBe(false);
      registry.byTarget.clear();
      registry.byPlayer.clear();
      expect(read()).toBe(false);
    });
  }
}
