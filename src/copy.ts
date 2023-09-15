export default function copy() {
    const w = console.warn
    const d = console.debug
    const write2Clip = (content: string) => navigator?.clipboard?.writeText?.(content)
        .then(() => console.log(`Cell copied: ${content}`))
        .catch(e => console.log(`Error occurred while copying cell: `, e))

    if (!document) return w("No document found")

    // Guess the initial mouse position approximately if possible:
    const hoveredElements = document.querySelectorAll(':hover')
    // Get the most specific hovered element
    const hoveredElement = hoveredElements[hoveredElements.length - 1]
    const rect = hoveredElement?.getBoundingClientRect?.()

    if (!rect) return w("Failed to found cursor")
    if (!window) return w("No window found")

    const currentMouseX = rect.x
    const currentMouseY = rect.y

    const elements = document?.elementsFromPoint(currentMouseX, currentMouseY)
    const tags = JSON.stringify(elements?.map(e => e.tagName))
    d(`mouseX=${currentMouseX}, mouseY=${currentMouseY}, tags=${tags}`)

    const th: HTMLTableCellElement = elements.filter?.(e => e.tagName === "TH")?.[0] as HTMLTableCellElement
    if (th) {
        d("Start to copy the whole column")
        const head = th.parentElement
        if (head?.tagName !== "TR") return w("Invalid <TH> element without <TR> found")
        let thList = head.getElementsByTagName("th")
        let colIdx = Array.from(thList).indexOf(th)
        if (colIdx === -1) return w("Invalid <TH> element")
        const tbody = th.parentElement?.parentElement?.parentElement?.getElementsByTagName("tbody")?.[0]
        if (!tbody) return w("Invalid table dom tree without tbody")
        const rows = tbody.getElementsByTagName("tr")
        const cells = Array.from(rows)
            .map(row => row.getElementsByTagName("td")?.[colIdx])
            .filter(row => row.checkVisibility({ checkOpacity: true }))
            .filter(cellEl => !!cellEl)
            .map(el => el.textContent?.toString?.()?.trim?.() || "")
        return write2Clip(cells.join("\n"))
    } else {
        d("Start to copy the special cell")
        const td = elements.filter?.(e => e.tagName === "TD")?.[0]
        if (!td) return w("No table cell found where the cursor stays.")

        write2Clip(td.textContent?.trim?.())
    }
}
