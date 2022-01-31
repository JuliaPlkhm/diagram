import React from 'react';
import Xarrow from 'react-xarrows';

export const Arrow = ({ start, end }) => {
    return (
        <Xarrow headSize={9} strokeWidth={1} path={'straight'} color={'black'}
            start={start} end={end} />
    )
}