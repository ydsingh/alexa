'use strict';

const config = require('config');
const AmazonPay = require('@amazonpay/amazon-pay-alexa-utils');

/**
    A detailed list of attributes available to build the payload can be found here:
    https://developer.amazon.com/en-US/docs/alexa/amazon-pay-alexa/amazon-pay-apis-for-alexa.html
**/


// Builds payload for Setup action
function getSetupBuilder(locale) {
    const payloadBuilder = AmazonPay.setupPayload("2")
        .withSellerId(config.sellerId)
        .withSellerNote(config.sellerNote)
        .withCountryOfEstablishment(config.countryOfEstablishment)
        .withLedgerCurrency(config.ledgerCurrency)
        .withCheckoutLanguage(locale)
        .shippingNeeded(config.needAmazonShippingAddress)
        .withCustomInformation(config.customInformation)
        .withStoreName(config.storeName)
        .withSellerBillingAgreementId(config.sellerBillingAgreementId)
        .onSandbox({ 'eMail': config.sandboxCustomerEmailId });
    return payloadBuilder;
}

// Builds payload for Charge action
function getChargeBuilder(billingAgreementId) {
    const payloadBuilder = AmazonPay.chargePayload("2")
        .withSellerId(config.sellerId)
        .withBillingAgreementId(billingAgreementId)
        .withPaymentAction(config.paymentAction)
        .withAuthorizationReferenceId(config.authorizationReferenceId)
        .withAmount(config.amount)
        .withCurrency(config.currencyCode)
        .withSellerAuthorizationNote(config.sellerAuthorizationNote)
        .withSoftDescriptor(config.softDescriptor)
        .withSellerOrderId(config.sellerOrderId)
        .withStoreName(config.storeName)
        .withCustomInformation(config.customInformation)
        .withSellerNote(config.sellerNote);
    return payloadBuilder;
}

module.exports = {
    'getSetupBuilder': getSetupBuilder,
    'getChargeBuilder': getChargeBuilder
};