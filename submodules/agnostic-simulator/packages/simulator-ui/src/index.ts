// Components
export { AiControlPanel, type AiControlPanelProps } from "./components/AiControlPanel";
export { Board } from "./components/Board";
export { BoardBlock } from "./components/BoardBlock";
export { BoardLayout } from "./components/BoardLayout";
export { Card } from "./components/Card";
export { CardFace } from "./components/CardFace";
export { CardFan } from "./components/CardFan";
export { CardGrid } from "./components/CardGrid";
export { CardImage, DEFAULT_CARD_ASPECT_RATIO } from "./components/CardImage";
export { CardStack, type CardStackProps } from "./components/CardStack";
export { CardZone } from "./components/CardZone";
export { DeckStackZone, type DeckStackZoneProps } from "./components/DeckStackZone";
export { DiscardPileZone, type DiscardPileZoneProps } from "./components/DiscardPileZone";
export { ChatPanel, type ChatMessage, type ChatPanelProps } from "./components/ChatPanel";
export { CompactHandZone } from "./components/CompactHandZone";
export { ConnectionPanel, type ConnectionPanelProps } from "./components/ConnectionPanel";
export { CardRow } from "./components/CardRow";
export { ChoiceChips } from "./components/ChoiceChips";
export { ChoiceModal } from "./components/ChoiceModal";
export { ChoiceResolutionOverlay } from "./components/ChoiceResolutionOverlay";
export { PromptBanner } from "./components/PromptBanner";
export { CardInspector } from "./components/CardInspector";
export { CardDetailSheet } from "./components/CardDetailSheet";
export { CoreComponentMap } from "./components/CoreComponentMap";
export { EmptyZone } from "./components/EmptyZone";
export { EventLogPanel } from "./components/EventLogPanel";
export { Draggable } from "./components/Draggable";
export { Droppable } from "./components/Droppable";
export { FixtureNavigation } from "./components/FixtureNavigation";
export { HandZone } from "./components/HandZone";
export { MobileShell } from "./components/MobileShell";
export { InteractionPanel } from "./components/InteractionPanel";
export { PostGameModal, type PostGameModalProps } from "./components/PostGameModal";
export { RunbookPanel } from "./components/RunbookPanel";
export { SeatSummary } from "./components/SeatSummary";
export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarInput,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
  type SidebarCollapsible,
  type SidebarContextValue,
  type SidebarMenuButtonSize,
  type SidebarMenuButtonVariant,
  type SidebarSide,
  type SidebarState,
  type SidebarVariant,
} from "./components/Sidebar";
export { SimulatorHarness } from "./SimulatorHarness";
export { StatusBar } from "./components/StatusBar";
export { SingleCardZone, type SingleCardZoneProps } from "./components/SingleCardZone";
export {
  TabletopActionButton,
  type TabletopActionButtonProps,
} from "./components/TabletopActionButton";
export {
  TabletopCounterBadge,
  type TabletopCounterBadgeProps,
} from "./components/TabletopCounterBadge";
export { TargetingArrow } from "./components/TargetingArrow";
export { TargetingOverlay } from "./components/TargetingOverlay";
export { TargetingPreviewBadge } from "./components/TargetingPreviewBadge";
export { TargetingSpotlight } from "./components/TargetingSpotlight";
export { TokenRow } from "./components/TokenRow";
export { TurnIndicator } from "./components/TurnIndicator";
export { PriorityRing } from "./components/PriorityRing";
export { ChessClock } from "./components/ChessClock";
export { ZoneFrame } from "./components/ZoneFrame";
export {
  ZoneTransferAnimator,
  resolveZoneFaceForViewer,
  type ZoneTransferAnimationStep,
  type ZoneTransferKind,
} from "./components/ZoneTransferAnimator";
export {
  projectEntityForZoneViewer,
  redactEntityForHiddenZone,
  resolveAnimationCardFaceForViewer,
  type ResolveAnimationCardFaceInput,
  type SimulatorAnimationBaseEvent,
  type SimulatorAnimationCardFace,
  type SimulatorAnimationEvent,
  type SimulatorAnimationPrimitive,
  type SimulatorAnimationReducedMotionBehavior,
  type SimulatorAnimationViewerContext,
  type SimulatorAttachEvent,
  type SimulatorFlipRevealEvent,
  type SimulatorLayoutShiftEvent,
  type SimulatorZoneEnterEvent,
  type SimulatorZoneExitEvent,
  type SimulatorZoneTransferEvent,
} from "./animation/events";
export { isZoneTransferEvent, toZoneTransferAnimationStep } from "./animation/zoneTransferEvent";
export {
  SimulatorAnimationLayer,
  type SimulatorAnimationLayerProps,
} from "./animation/SimulatorAnimationLayer";
export {
  isPrimitiveOverlayEvent,
  primitiveOverlayKind,
  resolvePrimitiveOverlayFaces,
  type PrimitiveOverlayFacePlan,
  type SimulatorPrimitiveOverlayEvent,
  type SimulatorPrimitiveOverlayKind,
} from "./animation/primitiveEvent";
export {
  cardMoveRecordToSimulatorEvent,
  cardMoveRecordsToSimulatorEvents,
  type CardMoveAnimationContext,
  type CardMoveAnimationRecord,
} from "./animation/cardMoveEvents";
export {
  VisualAnimationLayer,
  type VisualAnimationLayerProps,
} from "./animation/VisualAnimationLayer";
export type {
  CombatVisualAnimationEvent,
  PhaseChangeVisualAnimationEvent,
  ResourceFloatVisualAnimationEvent,
  VisualAnimationBaseEvent,
  VisualAnimationEvent,
} from "./animation/visualEvents";

// Accessibility
export { AccessibilityAnnouncer } from "./components/AccessibilityAnnouncer";
export { KeyboardNavigator } from "./components/KeyboardNavigator";

// Hooks
export { DndContext, useDnd, useDndProvider } from "./hooks/useDnd";
export { MotionContext, useMotion, useMotionProvider } from "./hooks/useMotion";
export { useStickToBottom, type UseStickToBottomOptions } from "./hooks/useStickToBottom";
export {
  useFlipAnimation,
  flipAnimate,
  spawnAnimate,
  cancelFlipAnimation,
  readElementRect,
  type Rect,
  type FlipOptions,
} from "./hooks/useFlipAnimation";

// Utilities
export { cx } from "./class-names";
export { buildCardImageUrl, resolveEntityImageUrl } from "./lib/urlBuilder";
