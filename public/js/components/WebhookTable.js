'use strict';

const React = require('react');
const rB = require('react-bootstrap');
const cE = React.createElement;

class WebhookTable extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const renderRows = () => {
            const keys = Object.keys(this.props.webhooks || {}).sort();
            const webhooks = keys.map((x) => this.props.webhooks[x] || {});
            return webhooks.map((t, i) =>
                                cE('tr', {key:10*i},
                                   cE('td', {key:10*i+6}, t.id || ''),
                                   cE('td', {key:10*i+1}, t.topic || ''),
                                   cE('td', {key:10*i+4}, t.authenticated ?
                                      'true' : 'false'),
                                   cE('td', {key:10*i+7}, t.active ?
                                      'true' : 'false')
                                  )
                               );
        };

        return cE(rB.Table, {striped: true, responsive: true, bordered: true,
                             condensed: true, hover: true},
                  cE('thead', {key:0},
                     cE('tr', {key:1},
                        cE('th', {key:9}, 'id'),
                        cE('th', {key:2}, 'topic'),
                        cE('th', {key:5}, 'authenticated'),
                        cE('th', {key:3}, 'active')
                       )
                    ),
                  cE('tbody', {key:8}, renderRows())
                 );

    }
}

module.exports = WebhookTable;
