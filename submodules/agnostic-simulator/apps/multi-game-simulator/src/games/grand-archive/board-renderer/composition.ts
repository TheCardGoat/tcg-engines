import { GRAND_ARCHIVE_ARENA } from "./layout";

export type BoardPresentationMode = "wide" | "compact";
export interface BoardRect {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}
export interface GrandArchiveTheme {
  readonly id: string;
  readonly contract: "archive-table-v1" | "cambria-table-v1";
  /** UV cuts keep the corner artwork intact; straight rail sections repeat. */
  readonly fontFamily: string;
  readonly frameCut: number;
  readonly housingCut: number;
  readonly palette: {
    readonly backing: string;
    readonly recess: string;
    readonly surface: string;
    readonly text: string;
    readonly accent: string;
  };
  readonly variants: Readonly<
    Record<
      BoardPresentationMode,
      {
        readonly rim: number;
        readonly ornamentSize: number;
        readonly assets: {
          readonly surface: string;
          readonly frame: string;
          readonly housing: string;
          readonly ornament: string;
        };
      }
    >
  >;
}
export interface GrandArchiveComposition {
  readonly mode: BoardPresentationMode;
  readonly width: number;
  readonly height: number;
  readonly playCenterX: number;
  readonly slots: Readonly<
    Record<
      "action" | "undo" | "status" | "selfMemory" | "opponentMemory" | "selfDeck" | "opponentDeck",
      BoardRect
    >
  >;
}

/** One coordinate system for scene fittings, cards and accessible DOM controls. */
export function grandArchiveComposition(
  pixelWidth: number,
  pixelHeight: number,
  contract: GrandArchiveTheme["contract"] = "archive-table-v1",
): GrandArchiveComposition {
  const aspect = Math.max(1, pixelWidth) / Math.max(1, pixelHeight);
  const height = Math.max(GRAND_ARCHIVE_ARENA.height, GRAND_ARCHIVE_ARENA.width / aspect);
  const width = height * aspect;
  const mode = pixelWidth < 700 || aspect < 0.9 ? "compact" : "wide";
  const compact = mode === "compact";
  if (contract === "cambria-table-v1") return cambriaComposition(width, height, mode);
  const railWidth = 3.0;
  const railX = width / 2 - railWidth / 2 - 0.22;
  const rect = (x: number, y: number, w: number, h: number): BoardRect => ({
    x,
    y,
    width: w,
    height: h,
  });
  const memoryWidth = compact ? 3.8 : 4.8;
  const memoryX = width / 2 - memoryWidth / 2 - 0.25;
  const memoryY = height * (compact ? 0.365 : 0.4);
  const deckY = height * 0.19;
  return {
    mode,
    width,
    height,
    playCenterX: compact ? -0.55 : -railWidth / 2,
    slots: {
      action: rect(railX, 0, railWidth, compact ? 1.7 : 1.35),
      undo: rect(railX, compact ? 1.65 : 1.1, 0.68, 0.68),
      status: rect(railX, compact ? -1.7 : -1.15, railWidth, compact ? 1.4 : 0.65),
      selfMemory: rect(memoryX, memoryY, memoryWidth, 0.98),
      opponentMemory: rect(memoryX, -memoryY, memoryWidth, 0.98),
      selfDeck: rect(railX, deckY, 1.72, 2.25),
      opponentDeck: rect(railX, -deckY, 1.72, 2.25),
    },
  };
}

export function grandArchiveSlotStyle(rect: BoardRect, composition: GrandArchiveComposition) {
  return {
    left: `${50 + ((rect.x - rect.width / 2) / composition.width) * 100}%`,
    top: `${50 + ((rect.y - rect.height / 2) / composition.height) * 100}%`,
    width: `${(rect.width / composition.width) * 100}%`,
    height: `${(rect.height / composition.height) * 100}%`,
  };
}

/** Measurements shared by the split rail artwork and its DOM/card anchors. */
export function cambriaGeometry(width: number, height: number, mode: BoardPresentationMode) {
  const frameWidth = width - 0.16;
  const railWidth = mode === "compact" ? 3.8 : 4.0;
  const railScale = (railWidth * 2169) / 725;
  const top = -height / 2 + frameWidth * 0.105;
  const frameBottom = height / 2 - (mode === "compact" ? 2.4 : 0);
  const bottom = frameBottom - frameWidth * 0.105;
  const railLeft = width / 2 - 0.16 - railWidth;
  return { frameWidth, railWidth, railScale, top, bottom, frameBottom, railLeft };
}
function cambriaComposition(
  width: number,
  height: number,
  mode: BoardPresentationMode,
): GrandArchiveComposition {
  const g = cambriaGeometry(width, height, mode);
  const rect = (x: number, y: number, w: number, h: number): BoardRect => ({
    x,
    y,
    width: w,
    height: h,
  });
  const actionX = g.railLeft + g.railWidth * 0.49;
  const deckX = g.railLeft + g.railWidth * 0.7;
  const deckY = (g.bottom - g.railScale * 0.15 + g.railScale * 0.125) / 2;
  const memoryX = -width / 2 + g.frameWidth * 0.716;
  const memoryY = height / 2 - g.frameWidth * 0.105;
  return {
    width,
    height,
    mode,
    playCenterX: mode === "compact" ? -0.5 : -0.8,
    slots: {
      action: rect(actionX, 0, g.railWidth * 0.57, g.railScale * 0.092),
      undo: rect(actionX - g.railWidth * 0.285 - 0.85, 0, 0.7, 0.7),
      status: rect(actionX - 0.5, -g.railScale * 0.11, 3.4, 0.75),
      selfMemory: rect(
        memoryX,
        g.frameBottom - g.frameWidth * 0.13,
        g.frameWidth * 0.27,
        g.frameWidth * 0.038,
      ),
      opponentMemory: rect(memoryX, -memoryY, g.frameWidth * 0.27, g.frameWidth * 0.038),
      selfDeck: rect(deckX, deckY, 1.3, 2.0),
      opponentDeck: rect(deckX, (g.top + g.railScale * 0.015) / 2, 1.3, 2.0),
    },
  };
}
