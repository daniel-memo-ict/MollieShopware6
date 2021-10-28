<?php

namespace Kiener\MolliePayments\Struct\PaymentMethod;

use Kiener\MolliePayments\Handler\Method\VoucherPayment;
use Kiener\MolliePayments\Struct\Attribute\EntityAttributeStruct;
use Kiener\MolliePayments\Struct\Attribute\PaymentMethod\PaymentMethodSalesChannelConfigAttributeCollection;
use Kiener\MolliePayments\Struct\Attribute\PaymentMethod\PaymentMethodSalesChannelConfigAttributeStruct;
use Shopware\Core\Checkout\Payment\PaymentMethodEntity;

class PaymentMethodAttributes extends EntityAttributeStruct
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
     * @var PaymentMethodSalesChannelConfigAttributeCollection
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

        parent::__construct($paymentMethod);
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
     * @return PaymentMethodSalesChannelConfigAttributeCollection
     */
    public function getConfig(): PaymentMethodSalesChannelConfigAttributeCollection
    {
        return $this->config;
    }

    /**
     * @param array $config
     */
    protected function assignConfig(array $config): void
    {
        $this->config = new PaymentMethodSalesChannelConfigAttributeCollection();

        foreach ($config as $salesChannelId => $_config) {
            $salesChannelConfig = new PaymentMethodSalesChannelConfigAttributeStruct($_config);
            $this->config->set($salesChannelId, $salesChannelConfig);
        }
    }
}
