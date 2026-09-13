/**
 * Minimal print-and-play seeds used by the legal-deck generator. The runner
 * pads these lists to 40 cards while enforcing RAM and copy limits.
 */
export const deckLists: string[] = [
  `Legends
1 Alt Cunningham — Soulkiller Architect
1 Goro Takemura — Vengeful Bodyguard
1 Adam Smasher — Ender of Legends

Main Deck
3 Corpo Security
3 Delamain Cab
3 Minotaur`,
  `Legends
1 Dum Dum — Maelstrom Triggerman
1 Sasha Yakovleva — Won't Let You Down
1 Royce — Psycho on the Edge

Main Deck
3 Secondhand Bombus
3 Mox Inciters
3 6th Street Recruits`,
];

/**
 * Publisher-authored Welcome to Night City retail starter decks. These are
 * complete, legal player decks rather than the compact generator seeds above.
 * Keep the quantities aligned with the official published decklists:
 * https://cyberpunktcg.com/blog/wnc-starter-decks
 */
export const starterDeckLists: string[] = [
  `Embracing Power — Retail Starter Deck

Legends
1 Goro Takemura — Hands Unclean
1 Yorinobu Arasaka — Embracing Destruction
1 Saburo Arasaka — Stubborn Patriarch

Main Deck (40)
2 Chrome Fang
2 Minotaur
3 Ruthless Lowlife
2 Swordwise Huscle
2 Emergency Atlus
2 Field Operator
2 Goro Takemura — Losing His Way
2 MaxTac AV
2 Arasaka Emergency Radioport
3 Mantis Blades
3 Satori — Sword of Saburo
2 Industrial Assembly
2 Over the Edge
2 Shattered Memories
3 Corpo Security
3 Sandevistan
3 Corporate Surveillance`,
  `The Heist — Retail Starter Deck

Legends
1 V — Corporate Exile
1 Viktor Vektor — Sit Down and Relax
1 Jackie Welles — Pour One Out For Me

Main Deck (40)
2 Dexter DeShawn — One Last Chance
2 Heywood Ripperdoc
2 Offduty Malfini
2 Secondhand Bombus
2 T-Bug — Amateur Philosopher
3 Kiroshi Optics
3 Mandibular Upgrade
3 Zetatech Faceplate
2 Afterparty at Lizzie's
3 Delamain Cab
3 Evelyn Parker — Scheming Siren
2 MT0D12 Flathead
2 Psycho Squad
2 Dying Night — V's Pistol
2 Tetratronic Rippler
3 Floor It
2 Reboot Optics`,
];
