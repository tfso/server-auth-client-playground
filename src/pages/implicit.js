import html from './../utils/html.js';
import RequestTemplate from './../components/requesttemplate.js'
import ResponseTemplate from './../components/responsetemplate.js'
import Token from './../components/token.js'

export default {
    name: 'Implicit',
    data() {
        return {
            responseStatus: null, 
            responseHeaders: {},
            responseBody: {},
            step: 0
        }
    },
    props: {
        authorizationUrl: String,
        tokenUrl: String,
        clientId: String,
        clientSecret: String,
        scope: String,
        audience: String,
        license: String,
        tokenKeys: String
    },
    methods: {
        handleResponse(status, headers, body) {
            this.responseStatus = status
            this.responseHeaders = headers
            this.responseBody = body
            
            this.step = 1
        }
    },
    render() {
        let output = []

        output.push(html`
            <div class="step">
                <${RequestTemplate} onResponse=${this.handleResponse.bind(this)} url=${this.tokenUrl} params=${{ response_type: 'token', client_id: this.clientId, redirect_uri: window.location.href, scope: this.scope, state: Math.floor(Math.random() * 100000), license: this.license, audience: this.audience, }}><//>
            </div>
        `)

        
        
        return output
    }
}