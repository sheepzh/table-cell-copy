declare namespace copier {
    type Command = "copy"
    type Manifest = chrome.runtime.ManifestV3 & {
        commands: Record<copier.Command, chrome.runtime.ManifestV3['commands']['foobar']>
    }
}
