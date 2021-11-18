<?php

namespace Kiener\MolliePayments\Struct\PaymentMethod;

use Kiener\MolliePayments\Handler\Method\VoucherPayment;
use Kiener\MolliePayments\Service\CustomFieldsInterface;
use Kiener\MolliePayments\Struct\PaymentMethod\SalesChannelConfig\PaymentMethodSalesChannelConfig;
use Kiener\MolliePayments\Struct\PaymentMethod\SalesChannelConfig\PaymentMethodSalesChannelConfigCollection;
use Shopware\Core\Checkout\Payment\PaymentMethodEntity;

class PaymentMethodAttributes
{
    /**
     * @var string
     */
    protected $handlerIdentifier;

    /**
     * @var string
     */
    protected $name;

    /**
     * @var PaymentMethodSalesChannelConfigCollection
     */
    protected $config;

    /**
     * @param PaymentMethodEntity $paymentMethod
     * @throws \Exception
     */
    public function __construct(PaymentMethodEntity $paymentMethod)
    {
        $this->handlerIdentifier = $paymentMethod->getHandlerIdentifier();

        $customFields = $paymentMethod->getCustomFields();

        if ($customFields === null) {
            return;
        }

        if (array_key_exists('mollie_payment_method_name', $customFields) &&
            !empty($customFields['mollie_payment_method_name'])) {
            $this->name = (string)$customFields['mollie_payment_method_name'];
        }

        if (!array_key_exists(CustomFieldsInterface::MOLLIE_KEY, $customFields)
            || empty($customFields[CustomFieldsInterface::MOLLIE_KEY])) {
            return;
        }

        $mollieCustomFields = $customFields[CustomFieldsInterface::MOLLIE_KEY];

        if (array_key_exists('config', $mollieCustomFields)) {
            $this->buildConfig($mollieCustomFields['config']);
        } else {
            $this->buildConfig([]);
        }
    }

    /**
     * @return bool
     */
    public function isVoucherMethod(): bool
    {
        return $this->handlerIdentifier === VoucherPayment::class;
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @return PaymentMethodSalesChannelConfigCollection
     */
    public function getConfig()
    {
        return $this->config;
    }

    /**
     * @param array $configs
     */
    private function buildConfig(array $configs): void
    {
        $this->config = new PaymentMethodSalesChannelConfigCollection();

        foreach ($configs as $salesChannelId => $config) {
            $this->config->set($salesChannelId, new PaymentMethodSalesChannelConfig($config));
        }
    }

}
