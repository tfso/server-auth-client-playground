import html from './../utils/html.js'

import EditProperty from './editproperty.js'

export default {
    name: 'RequestTemplate',
    components: {
        EditProperty
    },
    data() {
        return {
            responseStatusCode: null,
            responseBody: null,
            responseHeaders: { },
            isEditing: false,
            editingKey: '',
            editingValue: ''
        }
    },
    props: {
        title: String,
        url: String,
        type: String,
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
                return new URLSearchParams(
                    Object
                        .entries(this.params)
                        .filter(([key, value]) => key.length > 0 && String(value).length > 0)
                ).toString()
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
        },
        edit(key, value) {
            if(typeof key == 'string' && key.length > 0) 
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
                    window.localStorage.setItem(window.__callbackKey, null)
                    window.open(url) // we want to open a browser window instead of using fetch
                    
                    const handler = () => {
                        if(window.localStorage.getItem(window.__callbackKey) == null)
                            return

                        const qp = window.localStorage.getItem(window.__callbackKey) //|| (/code|token|error/.test(ref.window.location.hash)) ? ref.window.location.hash.substring(1) : ref.window.location.search.substring(1)
                        const params = Array.from(new URLSearchParams(qp).entries()).reduce((json, [key, value]) => {
                            json[key] = value; return json
                        }, {})

                        window.localStorage.setItem(window.__callbackKey, null)

                        this.$emit('response', Array.from(Object.keys(params)).length > 0 ? 200 : 400, {}, params)

                        window.removeEventListener("storage", handler, true)
                    }

                    window.addEventListener("storage", handler, true)

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
        },
        getBodyDisplayValue(key, value) {
            switch(key) {
                case 'client_id':
                case 'client_secret':
                case 'scope':
                case 'login_license':
                case 'login_organization':
                case 'login_person':
                case 'audience':
                case 'authorizationUrl':
                case 'tokenUrl':
                case 'prompt':
                case 'state':
                    if(typeof value == 'string' && value.length == 0)
                        return html`<a href="#" onClick=${() => this.openEditDialog(key, value)}><img style="width:40px;height:1px;" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" /></a>`

                    return html`<a href="#" onClick=${() => this.openEditDialog(key, value)}>${value || ` `}</a>`

                default:
                    return value
            }
        },
        openEditDialog(key, value) {
            this.isEditing = true
            this.editingKey = key
            this.editingValue = value
        },
        handleEdit(key, value) {
            this.$emit('edit', key, value)
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
                        return html`<div class="param">${index == 0 ? '' : '&'}${key}=${this.getBodyDisplayValue(key, value)}</div>`
                    })}
                    <div>}</div>
                `
                break

            case 'application/x-www-form-urlencoded':
                body = html`
                    ${Object.entries(this.params ?? {}).map(([key, value], index) => {
                        return html`<div class="param" style="${index == 0 ? 'padding: 10px 0 0 0' : ''}">${index == 0 ? '' : '&'}${key}=${this.getBodyDisplayValue(key, value)}</div>`
                    })}
                `;
                break

            default:
                body = html`
                    ?
                    ${Object.entries(this.params ?? {}).map(([key, value], index) => {
                        return html`<div class="param">${index == 0 ? '' : '&'}${key}=${this.getBodyDisplayValue(key, value)}</div>`
                    })}
                `
                break
        }

        return html`
            <div class="request">
                <div class="title">${this.title ?? 'Request'}</div>
                <div class="block">
                    ${this.method} ${this.getBodyDisplayValue(this.type, this.url)}
                    ${body}
                    <hr />
                    ${errDescription}
                    <div>
                        <button onClick=${() => { this.run() }}>${this.buttonTitle ?? 'Next'}</button>
                    </div>
                </div>
                <${EditProperty} isEditing=${this.isEditing} onClose=${() => this.isEditing = false} onEdit=${this.handleEdit.bind(this)} property=${this.editingKey} value=${this.editingValue} />
            </div>
        `
    }
}