import html from './../utils/html.js';
import RequestTemplate from './../components/requesttemplate.js'
import ResponseTemplate from './../components/responsetemplate.js'
import Token from './../components/token.js'

import BaseFlow from './baseflow.js'

export default {
    name: 'Implicit',
    extends: BaseFlow,
    data() {
        return {
            responseStatus: null,
            responseHeaders: {},
            responseBody: {},
            state: btoa(String(Math.floor(Math.random() * 10000000000))), // this isn't good enough, but for a demo purpose it is
            step: 0
        }
    },
    methods: {
        handleResponse(status, headers, body) {
            this.step = 1
            this.responseStatus = 200
            this.responseBody = body
        }
    },
    render() {
        let output = []

        output.push(html`
            <div class="step">
                <span class="step-number">1</span>
                <div class="step-content">
                    <${RequestTemplate} title="Implicit" onEdit=${this.handleEdit.bind(this)} onResponse=${this.handleResponse.bind(this)} url=${this.authorizationUrl} params=${{ response_type: 'token', client_id: this.clientId, redirect_uri: window.location.href, scope: this.scope, state: this.state, license: this.license, audience: this.audience }}><//>
                </div>
            </div>
        `)

        if(this.step >= 1) {
            // compare state as recommended
            output.push(html`
                <div class="step">
                    <span class="step-number">2</span>
                    <div class="step-content">
                        <div class="text">Passed state from auth server is</div>
                        <div class="block">${this.responseBody?.state ?? '&nbsp;'}</div>
                        ${this.responseBody?.state !== this.state ? html`Authorization may be <b style="color:red">unsafe</b>, passed state ("${this.state}") was changed or missing from auth server` : ''}
                    
                        <div class="text">The response from the authorize redirect, represented as JSON</div>
                        <${ResponseTemplate} onEdit=${this.handleEdit.bind(this)}  onClick=${() => this.step++} status=${200} body=${this.responseBody} />
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