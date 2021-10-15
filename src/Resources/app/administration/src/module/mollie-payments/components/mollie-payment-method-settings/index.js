import template from './mollie-payment-method-settings.html.twig';
// import './sw-system-config.scss';

const {Component, Mixin} = Shopware;
const {mapState} = Shopware.Component.getComponentHelper();
// const { object, string: { kebabCase } } = Shopware.Utils;

Component.register('mollie-payment-method-settings', {

    template,

    inject: ['repositoryFactory'],

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
            settings: {},
            actualSettings: {},
            defaultSettings: {
                paymentApi: "order",
            },

            paymentApis: [
                {
                    name: "Order Api",
                    label: "Order Api",
                    id: "order",
                    value: "order",
                    disabled: false
                },
                {
                    name: "Payment Api",
                    label: "Payment Api",
                    id: "payment",
                    value: "payment",
                    disabled: false
                }
            ],

            // see @Administration/app/component/structure/sw-language-info/index.js
            parentLanguage: {name: ''},
        };
    },

    computed: {
        availablePaymentApis() {
            return this.paymentApis;
        },

        isDefaultSalesChannel() {
            return this.currentSalesChannelId === null;
        },

        // defaultSettings() {
        //     return {};//this.getSettingsForSalesChannel();
        // },
        //
        // settings() {
        //     return {};//this.getSettingsForSalesChannel(this.currentSalesChannelId);
        // },

        // see @Administration/app/component/structure/sw-language-info/index.js
        ...mapState('context', {
            languageId: state => state.api.languageId,
            systemLanguageId: state => state.api.systemLanguageId,
            language: state => state.api.language
        }),

        languageRepository() {
            return this.repositoryFactory.create('language');
        },

        isDefaultLanguage() {
            return this.languageId === this.systemLanguageId;
        },
    },


    watch: {
        // see @Administration/app/component/structure/sw-language-info/index.js
        // Watch the id because of ajax loading
        'language.name': {
            handler() {
                this.refreshParentLanguage().catch(error => warn(error));
            }
        }
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.$root.$on('mollie-payments-save-payment-method-settings', () => {
                this.saveSalesChannelPaymentMethodSettings();
            });
            this.refreshParentLanguage();
        },

        onSalesChannelChanged(salesChannelId) {
            this.currentSalesChannelId = salesChannelId;
        },

        // getSettingsForSalesChannel(salesChannelId = null) {
        //     if (!this.paymentMethod.customFields) {
        //         this.paymentMethod.customFields = {};
        //     }
        //     if (!this.paymentMethod.customFields.mollie_payments) {
        //         this.paymentMethod.customFields.mollie_payments = {};
        //     }
        //     if (!this.paymentMethod.customFields.mollie_payments.settings) {
        //         this.paymentMethod.customFields.mollie_payments.settings = {};
        //     }
        //     // if (!this.paymentMethod.customFields.mollie_payments.settings[salesChannelId]) {
        //     //     this.paymentMethod.customFields.mollie_payments.settings[salesChannelId] = {};
        //     // }
        //
        //     return this.paymentMethod.customFields.mollie_payments.settings[salesChannelId] || {paymentApi: null};
        // },

        saveSalesChannelPaymentMethodSettings() {
            console.log(this.currentSalesChannelId, 'order');
            this.$emit('mollie-payments-payment-method-settings-saved')
        },


        getInheritedValue(element) {
            const value = this.actualSettings.null[element];

            if (value) {
                return value;
            }

            return defaultSettings[element];
        },


        // see @Administration/app/component/structure/sw-language-info/index.js
        async refreshParentLanguage() {
            if (this.language.id.length < 1 || this.isDefaultLanguage) {
                this.parentLanguage = {name: ''};
                return;
            }

            if (this.language.parentId !== null && this.language.parentId.length > 0) {
                this.parentLanguage = await this.languageRepository.get(this.language.parentId, Shopware.Context.api);
                return;
            }

            this.parentLanguage = await this.languageRepository.get(this.systemLanguageId, Shopware.Context.api);
        },

        onClickParentLanguage() {
            this.$root.$emit('on-change-language-clicked', this.parentLanguage.id);
        }
    }
});
