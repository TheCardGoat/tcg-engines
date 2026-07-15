import { describe, expect, it } from "vite-plus/test";
import { decodeTestSimulatorEnvelope } from "@tcg/engine-core/test-simulator";

import { GundamTestEngine, PLAYER_ONE } from "./test-engine.ts";

describe("GundamTestEngine.openInSimulator", () => {
  it("uses sensible defaults for a no-override simulator URL", () => {
    const engine = GundamTestEngine.createEmpty();
    const result = engine.openInSimulator({
      open: false,
      baseUrl: "http://localhost:5173",
    });

    const encoded = new URL(result.url).searchParams.get("state");
    expect(encoded).not.toBeNull();
    const envelope = decodeTestSimulatorEnvelope(encoded!);

    expect(result.transport).toBe("query");
    expect(envelope.gameSlug).toBe("gundam");
    expect(envelope.viewer).toBe(PLAYER_ONE);
    expect(envelope.payload).toHaveProperty("snapshot");
  });
});
