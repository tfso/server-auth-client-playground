import html from './../utils/html.js'

import ModalDialog from './modaldialog.js'
import InputField from './inputfield.js'

export default {
    name: 'EditProperty',
    data() {
        return {
            editingValue: ''
        }
    },
    props: {
        isEditing: Boolean,
        property: String,
        value: String
    },
    emits: {
        edit(key, value) {
            return true
        },
        close: null
    },
    methods: {
        handleClose() {
            this.$emit('close')
        },
        handleEdit() {
            this.$emit('edit', this.property, this.editingValue)
            this.$emit('close')
        }
    },
    render() {
        return html`
            <${ModalDialog} style=${{ visibility: this.isEditing ? 'visible' : 'hidden' }}>
                <div style=${{margin: '20px', width: '300px' }}>
                    <div style=${{paddingBottom: '10px' }}>
                        <${InputField} style=${{width: 'calc(100% - 15px)', padding: '5px'}} modelValue=${this.value} onUpdate:modelValue=${(value) => this.editingValue = value} />
                    </div>
                    <div style=${{ textAlign: 'right' }}>
                        <button onClick=${this.handleClose.bind(this)}>Close</button> <button onClick=${this.handleEdit.bind(this)}>Update</button>
                    </div>
                </div>
            <//>
        `
    }
}