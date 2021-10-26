import html from './../utils/html.js';
import RequestTemplate from './../components/requesttemplate.js'
import ResponseTemplate from './../components/responsetemplate.js'
import Token from './../components/token.js'

import BaseFlow from './baseflow.js'

export default {
    name: 'AuthorizationCode',
    extends: BaseFlow,    
    data() {
        return {
            codeStatus: null,
            code: null,
            tokenStatus: null,
            token: null,
            tokenHeaders: {},
            tokenBody: null,
            refreshStatus: null,
            refreshHeaders: {},
            refreshBody: null,
            refreshToken: null,
            state: String(Math.floor(Math.random() * 10000000000)),
            step: 0
        }
    },
    methods: {
        handleRedirectResponse(status, headers, body) {
            this.codeStatus = status
            this.code = body.code

            this.step = 1
        },
        handleTokenResponse(status, headers, body) {
            this.tokenStatus = status
            this.tokenHeaders = headers
            this.tokenBody = body

            this.token = body.access_token
            this.refreshToken = body.refresh_token ?? null

            this.step = 2
        },
        handleRefreshTokenResponse(status, headers, body) {
            this.refreshStatus = status
            this.refreshHeaders = headers
            this.refreshBody = body

            this.refreshToken = body.refresh_token ?? null

            this.step = 5
        }
    },
    render() {
        let output = []

        output.push(html`
            <div class="step">
                <span class="step-number">1</span>
                <div class="step-content">
                    <${RequestTemplate} title="Authorization Code" onEdit=${this.handleEdit.bind(this)} onResponse=${this.handleRedirectResponse.bind(this)} url=${this.authorizationUrl} params=${{ response_type: 'code', client_id: this.clientId, redirect_uri: window.location.href, scope: this.scope, state: this.state, tenant: this.tenant, audience: this.audience }}><//>
                </div>
            </div>
        `)

        if(this.step >= 1) {                
            output.push(html`
                <div class="step">
                    <span class="step-number">2</span>
                    <div class="step-content">
                        Exchange code from Token
                        <div class="text">Your code is</div>
                        <div class="block">${this.code ?? '&nbsp;'}</div>
                        <div class="text">Now, we need to turn that access code into an access token, by having our server make a request to your token endpoint. Since this request needs the secret, this should be done at server side</div>
                        <${RequestTemplate} onEdit=${this.handleEdit.bind(this)} onResponse=${this.handleTokenResponse.bind(this)} contentType="application/x-www-form-urlencoded" url=${this.tokenUrl} params=${{ grant_type: 'authorization_code', code: this.code, client_id: this.clientId, client_secret: this.clientSecret, redirect_uri: window.location.href }}><//>
                    </div>
                </div>
            `)
        }

        if(this.step >= 2) {
            output.push(html`
                <div class="step">
                    <span class="step-number">3</span>
                    <div class="step-content">
                        <${ResponseTemplate} onEdit=${this.handleEdit.bind(this)} onClick=${() => this.step++} status=${this.tokenStatus} headers=${this.tokenHeaders} body=${this.tokenBody} />
                    </div>
                </div>
            `)
        }

        if(this.step >= 3) {
            output.push(html`
                <div class="step">
                    <span class="step-number">4</span>
                    <div class="step-content">
                        <div class="text">Congrats, you have an access token you can pass as a Bearer token i your "Authorization" header.</div>
                        <div class="block">${this.token}</div>
                        <div class="text">Everyone using an access token has to validate it against trusted issuers. You should only trust a defined set of issuers, and the issuer is located in the "iss" claim</div>
                        <${Token} payload=${this.token} />

                        ${this.refreshToken ? 
                            html`
                                <div class="text">Your token response has a refresh token as well, you can proceed to next step if you want to try the refresh token flow;</div>
                                <button onClick=${() => this.step++}>Proceed</button>
                            `
                            : 
                            ``
                        }
                    </div>
                </div>
            `)
        }

        if(this.step >= 4) {
            output.push(html`
                <div class="step">
                    <span class="step-number">5</span>
                    <div class="step-content">
                        Exchange refresh token for a Token
                        <div class="text">Your refesh_token is</div>
                        <div class="block">${this.tokenBody.refresh_token ?? '&nbsp;'}</div>
                        <div class="text">This refresh_token can you store safely along with the user. You can access the Public API for that user at any time, even when the access token has expired after exchanging the refresh_token. A refresh_token may be rotated after the exchange, and you will have to update your storage with the new refresh_token</div>
                        <${RequestTemplate} onEdit=${this.handleEdit.bind(this)} onResponse=${this.handleRefreshTokenResponse.bind(this)} contentType="application/x-www-form-urlencoded" url=${this.tokenUrl} params=${{ grant_type: 'refresh_token', refresh_token: this.refreshToken, client_id: this.clientId, client_secret: this.clientSecret, scope: this.scope, tenant: this.tenant, redirect_uri: window.location.href }}><//>
                    </div>
                </div>
            `)
        }

        if(this.step >= 5) {
            output.push(html`
                <div class="step">
                    <span class="step-number">6</span>
                    <div class="step-content">
                        <div class="text">The response from refresh_token grant is the following:</div>
                        <${ResponseTemplate} onEdit=${this.handleEdit.bind(this)} onClick=${() => this.step++} status=${this.refreshStatus} headers=${this.refreshHeaders} body=${this.refreshBody} />
                        ${this.refreshToken != this.tokenBody.refresh_token ? html`<div class="text">The request payload in step 5 is updated with the rotated refresh_token, you can replay step 5 again if you want to.</div>` : ''}
                    </div>
                </div>
            `)
        }

        if(this.step >= 6) {
            output.push(html`
                <div class="step">
                    <span class="step-number">7</span>
                    <div class="step-content">
                        <div class="text">Congrats, you have a new access token you can pass as a Bearer token i your "Authorization" header.</div>
                        <${Token} payload=${this.refreshBody.access_token} />
                    </div>
                </div>
            `)
        }

        return output
    }
}