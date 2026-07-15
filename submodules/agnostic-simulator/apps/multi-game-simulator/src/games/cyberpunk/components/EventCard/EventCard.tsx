import { Badge, Box, Button, Group, Progress, Stack, Text } from "@mantine/core";
import classes from "./EventCard.module.css";

interface EventCardProps {
  title: string;
  description: string;
  timeLeft: string;
  walletBalance: number;
  progress: { current: number; max: number };
  caps: { daily: number; weekly: number; total: number };
  remaining: { today: number; thisWeek: number; thisEvent: number };
  featuredPrize: string;
  enrolled?: boolean;
  onJoin?: () => void;
}

export function EventCard({
  title,
  description,
  timeLeft,
  walletBalance,
  progress,
  caps,
  remaining,
  featuredPrize,
  enrolled,
  onJoin,
}: EventCardProps) {
  const pct = Math.round((progress.current / progress.max) * 100);

  return (
    <Box className={classes.card}>
      {/* Header */}
      <Group justify="space-between" mb={10}>
        <Group gap={6}>
          <Text className={classes.eyebrow}>EVENTS &amp; REWARDS</Text>
          <Badge size="xs" variant="light" color="yellow" className={classes.timeBadge}>
            {timeLeft}
          </Badge>
        </Group>
        <Badge size="sm" variant="outline" color="gray" leftSection="🔗">
          Wallet {walletBalance}
        </Badge>
      </Group>

      <Stack gap={6}>
        {/* Title + description */}
        <div>
          <Text className={classes.title}>{title}</Text>
          <Text className={classes.description}>{description}</Text>
        </div>

        {/* Progress — only when enrolled */}
        {enrolled && (
          <div>
            <Group justify="space-between" mb={4}>
              <Text className={classes.statLabel}>
                {progress.current}/{progress.max} this week
              </Text>
              <Text className={classes.statLabel}>{pct}%</Text>
            </Group>
            <Progress value={pct} size="xs" color="yellow" />
          </div>
        )}

        {/* Caps — only when enrolled */}
        {enrolled && (
          <Group gap={4} wrap="nowrap">
            <CapStat label="Today" used={caps.daily - remaining.today} cap={caps.daily} />
            <Text c="dimmed" size="xs">
              ·
            </Text>
            <CapStat label="Week" used={caps.weekly - remaining.thisWeek} cap={caps.weekly} />
            <Text c="dimmed" size="xs">
              ·
            </Text>
            <CapStat label="Event" used={caps.total - remaining.thisEvent} cap={caps.total} />
          </Group>
        )}

        {/* Prize */}
        <Text className={classes.prize}>{featuredPrize} is the current featured prize.</Text>

        {/* CTA — only when not enrolled */}
        {!enrolled && (
          <Button fullWidth size="xs" variant="filled" color="yellow" onClick={onJoin}>
            Join event
          </Button>
        )}
      </Stack>
    </Box>
  );
}

function CapStat({ label, used, cap }: { label: string; used: number; cap: number }) {
  return (
    <Text size="xs" c="dimmed">
      <Text span size="xs" c="dimmed" fw={500}>
        {label}{" "}
      </Text>
      <Text span size="xs" c={used >= cap ? "yellow.6" : "dimmed"}>
        {used}/{cap}
      </Text>
    </Text>
  );
}
