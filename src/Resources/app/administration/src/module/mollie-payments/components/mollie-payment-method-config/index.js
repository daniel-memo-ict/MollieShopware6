import template from './mollie-payment-method-config.html.twig';

const {Component} = Shopware;
const {mapState} = Shopware.Component.getComponentHelper();

Component.register('mollie-payment-method-config', {

    template,

    inject: ['repositoryFactory'],

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
            config:{},
            actualConfig: {},
            defaultConfig: {
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
                this.onSalesChannelChanged(null);
                this.refreshParentLanguage().catch(error => warn(error));
            }
        }
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.refreshParentLanguage();
            this.readAll();
            this.readConfig();
        },

        onSalesChannelChanged(salesChannelId) {
            this.currentSalesChannelId = salesChannelId;
            this.readConfig();
        },

        readAll() {
            this.isLoading = true;

            try {
                if (!this.paymentMethod.customFields) {
                    this.paymentMethod.customFields = {};
                }
                if (!this.paymentMethod.customFields.mollie_payments) {
                    this.paymentMethod.customFields.mollie_payments = {};
                }
                if (!this.paymentMethod.customFields.mollie_payments.config) {
                    this.paymentMethod.customFields.mollie_payments.config = {};
                }

                this.config = this.paymentMethod.customFields.mollie_payments.config;
            } finally {
                this.isLoading = false;
            }
        },

        readConfig() {
            this.isLoading = true;

            try {
                if (!this.paymentMethod.customFields) {
                    this.paymentMethod.customFields = {};
                }
                if (!this.paymentMethod.customFields.mollie_payments) {
                    this.paymentMethod.customFields.mollie_payments = {};
                }
                if (!this.paymentMethod.customFields.mollie_payments.config) {
                    this.paymentMethod.customFields.mollie_payments.config = {};
                }
                if (!this.paymentMethod.customFields.mollie_payments.config[this.currentSalesChannelId]) {
                    this.paymentMethod.customFields.mollie_payments.config[this.currentSalesChannelId] =
                        this.currentSalesChannelId === null
                            ? this.defaultConfig
                            : {};
                }

                this.actualConfig = this.paymentMethod.customFields.mollie_payments.config[this.currentSalesChannelId];
            } finally {
                this.isLoading = false;
            }
        },

        getInheritedValue(element) {
            if (this.config.hasOwnProperty('null') &&
                this.config.null.hasOwnProperty(element)) {
                return this.config.null[element];
            }

            return this.defaultConfig[element];
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
