import { afterEach, describe, expect, it } from "bun:test";
import { publicEnv } from "../../testing/public-env";

const { buildLorcanaAssetUrl, buildSimulatorAssetUrl, getPublicUrlConfig } =
  await import("./public-url-config.js");

afterEach(() => {
  for (const key of Object.keys(publicEnv)) {
    delete publicEnv[key];
  }
});

describe("public-url-config", () => {
  it("uses normalized defaults when env vars are absent", () => {
    expect(getPublicUrlConfig()).toEqual({
      apiOrigin: "http://localhost:3000",
      gameServerOrigin: "http://localhost:3001",
      trackerOrigin: "https://new.lorcanito.com",
      simulatorAssetBaseUrl: "https://new-cdn.lorcanito.com/public/lorcana/simulator",
      lorcanaAssetBaseUrl: "https://new-cdn.lorcanito.com/public/lorcana",
    });
  });

  it("normalizes configured origins", () => {
    publicEnv.PUBLIC_API_URL = "https://api.example.com/v1/";
    publicEnv.PUBLIC_GAME_SERVER_URL = "https://server.example.com/v1/";
    publicEnv.PUBLIC_SIMULATOR_ASSET_BASE_URL = "https://cdn.example.com/simulator/";
    publicEnv.PUBLIC_LORCANA_ASSET_BASE_URL = "https://cdn.example.com/lorcana/";

    expect(getPublicUrlConfig()).toEqual({
      apiOrigin: "https://api.example.com",
      gameServerOrigin: "https://server.example.com",
      trackerOrigin: "https://new.lorcanito.com",
      simulatorAssetBaseUrl: "https://cdn.example.com/simulator",
      lorcanaAssetBaseUrl: "https://cdn.example.com/lorcana",
    });
  });

  it("accepts bare hostnames by normalizing them to https urls", () => {
    publicEnv.PUBLIC_API_URL = "new-api.lorcanito.com";
    publicEnv.PUBLIC_GAME_SERVER_URL = "new-game-server.lorcanito.com/v1";

    expect(getPublicUrlConfig()).toMatchObject({
      apiOrigin: "https://new-api.lorcanito.com",
      gameServerOrigin: "https://new-game-server.lorcanito.com",
    });
  });

  it("rejects invalid API urls with a clear message", () => {
    publicEnv.PUBLIC_API_URL = "not-a-url";

    expect(() => getPublicUrlConfig()).toThrow(/Invalid PUBLIC_API_URL/);
  });

  it("builds asset urls from the configured bases", () => {
    publicEnv.PUBLIC_SIMULATOR_ASSET_BASE_URL = "https://assets.example.com/sim";
    publicEnv.PUBLIC_LORCANA_ASSET_BASE_URL = "https://assets.example.com/lorcana";

    expect(buildSimulatorAssetUrl("/symbols/exert.svg")).toBe(
      "https://assets.example.com/sim/symbols/exert.svg",
    );
    expect(buildLorcanaAssetUrl("EN/001/001.webp")).toBe(
      "https://assets.example.com/lorcana/EN/001/001.webp",
    );
  });
});
