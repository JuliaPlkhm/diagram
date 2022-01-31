import React from 'react';

const headStyle = {
    borderRadius: '10px 10px 0px 0px', padding: '7px',
    display: 'inline-block',
    backgroundColor: 'rgb(120 193 245)',
    display: 'flex'
};
const headText ={
    margin: '0 auto',
    textAlign: 'center',
    fontSize: '13px',
    fontWeight: 'bold'
}
const mainStyle = {
    padding: '5px',
    display: 'inline-block',
    backgroundColor: 'rgb(237 237 237)'
};

export const Block = ({ name, note, src }) => {
    return (
        < >
            <div style={headStyle}>
               <img src= {`${src}`} style={{marginRight: '8px'}} /> 
               <p style={headText}>{name}</p>
            </div>
            <div style={mainStyle}>
                {note}
            </div>
        </>
    )
}