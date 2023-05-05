import React from 'react';
import { DataItemCommon, UseSelectionProps, LoadingEnum } from '../../types';
import { setItemData } from './utils';
import PickerContext from '../context/PickerContext';
// 点击展开数据 比如群成员
export default function useExpandClick(props: UseSelectionProps) {
    const { getExpandData } = props;
    const { activeTab, selectedData, disabledList, expandTabKeys, dispatch } = React.useContext(PickerContext);
    // const { activeTab, selectedData, expandTabKeys } = state;

    const onExpandClick = React.useCallback(
        async (item: DataItemCommon) => {
            const { id, title } = item;
            if (!getExpandData) {
                return;
            }
            dispatch({ type: 'setLoading', payload: { loading: LoadingEnum.Loading } });
            // 展开的key 中不包括 item的所属类型，真接返回
            if (!expandTabKeys?.includes(item.type)) {
                dispatch({ type: 'setLoading', payload: { loading: LoadingEnum.Error } });
                return;
            }

            let expandData = await getExpandData(item);

            if (selectedData?.length > 0 || disabledList?.length > 0) {
                expandData = expandData?.map((item) => {
                    return setItemData(item, { selectedData, disabledList });
                });
            }

            const breadcrumbProps = {
                [activeTab]: [
                    {
                        id,
                        label: title,
                    },
                ],
            };
            dispatch({ type: 'setLoading', payload: { loading: LoadingEnum.Unloading } });
            dispatch({
                type: 'setExpandData',
                payload: { expandData, breadcrumbProps },
            });
            return;
        },
        [activeTab, disabledList, dispatch, expandTabKeys, getExpandData, selectedData],
    );

    return onExpandClick;
}
