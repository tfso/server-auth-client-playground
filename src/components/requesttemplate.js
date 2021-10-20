import html from './../utils/html.js'

export default {
    name: 'RequestTemplate',
    data() {
        return {
            responseStatusCode: null,
            responseBody: null,
            responseHeaders: { }
        }
    },
    props: {
        title: String,
        url: String,
        params: Object,
        contentType: String,
        buttonTitle: String
    },
    computed: {
        fetchUrl() {
            return `${this.url}?${this.query}`
        },
        method() {
            switch(this.contentType) {
                case 'application/json':
                    return 'POST'
                case 'application/x-www-form-urlencoded':
                    return 'POST'
                default:
                    return 'GET'
            }
        },
        query() {
            if(this.method == 'GET') {
                return new URLSearchParams(Object.entries(this.params)).toString()
            }

            return ''
        },
        body() {
            switch(this.contentType) {
                case 'application/json':
                    return JSON.stringify(this.params)
                case 'application/x-www-form-urlencoded':
                    return new URLSearchParams(Object.entries(this.params)).toString()
                default:
                    if(this.method == 'GET')
                        return undefined

                    return new URLSearchParams(Object.entries(this.params)).toString()
            }
        }
    },
    emits: {
        response(status, headers, body) {
            if(status >= 200 && status < 600) 
                return true

            return false
        }
    },    
    methods: {
        async run() {
            try {
                let url = this.fetchUrl,
                    method = this.method,
                    body = this.body

                if(method == 'GET') {
                    const ref = window.open(url) // we want to open a browser window instead of using fetch
                    
                    ref.onunload = () => {
                        if(ref.window.location.href == 'about:blank')
                            return

                        const qp = (/code|token|error/.test(ref.window.location.hash)) ? ref.window.location.hash.substring(1) : ref.window.location.search.substring(1)
                        const params = Array.from(new URLSearchParams(qp).entries()).reduce((json, [key, value]) => {
                            json[key] = value; return json
                        }, {})
                        
                        this.$emit('response', Array.from(Object.keys(params)).length > 0 ? 200 : 400, {}, params)
                    }
                    return
                }

                const response = await fetch(`${this.url}`, {
                    method,
                    headers: {
                        'content-type': this.contentType
                    },
                    body
                })

                if(response.ok) {
                    const headers = Array.from(response.headers.entries()).reduce((h, [key, value]) => {
                        h[key] = value; return h;
                    }, {})
                    const body = await response.text()

                    this.responseStatusCode = response.status
                    this.responseBody = body
                    this.responseHeaders = headers
                                        
                    switch(headers['content-type']) {
                        case 'application/json':
                            this.$emit('response', response.status, headers, JSON.parse(body))
                            break

                        case 'application/x-www-form-urlencoded':
                            this.$emit('response', response.status, headers, new URLSearchParams(body).entries().reduce((obj, [key, value]) => { 
                                obj[key] = value; return obj;
                            }, {}))
                            break

                        default:
                            this.$emit('response', response.status, headers, null)
                            break
                    }
                } 
                else {
                    this.responseStatusCode = response.status                    
                    this.responseBody = await response.text() ?? ''
                }
            }
            catch(ex) {
                this.responseStatusCode = 800
                this.responseBody = ex
                console.log(ex)
            }
        }        
    },
    render() {
        let errDescription = [],
            body = ''

        if(this.responseStatusCode && this.responseStatusCode != 200) {
            errDescription.push(html`<div>HTTP/1.1 ${this.responseStatusCode}</div>`)

            for(let [key, value] of Object.entries(this.responseHeaders)) {
                errDescription.push(html`<div>${key}: ${value}</div>`)
            }

            errDescription.push(html`<div>${this.responseBody}</div>`)

            errDescription.push(html`<hr />`)
        }

        switch(this.contentType) {
            case 'application/json':
                body = html`
                    <div>{</div>
                    ${Object.entries(this.params ?? {}).map(([key, value], index) => {
                        return html`<div class="param">${index == 0 ? '' : '&'}${key}=${value}</div>`
                    })}
                    <div>}</div>
                `
                break

            case 'application/x-www-form-urlencoded':
                body = html`
                    ${Object.entries(this.params ?? {}).map(([key, value], index) => {
                        return html`<div class="param" style="${index == 0 ? 'padding: 10px 0 0 0' : ''}">${index == 0 ? '' : '&'}${key}=${value}</div>`
                    })}
                `;
                break

            default:
                body = html`
                    ?
                    ${Object.entries(this.params ?? {}).map(([key, value], index) => {
                        return html`<div class="param">${index == 0 ? '' : '&'}${key}=${value}</div>`
                    })}
                `
                break
        }

        return html`
            <div class="request">
                <div class="title">${this.title ?? 'Request'}</div>
                <div class="block">
                    ${this.method} ${this.url}
                    ${body}
                    <hr />
                    ${errDescription}
                    <div>
                        <button onClick=${() => { this.run() }}>${this.buttonTitle ?? 'Next'}</button>
                    </div>
                </div>
            </div>
        `
    }
}