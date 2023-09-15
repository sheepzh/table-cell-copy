import pkg from "../package.json"

const manifest: copier.Manifest = {
    manifest_version: 3,
    name: "Copy any cell of table",
    description: "Copy any cell of table",
    version: pkg.version,
    author: pkg.author.email,
    homepage_url: pkg.repository.url,
    icons: {
        16: "static/images/icon.png",
        48: "static/images/icon.png",
        128: "static/images/icon.png"
    },
    background: {
        service_worker: "service_worker.js"
    },
    commands: {
        "copy": {
            suggested_key: {
                default: "Alt+C"
            },
            description: "Copy the cell where the cursor stays"
        }
    },
    permissions: [
        "scripting",
        "activeTab",
        "clipboardWrite",
    ]
}

export default manifest