'use strict';

const nock = require('nock');
const expect = require('chai').expect;
const WikiRequestClient = require('../src/WikiRequestClient');

const hostname = 'https://en.wikipedia.org';
const PATH_PREFIX = '/w/api.php?action=query&prop=extracts&format=json&explaintext=&exsectionformat=plain&redirects=&titles=';

describe('WikiRequestClient', () => {
    it('should get the events with passed month and date', () => {
        const wikiRequestClient = new WikiRequestClient();
        const month = 'month';
        const date = 'date';
        const wikiRequestFake = nock(hostname)
                                .get(PATH_PREFIX + month + '_' + date)
                                .reply(200, 'SUCCESS');
        return wikiRequestClient.getEventsFromWiki(month, date)
                                .then(() => {
                                    expect(wikiRequestFake.isDone());
                                });
    });

    it('should get the parsed events with passed month and date', () => {
        const FakeWikiEventsParseClient = { parseEventsFromWiki: () => 'Parsed response string' };
        const wikiRequestClient = new WikiRequestClient(FakeWikiEventsParseClient);
        const month = 'month';
        const date = 'date';
        const wikiRequestFake = nock(hostname)
                                .get(PATH_PREFIX + month + '_' + date)
                                .reply(200, 'SUCCESS');
        return wikiRequestClient.getEventsFromWiki(month, date)
                                .then((events) => {
                                    expect(wikiRequestFake.isDone());
                                    expect(events).to.equal('Parsed response string');
                                });
    });

    it('should reject the call if an error is thrown', () => {
        const wikiRequestClient = new WikiRequestClient();
        const month = 'month';
        const date = 'date'; 
        nock(hostname).get(PATH_PREFIX + month + '_' + date).replyWithError('ERROR');
        return wikiRequestClient.getEventsFromWiki(month, date)
                                .then(() => {
                                    expect.fail(null, null, 'Resolved promise when it should rejected it');
                                })
                                .catch((err) => {
                                    expect(err.message).to.equal('ERROR');
                                });
    });
});