import { Link, Text, VirtualNode, VStack, Widget } from "scripting"

// Built-in URL schemes. iOS routes every widget tap through Scripting first,
// which then opens the URL, so Scripting appears briefly before the app.
// Add your own here, or inline in the widget parameter as `Name=scheme://`.
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


// Fallback for apps without a URL scheme (Messages, Camera, Housecall Pro, ...):
// make a Shortcut named "Open <App>" whose only action is "Open App".
// This briefly flashes the Shortcuts app, which is the best iOS allows.
function shortcutURL(name: string): string {
  return `shortcuts://run-shortcut?name=${encodeURIComponent(name)}`
}

// Parameter format (set in the widget's settings on the Home Screen):
//   Messages, Notes, Spotify, Bank=Open Bank, Strava=strava://
// - `Name`             built-in scheme above, otherwise runs the Shortcut "Open Name"
// - `Name=scheme://`   anything containing ":" is opened as a URL
// - `Name=Shortcut`    runs the Shortcut with that exact name
function parseItems(parameter: string | null | undefined, fallback: string): { label: string, url: string }[] {
  const source = parameter != null && parameter.trim() !== "" ? parameter : fallback

  return source
    .split(/[,;|\n]/)
    .map(part => part.trim())
    .filter(part => part !== "")
    .map(part => {
      const eq = part.indexOf("=")
      const label = (eq === -1 ? part : part.slice(0, eq)).trim()
      const target = eq === -1 ? "" : part.slice(eq + 1).trim()

      if (target.includes(":")) {
        return { label, url: target }
      }
      if (target !== "") {
        return { label, url: shortcutURL(target) }
      }
      return { label, url: SCHEMES[label.toLowerCase()] ?? shortcutURL(`Open ${label}`) }
    })
}

// Your app list, top to bottom. Used when the widget's Parameter is left empty.
const DEFAULT_APPS = `
Messages
Outlook
Housecall Pro
Phone
Calendar
Notes
`

const items = parseItems(Widget.parameter, DEFAULT_APPS)

// Size the text so the list fills the widget's height.
const height = Widget.displaySize.height
const fontSize = Math.max(13, Math.min(30, Math.floor(height / (items.length * 1.45))))
const rowSpacing = Math.max(0, Math.floor((height - 8 - items.length * fontSize * 1.2) / Math.max(1, items.length - 1)))

function LauncherView() {
  // Small widgets only support one tap target for the whole widget,
  // so they launch the first app in the list.
  if (Widget.family === "systemSmall") {
    const first = items[0]
    return <VStack
      alignment={"leading"}
      frame={{ maxWidth: "infinity", maxHeight: "infinity", alignment: "bottomLeading" }}
      padding={4}
      widgetURL={first?.url}
    >
      <Text font={30} fontWeight={"light"} foregroundStyle={"label"}>
        {first?.label ?? ""}
      </Text>
    </VStack>
  }

  const rows: VirtualNode[] = items.map(item =>
    <Link url={item.url}>
      <Text
        font={fontSize}
        fontWeight={"light"}
        foregroundStyle={"label"}
        lineLimit={1}
      >
        {item.label}
      </Text>
    </Link>
  )

  return <VStack
    alignment={"leading"}
    spacing={rowSpacing}
    frame={{ maxWidth: "infinity", maxHeight: "infinity", alignment: "topLeading" }}
    padding={4}
  >
    {rows}
  </VStack>
}

Widget.present(<LauncherView />)
