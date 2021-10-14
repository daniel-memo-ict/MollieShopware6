import template from './sw-settings-payment-detail.html.twig';

Shopware.Component.override('sw-settings-payment-detail', {
    template,

    computed: {
        isMolliePaymentMethod() {
            // TODO: When refactoring manufacturer this probably also needs to change to "handler_mollie"
            return this.paymentMethod.formattedHandlerIdentifier.startsWith('handler_kiener');
        }
    },

});
