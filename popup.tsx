import { SettingsIcon, SlidersVertical, XIcon } from "lucide-react"
import { useEffect, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { Label } from "~/components/Label"
import { Switch } from "~/components/Switch"

import "./styles.css"

function IndexPopup() {
  const [isEnabled, setIsEnabled] = useStorage("isEnabled", false)
  const [showOptions, setShowOptions] = useState(false)
  const [hidePanelSideMargin, setHidePanelSideMargin] = useStorage(
    "hidePanelSideMargin",
    true
  )
  const [fixTrueDarkTheme, setFixTrueDarkTheme] = useStorage(
    "fixTrueDarkTheme",
    true
  )
  const [message, setMessage] = useState("")

  useEffect(() => {
    const link = document.createElement("link")
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
    link.rel = "stylesheet"
    document.head.appendChild(link)
  }, [])

  const sendMessage = (action: string, settings?: object) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0]
      if (activeTab.id) {
        chrome.tabs.sendMessage(
          activeTab.id,
          { action, settings },
          (response) => {
            if (chrome.runtime.lastError) {
              setMessage("Error: " + chrome.runtime.lastError.message)
            } else {
              setMessage(response || `${action} completed successfully!`)
            }
          }
        )
      }
    })
  }

  const handleToggleStyles = (checked: boolean) => {
    const action = checked ? "applyStyles" : "removeStyles"
    sendMessage(action, {
      hidePanelSideMargin,
      fixTrueDarkTheme
    })
    setIsEnabled(checked)
  }

  const handleHidePanelSideMarginChange = (checked: boolean) => {
    setHidePanelSideMargin(checked)
    if (isEnabled) {
      sendMessage("updateStyles", {
        hidePanelSideMargin: checked,
        fixTrueDarkTheme
      })
    }
  }

  const handleFixTrueDarkThemeChange = (checked: boolean) => {
    setFixTrueDarkTheme(checked)
    if (isEnabled) {
      sendMessage("updateStyles", {
        hidePanelSideMargin,
        fixTrueDarkTheme: checked
      })
    }
  }

  return (
    <section className="dark relative bg-background text-muted-foreground w-[260px] h-[240px] p-4 space-y-4 flex flex-col justify-center items-center font-['Inter',sans-serif]">
      {!showOptions ? (
        <>
          <Switch
            checked={isEnabled}
            onCheckedChange={handleToggleStyles}
            id="make-figma-great-again"
          />
          <div className="absolute bottom-4 w-full flex justify-center space-x-1">
            <h2 className="text-sm">Make</h2>
            <h2 className="text-sm italic">Figma</h2>
            <h2 className="text-sm font-semibold">Great</h2>
            <h2 className="text-sm underline">Again</h2>
          </div>
          <div
            className="absolute top-[0px] p-1 right-4 flex justify-center items-center cursor-pointer"
            onClick={() => setShowOptions(true)}>
            <SlidersVertical className="w-4 h-4" />
          </div>
        </>
      ) : (
        <div className="w-full h-full flex flex-col space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-medium text-base">Options</h2>
            <XIcon
              className="w-4 h-4 text-muted-foreground cursor-pointer"
              onClick={() => setShowOptions(false)}
            />
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="hide-panel-side-margin"
                checked={hidePanelSideMargin}
                onCheckedChange={handleHidePanelSideMarginChange}
              />
              <Label htmlFor="hide-panel-side-margin" className="text-sm">
                Hide panel side margin
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="fix-true-dark-theme"
                checked={fixTrueDarkTheme}
                onCheckedChange={handleFixTrueDarkThemeChange}
              />
              <Label htmlFor="fix-true-dark-theme" className="text-sm">
                Fix true dark theme
              </Label>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default IndexPopup
