import { describe, expect, it } from "vite-plus/test";
import type { Card } from "@tcg/gundam-types";
import type {
  CardReadAPI,
  CardRuntimeAPI,
  FrameworkStateSnapshot,
  FrameworkWriteAPI,
  ZoneOperationsAPI,
} from "../../../types/move-types.ts";
import type { PlayerId } from "../../../types/branded.ts";
import type { LifecycleContext } from "../../../types/index.ts";
import { GUNDAM_SETUP_SLOT_EX_BASE, mulliganOnExit } from "./mulligan.ts";

/**
 * The exact framework surface `mulliganOnExit` touches, typed directly
 * against the real API members so mock drift fails compilation here instead
 * of papering over an impossible runtime state.
 */
type MulliganFrameworkFixture = Pick<FrameworkWriteAPI, "log"> & {
  readonly state: Pick<FrameworkStateSnapshot, "playerIds" | "status">;
  readonly zones: Pick<ZoneOperationsAPI, "shuffle" | "drawCards" | "placeToken" | "getCards">;
  readonly cards: Pick<CardRuntimeAPI, "registerDefinition"> &
    Pick<CardReadAPI, "getDefinition" | "getMeta">;
};

function stubCtx(setupCards: LifecycleContext["setupCards"]): {
  ctx: LifecycleContext;
  registered: Array<{ tokenId: string; def: Card }>;
} {
  const registered: Array<{ tokenId: string; def: Card }> = [];
  const playerIds: PlayerId[] = ["player_one", "player_two"].map((id) => id as PlayerId);
  const framework: MulliganFrameworkFixture = {
    state: {
      playerIds,
      status: {
        turn: 0,
        turnPlayer: playerIds[0],
        activePlayer: playerIds[0],
        gameEnded: false,
        pendingDecision: [],
      },
    },
    zones: {
      shuffle: () => undefined,
      drawCards: () => [],
      placeToken: () => undefined,
      getCards: () => [],
    },
    cards: {
      registerDefinition: (tokenId: string, def: Card) => {
        registered.push({ tokenId, def });
      },
      getDefinition: () => undefined,
      getMeta: () => undefined,
    },
    log: () => undefined,
  };
  // Narrowing a checked partial into the full LifecycleContext: every mock
  // member above is typed against the real interface member it replaces.
  const ctx = { G: {}, setupCards, framework } as LifecycleContext;
  return { ctx, registered };
}

describe("mulliganOnExit host setup cards", () => {
  it("refuses to mint setup tokens when the host omitted setupCards", () => {
    const { ctx } = stubCtx(undefined);
    expect(() => mulliganOnExit(ctx)).toThrow(/Host must supply a setup card/);
  });

  it("registers the host-supplied definition instead of choosing a token art", () => {
    const hostBase = { cardNumber: "HOST-BASE", name: "Host Base" } as Card;
    const hostResource = { cardNumber: "HOST-RESOURCE", name: "Host Resource" } as Card;
    const { ctx, registered } = stubCtx({
      player_one: { [GUNDAM_SETUP_SLOT_EX_BASE]: hostBase, "ex-resource": hostResource },
      player_two: { [GUNDAM_SETUP_SLOT_EX_BASE]: hostBase, "ex-resource": hostResource },
    });

    mulliganOnExit(ctx);

    expect(registered.map((entry) => entry.def.cardNumber)).toEqual([
      "HOST-BASE",
      "HOST-BASE",
      "HOST-RESOURCE",
    ]);
  });
});
