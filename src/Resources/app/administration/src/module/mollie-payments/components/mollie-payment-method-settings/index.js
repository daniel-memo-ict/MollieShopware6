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
            isLoading: false,
        };
    },

    computed: {
        isMolliePaymentMethod() {
            // TODO: When refactoring manufacturer this probably also needs to change to "handler_mollie"
            return this.paymentMethod.formattedHandlerIdentifier.startsWith('handler_kiener');
        }
        // isNotDefaultSalesChannel() {
        //     return this.currentSalesChannelId !== null;
        // },

    },

    // watch: {
    //     actualConfigData: {
    //         handler() {
    //             this.emitConfig();
    //         },
    //         deep: true
    //     }
    // },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            console.log('hoi');
        },
        onSalesChannelChanged(salesChannelId) {
            this.currentSalesChannelId = salesChannelId;
        },

    }
});
