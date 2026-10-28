import { Script, Widget } from "scripting"

// Running this script in Scripting pulls the latest files from GitHub into
// this script's folder and refreshes the widget. Widget taps never run it.
const SOURCE = "https://raw.githubusercontent.com/nicklegacy99/Widget-Launcher/app-launcher-widget/App%20Launcher"
const FILES = ["widget.tsx", "index.tsx"]

async function download(name: string): Promise<string> {
  // The query string skips GitHub's cache so a fresh push shows up right away.
  const response = await fetch(`${SOURCE}/${name}?t=${Date.now()}`)
  if (!response.ok) {
    throw new Error(`${name}: GitHub returned ${response.status}`)
  }
  return response.text()
}

async function run() {
  try {
    // Download everything before writing anything, so a failed download
    // never leaves the script half updated.
    const contents = await Promise.all(FILES.map(download))

    if (!contents[0].includes("Widget.present")) {
      throw new Error("widget.tsx from GitHub doesn't look right, so nothing was changed.")
    }

    const changed: string[] = []
    for (let i = 0; i < FILES.length; i++) {
      const path = `${Script.directory}/${FILES[i]}`
      const current = await FileManager.exists(path)
        ? await FileManager.readAsString(path)
        : ""
      if (current !== contents[i]) {
        await FileManager.writeAsString(path, contents[i])
        changed.push(FILES[i])
      }
    }

    Widget.reloadAll()

    await Dialog.alert({
      title: changed.length > 0 ? "Updated" : "Already up to date",
      message: changed.length > 0
        ? `Updated ${changed.join(" and ")}. The widget will refresh in a moment.`
        : "You already have the latest version.",
    })
  } catch (error) {
    await Dialog.alert({
      title: "Update failed",
      message: String(error),
    })
  }

  Script.exit()
}

run()
