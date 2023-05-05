import React from 'react';
import PickerContext from '../context/PickerContext';
import { removeSelectedData, setItemData } from './utils';

// 解析数据
export default function useSelectAll() {
    const { selectedData, disabledList, expandData, data, activeTab, dispatch } = React.useContext(PickerContext);

    // 设置数据的选中禁用状态
    const selectAll = React.useCallback(
        (selected: boolean) => {
            let tempExpandData = [...(expandData || [])];
            let tempSelectedData = [...(selectedData || [])];

            if (tempExpandData.length === 0) {
                return;
            }
            if (selected) {
                // 找出 item.selected 为 false 的
                const data = tempExpandData.filter((item) => {
                    const selected = item.selected;
                    if (!item.disabled) {
                        item.selected = true;
                    }
                    return !item.disabled && !selected;
                });
                tempSelectedData = [...selectedData, ...data];
            } else {
                tempExpandData = tempExpandData.map((item) => {
                    // 删除右侧选中数据
                    if (!item.disabled) {
                        item.selected = false;
                        removeSelectedData(item, tempSelectedData);
                    }
                    return item;
                });
            }

            const payload = { expandData: tempExpandData, selectedData: [...tempSelectedData] };

            let activeTabData = data[activeTab] || [];
            if (activeTabData.length > 0) {
                // 设置当前tab的选中状态
                activeTabData = activeTabData.map((item) => {
                    setItemData(item, { selectedData: tempSelectedData, disabledList });
                    return item;
                });
                data[activeTab] = [...activeTabData];
                Object.assign(payload, { data: { ...data } });
            }

            dispatch({
                type: 'expandDataSelected',
                payload: payload,
            });
        },
        [activeTab, data, disabledList, dispatch, expandData, selectedData],
    );

    return selectAll;
}
