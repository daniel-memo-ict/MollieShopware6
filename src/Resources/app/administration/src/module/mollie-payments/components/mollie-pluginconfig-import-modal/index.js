import template from './mollie-pluginconfig-import-modal.html.twig';
// import './mollie-pluginconfig-support-modal.scss';

// eslint-disable-next-line no-undef
const { Application, Component, Context, Mixin, State } = Shopware;
// eslint-disable-next-line no-undef
const { Criteria } = Shopware.Data;
// eslint-disable-next-line no-undef
const { string, fileReader } = Shopware.Utils;

Component.register('mollie-pluginconfig-import-modal', {
    template,

    inject: {
    },

    mixins: [
        Mixin.getByName('notification'),
    ],

    data() {
        return {
            source: null,
            configs: [],
        }
    },

    computed: {
    },


    methods: {
        selectFiles(files) {
            this.source = files[0];
            this.readSource();
        },

        readSource() {
            fileReader.readAsText(this.source.src).then((text) => {
                try {
                    const json = JSON.parse(text);

                    console.log(json);
                } catch(e) {
                    this.createNotificationError({
                        title: this.$tc('global.default.error'),
                        message: 'ajskdfhakjsdf',
                    })
                }
            });
        },
    },
});
