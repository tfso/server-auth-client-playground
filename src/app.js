import html from './utils/html.js';
import {  useJson } from './utils/json.js'

import ClientCredential from './pages/clientcredential.js'
import AuthorizationCode from './pages/authorizationcode.js'
import Implicit from './pages/implicit.js'

export default {
    name: 'App',
    data() {
        return {
            authorizationUrl: 'https://auth.dev.tfso.io/authorize',
            tokenUrl: 'https://tfso-dev.eu.auth0.com/oauth/token',
            clientId: 'w00uUIgCyeCsIpzUcWqAIbqzh05YR9LA',
            clientSecret: '_qUvBiVaxU7gwB2A0m_uLGSsZAMAvFw9B0MXY7LqSM_ZliFlDscwNJzc0skt3iWb',
            scope: 'openid offline_access organization',
            audience: 'https://app.24sevenoffice.com',
            tokenKeys: 'https://auth.dev.tfso.io/.well-known/jwks.json',
            license: '810957928405876',
            mode: 'Implicit'
        };
    },
    methods: {
        setMode(mode) {
            this.mode = mode
        }
    },
    render() {
        let flow = html``

        switch(this.mode) {
            case 'Implicit':
                flow = html`<${Implicit} ...${this.$data} />`; break
            case 'AuthorizationCode':
                flow = html`<${AuthorizationCode} ...${this.$data} />`; break
            case 'ClientCredential':
                flow = html`<${ClientCredential} ...${this.$data} />`; break;
        }


        return Vue.h(html`
            <div>
                <div class="playground">
                    <div style="padding-bottom: 50px;">
                        <span><a href="#" onClick=${() => this.setMode('Implicit')}>Implicit</a> | <a href="#" onClick=${() => this.setMode('AuthorizationCode')}>Authorization Code</a> | <a href="#" onClick=${() => this.setMode('ClientCredential')}>Client Credentials</a></span>
                        <h1>Auth Playground</h1>

                    </div>
                    <div>
                        ${flow}
                    </div>
                </div>
            </div>
        `);
    },
};
