import html from './../utils/html.js'

export default {
    name: 'InputField',
    props: {
        modelValue: {
            type: [String, Number],
            default: "",
        },
        type: {
            type: String,
            default: "text",
        }
    },
    methods: {
        updateInput(event) {
            this.$emit('update:modelValue', event.target.value)
        }
    },
    render() {
        return html`
            <input
                type=${this.type}
                value=${this.modelValue}
                onInput=${(e) => this.updateInput(e)}
            />
        `
    }
}