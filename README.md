# Widget Launcher

A minimal, text-only Home Screen launcher for the [Scripting](https://apps.apple.com/us/app/-/id6479691128) app.
Each word on the widget opens its app. iOS routes the tap through Scripting first, so Scripting
appears briefly before the app (turn on Reduce Motion to soften it).

## iOS 27: open apps without Scripting appearing

Needs iOS 27 and the Scripting **TestFlight** build (3.2.2 or later).

1. Long-press the widget → **Edit Widget** → **Shortcuts** → **Add New Item** → **Open App**,
   and pick each app **in the same order as the words on the widget**.
   (For Messages pick Messages itself, so it opens the inbox.)
2. Tap a word: it runs the matching action, not a link.

Words beyond the end of the Shortcuts list fall back to the links described below.
If you reorder or delete an action, reorder the words to match.

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
7. Leave **Parameter** empty to use the list at the top of `widget.tsx` (`DEFAULT_APPS`,
   one app per line, shown top to bottom). Or type a list in Parameter, separated by commas:

   ```
   Messages, Outlook, Housecall Pro, Notes
   ```

You can add several widgets with different Parameter lists.

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
- `index.tsx` only previews the widget when you run the script in the app.
