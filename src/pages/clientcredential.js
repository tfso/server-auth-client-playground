import html from './../utils/html.js';
import RequestTemplate from './../components/requesttemplate.js'
import ResponseTemplate from './../components/responsetemplate.js'
import Token from './../components/token.js'

import BaseFlow from './baseflow.js'

export default {
    name: 'ClientCredential',
    extends: BaseFlow,
    data() {
        return {
            responseStatus: null, 
            responseHeaders: {},
            responseBody: {},
            step: 0
        }
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
                <span class="step-number">1</span>
                <div class="step-content">
                    <${RequestTemplate} title="Client Credentials" onEdit=${this.handleEdit.bind(this)} onResponse=${this.handleResponse.bind(this)} contentType="application/x-www-form-urlencoded" url=${this.tokenUrl} type="tokenUrl" params=${{ grant_type: 'client_credentials', client_id: this.clientId, client_secret: this.clientSecret, audience: this.audience, login_license: this.login_license, login_client: this.login_client, login_person: this.login_person }}><//>
                </div>
            </div>
        `)

        if(this.step >= 1) {
            output.push(html`
                <div class="step">
                    <span class="step-number">2</span>
                    <div class="step-content">
                        <${ResponseTemplate} onEdit=${this.handleEdit.bind(this)} onClick=${() => this.step++} status=${this.responseStatus} headers=${this.responseHeaders} body=${this.responseBody} />
                    </div>
                </div>
            `)
        }

        if(this.step >= 2) {
            output.push(html`
                <div class="step">
                    <span class="step-number">3</span>
                    <div class="step-content">
                        <div class="text">Congrats, you have an access token you can pass as a Bearer token i your "Authorization" header.</div>
                        <div class="block">${this.responseBody?.access_token}</div>
                        <div class="text">Everyone using an access token has to validate it against trusted issuers. You should only trust a defined set of issuers, and the issuer is located in the "iss" claim</div>
                        <${Token} payload=${this.responseBody?.access_token} />
                    </div>
                </div>
            `)
        }
        

        return output
    }
}