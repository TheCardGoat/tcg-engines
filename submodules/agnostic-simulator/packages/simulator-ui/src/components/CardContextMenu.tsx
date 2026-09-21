import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Drawer, FocusTrap } from "@mantine/core";
import {
  IconBolt,
  IconChevronRight,
  IconInfoCircle,
  IconLayoutGrid,
  IconListDetails,
  IconLock,
  IconPhoto,
  IconX,
} from "@tabler/icons-react";
import type {
  CardInteractionMode,
  SimulatorCardAction,
  SimulatorEntity,
} from "@tcg/simulator-contract";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import { CardFace } from "./CardFace";
import classes from "./CardContextMenu.module.css";
import { useSimulatorViewportLayout } from "./SimulatorViewportShell";
import { useActiveLayout, type ActiveLayout } from "../hooks/useActiveLayout";

const CARD_SELECTOR = "[data-sim-entity-id]";
const PRIMARY_CLICK_ZONE_OWNER_SELECTOR = '[data-sim-primary-click-owner^="zone"]';
const EXCLUSIVE_PRIMARY_CLICK_ZONE_OWNER_SELECTOR =
  '[data-sim-primary-click-owner="zone-exclusive"]';
const DRAG_CLICK_THRESHOLD_PX = 8;
/** Long-press opens the full card surface when single-action auto-activate steals tap. */
const AUTO_ACTIVATE_LONG_PRESS_MS = 450;

export interface CardContextMenuIdentityProps {
  entity: SimulatorEntity;
  mode: CardInteractionMode;
}

export interface CardContextMenuActionIconProps {
  action: SimulatorCardAction;
  disabled: boolean;
}

export type CardContextMenuControl = "preview" | "quick-mode" | "detailed-mode" | "close";

export interface CardContextMenuControlIconProps {
  control: CardContextMenuControl;
  active?: boolean;
}

export type CardContextMenuTextKind =
  | "action-label"
  | "action-detail"
  | "disabled-reason"
  | "rule"
  | "active-effect";

export interface CardContextMenuTextProps {
  text: string;
  kind: CardContextMenuTextKind;
}

/**
 * Optional game-owned presentation for the shared interaction surface.
 *
 * The shared component continues to own semantics, focus, legality, action
 * execution, positioning, and responsive behavior. Games may replace only the
 * visible identity and iconography, keeping the serialized simulator contract
 * free of React components and theme concerns.
 */
export interface CardContextMenuVisualIdentity {
  /** Applied to the popover surface so a game can scope its own tokens. */
  className?: string;
  /** A game may make quick mode enabled-actions-only without changing other consumers. */
  hideDisabledActionsInQuickMode?: boolean;
  /** Clears an incidental board-hover preview when the context surface opens. */
  dismissPreviewOnOpen?: boolean;
  /** Lets an opted-in game anchor the wide touch surface above the pressed card. */
  anchorAboveOnMobile?: boolean;
  /** Lets an opted-in game put executable actions before reference details on small screens. */
  actionsFirstOnMobile?: boolean;
  renderIdentity?: (props: CardContextMenuIdentityProps) => ReactNode;
  renderActionIcon?: (props: CardContextMenuActionIconProps) => ReactNode;
  renderControlIcon?: (props: CardContextMenuControlIconProps) => ReactNode;
  /** Renders game-native inline symbols while preserving plain-text fallbacks. */
  renderText?: (props: CardContextMenuTextProps) => ReactNode;
}

export interface CardContextMenuProps {
  entity: SimulatorEntity;
  actions: readonly SimulatorCardAction[];
  mode: CardInteractionMode;
  open: boolean;
  anchorElement: HTMLElement | null;
  anchorVersion?: number;
  onModeChange: (mode: CardInteractionMode) => void;
  onAction: (action: SimulatorCardAction) => void;
  onOpenChange: (open: boolean) => void;
  /** Lets a game route image inspection through its native preview surface. */
  onPreviewEntity?: (entity: SimulatorEntity, mode: "hover" | "pinned") => void;
  /** An entity id ends incidental hover; no id explicitly dismisses inspection. */
  onPreviewEnd?: (hoverEntityId?: string) => void;
  visualIdentity?: CardContextMenuVisualIdentity;
  /** Uses the owning simulator shell's resolved layout when the controller sits above that shell. */
  layoutOverride?: ActiveLayout;
}

/**
 * Controlled, game-agnostic card context surface. Games provide normalized
 * reading data and authoritative actions; this component owns presentation,
 * focus, positioning, and dismissal only.
 */
export function CardContextMenu({
  entity,
  actions,
  mode,
  open,
  anchorElement,
  anchorVersion = 0,
  onModeChange,
  onAction,
  onOpenChange,
  onPreviewEntity,
  onPreviewEnd,
  visualIdentity,
  layoutOverride,
}: CardContextMenuProps) {
  const floatingRef = useRef<HTMLDivElement | null>(null);
  const actionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const previewToggleRef = useRef<HTMLButtonElement | null>(null);
  const titleId = useId();
  const previewId = useId();
  const [announcement, setAnnouncement] = useState("");
  const [previewPinned, setPreviewPinned] = useState(false);
  const [previewHovered, setPreviewHovered] = useState(false);
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const [nativePreviewPinned, setNativePreviewPinned] = useState(false);
  const [nativePreviewHovered, setNativePreviewHovered] = useState(false);
  const nativePreviewPinnedRef = useRef(false);
  const nativePreviewActive = useRef<"hover" | "pinned" | null>(null);
  const onPreviewEndRef = useRef(onPreviewEnd);
  onPreviewEndRef.current = onPreviewEnd;
  const usesNativePreview = onPreviewEntity !== undefined;
  const shellLayout = useSimulatorViewportLayout();
  const standaloneLayout = useActiveLayout(560);
  const isMobileLayout =
    (layoutOverride ?? (shellLayout === "mobile" ? shellLayout : standaloneLayout)) === "mobile";
  const previewOpen = !isMobileLayout && (previewPinned || previewHovered);
  const nativePreviewOpen = usesNativePreview && (nativePreviewPinned || nativePreviewHovered);
  const [expandedActionId, setExpandedActionId] = useState<string | null>(null);
  const [pointerReady, setPointerReady] = useState(false);
  const openedAtRef = useRef(0);
  const orderedActions = useMemo(() => sortCardActions(actions), [actions]);
  const hideDisabledInQuickMode =
    mode === "quick" && Boolean(visualIdentity?.hideDisabledActionsInQuickMode);
  const visibleActions = useMemo(
    () =>
      hideDisabledInQuickMode
        ? orderedActions.filter((action) => actionGroupIsEnabled(action))
        : orderedActions,
    [hideDisabledInQuickMode, orderedActions],
  );
  const renderedActionRows = useMemo(
    () => flattenVisibleActionRows(visibleActions, expandedActionId, hideDisabledInQuickMode),
    [expandedActionId, hideDisabledInQuickMode, visibleActions],
  );
  const enabledActionCount = visibleActions.reduce(
    (count, action) => count + enabledLeafActionCount(action),
    0,
  );
  const anchorRef = useMemo(
    () => (anchorElement ? { current: anchorElement } : null),
    [anchorElement],
  );
  const focusAnchor = useCallback(() => {
    anchorElement?.focus({ preventScroll: true });
  }, [anchorElement]);
  const showNativePreview = useCallback(
    (mode: "hover" | "pinned") => {
      if (nativePreviewActive.current === "pinned" || nativePreviewActive.current === mode) return;
      nativePreviewActive.current = mode;
      onPreviewEntity?.(entity, mode);
    },
    [entity, onPreviewEntity],
  );
  const hideNativePreview = useCallback((hoverEntityId?: string) => {
    if (!nativePreviewActive.current) return;
    nativePreviewActive.current = null;
    onPreviewEndRef.current?.(hoverEntityId);
  }, []);

  useEffect(() => () => hideNativePreview(), [hideNativePreview]);

  useEffect(() => {
    setExpandedActionId(null);
  }, [entity.id, open]);

  useEffect(() => {
    if (!open) {
      setPointerReady(false);
      return undefined;
    }
    openedAtRef.current = Date.now();
    const timer = window.setTimeout(() => setPointerReady(true), 200);
    return () => window.clearTimeout(timer);
  }, [open, entity.id]);

  const activate = useCallback(
    (action: SimulatorCardAction) => {
      if (action.availability.kind === "disabled") {
        setAnnouncement(`${action.label} unavailable. ${action.availability.reason}`);
        return;
      }
      setAnnouncement("");
      onOpenChange(false);
      focusAnchor();
      onAction(action);
    },
    [focusAnchor, onAction, onOpenChange],
  );

  useEffect(() => {
    if (!open) return undefined;

    const runShortcut = (event: globalThis.KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const action = renderedActionRows
        .filter((row) => row.role === "item")
        .map((row) => row.action)
        .find((candidate) => candidate.shortcut === event.key);
      if (!action) return;
      event.preventDefault();
      event.stopPropagation();
      activate(action);
    };

    window.addEventListener("keydown", runShortcut, true);
    return () => window.removeEventListener("keydown", runShortcut, true);
  }, [activate, open, renderedActionRows]);

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (renderedActionRows.length === 0) return;
    const currentIndex = actionRefs.current.findIndex(
      (candidate) => candidate === document.activeElement,
    );
    const currentRow = currentIndex >= 0 ? renderedActionRows[currentIndex] : undefined;
    if (event.key === "ArrowRight" && currentRow?.role === "submenu") {
      event.preventDefault();
      setExpandedActionId(currentRow.action.id);
      return;
    }
    if (event.key === "ArrowLeft" && currentRow) {
      if (currentRow.depth === 1) {
        event.preventDefault();
        const parentIndex = renderedActionRows.findIndex(
          (row) => row.role === "submenu" && row.action.id === expandedActionId,
        );
        setExpandedActionId(null);
        window.setTimeout(() => actionRefs.current[parentIndex]?.focus(), 0);
        return;
      }
      if (currentRow.role === "submenu" && expandedActionId === currentRow.action.id) {
        event.preventDefault();
        setExpandedActionId(null);
        return;
      }
    }
    let nextIndex: number | null = null;
    if (event.key === "ArrowDown") {
      nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % renderedActionRows.length;
    } else if (event.key === "ArrowUp") {
      nextIndex =
        currentIndex < 0
          ? renderedActionRows.length - 1
          : (currentIndex - 1 + renderedActionRows.length) % renderedActionRows.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = renderedActionRows.length - 1;
    }
    if (nextIndex === null) return;
    event.preventDefault();
    actionRefs.current[nextIndex]?.focus();
  };

  if (!open || !anchorElement || !anchorRef || typeof document === "undefined") return null;

  const menuSurface = (
    <div
      ref={floatingRef}
      className={[
        classes.surface,
        isMobileLayout ? classes.mobileSurface : "",
        visualIdentity?.className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-card-context-menu
      data-mode={mode}
      data-actions-first-mobile={visualIdentity?.actionsFirstOnMobile || undefined}
      data-mobile-surface={isMobileLayout || undefined}
      data-testid="card-context-menu"
      data-pointer-ready={pointerReady ? "true" : "false"}
      aria-labelledby={titleId}
      tabIndex={-1}
      onKeyDown={handleMenuKeyDown}
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      {isMobileLayout ? <FocusTrap.InitialFocus /> : null}
      <header className={classes.header}>
        <span
          className={classes.frameMark}
          style={{ backgroundColor: entity.frameStyle?.color ?? "var(--game-accent)" }}
          aria-hidden="true"
        />
        {visualIdentity?.renderIdentity ? (
          <>
            <h2 id={titleId} className={classes.srOnly}>
              {entity.title}
            </h2>
            <div className={classes.identity}>
              {visualIdentity.renderIdentity({ entity, mode })}
            </div>
          </>
        ) : (
          <DefaultCardContextIdentity entity={entity} mode={mode} titleId={titleId} />
        )}
        {mode === "detailed" ? (
          <button
            ref={previewToggleRef}
            type="button"
            className={classes.previewToggle}
            aria-expanded={
              usesNativePreview
                ? nativePreviewOpen
                : isMobileLayout
                  ? mobilePreviewOpen
                  : previewOpen
            }
            aria-controls={usesNativePreview || isMobileLayout ? undefined : previewId}
            aria-haspopup={usesNativePreview ? "dialog" : isMobileLayout ? "dialog" : undefined}
            aria-label={`${previewOpen || mobilePreviewOpen || nativePreviewOpen ? "Hide" : "Show"} ${entity.title} card image`}
            title={`${previewOpen || mobilePreviewOpen || nativePreviewOpen ? "Hide" : "Show"} card image`}
            onPointerEnter={() => {
              if (usesNativePreview) {
                setNativePreviewHovered(true);
                showNativePreview("hover");
                return;
              }
              if (!isMobileLayout) setPreviewHovered(true);
            }}
            onPointerLeave={() => {
              if (usesNativePreview) {
                setNativePreviewHovered(false);
                if (!nativePreviewPinnedRef.current) hideNativePreview(entity.id);
                return;
              }
              setPreviewHovered(false);
            }}
            onFocus={() => {
              if (usesNativePreview) {
                setNativePreviewHovered(true);
                showNativePreview("hover");
                return;
              }
              if (!isMobileLayout) setPreviewHovered(true);
            }}
            onBlur={() => {
              if (usesNativePreview) {
                setNativePreviewHovered(false);
                if (!nativePreviewPinnedRef.current) hideNativePreview(entity.id);
                return;
              }
              setPreviewHovered(false);
            }}
            onClick={() => {
              if (usesNativePreview) {
                if (nativePreviewPinned) {
                  nativePreviewPinnedRef.current = false;
                  setNativePreviewPinned(false);
                  setNativePreviewHovered(false);
                  hideNativePreview();
                } else {
                  nativePreviewPinnedRef.current = true;
                  setNativePreviewPinned(true);
                  showNativePreview("pinned");
                }
                return;
              }
              if (isMobileLayout) {
                setMobilePreviewOpen(true);
                return;
              }
              setPreviewPinned((current) => !current);
            }}
          >
            {visualIdentity?.renderControlIcon?.({
              control: "preview",
              active: previewOpen || mobilePreviewOpen || nativePreviewOpen,
            }) ?? <IconPhoto size={15} aria-hidden="true" />}
          </button>
        ) : null}
        <button
          type="button"
          className={classes.modeToggle}
          aria-label={`Switch to ${mode === "quick" ? "detailed" : "quick"} card view`}
          aria-pressed={mode === "detailed"}
          title={`Switch to ${mode === "quick" ? "detailed" : "quick"} card view`}
          onClick={() => onModeChange(mode === "quick" ? "detailed" : "quick")}
        >
          {visualIdentity?.renderControlIcon?.({
            control: mode === "quick" ? "detailed-mode" : "quick-mode",
            active: mode === "detailed",
          }) ??
            (mode === "quick" ? (
              <IconListDetails size={17} stroke={2.2} aria-hidden="true" />
            ) : (
              <IconLayoutGrid size={17} stroke={2.2} aria-hidden="true" />
            ))}
        </button>
        <button
          type="button"
          className={classes.closeButton}
          aria-label="Close card menu"
          onClick={() => {
            onOpenChange(false);
            focusAnchor();
          }}
        >
          {visualIdentity?.renderControlIcon?.({ control: "close" }) ?? (
            <IconX size={18} aria-hidden="true" />
          )}
        </button>
      </header>

      <div className={classes.scrollRegion}>
        {mode === "detailed" ? (
          <DetailedCardContext
            entity={entity}
            previewId={previewId}
            previewOpen={usesNativePreview ? false : previewOpen}
            visualIdentity={visualIdentity}
          />
        ) : null}

        <section className={classes.actionsSection} aria-label="Card actions">
          {enabledActionCount > 1 ? (
            <p className={classes.actionChoiceHint}>Choose how to use this card.</p>
          ) : null}
          {renderedActionRows.length > 0 ? (
            <div className={classes.actionList} role="menu" aria-label={`${entity.title} actions`}>
              {renderedActionRows.map((row, index) => {
                const { action } = row;
                const disabledReason =
                  action.availability.kind === "disabled" ? action.availability.reason : undefined;
                const disabled = disabledReason !== undefined;
                const expanded = row.role === "submenu" && expandedActionId === action.id;
                return (
                  <button
                    key={action.id}
                    ref={(node) => {
                      actionRefs.current[index] = node;
                    }}
                    type="button"
                    className={classes.action}
                    role="menuitem"
                    aria-disabled={disabled}
                    aria-expanded={row.role === "submenu" ? expanded : undefined}
                    aria-haspopup={row.role === "submenu" ? "menu" : undefined}
                    aria-keyshortcuts={action.shortcut}
                    data-action-id={action.id}
                    data-action-availability={disabled ? "disabled" : "enabled"}
                    data-action-role={row.role}
                    data-action-depth={row.depth}
                    onClick={() => {
                      if (row.role === "submenu") {
                        if (disabled) {
                          setAnnouncement(
                            `${action.label} unavailable. ${disabledReason ?? ""}`.trim(),
                          );
                          return;
                        }
                        setExpandedActionId((current) =>
                          current === action.id ? null : action.id,
                        );
                        return;
                      }
                      activate(action);
                    }}
                    onKeyDown={(event) => {
                      if (event.key !== "Enter" && event.key !== " ") return;
                      event.preventDefault();
                      event.stopPropagation();
                      if (row.role === "submenu") {
                        if (disabled) return;
                        setExpandedActionId((current) =>
                          current === action.id ? null : action.id,
                        );
                        return;
                      }
                      activate(action);
                    }}
                  >
                    <span className={classes.actionGlyph} data-disabled={disabled}>
                      {visualIdentity?.renderActionIcon?.({ action, disabled }) ??
                        (disabled ? (
                          <IconLock size={16} aria-hidden="true" />
                        ) : (
                          <IconBolt size={16} aria-hidden="true" />
                        ))}
                    </span>
                    <span className={classes.actionCopy}>
                      <strong>
                        {renderContextText(visualIdentity, action.label, "action-label")}
                      </strong>
                      {mode === "detailed" && action.detail ? (
                        <span>
                          {renderContextText(visualIdentity, action.detail, "action-detail")}
                        </span>
                      ) : null}
                      {disabled ? (
                        <span className={classes.disabledReason}>
                          {renderContextText(visualIdentity, disabledReason, "disabled-reason")}
                        </span>
                      ) : null}
                    </span>
                    <span className={classes.actionEnd}>
                      {action.shortcut ? <kbd aria-hidden="true">{action.shortcut}</kbd> : null}
                      {disabled && visualIdentity?.renderActionIcon ? (
                        <IconLock
                          className={classes.actionStatusIcon}
                          size={13}
                          aria-hidden="true"
                        />
                      ) : !disabled ? (
                        <IconChevronRight
                          className={classes.actionChevron}
                          data-action-affordance={row.role === "submenu" ? "submenu" : "activate"}
                          data-expanded={expanded || undefined}
                          size={17}
                          aria-hidden="true"
                        />
                      ) : null}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className={classes.emptyActions}>
              <IconInfoCircle size={17} aria-hidden="true" />
              <span>No actions for you from this card.</span>
            </div>
          )}
        </section>
      </div>
      {!usesNativePreview && mobilePreviewOpen ? (
        <CardImageDialog
          entity={entity}
          onClose={() => {
            setMobilePreviewOpen(false);
            window.setTimeout(() => {
              window.setTimeout(() => previewToggleRef.current?.focus({ preventScroll: true }), 0);
            }, 0);
          }}
        />
      ) : null}
      <span className={classes.srOnly} aria-live="polite">
        {announcement}
      </span>
    </div>
  );

  if (isMobileLayout) {
    return (
      <Drawer
        opened={open}
        onClose={() => {
          onOpenChange(false);
          focusAnchor();
        }}
        position="bottom"
        size="min(78dvh, 640px)"
        padding={0}
        zIndex={2100}
        withCloseButton={false}
        returnFocus={false}
        title={<span className={classes.srOnly}>{entity.title} card menu</span>}
        overlayProps={{ backgroundOpacity: 0.58 }}
        classNames={{
          content: classes.mobileDrawerContent,
          body: classes.mobileDrawerBody,
          header: classes.mobileDrawerHeader,
        }}
        onEnterTransitionEnd={() => floatingRef.current?.focus({ preventScroll: true })}
      >
        {menuSurface}
      </Drawer>
    );
  }

  return (
    <PopoverPrimitive.Root modal={false} open={open} onOpenChange={onOpenChange}>
      <PopoverPrimitive.Anchor key={anchorVersion} virtualRef={anchorRef} />
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          asChild
          side="right"
          align="start"
          sideOffset={10}
          collisionPadding={8}
          sticky="always"
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            floatingRef.current?.focus({ preventScroll: true });
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            focusAnchor();
          }}
          onFocusOutside={(event) => {
            if (Date.now() - openedAtRef.current < 400) {
              event.preventDefault();
              return;
            }
            const target = event.target;
            if (
              target instanceof Element &&
              target.closest("[data-testid='target-filter-modal']")
            ) {
              event.preventDefault();
            }
          }}
          onPointerDownOutside={(event) => {
            if (Date.now() - openedAtRef.current < 400) {
              event.preventDefault();
              return;
            }
            const target = event.target;
            if (
              target instanceof Element &&
              target.closest("[data-testid='target-filter-modal']")
            ) {
              event.preventDefault();
            }
          }}
          onInteractOutside={(event) => {
            if (Date.now() - openedAtRef.current < 400) {
              event.preventDefault();
              return;
            }
            const target = event.target;
            if (
              target instanceof Element &&
              target.closest("[data-testid='target-filter-modal']")
            ) {
              event.preventDefault();
            }
          }}
        >
          {menuSurface}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

function DefaultCardContextIdentity({
  entity,
  mode,
  titleId,
}: CardContextMenuIdentityProps & { titleId: string }) {
  return (
    <div className={classes.identity}>
      <h2 id={titleId}>{entity.title}</h2>
      <p>
        <span>{entity.subtitle}</span>
        {entity.stats.map((stat) => (
          <span key={`${stat.label}:${stat.value}`} className={classes.headerStat}>
            {stat.label} <strong>{stat.value}</strong>
            {mode === "detailed" && stat.baseValue && stat.baseValue !== stat.value ? (
              <small>Printed {stat.baseValue}</small>
            ) : null}
            {mode === "detailed" && stat.detail ? <small>{stat.detail}</small> : null}
          </span>
        ))}
      </p>
    </div>
  );
}

function CardImageDialog({ entity, onClose }: { entity: SimulatorEntity; onClose: () => void }) {
  const dialogRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    closeButtonRef.current?.focus({ preventScroll: true });
  }, [onClose]);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (!focusable || focusable.length === 0) return;
    const first = focusable[0]!;
    const last = focusable[focusable.length - 1]!;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      event.stopPropagation();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      event.stopPropagation();
      first.focus();
    }
  };

  return createPortal(
    <div className={classes.previewDialogBackdrop} onPointerDown={onClose}>
      <section
        ref={dialogRef}
        className={classes.previewDialog}
        role="dialog"
        aria-modal="true"
        aria-label={`${entity.title} card image`}
        data-card-context-preview-dialog
        onPointerDown={(event) => event.stopPropagation()}
        onKeyDownCapture={handleKeyDown}
      >
        <header>
          <strong>{entity.title}</strong>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close card image"
            onClick={onClose}
          >
            <IconX size={18} aria-hidden="true" />
          </button>
        </header>
        <CardFace entity={entity} as="div" density="full" fill tabIndex={-1} />
      </section>
    </div>,
    document.body,
  );
}

function DetailedCardContext({
  entity,
  previewId,
  previewOpen,
  visualIdentity,
}: {
  entity: SimulatorEntity;
  previewId: string;
  previewOpen: boolean;
  visualIdentity?: CardContextMenuVisualIdentity;
}) {
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const rules = deduplicateCardRules(entity.details?.rules ?? []).filter(
    (rule) =>
      isMeaningfulPublicText(rule.text) ||
      (rule.label !== undefined && isMeaningfulPublicText(rule.label)),
  );
  const relationships = entity.details?.relationships ?? [];
  const visibleTags = [...entity.states, ...entity.traits].filter(
    (tag) => !entity.subtitle.toLocaleLowerCase().includes(tag.toLocaleLowerCase()),
  );
  const hasFacts =
    entity.stats.length > 0 ||
    visibleTags.length > 0 ||
    rules.length > 0 ||
    (entity.activeEffects?.length ?? 0) > 0 ||
    relationships.length > 0;
  const collapsibleDetails = rules.length > 1 || (entity.activeEffects?.length ?? 0) > 0;
  const visibleRules = detailsExpanded ? rules : rules.slice(0, 1);
  const activeEffectCount = entity.activeEffects?.length ?? 0;

  return (
    <section className={classes.details} aria-label="Card details">
      {previewOpen ? (
        <div id={previewId} className={classes.artPreview} data-card-context-preview>
          <CardFace entity={entity} as="div" density="full" tabIndex={-1} />
        </div>
      ) : null}
      <div className={classes.facts}>
        {!hasFacts ? <p className={classes.emptyDetails}>No additional public details.</p> : null}
        {visibleTags.length > 0 ? (
          <div className={classes.tags} aria-label="Card state and traits">
            {visibleTags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        ) : null}
        {visibleRules.length > 0 ? (
          <div
            className={classes.rules}
            aria-label="Rules and abilities"
            data-collapsed={collapsibleDetails && !detailsExpanded ? "true" : undefined}
          >
            {visibleRules.map((rule) => (
              <article key={rule.id} data-card-context-rule={rule.id}>
                {rule.label ? (
                  <div className={classes.ruleHeader}>
                    <strong data-card-context-rule-label>{rule.label}</strong>
                  </div>
                ) : null}
                {isMeaningfulPublicText(rule.text) ? (
                  <p data-card-context-rule-text>
                    {renderContextText(visualIdentity, rule.text, "rule")}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        ) : null}
        {detailsExpanded && activeEffectCount > 0 ? (
          <DetailGroup title="Active effects">
            <div className={classes.effects}>
              {entity.activeEffects?.map((effect) => (
                <article key={effect.id} data-tone={effect.tone}>
                  <strong>{effect.label}</strong>
                  <p>{renderContextText(visualIdentity, effect.detail, "active-effect")}</p>
                </article>
              ))}
            </div>
          </DetailGroup>
        ) : null}
        {collapsibleDetails ? (
          <button
            type="button"
            className={classes.detailsToggle}
            aria-expanded={detailsExpanded}
            data-card-context-details-toggle
            onClick={() => setDetailsExpanded((expanded) => !expanded)}
          >
            {detailsExpanded
              ? "Show less"
              : activeEffectCount > 0
                ? `Show full text and ${activeEffectCount} active ${
                    activeEffectCount === 1 ? "effect" : "effects"
                  }`
                : "Show full text"}
          </button>
        ) : null}
        {relationships.length > 0 ? (
          <DetailGroup title="Related cards">
            <div className={classes.relationships}>
              {relationships.map((relationship) => (
                <RelationshipChip key={relationship.id} relationship={relationship} />
              ))}
            </div>
          </DetailGroup>
        ) : null}
      </div>
    </section>
  );
}

function RelationshipChip({
  relationship,
}: {
  relationship: NonNullable<NonNullable<SimulatorEntity["details"]>["relationships"]>[number];
}) {
  const [expanded, setExpanded] = useState(false);
  const names = relationship.entityLabels?.map((entity) => entity.label) ?? [];
  const count = relationship.entityIds.length;
  const label = `${relationship.label}${count > 1 ? ` (${count})` : ""}`;
  const tooltip = names.length > 0 ? names.join(", ") : null;

  return (
    <button
      type="button"
      className={classes.relationshipChip}
      aria-expanded={tooltip ? expanded : undefined}
      aria-label={tooltip ? `${label}: ${tooltip}` : label}
      title={tooltip ?? undefined}
      onPointerEnter={() => {
        if (tooltip) setExpanded(true);
      }}
      onPointerLeave={() => setExpanded(false)}
      onFocus={() => {
        if (tooltip) setExpanded(true);
      }}
      onBlur={() => setExpanded(false)}
      onClick={() => {
        if (tooltip) setExpanded((current) => !current);
      }}
    >
      {label}
      {tooltip ? (
        <span className={classes.relationshipTooltip} role="tooltip">
          {tooltip}
        </span>
      ) : null}
    </button>
  );
}

function readablePublicText(value: string): string {
  return value.replace(/<br\s*\/?>/giu, "\n").replace(/\n{3,}/gu, "\n\n");
}

function isMeaningfulPublicText(value: string): boolean {
  const text = readablePublicText(value).trim();
  return text.length > 0 && !/^[-–—]+$/u.test(text);
}

function renderContextText(
  visualIdentity: CardContextMenuVisualIdentity | undefined,
  value: string,
  kind: CardContextMenuTextKind,
): ReactNode {
  const text = readablePublicText(value);
  return visualIdentity?.renderText?.({ text, kind }) ?? text;
}

function deduplicateCardRules(
  rules: NonNullable<SimulatorEntity["details"]>["rules"],
): NonNullable<SimulatorEntity["details"]>["rules"] {
  return rules.filter((rule, index) => {
    const ruleText = comparableRuleText(rule.text);
    if (!ruleText) return true;

    return !rules.some(
      (candidate, candidateIndex) =>
        candidateIndex !== index &&
        (() => {
          const candidateText = comparableRuleText(candidate.text);
          if (!candidateText) return false;
          if (candidateText === ruleText) return candidateIndex < index;
          return candidateText.length > ruleText.length && candidateText.includes(ruleText);
        })(),
    );
  });
}

function comparableRuleText(value: string): string {
  return readablePublicText(value)
    .replace(/([a-z])([A-Z])/gu, "$1 $2")
    .replace(/can't|cant/giu, "cannot")
    .replace(/this (?:card|unit) has |this unit /giu, "")
    .replace(/[^a-z0-9]+/giu, " ")
    .trim()
    .replace(/\s+/gu, " ");
}

function DetailGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={classes.detailGroup}>
      <h3>{title}</h3>
      {children}
    </section>
  );
}

export interface CardContextMenuApi {
  openFor(entityId: string, anchor: HTMLElement): boolean;
}

const CardContextMenuApiContext = createContext<CardContextMenuApi | null>(null);

export function useCardContextMenuApi(): CardContextMenuApi | null {
  return useContext(CardContextMenuApiContext);
}

export interface CardContextMenuControllerProps {
  children: ReactNode;
  entities: readonly SimulatorEntity[];
  actionsForEntity: (entityId: string) => readonly SimulatorCardAction[];
  /**
   * Optional subset used only for primary-click auto-activation. Context-only
   * actions remain discoverable through right-click / long-press without
   * turning a one-action card into a menu-first interaction.
   */
  autoActivationActionsForEntity?: (entityId: string) => readonly SimulatorCardAction[];
  mode: CardInteractionMode;
  stateVersion: number;
  promptActive?: boolean;
  /**
   * When true, a primary click on a card with exactly one enabled action
   * fires that action immediately instead of opening the menu.
   *
   * Inspection remains available via:
   * - right-click / context-menu key
   * - long-press (~450ms), so touch devices without reliable right-click can
   *   still open the full card surface before committing
   *
   * Multi-enabled cards always open the menu. Games with step-scoped single
   * responses (e.g. Gundam Block / Action) should enable this; games that
   * prefer menu-first clicks leave it off.
   */
  autoActivateSingleEnabledAction?: boolean;
  /**
   * Lets a game open the surface for hidden cards and dice when they expose
   * actions (board correction, face-down Call, gig edits). Public cards still
   * open even with an empty action list.
   */
  allowNonPublicEntities?: boolean;
  className?: string;
  onModeChange: (mode: CardInteractionMode) => void;
  onAction: (action: SimulatorCardAction, entity: SimulatorEntity) => void;
  onPreviewEntity?: (entity: SimulatorEntity, mode: "hover" | "pinned") => void;
  /** An entity id ends incidental hover; no id explicitly dismisses inspection. */
  onPreviewEnd?: (hoverEntityId?: string) => void;
  visualIdentity?: CardContextMenuVisualIdentity;
  layoutOverride?: ActiveLayout;
}

/**
 * Board-level delegated controller. It guarantees one surface for all card
 * implementations and yields card input to an active engine prompt.
 */
export function CardContextMenuController({
  children,
  entities,
  actionsForEntity,
  autoActivationActionsForEntity = actionsForEntity,
  mode,
  stateVersion,
  promptActive = false,
  autoActivateSingleEnabledAction = false,
  allowNonPublicEntities = false,
  className,
  onModeChange,
  onAction,
  onPreviewEntity,
  onPreviewEnd,
  visualIdentity,
  layoutOverride,
}: CardContextMenuControllerProps) {
  const entityMap = useMemo(
    () => new Map(entities.map((entity) => [entity.id, entity])),
    [entities],
  );
  const [selection, setSelection] = useState<{
    entityId: string;
    anchor: HTMLElement;
    anchorVersion: number;
    stateVersion: number;
  } | null>(null);
  const selectionRef = useRef(selection);
  selectionRef.current = selection;
  const promptActiveRef = useRef(promptActive);
  promptActiveRef.current = promptActive;
  const stateVersionRef = useRef(stateVersion);
  stateVersionRef.current = stateVersion;
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const pointerMoved = useRef(false);
  const longPressTimer = useRef<number | null>(null);
  /** Pointer that armed the long-press timer (active hold). */
  const longPressPointerId = useRef<number | null>(null);
  /** Set when long-press opened the menu so the synthetic follow-up click is ignored. */
  const suppressNextClick = useRef(false);
  /** Pointer that owns suppressNextClick; secondary clicks must not clear it. */
  const suppressOwnerPointerId = useRef<number | null>(null);
  /** True while the suppress-owning pointer is still down. */
  const suppressOwnerIsDown = useRef(false);
  const controllerRef = useRef<HTMLDivElement | null>(null);

  const clearClickSuppression = useCallback(() => {
    suppressNextClick.current = false;
    suppressOwnerPointerId.current = null;
    suppressOwnerIsDown.current = false;
  }, []);

  const close = useCallback(() => {
    // Drop stale suppression so keyboard activation after dismiss is not swallowed.
    clearClickSuppression();
    longPressPointerId.current = null;
    setSelection(null);
  }, [clearClickSuppression]);

  const clearLongPressTimer = useCallback(() => {
    if (longPressTimer.current === null) return;
    window.clearTimeout(longPressTimer.current);
    longPressTimer.current = null;
  }, []);

  useEffect(() => () => clearLongPressTimer(), [clearLongPressTimer]);

  useEffect(() => {
    const root = controllerRef.current;
    if (!root) return undefined;
    const managed = new Set<HTMLElement>();
    const releaseManagedCard = (element: HTMLElement) => {
      if (element.dataset.cardContextManagedTabindex === "true") {
        element.removeAttribute("tabindex");
        delete element.dataset.cardContextManagedTabindex;
      }
      if (element.dataset.cardContextManagedRole === "true") {
        element.removeAttribute("role");
        delete element.dataset.cardContextManagedRole;
      }
      if (element.dataset.cardContextManagedHaspopup === "true") {
        element.removeAttribute("aria-haspopup");
        delete element.dataset.cardContextManagedHaspopup;
      }
      managed.delete(element);
    };
    const syncManagedCards = () => {
      for (const element of root.querySelectorAll<HTMLElement>(CARD_SELECTOR)) {
        const entityId = element.dataset.simEntityId;
        const candidate = entityId ? entityMap.get(entityId) : undefined;
        if (!candidate || candidate.face === "hidden") {
          releaseManagedCard(element);
          continue;
        }

        // A zone may already wrap the card face in its own action button
        // (for example, a playable hand card). Managing the nested face too
        // creates two consecutive focus stops for the same card. Passive card
        // faces, however, own the menu trigger and need complete button
        // semantics rather than a focusable generic element.
        const interactiveAncestor = element.parentElement?.closest<HTMLElement>(
          "button, a[href], input, select, textarea, [role='button'], [tabindex]",
        );
        if (interactiveAncestor && root.contains(interactiveAncestor)) {
          releaseManagedCard(element);
          continue;
        }

        if (!element.hasAttribute("tabindex")) {
          element.tabIndex = 0;
          element.dataset.cardContextManagedTabindex = "true";
        }
        if (
          !element.matches("button, a[href], input, select, textarea") &&
          !element.hasAttribute("role")
        ) {
          element.setAttribute("role", "button");
          element.dataset.cardContextManagedRole = "true";
        }
        if (!element.hasAttribute("aria-haspopup")) {
          element.setAttribute("aria-haspopup", "dialog");
          element.dataset.cardContextManagedHaspopup = "true";
        }
        managed.add(element);
      }
    };
    syncManagedCards();
    const observer = new MutationObserver(syncManagedCards);
    observer.observe(root, {
      attributeFilter: ["role", "tabindex"],
      attributes: true,
      childList: true,
      subtree: true,
    });
    return () => {
      observer.disconnect();
      for (const element of managed) releaseManagedCard(element);
    };
  }, [entityMap]);

  useEffect(() => {
    if (!selection) return undefined;
    const root = controllerRef.current;
    if (!root) return undefined;
    let closeTimer: number | null = null;

    const refreshAnchor = () => {
      const current = selectionRef.current;
      if (!current || current.entityId !== selection.entityId) return;
      if (isLiveCardAnchor(root, current.anchor, current.entityId)) return;
      const replacement = findLiveCardAnchor(root, current.entityId, current.anchor);
      if (replacement) {
        if (closeTimer !== null) {
          window.clearTimeout(closeTimer);
          closeTimer = null;
        }
        setSelection((latest) =>
          latest && latest.entityId === current.entityId
            ? { ...latest, anchor: replacement, anchorVersion: latest.anchorVersion + 1 }
            : latest,
        );
      } else if (closeTimer === null) {
        closeTimer = window.setTimeout(() => {
          closeTimer = null;
          const latest = selectionRef.current;
          if (!latest || latest.entityId !== current.entityId) return;
          const lateReplacement = findLiveCardAnchor(root, latest.entityId, latest.anchor);
          if (lateReplacement) {
            setSelection((value) =>
              value && value.entityId === latest.entityId
                ? {
                    ...value,
                    anchor: lateReplacement,
                    anchorVersion: value.anchorVersion + 1,
                  }
                : value,
            );
            return;
          }
          setSelection(null);
        }, 0);
      }
    };

    refreshAnchor();
    const observer = new MutationObserver(refreshAnchor);
    observer.observe(root, { childList: true, subtree: true });
    window.addEventListener("resize", refreshAnchor);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", refreshAnchor);
      if (closeTimer !== null) window.clearTimeout(closeTimer);
    };
  }, [selection?.entityId]);

  useEffect(() => {
    if (!selection) return;
    const entity = entityMap.get(selection.entityId);
    if (
      !entity ||
      (!allowNonPublicEntities && entity.face === "hidden") ||
      selection.stateVersion !== stateVersion ||
      promptActive
    ) {
      close();
    }
  }, [allowNonPublicEntities, close, entityMap, promptActive, selection, stateVersion]);

  const resolveCard = useCallback(
    (target: EventTarget | null): { entity: SimulatorEntity; element: HTMLElement } | null => {
      if (!(target instanceof Element)) return null;
      const element = target.closest<HTMLElement>(CARD_SELECTOR);
      if (!element) return null;
      const entityId = element.dataset.simEntityId;
      const entity = entityId ? entityMap.get(entityId) : undefined;
      if (!entity || entity.kind === "token") {
        return null;
      }
      const isPublicCard = entity.face === "public" && entity.kind !== "die";
      if (!isPublicCard && !allowNonPublicEntities) {
        return null;
      }
      if (!isPublicCard && actionsForEntity(entity.id).length === 0) {
        return null;
      }
      return { entity, element };
    },
    [actionsForEntity, allowNonPublicEntities, entityMap],
  );

  const openForTarget = useCallback(
    (target: EventTarget | null) => {
      const resolved = resolveCard(target);
      if (!resolved) return false;
      if (visualIdentity?.dismissPreviewOnOpen) onPreviewEnd?.();
      setSelection({
        entityId: resolved.entity.id,
        anchor: resolved.element,
        anchorVersion: 0,
        // Async long-press must stamp the latest state version, not the
        // render that armed the timer.
        stateVersion: stateVersionRef.current,
      });
      return true;
    },
    [onPreviewEnd, resolveCard, visualIdentity?.dismissPreviewOnOpen],
  );

  /**
   * When a card exposes exactly one enabled action, primary click fires it
   * immediately. This matches step-scoped response windows (e.g. Block Step
   * Blocker, Action Step Commands) where the only legal choice is "do this
   * action" — the player should not need a second menu pick.
   *
   * Right-click / long-press still open the full surface so players can
   * inspect card details or choose among multiple actions. Multi-enabled
   * cards always open the menu.
   */
  const tryAutoActivate = useCallback(
    (target: EventTarget | null): boolean => {
      if (!autoActivateSingleEnabledAction) return false;
      const resolved = resolveCard(target);
      if (!resolved) return false;
      const enabled = leafCardActions(autoActivationActionsForEntity(resolved.entity.id)).filter(
        (action) => action.availability.kind === "enabled",
      );
      if (enabled.length !== 1) return false;
      onAction(enabled[0]!, resolved.entity);
      return true;
    },
    [autoActivationActionsForEntity, autoActivateSingleEnabledAction, onAction, resolveCard],
  );

  const handleClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (promptActiveRef.current) return;
    if (
      event.target instanceof Element &&
      event.target.closest(PRIMARY_CLICK_ZONE_OWNER_SELECTOR)
    ) {
      const zoneOwner = event.target.closest(PRIMARY_CLICK_ZONE_OWNER_SELECTOR);
      if (zoneOwner?.matches(EXCLUSIVE_PRIMARY_CLICK_ZONE_OWNER_SELECTOR)) return;
      const resolved = resolveCard(event.target);
      if (!resolved || actionsForEntity(resolved.entity.id).length === 0) return;
    }
    if (suppressNextClick.current) {
      // Secondary-finger clicks (while the long-press owner is still down) must
      // be swallowed without clearing suppress — otherwise reverse lift order
      // auto-activates when the owner finally releases.
      if (suppressOwnerIsDown.current) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      clearClickSuppression();
      longPressPointerId.current = null;
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (pointerMoved.current) {
      pointerMoved.current = false;
      return;
    }
    if (tryAutoActivate(event.target)) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (!openForTarget(event.target)) return;
    event.preventDefault();
    event.stopPropagation();
  };

  const handleContextMenu = (event: MouseEvent<HTMLDivElement>) => {
    clearLongPressTimer();
    if (promptActiveRef.current || !openForTarget(event.target)) return;
    event.preventDefault();
    event.stopPropagation();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (promptActiveRef.current) return;
    if (
      (event.key === "Enter" || event.key === " ") &&
      event.target instanceof HTMLElement &&
      event.target.dataset.cardContextManagedRole === "true"
    ) {
      if (!tryAutoActivate(event.target) && !openForTarget(event.target)) return;
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (event.key !== "ContextMenu" && !(event.shiftKey && event.key === "F10")) return;
    if (!openForTarget(event.target)) return;
    event.preventDefault();
    event.stopPropagation();
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    // While a primary finger owns the long-press gesture, ignore extra pointers
    // so they cannot clear suppressNextClick or cancel the timer mid-hold.
    if (longPressPointerId.current !== null && event.pointerId !== longPressPointerId.current) {
      return;
    }
    // While the long-press owner is still down, ignore secondary pointers so
    // they cannot clear suppress mid-hold. Once the owner lifts (and if the
    // browser never fires a synthetic click), any new primary gesture clears
    // the orphaned suppress below and proceeds.
    if (
      suppressNextClick.current &&
      suppressOwnerIsDown.current &&
      suppressOwnerPointerId.current !== null &&
      event.pointerId !== suppressOwnerPointerId.current
    ) {
      return;
    }

    pointerStart.current = { x: event.clientX, y: event.clientY };
    pointerMoved.current = false;
    // Fresh primary gesture: clear any prior suppress (including orphaned
    // suppress after a no-click long-press on a different pointer id).
    clearClickSuppression();
    clearLongPressTimer();

    // Long-press is the touch-accessible inspection path when primary taps
    // auto-activate a single enabled action. Mouse users can right-click;
    // long-press still works for pen/trackpad consistency.
    if (!autoActivateSingleEnabledAction || promptActiveRef.current) {
      longPressPointerId.current = null;
      return;
    }
    if (event.button !== 0) {
      longPressPointerId.current = null;
      return;
    }
    if (!resolveCard(event.target)) {
      longPressPointerId.current = null;
      return;
    }

    longPressPointerId.current = event.pointerId;
    longPressTimer.current = window.setTimeout(() => {
      longPressTimer.current = null;
      if (pointerMoved.current || promptActiveRef.current) return;
      if (!openForTarget(event.target)) return;
      // Owner-pointer suppress: keep until that pointer releases and its
      // follow-up click is swallowed (secondary clicks must not clear it).
      suppressNextClick.current = true;
      suppressOwnerPointerId.current = event.pointerId;
      suppressOwnerIsDown.current = true;
    }, AUTO_ACTIVATE_LONG_PRESS_MS);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (longPressPointerId.current !== null && event.pointerId !== longPressPointerId.current) {
      return;
    }
    const start = pointerStart.current;
    if (!start) return;
    if (
      Math.abs(event.clientX - start.x) > DRAG_CLICK_THRESHOLD_PX ||
      Math.abs(event.clientY - start.y) > DRAG_CLICK_THRESHOLD_PX
    ) {
      pointerMoved.current = true;
      clearLongPressTimer();
    }
  };

  const handlePointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    if (suppressOwnerPointerId.current === event.pointerId) {
      suppressOwnerIsDown.current = false;
    }
    if (longPressPointerId.current !== null && event.pointerId !== longPressPointerId.current) {
      return;
    }
    clearLongPressTimer();
    // Release timer ownership so the next primary gesture can proceed.
    // suppressNextClick (if set) still blocks the synthetic click once.
    longPressPointerId.current = null;
  };

  const openFor = useCallback(
    (entityId: string, anchor: HTMLElement) => {
      if (promptActiveRef.current) return false;
      const candidate = entityMap.get(entityId);
      if (!candidate) return false;
      const isPublicCard = candidate.face === "public" && candidate.kind !== "die";
      if (!isPublicCard && !allowNonPublicEntities) return false;
      if (visualIdentity?.dismissPreviewOnOpen) onPreviewEnd?.();
      setSelection({
        entityId,
        anchor,
        anchorVersion: 0,
        stateVersion: stateVersionRef.current,
      });
      return true;
    },
    [allowNonPublicEntities, entityMap, onPreviewEnd, visualIdentity?.dismissPreviewOnOpen],
  );
  const api = useMemo<CardContextMenuApi>(() => ({ openFor }), [openFor]);

  const entity = selection ? entityMap.get(selection.entityId) : undefined;
  const actions = entity ? actionsForEntity(entity.id) : [];

  return (
    <CardContextMenuApiContext.Provider value={api}>
      <div
        ref={controllerRef}
        className={className}
        data-card-context-controller
        style={{ display: "contents" }}
        onClickCapture={handleClickCapture}
        onContextMenuCapture={handleContextMenu}
        onKeyDownCapture={handleKeyDown}
        onPointerDownCapture={handlePointerDown}
        onPointerMoveCapture={handlePointerMove}
        onPointerUpCapture={handlePointerEnd}
        onPointerCancelCapture={handlePointerEnd}
      >
        {children}
        {entity && selection ? (
          <CardContextMenu
            entity={entity}
            actions={actions}
            mode={mode}
            open
            anchorElement={selection.anchor}
            anchorVersion={selection.anchorVersion}
            onModeChange={onModeChange}
            onOpenChange={(nextOpen) => {
              if (!nextOpen) close();
            }}
            onAction={(action) => onAction(action, entity)}
            onPreviewEntity={onPreviewEntity}
            onPreviewEnd={onPreviewEnd}
            visualIdentity={visualIdentity}
            layoutOverride={layoutOverride}
          />
        ) : null}
      </div>
    </CardContextMenuApiContext.Provider>
  );
}

type CardContextActionRow = {
  action: SimulatorCardAction;
  depth: 0 | 1;
  role: "item" | "submenu";
};

function sortCardActions(actions: readonly SimulatorCardAction[]): SimulatorCardAction[] {
  return [...actions].sort(
    (left, right) => left.order - right.order || left.id.localeCompare(right.id),
  );
}

function actionChildren(action: SimulatorCardAction): readonly SimulatorCardAction[] {
  return action.children ?? [];
}

function actionGroupIsEnabled(action: SimulatorCardAction): boolean {
  const children = actionChildren(action);
  if (children.length === 0) return action.availability.kind === "enabled";
  return children.some((child) => child.availability.kind === "enabled");
}

function enabledLeafActionCount(action: SimulatorCardAction): number {
  const children = actionChildren(action);
  if (children.length === 0) return action.availability.kind === "enabled" ? 1 : 0;
  return children.filter((child) => child.availability.kind === "enabled").length;
}

function leafCardActions(actions: readonly SimulatorCardAction[]): SimulatorCardAction[] {
  return actions.flatMap((action) => {
    const children = actionChildren(action);
    return children.length > 0 ? [...children] : [action];
  });
}

function flattenVisibleActionRows(
  actions: readonly SimulatorCardAction[],
  expandedActionId: string | null,
  hideDisabledChildren: boolean,
): CardContextActionRow[] {
  const rows: CardContextActionRow[] = [];
  for (const action of actions) {
    const children = sortCardActions(actionChildren(action)).filter((child) =>
      hideDisabledChildren ? child.availability.kind === "enabled" : true,
    );
    if (children.length > 0) {
      rows.push({ action, depth: 0, role: "submenu" });
      if (expandedActionId === action.id) {
        for (const child of children) {
          rows.push({ action: child, depth: 1, role: "item" });
        }
      }
      continue;
    }
    rows.push({ action, depth: 0, role: "item" });
  }
  return rows;
}

function isLiveCardAnchor(root: HTMLElement, element: HTMLElement, entityId: string): boolean {
  return (
    element.isConnected &&
    element.dataset.simEntityId === entityId &&
    isEligibleCardAnchor(element) &&
    (root.contains(element) || Boolean(element.closest("[data-testid='target-filter-modal']")))
  );
}

function findLiveCardAnchor(
  root: HTMLElement,
  entityId: string,
  previous: HTMLElement,
): HTMLElement | null {
  const scopes = [root, document.body];
  const candidates = [
    ...new Set(
      scopes.flatMap((scope) =>
        [...scope.querySelectorAll<HTMLElement>(CARD_SELECTOR)].filter(
          (element) => element.dataset.simEntityId === entityId && isEligibleCardAnchor(element),
        ),
      ),
    ),
  ];
  return (
    candidates.find((element) => element === previous) ??
    candidates.find((element) => element.closest("[data-testid='target-filter-modal']")) ??
    candidates.find(
      (element) =>
        element.tagName === previous.tagName &&
        element.getAttribute("role") === previous.getAttribute("role"),
    ) ??
    candidates.find((element) => element.matches("button, [role='button']")) ??
    candidates[0] ??
    null
  );
}

function isEligibleCardAnchor(element: HTMLElement): boolean {
  return (
    !element.closest("[aria-hidden='true']") &&
    !element.closest("[data-card-context-menu]") &&
    !element.closest("[data-testid='card-hover-preview']") &&
    !element.closest("[role='log']")
  );
}
