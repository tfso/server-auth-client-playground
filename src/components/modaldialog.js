import html from './../utils/html.js'

export default {
    name: 'ModalDialog',
    render() {
        return html`
            <div class="modal">
                <div class="dialog">
                    ${this.$slots.default()}
                </div>
            </div>
        `
    }
}
