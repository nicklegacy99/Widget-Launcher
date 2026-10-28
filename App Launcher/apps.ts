// Built-in URL schemes. Tapping a Link in a widget hands the URL straight to iOS,
// which opens the app that owns the scheme. Scripting never comes to the front.
// Add your own here, or inline in the widget parameter as `Name=scheme://`.
export const SCHEMES: Record<string, string> = {
  // Apple
  "messages": "sms:",
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
  "chrome": "googlechrome://",
  "slack": "slack://",
  "discord": "discord://",
  "reddit": "reddit://",
  "notion": "notion://",
  "venmo": "venmo://",
  "uber": "uber://",
}

export type LaunchItem = {
  label: string
  url: string
}

// Fallback for apps without a URL scheme (Camera, Clock, banking apps, ...):
// make a Shortcut whose only action is "Open App", and the widget runs it.
// This briefly flashes the Shortcuts app, which is the best iOS allows.
export function shortcutURL(name: string): string {
  return `shortcuts://run-shortcut?name=${encodeURIComponent(name)}`
}

// Parameter format (set in the widget's settings on the Home Screen):
//   Messages, Notes, Spotify, Bank=Open Bank, Strava=strava://
// - `Name`             built-in scheme above, otherwise runs a Shortcut named `Name`
// - `Name=scheme://`   anything containing ":" is opened as a URL
// - `Name=Shortcut`    runs the Shortcut with that exact name
export function parseItems(parameter: string | null | undefined, fallback: string): LaunchItem[] {
  const source = parameter != null && parameter.trim() !== "" ? parameter : fallback

  return source
    .split(/[,\n]/)
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
      return { label, url: SCHEMES[label.toLowerCase()] ?? shortcutURL(label) }
    })
}
