'use strict';

const assert = require('assert');

const caf = require('caf_core');
const app = require('../public/js/app.js');
const APP_SESSION = 'default';

exports.methods = {
    // Methods called by framework
    async __ca_init__() {
        this.state.lastNotif = null;
        this.$.session.limitQueue(1, APP_SESSION); // only the last notification
        this.state.fullName = this.__ca_getAppName__() + '#' +
            this.__ca_getName__();
        this.$.webhook.init(this, '__ca_admin_handler__');
        return [];
    },

    async __ca_pulse__() {
        this.$.react.render(app.main, [this.state]);
        return [];
    },

    async __ca_admin_handler__(topic, msg, from) {
        assert(this.$.webhook.isAdmin());
        this.$.log.debug(`handle admin ${topic} ${msg} ${from}`);
        this.$.webhook.handleRegistration(this, msg, from);
        return [];
    },

    async __ca_handle_notification__(topic, msg, from) {
        this.$.log.debug(`handle notif ${topic} ${msg} ${from}`);
        const value = this.$.webhook.handleNotification(msg);
        this.state.lastNotif = value;
        this.$.session.notify([{lastNotif: value}], APP_SESSION);
        return [];
    },

    //External methods

    async hello(key) {
        key && this.$.react.setCacheKey(key);
        return this.getState();
    },

    // Example external method
    async register(topic) {
        if (!this.$.webhook.isAdmin()) {
            const id = this.__ca_getName__() + '-' + topic;
            this.$.webhook.register(this, id, '__ca_handle_notification__');
            return this.getState();
        } else {
            return [new Error('Registration disabled in admin CA')];
        }
    },

    async unregister(topic) {
        if (!this.$.webhook.isAdmin()) {
            const id = this.__ca_getName__() + '-' + topic;
            this.$.webhook.unregister(this, id);
            return this.getState();
        } else {
            return [new Error('Registration disabled in admin CA')];
        }

    },

    async listWebhooks() {
        const webhooks = this.$.webhook.list(this);
        return [null, {webhooks}];
    },

    async getState() {
        this.$.react.coin();
        return [null, this.state];
    }
};

caf.init(module);
