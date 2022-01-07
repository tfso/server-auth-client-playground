import html from '../utils/html.js';
import { useJson } from './../utils/json.js'

import BaseFlow from './baseflow.js'

export default {
    name: 'Auth0SPA',
    extends: BaseFlow,
    data() {
        return {
            auth0: null,
            error: null,
            response: null,
            step: 0
        }
    },
    methods: {
        createWebAuth() {
            
        },

        async login() {
            return new Promise((resolve, reject) => { 
                const url = new URL(this.authorizationUrl)

                this.error = null

                this.auth0 = new auth0.WebAuth({
                    domain: url.hostname,
                    clientID: this.clientId,
                    state: this.state,
                    redirectUri: window.location.href,
                    responseType: 'token'
                })

                this.auth0.checkSession({
                    audience: this.audience,
                    scope: this.scope
                }, (err, authResult) => {
                    if(err) {
                        this.error = `${err.error}. ${err.error_description}`

                        return reject(err)
                    }
                    
                    this.response = authResult
                    this.step++

                    resolve()
                })                
            })
        }
    },
    render() {
        const output = []
        const url = new URL(this.authorizationUrl)

        output.push(html`
            <div class="step">
                <span class="step-number">1</span>
                <div class="step-content">
                    <div class="text">Quick and dirty test using auth0-js to check silently if a user is logged in or not. If it fails, try to login with Implicit flow first. To modify any of the inputs you could that in the Implicit flow as well</div>
                    <div class="request">
                        <div class="title">Auth0-JS SDK</div>
                        <div class="block">
                            auth0 = new auth0.WebAuth({<br />
                                <div class="param" style="padding: 0 0 0 20px">domain: '${url.hostname}',</div>
                                <div class="param" style="padding: 0 0 0 20px">clientID: '${this.clientId}',</div>
                                <div class="param" style="padding: 0 0 0 20px">redirectUri: '${window.location.href}',</div>
                                <div class="param" style="padding: 0 0 0 20px">state: '${this.state}',</div>
                                <div class="param" style="padding: 0 0 0 20px">responseType: 'token'</div>
                            })<br />
                            <br />
                            auth0.checkSession({<br />
                                <div class="param" style="padding: 0 0 0 20px">audience: '${this.audience}',</div>
                                <div class="param" style="padding: 0 0 0 20px">scope: '${this.scope}'</div>
                            }, (err, authResult) => { })
                            <hr />
                            ${this.error}
                            <div>
                                <button onClick=${() => { this.login() }}>Login</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `)

        if(this.step >= 1) {
            const { json } = useJson(this.response)

            output.push(html`
                <div class="step">
                    <span class="step-number">2</span>
                    <div class="step-content">
                        <div class="text">The response from checkSession() is</div>
                        <div class="block">${json}</div>
                    </div>
                </div>
            `)
        }

        
        return output
    }
}