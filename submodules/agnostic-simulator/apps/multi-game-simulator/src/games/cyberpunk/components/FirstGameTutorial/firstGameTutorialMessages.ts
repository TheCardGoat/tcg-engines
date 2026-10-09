export const tutorialLocales = ["en", "fr", "de", "es", "it", "pt-br"] as const;
export type TutorialLocale = (typeof tutorialLocales)[number];

export type TutorialStepId =
  | "cards"
  | "settings"
  | "report"
  | "payment"
  | "priority"
  | "bug"
  | "correction"
  | "undo";

interface TutorialStepCopy {
  title: string;
  desktop: string;
  mobile: string;
}

export interface TutorialCopy {
  label: string;
  step: (current: number, total: number) => string;
  back: string;
  next: string;
  finish: string;
  skip: string;
  replay: string;
  minimize: string;
  restore: string;
  steps: Record<TutorialStepId, TutorialStepCopy>;
}

export const tutorialStepIds: readonly TutorialStepId[] = [
  "cards",
  "settings",
  "report",
  "payment",
  "priority",
  "bug",
  "correction",
  "undo",
];

export const firstGameTutorialMessages: Record<TutorialLocale, TutorialCopy> = {
  en: {
    label: "Your first game",
    step: (current, total) => `Step ${current} of ${total}`,
    back: "Back",
    next: "Next",
    finish: "Finish guide",
    skip: "Skip guide",
    replay: "Show first-game guide",
    minimize: "Minimize guide",
    restore: "Restore guide",
    steps: {
      cards: {
        title: "Move your cards",
        desktop:
          "Click a card to see what you can do. You can also drag a card to a highlighted area, such as your Eddies or field. Only moves allowed now will work.",
        mobile:
          "Tap a card to see what you can do. You can also drag it to a highlighted area. If dragging is hard, use the card actions instead.",
      },
      settings: {
        title: "Change your game settings",
        desktop:
          "Open the menu beside your name. Choose Settings, then the Game tab. You can change how cards and dice look without leaving the game.",
        mobile:
          "In this practice game, tap More at the top left, then Details, Settings, and the Game tab. In a live match, tap your name at the bottom left to find Settings.",
      },
      report: {
        title: "Report a player",
        desktop:
          "In a live match, open the menu beside your Rival's name in this area and choose Report player. This practice Rival is a bot. Nothing is sent until you submit the form.",
        mobile:
          "In a live match, tap your Rival's name at the top right, then Report player. This practice game has no player to report. Nothing is sent until you submit the form.",
      },
      payment: {
        title: "Choose how to pay",
        desktop:
          "Select the coin button beside your name to choose which Eddies or Legends pay each cost. Select it again to return to automatic payment.",
        mobile:
          "Tap the coin button at the top left to choose which Eddies or Legends pay each cost. Tap it again for automatic payment.",
      },
      priority: {
        title: "Keep time to respond",
        desktop:
          "Select the hand button beside your name to hold your response window when your Rival attacks. Select it again, or press Pass, when you are ready to continue.",
        mobile:
          "Tap the hand button at the top left to keep your response window open when your Rival attacks. Tap it again, or tap Pass, to continue.",
      },
      bug: {
        title: "The game can fail",
        desktop:
          "The game can fail. Open the menu beside your name and choose Report bug so we can fix it. Always send a report when something breaks. This is separate from Report player. Nothing is sent until you submit the form.",
        mobile:
          "The game can fail. In a live match, tap your name at the bottom left and choose Report bug so we can fix it. Always send a report when something breaks. This is separate from Report player. Nothing is sent until you submit the form.",
      },
      correction: {
        title: "Correct the board",
        desktop:
          "If a bug happens in the middle of a match, you can correct the board. In local practice, open the menu beside your name and choose Enable Board State Correction. It turns on without a person accepting. In a hosted match against a bot, open that same menu and choose Request Board State Correction…. It turns on without a person accepting. Against a human, choose Request Board State Correction… and both of you can edit only after it is accepted. Click cards, attached gear, the deck, trash, Gigs, and Eddies, then choose Exit.",
        mobile:
          "If a bug happens in the middle of a match, you can correct the board. In this practice game, tap More at the top left, then Details, and choose Enable Board State Correction. It turns on without a person accepting. In a hosted match against a bot, tap More at the top left, then Details, and choose Request Board State Correction…. It turns on without a person accepting. Against a human, tap your name at the bottom left and choose Request Board State Correction… and both of you can edit only after it is accepted. Tap cards, attached gear, the deck, trash, Gigs, and Eddies, then choose Exit.",
      },
      undo: {
        title: "Undo a move",
        desktop:
          "Choose Undo last move to put back the latest undoable action. Open the menu beside your name and choose Undo to turn start to return play to the start of the current turn. In a ranked live match the opponent must accept. In other matches the undo applies without asking.",
        mobile:
          "Tap Undo at the bottom to use Undo last move and put back the latest undoable action. In this practice game, or in a hosted match against a bot, tap More at the top left, then Details, and choose Undo to turn start to return play to the start of the current turn. Against a human, tap your name at the bottom left and choose Undo to turn start. In a ranked live match the opponent must accept. In other matches the undo applies without asking.",
      },
    },
  },
  fr: {
    label: "Votre première partie",
    step: (current, total) => `Étape ${current} sur ${total}`,
    back: "Retour",
    next: "Suivant",
    finish: "Terminer le guide",
    skip: "Passer le guide",
    replay: "Voir le guide de première partie",
    minimize: "Réduire le guide",
    restore: "Afficher le guide",
    steps: {
      cards: {
        title: "Déplacez vos cartes",
        desktop:
          "Cliquez sur une carte pour voir vos actions. Vous pouvez aussi la glisser vers une zone en surbrillance, comme vos Eddies ou votre terrain. Seules les actions autorisées fonctionnent.",
        mobile:
          "Touchez une carte pour voir vos actions. Vous pouvez aussi la glisser vers une zone en surbrillance. Si le geste est difficile, utilisez les actions de la carte.",
      },
      settings: {
        title: "Réglez votre partie",
        desktop:
          "Ouvrez le menu près de votre nom. Choisissez Settings, puis l'onglet Game. Vous pouvez changer l'aspect des cartes et des dés sans quitter la partie.",
        mobile:
          "Dans cet entraînement, touchez More en haut à gauche, puis Details, Settings et l'onglet Game. En partie en direct, touchez votre nom en bas à gauche pour trouver Settings.",
      },
      report: {
        title: "Signalez un joueur",
        desktop:
          "En partie en direct, ouvrez le menu près du nom du Rival dans cette zone et choisissez Report player. Le Rival de cet entraînement est un bot. Rien n'est envoyé avant l'envoi du formulaire.",
        mobile:
          "En partie en direct, touchez le nom du Rival en haut à droite, puis Report player. Cet entraînement n'a aucun joueur à signaler. Rien n'est envoyé avant l'envoi du formulaire.",
      },
      payment: {
        title: "Choisissez comment payer",
        desktop:
          "Utilisez le bouton pièce près de votre nom pour choisir les Eddies ou Legends qui paient chaque coût. Utilisez-le encore pour revenir au paiement automatique.",
        mobile:
          "Touchez le bouton pièce en haut à gauche pour choisir les Eddies ou Legends qui paient chaque coût. Touchez-le encore pour le paiement automatique.",
      },
      priority: {
        title: "Gardez le temps de répondre",
        desktop:
          "Utilisez le bouton main près de votre nom pour garder votre fenêtre de réponse quand votre Rival attaque. Utilisez-le encore, ou choisissez Passer, pour continuer.",
        mobile:
          "Touchez le bouton main en haut à gauche pour garder votre fenêtre de réponse quand votre Rival attaque. Touchez-le encore, ou choisissez Passer, pour continuer.",
      },
      bug: {
        title: "La partie peut échouer",
        desktop:
          "La partie peut échouer. Ouvrez le menu près de votre nom et choisissez Report bug pour que nous puissions corriger. Signalez toujours un bug quand quelque chose casse. C'est distinct de Report player. Rien n'est envoyé avant l'envoi du formulaire.",
        mobile:
          "La partie peut échouer. En partie en direct, touchez votre nom en bas à gauche et choisissez Report bug pour que nous puissions corriger. Signalez toujours un bug quand quelque chose casse. C'est distinct de Report player. Rien n'est envoyé avant l'envoi du formulaire.",
      },
      correction: {
        title: "Corrigez le plateau",
        desktop:
          "Si un bug arrive au milieu d'une partie, vous pouvez corriger le plateau. En pratique locale, ouvrez le menu près de votre nom et choisissez Enable Board State Correction. Cela s'active sans qu'une personne accepte. Dans un match hébergé contre un bot, ouvrez ce même menu et choisissez Request Board State Correction…. Cela s'active sans qu'une personne accepte. Contre un humain, choisissez Request Board State Correction… et vous ne pouvez modifier tous les deux qu'après acceptation. Cliquez sur les cartes, l'équipement attaché, le deck, la trash, les Gigs et les Eddies, puis choisissez Exit.",
        mobile:
          "Si un bug arrive au milieu d'une partie, vous pouvez corriger le plateau. Dans cet entraînement, touchez More en haut à gauche, puis Details, et choisissez Enable Board State Correction. Cela s'active sans qu'une personne accepte. Dans un match hébergé contre un bot, touchez More en haut à gauche, puis Details, et choisissez Request Board State Correction…. Cela s'active sans qu'une personne accepte. Contre un humain, touchez votre nom en bas à gauche et choisissez Request Board State Correction… et vous ne pouvez modifier tous les deux qu'après acceptation. Touchez les cartes, l'équipement attaché, le deck, la trash, les Gigs et les Eddies, puis choisissez Exit.",
      },
      undo: {
        title: "Annulez un coup",
        desktop:
          "Choisissez Undo last move pour remettre la dernière action annulable. Ouvrez le menu près de votre nom et choisissez Undo to turn start pour revenir au début du tour en cours. Dans un match classé en direct, l'adversaire doit accepter. Dans les autres matchs, l'annulation s'applique sans demande.",
        mobile:
          "Touchez Undo en bas pour utiliser Undo last move et remettre la dernière action annulable. Dans cet entraînement, ou dans un match hébergé contre un bot, touchez More en haut à gauche, puis Details, et choisissez Undo to turn start pour revenir au début du tour en cours. Contre un humain, touchez votre nom en bas à gauche et choisissez Undo to turn start. Dans un match classé en direct, l'adversaire doit accepter. Dans les autres matchs, l'annulation s'applique sans demande.",
      },
    },
  },
  de: {
    label: "Dein erstes Spiel",
    step: (current, total) => `Schritt ${current} von ${total}`,
    back: "Zurück",
    next: "Weiter",
    finish: "Anleitung beenden",
    skip: "Anleitung überspringen",
    replay: "Anleitung für das erste Spiel anzeigen",
    minimize: "Anleitung minimieren",
    restore: "Anleitung öffnen",
    steps: {
      cards: {
        title: "Bewege deine Karten",
        desktop:
          "Klicke auf eine Karte, um deine Aktionen zu sehen. Du kannst sie auch auf einen markierten Bereich ziehen, etwa deine Eddies oder dein Feld. Nur erlaubte Züge funktionieren.",
        mobile:
          "Tippe auf eine Karte, um deine Aktionen zu sehen. Du kannst sie auch auf einen markierten Bereich ziehen. Falls Ziehen schwerfällt, nutze die Kartenaktionen.",
      },
      settings: {
        title: "Passe das Spiel an",
        desktop:
          "Öffne das Menü neben deinem Namen. Wähle Settings und dann den Tab Game. Dort kannst du Karten und Würfel anpassen.",
        mobile:
          "Tippe in diesem Übungsspiel oben links auf More, dann auf Details, Settings und den Tab Game. Im Live-Spiel findest du Settings über deinen Namen unten links.",
      },
      report: {
        title: "Melde einen Spieler",
        desktop:
          "Öffne im Live-Spiel das Menü neben dem Namen von deinem Rival in diesem Bereich und wähle Report player. Der Rival hier ist ein Bot. Erst mit dem Absenden wird etwas gemeldet.",
        mobile:
          "Tippe im Live-Spiel oben rechts auf den Namen von deinem Rival und wähle Report player. In diesem Übungsspiel gibt es keinen Spieler zu melden. Erst mit dem Absenden wird etwas gemeldet.",
      },
      payment: {
        title: "Wähle deine Zahlung",
        desktop:
          "Mit der Münztaste neben deinem Namen wählst du die Eddies oder Legends für jede Zahlung selbst. Drücke sie erneut, um automatisch zu zahlen.",
        mobile:
          "Tippe oben links auf die Münztaste, um die Eddies oder Legends für jede Zahlung selbst zu wählen. Tippe erneut darauf, um automatisch zu zahlen.",
      },
      priority: {
        title: "Behalte Zeit zum Reagieren",
        desktop:
          "Mit der Handtaste neben deinem Namen bleibt dein Reaktionsfenster bei einem Angriff von deinem Rival offen. Drücke sie erneut oder wähle Passen, um fortzufahren.",
        mobile:
          "Tippe oben links auf die Handtaste, damit dein Reaktionsfenster bei einem Angriff von deinem Rival offen bleibt. Tippe erneut darauf oder wähle Passen, um fortzufahren.",
      },
      bug: {
        title: "Das Spiel kann fehlschlagen",
        desktop:
          "Das Spiel kann fehlschlagen. Öffne das Menü neben deinem Namen und wähle Report bug, damit wir es reparieren können. Melde einen Fehler immer, wenn etwas kaputtgeht. Das ist getrennt von Report player. Erst mit dem Absenden wird etwas gesendet.",
        mobile:
          "Das Spiel kann fehlschlagen. Tippe im Live-Spiel unten links auf deinen Namen und wähle Report bug, damit wir es reparieren können. Melde einen Fehler immer, wenn etwas kaputtgeht. Das ist getrennt von Report player. Erst mit dem Absenden wird etwas gesendet.",
      },
      correction: {
        title: "Korrigiere das Spielfeld",
        desktop:
          "Wenn ein Fehler mitten in der Partie passiert, kannst du das Spielfeld korrigieren. In lokaler Übung öffnest du das Menü neben deinem Namen und wählst Enable Board State Correction. Es schaltet sich ein, ohne dass eine Person akzeptiert. In einem gehosteten Match gegen einen Bot wählst du im selben Menü Request Board State Correction…. Es schaltet sich ein, ohne dass eine Person akzeptiert. Gegen einen Menschen wählst du Request Board State Correction… und ihr könnt beide erst nach der Annahme ändern. Klicke Karten, angelegtes Gear, das Deck, Trash, Gigs und Eddies an und wähle dann Exit.",
        mobile:
          "Wenn ein Fehler mitten in der Partie passiert, kannst du das Spielfeld korrigieren. Tippe in diesem Übungsspiel oben links auf More, dann auf Details, und wähle Enable Board State Correction. Es schaltet sich ein, ohne dass eine Person akzeptiert. In einem gehosteten Match gegen einen Bot tippe oben links auf More, dann auf Details, und wähle Request Board State Correction…. Es schaltet sich ein, ohne dass eine Person akzeptiert. Gegen einen Menschen tippe unten links auf deinen Namen und wähle Request Board State Correction… und ihr könnt beide erst nach der Annahme ändern. Tippe Karten, angelegtes Gear, das Deck, Trash, Gigs und Eddies an und wähle dann Exit.",
      },
      undo: {
        title: "Mache einen Zug rückgängig",
        desktop:
          "Wähle Undo last move, um die letzte rückgängig machbare Aktion zurückzusetzen. Öffne das Menü neben deinem Namen und wähle Undo to turn start, um zum Anfang des aktuellen Zuges zurückzukehren. In einem gewerteten Live-Match muss der Gegner annehmen. In anderen Matches gilt die Rücknahme ohne Nachfrage.",
        mobile:
          "Tippe unten auf Undo, also Undo last move, um die letzte rückgängig machbare Aktion zurückzusetzen. Tippe in diesem Übungsspiel, oder in einem gehosteten Match gegen einen Bot, oben links auf More, dann auf Details, und wähle Undo to turn start, um zum Anfang des aktuellen Zuges zurückzukehren. Gegen einen Menschen tippe unten links auf deinen Namen und wähle Undo to turn start. In einem gewerteten Live-Match muss der Gegner annehmen. In anderen Matches gilt die Rücknahme ohne Nachfrage.",
      },
    },
  },
  es: {
    label: "Tu primera partida",
    step: (current, total) => `Paso ${current} de ${total}`,
    back: "Atrás",
    next: "Siguiente",
    finish: "Terminar guía",
    skip: "Omitir guía",
    replay: "Ver la guía de la primera partida",
    minimize: "Minimizar guía",
    restore: "Abrir guía",
    steps: {
      cards: {
        title: "Mueve tus cartas",
        desktop:
          "Haz clic en una carta para ver tus acciones. También puedes arrastrarla a una zona resaltada, como tus Eddies o tu campo. Solo funcionan las jugadas permitidas.",
        mobile:
          "Toca una carta para ver tus acciones. También puedes arrastrarla a una zona resaltada. Si arrastrar te resulta difícil, usa las acciones de la carta.",
      },
      settings: {
        title: "Ajusta la partida",
        desktop:
          "Abre el menú junto a tu nombre. Elige Settings y luego la pestaña Game. Puedes cambiar el aspecto de cartas y dados sin salir de la partida.",
        mobile:
          "En esta partida de práctica, toca More arriba a la izquierda y luego Details, Settings y la pestaña Game. En una partida en vivo, toca tu nombre abajo a la izquierda para encontrar Settings.",
      },
      report: {
        title: "Denuncia a un jugador",
        desktop:
          "En una partida en vivo, abre el menú junto al nombre de tu Rival en esta zona y elige Report player. El Rival de esta práctica es un bot. No se envía nada hasta que envíes el formulario.",
        mobile:
          "En una partida en vivo, toca el nombre de tu Rival arriba a la derecha y luego Report player. En esta práctica no hay ningún jugador que denunciar. No se envía nada hasta que envíes el formulario.",
      },
      payment: {
        title: "Elige cómo pagar",
        desktop:
          "Pulsa el botón de moneda junto a tu nombre para elegir qué Eddies o Legends pagan cada coste. Púlsalo de nuevo para volver al pago automático.",
        mobile:
          "Toca el botón de moneda arriba a la izquierda para elegir qué Eddies o Legends pagan cada coste. Tócalo de nuevo para volver al pago automático.",
      },
      priority: {
        title: "Conserva tu oportunidad de responder",
        desktop:
          "Pulsa el botón de mano junto a tu nombre para mantener abierta tu oportunidad de responder cuando ataque tu Rival. Púlsalo de nuevo o elige Pasar para continuar.",
        mobile:
          "Toca el botón de mano arriba a la izquierda para mantener abierta tu oportunidad de responder cuando ataque tu Rival. Tócalo de nuevo o elige Pasar para continuar.",
      },
      bug: {
        title: "La partida puede fallar",
        desktop:
          "La partida puede fallar. Abre el menú junto a tu nombre y elige Report bug para que podamos corregirlo. Envía siempre un informe cuando algo se rompa. Esto es distinto de Report player. No se envía nada hasta que envíes el formulario.",
        mobile:
          "La partida puede fallar. En una partida en vivo, toca tu nombre abajo a la izquierda y elige Report bug para que podamos corregirlo. Envía siempre un informe cuando algo se rompa. Esto es distinto de Report player. No se envía nada hasta que envíes el formulario.",
      },
      correction: {
        title: "Corrige el tablero",
        desktop:
          "Si un fallo ocurre en medio de la partida, puedes corregir el tablero. En la práctica local, abre el menú junto a tu nombre y elige Enable Board State Correction. Se activa sin que una persona acepte. En una partida alojada contra un bot, abre ese mismo menú y elige Request Board State Correction…. Se activa sin que una persona acepte. Contra un humano, elige Request Board State Correction… y ambos pueden editar solo después de que se acepte. Haz clic en las cartas, el equipo acoplado, el deck, trash, Gigs y Eddies, y luego elige Exit.",
        mobile:
          "Si un fallo ocurre en medio de la partida, puedes corregir el tablero. En esta partida de práctica, toca More arriba a la izquierda, luego Details, y elige Enable Board State Correction. Se activa sin que una persona acepte. En una partida alojada contra un bot, toca More arriba a la izquierda, luego Details, y elige Request Board State Correction…. Se activa sin que una persona acepte. Contra un humano, toca tu nombre abajo a la izquierda y elige Request Board State Correction… y ambos pueden editar solo después de que se acepte. Toca las cartas, el equipo acoplado, el deck, trash, Gigs y Eddies, y luego elige Exit.",
      },
      undo: {
        title: "Deshaz una jugada",
        desktop:
          "Elige Undo last move para devolver la última acción que se puede deshacer. Abre el menú junto a tu nombre y elige Undo to turn start para volver al inicio del turno actual. En una partida clasificatoria en vivo, el rival debe aceptar. En las demás partidas, deshacer se aplica sin preguntar.",
        mobile:
          "Toca Undo abajo para usar Undo last move y devolver la última acción que se puede deshacer. En esta partida de práctica, o en una partida alojada contra un bot, toca More arriba a la izquierda, luego Details, y elige Undo to turn start para volver al inicio del turno actual. Contra un humano, toca tu nombre abajo a la izquierda y elige Undo to turn start. En una partida clasificatoria en vivo, el rival debe aceptar. En las demás partidas, deshacer se aplica sin preguntar.",
      },
    },
  },
  it: {
    label: "La tua prima partita",
    step: (current, total) => `Passo ${current} di ${total}`,
    back: "Indietro",
    next: "Avanti",
    finish: "Termina la guida",
    skip: "Salta la guida",
    replay: "Mostra la guida della prima partita",
    minimize: "Riduci la guida",
    restore: "Apri la guida",
    steps: {
      cards: {
        title: "Muovi le tue carte",
        desktop:
          "Fai clic su una carta per vedere le azioni disponibili. Puoi anche trascinarla in un'area evidenziata, come i tuoi Eddies o il campo. Funzionano solo le mosse consentite.",
        mobile:
          "Tocca una carta per vedere le azioni disponibili. Puoi anche trascinarla in un'area evidenziata. Se trascinare è difficile, usa le azioni della carta.",
      },
      settings: {
        title: "Cambia le impostazioni",
        desktop:
          "Apri il menu accanto al tuo nome. Scegli Settings, poi la scheda Game. Puoi cambiare l'aspetto di carte e dadi senza uscire dalla partita.",
        mobile:
          "In questa partita di pratica, tocca More in alto a sinistra, poi Details, Settings e la scheda Game. In una partita dal vivo, tocca il tuo nome in basso a sinistra per trovare Settings.",
      },
      report: {
        title: "Segnala un giocatore",
        desktop:
          "In una partita dal vivo, apri il menu accanto al nome del Rival in quest'area e scegli Report player. Il Rival di questa pratica è un bot. Nulla viene inviato finché non invii il modulo.",
        mobile:
          "In una partita dal vivo, tocca il nome del Rival in alto a destra, poi Report player. In questa pratica non c'è un giocatore da segnalare. Nulla viene inviato finché non invii il modulo.",
      },
      payment: {
        title: "Scegli come pagare",
        desktop:
          "Usa il pulsante con la moneta accanto al tuo nome per scegliere gli Eddies o le Legends con cui pagare ogni costo. Usalo di nuovo per il pagamento automatico.",
        mobile:
          "Tocca il pulsante con la moneta in alto a sinistra per scegliere gli Eddies o le Legends con cui pagare ogni costo. Toccalo di nuovo per il pagamento automatico.",
      },
      priority: {
        title: "Tieni aperta la risposta",
        desktop:
          "Usa il pulsante con la mano accanto al tuo nome per tenere aperta la risposta quando il Rival attacca. Usalo di nuovo o scegli Passa per continuare.",
        mobile:
          "Tocca il pulsante con la mano in alto a sinistra per tenere aperta la risposta quando il Rival attacca. Toccalo di nuovo o scegli Passa per continuare.",
      },
      bug: {
        title: "La partita può fallire",
        desktop:
          "La partita può fallire. Apri il menu accanto al tuo nome e scegli Report bug così possiamo correggerlo. Invia sempre una segnalazione quando qualcosa si rompe. È separato da Report player. Nulla viene inviato finché non invii il modulo.",
        mobile:
          "La partita può fallire. In una partita dal vivo, tocca il tuo nome in basso a sinistra e scegli Report bug così possiamo correggerlo. Invia sempre una segnalazione quando qualcosa si rompe. È separato da Report player. Nulla viene inviato finché non invii il modulo.",
      },
      correction: {
        title: "Correggi il tavolo",
        desktop:
          "Se un bug arriva a metà partita, puoi correggere il tavolo. Nella pratica locale, apri il menu accanto al tuo nome e scegli Enable Board State Correction. Si attiva senza che una persona accetti. In una partita ospitata contro un bot, apri lo stesso menu e scegli Request Board State Correction…. Si attiva senza che una persona accetti. Contro un umano, scegli Request Board State Correction… ed entrambi potete modificare solo dopo l'accettazione. Fai clic su carte, equipaggiamento agganciato, deck, trash, Gigs ed Eddies, poi scegli Exit.",
        mobile:
          "Se un bug arriva a metà partita, puoi correggere il tavolo. In questa pratica, tocca More in alto a sinistra, poi Details, e scegli Enable Board State Correction. Si attiva senza che una persona accetti. In una partita ospitata contro un bot, tocca More in alto a sinistra, poi Details, e scegli Request Board State Correction…. Si attiva senza che una persona accetti. Contro un umano, tocca il tuo nome in basso a sinistra e scegli Request Board State Correction… ed entrambi potete modificare solo dopo l'accettazione. Tocca carte, equipaggiamento agganciato, deck, trash, Gigs ed Eddies, poi scegli Exit.",
      },
      undo: {
        title: "Annulla una mossa",
        desktop:
          "Scegli Undo last move per rimettere l'ultima azione annullabile. Apri il menu accanto al tuo nome e scegli Undo to turn start per tornare all'inizio del turno attuale. In una partita classificata dal vivo, l'avversario deve accettare. Nelle altre partite, l'annullamento si applica senza chiedere.",
        mobile:
          "Tocca Undo in basso per usare Undo last move e rimettere l'ultima azione annullabile. In questa pratica, o in una partita ospitata contro un bot, tocca More in alto a sinistra, poi Details, e scegli Undo to turn start per tornare all'inizio del turno attuale. Contro un umano, tocca il tuo nome in basso a sinistra e scegli Undo to turn start. In una partita classificata dal vivo, l'avversario deve accettare. Nelle altre partite, l'annullamento si applica senza chiedere.",
      },
    },
  },
  "pt-br": {
    label: "Sua primeira partida",
    step: (current, total) => `Etapa ${current} de ${total}`,
    back: "Voltar",
    next: "Próximo",
    finish: "Concluir guia",
    skip: "Pular guia",
    replay: "Mostrar guia da primeira partida",
    minimize: "Minimizar guia",
    restore: "Abrir guia",
    steps: {
      cards: {
        title: "Mova suas cartas",
        desktop:
          "Clique em uma carta para ver suas ações. Você também pode arrastá-la para uma área destacada, como seus Eddies ou o campo. Só as jogadas permitidas funcionam.",
        mobile:
          "Toque em uma carta para ver suas ações. Você também pode arrastá-la para uma área destacada. Se arrastar for difícil, use as ações da carta.",
      },
      settings: {
        title: "Ajuste a partida",
        desktop:
          "Abra o menu ao lado do seu nome. Escolha Settings e depois a aba Game. Você pode mudar a aparência das cartas e dos dados sem sair da partida.",
        mobile:
          "Neste treino, toque em More no alto à esquerda, depois em Details, Settings e na aba Game. Numa partida ao vivo, toque no seu nome embaixo à esquerda para encontrar Settings.",
      },
      report: {
        title: "Denuncie um jogador",
        desktop:
          "Numa partida ao vivo, abra o menu ao lado do nome do Rival nesta área e escolha Report player. O Rival deste treino é um bot. Nada será enviado até você enviar o formulário.",
        mobile:
          "Numa partida ao vivo, toque no nome do Rival no alto à direita e depois em Report player. Neste treino não há jogador para denunciar. Nada será enviado até você enviar o formulário.",
      },
      payment: {
        title: "Escolha como pagar",
        desktop:
          "Use o botão de moeda ao lado do seu nome para escolher quais Eddies ou Legends pagam cada custo. Use-o de novo para voltar ao pagamento automático.",
        mobile:
          "Toque no botão de moeda no alto à esquerda para escolher quais Eddies ou Legends pagam cada custo. Toque de novo para voltar ao pagamento automático.",
      },
      priority: {
        title: "Mantenha tempo para responder",
        desktop:
          "Use o botão de mão ao lado do seu nome para manter aberta sua janela de resposta quando o Rival atacar. Use-o de novo ou escolha Passar para continuar.",
        mobile:
          "Toque no botão de mão no alto à esquerda para manter aberta sua janela de resposta quando o Rival atacar. Toque de novo ou escolha Passar para continuar.",
      },
      bug: {
        title: "A partida pode falhar",
        desktop:
          "A partida pode falhar. Abra o menu ao lado do seu nome e escolha Report bug para podermos corrigir. Envie sempre um relato quando algo quebrar. Isso é separado de Report player. Nada é enviado até você enviar o formulário.",
        mobile:
          "A partida pode falhar. Numa partida ao vivo, toque no seu nome embaixo à esquerda e escolha Report bug para podermos corrigir. Envie sempre um relato quando algo quebrar. Isso é separado de Report player. Nada é enviado até você enviar o formulário.",
      },
      correction: {
        title: "Corrija o tabuleiro",
        desktop:
          "Se um bug acontecer no meio da partida, você pode corrigir o tabuleiro. Na prática local, abra o menu ao lado do seu nome e escolha Enable Board State Correction. Ele liga sem uma pessoa aceitar. Numa partida hospedada contra um bot, abra o mesmo menu e escolha Request Board State Correction…. Ele liga sem uma pessoa aceitar. Contra um humano, escolha Request Board State Correction… e os dois só podem editar depois que for aceito. Clique nas cartas, no equipamento acoplado, no deck, no trash, nos Gigs e nos Eddies, e depois escolha Exit.",
        mobile:
          "Se um bug acontecer no meio da partida, você pode corrigir o tabuleiro. Neste treino, toque em More no alto à esquerda, depois em Details, e escolha Enable Board State Correction. Ele liga sem uma pessoa aceitar. Numa partida hospedada contra um bot, toque em More no alto à esquerda, depois em Details, e escolha Request Board State Correction…. Ele liga sem uma pessoa aceitar. Contra um humano, toque no seu nome embaixo à esquerda e escolha Request Board State Correction… e os dois só podem editar depois que for aceito. Toque nas cartas, no equipamento acoplado, no deck, no trash, nos Gigs e nos Eddies, e depois escolha Exit.",
      },
      undo: {
        title: "Desfaça uma jogada",
        desktop:
          "Escolha Undo last move para devolver a última ação que pode ser desfeita. Abra o menu ao lado do seu nome e escolha Undo to turn start para voltar ao início do turno atual. Numa partida ranqueada ao vivo, o oponente precisa aceitar. Nas outras partidas, desfazer vale sem pedir.",
        mobile:
          "Toque em Undo embaixo para usar Undo last move e devolver a última ação que pode ser desfeita. Neste treino, ou numa partida hospedada contra um bot, toque em More no alto à esquerda, depois em Details, e escolha Undo to turn start para voltar ao início do turno atual. Contra um humano, toque no seu nome embaixo à esquerda e escolha Undo to turn start. Numa partida ranqueada ao vivo, o oponente precisa aceitar. Nas outras partidas, desfazer vale sem pedir.",
      },
    },
  },
};

export function resolveTutorialLocale(
  preference: string | null,
  browserLanguages: readonly string[],
): TutorialLocale {
  const candidates = [preference, ...browserLanguages];
  for (const candidate of candidates) {
    const normalized = candidate?.toLowerCase();
    if (!normalized) continue;
    if (normalized.startsWith("pt")) return "pt-br";
    const base = normalized.split("-")[0];
    if (base === "en" || base === "fr" || base === "de" || base === "es" || base === "it") {
      return base;
    }
  }
  return "en";
}

export type HandsOnStepId = "sell" | "play" | "attack" | "block";

/** Copy for the guided practice positions. Control names stay as shown by the board. */
export const handsOnTutorialMessages: Record<
  TutorialLocale,
  {
    invitation: string;
    start: string;
    done: string;
    tryAction: string;
    actionDone: string;
    returnToLobby: string;
    steps: Record<HandsOnStepId, TutorialStepCopy>;
  }
> = {
  en: {
    invitation: "New to Cyberpunk? Try a short guided game before playing someone.",
    start: "Try the guided game",
    done: "Great work. You can return to your game or practice again.",
    tryAction: "Try this on the board to continue.",
    actionDone: "Nice! Choose Next to continue.",
    returnToLobby: "Back to lobby",
    steps: {
      sell: {
        title: "Sell a card",
        desktop:
          "Find a card with Sell in your hand. Drag it to your Eddies, or click it and choose Sell. This gives you one Eddie.",
        mobile:
          "Find a card with Sell in your hand. Drag it to your Eddies, or tap it and choose Sell. This gives you one Eddie.",
      },
      play: {
        title: "Play a card",
        desktop:
          "Drag a card from your hand to your field, or click it and choose Play. The game pays with ready Eddies and Legends for you unless you turn on manual payment.",
        mobile:
          "Drag a card from your hand to your field, or tap it and choose Play. The game pays for you unless you turn on manual payment.",
      },
      attack: {
        title: "Attack",
        desktop:
          "Use a ready Unit to attack. Drag it onto a valid rival target, or click it and choose an attack action.",
        mobile:
          "Use a ready Unit to attack. Drag it onto a valid rival target, or tap it and choose an attack action.",
      },
      block: {
        title: "Block an attack",
        desktop:
          "Your Rival is attacking. Click a ready Unit and choose Block, or drag it onto the attack. You can also choose Skip block twice to let the attack through.",
        mobile:
          "Your Rival is attacking. Tap a ready Unit and choose Block, or drag it onto the attack. You can also tap Skip block twice.",
      },
    },
  },
  fr: {
    invitation: "Vous débutez ? Essayez une courte partie guidée avant de jouer contre quelqu’un.",
    start: "Essayer la partie guidée",
    done: "Bravo ! Vous pouvez revenir à votre partie ou vous entraîner de nouveau.",
    tryAction: "Essayez cette action sur le plateau pour continuer.",
    actionDone: "Bravo ! Choisissez Suivant pour continuer.",
    returnToLobby: "Retour au salon",
    steps: {
      sell: {
        title: "Vendez une carte",
        desktop:
          "Trouvez une carte avec Sell dans votre main. Glissez-la vers vos Eddies, ou cliquez dessus et choisissez Sell. Vous gagnez un Eddie.",
        mobile:
          "Trouvez une carte avec Sell dans votre main. Glissez-la vers vos Eddies, ou touchez-la et choisissez Sell. Vous gagnez un Eddie.",
      },
      play: {
        title: "Jouez une carte",
        desktop:
          "Glissez une carte de votre main vers votre terrain, ou cliquez dessus et choisissez Play. Le jeu paie avec vos Eddies et Legends disponibles, sauf si le paiement manuel est activé.",
        mobile:
          "Glissez une carte vers votre terrain, ou touchez-la et choisissez Play. Le jeu paie pour vous, sauf si le paiement manuel est activé.",
      },
      attack: {
        title: "Attaquez",
        desktop:
          "Utilisez une Unit disponible pour attaquer. Glissez-la sur une cible adverse valide, ou cliquez dessus et choisissez une attaque.",
        mobile:
          "Utilisez une Unit disponible. Glissez-la sur une cible valide, ou touchez-la et choisissez une attaque.",
      },
      block: {
        title: "Bloquez une attaque",
        desktop:
          "Votre Rival attaque. Cliquez sur une Unit disponible et choisissez Block, ou glissez-la sur l’attaque. Vous pouvez aussi choisir Skip block deux fois pour laisser passer l’attaque.",
        mobile:
          "Votre Rival attaque. Touchez une Unit disponible et choisissez Block, ou glissez-la sur l’attaque. Vous pouvez aussi choisir Skip block deux fois pour laisser passer l’attaque.",
      },
    },
  },
  de: {
    invitation:
      "Neu bei Cyberpunk? Probiere vor einem Spiel gegen andere eine kurze Anleitung aus.",
    start: "Geführtes Spiel starten",
    done: "Gut gemacht! Du kannst zum Spiel zurückkehren oder erneut üben.",
    tryAction: "Probiere dies auf dem Spielfeld aus, um fortzufahren.",
    actionDone: "Gut! Wähle Weiter.",
    returnToLobby: "Zurück zur Lobby",
    steps: {
      sell: {
        title: "Verkaufe eine Karte",
        desktop:
          "Suche eine Karte mit Sell auf deiner Hand. Ziehe sie zu deinen Eddies oder klicke sie an und wähle Sell. Du erhältst einen Eddie.",
        mobile:
          "Suche eine Karte mit Sell auf deiner Hand. Ziehe sie zu deinen Eddies oder tippe sie an und wähle Sell. Du erhältst einen Eddie.",
      },
      play: {
        title: "Spiele eine Karte",
        desktop:
          "Ziehe eine Karte aus deiner Hand auf dein Feld oder klicke sie an und wähle Play. Das Spiel bezahlt mit verfügbaren Eddies und Legends, außer wenn manuelles Bezahlen aktiviert ist.",
        mobile:
          "Ziehe eine Karte auf dein Feld oder tippe sie an und wähle Play. Das Spiel bezahlt für dich, außer wenn manuelles Bezahlen aktiviert ist.",
      },
      attack: {
        title: "Greife an",
        desktop:
          "Greife mit einer bereiten Unit an. Ziehe sie auf ein gültiges gegnerisches Ziel oder klicke sie an und wähle einen Angriff.",
        mobile:
          "Greife mit einer bereiten Unit an. Ziehe sie auf ein gültiges Ziel oder tippe sie an und wähle einen Angriff.",
      },
      block: {
        title: "Blocke einen Angriff",
        desktop:
          "Dein Rival greift an. Klicke eine bereite Unit an und wähle Block oder ziehe sie auf den Angriff. Du kannst auch zweimal Skip block wählen, um den Angriff durchzulassen.",
        mobile:
          "Dein Rival greift an. Tippe eine bereite Unit an und wähle Block oder ziehe sie auf den Angriff. Du kannst auch zweimal Skip block wählen, um den Angriff durchzulassen.",
      },
    },
  },
  es: {
    invitation: "¿Es tu primera partida? Prueba una partida guiada antes de jugar contra alguien.",
    start: "Probar partida guiada",
    done: "¡Bien hecho! Puedes volver a tu partida o practicar otra vez.",
    tryAction: "Prueba esta acción en el tablero para continuar.",
    actionDone: "¡Bien! Elige Siguiente.",
    returnToLobby: "Volver a la sala",
    steps: {
      sell: {
        title: "Vende una carta",
        desktop:
          "Busca una carta con Sell en tu mano. Arrástrala a tus Eddies, o haz clic y elige Sell. Recibes un Eddie.",
        mobile:
          "Busca una carta con Sell en tu mano. Arrástrala a tus Eddies, o tócala y elige Sell. Recibes un Eddie.",
      },
      play: {
        title: "Juega una carta",
        desktop:
          "Arrastra una carta de tu mano a tu campo, o haz clic y elige Play. El juego paga con Eddies y Legends disponibles, salvo que actives el pago manual.",
        mobile:
          "Arrastra una carta a tu campo, o tócala y elige Play. El juego paga por ti salvo que actives el pago manual.",
      },
      attack: {
        title: "Ataca",
        desktop:
          "Ataca con una Unit lista. Arrástrala a un objetivo rival válido, o haz clic y elige una acción de ataque.",
        mobile:
          "Ataca con una Unit lista. Arrástrala a un objetivo válido, o tócala y elige un ataque.",
      },
      block: {
        title: "Bloquea un ataque",
        desktop:
          "Tu Rival ataca. Haz clic en una Unit lista y elige Block, o arrástrala al ataque. También puedes elegir Skip block dos veces para dejar pasar el ataque.",
        mobile:
          "Tu Rival ataca. Toca una Unit lista y elige Block, o arrástrala al ataque. También puedes elegir Skip block dos veces para dejar pasar el ataque.",
      },
    },
  },
  it: {
    invitation:
      "È la tua prima partita? Prova una breve partita guidata prima di giocare con qualcuno.",
    start: "Prova la partita guidata",
    done: "Ottimo! Puoi tornare alla partita o esercitarti ancora.",
    tryAction: "Prova questa azione sul tavolo per continuare.",
    actionDone: "Bene! Seleziona Avanti.",
    returnToLobby: "Torna alla lobby",
    steps: {
      sell: {
        title: "Vendi una carta",
        desktop:
          "Trova una carta con Sell nella tua mano. Trascinala sui tuoi Eddies, oppure fai clic e scegli Sell. Ottieni un Eddie.",
        mobile:
          "Trova una carta con Sell nella tua mano. Trascinala sui tuoi Eddies, oppure toccala e scegli Sell. Ottieni un Eddie.",
      },
      play: {
        title: "Gioca una carta",
        desktop:
          "Trascina una carta dalla mano al campo, oppure fai clic e scegli Play. Il gioco paga con Eddies e Legends disponibili, a meno che il pagamento manuale sia attivo.",
        mobile:
          "Trascina una carta nel campo, oppure toccala e scegli Play. Il gioco paga per te, a meno che il pagamento manuale sia attivo.",
      },
      attack: {
        title: "Attacca",
        desktop:
          "Attacca con una Unit pronta. Trascinala su un bersaglio rivale valido, oppure fai clic e scegli un attacco.",
        mobile:
          "Attacca con una Unit pronta. Trascinala su un bersaglio valido, oppure toccala e scegli un attacco.",
      },
      block: {
        title: "Blocca un attacco",
        desktop:
          "Il Rival attacca. Fai clic su una Unit pronta e scegli Block, oppure trascinala sull'attacco. Puoi anche scegliere Skip block due volte per lasciar passare l’attacco.",
        mobile:
          "Il Rival attacca. Tocca una Unit pronta e scegli Block, oppure trascinala sull'attacco. Puoi anche scegliere Skip block due volte per lasciar passare l’attacco.",
      },
    },
  },
  "pt-br": {
    invitation: "Primeira partida? Experimente uma partida guiada antes de jogar contra alguém.",
    start: "Experimentar partida guiada",
    done: "Muito bem! Você pode voltar à partida ou praticar de novo.",
    tryAction: "Faça esta ação no tabuleiro para continuar.",
    actionDone: "Boa! Escolha Próximo.",
    returnToLobby: "Voltar ao lobby",
    steps: {
      sell: {
        title: "Venda uma carta",
        desktop:
          "Ache uma carta com Sell na sua mão. Arraste-a até seus Eddies ou clique nela e escolha Sell. Você recebe um Eddie.",
        mobile:
          "Ache uma carta com Sell na sua mão. Arraste-a até seus Eddies ou toque nela e escolha Sell. Você recebe um Eddie.",
      },
      play: {
        title: "Jogue uma carta",
        desktop:
          "Arraste uma carta da mão para seu campo ou clique nela e escolha Play. O jogo paga com Eddies e Legends disponíveis, a menos que o pagamento manual esteja ativo.",
        mobile:
          "Arraste uma carta para seu campo ou toque nela e escolha Play. O jogo paga por você, a menos que o pagamento manual esteja ativo.",
      },
      attack: {
        title: "Ataque",
        desktop:
          "Ataque com uma Unit pronta. Arraste-a até um alvo rival válido ou clique nela e escolha um ataque.",
        mobile:
          "Ataque com uma Unit pronta. Arraste-a até um alvo válido ou toque nela e escolha um ataque.",
      },
      block: {
        title: "Bloqueie um ataque",
        desktop:
          "Seu Rival está atacando. Clique em uma Unit pronta e escolha Block ou arraste-a até o ataque. Você também pode escolher Skip block duas vezes para deixar o ataque passar.",
        mobile:
          "Seu Rival está atacando. Toque em uma Unit pronta e escolha Block ou arraste-a até o ataque. Você também pode escolher Skip block duas vezes para deixar o ataque passar.",
      },
    },
  },
};

/** Every guided-game step has V2 copy: the V2 board shows different controls and motions. */
export type V2TutorialStepId = TutorialStepId | HandsOnStepId | "eddies" | "actions";

/** Copy for the guided practice positions on the V2 board. Control names stay as shown by the board. */
export const v2HandsOnMessages: Record<
  TutorialLocale,
  { steps: Record<V2TutorialStepId, TutorialStepCopy> }
> = {
  en: {
    steps: {
      cards: {
        title: "The new board",
        desktop:
          "This is the new 3D table. Your hand sits along the bottom. Click a card to see what you can do, or drag it to a highlighted area, such as your field or the sell area. Only moves allowed now will work.",
        mobile:
          "This is the new 3D table. Your hand sits along the bottom. Tap a card to see what you can do, or drag it to a highlighted area. If dragging is hard, use the card actions instead.",
      },
      sell: {
        title: "Sell a card",
        desktop:
          "Find a card with Sell in your hand and start dragging it toward your Gigs. The Drop to sell area lights up in the lower left. Drop the card there to gain one Eddie, or click the card and choose Sell.",
        mobile:
          "Find a card with Sell in your hand and start dragging it toward your Gigs. The Drop to sell area lights up in the lower left. Drop the card there to gain one Eddie, or tap the card and choose Sell.",
      },
      play: {
        title: "Play a card",
        desktop:
          "Drag a card from your hand onto YOUR FIELD — it shows DROP TO PLAY while you drag. The game pays with ready Eddies and Legends for you unless you turn on manual payment.",
        mobile:
          "Drag a card from your hand onto YOUR FIELD — it shows DROP TO PLAY while you drag. The game pays for you unless you turn on manual payment.",
      },
      eddies: {
        title: "Read your resources",
        desktop:
          "The €$ pill shows ready Eddies that pay your costs. The dot beside it is your once-per-turn Sell action, and cards you sold line up on the rail. Click the pill to open your Eddies.",
        mobile:
          "The €$ pill shows ready Eddies that pay your costs. The dot beside it is your once-per-turn Sell action, and cards you sold line up on the rail. Tap the pill to open your Eddies.",
      },
      attack: {
        title: "Attack",
        desktop:
          "Use a ready Unit on your field. Drag it onto a rival Unit to attack it, or onto the area by your Rival's name to strike them directly.",
        mobile:
          "Use a ready Unit on your field. Drag it onto a rival Unit to attack it, or onto the area by your Rival's name to strike them directly.",
      },
      block: {
        title: "Block an attack",
        desktop:
          "Your Rival is attacking. Drag one of your ready Units onto the attack to block, or click it and choose Block. You can also choose Skip block twice to let the attack through.",
        mobile:
          "Your Rival is attacking. Drag one of your ready Units onto the attack to block, or tap it and choose Block. You can also choose Skip block twice to let the attack through.",
      },
      actions: {
        title: "Pass and the clock",
        desktop:
          "The button in the lower right passes your turn, and shows Skip block while your Rival attacks. The clock beside it counts the combat steps and your time.",
        mobile:
          "The button in the lower right passes your turn, and shows Skip block while your Rival attacks. The clock beside it counts the combat steps and your time.",
      },
      priority: {
        title: "Keep time to respond",
        desktop:
          "Select Hold combat priority at the top of the board to keep your response window open when your Rival attacks. Select it again, or press Pass, when you are ready to continue.",
        mobile:
          "Select Hold combat priority at the top of the board to keep your response window open when your Rival attacks. Select it again, or press Pass, when you are ready to continue.",
      },
      payment: {
        title: "Choose how to pay",
        desktop:
          "Select Manual payment at the top of the board to choose which Eddies or Legends pay each cost yourself. Select it again to return to automatic payment.",
        mobile:
          "Select Manual payment at the top of the board to choose which Eddies or Legends pay each cost yourself. Select it again to return to automatic payment.",
      },
      settings: {
        title: "Change your game settings",
        desktop:
          "Open Match at the top of the board. In the panel, open the menu beside your name and choose Settings, then the Game tab. You can change how cards and dice look without leaving the game.",
        mobile:
          "Tap Match at the top of the board. In the panel, open the menu beside your name and choose Settings, then the Game tab.",
      },
      report: {
        title: "Report a player",
        desktop:
          "In a live match, open Match at the top of the board, then open the menu beside your Rival's name and choose Report player. This practice Rival is a bot. Nothing is sent until you submit the form.",
        mobile:
          "In a live match, tap Match at the top of the board, then open the menu beside your Rival's name and choose Report player. This practice Rival is a bot. Nothing is sent until you submit the form.",
      },
      bug: {
        title: "The game can fail",
        desktop:
          "The game can fail. Open Match at the top of the board, open the menu beside your name and choose Report bug so we can fix it. Always send a report when something breaks. This is separate from Report player. Nothing is sent until you submit the form.",
        mobile:
          "The game can fail. Tap Match at the top of the board, open the menu beside your name and choose Report bug so we can fix it. Always send a report when something breaks. Nothing is sent until you submit the form.",
      },
      correction: {
        title: "Correct the board",
        desktop:
          "If a bug happens in the middle of a match, you can correct the board. In local practice, open Match, then the menu beside your name and choose Enable Board State Correction. It turns on without a person accepting. Against a bot, choose Request Board State Correction… the same way. Against a human, both of you can edit only after it is accepted. Click cards, attached gear, the deck, trash, Gigs, and Eddies, then choose Exit.",
        mobile:
          "If a bug happens in the middle of a match, you can correct the board. In local practice, tap Match, then the menu beside your name and choose Enable Board State Correction. It turns on without a person accepting. Against a bot, choose Request Board State Correction… the same way. Against a human, both of you can edit only after it is accepted. Tap cards, attached gear, the deck, trash, Gigs, and Eddies, then choose Exit.",
      },
      undo: {
        title: "Undo a move",
        desktop:
          "Select the arrow at the top of the board to undo the latest undoable action. For Undo to turn start, open Match and the menu beside your name. In a ranked live match the opponent must accept. In other matches the undo applies without asking.",
        mobile:
          "Select the arrow at the top of the board to undo the latest undoable action. For Undo to turn start, open Match and the menu beside your name. In a ranked live match the opponent must accept. In other matches the undo applies without asking.",
      },
    },
  },
  fr: {
    steps: {
      cards: {
        title: "Le nouveau plateau",
        desktop:
          "Voici la nouvelle table 3D. Votre main est en bas. Cliquez sur une carte pour voir vos actions, ou glissez-la vers une zone en surbrillance, comme votre terrain ou la zone de vente. Seules les actions autorisées fonctionnent.",
        mobile:
          "Voici la nouvelle table 3D. Votre main est en bas. Touchez une carte pour voir vos actions, ou glissez-la vers une zone en surbrillance. Si le geste est difficile, utilisez les actions de la carte.",
      },
      sell: {
        title: "Vendez une carte",
        desktop:
          "Trouvez une carte avec Sell dans votre main et commencez à la glisser vers vos Gigs. La zone Drop to sell s'allume en bas à gauche. Déposez la carte là pour gagner un Eddie, ou cliquez sur la carte et choisissez Sell.",
        mobile:
          "Trouvez une carte avec Sell dans votre main et commencez à la glisser vers vos Gigs. La zone Drop to sell s'allume en bas à gauche. Déposez la carte là pour gagner un Eddie, ou touchez la carte et choisissez Sell.",
      },
      play: {
        title: "Jouez une carte",
        desktop:
          "Glissez une carte de votre main sur YOUR FIELD — elle affiche DROP TO PLAY pendant le glissement. Le jeu paie avec vos Eddies et Legends disponibles, sauf si le paiement manuel est activé.",
        mobile:
          "Glissez une carte de votre main sur YOUR FIELD — elle affiche DROP TO PLAY pendant le glissement. Le jeu paie pour vous, sauf si le paiement manuel est activé.",
      },
      eddies: {
        title: "Lisez vos ressources",
        desktop:
          "La pastille €$ montre les Eddies disponibles qui paient vos coûts. Le point à côté est votre action de Sell unique par tour, et les cartes vendues s'alignent sur le rail. Cliquez sur la pastille pour ouvrir vos Eddies.",
        mobile:
          "La pastille €$ montre les Eddies disponibles qui paient vos coûts. Le point à côté est votre action de Sell unique par tour, et les cartes vendues s'alignent sur le rail. Touchez la pastille pour ouvrir vos Eddies.",
      },
      attack: {
        title: "Attaquez",
        desktop:
          "Utilisez une Unit disponible de votre terrain. Glissez-la sur une Unit adverse pour l'attaquer, ou sur la zone près du nom de votre Rival pour l'attaquer directement.",
        mobile:
          "Utilisez une Unit disponible de votre terrain. Glissez-la sur une Unit adverse pour l'attaquer, ou sur la zone près du nom de votre Rival pour l'attaquer directement.",
      },
      block: {
        title: "Bloquez une attaque",
        desktop:
          "Votre Rival attaque. Glissez une de vos Units disponibles sur l'attaque pour bloquer, ou cliquez dessus et choisissez Block. Vous pouvez aussi choisir Skip block deux fois pour laisser passer l'attaque.",
        mobile:
          "Votre Rival attaque. Glissez une de vos Units disponibles sur l'attaque pour bloquer, ou touchez-la et choisissez Block. Vous pouvez aussi choisir Skip block deux fois pour laisser passer l'attaque.",
      },
      actions: {
        title: "Passez et surveillez l'horloge",
        desktop:
          "Le bouton en bas à droite passe votre tour, et affiche Skip block pendant que votre Rival attaque. L'horloge à côté compte les étapes de combat et votre temps.",
        mobile:
          "Le bouton en bas à droite passe votre tour, et affiche Skip block pendant que votre Rival attaque. L'horloge à côté compte les étapes de combat et votre temps.",
      },
      priority: {
        title: "Gardez le temps de répondre",
        desktop:
          "Choisissez Hold combat priority en haut du plateau pour garder votre fenêtre de réponse ouverte quand votre Rival attaque. Choisissez-le encore, ou Passer, pour continuer.",
        mobile:
          "Choisissez Hold combat priority en haut du plateau pour garder votre fenêtre de réponse ouverte quand votre Rival attaque. Choisissez-le encore, ou Passer, pour continuer.",
      },
      payment: {
        title: "Choisissez comment payer",
        desktop:
          "Choisissez Manual payment en haut du plateau pour choisir vous-même les Eddies ou Legends qui paient chaque coût. Choisissez-le encore pour revenir au paiement automatique.",
        mobile:
          "Choisissez Manual payment en haut du plateau pour choisir vous-même les Eddies ou Legends qui paient chaque coût. Choisissez-le encore pour revenir au paiement automatique.",
      },
      settings: {
        title: "Réglez votre partie",
        desktop:
          "Ouvrez Match en haut du plateau. Dans le panneau, ouvrez le menu près de votre nom et choisissez Settings, puis l'onglet Game. Vous pouvez changer l'aspect des cartes et des dés sans quitter la partie.",
        mobile:
          "Touchez Match en haut du plateau. Dans le panneau, ouvrez le menu près de votre nom et choisissez Settings, puis l'onglet Game.",
      },
      report: {
        title: "Signalez un joueur",
        desktop:
          "En partie en direct, ouvrez Match en haut du plateau, puis le menu près du nom de votre Rival et choisissez Report player. Le Rival de cet entraînement est un bot. Rien n'est envoyé avant l'envoi du formulaire.",
        mobile:
          "En partie en direct, touchez Match en haut du plateau, puis le menu près du nom de votre Rival et choisissez Report player. Le Rival de cet entraînement est un bot. Rien n'est envoyé avant l'envoi du formulaire.",
      },
      bug: {
        title: "La partie peut échouer",
        desktop:
          "La partie peut échouer. Ouvrez Match en haut du plateau, le menu près de votre nom et choisissez Report bug pour que nous puissions corriger. Signalez toujours un bug quand quelque chose casse. C'est distinct de Report player. Rien n'est envoyé avant l'envoi du formulaire.",
        mobile:
          "La partie peut échouer. Touchez Match en haut du plateau, le menu près de votre nom et choisissez Report bug pour que nous puissions corriger. Signalez toujours un bug quand quelque chose casse. Rien n'est envoyé avant l'envoi du formulaire.",
      },
      correction: {
        title: "Corrigez le plateau",
        desktop:
          "Si un bug arrive au milieu d'une partie, vous pouvez corriger le plateau. En pratique locale, ouvrez Match, puis le menu près de votre nom et choisissez Enable Board State Correction. Cela s'active sans qu'une personne accepte. Contre un bot, choisissez Request Board State Correction… de la même façon. Contre un humain, vous ne pouvez modifier tous les deux qu'après acceptation. Cliquez sur les cartes, l'équipement attaché, le deck, la trash, les Gigs et les Eddies, puis choisissez Exit.",
        mobile:
          "Si un bug arrive au milieu d'une partie, vous pouvez corriger le plateau. En pratique locale, touchez Match, puis le menu près de votre nom et choisissez Enable Board State Correction. Cela s'active sans qu'une personne accepte. Contre un bot, choisissez Request Board State Correction… de la même façon. Contre un humain, vous ne pouvez modifier tous les deux qu'après acceptation. Touchez les cartes, l'équipement attaché, le deck, la trash, les Gigs et les Eddies, puis choisissez Exit.",
      },
      undo: {
        title: "Annulez un coup",
        desktop:
          "Choisissez la flèche en haut du plateau pour annuler la dernière action annulable. Pour Undo to turn start, ouvrez Match et le menu près de votre nom. Dans un match classé en direct, l'adversaire doit accepter. Dans les autres matchs, l'annulation s'applique sans demande.",
        mobile:
          "Choisissez la flèche en haut du plateau pour annuler la dernière action annulable. Pour Undo to turn start, ouvrez Match et le menu près de votre nom. Dans un match classé en direct, l'adversaire doit accepter. Dans les autres matchs, l'annulation s'applique sans demande.",
      },
    },
  },
  de: {
    steps: {
      cards: {
        title: "Das neue Spielfeld",
        desktop:
          "Das ist der neue 3D-Tisch. Deine Hand liegt unten. Klicke eine Karte an, um deine Aktionen zu sehen, oder ziehe sie auf einen markierten Bereich, etwa dein Feld oder die Verkauf Zone. Nur erlaubte Züge funktionieren.",
        mobile:
          "Das ist der neue 3D-Tisch. Deine Hand liegt unten. Tippe auf eine Karte, um deine Aktionen zu sehen, oder ziehe sie auf einen markierten Bereich. Falls Ziehen schwerfällt, nutze die Kartenaktionen.",
      },
      sell: {
        title: "Verkaufe eine Karte",
        desktop:
          "Suche eine Karte mit Sell auf deiner Hand und ziehe sie Richtung Gigs. Die Drop to sell Fläche leuchtet unten links auf. Lass die Karte dort fallen, um einen Eddie zu erhalten, oder klicke sie an und wähle Sell.",
        mobile:
          "Suche eine Karte mit Sell auf deiner Hand und ziehe sie Richtung Gigs. Die Drop to sell Fläche leuchtet unten links auf. Lass die Karte dort fallen, um einen Eddie zu erhalten, oder tippe sie an und wähle Sell.",
      },
      play: {
        title: "Spiele eine Karte",
        desktop:
          "Ziehe eine Karte aus deiner Hand auf YOUR FIELD — während des Ziehens zeigt es DROP TO PLAY. Das Spiel bezahlt mit verfügbaren Eddies und Legends, außer wenn manuelles Bezahlen aktiviert ist.",
        mobile:
          "Ziehe eine Karte aus deiner Hand auf YOUR FIELD — während des Ziehens zeigt es DROP TO PLAY. Das Spiel bezahlt für dich, außer wenn manuelles Bezahlen aktiviert ist.",
      },
      eddies: {
        title: "Lies deine Ressourcen",
        desktop:
          "Die €$-Anzeige zeigt verfügbare Eddies, die deine Kosten zahlen. Der Punkt daneben ist deine einmal pro Zug nutzbare Sell-Aktion, verkaufte Karten reihen sich auf der Leiste auf. Klicke die Anzeige an, um deine Eddies zu öffnen.",
        mobile:
          "Die €$-Anzeige zeigt verfügbare Eddies, die deine Kosten zahlen. Der Punkt daneben ist deine einmal pro Zug nutzbare Sell-Aktion, verkaufte Karten reihen sich auf der Leiste auf. Tippe auf die Anzeige, um deine Eddies zu öffnen.",
      },
      attack: {
        title: "Greife an",
        desktop:
          "Nutze eine bereite Unit auf deinem Feld. Ziehe sie auf eine gegnerische Unit, um sie anzugreifen, oder auf den Bereich beim Namen deines Rivals, um direkt anzugreifen.",
        mobile:
          "Nutze eine bereite Unit auf deinem Feld. Ziehe sie auf eine gegnerische Unit, um sie anzugreifen, oder auf den Bereich beim Namen deines Rivals, um direkt anzugreifen.",
      },
      block: {
        title: "Blocke einen Angriff",
        desktop:
          "Dein Rival greift an. Ziehe eine deiner bereiten Units auf den Angriff, um zu blocken, oder klicke sie an und wähle Block. Du kannst auch zweimal Skip block wählen, um den Angriff durchzulassen.",
        mobile:
          "Dein Rival greift an. Ziehe eine deiner bereiten Units auf den Angriff, um zu blocken, oder tippe sie an und wähle Block. Du kannst auch zweimal Skip block wählen, um den Angriff durchzulassen.",
      },
      actions: {
        title: "Passen und die Uhr",
        desktop:
          "Die Taste unten rechts beendet deinen Zug und zeigt Skip block, während dein Rival angreift. Die Uhr daneben zählt die Kampfschritte und deine Zeit.",
        mobile:
          "Die Taste unten rechts beendet deinen Zug und zeigt Skip block, während dein Rival angreift. Die Uhr daneben zählt die Kampfschritte und deine Zeit.",
      },
      priority: {
        title: "Behalte Zeit zum Reagieren",
        desktop:
          "Wähle Hold combat priority oben am Spielfeld, um dein Antwortfenster offen zu halten, wenn dein Rival angreift. Wähle es erneut oder Pass, um fortzufahren.",
        mobile:
          "Wähle Hold combat priority oben am Spielfeld, um dein Antwortfenster offen zu halten, wenn dein Rival angreift. Wähle es erneut oder Pass, um fortzufahren.",
      },
      payment: {
        title: "Wähle deine Zahlung",
        desktop:
          "Wähle Manual payment oben am Spielfeld, um selbst zu bestimmen, welche Eddies oder Legends jede Zahlung leisten. Wähle es erneut, um automatisch zu zahlen.",
        mobile:
          "Wähle Manual payment oben am Spielfeld, um selbst zu bestimmen, welche Eddies oder Legends jede Zahlung leisten. Wähle es erneut, um automatisch zu zahlen.",
      },
      settings: {
        title: "Passe das Spiel an",
        desktop:
          "Öffne Match oben am Spielfeld. Öffne im Panel das Menü neben deinem Namen, wähle Settings und dann den Tab Game. Dort kannst du Karten und Würfel anpassen.",
        mobile:
          "Tippe oben am Spielfeld auf Match. Öffne im Panel das Menü neben deinem Namen, wähle Settings und dann den Tab Game.",
      },
      report: {
        title: "Melde einen Spieler",
        desktop:
          "Öffne im Live-Spiel Match oben am Spielfeld, dann das Menü neben dem Namen von deinem Rival, und wähle Report player. Der Rival hier ist ein Bot. Erst mit dem Absenden wird etwas gemeldet.",
        mobile:
          "Tippe im Live-Spiel oben am Spielfeld auf Match, dann auf das Menü neben dem Namen von deinem Rival, und wähle Report player. Der Rival hier ist ein Bot. Erst mit dem Absenden wird etwas gemeldet.",
      },
      bug: {
        title: "Das Spiel kann fehlschlagen",
        desktop:
          "Das Spiel kann fehlschlagen. Öffne Match oben am Spielfeld, das Menü neben deinem Namen, und wähle Report bug, damit wir es korrigieren. Melde immer einen Bug, wenn etwas kaputtgeht. Das ist nicht dasselbe wie Report player. Erst mit dem Absenden wird etwas gemeldet.",
        mobile:
          "Das Spiel kann fehlschlagen. Tippe oben am Spielfeld auf Match, öffne das Menü neben deinem Namen und wähle Report bug, damit wir es korrigieren. Melde immer einen Bug, wenn etwas kaputtgeht. Erst mit dem Absenden wird etwas gemeldet.",
      },
      correction: {
        title: "Korrigiere das Spielfeld",
        desktop:
          "Wenn mitten im Spiel ein Bug auftritt, kannst du das Spielfeld korrigieren. Öffne in der lokalen Übung Match, dann das Menü neben deinem Namen, und wähle Enable Board State Correction. Das aktiviert sich ohne Bestätigung. Gegen einen Bot wähle Request Board State Correction… auf demselben Weg. Gegen einen Menschen könnt ihr erst nach Bestätigung beide bearbeiten. Klicke Karten, angelegtes Equipment, Deck, Trash, Gigs und Eddies an, dann wähle Exit.",
        mobile:
          "Wenn mitten im Spiel ein Bug auftritt, kannst du das Spielfeld korrigieren. Tippe in der lokalen Übung auf Match, dann auf das Menü neben deinem Namen, und wähle Enable Board State Correction. Das aktiviert sich ohne Bestätigung. Gegen einen Bot wähle Request Board State Correction… auf demselben Weg. Gegen einen Menschen könnt ihr erst nach Bestätigung beide bearbeiten. Tippe Karten, angelegtes Equipment, Deck, Trash, Gigs und Eddies an, dann wähle Exit.",
      },
      undo: {
        title: "Nimm einen Zug zurück",
        desktop:
          "Wähle den Pfeil oben am Spielfeld, um die letzte unterstützte Aktion zurückzunehmen. Für Undo to turn start öffne Match und das Menü neben deinem Namen. Im Live-Ranglistenspiel muss der Gegner zustimmen. In anderen Spielen wird die Rücknahme ohne Nachfrage angewendet.",
        mobile:
          "Tippe auf den Pfeil oben am Spielfeld, um die letzte unterstützte Aktion zurückzunehmen. Für Undo to turn start öffne Match und das Menü neben deinem Namen. Im Live-Ranglistenspiel muss der Gegner zustimmen. In anderen Spielen wird die Rücknahme ohne Nachfrage angewendet.",
      },
    },
  },
  es: {
    steps: {
      cards: {
        title: "El nuevo tablero",
        desktop:
          "Esta es la nueva mesa 3D. Tu mano queda abajo. Haz clic en una carta para ver tus acciones, o arrástrala a un área resaltada, como tu campo o la zona de venta. Solo funcionan las acciones permitidas.",
        mobile:
          "Esta es la nueva mesa 3D. Tu mano queda abajo. Toca una carta para ver tus acciones, o arrástrala a un área resaltada. Si arrastrar es difícil, usa las acciones de la carta.",
      },
      sell: {
        title: "Vende una carta",
        desktop:
          "Busca una carta con Sell en tu mano y empieza a arrastrarla hacia tus Gigs. El área Drop to sell se ilumina abajo a la izquierda. Suelta la carta ahí para recibir un Eddie, o haz clic y elige Sell.",
        mobile:
          "Busca una carta con Sell en tu mano y empieza a arrastrarla hacia tus Gigs. El área Drop to sell se ilumina abajo a la izquierda. Suelta la carta ahí para recibir un Eddie, o tócala y elige Sell.",
      },
      play: {
        title: "Juega una carta",
        desktop:
          "Arrastra una carta de tu mano a YOUR FIELD — muestra DROP TO PLAY mientras arrastras. El juego paga con Eddies y Legends disponibles, salvo que actives el pago manual.",
        mobile:
          "Arrastra una carta de tu mano a YOUR FIELD — muestra DROP TO PLAY mientras arrastras. El juego paga por ti salvo que actives el pago manual.",
      },
      eddies: {
        title: "Lee tus recursos",
        desktop:
          "La píldora €$ muestra los Eddies listos que pagan tus costes. El punto al lado es tu acción de Sell única por turno, y las cartas vendidas se alinean en el riel. Haz clic en la píldora para abrir tus Eddies.",
        mobile:
          "La píldora €$ muestra los Eddies listos que pagan tus costes. El punto al lado es tu acción de Sell única por turno, y las cartas vendidas se alinean en el riel. Toca la píldora para abrir tus Eddies.",
      },
      attack: {
        title: "Ataca",
        desktop:
          "Usa una Unit lista de tu campo. Arrástrala sobre una Unit rival para atacarla, o sobre el área junto al nombre de tu Rival para golpearlo directamente.",
        mobile:
          "Usa una Unit lista de tu campo. Arrástrala sobre una Unit rival para atacarla, o sobre el área junto al nombre de tu Rival para golpearlo directamente.",
      },
      block: {
        title: "Bloquea un ataque",
        desktop:
          "Tu Rival ataca. Arrastra una de tus Units listas al ataque para bloquear, o haz clic y elige Block. También puedes elegir Skip block dos veces para dejar pasar el ataque.",
        mobile:
          "Tu Rival ataca. Arrastra una de tus Units listas al ataque para bloquear, o tócala y elige Block. También puedes elegir Skip block dos veces para dejar pasar el ataque.",
      },
      actions: {
        title: "Pasar y el reloj",
        desktop:
          "El botón de abajo a la derecha pasa tu turno y muestra Skip block mientras tu Rival ataca. El reloj al lado cuenta los pasos de combate y tu tiempo.",
        mobile:
          "El botón de abajo a la derecha pasa tu turno y muestra Skip block mientras tu Rival ataca. El reloj al lado cuenta los pasos de combate y tu tiempo.",
      },
      priority: {
        title: "Conserva tu oportunidad de responder",
        desktop:
          "Elige Hold combat priority en la parte superior del tablero para mantener tu ventana de respuesta abierta cuando tu Rival ataca. Elígelo de nuevo, o Pasar, para continuar.",
        mobile:
          "Elige Hold combat priority en la parte superior del tablero para mantener tu ventana de respuesta abierta cuando tu Rival ataca. Elígelo de nuevo, o Pasar, para continuar.",
      },
      payment: {
        title: "Elige cómo pagar",
        desktop:
          "Elige Manual payment en la parte superior del tablero para elegir tú qué Eddies o Legends pagan cada coste. Elígelo de nuevo para volver al pago automático.",
        mobile:
          "Elige Manual payment en la parte superior del tablero para elegir tú qué Eddies o Legends pagan cada coste. Elígelo de nuevo para volver al pago automático.",
      },
      settings: {
        title: "Ajusta tu partida",
        desktop:
          "Abre Match en la parte superior del tablero. En el panel, abre el menú junto a tu nombre y elige Settings, luego la pestaña Game. Puedes cambiar el aspecto de cartas y dados sin salir de la partida.",
        mobile:
          "Toca Match en la parte superior del tablero. En el panel, abre el menú junto a tu nombre y elige Settings, luego la pestaña Game.",
      },
      report: {
        title: "Reporta a un jugador",
        desktop:
          "En una partida en vivo, abre Match en la parte superior del tablero, luego el menú junto al nombre de tu Rival y elige Report player. El Rival de esta práctica es un bot. No se envía nada hasta que envíes el formulario.",
        mobile:
          "En una partida en vivo, toca Match en la parte superior del tablero, luego el menú junto al nombre de tu Rival y elige Report player. El Rival de esta práctica es un bot. No se envía nada hasta que envíes el formulario.",
      },
      bug: {
        title: "La partida puede fallar",
        desktop:
          "La partida puede fallar. Abre Match en la parte superior del tablero, el menú junto a tu nombre y elige Report bug para que lo arreglemos. Envía siempre un reporte cuando algo se rompa. Es distinto de Report player. No se envía nada hasta que envíes el formulario.",
        mobile:
          "La partida puede fallar. Toca Match en la parte superior del tablero, el menú junto a tu nombre y elige Report bug para que lo arreglemos. Envía siempre un reporte cuando algo se rompa. No se envía nada hasta que envíes el formulario.",
      },
      correction: {
        title: "Corrige el tablero",
        desktop:
          "Si un bug ocurre en mitad de una partida, puedes corregir el tablero. En práctica local, abre Match, luego el menú junto a tu nombre y elige Enable Board State Correction. Se activa sin que nadie lo acepte. Contra un bot, elige Request Board State Correction… del mismo modo. Contra un humano, ambos podéis editar solo tras aceptarlo. Haz clic en cartas, equipo adjunto, deck, basura, Gigs y Eddies, y luego elige Exit.",
        mobile:
          "Si un bug ocurre en mitad de una partida, puedes corregir el tablero. En práctica local, toca Match, luego el menú junto a tu nombre y elige Enable Board State Correction. Se activa sin que nadie lo acepte. Contra un bot, elige Request Board State Correction… del mismo modo. Contra un humano, ambos podéis editar solo tras aceptarlo. Toca cartas, equipo adjunto, deck, basura, Gigs y Eddies, y luego elige Exit.",
      },
      undo: {
        title: "Deshaz un movimiento",
        desktop:
          "Elige la flecha en la parte superior del tablero para deshacer la última acción deshacible. Para Undo to turn start, abre Match y el menú junto a tu nombre. En una partida clasificada en vivo el rival debe aceptar. En otras partidas se aplica sin preguntar.",
        mobile:
          "Elige la flecha en la parte superior del tablero para deshacer la última acción deshacible. Para Undo to turn start, abre Match y el menú junto a tu nombre. En una partida clasificada en vivo el rival debe aceptar. En otras partidas se aplica sin preguntar.",
      },
    },
  },
  it: {
    steps: {
      cards: {
        title: "Il nuovo tavolo",
        desktop:
          "Questo è il nuovo tavolo 3D. La tua mano è in basso. Fai clic su una carta per vedere le tue azioni, oppure trascinala su un'area evidenziata, come il tuo campo o l'area di vendita. Solo le azioni consentite funzionano.",
        mobile:
          "Questo è il nuovo tavolo 3D. La tua mano è in basso. Tocca una carta per vedere le tue azioni, oppure trascinala su un'area evidenziata. Se trascinare è difficile, usa le azioni della carta.",
      },
      sell: {
        title: "Vendi una carta",
        desktop:
          "Trova una carta con Sell nella tua mano e inizia a trascinarla verso i tuoi Gigs. L'area Drop to sell si illumina in basso a sinistra. Rilascia la carta lì per ottenere un Eddie, oppure fai clic sulla carta e scegli Sell.",
        mobile:
          "Trova una carta con Sell nella tua mano e inizia a trascinarla verso i tuoi Gigs. L'area Drop to sell si illumina in basso a sinistra. Rilascia la carta lì per ottenere un Eddie, oppure tocca la carta e scegli Sell.",
      },
      play: {
        title: "Gioca una carta",
        desktop:
          "Trascina una carta dalla mano sul YOUR FIELD — mostra DROP TO PLAY mentre trascini. Il gioco paga con Eddies e Legends disponibili, a meno che il pagamento manuale sia attivo.",
        mobile:
          "Trascina una carta dalla mano sul YOUR FIELD — mostra DROP TO PLAY mentre trascini. Il gioco paga per te, a meno che il pagamento manuale sia attivo.",
      },
      eddies: {
        title: "Leggi le tue risorse",
        desktop:
          "La pillola €$ mostra gli Eddies pronti che pagano i tuoi costi. Il pallino accanto è la tua azione di Sell una volta per turno, e le carte vendute si allineano sulla barra. Fai clic sulla pillola per aprire i tuoi Eddies.",
        mobile:
          "La pillola €$ mostra gli Eddies pronti che pagano i tuoi costi. Il pallino accanto è la tua azione di Sell una volta per turno, e le carte vendute si allineano sulla barra. Tocca la pillola per aprire i tuoi Eddies.",
      },
      attack: {
        title: "Attacca",
        desktop:
          "Usa una Unit pronta del tuo campo. Trascinala su una Unit rivale per attaccarla, oppure sull'area accanto al nome del tuo Rival per colpirlo direttamente.",
        mobile:
          "Usa una Unit pronta del tuo campo. Trascinala su una Unit rivale per attaccarla, oppure sull'area accanto al nome del tuo Rival per colpirlo direttamente.",
      },
      block: {
        title: "Blocca un attacco",
        desktop:
          "Il Rival attacca. Trascina una delle tue Unit pronte sull'attacco per bloccare, oppure fai clic e scegli Block. Puoi anche scegliere Skip block due volte per lasciar passare l'attacco.",
        mobile:
          "Il Rival attacca. Trascina una delle tue Unit pronte sull'attacco per bloccare, oppure toccala e scegli Block. Puoi anche scegliere Skip block due volte per lasciar passare l'attacco.",
      },
      actions: {
        title: "Passa e l'orologio",
        desktop:
          "Il pulsante in basso a destra passa il tuo turno e mostra Skip block mentre il tuo Rival attacca. L'orologio accanto conta i passi di combattimento e il tuo tempo.",
        mobile:
          "Il pulsante in basso a destra passa il tuo turno e mostra Skip block mentre il tuo Rival attacca. L'orologio accanto conta i passi di combattimento e il tuo tempo.",
      },
      priority: {
        title: "Tieni aperta la risposta",
        desktop:
          "Seleziona Hold combat priority in alto al tavolo per tenere aperta la tua finestra di risposta quando il tuo Rival attacca. Selezionalo di nuovo, o Passa, per continuare.",
        mobile:
          "Seleziona Hold combat priority in alto al tavolo per tenere aperta la tua finestra di risposta quando il tuo Rival attacca. Selezionalo di nuovo, o Passa, per continuare.",
      },
      payment: {
        title: "Scegli come pagare",
        desktop:
          "Seleziona Manual payment in alto al tavolo per scegliere tu quali Eddies o Legends pagano ogni costo. Selezionalo di nuovo per tornare al pagamento automatico.",
        mobile:
          "Seleziona Manual payment in alto al tavolo per scegliere tu quali Eddies o Legends pagano ogni costo. Selezionalo di nuovo per tornare al pagamento automatico.",
      },
      settings: {
        title: "Regola la tua partita",
        desktop:
          "Apri Match in alto al tavolo. Nel pannello, apri il menu accanto al tuo nome e scegli Settings, poi la scheda Game. Puoi cambiare l'aspetto di carte e dadi senza uscire dalla partita.",
        mobile:
          "Tocca Match in alto al tavolo. Nel pannello, apri il menu accanto al tuo nome e scegli Settings, poi la scheda Game.",
      },
      report: {
        title: "Segnala un giocatore",
        desktop:
          "In una partita dal vivo, apri Match in alto al tavolo, poi il menu accanto al nome del tuo Rival e scegli Report player. Il Rival di questo allenamento è un bot. Nulla viene inviato finché non invii il modulo.",
        mobile:
          "In una partita dal vivo, tocca Match in alto al tavolo, poi il menu accanto al nome del tuo Rival e scegli Report player. Il Rival di questo allenamento è un bot. Nulla viene inviato finché non invii il modulo.",
      },
      bug: {
        title: "La partita può fallire",
        desktop:
          "La partita può fallire. Apri Match in alto al tavolo, il menu accanto al tuo nome e scegli Report bug così possiamo correggere. Invia sempre un reporte quando qualcosa si rompe. È separato da Report player. Nulla viene inviato finché non invii il modulo.",
        mobile:
          "La partita può fallire. Tocca Match in alto al tavolo, il menu accanto al tuo nome e scegli Report bug così possiamo correggere. Invia sempre un reporte quando qualcosa si rompe. Nulla viene inviato finché non invii il modulo.",
      },
      correction: {
        title: "Correggi il tavolo",
        desktop:
          "Se un bug arriva in mezzo a una partita, puoi correggere il tavolo. In pratica locale, apri Match, poi il menu accanto al tuo nome e scegli Enable Board State Correction. Si attiva senza che qualcuno accetti. Contro un bot, scegli Request Board State Correction… allo stesso modo. Contro un umano, potete modificare tutti e due solo dopo l'accettazione. Fai clic su carte, equipaggiamento allegato, deck, spazzatura, Gigs ed Eddies, poi scegli Exit.",
        mobile:
          "Se un bug arriva in mezzo a una partita, puoi correggere il tavolo. In pratica locale, tocca Match, poi il menu accanto al tuo nome e scegli Enable Board State Correction. Si attiva senza che qualcuno accetti. Contro un bot, scegli Request Board State Correction… allo stesso modo. Contro un umano, potete modificare tutti e due solo dopo l'accettazione. Tocca carte, equipaggiamento allegato, deck, spazzatura, Gigs ed Eddies, poi scegli Exit.",
      },
      undo: {
        title: "Annulla una mossa",
        desktop:
          "Seleziona la freccia in alto al tavolo per annullare l'ultima azione annullabile. Per Undo to turn start, apri Match e il menu accanto al tuo nome. In una partita classificata dal vivo l'avversario deve accettare. Nelle altre partite l'annullamento si applica senza chiedere.",
        mobile:
          "Seleziona la freccia in alto al tavolo per annullare l'ultima azione annullabile. Per Undo to turn start, apri Match e il menu accanto al tuo nome. In una partita classificata dal vivo l'avversario deve accettare. Nelle altre partite l'annullamento si applica senza chiedere.",
      },
    },
  },
  "pt-br": {
    steps: {
      cards: {
        title: "O novo tabuleiro",
        desktop:
          "Esta é a nova mesa 3D. Sua mão fica na parte de baixo. Clique em uma carta para ver suas ações, ou arraste-a até uma área destacada, como seu campo ou a área de venda. Só movimentos permitidos funcionam.",
        mobile:
          "Esta é a nova mesa 3D. Sua mão fica na parte de baixo. Toque em uma carta para ver suas ações, ou arraste-a até uma área destacada. Se arrastar for difícil, use as ações da carta.",
      },
      sell: {
        title: "Venda uma carta",
        desktop:
          "Ache uma carta com Sell na sua mão e comece a arrastá-la na direção dos seus Gigs. A área Drop to sell acende no canto inferior esquerdo. Solte a carta ali para receber um Eddie, ou clique nela e escolha Sell.",
        mobile:
          "Ache uma carta com Sell na sua mão e comece a arrastá-la na direção dos seus Gigs. A área Drop to sell acende no canto inferior esquerdo. Solte a carta ali para receber um Eddie, ou toque nela e escolha Sell.",
      },
      play: {
        title: "Jogue uma carta",
        desktop:
          "Arraste uma carta da mão até o YOUR FIELD — ele mostra DROP TO PLAY enquanto você arrasta. O jogo paga com Eddies e Legends disponíveis, a menos que o pagamento manual esteja ativo.",
        mobile:
          "Arraste uma carta da mão até o YOUR FIELD — ele mostra DROP TO PLAY enquanto você arrasta. O jogo paga por você, a menos que o pagamento manual esteja ativo.",
      },
      eddies: {
        title: "Leia seus recursos",
        desktop:
          "A pílula €$ mostra os Eddies prontos que pagam seus custos. O ponto ao lado é sua ação de Sell uma vez por turno, e as cartas vendidas se enfileiram no trilho. Clique na pílula para abrir seus Eddies.",
        mobile:
          "A pílula €$ mostra os Eddies prontos que pagam seus custos. O ponto ao lado é sua ação de Sell uma vez por turno, e as cartas vendidas se enfileiram no trilho. Toque na pílula para abrir seus Eddies.",
      },
      attack: {
        title: "Ataque",
        desktop:
          "Use uma Unit pronta do seu campo. Arraste-a até uma Unit rival para atacá-la, ou até a área perto do nome do seu Rival para golpeá-lo diretamente.",
        mobile:
          "Use uma Unit pronta do seu campo. Arraste-a até uma Unit rival para atacá-la, ou até a área perto do nome do seu Rival para golpeá-lo diretamente.",
      },
      block: {
        title: "Bloqueie um ataque",
        desktop:
          "Seu Rival está atacando. Arraste uma de suas Units prontas até o ataque para bloquear, ou clique nela e escolha Block. Você também pode escolher Skip block duas vezes para deixar o ataque passar.",
        mobile:
          "Seu Rival está atacando. Arraste uma de suas Units prontas até o ataque para bloquear, ou toque nela e escolha Block. Você também pode escolher Skip block duas vezes para deixar o ataque passar.",
      },
      actions: {
        title: "Passar e o relógio",
        desktop:
          "O botão no canto inferior direito passa seu turno e mostra Skip block enquanto seu Rival ataca. O relógio ao lado conta os passos de combate e seu tempo.",
        mobile:
          "O botão no canto inferior direito passa seu turno e mostra Skip block enquanto seu Rival ataca. O relógio ao lado conta os passos de combate e seu tempo.",
      },
      priority: {
        title: "Mantenha tempo para responder",
        desktop:
          "Escolha Hold combat priority na parte de cima do tabuleiro para manter sua janela de resposta aberta quando seu Rival ataca. Escolha de novo, ou Passar, para continuar.",
        mobile:
          "Escolha Hold combat priority na parte de cima do tabuleiro para manter sua janela de resposta aberta quando seu Rival ataca. Escolha de novo, ou Passar, para continuar.",
      },
      payment: {
        title: "Escolha como pagar",
        desktop:
          "Escolha Manual payment na parte de cima do tabuleiro para escolher você quais Eddies ou Legends pagam cada custo. Escolha de novo para voltar ao pagamento automático.",
        mobile:
          "Escolha Manual payment na parte de cima do tabuleiro para escolher você quais Eddies ou Legends pagam cada custo. Escolha de novo para voltar ao pagamento automático.",
      },
      settings: {
        title: "Ajuste sua partida",
        desktop:
          "Abra Match na parte de cima do tabuleiro. No painel, abra o menu perto do seu nome e escolha Settings, depois a aba Game. Você pode mudar a aparência de cartas e dados sem sair da partida.",
        mobile:
          "Toque em Match na parte de cima do tabuleiro. No painel, abra o menu perto do seu nome e escolha Settings, depois a aba Game.",
      },
      report: {
        title: "Denuncie um jogador",
        desktop:
          "Em uma partida ao vivo, abra Match na parte de cima do tabuleiro, depois o menu perto do nome do seu Rival e escolha Report player. O Rival desta prática é um bot. Nada é enviado até você enviar o formulário.",
        mobile:
          "Em uma partida ao vivo, toque em Match na parte de cima do tabuleiro, depois o menu perto do nome do seu Rival e escolha Report player. O Rival desta prática é um bot. Nada é enviado até você enviar o formulário.",
      },
      bug: {
        title: "A partida pode falhar",
        desktop:
          "A partida pode falhar. Abra Match na parte de cima do tabuleiro, o menu perto do seu nome e escolha Report bug para que possamos corrigir. Sempre envie um reporte quando algo quebrar. Isso é separado de Report player. Nada é enviado até você enviar o formulário.",
        mobile:
          "A partida pode falhar. Toque em Match na parte de cima do tabuleiro, o menu perto do seu nome e escolha Report bug para que possamos corrigir. Sempre envie um reporte quando algo quebrar. Nada é enviado até você enviar o formulário.",
      },
      correction: {
        title: "Corrija o tabuleiro",
        desktop:
          "Se um bug acontecer no meio de uma partida, você pode corrigir o tabuleiro. Na prática local, abra Match, depois o menu perto do seu nome e escolha Enable Board State Correction. Ele ativa sem alguém aceitar. Contra um bot, escolha Request Board State Correction… do mesmo jeito. Contra um humano, os dois só podem editar depois de aceitar. Clique em cartas, equipamento anexado, deck, lixo, Gigs e Eddies, depois escolha Exit.",
        mobile:
          "Se um bug acontecer no meio de uma partida, você pode corrigir o tabuleiro. Na prática local, toque em Match, depois o menu perto do seu nome e escolha Enable Board State Correction. Ele ativa sem alguém aceitar. Contra um bot, escolha Request Board State Correction… do mesmo jeito. Contra um humano, os dois só podem editar depois de aceitar. Toque em cartas, equipamento anexado, deck, lixo, Gigs e Eddies, depois escolha Exit.",
      },
      undo: {
        title: "Desfaça um movimento",
        desktop:
          "Escolha a seta na parte de cima do tabuleiro para desfazer a última ação que pode ser desfeita. Para Undo to turn start, abra Match e o menu perto do seu nome. Em uma partida ranqueada ao vivo o oponente precisa aceitar. Nas outras partidas a ação se aplica sem perguntar.",
        mobile:
          "Escolha a seta na parte de cima do tabuleiro para desfazer a última ação que pode ser desfeita. Para Undo to turn start, abra Match e o menu perto do seu nome. Em uma partida ranqueada ao vivo o oponente precisa aceitar. Nas outras partidas a ação se aplica sem perguntar.",
      },
    },
  },
};
