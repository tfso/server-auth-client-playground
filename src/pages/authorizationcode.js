import html from './../utils/html.js';
import RequestTemplate from './../components/requesttemplate.js'
import ResponseTemplate from './../components/responsetemplate.js'
import Token from './../components/token.js'

export default {
    name: 'AuthorizationCode',
    data() {
        return {
            codeStatus: null,
            code: null,
            tokenStatus: null,
            token: null,
            state: String(Math.floor(Math.random() * 10000000000)),
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
        handleRedirectResponse(status, headers, body) {
            this.codeStatus = status
            this.code = body.code

            this.step = 1
        },
        handleTokenResponse(status, headers, body) {
            this.tokenStatus = status
            this.token = body.access_token

            this.step = 2
        }
    },
    render() {
        let output = []

        output.push(html`
            <div class="step">
                <span class="step-number">1</span>
                <div class="step-content">
                    <${RequestTemplate} onResponse=${this.handleRedirectResponse.bind(this)} url=${this.authorizationUrl} params=${{ response_type: 'code', client_id: this.clientId, redirect_uri: window.location.href, scope: this.scope, state: this.state, license: this.license, audience: this.audience }}><//>
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
                        <${RequestTemplate} onResponse=${this.handleTokenResponse.bind(this)} contentType="application/x-www-form-urlencoded" url=${this.tokenUrl} params=${{ grant_type: 'authorization_code', code: this.code, client_id: this.clientId, client_secret: this.clientSecret, redirect_uri: window.location.href }}><//>
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
                        <div class="block">${this.token}</div>
                        <div class="text">Everyone using an access token has to validate it against trusted issuers. You should only trust a defined set of issuers, and the issuer is located in the "iss" claim</div>
                        <${Token} payload=${this.token} />
                    </div>
                </div>
            `)
        }

        return output
    }
}