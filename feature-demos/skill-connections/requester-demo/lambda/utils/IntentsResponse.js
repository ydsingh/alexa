/**
 * Builds response contents for each intent.
 */

let SendPrintWebPage = exports.SendPrintWebPage = {
    speechText: 'Skill Connections Requester sending request for Print Webpage',
    directive: {
        'type': 'Connections.StartConnection',
        'uri': 'connection://AMAZON.PrintWebPage/1',
        'input': {
            '@type': 'PrintWebPageRequest',
            '@version': '1',
            'title': 'Legendary webpage',
            'url': 'http://www.example.com/flywheel.jpeg'
        },
        'token': 'none'
    }
};
