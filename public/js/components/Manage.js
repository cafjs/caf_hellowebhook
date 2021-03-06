'use strict';

const React = require('react');
const rB = require('react-bootstrap');
const cE = React.createElement;
const AppActions = require('../actions/AppActions');

class Manage extends React.Component {

    constructor(props) {
        super(props);
        this.doRegister = this.doRegister.bind(this);
        this.doUnregister = this.doUnregister.bind(this);
        this.handleTopic = this.handleTopic.bind(this);
        this.handleSecret = this.handleSecret.bind(this);
        this.state = {
            topicName: '',
            secret: ''
        };
    }

    handleTopic(e) {
        this.setState({topicName: e.target.value});
    }

    handleSecret(e) {
        this.setState({secret: e.target.value});
    }

    doRegister() {
        if (this.state.topicName) {
            AppActions.register(this.props.ctx, this.state.topicName,
                                this.state.secret);
        } else {
            const err = new Error('No topic');
            AppActions.setError(this.props.ctx, err);
        }
    }

    doUnregister() {
        if (this.state.topicName) {
            AppActions.unregister(this.props.ctx, this.state.topicName);
        } else {
            const err = new Error('No topic');
            AppActions.setError(this.props.ctx, err);
        }
    }

    render() {
        return cE(rB.Form, {horizontal: true},
                  cE(rB.FormGroup, {controlId: 'incId'},
                     cE(rB.Col, {sm:2, xs: 12},
                        cE(rB.ControlLabel, null, 'Topic')
                       ),
                     cE(rB.Col, {sm:4, xs: 12},
                        cE(rB.FormControl, {
                            type: 'text',
                            value: this.state.topicName,
                            placeholder: '',
                            onChange: this.handleTopic
                        })
                       )
                    ),
                  cE(rB.FormGroup, {controlId: 'secretId'},
                     cE(rB.Col, {sm:2, xs: 12},
                        cE(rB.ControlLabel, null, 'Secret')
                       ),
                     cE(rB.Col, {sm:4, xs: 12},
                        cE(rB.FormControl, {
                            type: 'password',
                            value: this.state.secret,
                            placeholder: '',
                            onChange: this.handleSecret
                        })
                       )
                    ),
                   cE(rB.FormGroup, {controlId: 'buttonId'},
                      cE(rB.Col, {smOffset:2, xs: 12},
                        cE(rB.ButtonGroup, null,
                           cE(rB.Button, {
                               bsStyle: 'primary',
                               onClick: this.doRegister
                           }, 'Register'),
                           cE(rB.Button, {
                               bsStyle: 'danger',
                               onClick: this.doUnregister
                           }, 'Unregister')
                          )
                       )
                     )
                 );
    }
}

module.exports = Manage;
