import type { GrandArchiveTheme } from "../../../board-renderer";

const BOARD_ASSET_BASE = "https://cdn.tcg.online/public/grand-archive/simulator/ui/board/v1";
const surfaceWide = `${BOARD_ASSET_BASE}/archive/wide/felt.webp`;
const surfaceCompact = `${BOARD_ASSET_BASE}/archive/compact/felt.webp`;
const avalonwideFrame = `${BOARD_ASSET_BASE}/avalon/wide/main-frame.webp`;
const avalonwideRail = `${BOARD_ASSET_BASE}/avalon/wide/right-rail.webp`;
const avalonwideOrnaments = `${BOARD_ASSET_BASE}/avalon/wide/ornaments.webp`;
const avaloncompactFrame = `${BOARD_ASSET_BASE}/avalon/compact/main-frame.webp`;
const avaloncompactRail = `${BOARD_ASSET_BASE}/avalon/compact/right-rail.webp`;
const avaloncompactOrnaments = `${BOARD_ASSET_BASE}/avalon/compact/ornaments.webp`;
const camelotwideFrame = `${BOARD_ASSET_BASE}/camelot/wide/main-frame.webp`;
const camelotwideRail = `${BOARD_ASSET_BASE}/camelot/wide/right-rail.webp`;
const camelotwideOrnaments = `${BOARD_ASSET_BASE}/camelot/wide/ornaments.webp`;
const camelotcompactFrame = `${BOARD_ASSET_BASE}/camelot/compact/main-frame.webp`;
const camelotcompactRail = `${BOARD_ASSET_BASE}/camelot/compact/right-rail.webp`;
const camelotcompactOrnaments = `${BOARD_ASSET_BASE}/camelot/compact/ornaments.webp`;
const varuckwideFrame = `${BOARD_ASSET_BASE}/varuck/wide/main-frame.webp`;
const varuckwideRail = `${BOARD_ASSET_BASE}/varuck/wide/right-rail.webp`;
const varuckwideOrnaments = `${BOARD_ASSET_BASE}/varuck/wide/ornaments.webp`;
const varuckcompactFrame = `${BOARD_ASSET_BASE}/varuck/compact/main-frame.webp`;
const varuckcompactRail = `${BOARD_ASSET_BASE}/varuck/compact/right-rail.webp`;
const varuckcompactOrnaments = `${BOARD_ASSET_BASE}/varuck/compact/ornaments.webp`;

export const cambriaThemes: readonly GrandArchiveTheme[] = [
  {
    id: "avalon",
    contract: "cambria-table-v1",
    fontFamily: "Georgia, serif",
    frameCut: 0.18,
    housingCut: 0.26,
    palette: {
      backing: "#101619",
      recess: "#123744",
      surface: "#609aa7",
      text: "#f2e7d0",
      accent: "#80beb7",
    },
    variants: {
      wide: {
        rim: 2.8,
        ornamentSize: 4.8,
        assets: {
          surface: surfaceWide,
          frame: avalonwideFrame,
          housing: avalonwideRail,
          ornament: avalonwideOrnaments,
        },
      },
      compact: {
        rim: 2.8,
        ornamentSize: 4.8,
        assets: {
          surface: surfaceCompact,
          frame: avaloncompactFrame,
          housing: avaloncompactRail,
          ornament: avaloncompactOrnaments,
        },
      },
    },
  },
  {
    id: "camelot",
    contract: "cambria-table-v1",
    fontFamily: "Georgia, serif",
    frameCut: 0.18,
    housingCut: 0.26,
    palette: {
      backing: "#101619",
      recess: "#233b31",
      surface: "#9aab87",
      text: "#f2e7d0",
      accent: "#b89a54",
    },
    variants: {
      wide: {
        rim: 2.8,
        ornamentSize: 4.8,
        assets: {
          surface: surfaceWide,
          frame: camelotwideFrame,
          housing: camelotwideRail,
          ornament: camelotwideOrnaments,
        },
      },
      compact: {
        rim: 2.8,
        ornamentSize: 4.8,
        assets: {
          surface: surfaceCompact,
          frame: camelotcompactFrame,
          housing: camelotcompactRail,
          ornament: camelotcompactOrnaments,
        },
      },
    },
  },
  {
    id: "varuck",
    contract: "cambria-table-v1",
    fontFamily: "Georgia, serif",
    frameCut: 0.18,
    housingCut: 0.26,
    palette: {
      backing: "#101619",
      recess: "#30201d",
      surface: "#8c6858",
      text: "#f2e7d0",
      accent: "#bc6c37",
    },
    variants: {
      wide: {
        rim: 2.8,
        ornamentSize: 4.8,
        assets: {
          surface: surfaceWide,
          frame: varuckwideFrame,
          housing: varuckwideRail,
          ornament: varuckwideOrnaments,
        },
      },
      compact: {
        rim: 2.8,
        ornamentSize: 4.8,
        assets: {
          surface: surfaceCompact,
          frame: varuckcompactFrame,
          housing: varuckcompactRail,
          ornament: varuckcompactOrnaments,
        },
      },
    },
  },
];
