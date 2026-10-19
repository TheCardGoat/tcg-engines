// @vitest-environment jsdom
import { afterEach, expect, test } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { ArenaDropZone } from "./ArenaDropZone";

afterEach(cleanup);

test("an engaged card uses projected screen bounds for drag collision measurement", () => {
  render(
    <ArenaDropZone
      anchor={{
        id: "attacker",
        left: 580,
        top: 180,
        width: 112,
        height: 79,
        captionLeft: 636,
        captionTop: 259,
        surfaceTransform: "matrix3d(0,1,0,0,-1,0,0,0,0,0,1,0,112,0,0,1)",
      }}
      zone="clash"
      destination="card:attacker"
      label="Obstruct"
    />,
  );
  const target = screen.getByTestId("arena-drop-card:attacker");
  expect(target.style.transform).toBe("");
  expect(target.style.left).toBe("580px");
  expect(target.style.top).toBe("180px");
  expect(target.style.width).toBe("112px");
  expect(target.style.height).toBe("79px");
});

test("zone drop targets keep the table perspective and dedicated drop surface", () => {
  render(
    <ArenaDropZone
      anchor={{
        id: "accessory",
        left: 10,
        top: 20,
        width: 100,
        height: 80,
        captionLeft: 60,
        captionTop: 100,
        dropSurface: {
          left: 12,
          top: 22,
          width: 200,
          height: 100,
          transform: "matrix(1,0,0,0.8,0,0)",
          worldWidth: 200,
          worldHeight: 100,
          bevel: 12,
          arm: 30,
        },
      }}
      zone="accessory"
    />,
  );
  const target = screen.getByTestId("arena-drop-accessory");
  expect(target.style.transform).toBe("matrix(1,0,0,0.8,0,0)");
  expect(target.style.left).toBe("12px");
  expect(target.style.width).toBe("200px");
});
