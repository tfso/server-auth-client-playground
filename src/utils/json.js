import html from './html.js'

export const useJson = (json) => {
    let output = ''

    const render = (obj, depth = 0) => {
        if(!obj) {
            if(obj === null)
                return 'null'

            if(obj === undefined)
                return 'undefined'
            
            return ''
        }

        switch(typeof obj) {
            case 'object':
                if(Array.isArray(obj)) {
                    return html`[
                        ${obj.map(value => html`<div style="padding-left:${15 * (depth + 2)}px; width: max-content">${render(value, depth)}</div>`)}
                    ]`
                }
                else {
                    const output = []

                    output.push(html`<span style="clear: right">{</span>`)
                    for(let [key, value] of Object.entries(obj)) {
                        output.push(html`<div style="padding-left: ${15 * (depth + 1)}px; width: max-content">"${key}": ${render(value, depth)}</div>`)
                    }
                    output.push(html`<div style="padding-left: ${15 * (depth)}px;">}</div>`)

                    return output
                }

            case 'number':
                return html`${obj}`

            case 'string':
                return html`"${obj.replace(/\n/, '')}"`

            default:
                return ''
        }
    }

    const setJson = (json) => {
        output = render(json)
    }

    if(json)
        setJson(json)

    return {
        json: output,
        setJson
    }
}
