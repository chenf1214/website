import React from 'react';
import PickerContext from '../context/PickerContext';

export default function useGetOpts() {
    const { teamId, customTabs } = React.useContext(PickerContext);
    /**
     * 获取调用tab数据、搜索数据 的opts参数
     */
    const getOpts = React.useCallback(
        (tabKey: string) => {
            const opts = {};
            if (tabKey === 'space') {
                Object.assign(opts, { teamId });
            } else if (customTabs?.length > 0) {
                // 自定义tab添加请求参数
                const tab = customTabs.find((item) => {
                    return item.key === tabKey;
                });
                if (tab) {
                    Object.assign(opts, { ...(tab.opts || {}) });
                }
            }
            return opts;
        },
        [customTabs, teamId],
    );

    return { getOpts };
}
