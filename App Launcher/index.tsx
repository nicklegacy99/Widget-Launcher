import { Script, Widget } from "scripting"

// Running the script in the app just previews the widget.
// Launching never goes through here: widget taps open the target app directly.
async function run() {
  await Widget.preview({ family: "systemLarge" })
  Script.exit()
}

run()
