import React from 'react';
import { UseSelectionProps } from '../../types';
import useExpandClick from '../hooks/useExpandClick';
import useItemClick from '../hooks//useItemClick';
import useLoadTabData from '../hooks/useLoadTabData';

export default function useSelection(props: UseSelectionProps) {
    const onExpandClick = useExpandClick(props);
    const onItemClick = useItemClick();
    const loadTabData = useLoadTabData(props);

    return {
        loadTabData,
        onItemClick,
        onExpandClick,
    };
}
