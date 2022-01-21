import { readFile } from 'fs/promises'
import express from 'express'
import nodeHtmlToImage from 'node-html-to-image'

const app = express()

// Encodate b64 dans les devtool : btoa("Je suis un text\nsur deux lignes")

// ?debug pour afficher les couleurs
// ?html pour afficher la version HTML avant conversion

app.get('/img/:text/:domain?/:b64?', async function(req, res) {
    //const {text, template} = req.params

    const viewDebug = 'debug' in req.query
    const viewHTML = 'html' in req.query
    const isBase64 = req.params.b64

    let text = req.params.text || "T'as pas oublié un truc mec ?"
    if (isBase64) text = Buffer.from(text, 'base64').toString()
    text = text.trim().replaceAll('\n', '<br />')

    const raw = await getTemplate()

    const html = compileTemplate(raw, {
        text,
        domain: req.params.domain
    }, {
        debug: viewDebug
    })

    if (viewHTML) return res.send(html)

    const image = await nodeHtmlToImage({
        html
    })

    res.writeHead(200, {
        'Content-Type': 'image/png'
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

    if (options.debug) {
        res = res.replaceAll('|body-css|', debug ? 'debug' : '')
    }

    return res
}

app.listen(3333)

export const viteNodeApp = app