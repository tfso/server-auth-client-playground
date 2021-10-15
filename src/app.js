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
            scope: 'openid offline_access',
            audience: 'https://app.24sevenoffice.com',
            tokenKeys: 'https://auth.dev.tfso.io/.well-known/jwks.json',
            license: '810957928405876'
        };
    },
    methods: {
        handleResponse(headers, body) {
            
        }, 
        onRedirect() {
            console.log('yea yeah redirect')
        }
    },
    render() {



        return html`
            <div>
                <${Implicit} ...${this.$data} />
                <!--<${ClientCredential} ...${this.$data} />-->
            </div>
        `;
    },
};

// 