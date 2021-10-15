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
            paymentApis: [
                {
                    label: "Order Api",
                    value: "order",
                    disabled: false
                },
                {
                    label: "Payment Api",
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

        isNotDefaultSalesChannel() {
            return this.currentSalesChannelId !== null;
        },

        defaultSettings() {
            return this.getSettingsForSalesChannel(null) || {};
        },

        settings() {
            let settings = this.getSettingsForSalesChannel(this.currentSalesChannelId);
            if (!settings) {
                settings = this.getSettingsForSalesChannel(null);
            }
            return settings || {salesChannelId: this.currentSalesChannelId};
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

        getSettingsForSalesChannel(salesChannelId) {
            // Get the customFields from translated, as this will have the settings for the default language,
            // instead of from regular customFields.
            const allSettings = this.paymentMethod.translated.customFields.mollie_payments.settings;

            const settings = allSettings.filter(setting => setting.salesChannelId === salesChannelId);
            return settings.length >= 1 ? settings[0] : null;
        },

        saveSalesChannelPaymentMethodSettings() {
            console.log(this.currentSalesChannelId, 'order');
            this.$emit('mollie-payments-payment-method-settings-saved')
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
