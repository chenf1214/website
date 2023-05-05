import React from 'react';
import { ContactPickerProps } from '../../types';
import { setItemData, setItemDisabled } from './utils';
import { isUndefined } from 'lodash-es';
import { defaultExpandTabKeys, defaultTabKey, langConfigObj, PickerState } from '../context/PickerContext';

// 初始化 已选中的数据
export default function useGetInitData() {
    const mapPropsToState = React.useCallback((props: ContactPickerProps): Partial<PickerState> => {
        if (!props.userInfo) {
            return {} as any;
        }
        const initState = {
            title: props.title,
            cancelText: props.cancelText,
            okText: props.okText,
            selectedList: props.selectedList || [],
            disabledList: props.disabledList || [],
            placeholder: props.placeholder,
            teamId: props.teamId,
            userInfo: props.userInfo || ({} as any),
            selectSingle: props.selectSingle,
        };

        if (!isUndefined(props.tabKeys)) {
            Object.assign(initState, { tabKeys: props.tabKeys });
        } else {
            Object.assign(initState, { tabKeys: defaultTabKey });
        }

        if (!isUndefined(props.expandTabKeys)) {
            Object.assign(initState, { expandTabKeys: props.expandTabKeys });
        } else {
            Object.assign(initState, { expandTabKeys: defaultExpandTabKeys });
        }

        if (!isUndefined(props.canSelectedExpandKeys)) {
            Object.assign(initState, { canSelectedExpandKeys: props.canSelectedExpandKeys });
        }
        if (!isUndefined(props.customTabs)) {
            Object.assign(initState, { customTabs: props.customTabs }); // 自定义tab内容
        }
        if (!isUndefined(props.selectSingle)) {
            Object.assign(initState, { selectSingle: props.selectSingle }); // 开启单选
        }
        if (!isUndefined(props.disableSearch)) {
            Object.assign(initState, { disableSearch: props.disableSearch }); // 禁用搜索功能
        }
        let lang = props.lang || 'zh_CN';
        if (lang.indexOf('-') > -1) {
            lang = lang?.replace('-', '_');
        }
        const langConfig = langConfigObj[lang] || langConfigObj['zh_CN'];
        Object.assign(initState, { lang, langConfig });
        return initState;
    }, []);

    // 获取用户传递的传数， 初始化为state
    const getInitState = React.useCallback(
        async (props: ContactPickerProps) => {
            const state = mapPropsToState(props);
            const { tabKeys, disabledList, selectedList } = state;
            let selectedData = [...(selectedList || [])];
            if (selectedData.length > 0 && disabledList?.length > 0) {
                selectedData = selectedData.map((item) => {
                    setItemDisabled(item, [...(disabledList || [])]);
                    return item;
                });
            }

            let keys = tabKeys;
            if (!keys) {
                keys = defaultTabKey;
            }

            const activeTab = keys[0];

            return {
                ...state,
                selectedData,
                activeTab,
                selectedList,
                disabledList,
            };
        },
        [mapPropsToState],
    );

    // 获取初始化的tab数据
    const getInitTabData = React.useCallback(async (props: ContactPickerProps, initState: Partial<PickerState>) => {
        const { activeTab, selectedData, disabledList, customTabs } = initState;
        let tabData = [];
        if (activeTab && props.getTabData) {
            const opts = {};
            if (customTabs?.length > 0) {
                const tab = customTabs.find((item) => item.key === activeTab);
                Object.assign(opts, { ...(tab.opts || {}) });
            }
            const result = await props.getTabData(activeTab, { start: 0, length: 20 }, opts);
            tabData = result.data;
        }
        if (selectedData?.length > 0 || disabledList?.length > 0) {
            tabData = tabData?.map((item) => {
                return setItemData(item, { selectedData, disabledList });
            });
        }
        return tabData;
    }, []);

    return { getInitState, getInitTabData };
}
