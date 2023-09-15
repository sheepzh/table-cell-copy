import { IS_MV3 } from "@util/constant/environment"
import { handleError } from "./common"

export async function executeFunc(tabId: number, func: () => void): Promise<void> {
    console.log(IS_MV3, func.toString())
    if (IS_MV3) {
        try {
            await chrome.scripting.executeScript<any, void>({ target: { tabId }, func })
        } catch (e) {
            console.error(e)
        }
    } else {
        await executeFuncMv2(tabId, func)
    }
}

function executeFuncMv2(tabId: number, func: () => void): Promise<void> {
    return new Promise(resolve => {
        chrome.tabs.executeScript(tabId, { code: func.toString() }, () => {
            handleError('executeScript')
            resolve()
        })
    })
}