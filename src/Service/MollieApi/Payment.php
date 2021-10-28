<?php declare(strict_types=1);

namespace Kiener\MolliePayments\Service\MollieApi;

use Kiener\MolliePayments\Exception\PaymentCouldNotBeCancelledException;
use Kiener\MolliePayments\Factory\MollieApiFactory;
use Mollie\Api\Exceptions\ApiException;
use Mollie\Api\Resources\Payment as MolliePayment;
use Mollie\Api\Resources\PaymentCollection;
use Monolog\Logger;
use Shopware\Core\System\SalesChannel\SalesChannelContext;

class Payment
{
    /**
     * @var MollieApiFactory
     */
    private $clientFactory;

    public function __construct(MollieApiFactory $clientFactory)
    {
        $this->clientFactory = $clientFactory;
    }

    public function create(array $paymentData, SalesChannelContext $salesChannelContext): MolliePayment
    {
        /**
         * Create an order at Mollie based on the prepared array of order data.
         */
        try {
            $apiClient = $this->clientFactory->getClient($salesChannelContext->getSalesChannel()->getId());

            return $apiClient->payments->create($paymentData);
        } catch (ApiException $e) {
//            $this->logger->addEntry(
//                $e->getMessage(),
//                $salesChannelContext->getContext(),
//                $e,
//                [
//                    'function' => 'finalize-payment',
//                ],
//                Logger::CRITICAL
//            );

            throw new \RuntimeException(sprintf('Could not create Mollie order, error: %s', $e->getMessage()));
        }
    }

    public function delete(string $molliePaymentId, string $orderSalesChannelContextId): void
    {
        $apiClient = $this->clientFactory->getClient($orderSalesChannelContextId);

        try {
            $apiClient->payments->delete($molliePaymentId);
        } catch (ApiException $e) {
            throw new PaymentCouldNotBeCancelledException($molliePaymentId, [], $e);
        }
    }

    public function cancelOpenPayments(?PaymentCollection $payments, string $salesChannelContextId): void
    {
        if (!$payments instanceof PaymentCollection) {
            return;
        }

        /** @var MolliePayment $payment */
        foreach ($payments as $payment) {
            if ($payment->isOpen() && $payment->isCancelable) {
                $this->delete($payment->id, $salesChannelContextId);
            }
        }
    }
}
