import type { EngineAdapter, EngineUpdateListener, RemoteEngineTransport } from "./adapter";

export function createRemoteEngineAdapter(transport: RemoteEngineTransport): EngineAdapter {
  return {
    getState() {
      return transport.getState();
    },
    getView(viewer) {
      return transport.getView(viewer);
    },
    getLegalCommands(viewer) {
      return transport.getLegalCommands(viewer);
    },
    applyCommand(command) {
      return transport.applyCommand(command);
    },
    subscribe(listener: EngineUpdateListener) {
      if (transport.subscribe) {
        return transport.subscribe(listener);
      }

      return () => {};
    },
  };
}
