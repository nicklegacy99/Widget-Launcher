import { Button, Link, Text, VirtualNode, VStack, Widget } from "scripting"

// Everything on the widget comes from its Parameter (Edit Widget > Parameter),
// one word per app, separated by commas, shown top to bottom:
//
//   Messages=1, Outlook=2, Calendar, Notes, Bank=Open Bank, Strava=strava://
//
// - `Name=1` to `Name=4`  tap runs that Shortcut slot from Edit Widget (iOS 27).
//                         Opens the app without Scripting appearing.
// - `Name`                built-in URL scheme below, otherwise runs the Shortcut "Open Name"
// - `Name=scheme://`      anything containing ":" is opened as a URL
// - `Name=Shortcut`       runs the Shortcut with that exact name
//
// Words without a slot are Links: iOS routes those taps through Scripting first,
// so Scripting appears briefly before the app. An empty Parameter shows nothing.

// Built-in URL schemes. Add your own here, or inline as `Name=scheme://`.
const SCHEMES: Record<string, string> = {
  // Apple
  // Messages has no URL that opens the inbox (sms: and messages:// both start a
  // new message on iOS 26), so it uses the "Open Messages" Shortcut fallback.
  "phone": "mobilephone://",
  "mail": "message://",
  "maps": "maps://",
  "calendar": "calshow://",
  "notes": "mobilenotes://",
  "reminders": "x-apple-reminderkit://",
  "music": "music://",
  "photos": "photos-redirect://",
  "podcasts": "podcasts://",
  "files": "shareddocuments://",
  "shortcuts": "shortcuts://",
  "app store": "itms-apps://",
  "settings": "App-prefs:",
  "safari": "x-web-search://",

  // Third party (only work if the app is installed)
  "spotify": "spotify://",
  "instagram": "instagram://",
  "youtube": "youtube://",
  "whatsapp": "whatsapp://",
  "gmail": "googlegmail://",
  "outlook": "ms-outlook://",
  "chrome": "googlechrome://",
  "slack": "slack://",
  "discord": "discord://",
  "reddit": "reddit://",
  "notion": "notion://",
  "venmo": "venmo://",
  "uber": "uber://",
}

type LaunchItem = {
  label: string
  url: string
  // 1-based Shortcut slot from Edit Widget, if the word has one.
  slot?: number
}

// Fallback for apps without a URL scheme (Messages, Camera, Housecall Pro, ...):
// make a Shortcut named "Open <App>" whose only action is "Open App".
// This briefly flashes the Shortcuts app.
function shortcutURL(name: string): string {
  return `shortcuts://run-shortcut?name=${encodeURIComponent(name)}`
}

function defaultURL(label: string): string {
  return SCHEMES[label.toLowerCase()] ?? shortcutURL(`Open ${label}`)
}

function parseItems(parameter: string | null | undefined): LaunchItem[] {
  return (parameter ?? "")
    .split(/[,;|\n]/)
    .map(part => part.trim())
    .filter(part => part !== "")
    .map(part => {
      const eq = part.indexOf("=")
      const label = (eq === -1 ? part : part.slice(0, eq)).trim()
      const target = eq === -1 ? "" : part.slice(eq + 1).trim()

      if (/^\d+$/.test(target)) {
        // A slot word still gets a URL in case its slot isn't available.
        return { label, url: defaultURL(label), slot: Number(target) }
      }
      if (target.includes(":")) {
        return { label, url: target }
      }
      if (target !== "") {
        return { label, url: shortcutURL(target) }
      }
      return { label, url: defaultURL(label) }
    })
    .filter(item => item.label !== "")
}

const items = parseItems(Widget.parameter)

// Scripting 3.2.1 has four fixed slots set with `shortcut="shortcut1"`.
// 3.2.2+ has an open-ended list set with `shortcutIndex={0}` and reports
// how many actions are configured (0 before iOS 27).
const hasShortcutList = typeof (Widget as any).shortcutCount === "number"
const slotCount: number = hasShortcutList ? (Widget as any).shortcutCount : 4

function usesSlot(item: LaunchItem): boolean {
  return item.slot != null && item.slot >= 1 && item.slot <= slotCount
}

// The two Scripting versions name the button prop differently; build it
// untyped so the file compiles against either version's type definitions.
function slotProps(slot: number): any {
  return hasShortcutList
    ? { shortcutIndex: slot - 1 }
    : { shortcut: `shortcut${slot}` }
}

// Bold, evenly spaced list anchored to the top. The font only shrinks when
// the list wouldn't otherwise fit. No background is drawn here, so the
// widget's Background setting (e.g. transparent) shows through.
const PADDING = { top: 14, leading: 18, bottom: 14, trailing: 18 }
const MAX_FONT = 22
const LINE_HEIGHT = 1.2
const GAP = 0.55
const available = Widget.displaySize.height - PADDING.top - PADDING.bottom
const fontSize = Math.max(12, Math.min(MAX_FONT,
  Math.floor(available / Math.max(1, items.length * (LINE_HEIGHT + GAP) - GAP))))
const rowSpacing = Math.round(fontSize * GAP)

function Label({ text }: { text: string }) {
  return <Text
    font={fontSize}
    fontWeight={"semibold"}
    foregroundStyle={"label"}
    lineLimit={1}
  >
    {text}
  </Text>
}

function LauncherView() {
  if (items.length === 0) {
    return <VStack />
  }

  // A small widget without slot buttons has only one tap target,
  // so it shows and launches just the first app.
  if (Widget.family === "systemSmall" && !items.some(usesSlot)) {
    const first = items[0]
    return <VStack
      alignment={"leading"}
      frame={{ maxWidth: "infinity", maxHeight: "infinity", alignment: "topLeading" }}
      padding={PADDING}
      widgetURL={first.url}
    >
      <Label text={first.label} />
    </VStack>
  }

  const rows: VirtualNode[] = items.map(item =>
    usesSlot(item)
      ? <Button {...slotProps(item.slot!)} buttonStyle={"plain"}>
        <Label text={item.label} />
      </Button>
      : <Link url={item.url}>
        <Label text={item.label} />
      </Link>
  )

  return <VStack
    alignment={"leading"}
    spacing={rowSpacing}
    frame={{ maxWidth: "infinity", maxHeight: "infinity", alignment: "topLeading" }}
    padding={PADDING}
  >
    {rows}
  </VStack>
}

Widget.present(<LauncherView />)
