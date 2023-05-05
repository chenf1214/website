import React, { memo, useCallback, useEffect, useMemo } from 'react';
import ContentBox from './ContentBox';
import PickerContext, { pickerState } from '../context/PickerContext';
import { ContactPickerProps, PickerResult, Type, LoadingEnum } from '../../types';
import useSelection from '../useSelection';
import Head from './Head';
import useGetInitData from '../hooks/useGetInitData';
import { Dispatcher, reducer } from '../context/reducer';
import './index.less';

type ModalProps = Pick<
    ContactPickerProps,
    'className' | 'onResult' | 'RightComp' | 'getTabData' | 'getExpandData' | 'getSearchData' | 'getClsTag'
>;
const MainComp = memo((props: ModalProps) => {
    const { onResult, RightComp, getExpandData, getTabData, getSearchData, getClsTag } = props;

    const { onItemClick, loadTabData, onExpandClick } = useSelection({
        getTabData,
        getExpandData,
    });

    // 取消事件
    const onClose = useCallback(() => {
        if (onResult) {
            onResult({ action: 'cancel' });
        }
    }, [onResult]);

    // 确认事件
    const onConfirm = useCallback(
        async (result: PickerResult) => {
            if (onResult) {
                await onResult(result);
            }
        },
        [onResult],
    );

    return (
        <div className={`ee-contacts-picker__container ${props.className || ''}`}>
            <Head />
            <ContentBox
                onItemClick={onItemClick}
                loadTabData={loadTabData}
                getSearchData={getSearchData}
                RightComp={RightComp}
                onConfirm={onConfirm}
                onClose={onClose}
                onExpandClick={onExpandClick}
                getClsTag={getClsTag}
            />
        </div>
    );
});

const ContactPicker = (props: ContactPickerProps) => {
    let [state, setState] = React.useReducer(reducer, pickerState);
    const dispatch: Dispatcher = setState as any;

    const { getInitState, getInitTabData } = useGetInitData();

    const initData = useCallback(async () => {
        try {
            dispatch({ type: 'setLoading', payload: { loading: LoadingEnum.Loading } });
            const initState = await getInitState(props);
            dispatch({
                type: 'initData',
                payload: { initState: initState, loading: LoadingEnum.Loading },
            });
            // 优化数据加载流程
            const tabData = await getInitTabData(props, initState);
            if (tabData.length === 0) {
                dispatch({ type: 'setLoading', payload: { loading: LoadingEnum.Error } });
                return;
            }
            const { activeTab } = initState;
            dispatch({
                type: 'initTabData',
                payload: { data: { [activeTab]: tabData }, loading: LoadingEnum.Unloading },
            });
        } catch (e) {
            dispatch({ type: 'setLoading', payload: { loading: LoadingEnum.Error } });
        }
    }, [dispatch, getInitState, getInitTabData, props]);

    useEffect(() => {
        if (!props.userInfo) {
            return;
        }
        initData();
    }, [initData, props.userInfo]);

    const providerValue = useMemo(() => {
        return {
            ...state,
            dispatch: dispatch,
        };
    }, [dispatch, state]);

    if (!props.userInfo) {
        return null;
    }

    console.log('providerValue 2===>', providerValue);

    return (
        <PickerContext.Provider value={providerValue}>
            <MainComp
                RightComp={props.RightComp}
                getExpandData={props.getExpandData}
                getTabData={props.getTabData}
                getSearchData={props.getSearchData}
                onResult={props.onResult}
                getClsTag={props.getClsTag}
            />
        </PickerContext.Provider>
    );
};

export default memo(ContactPicker);
