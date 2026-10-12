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
  _contract: GrandArchiveTheme["contract"] = "archive-table-v1",
): GrandArchiveComposition {
  const aspect = Math.max(1, pixelWidth) / Math.max(1, pixelHeight);
  const height = Math.max(GRAND_ARCHIVE_ARENA.height, GRAND_ARCHIVE_ARENA.width / aspect);
  const width = height * aspect;
  // Compact changes artwork density only. Cards and control anchors keep the
  // same coordinates on desktop and mobile, including while a drawer is open.
  const mode = pixelHeight < 540 ? "compact" : "wide";
  const rect = (x: number, y: number, w: number, h: number): BoardRect => ({
    x,
    y,
    width: w,
    height: h,
  });
  return {
    mode,
    width,
    height,
    playCenterX: -1.2,
    slots: {
      action: rect(8.75, 0, 3.5, 1.1),
      undo: rect(6.35, 0, 0.9, 0.9),
      status: rect(8.75, -1.05, 3.5, 0.8),
      selfMemory: rect(5.35, 4.3, 4.8, 0.9),
      opponentMemory: rect(5.35, -4.3, 4.8, 0.9),
      selfDeck: rect(8.75, 2.65, 1.5, 2.05),
      opponentDeck: rect(8.75, -2.65, 1.5, 2.05),
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
export function cambriaGeometry(_width: number, _height: number, _mode: BoardPresentationMode) {
  // Decoration belongs to the same fixed board as the cards. It must not grow
  // with a phone's extra-wide camera span or consume the playing rows.
  const frameWidth = GRAND_ARCHIVE_ARENA.width - 0.16;
  const frameHeight = GRAND_ARCHIVE_ARENA.height - 0.16;
  const railWidth = 3.5;
  const railScale = (railWidth * 2169) / 725;
  const top = -4.4;
  const bottom = 4.4;
  const frameBottom = frameHeight / 2;
  const railLeft = 7;
  return { frameWidth, frameHeight, railWidth, railScale, top, bottom, frameBottom, railLeft };
}
