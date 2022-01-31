import React from 'react';
import { Block } from './Block';

const names = ['Удалено', 'Создание и модификация', 'Производство и эксплуатация', 'Аннулировано', 'Персональный объект', 'Согласование и утверждение', 'Хранение', 'Импортировано', 'Ожидание погашения посредством ИИ', ]

const Sidebar = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside>
      <p className="description">Палитра</p>
      {names.map((el)=> <div className='block block-sidebar' draggable onDragStart={(event) => onDragStart(event, `${el}`)} style={{ display: 'flex', flexDirection: "column"}}>
        <Block name ={el}></Block>
      </div>)}
    </aside>
  );
};
export default Sidebar