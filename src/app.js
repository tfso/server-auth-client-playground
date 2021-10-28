import html from './utils/html.js';
import {  useJson } from './utils/json.js'

import ClientCredential from './pages/clientcredential.js'
import AuthorizationCode from './pages/authorizationcode.js'
import Implicit from './pages/implicit.js'

export default {
    name: 'App',
    data() {
        return {
            authorizationUrl: window.localStorage.getItem(`tfso:auth-playground:authorizationUrl`) ?? 'https://auth.dev.tfso.io/authorize',
            tokenUrl: window.localStorage.getItem(`tfso:auth-playground:tokenUrl`) ?? 'https://auth.dev.tfso.io/oauth2/token',
            clientId: window.localStorage.getItem(`tfso:auth-playground:clientId`) ?? '***',
            clientSecret: window.sessionStorage.getItem(`tfso:auth-playground:clientSecret`) ?? '***',
            scope: window.localStorage.getItem(`tfso:auth-playground:scope`) ?? 'openid offline_access organization',
            audience: window.localStorage.getItem(`tfso:auth-playground:audience`) ?? 'https://app.24sevenoffice.com',
            tenant: window.localStorage.getItem(`tfso:auth-playground:tenant`) ?? '810957928405876',
            person: window.localStorage.getItem(`tfso:auth-playground:person`) ?? '82cf9f16-8366-48fc-96b0-2f683dea79bc',
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
