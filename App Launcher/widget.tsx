import { Link, Text, VStack, Widget } from "scripting"
import { parseItems } from "./apps"

const DEFAULT_APPS = "Messages, Phone, Mail, Maps, Calendar, Notes, Reminders, Music"

const items = parseItems(Widget.parameter, DEFAULT_APPS)

// Size the text so the list fills the widget's height.
const height = Widget.displaySize.height
const fontSize = Math.max(13, Math.min(30, Math.floor(height / (items.length * 1.45))))

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

  return <VStack
    alignment={"leading"}
    spacing={0}
    frame={{ maxWidth: "infinity", maxHeight: "infinity", alignment: "leading" }}
    padding={4}
  >
    {items.map(item =>
      <Link url={item.url}>
        <Text
          font={fontSize}
          fontWeight={"light"}
          foregroundStyle={"label"}
          lineLimit={1}
          frame={{ maxWidth: "infinity", maxHeight: "infinity", alignment: "leading" }}
        >
          {item.label}
        </Text>
      </Link>
    )}
  </VStack>
}

Widget.present(<LauncherView />)
