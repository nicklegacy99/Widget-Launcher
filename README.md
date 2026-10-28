# Widget Launcher

A minimal, text-only Home Screen launcher for the [Scripting](https://apps.apple.com/us/app/-/id6479691128) app.
Each word on the widget opens its app **directly** — no Scripting flash, no Shortcuts automation.

## How it works

Each word is a `<Link url="...">` pointing at the target app's own URL scheme
(`spotify://`, `mobilenotes://`, `sms:` ...). When you tap it, iOS opens that app directly.
The old route (widget → Scripting → automation → app) isn't needed.

Apps with no URL scheme (Camera, Clock, most banking apps) fall back to running a Shortcut,
which briefly flashes the Shortcuts app.

## Install

1. In the Files app, open `iCloud Drive › Scripting › scripts` and replace the
   contents of the old `App Launcher` folder with the 4 files in [`App Launcher/`](App%20Launcher/).
   (Or create a new script in Scripting and paste each file in.)
2. Add a **Scripting** widget to the Home Screen, **Medium** or **Large** size.
3. Long-press it → **Edit Widget** → choose script **App Launcher**.
4. In **Parameter**, list your apps, separated by commas:

   ```
   Messages, Phone, Mail, Notes, Spotify, Camera
   ```

Leave the parameter empty to get the default list
(Messages, Phone, Mail, Maps, Calendar, Notes, Reminders, Music).
You can add several widgets with different lists.

## Parameter format

| You write                | What happens                                              |
| ------------------------ | --------------------------------------------------------- |
| `Notes`                  | Uses the built-in scheme in `apps.ts`                     |
| `Strava=strava://`       | Opens that URL (anything with a `:` counts as a URL)      |
| `Bank=Open Bank`         | Runs the Shortcut named `Open Bank`                       |
| `Camera` (not built in)  | Runs the Shortcut named `Camera`                          |

For a Shortcut fallback: in Shortcuts, create a shortcut with one action, **Open App → (your app)**,
and give it the name you used.

## Notes

- **Small widgets** can only have one tap target in iOS, so a small widget shows and opens just
  the first app in the list. Use Medium/Large for a list.
- Third-party schemes only work if that app is installed. If a word does nothing when tapped,
  that app's scheme is wrong or has changed: give it a `Name=scheme://` override, or use the Shortcut fallback.
- `index.tsx` only previews the widget when you run the script in the app.
