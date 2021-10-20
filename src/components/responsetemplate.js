import html from './../utils/html.js'
import { useJson } from './../utils/json.js'

export default {
    name: 'ResponseTemplate',

    data() {
        return {
            responseStatusCode: null,
            responseBody: null,
            responseHeaders: { }
        }
    },
    props: {
        title: String,
        status: Number,
        headers: Object,
        body: Object,
        buttonTitle: String
    },
    emits: {
        click: null
    },
    render() {
        const result = []
        const { json } = useJson(this.body)

        if(this.status) {
            result.push(html`<div>HTTP/1.1 ${this.status}</div>`)

            for(let [key, value] of Object.entries(this.headers ?? {})) {
                result.push(html`<div>${key}: ${value}</div>`)
            }
            
            result.push(html`<div style="padding:5px 0;">${json}</div>`)
            result.push(html`<hr />`)
        }

        return html`
            <div class="request">
                <div class="title">${this.title ?? 'Response'}</div>
                <div class="block">
                    ${result}
                    <div>
                        <button onClick=${() => { this.$emit('click') }}>${this.buttonTitle ?? 'Next'}</button>
                    </div>
                </div>
            </div>
        `
    }
}