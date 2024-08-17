import * as Switch from "@radix-ui/react-switch"
import { useEffect, useState } from "react"

import "./styles.css"

function IndexPopup() {
  const [message, setMessage] = useState("")
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    // Load Inter font
    const link = document.createElement("link")
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
    link.rel = "stylesheet"
    document.head.appendChild(link)

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0]
      if (activeTab.id) {
        chrome.tabs.sendMessage(
          activeTab.id,
          { action: "getState" },
          (response) => {
            if (!chrome.runtime.lastError && response) {
              setIsEnabled(response.isEnabled)
            }
          }
        )
      }
    })
  }, [])

  const sendMessage = (action: string) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0]
      if (activeTab.id) {
        chrome.tabs.sendMessage(activeTab.id, { action }, (response) => {
          if (chrome.runtime.lastError) {
            setMessage("Error: " + chrome.runtime.lastError.message)
          } else {
            setMessage(response || `${action} completed successfully!`)
          }
        })
      }
    })
  }

  const handleToggleStyles = (checked: boolean) => {
    const action = checked ? "applyStyles" : "removeStyles"
    sendMessage(action)
    setIsEnabled(checked)
  }

  return (
    <section className="bg-white w-[200px] h-[180px] text-gray-800 p-4 space-y-4 flex justify-between items-end font-['Inter',sans-serif]">
      <div className="flex flex-col items-left -mb-1">
        <h2 className="text-lg font-medium">Make</h2>
        <h2 className="text-lg font-medium">Figma</h2>
        <h2 className="text-lg font-medium">Great</h2>
        <h2 className="text-lg font-medium">Again</h2>
      </div>
      <Switch.Root
        checked={isEnabled}
        onCheckedChange={handleToggleStyles}
        className="peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-black data-[state=unchecked]:bg-gray-300"
        id="make-figma-great-again">
        <Switch.Thumb className="pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0" />
      </Switch.Root>
      {/* {message && <p>{message}</p>} */}
    </section>
  )
}

export default IndexPopup
