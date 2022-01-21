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

    const maxLength = 200
    if (text.length > maxLength) text = text.substring(0, maxLength) + '...'

    const raw = await getTemplate()

    const params = {
        text,
        domain: req.params.domain,
        //font: Math.floor(Math.sqrt((740 * 190) / text.length)) * 1.15,
    }

    params.lineHeight = 'auto' //params.font * 0.5;

    const html = compileTemplate(raw, params, {
        debug: viewDebug
    })

    if (viewHTML) return res.send(html)

    const image = await nodeHtmlToImage({
        html,
        waitUntil: 'domcontentloaded'
            /*beforeScreenshot: (page) => {
                page.$eval('.spy', (text) => {
                })
            }*/
    })

    res.writeHead(200, {
        'Content-Type': 'image/png'
    })

    // 6419

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

app.listen(3333)

export const viteNodeApp = app