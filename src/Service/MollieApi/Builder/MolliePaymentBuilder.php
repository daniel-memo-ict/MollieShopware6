<?php

namespace Kiener\MolliePayments\Service\MollieApi\Builder;

use Kiener\MolliePayments\Handler\PaymentHandler;
use Kiener\MolliePayments\Service\LoggerService;
use Kiener\MolliePayments\Service\MollieApi\OrderDataExtractor;
use Kiener\MolliePayments\Service\SettingsService;
use Kiener\MolliePayments\Service\WebhookBuilder\WebhookBuilder;
use Shopware\Core\Checkout\Cart\Price\Struct\CartPrice;
use Shopware\Core\Checkout\Order\OrderEntity;
use Shopware\Core\System\Locale\LocaleEntity;
use Shopware\Core\System\SalesChannel\SalesChannelContext;
use Symfony\Component\Routing\RouterInterface;

class MolliePaymentBuilder
{
    public const MOLLIE_DEFAULT_LOCALE_CODE = 'en_GB';

    /**
     * @var SettingsService
     */
    private $settingsService;

    /**
     * @var LoggerService
     */
    private $loggerService;

    /**
     * @var OrderDataExtractor
     */
    private $extractor;

    /**
     * @var RouterInterface
     */
    private $router;

    /**
     * @var MollieOrderPriceBuilder
     */
    private $priceBuilder;

    /**
     * @var WebhookBuilder
     */
    private $webhookBuilder;

    /**
     * @param SettingsService $settingsService
     * @param OrderDataExtractor $extractor
     * @param RouterInterface $router
     * @param MollieOrderPriceBuilder $priceBuilder
     * @param LoggerService $loggerService
     */
    public function __construct(
        SettingsService         $settingsService,
        OrderDataExtractor      $extractor,
        RouterInterface         $router,
        MollieOrderPriceBuilder $priceBuilder,
        LoggerService           $loggerService
    )
    {
        $this->settingsService = $settingsService;
        $this->loggerService = $loggerService;
        $this->extractor = $extractor;
        $this->router = $router;
        $this->priceBuilder = $priceBuilder;

        $this->webhookBuilder = new WebhookBuilder($router);
    }

    public function build(
        OrderEntity         $order,
        string              $transactionId,
        string              $paymentMethod,
        string              $returnUrl,
        SalesChannelContext $salesChannelContext,
        ?PaymentHandler     $handler
    ): array
    {
        $customer = $this->extractor->extractCustomer($order, $salesChannelContext);
        $currency = $this->extractor->extractCurrency($order, $salesChannelContext);
        $locale = $this->extractor->extractLocale($order, $salesChannelContext);
        $localeCode = ($locale instanceof LocaleEntity) ? $locale->getCode() : self::MOLLIE_DEFAULT_LOCALE_CODE;

        $paymentData = [];
        $paymentData['amount'] = $this->priceBuilder->build($order->getAmountTotal(), $currency->getIsoCode());
        if ($order->getTaxStatus() === CartPrice::TAX_STATE_FREE) {
            $paymentData['amount'] = $this->priceBuilder->build($order->getAmountNet(), $currency->getIsoCode());
        }
        $paymentData['locale'] = $localeCode;
        $paymentData['method'] = $paymentMethod;
        $paymentData['description'] = $order->getOrderNumber();

        // create urls
        $redirectUrl = $this->router->generate(
            'frontend.mollie.payment',
            [
                'transactionId' => $transactionId
            ],
            $this->router::ABSOLUTE_URL
        );

        $paymentData['redirectUrl'] = $redirectUrl;

        $webhookUrl = $this->webhookBuilder->buildWebhook($transactionId);
        $paymentData['webhookUrl'] = $webhookUrl;

        // add payment specific data
        if ($handler instanceof PaymentHandler) {
            $paymentData = $handler->processPaymentMethodSpecificParameters(
                ['payment' => $paymentData],
                $order,
                $salesChannelContext,
                $customer
            )['payment'];
        }

        return $paymentData;
    }
}
