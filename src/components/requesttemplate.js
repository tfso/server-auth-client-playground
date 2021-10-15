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
        onResponse: Function
    },
    methods: {
        async run() {
            try {
                let url = this.url,
                    body = undefined,
                    method = 'GET'

                switch(this.contentType) {
                    case 'application/json': 
                        method = 'POST'
                        body = JSON.stringify(this.params)
                        break

                    case 'application/x-www-form-urlencoded':
                        method = 'POST'
                        body = new URLSearchParams(Object.entries(this.params))
                        break
                    
                    default:
                        url += `?${new URLSearchParams(Object.entries(this.params))}`
                        break
                }

                const response = await fetch(`${this.url}`, {
                    method,
                    body
                })

                if(response.ok) {
                    if(this.onResponse) {
                        const body = await response.text()
                        const headers = Array.from(response.headers.entries()).reduce((h, [key, value]) => {
                            h[key] = value; return h;
                        }, {})

                        switch(headers['content-type']) {
                            case 'application/json':
                                this.onResponse(response.status, headers, JSON.parse(body))
                                break

                            case 'application/x-www-form-urlencoded':
                                this.onResponse(response,status, headers, new URLSearchParams(body).entries().reduce((obj, [key, value]) => { 
                                    obj[key] = value; return obj;
                                }, {}))
                                break

                            default:
                                this.onResponse(response.status, headers, null)
                                break
                        }
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
        let errDescription = []

        if(this.responseStatusCode && this.responseStatusCode != 200) {
            errDescription.push(html`<div>HTTP/1.1 ${this.responseStatusCode}</div>`)

            for(let [key, value] of Object.entries(this.responseHeaders)) {
                errDescription.push(html`<div>${key}: ${value}</div>`)
            }

            errDescription.push(html`<div>${this.responseBody}</div>`)
        }

        return html`
            <div class="request">
                <div class="title">${this.title ?? 'Request'}</div>
                <div class="block">
                    ${this.url}?
                    ${Object.entries(this.params ?? {}).map(([key, value], index) => {
                        return html`<div class="param">${index == 0 ? '' : '&'}${key}=${value}</div>`
                    })}
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