import template from './mollie-payment-method-settings.html.twig';
// import './sw-system-config.scss';

const { Component, Mixin } = Shopware;
// const { object, string: { kebabCase } } = Shopware.Utils;

Component.register('mollie-payment-method-settings', {

    template,

    // inject: ['systemConfigApiService'],

    // mixins: [
    //     Mixin.getByName('notification'),
    //     Mixin.getByName('sw-inline-snippet')
    // ],

    props: {
        paymentMethod: {
            type: Object,
            required: true
        },
        salesChannelId: {
            type: String,
            required: false,
            default: null
        },
        salesChannelSwitchable: {
            type: Boolean,
            required: false,
            default: false
        },
        // Shows the value of salesChannel=null as placeholder when the salesChannelSwitchable prop is true
        inherit: {
            type: Boolean,
            required: false,
            default: true
        }
    },

    data() {
        return {
            currentSalesChannelId: this.salesChannelId,
            paymentMethodApi: null,
            isLoading: false,
        };
    },

    computed: {
        isNotDefaultSalesChannel() {
            return this.currentSalesChannelId !== null;
        },

        settings() {
            let settings = this.getSettingsForSalesChannel(this.currentSalesChannelId);
            if(!settings) {
                settings = this.getSettingsForSalesChannel(null);
            }
            return settings;
        }
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.$root.$on('mollie-payments-save-payment-method', () => {
                this.saveSalesChannelPaymentMethodSettings();
            })
        },

        onSalesChannelChanged(salesChannelId) {
            this.currentSalesChannelId = salesChannelId;
        },

        getSettingsForSalesChannel(salesChannelId) {
            // Get the customFields from translated, as this will have the settings for the default language,
            // instead of from regular customFields.
            const allSettings = this.paymentMethod.translated.customFields.mollie_payments.settings;

            const settings = allSettings.filter(setting => setting.salesChannelId === salesChannelId);
            return settings.length >= 1 ? settings[0] : null;
        },

        saveSalesChannelPaymentMethodSettings() {
            console.log(this.currentSalesChannelId, 'order');
        }
    }
});
