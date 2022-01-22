import { readFile } from 'fs/promises'
import express from 'express'
import nodeHtmlToImage from 'node-html-to-image'

const app = express()

// Encodate b64 dans les devtool : btoa("Je suis un text\nsur deux lignes")

// ?debug pour afficher les couleurs
// ?html pour afficher la version HTML avant conversion
// ? sur text ça permet d'afficher une erreur plus parlante si pas de text

app.get('/img/:text?/:footer?', async function(req, res) {
    const viewDebug = 'debug' in req.query
    const viewHTML = 'html' in req.query
    const maxLength = 200

    // check text
    if (!req.params.text) {
        res.status(400).send('Missing text parameter')
        return
    }
    let text = req.params.text
    // valid base64 ?
    if (!isBase64(text)) {
        res.status(400).send('Invalid base64 for text parameter')
        return
    }
    text = Buffer.from(text, 'base64').toString().trim().replaceAll('\n', '<br />')
    if (text.length > maxLength) text = text.substring(0, maxLength) + '...'

    // check footer
    let footer = req.params.footer
    if (footer) {
        if (!isBase64(footer)) {
            res.status(400).send('Invalid base64 for footer parameter')
            return
        }
        footer = Buffer.from(footer, 'base64').toString()
        if (footer.length > maxLength) footer = footer.substring(0, maxLength) + '...'
    } else {
        footer = ''
    }

    const raw = await getTemplate()

    const params = {
        text,
        footer
    }

    const html = compileTemplate(raw, params, {
        debug: viewDebug
    })

    if (viewHTML) return res.send(html)

    const image = await nodeHtmlToImage({
        html,
        waitUntil: 'domcontentloaded'
    })

    res.writeHead(200, {
        'Content-Type': 'image/png',
        'Cache-Control': 'max-age=86400, s-maxage=84000, stale-if-error=3600',
        'Cloudflare-CDN-Cache-Control': 'max-age=24400, stale-if-error=3600',
        'CDN-Cache-Control': '18000, stale-if-error=3600'
    })

    res.end(image, 'binary')
})

async function getTemplate() {
    let raw

    try {
        raw = await readFile('./template.html', { encoding: 'utf8' })
    } catch (err) {
        console.log(err)
        throw new Error('Fuck ! template not found')
    }

    return raw
}

function compileTemplate(html, vars, options) {
    let res = html

    for (let [k, v] of Object.entries(vars)) {
        res = res.replaceAll(`|${k}|`, v)
    }

    res = res.replaceAll('|body-css|', options.debug ? 'debug' : '')

    return res
}

// not perfect but enough for now
function isBase64(str) {
    try {
        return btoa(atob(str)) == str;
    } catch (err) {
        return false;
    }
}

app.listen(3333)

export const viteNodeApp = app
