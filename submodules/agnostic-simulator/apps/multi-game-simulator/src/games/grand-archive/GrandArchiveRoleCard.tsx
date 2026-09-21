import { grandArchiveActionSummary, useGrandArchiveCardActions } from "./GrandArchiveCardActions";
import { Tooltip } from "@mantine/core";
import { CardFace } from "@tcg/simulator-ui";
import { Flag, Sword, Target, Undo2 } from "lucide-react";
import { useCallback, useRef, type CSSProperties, type ComponentProps } from "react";
import { GrandArchiveCounters, isGrandArchiveCounter } from "./GrandArchiveCounters";

const ROLE_BADGES = {
  "combat:attacker": { Icon: Sword, label: "Attacker", explanation: "Initiated this attack." },
  "combat:target": { Icon: Target, label: "Target", explanation: "Targeted by this attack." },
  "combat:retaliator": {
    Icon: Undo2,
    label: "Retaliator",
    explanation: "Chosen to retaliate against the attacker.",
  },
  "combat:weapon": { Icon: Sword, label: "Weapon", explanation: "Wielded for this attack." },
  "combat:intent": { Icon: Flag, label: "Intent", explanation: "Included in this attack." },
} as const;

function isCombatRole(id: string): id is keyof typeof ROLE_BADGES {
  return Object.hasOwn(ROLE_BADGES, id);
}

export function GrandArchiveRoleCard({
  entity,
  attackRole,
  ...props
}: ComponentProps<typeof CardFace> & {
  attackRole?: "source" | "candidate" | "target";
}) {
  const actions = useGrandArchiveCardActions(entity.id);
  const actionable =
    (entity.face === "public" || Boolean(props.accessibleLabel)) &&
    props.as !== "div" &&
    actions.length > 0;
  const actionSummary = grandArchiveActionSummary(actions);
  const cardRef = useRef<HTMLButtonElement>(null);
  const restoreCardFocus = useCallback(() => cardRef.current?.focus(), []);
  const inspectable = props.as !== "div" && !props.targetable && !props.selected;
  const counters =
    entity.face === "public" ? (entity.decorations ?? []).filter(isGrandArchiveCounter) : [];
  const primaryCounter =
    counters.find((counter) => counter.id === "ga:counter:damage") ?? counters[0];
  const badges =
    entity.face === "public"
      ? (entity.decorations ?? []).flatMap((decoration) => {
          const badge = isCombatRole(decoration.id) ? ROLE_BADGES[decoration.id] : undefined;
          return badge ? [{ ...badge, id: decoration.id, tone: decoration.tone }] : [];
        })
      : [];
  return (
    <div
      className="ga-role-card"
      style={{ "--ga-board-aspect-ratio": entity.imageAspectRatio ?? 1 } as CSSProperties}
      data-fill={props.fill || undefined}
      data-art-only={
        (entity.face === "public" && entity.dataAttributes?.["data-ga-art-only"] === true) ||
        undefined
      }
      data-actionable={actionable || undefined}
      data-attack-role={attackRole}
    >
      <CardFace
        {...props}
        ref={cardRef}
        highlighted={props.highlighted || actionable}
        entity={{
          ...entity,
          // Visual role badges live outside CardFace; retain their labels in
          // the card button's accessible name when removing the decorations.
          accessibilityDescription: [
            entity.accessibilityDescription,
            actionable ? `Available: ${actionSummary}` : undefined,
            attackRole === "source"
              ? "Selected attacker"
              : attackRole === "target"
                ? "Selected defender"
                : attackRole === "candidate"
                  ? "Available attack target"
                  : undefined,
            ...(entity.decorations ?? [])
              .filter(
                (decoration) =>
                  (isGrandArchiveCounter(decoration) &&
                    (inspectable || decoration !== primaryCounter)) ||
                  badges.some((badge) => badge.id === decoration.id),
              )
              .map((decoration) => decoration.ariaLabel),
          ]
            .filter(Boolean)
            .join(", "),
          decorations: entity.decorations?.filter(
            (decoration) =>
              (!isGrandArchiveCounter(decoration) ||
                (!inspectable && decoration === primaryCounter)) &&
              !badges.some((badge) => badge.id === decoration.id),
          ),
        }}
      />
      {entity.face === "public" && entity.dataAttributes?.["data-ga-art-only"] === true ? (
        <div className="ga-role-card__art-caption" aria-hidden="true">
          <span>{entity.title}</span>
          {entity.stats.length ? (
            <small>{entity.stats.map((stat) => `${stat.label}: ${stat.value}`).join(" · ")}</small>
          ) : null}
        </div>
      ) : null}
      {attackRole ? (
        <span className="ga-role-card__attack-label" aria-hidden="true">
          {attackRole === "source" ? <Sword size={12} /> : <Target size={12} />}
          {attackRole === "source"
            ? "Attacker"
            : attackRole === "target"
              ? "Defender"
              : "Attack target"}
        </span>
      ) : null}
      {actionable ? (
        <span className="ga-role-card__actions" aria-hidden="true">
          {actionSummary}
        </span>
      ) : null}
      {inspectable && counters.length ? (
        <GrandArchiveCounters
          key={`${entity.id}:${entity.dataAttributes?.["data-incarnation"]}:${entity.face}`}
          onUnmountFocus={restoreCardFocus}
          title={entity.title}
          temporaryDamage={entity.dataAttributes?.["data-damage-lifetime"] === "end-phase"}
          counters={counters}
        />
      ) : null}
      <div className="ga-role-card__badges">
        {badges.map(({ id, Icon, label, explanation, tone }) => (
          <Tooltip
            key={id}
            label={`${label} · ${explanation}`}
            withArrow
            multiline
            w={220}
            events={{ hover: true, focus: true, touch: true }}
          >
            <span
              className="ga-role-card__badge"
              data-role={id}
              data-tone={tone}
              tabIndex={0}
              aria-label={`Combat role: ${label.toLowerCase()}`}
            >
              <Icon size={13} aria-hidden="true" />
            </span>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
