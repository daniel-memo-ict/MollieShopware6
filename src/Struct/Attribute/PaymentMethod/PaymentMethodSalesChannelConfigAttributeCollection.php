<?php

namespace Kiener\MolliePayments\Struct\Attribute\PaymentMethod;

use Kiener\MolliePayments\Struct\Attribute\AttributeCollection;

class PaymentMethodSalesChannelConfigAttributeCollection extends AttributeCollection
{
    public function getSalesChannelConfig(string $salesChannelId): PaymentMethodSalesChannelConfigAttributeStruct
    {
        $config = new PaymentMethodSalesChannelConfigAttributeStruct();

        $config->merge(new PaymentMethodSalesChannelConfigDefaults());

        if ($this->has("null")) {
            $config->merge($this->get("null"));
        }

        if ($this->has($salesChannelId)) {
            $config->merge($this->get($salesChannelId));
        }

        return $config;
    }
}
