import React from 'react';
import { Spin } from 'antd';
import './index.less';
export default function Loading() {
    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Spin className="global-loading" />
        </div>
    );
}
