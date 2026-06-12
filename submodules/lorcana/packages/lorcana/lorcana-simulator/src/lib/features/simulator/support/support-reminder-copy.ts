export const SIMULATOR_SUPPORT_REMINDER_VARIANTS = [
  "Found a rough edge? We'd love to hear about it.",
  "Something felt off? A quick note helps a lot.",
  "Spotted a bug? You can report it right from the table.",
  "Have an idea to make this smoother? Tell us.",
  "If something confused you, that's useful feedback too.",
  "Saw a weird interaction? Send it our way.",
  "A tiny bug report can save someone else's game.",
  "Got feedback while it's fresh? We'd really like it.",
  "If the simulator tripped you up, let us know.",
  "Noticed friction? A short message helps us improve fast.",
  "Something missing or awkward? Share it with us.",
  "If a click felt wrong, that's feedback worth sending.",
] as const;

export type SimulatorSupportReminderCopy = (typeof SIMULATOR_SUPPORT_REMINDER_VARIANTS)[number];
