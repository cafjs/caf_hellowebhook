'use strict';

const React = require('react');
const rB = require('react-bootstrap');
const AppActions = require('../actions/AppActions');
const AppStatus = require('./AppStatus');
const DisplayError = require('./DisplayError');
const Manage = require('./Manage');
const Notification = require('./Notification');
const WebhookTable = require('./WebhookTable');

const cE = React.createElement;

class MyApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.props.ctx.store.getState();
    }

    componentDidMount() {
        if (!this.unsubscribe) {
            this.unsubscribe = this.props.ctx.store
                .subscribe(this._onChange.bind(this));
            this._onChange();
        }
    }

    componentWillUnmount() {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
    }

    _onChange() {
        if (this.unsubscribe) {
            this.setState(this.props.ctx.store.getState());
        }
    }

    render() {
        return cE('div', {className: 'container-fluid'},
                  cE(DisplayError, {
                      ctx: this.props.ctx,
                      error: this.state.error
                  }),
                  cE(rB.Panel, null,
                     cE(rB.Panel.Heading, null,
                        cE(rB.Panel.Title, null,
                           cE(rB.Grid, {fluid: true},
                              cE(rB.Row, null,
                                 cE(rB.Col, {sm:1, xs:1},
                                    cE(AppStatus, {
                                        isClosed: this.state.isClosed
                                    })
                                   ),
                                 cE(rB.Col, {
                                     sm: 5,
                                     xs:10,
                                     className: 'text-right'
                                 }, 'hellowebhook'),
                                 cE(rB.Col, {
                                     sm: 5,
                                     xs:11,
                                     className: 'text-right'
                                 }, this.state.fullName)
                                )
                             )
                          )
                       ),
                     cE(rB.Panel.Body, null,
                        cE(rB.Panel, null,
                           cE(rB.Panel.Heading, null,
                              cE(rB.Panel.Title, null, 'Manage')
                             ),
                           cE(rB.Panel.Body, null,
                              cE(Manage, {
                                  ctx: this.props.ctx,
                                  topic: this.state.topic
                              })
                             )
                          ),
                        cE(rB.Panel, null,
                           cE(rB.Panel.Heading, null,
                              cE(rB.Panel.Title, null, 'Webhooks')
                             ),
                           cE(rB.Panel.Body, null,
                              cE(WebhookTable, {
                                  webhooks: this.state.webhooks
                              })
                             )
                          ),
                        cE(rB.Panel, null,
                           cE(rB.Panel.Heading, null,
                              cE(rB.Panel.Title, null, 'Last Notification')
                             ),
                           cE(rB.Panel.Body, null,
                              cE(Notification, {
                                  ctx: this.props.ctx,
                                  lastNotif: this.state.lastNotif
                              })
                             )
                          ),


                       )
                    )
                 );
    }
};

module.exports = MyApp;
