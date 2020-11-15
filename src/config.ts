// import debug from 'debug';

// const dlog = debug('conf');
const dlog = console.debug;
const configKeyRegex = /^[a-zA-Z-_]+$/;

// utils
function isObject(obj: any): boolean {
    return obj != null && typeof obj === 'object';
}

class ConfigKey {
    private key: string;
    constructor(key: string) {
        if (!configKeyRegex.test(key)) throw new Error('ConfigKey: input must follow pattern /^[a-zA-Z-_]+$/');
        this.key = key;
    }

    public toString(): string {
        return this.key;
    }
}

class ConfigPath {
    public keys: ConfigKey[];
    constructor(keys: ConfigKey[] = []) {
        this.keys = keys;
    }

    public newFromAppend(key: string): ConfigPath {
        return new ConfigPath(this.keys.concat([new ConfigKey(key)]));
    }

    public toString(): string {
        return this.keys.map((k) => k.toString()).join('.');
    }
}

class ConfigField {
    public static isConfigField(value: any): boolean {
        if (!isObject(value)) {
            return false;
        }

        return value.doc && typeof value.doc === 'string' && value.doc.length > 0;
    }

    public def: any;
    constructor(o: any) {
        this.def = o;
    }
}

class ConfigDefinition {
    public def: Map<ConfigPath, ConfigField>;
    constructor() {
        this.def = new Map();
    }

    private static _fromObject(obj: any, configPath: ConfigPath, configDef: ConfigDefinition): void {
        if (!isObject(obj)) throw new Error('value must be an object');

        const keys = Object.keys(obj);

        keys.forEach((k) => {
            const v = obj[k];
            if (isObject(v)) {
                const newPath = configPath.newFromAppend(k);
                if (ConfigField.isConfigField(v)) {
                    dlog('add:', newPath.toString());
                    configDef.add(newPath, new ConfigField(v));
                } else {
                    this._fromObject(v, newPath, configDef);
                }
            } else {
                throw new Error('value must be an object or a config field');
            }
        });
    }

    public static fromObject(obj: any): ConfigDefinition {
        if (!isObject(obj)) throw new Error('value must be an object');
        const def = new ConfigDefinition();
        this._fromObject(obj, new ConfigPath(), def);
        return def;
    }

    public add(path: ConfigPath, field: ConfigField): void {
        this.def.set(path, field);
    }
}

export { ConfigDefinition, ConfigKey, ConfigField, ConfigPath };
