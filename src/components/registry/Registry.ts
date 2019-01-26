import * as React from 'react';

import { DemoEntry } from './DemoEntry';
import { GridLayout } from '../layouts/GridLayout';
import { TabsLayout } from '../layouts/TabsLayout';
import { LayoutProps } from '../layouts/LayoutProps';
import { LabelInstanceTableLayout } from '../layouts/LabelInstanceTableLayout';
import { SingleItemLayout } from '../layouts/SingleItemLayout';

class Registry {
    name: string;
    _usedNames: string[] = [];

    _demoEntries: DemoEntry[] = [];
    _currentDemo?: DemoEntry;

    constructor(name: string) {
        this.name = name;
    }

    registerAsGrid(name: string, minWidth: number, componentRegistrator: (registry: Registry) => void) {
        return this.register(name, GridLayout, componentRegistrator, '', {minWidth});
    }

    registerAsRows(name: string, componentRegistrator: (registry: Registry) => void) {
        return this.register(name, GridLayout, componentRegistrator, '', {minWidth: 0});
    }

    registerAsTabs(name: string, componentRegistrator: (registry: Registry) => void) {
        return this.register(name, TabsLayout, componentRegistrator);
    }

    registerAsTwoColumnTable(name: string, componentRegistrator: (registry: Registry) => void) {
        return this.register(name, LabelInstanceTableLayout, componentRegistrator);
    }

    registerSingle(name: string, componentRegistrator: (registry: Registry) => void) {
        this.register(name, SingleItemLayout, componentRegistrator);
        return this;
    }

    registerAsMiniApp(name: string, urlPrefix: string, componentRegistrator: (registry: Registry) => void) {
        this.register(name, SingleItemLayout, componentRegistrator, urlPrefix);
    }

    register(name: string,
             layoutComponent: React.ComponentType<LayoutProps>,
             componentRegistrator: (registry: Registry) => void,
             urlPrefix: string = '',
             layoutOpts: object = {}) {

        if (this._usedNames.indexOf(name) !== -1) {
            throw new Error(`name ${name} was already used`);
        }

        this._currentDemo = new DemoEntry(name, layoutComponent, urlPrefix, layoutOpts);
        this._demoEntries.push(this._currentDemo);

        this._usedNames.push(name);

        componentRegistrator(this);

        return this;
    }

    get names(): string[] {
        return this._usedNames;
    }

    description(markdown: string) {
        if (this._currentDemo) {
            this._currentDemo.description(markdown);
        } else {
            throw new Error('call register method prior setting the description');
        }

        return this;
    }

    add(title: string, component: React.ComponentType, description: string = '') {
        if (this._currentDemo) {
            this._currentDemo.add(title, description, component);
        } else {
            throw new Error('call register method prior adding elements');
        }

        return this;
    }

    firstMiniAppByUrl(url: string): DemoEntry | null {
        const byUrl = this._demoEntries
            .filter(entry => entry.isMiniApp() && url.startsWith(entry.urlPrefix));

        return byUrl.length > 0 ? byUrl[0] : null;
    }

    findByName(name: string): DemoEntry | null {
        const byName = this._demoEntries
            .filter(entry => entry.name === name);

        if (byName.length === 0) {
            return null;
        }

        return byName[0];
    }
}

export { Registry };