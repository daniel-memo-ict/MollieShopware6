import template from './sw-settings-payment-detail.html.twig';

Shopware.Component.override('sw-settings-payment-detail', {
    template,

    computed: {
        isMolliePaymentMethod() {
            if(!this.paymentMethod) {
                return false;
            }

            // TODO: When refactoring manufacturer this probably also needs to change to "handler_mollie"
            return this.paymentMethod.formattedHandlerIdentifier.startsWith('handler_kiener');
        }
    },

    methods:{
        onSave() {
            return this.$super('onSave');
                // .then(() => {
                //     if(this.isMolliePaymentMethod) {
                //         this.$root.$emit('mollie-payments-save-payment-method-settings');
                //     }
                // });
        }
    }

});
