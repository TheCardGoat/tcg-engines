import type { SimulatorEntity } from "@tcg/simulator-contract";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vite-plus/test";

import { ViewerSafeCardImage } from "./ViewerSafeCardImage.js";

const PRIVATE_URL = "https://private.invalid/opponent-secret.webp";
const BACK_URL = "https://public.invalid/card-back.webp";

function leakedEntity(face: "public" | "hidden"): SimulatorEntity {
  return {
    id: "opponent-hand-secret-card",
    title: "Opponent Secret Command",
    subtitle: "Private rules text",
    kind: "card",
    ownerId: "opponent",
    face,
    states: ["ready"],
    stats: [{ label: "Cost", value: "9" }],
    traits: ["Classified"],
    imageUrl: PRIVATE_URL,
    backImageUrl: BACK_URL,
    dataAttributes: { "data-private-card-id": "OP-SECRET-001" },
  };
}

describe("ViewerSafeCardImage", () => {
  it.each(["deck", "hand", "shield", "life", "resource", "resolving"] as const)(
    "never mounts leaked identity or art for a hidden %s card",
    () => {
      const markup = renderToStaticMarkup(<ViewerSafeCardImage entity={leakedEntity("hidden")} />);

      expect(markup).toContain(BACK_URL);
      expect(markup).toContain('alt="Hidden card"');
      expect(markup).not.toContain(PRIVATE_URL);
      expect(markup).not.toContain("Opponent Secret Command");
      expect(markup).not.toContain("OP-SECRET-001");
    },
  );

  it("renders authorized public art", () => {
    const markup = renderToStaticMarkup(<ViewerSafeCardImage entity={leakedEntity("public")} />);

    expect(markup).toContain(PRIVATE_URL);
    expect(markup).toContain("Opponent Secret Command");
    expect(markup).not.toContain(BACK_URL);
  });

  it("allows a caller to force a hidden projection over leaked public data", () => {
    const markup = renderToStaticMarkup(
      <ViewerSafeCardImage entity={leakedEntity("public")} face="hidden" />,
    );

    expect(markup).toContain(BACK_URL);
    expect(markup).not.toContain(PRIVATE_URL);
  });
});
