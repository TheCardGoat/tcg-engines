import { Tooltip } from "@mantine/core";
import { CardFace } from "@tcg/simulator-ui";
import { Flag, Sword, Target, Undo2 } from "lucide-react";
import { useCallback, useRef, type ComponentProps } from "react";
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

export function GrandArchiveRoleCard({ entity, ...props }: ComponentProps<typeof CardFace>) {
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
    <div className="ga-role-card" data-fill={props.fill || undefined}>
      <CardFace
        {...props}
        ref={cardRef}
        entity={{
          ...entity,
          // Visual role badges live outside CardFace; retain their labels in
          // the card button's accessible name when removing the decorations.
          accessibilityDescription: [
            entity.accessibilityDescription,
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
