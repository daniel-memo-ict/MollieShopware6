<?php

namespace Kiener\MolliePayments\Struct\PaymentMethod;

use Kiener\MolliePayments\Struct\Attribute\EntityAttributeStruct;
use Kiener\MolliePayments\Struct\Attribute\PaymentMethod\PaymentMethodSalesChannelConfigAttributeCollection;
use Kiener\MolliePayments\Struct\Attribute\PaymentMethod\PaymentMethodSalesChannelConfigAttributeStruct;
use Shopware\Core\Checkout\Payment\PaymentMethodEntity;

class PaymentMethodAttributes extends EntityAttributeStruct
{
    /**
     * @var string
     */
    protected $molliePaymentName;

    /**
     * @var PaymentMethodSalesChannelConfigAttributeCollection
     */
    protected $config;

    public function __construct(PaymentMethodEntity $paymentMethod)
    {

        $this->molliePaymentName = '';

        $customFields = $paymentMethod->getCustomFields();

        if ($customFields === null) {
            return;
        }

        if (array_key_exists('mollie_payment_method_name', $customFields)) {
            $this->molliePaymentName = (string)$customFields['mollie_payment_method_name'];
        }

        parent::__construct($paymentMethod);
    }

    /**
     * @return string
     */
    public function getMolliePaymentName(): string
    {
        return $this->molliePaymentName;
    }

    protected function assignConfig(array $config): void
    {
        $this->config = new PaymentMethodSalesChannelConfigAttributeCollection();

        foreach ($config as $salesChannelId => $_config) {
            $salesChannelConfig = new PaymentMethodSalesChannelConfigAttributeStruct($_config);
            $this->config->set($salesChannelId, $salesChannelConfig);
        }
    }

    /**
     * @return PaymentMethodSalesChannelConfigAttributeCollection
     */
    public function getConfig(): PaymentMethodSalesChannelConfigAttributeCollection
    {
        return $this->config;
    }
}
