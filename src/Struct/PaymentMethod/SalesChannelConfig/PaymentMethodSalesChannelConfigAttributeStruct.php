<?php

namespace Kiener\MolliePayments\Struct\PaymentMethod\SalesChannelConfig;

class PaymentMethodSalesChannelConfigAttributeStruct
{
    /** @var string */
    protected $paymentApi;

    /**
     * @return string
     */
    public function getPaymentApi(): string
    {
        return $this->paymentApi;
    }
}
