import { describe, expect, it } from "bun:test";
import { render } from "svelte/server";

import PriorityNudge from "./PriorityNudge.svelte";

describe("PriorityNudge", () => {
  it("renders local reminder copy and manual helper actions", () => {
    const { body } = render(PriorityNudge, {
      props: {
        canPassTurn: true,
      },
    });

    expect(body).toContain("Your priority. Take an action, pass, or send a quick note.");
    expect(body).toContain("Pass priority");
    expect(body).not.toContain("Actions");
    expect(body).toContain("I'm thinking");
    expect(body).not.toContain("One moment.");
    expect(body).toContain("Close");
  });

  it("always renders the thinking helper button", () => {
    const { body } = render(PriorityNudge, {
      props: {
        canPassTurn: true,
      },
    });

    expect(body).toContain("Pass priority");
    expect(body).toContain("I'm thinking");
    expect(body).toContain("Close");
  });
});
