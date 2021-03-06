'use strict';

const assert = require('assert');

const caf = require('caf_core');
const caf_comp = caf.caf_components;
const myUtils = caf_comp.myUtils;
const app = require('../public/js/app.js');
const APP_SESSION = 'default';

exports.methods = {
    // Methods called by framework
    async __ca_init__() {
        this.state.lastNotif = null;
        this.state.topic = null;
        this.$.session.limitQueue(1, APP_SESSION); // only the last notification
        this.state.fullName = this.__ca_getAppName__() + '#' +
            this.__ca_getName__();
        this.$.webhook.init(this, '__ca_admin_handler__');
        return [];
    },

    async __ca_pulse__() {
        this.$.webhook.cleanup(this);
        const webhooks = this.$.webhook.list(this);
        if (!myUtils.deepEqual(webhooks, this.state.webhooks)) {
            this.state.webhooks = this.$.webhook.list(this);
            this.$.session.notify([{webhooks}], APP_SESSION);
        }
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
    async register(topic, secret) {
        if (!this.$.webhook.isAdmin()) {
            this.state.topic = topic;
            const id = this.__ca_getName__() + '-' + topic;
            this.$.webhook.register(this, id, '__ca_handle_notification__',
                                    secret);
            return this.getState();
        } else {
            return [new Error('Registration disabled in admin CA')];
        }
    },

    async unregister(topic) {
        if (!this.$.webhook.isAdmin()) {
            this.state.topic = null;;
            const id = this.__ca_getName__() + '-' + topic;
            this.$.webhook.unregister(this, id);
            return this.getState();
        } else {
            return [new Error('Registration disabled in admin CA')];
        }

    },

    async getState() {
        this.$.react.coin();
        return [null, this.state];
    }
};

caf.init(module);
