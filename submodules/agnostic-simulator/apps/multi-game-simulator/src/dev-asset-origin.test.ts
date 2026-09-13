import { describe, expect, it } from "vitest";
import { applyDevAssetOrigin } from "./dev-asset-origin";

describe("applyDevAssetOrigin", () => {
  it("moves React Router and Vite development modules without changing app links", () => {
    const html = [
      '<link href="/@id/virtual:react-router/browser-manifest">',
      '<link href="/@react-router/critical.css?pathname=/flesh-and-blood/simulator/">',
      '<script type="module">import "/src/root.tsx"; import("/@fs/app/entry.tsx")</script>',
      '<a href="/flesh-and-blood/simulator/live/match-1">Match</a>',
    ].join("");

    expect(applyDevAssetOrigin(html, "http://localhost:5182/")).toBe(
      html
        .replace('"/@id/', '"http://localhost:5182/@id/')
        .replace('"/@react-router/', '"http://localhost:5182/@react-router/')
        .replace('"/src/', '"http://localhost:5182/src/')
        .replace('"/@fs/', '"http://localhost:5182/@fs/'),
    );
  });

  it("is a no-op when no development asset origin is configured", () => {
    expect(applyDevAssetOrigin('<script src="/src/root.tsx"></script>', undefined)).toBe(
      '<script src="/src/root.tsx"></script>',
    );
  });
});
