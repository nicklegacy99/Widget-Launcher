# Widget Launcher

A minimal, text-only Home Screen launcher for the [Scripting](https://apps.apple.com/us/app/-/id6479691128) app.
Each word on the widget opens its app. iOS routes the tap through Scripting first, so Scripting
appears briefly before the app (turn on Reduce Motion to soften it).

## iOS 27: open apps without Scripting appearing

Needs iOS 27 and Scripting 3.2.1 or later.

1. Long-press the widget → **Edit Widget** → set **Shortcut 1**–**Shortcut 4** to **Open App → (app)**.
   (Scripting 3.2.2+: **Shortcuts** → **Add New Item**, as many as you like.)
2. In **Parameter**, put `=` and the slot number after each word that should use one:

   ```
   Messages=1, Outlook=2, Housecall Pro=3, Phone=4, Calendar, Notes
   ```

Words without a number use the links below. Only numbered words use slots, so if you
fill only slots 1 and 2, number only those two words.

## How it works (fallback)

Each word is a `<Link url="...">` pointing at the target app's own URL scheme
(`ms-outlook://`, `mobilenotes://` ...). iOS opens Scripting, which hands the URL on to that app.

Apps with no usable URL scheme (Messages, Housecall Pro, Camera, ...) fall back to running a
Shortcut named `Open <App>`, which briefly flashes the Shortcuts app as well.

## Install

Create the script **inside the Scripting app**. Scripts copied in through the Files app
often don't show up in the widget's script list.

1. Open **Scripting** → tap **+** → new script → name it `App Launcher`.
2. In that script, add a file named exactly `widget.tsx`.
3. Open [`App Launcher/widget.tsx`](App%20Launcher/widget.tsx) here, tap **Raw**, select all, copy,
   and paste it into that file. Save.
4. (Optional) Run the script once in Scripting to check the widget preview.
5. Add a **Scripting** widget to the Home Screen, **Medium** or **Large** size.
   If it was already there, remove it and add it again so the script list refreshes.
6. Long-press it → **Edit Widget** → choose script **App Launcher**.
7. In **Parameter**, list your apps top to bottom, separated by commas (see below).
   An empty Parameter shows an empty widget.

## Parameter format

| You write                | What happens                                              |
| ------------------------ | --------------------------------------------------------- |
| `Notes`                  | Uses the built-in list at the top of `widget.tsx`                     |
| `Strava=strava://`       | Opens that URL (anything with a `:` counts as a URL)      |
| `Bank=Open Bank`         | Runs the Shortcut named `Open Bank`                       |
| `Camera` (not built in)  | Runs the Shortcut named `Open Camera`                     |

For a Shortcut fallback: in Shortcuts, create a shortcut with one action, **Open App → (your app)**,
and name it `Open <App>` exactly as written on the widget, e.g. `Open Messages`, `Open Housecall Pro`.

## Notes

- **Small widgets** can only have one tap target in iOS, so a small widget shows and opens just
  the first app in the list. Use Medium/Large for a list.
- Third-party schemes only work if that app is installed. If a word does nothing when tapped,
  that app's scheme is wrong or has changed: give it a `Name=scheme://` override, or use the Shortcut fallback.
- `index.tsx` is the updater: run the App Launcher script in Scripting and it downloads the
  latest `widget.tsx` and `index.tsx` from this repo's `app-launcher-widget` branch, then refreshes the widget.
