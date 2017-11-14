'use strict';

const WELCOME = 'History buff. What day do you want events for?';

const HELP = 'With History Buff, you can get historical events for any day of the year. For example, you could say today, or August thirtieth. Now, which day do you want?';

const CONNECTERROR = 'There is a problem connecting to Wikipedia at this time. Please try again later.';

const GODEEPER = 'Wanna go deeper in history?';

const CARDTITLE = 'More events on this day in history';

const MOREREPROMPTTEXT = 'Do you want to know more about what happened on this date?';

const NOMORE = 'There are no more events for this date. Try another date by saying, get events for august thirtieth.';

const HELPREPROMPTTEXT = 'Which day do you want?';

const DIRECTIVESERVICEMESSAGE = 'Please wait...';

const DIRECTIVEERRORMESSAGE = 'Cannot enqueue a progressive direcitve.';

const GOODBYE = 'Bye! Thanks for using the history buff skill';

const UNHANDLED = 'This skill doesn\'t support that. Please ask something else.';


module.exports = {
    'WELCOME': WELCOME,
    'HELP': HELP,
    'CONNECTERROR': CONNECTERROR,
    'GODEEPER': GODEEPER,
    'CARDTITLE': CARDTITLE,
    'MOREREPROMPTTEXT': MOREREPROMPTTEXT,
    'NOMORE': NOMORE,
    'HELPREPROMPTTEXT': HELPREPROMPTTEXT,
    'DIRECTIVESERVICEMESSAGE': DIRECTIVESERVICEMESSAGE,
    'DIRECTIVEERRORMESSAGE': DIRECTIVEERRORMESSAGE,
    'GOODBYE': GOODBYE,
    'UNHANDLED': UNHANDLED
};