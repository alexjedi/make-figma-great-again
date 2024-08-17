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

const styleConfigs = [
  {
    selector:
      '[data-fpl-version="ui3"] .left_panel_positioner--leftPanelPositioner--8Yehe',
    styles: `
      top: 0 !important;
      left: 0 !important;
      bottom: 0 !important;
    `
  },
  {
    selector: "[data-fpl-version=ui3] .properties_panel--panelPosition--oppQ8",
    styles: `
      top: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
    `
  },
  {
    selector:
      "[data-fpl-version=ui3] .properties_panel--drillDownContainer--VaNDa",
    styles: `
      right: 0 !important;
    `
  },
  {
    selector: "[data-fpl-version=ui3] .left_panel_container--panel--ILPCV",
    styles: `
      border-radius: 0 !important;
    `
  },
  {
    selector: "[data-fpl-version=ui3] .properties_panel--panelContainer--cKjqh",
    styles: `
      border-radius: 0 !important;
    `
  },
  {
    selector: "[data-preferred-theme=dark]",
    styles: `
      --color-bg: var(--ramp-grey-1000) !important;
      --color-border: var(--ramp-grey-800) !important;
    `
  }
]

function applyStyles() {
  styleConfigs.forEach((config) => {
    const elements = document.querySelectorAll(config.selector)
    elements.forEach((element) => {
      element.setAttribute("style", config.styles)
    })
  })
  console.log("Styles applied:", styleConfigs.length)
}

function removeStyles() {
  styleConfigs.forEach((config) => {
    const elements = document.querySelectorAll(config.selector)
    elements.forEach((element) => {
      element.removeAttribute("style")
    })
  })
  console.log("Styles removed:", styleConfigs.length)
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

function addConfettiAndApplyStyles() {
  const confettiContainer = document.createElement("div")
  confettiContainer.id = "figma-confetti-container"
  document.body.appendChild(confettiContainer)

  const handleConfettiComplete = () => {
    root.unmount()
    confettiContainer.remove()
    applyStyles()
  }

  const root = createRoot(confettiContainer)
  root.render(<ConfettiComponent onComplete={handleConfettiComplete} />)
}

// Update the global functions
;(window as any).applyFigmaStyles = addConfettiAndApplyStyles
;(window as any).removeFigmaStyles = removeStyles

// Update the message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "applyStyles") {
    ;(window as any).applyFigmaStyles()
    sendResponse("Confetti added, styles will be applied shortly!")
  } else if (request.action === "removeStyles") {
    ;(window as any).removeFigmaStyles()
    sendResponse("Styles removed successfully!")
  }
})
