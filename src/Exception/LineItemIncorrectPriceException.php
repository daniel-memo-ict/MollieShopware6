<?php

declare(strict_types=1);

namespace Kiener\MolliePayments\Exception;

use Shopware\Core\Checkout\Order\Aggregate\OrderLineItem\OrderLineItemEntity;
use Shopware\Core\Framework\ShopwareHttpException;
use Symfony\Component\HttpFoundation\Response;

class LineItemIncorrectPriceException extends ShopwareHttpException
{
    public function __construct(OrderLineItemEntity $lineItem)
    {
        $message = "OrderLineItem \"{{label}}\" ({{id}}) has incorrect pricing. ({{currencySymbol}}{{unitPrice}} x {{quantity}} = {{currencySymbol}}{{totalPrice}})";

        $parameters = [
            'id' => $lineItem->getId(),
            'referencedId' => $lineItem->getReferencedId(),
            'type' => $lineItem->getType(),
            'label' => $lineItem->getLabel(),
            'quantity' => $lineItem->getPrice()->getQuantity() ?? $lineItem->getQuantity(),
            'unitPrice' => $lineItem->getPrice()->getUnitPrice() ?? $lineItem->getUnitPrice(),
            'totalPrice' => $lineItem->getPrice()->getTotalPrice() ?? $lineItem->getTotalPrice(),
            //'currencySymbol' => $lineItem->getOrder()->getCurrency()->getSymbol(),
        ];

        parent::__construct($message, $parameters);
    }

    public function getErrorCode(): string
    {
        return 'MOLLIE_PAYMENTS__LINE_ITEM_HAS_INCORRECT_PRICE';
    }

    public function getStatusCode(): int
    {
        return Response::HTTP_BAD_REQUEST;
    }
}
