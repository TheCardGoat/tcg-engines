import { renderToStaticMarkup } from "react-dom/server";
import type { SimulatorEntity } from "@tcg/simulator-contract";
import { describe, expect, it, vi } from "vite-plus/test";

import { ResolvingEntityStage } from "./ResolvingEntityStage.js";

const privateEntity: SimulatorEntity = {
  id: "secret-command",
  title: "Secret Command",
  subtitle: "Private rules",
  kind: "card",
  ownerId: "opponent",
  face: "hidden",
  states: [],
  imageUrl: "https://private.example/secret.png",
  stats: [{ label: "Cost", value: "9" }],
  traits: ["Classified"],
};

describe("ResolvingEntityStage", () => {
  it("never exposes hidden identity to its renderer or DOM", () => {
    const renderEntity = vi.fn((entity: SimulatorEntity) => <span>{entity.title}</span>);
    const markup = renderToStaticMarkup(
      <ResolvingEntityStage
        entity={privateEntity}
        active
        anchorId="resolution:opponent"
        label="Resolving"
        renderEntity={renderEntity}
      />,
    );

    expect(renderEntity).toHaveBeenCalledWith(
      expect.objectContaining({ id: "hidden-card", title: "Hidden card", face: "hidden" }),
    );
    expect(markup).toContain("Resolving: Hidden card");
    expect(markup).not.toContain("secret-command");
    expect(markup).not.toContain("Secret Command");
    expect(markup).not.toContain("private.example");
    expect(markup).not.toContain("Classified");
  });
});
