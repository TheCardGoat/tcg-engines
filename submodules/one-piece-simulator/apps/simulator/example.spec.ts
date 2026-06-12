import { describe, expect, test } from "vite-plus/test";
import type {
  ApplyCommandResult,
  LegalCommandDescriptor,
  MatchState,
} from "../../packages/engine/src/index.ts";
import type { EngineUpdateListener, RemoteEngineTransport } from "./src/engine/adapter.ts";
import { createLocalEngineAdapter } from "./src/engine/localEngineAdapter.ts";
import { createRemoteEngineAdapter } from "./src/engine/remoteEngineAdapter.ts";

const config = {
  firstPlayer: "south" as const,
  shuffleDecks: false,
  players: {
    south: {
      leaderCardId: "OP13-001",
      mainDeck: [
        "OP13-021",
        "OP13-022",
        "OP13-013",
        "OP13-043",
        "OP13-013",
        "OP13-022",
        "OP13-021",
        "OP13-043",
        "OP13-013",
      ],
    },
    north: {
      leaderCardId: "OP13-001",
      mainDeck: [
        "OP13-021",
        "OP13-022",
        "OP13-013",
        "OP13-043",
        "OP13-013",
        "OP13-022",
        "OP13-021",
        "OP13-043",
        "OP13-013",
      ],
    },
  },
};

describe("engine adapters", () => {
  test("local adapter exposes views and commands", async () => {
    const adapter = createLocalEngineAdapter(config);
    const before = await adapter.getView("south");
    const commands = await adapter.getLegalCommands("south");

    expect(before.status).toBe("setup");
    expect(commands.some((command: LegalCommandDescriptor) => command.type === "startGame")).toBe(
      true,
    );
  });

  test("remote adapter preserves the same command contract", async () => {
    const listenerSnapshot: {
      state: MatchState | null;
      result: ApplyCommandResult | null;
    } = {
      state: null,
      result: null,
    };
    const local = createLocalEngineAdapter(config);
    const transport: RemoteEngineTransport = {
      async getState() {
        return local.getState();
      },
      async getView(viewer) {
        return local.getView(viewer);
      },
      async getLegalCommands(viewer) {
        return local.getLegalCommands(viewer);
      },
      async applyCommand(command) {
        return local.applyCommand(command);
      },
      subscribe(listener) {
        return local.subscribe(listener);
      },
    };
    const remote = createRemoteEngineAdapter(transport);

    const listener: EngineUpdateListener = (result, state) => {
      listenerSnapshot.result = result;
      listenerSnapshot.state = state;
    };
    const unsubscribe = remote.subscribe(listener);

    const result = await remote.applyCommand({
      type: "startGame",
      seat: "south",
    });
    const state = await remote.getState();

    if (!listenerSnapshot.result || !listenerSnapshot.state) {
      throw new Error("Expected adapter listener state to be populated");
    }

    expect(result.accepted).toBe(true);
    expect(state.status).toBe("active");
    expect(listenerSnapshot.result.accepted).toBe(true);
    expect(listenerSnapshot.state.status).toBe("active");

    unsubscribe();
  });
});
