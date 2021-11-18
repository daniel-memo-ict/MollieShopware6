<?php

namespace Kiener\MolliePayments\Struct\PaymentMethod\SalesChannelConfig;

use Shopware\Core\Framework\Struct\Collection;

class PaymentMethodSalesChannelConfigCollection extends Collection
{
    public function getSalesChannelConfig(string $salesChannelId): PaymentMethodSalesChannelConfig
    {
        $config = new PaymentMethodSalesChannelConfig();

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
