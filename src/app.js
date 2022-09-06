import html from './utils/html.js';
import {  useJson } from './utils/json.js'

import ClientCredential from './pages/clientcredential.js'
import AuthorizationCode from './pages/authorizationcode.js'
import Implicit from './pages/implicit.js'
import Auth0JS from './pages/auth0js.js'

export default {
    name: 'App',
    data() {
        return {
            authorizationUrl: window.localStorage.getItem(`tfso:auth-playground:authorizationUrl`) ?? 'https://login.24sevenoffice.com/authorize',
            tokenUrl: window.localStorage.getItem(`tfso:auth-playground:tokenUrl`) ?? 'https://login.24sevenoffice.com/oauth2/token',
            clientId: window.localStorage.getItem(`tfso:auth-playground:clientId`) ?? '***',
            clientSecret: window.sessionStorage.getItem(`tfso:auth-playground:clientSecret`) ?? '***',
            scope: window.localStorage.getItem(`tfso:auth-playground:scope`) ?? 'openid offline_access organization',
            audience: window.localStorage.getItem(`tfso:auth-playground:audience`) ?? 'https://app.24sevenoffice.com',
            login_license: window.localStorage.getItem(`tfso:auth-playground:license`) ?? '',
            login_client: window.localStorage.getItem(`tfso:auth-playground:client`) ?? '',
            login_person: window.localStorage.getItem(`tfso:auth-playground:person`) ?? '',
            prompt: window.localStorage.getItem(`tfso:auth-playground:prompt`) ?? '',
            state: btoa(String(Math.floor(Math.random() * 10000000000))), // this isn't good enough, but for a demo purpose it is
            mode: 'Implicit'
        };
    },
    methods: {
        setMode(mode) {
            this.mode = mode
        },
        onEdit(key, value) {
            if(key in this.$data) {
                switch(key) {
                    case 'clientSecret':
                        window.sessionStorage.setItem(`tfso:auth-playground:${key}`, value)
                        break

                    case 'state':
                        break

                    default:
                        window.localStorage.setItem(`tfso:auth-playground:${key}`, value)
                        break
                }

                this.$data[key] = value
            }
        }
    },
    render() {
        let flow = html``
        let { mode, ...props } = this.$data

        switch(this.mode) {
            case 'Implicit':
                flow = html`<${Implicit} onEdit=${this.onEdit.bind(this)} ...${props} />`; break
            case 'AuthorizationCode':
                flow = html`<${AuthorizationCode} onEdit=${this.onEdit.bind(this)} ...${props} />`; break
            case 'ClientCredential':
                flow = html`<${ClientCredential} onEdit=${this.onEdit.bind(this)} ...${props} />`; break;
            case 'Auth0JS':
                flow = html`<${Auth0JS} onEdit=${this.onEdit.bind(this)} ...${props} />`; break;
        }

        return Vue.h(html`
            <div>
                <div class="playground">
                    <div style="padding-bottom: 50px;">
                        <span><a href="#" onClick=${() => this.setMode('Implicit')}>Implicit</a> | <a href="#" onClick=${() => this.setMode('AuthorizationCode')}>Authorization Code</a> | <a href="#" onClick=${() => this.setMode('ClientCredential')}>Client Credentials</a>  | <a href="#" onClick=${() => this.setMode('Auth0JS')}>Auth0 JS</a></span>
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
