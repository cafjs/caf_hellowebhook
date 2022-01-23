'use strict';

const React = require('react');
const rB = require('react-bootstrap');
const cE = React.createElement;

class Notification extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return cE(rB.Col, {sm: 12},
                  cE(rB.FormControl.Static,
                     {
                         className: 'url-text',
                         style: {wordWrap: 'break-word'}
                     },
                     JSON.stringify(this.props.lastNotif) || '')
                 );
    }
}

module.exports = Notification;
