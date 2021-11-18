<?php

namespace Kiener\MolliePayments\Struct\PaymentMethod\SalesChannelConfig;

use Shopware\Core\Framework\Struct\Collection;

class PaymentMethodSalesChannelConfigAttributeCollection extends Collection
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
