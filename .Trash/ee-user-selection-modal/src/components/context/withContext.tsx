import React, { FunctionComponent, memo, useContext, useMemo } from 'react';

function withContext<T, K extends string & keyof T, P extends Pick<T, K>>(
    context: React.Context<T>,
    keys: K[],
    Component: FunctionComponent<P>,
) {
    return (props: Omit<P, K>) => {
        const d = useContext(context);
        const Comp = useMemo(() => {
            return memo(Component);
        }, []);
        const value = useMemo(() => {
            const opts: Pick<T, K> = {} as any;
            keys.forEach((k) => {
                opts[k] = d[k];
            });
            return opts;
        }, [d]);
        // @ts-ignore
        return <Comp {...props} {...value} />;
    };
}

export function withClassContext<T, K extends string & keyof T, P extends Pick<T, K>>(
    context: React.Context<T>,
    keys: K[],
    Component: React.ComponentClass<P>,
) {
    return (props: Omit<P, K>) => {
        const d = useContext(context);
        const value = useMemo(() => {
            const opts: Pick<T, K> = {} as any;
            keys.forEach((k) => {
                opts[k] = d[k];
            });
            return opts;
        }, [d]);
        // @ts-ignore
        return <Component {...props} {...value} />;
    };
}

export default withContext;
