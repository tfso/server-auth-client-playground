export default {
    name: 'BaseFlow',
    props: {
        authorizationUrl: String,
        tokenUrl: String,
        clientId: String,
        clientSecret: String,
        scope: String,
        audience: String,
        tenant: String,
        person: String,
        tokenKeys: String
    },
    emits: {
        edit(key, value) {
            return true
        }
    },
    methods: {
        handleEdit(key, value) {
            let propKey

            switch(key) {
                case 'client_id': propKey = 'clientId'; break
                case 'client_secret': propKey = 'clientSecret'; break
                default: propKey = key; break
            }

            this.$emit('edit', propKey, value)
        }
    }
}