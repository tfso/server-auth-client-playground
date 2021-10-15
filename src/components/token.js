import html from './../utils/html.js'
import { useJson } from './../utils/json.js'

export default {
    name: 'Token',
    props: {
        payload: String
    },
    methods: {
        parseJwt(token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        
            return JSON.parse(jsonPayload);
        }
    },
    render() {
        const { json } = useJson(this.parseJwt(this.payload))

        return html`
            <div class="request">
                <div class="title">Decoded Token Payload</div>
                <div class="block">${json}</div>
            </div>
        `
    }
}