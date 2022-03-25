import template from './mollie-pluginconfig-import-modal.html.twig';
// import './mollie-pluginconfig-support-modal.scss';

// eslint-disable-next-line no-undef
const { Application, Component, Context, Mixin, State } = Shopware;
// eslint-disable-next-line no-undef
const { Criteria } = Shopware.Data;
// eslint-disable-next-line no-undef
const { string, fileReader } = Shopware.Utils;

const CONFIG_DOMAIN = 'MolliePayments.config';

Component.register('mollie-pluginconfig-import-modal', {
    template,

    inject: {
        systemConfigApiService: {},
    },

    mixins: [
        Mixin.getByName('notification'),
    ],

    data() {
        return {
            source: null,
            configs: [],

            schema: null,

            sourceSalesChannel: 0,
            targetSalesChannel: null,
        }
    },

    computed: {
        currentLocale() {
            return Application.getContainer('factory').locale.getLastKnownLocale();
        },

        sourceSalesChannelOptions() {
            return this.configs.map((salesChannelConfig, index) => {
                return {
                    label: salesChannelConfig.label,
                    value: index,
                }
            });
        },

        sourceConfig() {
            return this.configs[this.sourceSalesChannel].config;
        },
    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.loadCurrentConfigSchema();
        },
        loadCurrentConfigSchema() {
            this.systemConfigApiService
                .getConfig(CONFIG_DOMAIN)
                .then(response => {
                    this.schema = response;
                    console.log(response);
                })
        },

        selectFiles(files) {
            this.source = files[0];
            this.readSource();
        },

        readSource() {
            return fileReader.readAsText(this.source.src).then((text) => {
                try {
                    let json;
                    try {
                        json = JSON.parse(text);
                    } catch (e) {
                        throw this.$tc('mollie-payments.config.import.error.jsonParseError', 0, {
                            fileName: this.source.fileName,
                            extension: this.source.extension,
                        });
                    }

                    if (!Array.isArray(json)) {
                        json = [json];
                    }

                    this.configs = [];

                    json
                        .filter(element => {
                            // eslint-disable-next-line no-prototype-builtins
                            if (!element.hasOwnProperty('label') || !element.hasOwnProperty('config')) {
                                return false;
                            }

                            return Object.keys(element.config).some(key => key.includes(CONFIG_DOMAIN));
                        })
                        .forEach(element => {
                            element.config = Object.fromEntries(
                                Object.entries(element.config)
                                    .filter(([key]) => key.includes(CONFIG_DOMAIN))
                            );

                            this.configs.push(element);
                        });

                    if(this.configs.length === 0) {
                        throw this.$tc('mollie-payments.config.import.error.invalidConfig', 0, {
                            fileName: this.source.fileName,
                            extension: this.source.extension,
                        });
                    }
                } catch (e) {
                    this.createNotificationError({
                        title: this.$tc('global.default.error'),
                        message: e,
                    });
                    this.source = null;
                }
            });
        },
    },
});
