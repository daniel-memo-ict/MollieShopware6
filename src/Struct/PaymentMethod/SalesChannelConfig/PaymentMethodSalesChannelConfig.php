<?php

namespace Kiener\MolliePayments\Struct\PaymentMethod\SalesChannelConfig;

class PaymentMethodSalesChannelConfig
{
    /** @var string */
    protected $paymentApi;

    public function __construct($attributes = [])
    {
        if (array_key_exists('paymentApi', $attributes)) {
            $this->paymentApi = $attributes['paymentApi'];
        }
    }

    /**
     * @return string
     */
    public function getPaymentApi(): string
    {
        return $this->paymentApi;
    }

    public function merge(PaymentMethodSalesChannelConfig $other)
    {
        if(!empty($other->paymentApi))
        {
            $this->paymentApi = $other->paymentApi;
        }
    }
}
