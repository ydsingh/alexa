'use strict';

const AmazonPay = require('@amazonpay/amazon-pay-alexa-utils');

function buildSetupDirective(payloadBuilder, correlationToken) {
    return AmazonPay.setupDirective(payloadBuilder, correlationToken).build()
}

function buildChargeDirective(payloadBuilder, correlationToken) {
    return AmazonPay.chargeDirective(payloadBuilder, correlationToken).build()
}

module.exports = {
    'buildSetupDirective': buildSetupDirective,
    'buildChargeDirective': buildChargeDirective
};