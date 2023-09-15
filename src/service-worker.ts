import { executeFunc } from "@api/chrome/script"
import copy from "@src/copy"

function doCopy(tab: chrome.tabs.Tab) {
    const tabId = tab?.id
    if (!tabId) {
        return
    }
    executeFunc(tabId, copy)
}

chrome.commands.onCommand.addListener((cmd: copier.Command, tab) => {
    console.log(cmd, tab)
    if (cmd === "copy") {
        doCopy(tab)
    }
})