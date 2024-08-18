import { useEffect, useState } from "react"

import { Switch } from "~/components/Switch"

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
    <section className="dark bg-background text-primary w-[200px] h-[180px] p-4 space-y-4 flex justify-between items-end font-['Inter',sans-serif]">
      <div className="flex flex-col items-left -mb-1">
        <h2 className="text-lg font-medium">Make</h2>
        <h2 className="text-lg font-medium">Figma</h2>
        <h2 className="text-lg font-medium">Great</h2>
        <h2 className="text-lg font-medium">Again</h2>
      </div>
      <Switch
        checked={isEnabled}
        onCheckedChange={handleToggleStyles}
        id="make-figma-great-again"></Switch>
      {/* {message && <p>{message}</p>} */}
    </section>
  )
}

export default IndexPopup
