import React from 'react';
import Svg, {Circle, Ellipse, Path, Rect, G, Defs, LinearGradient, Stop, Text} from 'react-native-svg';

export default function Illustration({step,width,height}) {
  const teal='url(#teal)';
  // Match the traveler's 214-unit silhouette around each drawing's own center.
  const sceneScale = step === 1 ? 214 / 234 : step === 2 ? 214 / 208 : 1;
  const sceneTransform = `translate(130 0) scale(${sceneScale} 1) translate(-130 0)`;
  return <Svg width={width} height={height} viewBox={step<0?'0 0 100 84':'0 0 260 190'}>
    <Defs><LinearGradient id="teal" x1="0%" x2="80%" y1="0%" y2="100%">
      <Stop offset="0" stopColor="#81e6dd"/><Stop offset=".48" stopColor="#21bcb2"/><Stop offset="1" stopColor="#00827c"/>
    </LinearGradient></Defs>
    {step<0 ? <><Circle cx="41" cy="36" r="32" fill={teal}/><Circle cx="69" cy="58" r="22" fill={teal} stroke="#b4ede7" strokeWidth="1.3"/></> : <G transform={sceneTransform}>
      <Ellipse cx="130" cy="168" rx="104" ry="9" fill="#d7f2ef"/>
      {step===0 && <>
        <Path d="M21 155V131H36V101H43L48 62L54 101H62V143H78V119H91V155H225V164H21Z" fill="#ade2df"/>
        <Circle cx="117" cy="73" r="19" fill="#e9aa7e"/><Path d="M99 82Q84 56 107 50Q123 40 133 53Q151 56 134 66L125 64L123 78L116 72L112 85Z" fill="#13384a"/>
        <Path d="M111 87L126 89L128 103L113 108Z" fill="#dc986c"/>
        <Path d="M77 161Q75 111 102 96Q115 91 130 103L144 131L128 140L124 163Z" fill={teal}/>
        <Rect x="65" y="109" width="32" height="53" rx="12" fill="#087c79"/><Rect x="61" y="133" width="24" height="23" rx="7" fill="#149590"/>
        <Path d="M135 133Q145 142 166 114" fill="none" stroke="#e9aa7e" strokeWidth="11" strokeLinecap="round"/>
        <Path d="M161 118L167 96L179 96L171 118Z" fill="#193e49"/>
        <Path d="M161 69L164 57A24 24 0 1 1 179 65Z" fill={teal}/><Text x="184" y="53" fill="white" fontSize="25" textAnchor="middle">A</Text>
        <Circle cx="218" cy="82" r="17" fill="#009c93"/><Text x="218" y="89" fill="white" fontSize="20" textAnchor="middle">あ</Text>
      </>}
      {step===1 && <>
        <Circle cx="130" cy="93" r="76" fill="#e3f8f6"/><Circle cx="130" cy="93" r="59" fill="#c7efeb"/>
        {[10,23,39,19,11].map((h,i)=><G key={i} fill="#64d9d3"><Rect x={13+i*9} y={93-h/2} width="4" height={h} rx="2"/><Rect x={243-i*9} y={93-h/2} width="4" height={h} rx="2"/></G>)}
        <Circle cx="130" cy="93" r="49" fill={teal}/><Rect x="121" y="65" width="18" height="36" rx="9" fill="white"/>
        <Path d="M113 92 Q113 111 130 111 Q147 111 147 92 M130 112V123" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round"/>
      </>}
      {step===2 && <>
        <Circle cx="116" cy="117" r="50" fill={teal}/><Path d="M76 90L91 76L105 70L114 79L104 87L107 95L96 98L100 109L85 106Z M97 114L111 116L120 129L113 140L108 158L102 149L104 137L95 130Z M135 78L151 91L156 106L145 110L137 102L125 104L122 95Z" fill="#b4e9df"/>
        <Path d="M140 130L164 121L186 127L213 117L225 155L197 165L174 158L150 167Z" fill="#a5dfdc"/><Path d="M163 124L174 158M186 128L197 164M145 147L178 138L199 145L218 136" stroke="#edfbfa" strokeWidth="3" fill="none"/>
        <Path d="M184 93C163 69 175 53 186 53C201 53 208 69 184 93Z" fill="#ed5360"/><Circle cx="186" cy="67" r="5" fill="white"/>
        <Path d="M44 90Q54 61 90 56" stroke="#92d4d0" strokeDasharray="3 6" fill="none" strokeWidth="2"/>
        <Path d="M65 47L80 49L113 38L91 24L99 20L133 31L163 20Q182 16 177 25L144 43L126 66L116 69L124 48L86 59L64 51Z" fill={teal}/>
      </>}
    </G>}
  </Svg>;
}
