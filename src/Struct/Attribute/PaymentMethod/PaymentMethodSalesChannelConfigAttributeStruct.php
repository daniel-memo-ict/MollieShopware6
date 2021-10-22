<?php

namespace Kiener\MolliePayments\Struct\Attribute\PaymentMethod;

use Kiener\MolliePayments\Struct\Attribute\AttributeStruct;

class PaymentMethodSalesChannelConfigAttributeStruct extends AttributeStruct
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

    public function merge(AttributeStruct $struct): self
    {
        foreach ($struct->getVars() as $key => $value) {
            if ($value === null) {
                continue;
            }

            $setMethod = 'set' . ucfirst($key);
            if (method_exists($this, $setMethod)) {
                $this->$setMethod($value);
            } elseif (property_exists($this, $key)) {
                $this->$key = $value;
            }
        }

        return $this;
    }
}
