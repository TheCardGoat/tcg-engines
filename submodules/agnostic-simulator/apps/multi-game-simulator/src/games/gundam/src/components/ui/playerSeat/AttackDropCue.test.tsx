import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vite-plus/test";

import { AttackDropCue } from "./AttackDropCue.tsx";

describe("AttackDropCue", () => {
  it("distinguishes a Link-eligible Pilot host from a normal Pair host", () => {
    const linkCue = renderToStaticMarkup(
      <AttackDropCue variant="pilot" isOver={false} linkEligible label="Pair with Zeta" />,
    );
    const pairCue = renderToStaticMarkup(
      <AttackDropCue variant="pilot" isOver={false} label="Pair with Gundam" />,
    );

    expect(linkCue).toContain("Link");
    expect(linkCue).toContain("#65d9a8");
    expect(linkCue).toContain("link-drop-icon");
    expect(pairCue).toContain("Pair");
    expect(pairCue).toContain("#8daeff");
    expect(pairCue).not.toContain("link-drop-icon");
  });
});
