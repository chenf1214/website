import React, { useContext, useCallback, useState } from 'react';
import PickerContext from '../../context/PickerContext';
import './index.less';
import { getId } from '../../../utils';
import { LoadingOutlined } from '@ant-design/icons';
import { PickerResult } from '../../../types';
interface IProps {
    onClose: () => void;
    onConfirm: (result: PickerResult) => Promise<void>;
    getResult: () => {
        extend?: Record<string, string>;
        listMap?: Record<string, Record<string, Record<string, string>>>;
    };
}
function Footer({ onClose, onConfirm, getResult }: IProps) {
    const { okText, cancelText, langConfig, selectedData } = useContext(PickerContext);
    // const { okText, cancelText, langConfig } = state;
    const [loading, setLoading] = useState(false);
    const handleOk = useCallback(async () => {
        if (selectedData?.length === 0) {
            return;
        }
        setLoading(true);
        const { extend, listMap } = getResult();
        const items = selectedData.map((item) => {
            return Object.assign(item, { extend: listMap?.[getId(item)]?.extend });
        });
        await onConfirm({
            action: 'confirm',
            data: { items, extend },
        });
        setLoading(false);
    }, [getResult, onConfirm, selectedData]);
    return (
        <div className="ee-contacts-picker__footer">
            <div className="ee-contacts-picker__btn cancel" onClick={onClose}>
                {cancelText || langConfig.cancel}
            </div>
            <div
                className={`ee-contacts-picker__btn ok ${selectedData?.length === 0 ? 'btn-disable' : ''}`}
                onClick={handleOk}
            >
                {loading && <LoadingOutlined style={{ marginRight: '5px' }} />}
                {okText || langConfig.confirm}
            </div>
        </div>
    );
}
export default Footer;
