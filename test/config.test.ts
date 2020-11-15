import { ConfigDefinition } from '../src/config';

describe('ConfigDefinition should', () => {
    it('be able to create from object', () => {
        const defObj = {
            host: {
                doc: 'ipv4 host string',
            },
            port: {
                doc: 'port number',
            },
        };

        const def = ConfigDefinition.fromObject(defObj);

        console.log('def:', def.def);
        expect(def).not.toBeUndefined();
    });

    it('be able to create from nested object', () => {
        const defObj = {
            app: {
                host: {
                    doc: 'ipv4 host string',
                },
                port: {
                    doc: 'port number',
                },
            },
            timeout: {
                doc: 'timeout',
            },
        };

        const def = ConfigDefinition.fromObject(defObj);

        console.log('def:', def.def);
        expect(def).not.toBeUndefined();
    });
});
