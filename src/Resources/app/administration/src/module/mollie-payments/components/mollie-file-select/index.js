import template from './mollie-file-select.html.twig';
import './mollie-file-select.scss';

// eslint-disable-next-line no-undef
const { Component, Mixin } = Shopware;
// eslint-disable-next-line no-undef
const { fileReader } = Shopware.Utils;
// eslint-disable-next-line no-undef

/**
 * @status ready
 * @description The <u>sw-media-upload-v2</u> component is used wherever an upload is needed. It supports drag & drop-,
 * file- and url-upload and comes in various forms.
 * @example-type code-only
 * @component-example
 * <sw-media-upload-v2
 *     :allow-multi-select="false"
 *     label="My image-upload"
 * ></sw-media-upload-v2>
 */
Component.register('mollie-file-select', {
    template,

    inject: ['repositoryFactory', 'mediaService', 'configService'],

    mixins: [
        Mixin.getByName('notification'),
    ],

    props: {
        source: {
            type: [Object, String],
            required: false,
            default: null,
        },

        variant: {
            type: String,
            required: false,
            validValues: ['compact', 'regular', 'button'],
            validator(value) {
                return ['compact', 'regular', 'button'].includes(value);
            },
            default: 'regular',
        },

        allowMultiSelect: {
            type: Boolean,
            required: false,
            default: true,
        },

        label: {
            type: String,
            required: false,
            default: null,
        },

        helpText: {
            type: String,
            required: false,
            default: null,
        },

        sourceContext: {
            type: Object,
            required: false,
            default: null,
        },

        fileAccept: {
            type: String,
            required: false,
            default: 'image/*',
        },

        disabled: {
            type: Boolean,
            required: false,
            default: false,
        },
    },

    data() {
        return {
            multiSelect: this.allowMultiSelect,
            preview: null,
            isDragActive: false,
        };
    },

    computed: {
        showHeader() {
            return !!this.label || !!this.helpText;
        },

        showPreview() {
            return !this.multiSelect;
        },

        snippetPlurality() {
            return this.multiSelect ? 1 : 0;
        },

        hasPreviewFile() {
            return this.preview !== null;
        },

        previewClass() {
            return {
                'has--preview': this.showPreview,
            };
        },

        isDragActiveClass() {
            return {
                'is--active': this.isDragActive,
                'is--multi':  !!this.multiSelect,
                'is--compact': this.variant === 'compact',
            };
        },
    },

    mounted() {
        this.mountedComponent();
    },

    beforeDestroy() {
        this.beforeDestroyComponent();
    },

    methods: {

        mountedComponent() {
            if (this.$refs.dropzone) {
                ['dragover', 'drop'].forEach((event) => {
                    window.addEventListener(event, this.stopEventPropagation, false);
                });
                this.$refs.dropzone.addEventListener('drop', this.onDrop);

                window.addEventListener('dragenter', this.onDragEnter);
                window.addEventListener('dragleave', this.onDragLeave);
            }
        },

        beforeDestroyComponent() {
            ['dragover', 'drop'].forEach((event) => {
                window.addEventListener(event, this.stopEventPropagation, false);
            });

            window.removeEventListener('dragenter', this.onDragEnter);
            window.removeEventListener('dragleave', this.onDragLeave);
        },

        /*
         * Drop Handler
         */
        onDrop(event) {
            if (this.disabled) {
                return;
            }

            const newMediaFiles = Array.from(event.dataTransfer.files);
            this.isDragActive = false;

            if (newMediaFiles.length === 0) {
                return;
            }

            this.handleUpload(newMediaFiles);
        },

        onDragEnter() {
            this.isDragActive = true;
        },

        onDragLeave(event) {
            if (event.screenX === 0 && event.screenY === 0) {
                this.isDragActive = false;
            }
        },

        stopEventPropagation(event) {
            event.preventDefault();
            event.stopPropagation();
        },

        /*
         * Click handler
         */
        onClickUpload() {
            this.$refs.fileInput.click();
        },

        onFileInputChange() {
            const newMediaFiles = Array.from(this.$refs.fileInput.files);

            if (newMediaFiles.length) {
                this.handleUpload(newMediaFiles);
            }
            this.$refs.fileForm.reset();
        },

        /*
         * Helper functions
         */
        async handleUpload(newMediaFiles) {
            if (!this.multiSelect) {
                newMediaFiles = [newMediaFiles.pop()];
                this.preview = newMediaFiles[0];
            }

            const uploadData = newMediaFiles.map((fileHandle) => {
                const { fileName, extension } = fileReader.getNameAndExtensionFromFile(fileHandle);

                return {
                    src: fileHandle,
                    fileName,
                    extension,
                };
            });

            console.log(uploadData);
            this.$emit('file-selected', uploadData)
        },
    },
});
