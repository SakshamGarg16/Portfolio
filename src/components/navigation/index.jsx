"use client"
import { BtnList } from '@/app/data';
import React from 'react'
import NavBtn from './NavBtn';

const Navigation = () => {
    const angleIncrease = 360/BtnList.length;
  return (
    <div className='w-full fixed h-screen flex items-center justify-center'> 
        <div className='flex justify-between items-center relative text-white animate-spin-slow'>
        {
            BtnList.map((item,index)=>{

                const angle = (index * angleIncrease * Math.PI)/180
                const radius = `clamp(15rem, 25vw, 30rem)`; 
                const x = `calc(${radius} * ${Math.cos(angle)} )`;
                const y = `calc(${radius} * ${Math.sin(angle)} )`;

                return <NavBtn key={item.label} x={x} y={y} {...item}/>
            })

            }
    </div>
    </div>
  )
}

export default Navigation