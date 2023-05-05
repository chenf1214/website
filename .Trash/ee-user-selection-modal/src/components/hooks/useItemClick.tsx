import { check } from 'prettier';
import React, { useRef } from 'react';
import { DataItemCommon, Type } from '../../types';
import PickerContext from '../context/PickerContext';

/*
 * tab 点击事件处理逻辑
 */
export default function useItemClick() {
    const { data, selectedData, searchData, activeTab, expandData, selectSingle, dispatch } =
        React.useContext(PickerContext);
    const clickedRef = React.useRef(false);
    const value = useRef(null);
    const setListItemSelected = React.useCallback(
        (list: DataItemCommon[], id: string, checked: boolean) => {
            let selectedItem;
            list.forEach((item) => {
                if (item.id?.toLowerCase() === id?.toLowerCase()) {
                    item.selected = checked;
                    selectedItem = item;
                } else {
                    // 单选模式
                    if (selectSingle && !item.disabled) {
                        item.selected = false;
                    }
                }
            });
            return selectedItem;
        },
        [selectSingle],
    );

    const getLeftListPayload = React.useCallback(
        (id: string, checked: boolean, searchMode?: boolean) => {
            const payload = {};
            let selectedItem;
            const tabKey = activeTab;
            let list: DataItemCommon[] = searchMode ? searchData[tabKey] || [] : data[tabKey] || [];
            if (list.length === 0) {
                return { payload: payload, selectedItem };
            }

            // 设置list 每个item的选中状态
            selectedItem = setListItemSelected(list, id, checked);

            if (selectedItem) {
                if (searchMode) {
                    searchData[tabKey] = [...list];
                    Object.assign(payload, { searchData: { ...searchData } });
                } else {
                    data[tabKey] = [...list];
                    Object.assign(payload, { data: { ...data } });
                }
            }
            return { payload: payload, selectedItem };
        },
        [activeTab, data, searchData, setListItemSelected],
    );
    const getExpandListPayload = React.useCallback(
        (id: string, checked: boolean) => {
            let selectedItem;
            const payload = {};
            if ((expandData || [])?.length === 0) {
                return { payload: payload, selectedItem };
            }

            // 设置list 每个item的选中状态
            selectedItem = setListItemSelected(expandData, id, checked);

            return { payload: { expandData: [...expandData] }, selectedItem };
        },
        [expandData, setListItemSelected],
    );

    const removeSelectedItem = React.useCallback((selectedData: DataItemCommon[], id: string) => {
        const index = selectedData.findIndex((item) => {
            return item.id?.toLowerCase() === id?.toLowerCase();
        });
        if (index > -1) {
            selectedData.splice(index, 1);
        }
    }, []);
    const addSelectedItem = React.useCallback(
        (selectedData: DataItemCommon[], item: DataItemCommon) => {
            if (selectSingle) {
                if (value.current) {
                    selectedData[value.current - 1] = item;
                } else {
                    selectedData.push(item);
                    value.current = selectedData?.length;
                }
            } else {
                selectedData.push(item);
            }
        },
        [selectSingle],
    );

    // 选中、取消选中
    const onItemClick = React.useCallback(
        async (id: string, checked: boolean, searchMode?: boolean) => {
            if (clickedRef.current) {
                return;
            }
            clickedRef.current = true;

            const payload = {};
            let selectedItem;

            // 获取 设置 tab数据状态
            let result = getLeftListPayload(id, checked, searchMode);
            if (result.selectedItem) {
                selectedItem = result.selectedItem;
            }
            Object.assign(payload, { ...result.payload });

            // 获取 设置 展开数据状态
            const expandResult = getExpandListPayload(id, checked);
            if (expandResult.selectedItem) {
                selectedItem = expandResult.selectedItem;
            }
            Object.assign(payload, { ...expandResult.payload });

            if (selectedItem) {
                if (checked) {
                    // 添加到右侧选中列表数据
                    addSelectedItem(selectedData, selectedItem);
                } else {
                    // 从右侧选中列表数据 删除数据
                    removeSelectedItem(selectedData, id);
                }
                Object.assign(payload, { selectedData: [...selectedData] });
            } else {
                if (selectedData.length > 0) {
                    // 从右侧选中列表数据 删除数据
                    removeSelectedItem(selectedData, id);
                    Object.assign(payload, { selectedData: [...selectedData] });
                }
            }

            if (Object.keys(payload).length === 0) {
                return;
            }

            dispatch({
                type: 'setData',
                payload,
            });
            clickedRef.current = false;
            return;
        },
        [dispatch, getExpandListPayload, getLeftListPayload, addSelectedItem, removeSelectedItem, selectedData],
    );

    return onItemClick;
}
