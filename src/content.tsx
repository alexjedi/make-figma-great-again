import type { PlasmoCSConfig } from "plasmo"
import React, { useEffect, useState } from "react"
import Confetti from "react-confetti"
import { createRoot } from "react-dom/client"
import { useWindowSize } from "react-use"

interface ConfettiComponentProps {
  onComplete: () => void
}

export const config: PlasmoCSConfig = {
  matches: ["https://www.figma.com/*"]
}

interface UserSettings {
  hidePanelSideMargin: boolean
  fixTrueDarkTheme: boolean
}

const styleConfigs = [
  {
    selector:
      '[data-fpl-version="ui3"] [class*="left_panel_positioner--leftPanelPositioner"]',
    styles: `
      top: 0 !important;
      left: 0 !important;
      bottom: 0 !important;
    `,
    setting: "hidePanelSideMargin"
  },
  {
    selector:
      "[data-fpl-version=ui3] [class*='properties_panel--panelPosition']",
    styles: `
      top: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
    `,
    setting: "hidePanelSideMargin"
  },
  {
    selector:
      "[data-fpl-version=ui3] [class*='properties_panel--drillDownContainer']",
    styles: `
      right: 0 !important;
    `,
    setting: "hidePanelSideMargin"
  },
  {
    selector: "[data-fpl-version=ui3] [class*='left_panel_container--panel']",
    styles: `
      border-radius: 0 !important;
    `,
    setting: "hidePanelSideMargin"
  },
  {
    selector:
      "[data-fpl-version=ui3] [class*='properties_panel--panelContainer']",
    styles: `
      border-radius: 0 !important;
    `,
    setting: "hidePanelSideMargin"
  },
  {
    selector: "[data-preferred-theme=dark]",
    styles: `
      --color-bg: var(--ramp-grey-1000) !important;
      --color-border: var(--ramp-grey-800) !important;
    `,
    setting: "fixTrueDarkTheme"
  }
]

function applyStyles(settings: UserSettings) {
  styleConfigs.forEach((config) => {
    if (settings[config.setting]) {
      const elements = document.querySelectorAll(config.selector)
      elements.forEach((element) => {
        element.setAttribute("style", config.styles)
      })
    }
  })
  console.log("Styles applied based on settings:", settings)
}

function removeStyles() {
  styleConfigs.forEach((config) => {
    const elements = document.querySelectorAll(config.selector)
    elements.forEach((element) => {
      element.removeAttribute("style")
    })
  })
  console.log("All styles removed")
}

const ConfettiComponent = ({ onComplete }: ConfettiComponentProps) => {
  const { width, height } = useWindowSize()
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsComplete(true)
      onComplete()
    }, 2000)

    return () => clearTimeout(timer)
  }, [onComplete])

  if (isComplete) return null

  return (
    <Confetti
      width={width}
      height={height}
      numberOfPieces={1000}
      recycle={false}
    />
  )
}

function addConfettiAndApplyStyles(settings: UserSettings) {
  const confettiContainer = document.createElement("div")
  confettiContainer.id = "figma-confetti-container"
  document.body.appendChild(confettiContainer)

  const handleConfettiComplete = () => {
    root.unmount()
    confettiContainer.remove()
    applyStyles(settings)
  }

  const root = createRoot(confettiContainer)
  root.render(<ConfettiComponent onComplete={handleConfettiComplete} />)
}

// Update the global functions
;(window as any).applyFigmaStyles = (settings: UserSettings) =>
  addConfettiAndApplyStyles(settings)
;(window as any).removeFigmaStyles = removeStyles
;(window as any).updateFigmaStyles = applyStyles

// Update the message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "applyStyles") {
    ;(window as any).applyFigmaStyles(request.settings)
    sendResponse("Confetti added, styles will be applied shortly!")
  } else if (request.action === "removeStyles") {
    ;(window as any).removeFigmaStyles()
    sendResponse("Styles removed successfully!")
  } else if (request.action === "updateStyles") {
    ;(window as any).updateFigmaStyles(request.settings)
    sendResponse("Styles updated successfully!")
  }
})
